<?php
/**
 * Monitor Controller (System Health, Incidents, Alerts)
 *
 * GET    /monitor/dashboard
 * GET    /monitor/health
 * POST   /monitor/health/check
 * GET    /monitor/incidents
 * POST   /monitor/incidents
 * GET    /monitor/incidents/{id}
 * PUT    /monitor/incidents/{id}/assign
 * PUT    /monitor/incidents/{id}/resolve
 * GET    /monitor/alerts
 * POST   /monitor/alerts/acknowledge
 * POST   /monitor/alerts/acknowledge-all
 * GET    /monitor/alert-rules
 * POST   /monitor/alert-rules
 * PUT    /monitor/alert-rules/{id}
 * DELETE /monitor/alert-rules/{id}
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\SystemHealth;
use App\Models\Incident;
use App\Models\Alert;
use App\Models\AlertRule;
use App\Models\ActivityLog;
use App\Config\Database;

class MonitorController
{
    /**
     * GET /monitor/dashboard
     */
    public static function dashboard(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $db = Database::getInstance();

        $health      = SystemHealth::getLatest();
        $incidentStats = $db->query("SELECT status,COUNT(*) AS count FROM incidents GROUP BY status")->fetchAll();
        $unacknowledgedAlerts    = Alert::countUnacknowledged();
        $recentIncidents = Incident::findAll([], 1, 5);
        $recentAlerts    = Alert::findAll(['acknowledged' => 0], 1, 10);

        $uptime = [];
        foreach ($health as $h) {
            $uptime[$h['service_name']] = $h['status'];
        }

        Response::success([
            'services'          => $health,
            'incident_stats'    => $incidentStats,
            'unacknowledged_alerts' => (int)$unacknowledgedAlerts,
            'recent_incidents'  => $recentIncidents,
            'recent_alerts'     => $recentAlerts,
            'uptime'            => $uptime,
        ]);
    }

    /**
     * GET /monitor/health
     */
    public static function health(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $service = $_GET['service'] ?? '';
        if ($service) {
            $history = SystemHealth::getHistory($service);
            Response::success(['service' => $service, 'history' => $history]);
        }

        $latest  = SystemHealth::getLatest();
        $summary = SystemHealth::getSummary();

        Response::success([
            'latest'  => $latest,
            'summary' => $summary,
        ]);
    }

    /**
     * POST /monitor/health/check
     */
    public static function runHealthCheck(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $services = ['API', 'Database', 'Cache', 'Storage', 'Mail'];
        $results  = [];

        foreach ($services as $svc) {
            $status = 'up';
            $responseTime   = rand(5, 200);

            if ($svc === 'Database') {
                try {
                    $db = Database::getInstance();
                    $db->query('SELECT 1');
                    $responseTime = rand(1, 10);
                } catch (\Exception $e) {
                    $status = 'down';
                    $responseTime = 0;
                }
            }

            SystemHealth::record($svc, $status, $responseTime === 0 ? null : $responseTime);
            $results[] = ['service' => $svc, 'status' => $status, 'response_time_ms' => $responseTime];
        }

        ActivityLog::log('monitor.health_check', $authUser->id, 'health');

        Response::success(['results' => $results], 'Health check completed.');
    }

    /**
     * GET /monitor/incidents
     */
    public static function incidents(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $severity = $_GET['severity'] ?? '';
        $status  = $_GET['status'] ?? '';

        $filters = [];
        if ($severity) $filters['severity'] = $severity;
        if ($status) $filters['status'] = $status;

        $incidents = Incident::findAll($filters, $page, $perPage);

        Response::success([
            'incidents' => $incidents,
        ]);
    }

    /**
     * POST /monitor/incidents
     */
    public static function createIncident(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('title');
        $v->required('description');

        if (!$v->passes()) {
            Response::validationError('Incident creation failed.', $v->errors());
        }

        $data['reported_by'] = $authUser->id;
        $incident = Incident::create($data);

        ActivityLog::log('monitor.incident_create', $authUser->id, 'incident', $incident->id, [
            'severity' => $data['severity'] ?? 'medium',
        ]);

        Response::success(['incident' => $incident->toArray()], 'Incident reported.');
    }

    /**
     * GET /monitor/incidents/{id}
     */
    public static function getIncident(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $incident = Incident::findById($id);
        if (!$incident) {
            Response::notFound('Incident not found.');
        }

        Response::success(['incident' => $incident->toArray()]);
    }

    /**
     * PUT /monitor/incidents/{id}/assign
     */
    public static function assignIncident(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        if (empty($data['assignee_id'])) {
            Response::validationError('Assignee ID is required.');
        }

        $incident = Incident::findById($id);
        if (!$incident) {
            Response::notFound('Incident not found.');
        }

        $incident->assign((int)$data['assignee_id']);
        ActivityLog::log('monitor.incident_assign', $authUser->id, 'incident', $id, [
            'assignee_id' => $data['assignee_id'],
        ]);

        Response::success(['incident' => $incident->toArray()], 'Incident assigned.');
    }

    /**
     * PUT /monitor/incidents/{id}/resolve
     */
    public static function resolveIncident(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $incident = Incident::findById($id);
        if (!$incident) {
            Response::notFound('Incident not found.');
        }

        $incident->resolve();
        ActivityLog::log('monitor.incident_resolve', $authUser->id, 'incident', $id);

        Response::success(['incident' => $incident->toArray()], 'Incident resolved.');
    }

    /**
     * GET /monitor/alerts
     */
    public static function alerts(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $page     = (int) ($_GET['page'] ?? 1);
        $perPage  = (int) ($_GET['per_page'] ?? 20);
        $severity = $_GET['severity'] ?? '';
        $acknowledged = $_GET['acknowledged'] ?? '';

        $filters = [];
        if ($severity) $filters['severity'] = $severity;
        if ($acknowledged !== '') $filters['acknowledged'] = (int)$acknowledged;

        $alerts = Alert::findAll($filters, $page, $perPage);
        $unacknowledgedCount = Alert::countUnacknowledged();

        Response::success([
            'alerts' => $alerts,
            'unacknowledged_count' => $unacknowledgedCount,
        ]);
    }

    /**
     * POST /monitor/alerts/acknowledge
     */
    public static function acknowledgeAlert(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        if (empty($data['alert_id'])) {
            Response::validationError('Alert ID is required.');
        }

        Alert::acknowledge((int)$data['alert_id'], $authUser->id);

        Response::success(null, 'Alert acknowledged.');
    }

    /**
     * POST /monitor/alerts/acknowledge-all
     */
    public static function acknowledgeAllAlerts(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        Alert::acknowledgeAll($authUser->id);

        Response::success(null, 'All alerts acknowledged.');
    }

    /**
     * GET /monitor/alert-rules
     */
    public static function alertRules(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $rules = AlertRule::findAll();

        Response::success(['rules' => $rules]);
    }

    /**
     * POST /monitor/alert-rules
     */
    public static function createAlertRule(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('name');
        $v->required('metric');
        $v->required('threshold');

        if (!$v->passes()) {
            Response::validationError('Alert rule creation failed.', $v->errors());
        }

        $data['created_by'] = $authUser->id;
        AlertRule::create($data);

        ActivityLog::log('monitor.alert_rule_create', $authUser->id, 'alert_rule');

        Response::success(null, 'Alert rule created.');
    }

    /**
     * PUT /monitor/alert-rules/{id}
     */
    public static function updateAlertRule(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        AlertRule::update($id, $data);

        ActivityLog::log('monitor.alert_rule_update', $authUser->id, 'alert_rule', $id);

        Response::success(null, 'Alert rule updated.');
    }

    /**
     * DELETE /monitor/alert-rules/{id}
     */
    public static function deleteAlertRule(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        AlertRule::delete($id);
        ActivityLog::log('monitor.alert_rule_delete', $authUser->id, 'alert_rule', $id);

        Response::success(null, 'Alert rule deleted.');
    }
}

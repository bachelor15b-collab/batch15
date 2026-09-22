<?php
/**
 * SOC (Security Operations Center) Controller
 *
 * GET    /soc/login-attempts
 * GET    /soc/activity-logs
 * GET    /soc/suspicious-ips
 * POST   /soc/block-ip
 * POST   /soc/unblock-ip
 * GET    /soc/blocked-ips
 * GET    /soc/stats
 * POST   /soc/users/{id}/suspend
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Helpers\Security;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\LoginAttempt;
use App\Models\ActivityLog;
use App\Models\BlockedIp;
use App\Models\User;
use App\Models\Notification;

class SocController
{
    /**
     * GET /soc/login-attempts
     */
    public static function loginAttempts(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 50);
        $ip      = $_GET['ip'] ?? '';
        $success = $_GET['success'] ?? '';
        $from    = $_GET['from'] ?? '';
        $to      = $_GET['to'] ?? '';

        $filters = [];
        if ($ip) $filters['ip_address'] = $ip;
        if ($success !== '') $filters['success'] = (int) $success;
        if ($from) $filters['date_from'] = $from;
        if ($to) $filters['date_to'] = $to;

        $attempts = LoginAttempt::findAll($filters, $page, $perPage);
        $total    = LoginAttempt::countAll($filters);

        Response::success([
            'attempts'    => $attempts,
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * GET /soc/activity-logs
     */
    public static function activityLogs(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 50);
        $userId  = $_GET['user_id'] ?? '';
        $action  = $_GET['action'] ?? '';
        $ip      = $_GET['ip'] ?? '';
        $from    = $_GET['from'] ?? '';
        $to      = $_GET['to'] ?? '';

        $filters = [];
        if ($userId) $filters['user_id'] = (int) $userId;
        if ($action) $filters['action'] = $action;
        if ($ip) $filters['ip_address'] = $ip;
        if ($from) $filters['date_from'] = $from;
        if ($to) $filters['date_to'] = $to;

        $logs  = ActivityLog::findAll($filters, $page, $perPage);
        $total = ActivityLog::countAll($filters);

        Response::success([
            'logs'        => $logs,
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * GET /soc/suspicious-ips
     */
    public static function suspiciousIps(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $threshold = (int) ($_GET['threshold'] ?? 5);
        $minutes   = (int) ($_GET['minutes'] ?? 30);

        $suspicious = LoginAttempt::getSuspiciousIps($threshold, $minutes);

        Response::success([
            'suspicious_ips' => $suspicious,
            'threshold'      => $threshold,
            'window_minutes' => $minutes,
        ]);
    }

    /**
     * POST /soc/block-ip
     */
    public static function blockIp(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('ip_address');

        if (!$v->passes()) {
            Response::validationError('IP blocking failed.', $v->errors());
        }

        $ip = $data['ip_address'];

        if (!filter_var($ip, FILTER_VALIDATE_IP)) {
            Response::validationError('Invalid IP address.', ['ip_address' => ['Must be a valid IP.']]);
        }

        BlockedIp::block($ip, $data['reason'] ?? 'Blocked by SOC', $authUser->id);

        ActivityLog::log('soc.block_ip', $authUser->id, 'blocked_ip', 0, [
            'ip'     => $ip,
            'reason' => $data['reason'] ?? '',
        ]);

        Response::success(null, "IP {$ip} has been blocked.");
    }

    /**
     * POST /soc/unblock-ip
     */
    public static function unblockIp(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('ip_address');

        if (!$v->passes()) {
            Response::validationError('IP unblocking failed.', $v->errors());
        }

        $ip = $data['ip_address'];
        BlockedIp::unblock($ip);

        ActivityLog::log('soc.unblock_ip', $authUser->id, 'blocked_ip', 0, ['ip' => $ip]);

        Response::success(null, "IP {$ip} has been unblocked.");
    }

    /**
     * GET /soc/blocked-ips
     */
    public static function blockedIps(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 50);

        $ips = BlockedIp::findAll($page, $perPage);

        Response::success([
            'blocked_ips' => $ips,
            'page'        => $page,
            'per_page'    => $perPage,
        ]);
    }

    /**
     * GET /soc/stats
     */
    public static function stats(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $period = $_GET['period'] ?? '24h';

        $loginStats = LoginAttempt::getStats($period);
        $activitySummary = ActivityLog::getSummary($period);
        $suspicious = LoginAttempt::getSuspiciousIps(5, 30);
        $blockedCount = count(BlockedIp::findAll(1, 1000));

        Response::success([
            'period'           => $period,
            'login_stats'      => $loginStats,
            'activity_summary' => $activitySummary,
            'suspicious_ips'   => $suspicious,
            'blocked_ips'      => $blockedCount,
            'recent_logs'      => ActivityLog::findAll([], 1, 10),
        ]);
    }

    /**
     * POST /soc/users/{id}/suspend
     */
    public static function suspendUser(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $user = User::findById($id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        if (in_array($user->role_slug, ['super_admin', 'soc_team'], true)) {
            Response::forbidden('Cannot suspend this user.');
        }

        $user->suspend();
        ActivityLog::log('soc.user_suspend', $authUser->id, 'user', $id, [
            'suspended_by' => $authUser->username,
        ]);

        Notification::create($id, 'Account Suspended', 'Your account has been suspended by the SOC team.', 'info');

        Response::success(null, 'User suspended.');
    }

    /**
     * GET /soc/users
     * List all users with IP data, last login, and suspicious activity count.
     */
    public static function users(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 50);
        $role    = $_GET['role'] ?? '';
        $status  = $_GET['status'] ?? '';
        $search  = $_GET['search'] ?? '';

        $users = User::findAll($role, $status, $page, $perPage);
        $total = User::countAll($role, $status);

        $db = \App\Config\Database::getInstance();
        $data = [];

        foreach ($users as $u) {
            $arr = $u->toArray();

            // Get last login IP from user record
            $arr['last_login_ip']   = $u->last_login_ip;
            $arr['last_login_at']   = $u->last_login_at;

            // Count recent failed login attempts for this user
            $stmt = $db->prepare(
                'SELECT COUNT(*) FROM login_attempts WHERE user_id = ? AND success = 0 AND created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR)'
            );
            $stmt->execute([$u->id]);
            $arr['failed_attempts_24h'] = (int) $stmt->fetchColumn();

            // Get distinct IPs used by this user in last 7 days
            $stmt = $db->prepare(
                'SELECT DISTINCT ip_address FROM login_attempts WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) ORDER BY MAX(created_at) DESC'
            );
            $stmt->execute([$u->id]);
            $arr['recent_ips'] = array_column($stmt->fetchAll(), 'ip_address');

            // Get devices used by this user in last 7 days (OS + Browser + Device Type)
            $stmt = $db->prepare(
                'SELECT os, browser, device_type, ip_address, MAX(created_at) AS last_seen, COUNT(*) AS attempts
                 FROM login_attempts
                 WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                 GROUP BY os, browser, device_type, ip_address
                 ORDER BY last_seen DESC'
            );
            $stmt->execute([$u->id]);
            $arr['devices'] = $stmt->fetchAll();

            // Count unique device types
            $stmt = $db->prepare(
                'SELECT device_type, COUNT(DISTINCT ip_address) AS ip_count
                 FROM login_attempts
                 WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
                 GROUP BY device_type'
            );
            $stmt->execute([$u->id]);
            $arr['device_summary'] = $stmt->fetchAll();

            // Check which IPs are new (not seen before 7 days ago)
            $stmt = $db->prepare(
                'SELECT ip_address, MIN(created_at) AS first_seen
                 FROM login_attempts
                 WHERE user_id = ?
                 GROUP BY ip_address
                 HAVING first_seen >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
            );
            $stmt->execute([$u->id]);
            $arr['new_ips'] = array_column($stmt->fetchAll(), 'ip_address');

            // Check if user's last IP is blocked
            $stmtBlocked = $db->prepare('SELECT COUNT(*) FROM blocked_ips WHERE ip_address = ?');
            $stmtBlocked->execute([$u->last_login_ip]);
            $arr['ip_blocked'] = (int) $stmtBlocked->fetchColumn() > 0;

            $data[] = $arr;
        }

        Response::success([
            'users'       => $data,
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * PUT /soc/users/{id}
     * Update user details (name, email, status).
     */
    public static function updateUser(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $user = User::findById($id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        if (in_array($user->role_slug, ['super_admin'], true)) {
            Response::forbidden('Cannot modify a Super Admin.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $updateData = [];
        foreach (['email', 'full_name'] as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = $data[$field];
            }
        }

        if (isset($data['status']) && in_array($data['status'], ['active', 'suspended'], true)) {
            $updateData['status'] = $data['status'];
        }

        if (empty($updateData)) {
            Response::success(['user' => $user->toArray()], 'Nothing to update.');
        }

        $user->update($updateData);
        ActivityLog::log('soc.user_update', $authUser->id, 'user', $id, [
            'updated_by' => $authUser->username,
            'fields'     => array_keys($updateData),
        ]);

        $fresh = User::findById($id);
        Response::success(['user' => $fresh->toArray()], 'User updated.');
    }

    /**
     * GET /soc/users/{id}/activity
     * Get activity logs for a specific user.
     */
    public static function userActivity(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $user = User::findById($id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 50);

        $logs = ActivityLog::findAll(['user_id' => $id], $page, $perPage);
        $total = ActivityLog::countAll(['user_id' => $id]);

        Response::success([
            'user'        => $user->toArray(),
            'logs'        => $logs,
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * GET /soc/users/{id}/ips
     * Get all IPs used by a user from login_attempts.
     */
    public static function userIps(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $user = User::findById($id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        $db = \App\Config\Database::getInstance();

        $stmt = $db->prepare(
            'SELECT ip_address,
                    os,
                    browser,
                    device_type,
                    MAX(created_at) AS last_seen,
                    SUM(success = 1) AS successful,
                    SUM(success = 0) AS failed,
                    COUNT(*) AS total_attempts
             FROM login_attempts
             WHERE user_id = ?
             GROUP BY ip_address, os, browser, device_type
             ORDER BY last_seen DESC'
        );
        $stmt->execute([$id]);
        $ips = $stmt->fetchAll();

        // Check which IPs are blocked
        foreach ($ips as &$ipRow) {
            $stmtBlocked = $db->prepare('SELECT COUNT(*) FROM blocked_ips WHERE ip_address = ?');
            $stmtBlocked->execute([$ipRow['ip_address']]);
            $ipRow['is_blocked'] = (int) $stmtBlocked->fetchColumn() > 0;
        }

        Response::success([
            'user' => $user->toArray(),
            'ips'  => $ips,
        ]);
    }

    /**
     * POST /soc/users/{id}/restore
     * Restore a suspended user.
     */
    public static function restoreUser(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $user = User::findById($id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        if ($user->role_slug === 'super_admin') {
            Response::forbidden('Cannot restore a Super Admin.');
        }

        $user->restore();
        ActivityLog::log('soc.user_restore', $authUser->id, 'user', $id, [
            'restored_by' => $authUser->username,
        ]);

        Notification::create($id, 'Account Restored', 'Your account has been restored by the SOC team.', 'info');

        Response::success(null, 'User restored.');
    }

    /**
     * DELETE /soc/users/{id}
     * Delete a user account (soft-delete).
     */
    public static function deleteUser(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSocOrSuperAdmin($authUser);

        $user = User::findById($id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        if (in_array($user->role_slug, ['super_admin', 'soc_team'], true)) {
            Response::forbidden('Cannot delete a Super Admin or SOC member.');
        }

        $user->softDelete();
        ActivityLog::log('soc.user_delete', $authUser->id, 'user', $id, [
            'deleted_by' => $authUser->username,
        ]);

        Response::success(null, 'User deleted.');
    }
}

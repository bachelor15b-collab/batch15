<?php
/**
 * Sports Controller
 *
 * GET    /sports/dashboard
 * GET    /sports/teams
 * POST   /sports/teams
 * GET    /sports/teams/{id}
 * PUT    /sports/teams/{id}
 * POST   /sports/teams/{id}/members
 * DELETE /sports/teams/{id}/members/{userId}
 * GET    /sports/events
 * POST   /sports/events
 * GET    /sports/events/{id}
 * PUT    /sports/events/{id}/score
 * PUT    /sports/events/{id}/status
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\SportsTeam;
use App\Models\TeamMember;
use App\Models\SportsEvent;
use App\Models\ActivityLog;
use App\Models\Notification;
use App\Config\Database;

class SportsController
{
    /**
     * GET /sports/dashboard
     */
    public static function dashboard(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $db = Database::getInstance();

        $teamCount  = $db->query("SELECT COUNT(*) FROM sports_teams WHERE status='active'")->fetchColumn();
        $eventCount = $db->query("SELECT COUNT(*) FROM sports_events")->fetchColumn();
        $upcomingCount = $db->query("SELECT COUNT(*) FROM sports_events WHERE event_date >= NOW() AND status='scheduled'")->fetchColumn();
        $sportTypes     = $db->query('SELECT DISTINCT sport_type FROM sports_teams ORDER BY sport_type')->fetchAll(\PDO::FETCH_COLUMN);

        Response::success([
            'total_teams'      => (int)$teamCount,
            'total_events'     => (int)$eventCount,
            'upcoming_events'  => (int)$upcomingCount,
            'sport_types'      => $sportTypes,
        ]);
    }

    /**
     * GET /sports/teams
     */
    public static function teams(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $sportType   = $_GET['sport_type'] ?? '';

        $filters = [];
        if ($sportType) $filters['sport_type'] = $sportType;

        $teams = SportsTeam::findAll($filters, $page, $perPage);

        Response::success([
            'teams' => array_map(fn($t) => $t->toArray(), $teams),
        ]);
    }

    /**
     * POST /sports/teams
     */
    public static function createTeam(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('name');
        $v->required('sport_type');

        if (!$v->passes()) {
            Response::validationError('Team creation failed.', $v->errors());
        }

        $team = SportsTeam::create($data);
        ActivityLog::log('sports.team_create', $authUser->id, 'sports_team', $team->id);

        Response::success(['team' => $team->toArray()], 'Team created.');
    }

    /**
     * GET /sports/teams/{id}
     */
    public static function getTeam(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        $team     = SportsTeam::findById($id);

        if (!$team) {
            Response::notFound('Team not found.');
        }

        $members = TeamMember::findByTeam($id);

        Response::success([
            'team'    => $team->toArray(),
            'members' => $members,
        ]);
    }

    /**
     * PUT /sports/teams/{id}
     */
    public static function updateTeam(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $team = SportsTeam::findById($id);
        if (!$team) {
            Response::notFound('Team not found.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $team->update($data);

        ActivityLog::log('sports.team_update', $authUser->id, 'sports_team', $id);

        Response::success(['team' => $team->toArray()], 'Team updated.');
    }

    /**
     * POST /sports/teams/{id}/members
     */
    public static function addTeamMember(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('user_id')->integer('user_id');

        if (!$v->passes()) {
            Response::validationError('Adding member failed.', $v->errors());
        }

        $team = SportsTeam::findById($id);
        if (!$team) {
            Response::notFound('Team not found.');
        }

        TeamMember::addMember($id, (int)$data['user_id'], $data['role'] ?? 'player');

        ActivityLog::log('sports.team_add_member', $authUser->id, 'sports_team', $id, [
            'user_id' => $data['user_id'],
        ]);

        Response::success(null, 'Member added to team.');
    }

    /**
     * DELETE /sports/teams/{id}/members/{userId}
     */
    public static function removeTeamMember(int $id, int $userId): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        TeamMember::removeMember($id, $userId);

        ActivityLog::log('sports.team_remove_member', $authUser->id, 'sports_team', $id, [
            'user_id' => $userId,
        ]);

        Response::success(null, 'Member removed from team.');
    }

    /**
     * GET /sports/events
     */
    public static function events(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $sportType   = $_GET['sport_type'] ?? '';
        $status  = $_GET['status'] ?? '';

        $filters = [];
        if ($sportType) $filters['sport_type'] = $sportType;
        if ($status) $filters['status'] = $status;

        $events = SportsEvent::findAll($filters, $page, $perPage);

        Response::success([
            'events' => array_map(fn($e) => $e->toArray(), $events),
        ]);
    }

    /**
     * POST /sports/events
     */
    public static function createEvent(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('title');
        $v->required('sport_type');
        $v->required('event_date');

        if (!$v->passes()) {
            Response::validationError('Event creation failed.', $v->errors());
        }

        $data['created_by'] = $authUser->id;
        $event = SportsEvent::create($data);

        ActivityLog::log('sports.event_create', $authUser->id, 'sports_event', $event->id);

        Response::success(['event' => $event->toArray()], 'Event created.');
    }

    /**
     * GET /sports/events/{id}
     */
    public static function getEvent(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        $event    = SportsEvent::findById($id);

        if (!$event) {
            Response::notFound('Event not found.');
        }

        Response::success(['event' => $event->toArray()]);
    }

    /**
     * PUT /sports/events/{id}/score
     */
    public static function updateEventScore(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('team1_score');
        $v->required('team2_score');

        if (!$v->passes()) {
            Response::validationError('Score update failed.', $v->errors());
        }

        $event = SportsEvent::findById($id);
        if (!$event) {
            Response::notFound('Event not found.');
        }

        $event->updateScore((int)$data['team1_score'], (int)$data['team2_score']);
        $event->updateStatus('completed');

        ActivityLog::log('sports.event_score', $authUser->id, 'sports_event', $id, [
            'team1_score' => $data['team1_score'],
            'team2_score' => $data['team2_score'],
        ]);

        Response::success(['event' => $event->toArray()], 'Score updated.');
    }

    /**
     * PUT /sports/events/{id}/status
     */
    public static function updateEventStatus(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        if (empty($data['status'])) {
            Response::validationError('Status is required.');
        }

        $event = SportsEvent::findById($id);
        if (!$event) {
            Response::notFound('Event not found.');
        }

        $event->updateStatus($data['status']);

        Response::success(['event' => $event->toArray()], 'Event status updated.');
    }
}

<?php
/**
 * User Controller
 *
 * GET    /users
 * GET    /users/{id}
 * PUT    /users/{id}
 * GET    /users/leaderboard
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Helpers\Security;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\User;
use App\Models\UserXp;
use App\Models\ActivityLog;
use App\Models\StudentClaim;

class UserController
{
    /**
     * GET /users
     */
    public static function index(): never
    {
        $authUser = AuthMiddleware::authenticate();
        if (!RoleMiddleware::hasAnyRole($authUser, ['super_admin', 'admin_educational', 'admin_general', 'teacher'])) {
            Response::forbidden();
        }

        $page     = (int) ($_GET['page'] ?? 1);
        $perPage  = (int) ($_GET['per_page'] ?? 20);
        $role     = $_GET['role'] ?? '';
        $status   = $_GET['status'] ?? '';

        $users = User::findAll($role, $status, $page, $perPage);
        $total = User::countAll($role, $status);

        $data = array_map(fn(User $u) => $u->toArray(), $users);

        Response::success([
            'users'       => $data,
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * GET /users/{id}
     */
    public static function show(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $user = User::findById($id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        // Users can only view their own profile unless admin
        if ($authUser->id !== $id && !RoleMiddleware::hasAnyRole($authUser, ['super_admin', 'soc_team'])) {
            Response::forbidden();
        }

        $data = $user->toArray();
        $data['xp'] = UserXp::getRank($id);

        Response::success(['user' => $data]);
    }

    /**
     * PUT /users/{id}
     */
    public static function update(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $user = User::findById($id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        // Only self or super admin
        if ($authUser->id !== $id && $authUser->role_slug !== 'super_admin') {
            Response::forbidden();
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        if (isset($data['email'])) {
            $v->email('email')->max('email', 255);
        }
        if (isset($data['full_name'])) {
            $v->max('full_name', 120);
        }
        if (isset($data['password'])) {
            $v->min('password', 8)->max('password', 128);
        }

        if (!$v->passes()) {
            Response::validationError('Update failed.', $v->errors());
        }

        $updateData = [];
        foreach (['email', 'full_name', 'avatar_url'] as $field) {
            if (isset($data[$field])) {
                $updateData[$field] = $data[$field];
            }
        }
        if (isset($data['password'])) {
            $updateData['password'] = $data['password'];
        }

        if (empty($updateData)) {
            Response::success(['user' => $user->toArray()], 'Nothing to update.');
        }

        $user->update($updateData);
        ActivityLog::log('user.update', $authUser->id, 'user', $id);

        $fresh = User::findById($id);
        Response::success(['user' => $fresh->toArray()], 'Profile updated.');
    }

    /**
     * GET /users/leaderboard
     */
    public static function leaderboard(): never
    {
        $limit = min((int) ($_GET['limit'] ?? 20), 100);
        $board = UserXp::getLeaderboard($limit);

        // Add rank
        $rank = 1;
        foreach ($board as &$entry) {
            $entry['rank'] = $rank++;
        }

        // Get current user's rank if authenticated
        $sessionUser = AuthMiddleware::optional();
        $myRank = null;
        if ($sessionUser) {
            $myRank = UserXp::getRank($sessionUser->id);
        }

        Response::success([
            'leaderboard' => $board,
            'my_rank'     => $myRank,
        ]);
    }

    /**
     * POST /users/xp/award
     */
    public static function awardXp(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['admin_educational', 'super_admin', 'admin_general']);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('user_id')->integer('user_id');
        $v->required('xp')->integer('xp');
        $v->required('reason');

        if (!$v->passes()) {
            Response::validationError('XP award failed.', $v->errors());
        }

        $userId = (int) $data['user_id'];
        $xp     = (int) $data['xp'];

        if ($xp < 1 || $xp > 10000) {
            Response::validationError('XP must be between 1 and 10,000.', ['xp' => ['Invalid XP amount.']]);
        }

        $user = User::findById($userId);
        if (!$user) {
            Response::notFound('User not found.');
        }

        UserXp::award($userId, $xp);

        ActivityLog::log('xp.award', $authUser->id, 'user_xp', $userId, [
            'xp'      => $xp,
            'reason'  => $data['reason'],
        ]);

        $updated = UserXp::getRank($userId);

        Response::success([
            'user'  => $user->toArray(),
            'xp'    => $updated,
        ], "Awarded {$xp} XP to {$user->full_name}.");
    }

    /**
     * GET /users/messaging
     * Lightweight user list for messaging — any authenticated user can access.
     */
    public static function messagingContacts(): never
    {
        $authUser = AuthMiddleware::authenticate();

        $db   = \App\Config\Database::getInstance();
        $stmt = $db->prepare('SELECT id, full_name, username, avatar_url, role_slug FROM users WHERE id != ? AND status = ? ORDER BY full_name ASC LIMIT 200');
        $stmt->execute([$authUser->id, 'active']);
        $users = $stmt->fetchAll();

        Response::success(['users' => $users]);
    }

    /**
     * POST /users/claim-student
     * User claims to be a student with their student ID. Creates or re-opens a claim.
     */
    public static function claimStudent(): never
    {
        $authUser = AuthMiddleware::authenticate();

        if ($authUser->role_slug !== 'user') {
            Response::forbidden('Only users with the basic role can claim student status.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $studentId = isset($data['student_id']) ? trim((string) $data['student_id']) : '';

        if (!$studentId) {
            Response::validationError('Student ID is required.', ['student_id' => ['Please enter your student ID.']]);
        }
        if (preg_match('/^[A-Za-z0-9_.-]{3,64}$/', $studentId) !== 1) {
            Response::validationError('Invalid student ID.', ['student_id' => ['Use 3–64 letters, numbers, dots, dashes or underscores.']]);
        }

        $existing = StudentClaim::findByUser($authUser->id);
        if ($existing && $existing->status === 'pending') {
            Response::success(['claim' => $existing->toArray()], 'You already have a pending claim.');
        }

        $conflict = StudentClaim::findPendingByStudentId($studentId, $authUser->id);
        if ($conflict) {
            Response::validationError('This student ID has already been claimed by another account.');
        }

        if ($existing && $existing->status === 'denied') {
            $existing->resubmit($studentId);
            $claim = $existing;
        } else {
            $claim = StudentClaim::create($authUser->id, $studentId);
        }

        ActivityLog::log('student_claim.submit', $authUser->id, 'student_claim', $claim->id, ['student_id' => $studentId]);
        StudentClaim::notifyReviewers($authUser, $studentId, $claim->id);

        Response::success(['claim' => $claim->toArray()], 'Your claim has been submitted. Please wait for admin approval.');
    }

    /**
     * GET /users/claim-status
     * User checks their claim status.
     */
    public static function claimStatus(): never
    {
        $authUser = AuthMiddleware::authenticate();

        $claim = StudentClaim::findByUser($authUser->id);
        if (!$claim) {
            Response::success(['claim' => null, 'can_claim' => $authUser->role_slug === 'user'], 'No claim found.');
        }

        Response::success([
            'claim'     => $claim->toArray(),
            'can_claim' => $authUser->role_slug === 'user',
        ]);
    }
}

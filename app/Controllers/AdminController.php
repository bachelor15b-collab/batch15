<?php
/**
 * Admin Controller (Super Admin operations)
 *
 * POST   /admin/assign-role
 * GET    /admin/users
 * PUT    /admin/users/{id}/suspend
 * PUT    /admin/users/{id}/restore
 * DELETE /admin/users/{id}
 * GET    /admin/config
 * PUT    /admin/config
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\User;
use App\Models\Role;
use App\Models\ActivityLog;
use App\Models\SystemConfig;
use App\Models\Notification;
use App\Models\StudentClaim;

class AdminController
{
    /**
     * POST /admin/assign-role
     * Only Super Admin can assign roles.
     */
    public static function assignRole(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general']);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('user_id')->integer('user_id');
        $v->required('role_slug');

        if (!$v->passes()) {
            Response::validationError('Role assignment failed.', $v->errors());
        }

        $userId  = (int) $data['user_id'];
        $newRole = $data['role_slug'];

        // Validate role exists
        $validRoles = Role::getAllSlugs();
        if (!in_array($newRole, $validRoles, true)) {
            Response::validationError('Invalid role.', ['role_slug' => ['Role does not exist.']]);
        }

        $user = User::findById($userId);
        if (!$user) {
            Response::notFound('User not found.');
        }

        // Cannot change the role of a Super Admin
        if ($user->role_slug === 'super_admin') {
            Response::forbidden('Cannot change the role of a Super Admin.');
        }

        // Cannot assign the Super Admin role
        if ($newRole === 'super_admin') {
            Response::forbidden('Cannot assign the Super Admin role.');
        }

        // Only a Super Admin may grant or change staff roles
        $staffRoles = ['soc_team', 'admin_financial', 'admin_educational', 'admin_general', 'admin_monitor', 'admin_sports'];
        if ($authUser->role_slug !== 'super_admin') {
            if (in_array($newRole, $staffRoles, true)) {
                Response::forbidden('Only a Super Admin can assign staff or SOC roles.');
            }
            if (in_array($user->role_slug, $staffRoles, true)) {
                Response::forbidden('Only a Super Admin can change the role of staff accounts.');
            }
        }

        $oldRole = $user->role_slug;
        $user->changeRole($newRole);

        // Log
        ActivityLog::log('admin.role_change', $authUser->id, 'user', $userId, [
            'from' => $oldRole,
            'to'   => $newRole,
        ]);

        // Notify user
        Notification::create(
            $userId,
            'Role Updated',
            "Your role has been changed from {$oldRole} to {$newRole}.",
            'role'
        );

        Response::success([
            'user'     => $user->toArray(),
            'old_role' => $oldRole,
            'new_role' => $newRole,
        ], 'Role assigned successfully.');
    }

    /**
     * GET /admin/users
     */
    public static function users(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSuperAdmin($authUser);

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $role    = $_GET['role'] ?? '';
        $status  = $_GET['status'] ?? '';
        $search  = $_GET['search'] ?? '';

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
     * PUT /admin/users/{id}/suspend
     */
    public static function suspendUser(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general']);

        $user = User::findById($id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        if (in_array($user->role_slug, ['super_admin', 'soc_team'], true)) {
            Response::forbidden('Cannot suspend a Super Admin or SOC member.');
        }
        if ($authUser->role_slug !== 'super_admin' &&
            in_array($user->role_slug, ['admin_financial', 'admin_educational', 'admin_general', 'admin_monitor', 'admin_sports'], true)) {
            Response::forbidden('Only a Super Admin can manage staff accounts.');
        }

        if ($authUser->id === $id) {
            Response::forbidden('Cannot suspend your own account.');
        }

        $user->suspend();
        ActivityLog::log('admin.user_suspend', $authUser->id, 'user', $id);

        Notification::create($id, 'Account Suspended', 'Your account has been suspended. Contact an administrator.', 'info');

        Response::success(['user' => $user->toArray()], 'User suspended.');
    }

    /**
     * PUT /admin/users/{id}/restore
     */
    public static function restoreUser(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general']);

        $user = User::findById($id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        $user->restore();
        ActivityLog::log('admin.user_restore', $authUser->id, 'user', $id);

        Notification::create($id, 'Account Restored', 'Your account has been restored.', 'info');

        Response::success(['user' => $user->toArray()], 'User restored.');
    }

    /**
     * DELETE /admin/users/{id}
     */
    public static function deleteUser(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general']);

        $user = User::findById($id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        if (in_array($user->role_slug, ['super_admin', 'soc_team'], true)) {
            Response::forbidden('Cannot delete a Super Admin or SOC member.');
        }
        if ($authUser->role_slug !== 'super_admin' &&
            in_array($user->role_slug, ['admin_financial', 'admin_educational', 'admin_general', 'admin_monitor', 'admin_sports'], true)) {
            Response::forbidden('Only a Super Admin can manage staff accounts.');
        }

        if ($authUser->id === $id) {
            Response::forbidden('Cannot delete your own account.');
        }

        $user->softDelete();
        ActivityLog::log('admin.user_delete', $authUser->id, 'user', $id);

        Response::success(null, 'User deleted.');
    }

    /**
     * GET /admin/config
     */
    public static function getConfig(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSuperAdmin($authUser);

        $config = SystemConfig::getAll();
        Response::success(['config' => $config]);
    }

    /**
     * PUT /admin/config
     */
    public static function updateConfig(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSuperAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        if (empty($data)) {
            Response::validationError('No configuration data provided.');
        }

        foreach ($data as $key => $value) {
            SystemConfig::set($key, (string) $value, $authUser->id);
        }

        ActivityLog::log('admin.config_update', $authUser->id, 'config');

        Response::success(['config' => SystemConfig::getAll()], 'Configuration updated.');
    }

    /**
     * GET /admin/analytics
     */
    public static function analytics(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireSuperAdmin($authUser);

        $db = \App\Config\Database::getInstance();

        // Basic stats
        $totalUsers     = User::countAll();
        $totalStudents  = User::countAll('student');
        $totalTeachers  = User::countAll('teacher');
        $activeUsers    = User::countAll('', 'active');
        $suspendedUsers = User::countAll('', 'suspended');

        // Posts stats
        $totalPosts = $db->query("SELECT COUNT(*) FROM content_posts")->fetchColumn();
        $published  = $db->query("SELECT COUNT(*) FROM content_posts WHERE status = 'published'")->fetchColumn();

        // Challenge stats
        $totalChallenges = $db->query("SELECT COUNT(*) FROM challenges")->fetchColumn();
        $totalSubmissions = $db->query("SELECT COUNT(*) FROM submissions")->fetchColumn();

        // Recent registrations (last 7 days)
        $recentUsers = $db->query(
            "SELECT DATE(created_at) AS date, COUNT(*) AS count
             FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
             GROUP BY DATE(created_at) ORDER BY date"
        )->fetchAll();

        Response::success([
            'users' => [
                'total'    => (int) $totalUsers,
                'students' => (int) $totalStudents,
                'teachers' => (int) $totalTeachers,
                'active'   => (int) $activeUsers,
                'suspended' => (int) $suspendedUsers,
            ],
            'content' => [
                'total_posts' => (int) $totalPosts,
                'published'   => (int) $published,
            ],
            'challenges' => [
                'total'        => (int) $totalChallenges,
                'submissions'  => (int) $totalSubmissions,
            ],
            'recent_registrations' => $recentUsers,
        ]);
    }

    /**
     * GET /admin/student-claims
     * List student claims (admins only).
     */
    public static function studentClaims(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_educational', 'admin_general']);

        $status = $_GET['status'] ?? '';
        $page   = (int) ($_GET['page'] ?? 1);

        $claims = StudentClaim::findAll(
            $status ? ['status' => $status] : [],
            $page,
            50
        );

        Response::success(['claims' => $claims]);
    }

    /**
     * POST /admin/student-claims/{id}/approve
     * Approve a student claim, change user role to student.
     */
    public static function approveClaim(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_educational', 'admin_general']);

        $claim = StudentClaim::findById($id);
        if (!$claim) {
            Response::notFound('Claim not found.');
        }

        if ($claim->status !== 'pending') {
            Response::validationError('This claim has already been reviewed.');
        }

        $user = User::findById($claim->user_id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        $claim->approve($authUser->id);
        $user->changeRole('student');

        ActivityLog::log('student_claim.approve', $authUser->id, 'student_claim', $claim->id, [
            'user_id' => $user->id,
        ]);

        Notification::create($user->id, 'Student Claim Approved',
            'Your claim to be a CS Batch 15 student has been approved! Welcome aboard.', 'success');

        Response::success(null, 'Claim approved. User is now a student.');
    }

    /**
     * POST /admin/student-claims/{id}/deny
     * Deny a student claim with a reason.
     */
    public static function denyClaim(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_educational', 'admin_general']);

        $claim = StudentClaim::findById($id);
        if (!$claim) {
            Response::notFound('Claim not found.');
        }

        if ($claim->status !== 'pending') {
            Response::validationError('This claim has already been reviewed.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $note = $data['note'] ?? '';

        if (empty($note)) {
            Response::validationError('Please provide a reason for denial.', ['note' => ['Reason is required.']]);
        }

        $user = User::findById($claim->user_id);
        if (!$user) {
            Response::notFound('User not found.');
        }

        $claim->deny($authUser->id, $note);

        ActivityLog::log('student_claim.deny', $authUser->id, 'student_claim', $claim->id, [
            'user_id' => $user->id,
            'note'    => $note,
        ]);

        Notification::create($user->id, 'Student Claim Denied',
            "Your claim was denied.\nReason: {$note}\n\nYou can re-apply after addressing the above.", 'warning');

        Response::success(null, 'Claim denied. User has been notified.');
    }
}

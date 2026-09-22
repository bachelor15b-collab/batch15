<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\MemberProfile;
use App\Models\ActivityLog;
use App\Models\Notification;

class MemberController
{
    /**
     * GET /members — list members
     * Public: only approved. Admin: all with status filter.
     */
    public static function index(): never
    {
        $authUser = AuthMiddleware::optional();

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 50);
        $search  = $_GET['search'] ?? '';

        $filters = [];

        // Non-admins see only approved
        $isAdmin = $authUser && RoleMiddleware::hasAnyRole($authUser, [
            'super_admin', 'admin_general', 'admin_monitor', 'admin_educational',
            'admin_financial', 'admin_sports', 'soc_team', 'operations_manager', 'teacher',
        ]);

        if (!$isAdmin || !isset($_GET['status'])) {
            $filters['status'] = 'approved';
        } elseif ($_GET['status']) {
            $filters['status'] = $_GET['status'];
        }

        // Users can always see their own profile regardless of status
        if ($authUser) {
            $filters['include_user_id'] = $authUser->id;
        }

        if ($search) $filters['search'] = $search;

        $members = MemberProfile::findAll($filters, $page, $perPage);
        $total   = MemberProfile::countAll($filters);

        Response::success([
            'members'     => array_map(fn($m) => $m->toArray(), $members),
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * GET /members/{id} — show a single member
     */
    public static function show(int $id): never
    {
        $member = MemberProfile::findById($id);
        if (!$member) {
            Response::notFound('Member not found.');
        }

        // Non-admins can only see approved
        $authUser = AuthMiddleware::optional();
        $isAdmin = $authUser && RoleMiddleware::hasAnyRole($authUser, [
            'super_admin', 'admin_general', 'admin_monitor',
        ]);
        if ($member->status !== 'approved' && !$isAdmin && $member->user_id !== ($authUser->id ?? 0)) {
            Response::forbidden('Member profile not visible.');
        }

        Response::success(['member' => $member->toArray()]);
    }

    /**
     * POST /members — create a member profile (student)
     */
    public static function create(): never
    {
        $authUser = AuthMiddleware::authenticate();

        $existing = MemberProfile::findByUserId($authUser->id);
        if ($existing) {
            Response::validationError('You already have a member profile.', ['user_id' => ['Update your existing profile instead.']]);
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('first_name');
        $v->required('last_name');
        $v->required('picture_url');

        if (!$v->passes()) {
            Response::validationError('Validation failed.', $v->errors());
        }

        $profile = new MemberProfile([
            'user_id'       => $authUser->id,
            'first_name'    => $data['first_name'],
            'middle_name'   => $data['middle_name'] ?? null,
            'last_name'     => $data['last_name'],
            'picture_url'   => $data['picture_url'],
            'level'         => $data['level'] ?? null,
            'year'          => $data['year'] ?? null,
            'semester'      => $data['semester'] ?? null,
            'bio'           => $data['bio'] ?? null,
            'skills'        => $data['skills'] ?? null,
            'languages'     => $data['languages'] ?? null,
            'website'       => $data['website'] ?? null,
            'email_contact' => $data['email_contact'] ?? null,
            'github'        => $data['github'] ?? null,
            'linkedin'      => $data['linkedin'] ?? null,
            'twitter'       => $data['twitter'] ?? null,
            'certificates'  => $data['certificates'] ?? null,
            'status'        => 'pending',
        ]);

        $profile->create();

        // Notify admins about new pending profile
        $admins = \App\Models\User::findAll('', 'active', 1, 100);
        foreach ($admins as $admin) {
            if (in_array($admin->role_slug, ['super_admin', 'admin_general', 'admin_monitor'], true)) {
                Notification::create(
                    $admin->id,
                    'New Member Profile',
                    $profile->first_name . ' ' . $profile->last_name . ' submitted a member profile for approval.',
                    'info'
                );
            }
        }

        ActivityLog::log('member.create', $authUser->id, 'member', $profile->id);

        Response::success(['member' => $profile->toArray()], 'Member profile created. Waiting for admin approval.');
    }

    /**
     * POST /members/{id}/picture — upload member profile picture
     */
    public static function uploadPicture(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        $member = MemberProfile::findById($id);

        if (!$member) {
            Response::notFound('Member profile not found.');
        }

        if ($member->user_id !== $authUser->id && !RoleMiddleware::hasAnyRole($authUser, ['super_admin', 'admin_general', 'admin_monitor'])) {
            Response::forbidden('You cannot edit this profile.');
        }

        if (!isset($_FILES['picture']) || $_FILES['picture']['error'] !== UPLOAD_ERR_OK) {
            Response::validationError('Upload failed.', ['picture' => ['No file uploaded or upload error.']]);
        }

        $file = $_FILES['picture'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $maxSize = 2 * 1024 * 1024;

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, $allowedTypes, true)) {
            Response::validationError('Invalid file type.', ['picture' => ['Only JPG, PNG, GIF, and WebP images are allowed.']]);
        }

        if ($file['size'] > $maxSize) {
            Response::validationError('File too large.', ['picture' => ['Maximum file size is 2MB.']]);
        }

        $ext = match ($mime) {
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/gif'  => 'gif',
            'image/webp' => 'webp',
            default      => 'jpg',
        };
        $filename = 'member_' . $id . '_' . time() . '.' . $ext;
        $uploadDir = __DIR__ . '/../../uploads/members/';
        if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
        $destPath = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            Response::serverError('Failed to save file.');
        }

        $webPath = \App\Config\App::baseUrl() . '/uploads/members/' . $filename;

        // Delete old picture
        $baseUrl = \App\Config\App::baseUrl();
        $prefix = $baseUrl . '/uploads/members/';
        if ($member->picture_url && str_starts_with($member->picture_url, $prefix)) {
            $oldPath = __DIR__ . '/../../' . ltrim($member->picture_url, '/');
            if (file_exists($oldPath)) unlink($oldPath);
        }

        $member->update(['picture_url' => $webPath]);

        ActivityLog::log('member.picture_upload', $authUser->id, 'member', $id);

        $fresh = MemberProfile::findById($id);
        Response::success(['member' => $fresh->toArray()], 'Profile picture updated.');
    }

    /**
     * PUT /members/{id} — update member profile (owner or admin)
     */
    public static function update(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        $member = MemberProfile::findById($id);

        if (!$member) {
            Response::notFound('Member profile not found.');
        }

        $isOwner = $member->user_id === $authUser->id;
        $isAdmin = RoleMiddleware::hasAnyRole($authUser, ['super_admin', 'admin_general', 'admin_monitor']);

        if (!$isOwner && !$isAdmin) {
            Response::forbidden('You cannot edit this profile.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $allowed = ['first_name','middle_name','last_name','level','year','semester',
            'bio','skills','languages','website','email_contact','github','linkedin','twitter','certificates'];

        // Admins can also update status and picture_url
        if ($isAdmin) {
            $allowed[] = 'status';
            $allowed[] = 'picture_url';
        }

        $updateData = [];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $updateData[$field] = $data[$field];
            }
        }

        if (empty($updateData)) {
            Response::success(['member' => $member->toArray()], 'Nothing to update.');
        }

        $member->update($updateData);

        // If non-admin owner updates, reset status to pending for re-approval
        if (!$isAdmin && $member->status === 'approved') {
            $member->update(['status' => 'pending']);
        }

        ActivityLog::log('member.update', $authUser->id, 'member', $id);

        $fresh = MemberProfile::findById($id);
        Response::success(['member' => $fresh->toArray()], 'Member profile updated.');
    }

    /**
     * DELETE /members/{id} — delete member profile (owner or admin)
     */
    public static function destroy(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        $member = MemberProfile::findById($id);

        if (!$member) {
            Response::notFound('Member profile not found.');
        }

        $isOwner = $member->user_id === $authUser->id;
        $isAdmin = RoleMiddleware::hasAnyRole($authUser, ['super_admin', 'admin_general', 'admin_monitor']);

        if (!$isOwner && !$isAdmin) {
            Response::forbidden('You cannot delete this profile.');
        }

        $db = \App\Config\Database::getInstance();
        $db->prepare("DELETE FROM member_profiles WHERE id = ?")->execute([$id]);

        ActivityLog::log('member.delete', $authUser->id, 'member', $id);

        Response::success(null, 'Member profile deleted.');
    }

    /**
     * POST /members/{id}/approve — approve member profile (admin)
     */
    public static function approve(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general', 'admin_monitor']);

        $member = MemberProfile::findById($id);
        if (!$member) {
            Response::notFound('Member profile not found.');
        }

        $member->update(['status' => 'approved']);

        Notification::create(
            $member->user_id,
            'Profile Approved',
            'Your member profile has been approved and is now visible to everyone.',
            'success'
        );

        ActivityLog::log('member.approve', $authUser->id, 'member', $id);

        $fresh = MemberProfile::findById($id);
        Response::success(['member' => $fresh->toArray()], 'Member profile approved.');
    }

    /**
     * POST /members/{id}/reject — reject member profile (admin)
     */
    public static function reject(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general', 'admin_monitor']);

        $member = MemberProfile::findById($id);
        if (!$member) {
            Response::notFound('Member profile not found.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $reason = $data['reason'] ?? 'Your profile did not meet the requirements.';

        $member->update(['status' => 'rejected']);

        Notification::create(
            $member->user_id,
            'Profile Rejected',
            'Your member profile has been rejected. Reason: ' . $reason,
            'warning'
        );

        ActivityLog::log('member.reject', $authUser->id, 'member', $id, ['reason' => $reason]);

        $fresh = MemberProfile::findById($id);
        Response::success(['member' => $fresh->toArray()], 'Member profile rejected.');
    }
}

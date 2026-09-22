<?php
/**
 * Assignment Controller
 *
 * GET    /assignments
 * POST   /assignments
 * GET    /assignments/{id}
 * PUT    /assignments/{id}
 * DELETE /assignments/{id}
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\Assignment;
use App\Models\ActivityLog;
use App\Models\Notification;

class AssignmentController
{
    /**
     * GET /assignments
     */
    public static function index(): never
    {
        $authUser = AuthMiddleware::authenticate();
        if (!RoleMiddleware::hasAnyRole($authUser, ['super_admin', 'admin_educational', 'teacher'])) {
            Response::forbidden();
        }

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $courseId = $_GET['course_id'] ?? '';
        $status   = $_GET['status'] ?? '';
        $createdBy = $_GET['created_by'] ?? '';

        $filters = [];
        if ($courseId) $filters['course_id'] = (int)$courseId;
        if ($status) $filters['status'] = $status;
        if ($createdBy) $filters['created_by'] = (int)$createdBy;

        $assignments = Assignment::findAll($filters, $page, $perPage);
        $total       = Assignment::countAll($filters);

        $data = array_map(fn($a) => $a->toArray(), $assignments);

        Response::success([
            'assignments' => $data,
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * POST /assignments
     */
    public static function create(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require(['teacher', 'admin_educational', 'super_admin'], $authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('course_id')->integer('course_id');
        $v->required('title');
        $v->max('title', 255);

        if (!$v->passes()) {
            Response::validationError('Assignment creation failed.', $v->errors());
        }

        $data['created_by'] = $authUser->id;
        $assignment = Assignment::create($data);

        ActivityLog::log('assignment.create', $authUser->id, 'assignment', $assignment->id);

        Response::success(['assignment' => $assignment->toArray()], 'Assignment created.', 201);
    }

    /**
     * GET /assignments/{id}
     */
    public static function show(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        if (!RoleMiddleware::hasAnyRole($authUser, ['super_admin', 'admin_educational', 'teacher', 'student'])) {
            Response::forbidden();
        }

        $assignment = Assignment::findById($id);
        if (!$assignment) {
            Response::notFound('Assignment not found.');
        }

        Response::success(['assignment' => $assignment->toArray()]);
    }

    /**
     * PUT /assignments/{id}
     */
    public static function update(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require(['teacher', 'admin_educational', 'super_admin'], $authUser);

        $assignment = Assignment::findById($id);
        if (!$assignment) {
            Response::notFound('Assignment not found.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $assignment->update($data);

        ActivityLog::log('assignment.update', $authUser->id, 'assignment', $id);

        Response::success(['assignment' => $assignment->toArray()], 'Assignment updated.');
    }

    /**
     * DELETE /assignments/{id}
     */
    public static function destroy(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require(['teacher', 'admin_educational', 'super_admin'], $authUser);

        $assignment = Assignment::findById($id);
        if (!$assignment) {
            Response::notFound('Assignment not found.');
        }

        $db = \App\Config\Database::getInstance();
        $db->prepare('DELETE FROM assignments WHERE id=?')->execute([$id]);

        ActivityLog::log('assignment.delete', $authUser->id, 'assignment', $id);

        Response::success(null, 'Assignment deleted.');
    }

    /**
     * GET /assignments/my
     */
    public static function myAssignments(): never
    {
        $authUser = AuthMiddleware::authenticate();
        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $offset  = ($page - 1) * $perPage;
        $db      = \App\Config\Database::getInstance();

        if ($authUser->role_slug === 'student') {
            $stmt = $db->prepare(
                'SELECT a.*, c.name as course_name FROM assignments a
                 JOIN enrollments e ON e.course_id = a.course_id
                 JOIN courses c ON c.id = a.course_id
                 WHERE e.user_id = ? AND e.status = ?
                 ORDER BY a.created_at DESC
                 LIMIT ? OFFSET ?'
            );
            $stmt->execute([$authUser->id, 'active', $perPage, $offset]);
            $rows = $stmt->fetchAll();

            $countStmt = $db->prepare(
                'SELECT COUNT(*) FROM assignments a
                 JOIN enrollments e ON e.course_id = a.course_id
                 WHERE e.user_id = ? AND e.status = ?'
            );
            $countStmt->execute([$authUser->id, 'active']);
            $total = (int) $countStmt->fetchColumn();

            // Check submission status for each assignment
            foreach ($rows as &$row) {
                $subStmt = $db->prepare(
                    'SELECT id as submission_id, score, status as submission_status
                     FROM assignment_submissions WHERE user_id = ? AND assignment_id = ? LIMIT 1'
                );
                $subStmt->execute([$authUser->id, $row['id']]);
                $submission = $subStmt->fetch();
                $row['submission'] = $submission ?: null;
            }
            unset($row);
        } else {
            RoleMiddleware::require(['teacher', 'admin_educational', 'super_admin'], $authUser);

            $stmt = $db->prepare(
                'SELECT a.*, c.name as course_name FROM assignments a
                 JOIN courses c ON c.id = a.course_id
                 WHERE a.created_by = ?
                 ORDER BY a.created_at DESC
                 LIMIT ? OFFSET ?'
            );
            $stmt->execute([$authUser->id, $perPage, $offset]);
            $rows = $stmt->fetchAll();

            $countStmt = $db->prepare('SELECT COUNT(*) FROM assignments WHERE created_by = ?');
            $countStmt->execute([$authUser->id]);
            $total = (int) $countStmt->fetchColumn();

            foreach ($rows as &$row) {
                $subStmt = $db->prepare('SELECT COUNT(*) FROM assignment_submissions WHERE assignment_id = ?');
                $subStmt->execute([$row['id']]);
                $row['submission_count'] = (int) $subStmt->fetchColumn();
            }
            unset($row);
        }

        Response::success([
            'assignments' => $rows,
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * POST /assignments/{id}/submit
     */
    public static function submit(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require('student', $authUser);

        $assignment = Assignment::findById($id);
        if (!$assignment) {
            Response::notFound('Assignment not found.');
        }

        $db = \App\Config\Database::getInstance();
        $enrollStmt = $db->prepare(
            'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? AND status = ? LIMIT 1'
        );
        $enrollStmt->execute([$authUser->id, $assignment->course_id, 'active']);
        if (!$enrollStmt->fetch()) {
            Response::forbidden('You are not enrolled in the course for this assignment.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('content');

        if (!$v->passes()) {
            Response::validationError('Submission failed.', $v->errors());
        }

        $content = $data['content'] ?? '';
        $fileUrl = $data['file'] ?? null;
        $link    = $data['link'] ?? null;

        $existingStmt = $db->prepare(
            'SELECT id FROM assignment_submissions WHERE assignment_id = ? AND user_id = ? LIMIT 1'
        );
        $existingStmt->execute([$id, $authUser->id]);
        $existing = $existingStmt->fetch();

        if ($existing) {
            $stmt = $db->prepare(
                'UPDATE assignment_submissions SET content = ?, file_url = ?, link = ?, updated_at = NOW() WHERE id = ?'
            );
            $stmt->execute([$content, $fileUrl, $link, $existing['id']]);
            $submissionId = $existing['id'];
        } else {
            $stmt = $db->prepare(
                'INSERT INTO assignment_submissions (assignment_id, user_id, content, file_url, link) VALUES (?, ?, ?, ?, ?)'
            );
            $stmt->execute([$id, $authUser->id, $content, $fileUrl, $link]);
            $submissionId = (int) $db->lastInsertId();
        }

        Notification::create(
            $assignment->created_by,
            'New Assignment Submission',
            ($authUser->full_name ?? $authUser->username) . " submitted work for '{$assignment->title}'.",
            'info',
            'assignment',
            $id
        );

        ActivityLog::log('assignment.submit', $authUser->id, 'assignment', $id);

        Response::success(['submission_id' => $submissionId], 'Assignment submitted successfully.', 201);
    }

    /**
     * GET /assignments/{id}/submissions
     */
    public static function submissions(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require(['teacher', 'admin_educational', 'super_admin', 'admin_monitor'], $authUser);

        $assignment = Assignment::findById($id);
        if (!$assignment) {
            Response::notFound('Assignment not found.');
        }

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $offset  = ($page - 1) * $perPage;

        $db = \App\Config\Database::getInstance();
        $stmt = $db->prepare(
            'SELECT s.*, u.username, u.full_name, u.email
             FROM assignment_submissions s
             JOIN users u ON u.id = s.user_id
             WHERE s.assignment_id = ?
             ORDER BY s.submitted_at DESC
             LIMIT ? OFFSET ?'
        );
        $stmt->execute([$id, $perPage, $offset]);
        $rows = $stmt->fetchAll();

        $countStmt = $db->prepare('SELECT COUNT(*) FROM assignment_submissions WHERE assignment_id = ?');
        $countStmt->execute([$id]);
        $total = (int) $countStmt->fetchColumn();

        Response::success([
            'submissions' => $rows,
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * PUT /submissions/{id}/grade
     */
    public static function gradeSubmission(int $submissionId): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require(['teacher', 'admin_educational', 'super_admin'], $authUser);

        $db = \App\Config\Database::getInstance();

        $stmt = $db->prepare(
            'SELECT s.*, a.course_id, a.title as assignment_title, a.created_by
             FROM assignment_submissions s
             JOIN assignments a ON a.id = s.assignment_id
             WHERE s.id = ? LIMIT 1'
        );
        $stmt->execute([$submissionId]);
        $submission = $stmt->fetch();

        if (!$submission) {
            Response::notFound('Submission not found.');
        }

        if ($authUser->role_slug === 'teacher' && $authUser->id !== $submission['created_by']) {
            Response::forbidden('You do not have permission to grade this submission.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('score')->numeric('score');
        $v->required('status')->in('status', ['approved', 'rejected', 'revision']);

        if (!$v->passes()) {
            Response::validationError('Grading failed.', $v->errors());
        }

        $score    = (float) $data['score'];
        $feedback = $data['feedback'] ?? null;
        $status   = $data['status'];

        if ($score < 0 || $score > 100) {
            Response::validationError('Score must be between 0 and 100.');
        }

        $updateStmt = $db->prepare(
            'UPDATE assignment_submissions SET score = ?, feedback = ?, status = ?, graded_by = ?, graded_at = NOW() WHERE id = ?'
        );
        $updateStmt->execute([$score, $feedback, $status, $authUser->id, $submissionId]);

        Notification::create(
            $submission['user_id'],
            'Assignment Graded',
            "Your submission for '{$submission['assignment_title']}' has been graded ({$score}/100).",
            'info',
            'assignment',
            $submission['assignment_id']
        );

        ActivityLog::log('assignment.grade', $authUser->id, 'assignment_submission', $submissionId);

        Response::success(['submission_id' => $submissionId], 'Submission graded successfully.');
    }

    /**
     * GET /assignments/submissions/unread
     */
    public static function unreadSubmissionsCount(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::require(['teacher', 'admin_educational', 'super_admin'], $authUser);

        $db = \App\Config\Database::getInstance();

        if ($authUser->role_slug === 'super_admin' || $authUser->role_slug === 'admin_educational') {
            $stmt = $db->prepare(
                'SELECT COUNT(*) FROM assignment_submissions s
                 JOIN assignments a ON a.id = s.assignment_id
                 WHERE s.score IS NULL'
            );
            $stmt->execute();
        } else {
            $stmt = $db->prepare(
                'SELECT COUNT(*) FROM assignment_submissions s
                 JOIN assignments a ON a.id = s.assignment_id
                 WHERE a.created_by = ? AND s.score IS NULL'
            );
            $stmt->execute([$authUser->id]);
        }

        $count = (int) $stmt->fetchColumn();

        Response::success(['count' => $count]);
    }
}

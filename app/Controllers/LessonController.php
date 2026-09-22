<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\Lesson;
use App\Models\LessonFolder;
use App\Models\User;
use App\Models\Course;
use App\Models\ActivityLog;

class LessonController
{
    public static function index(): never
    {
        $authUser = AuthMiddleware::authenticate();
        $params = $_GET;
        $courseId = !empty($params['course_id']) ? (int)$params['course_id'] : null;
        $folderId = array_key_exists('folder_id', $params) ? ($params['folder_id'] !== '' ? (int)$params['folder_id'] : null) : null;
        $filters = [];
        if ($courseId) $filters['course_id'] = $courseId;
        if (array_key_exists('folder_id', $params)) $filters['folder_id'] = $folderId;

        $page = max(1, (int)($params['page'] ?? 1));
        $perPage = min(100, max(1, (int)($params['per_page'] ?? 50)));

        $lessons = Lesson::findAll($filters, $page, $perPage);
        $total = Lesson::countAll($filters);

        $data = array_map(function(Lesson $l) {
            $arr = $l->toArray();
            $uploader = User::findById($l->uploaded_by);
            $arr['uploader_name'] = $uploader ? $uploader->full_name : 'Unknown';
            $course = Course::findById($l->course_id);
            $arr['course_name'] = $course ? $course->name : 'Unknown';
            $arr['course_code'] = $course ? $course->code : '';
            $arr['folder_name'] = $l->folder_id ? (($folder = LessonFolder::findById($l->folder_id)) ? $folder->name : null) : null;
            return $arr;
        }, $lessons);

        Response::success([
            'lessons' => $data,
            'total' => $total,
            'page' => $page,
            'per_page' => $perPage,
        ]);
    }

    public static function show(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        $lesson = Lesson::findById($id);
        if (!$lesson) {
            Response::notFound('Lesson not found.');
        }
        $arr = $lesson->toArray();
        $uploader = User::findById($lesson->uploaded_by);
        $arr['uploader_name'] = $uploader ? $uploader->full_name : 'Unknown';
        $course = Course::findById($lesson->course_id);
        $arr['course_name'] = $course ? $course->name : 'Unknown';
        $arr['course_code'] = $course ? $course->code : '';
        $arr['folder_name'] = $lesson->folder_id ? (($folder = LessonFolder::findById($lesson->folder_id)) ? $folder->name : null) : null;
        Response::success(['lesson' => $arr]);
    }

    public static function create(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general', 'teacher', 'admin_educational', 'admin_monitor']);

        $title = $_POST['title'] ?? '';
        $courseId = (int)($_POST['course_id'] ?? 0);
        $folderId = isset($_POST['folder_id']) && $_POST['folder_id'] !== '' ? (int)$_POST['folder_id'] : null;
        $description = $_POST['description'] ?? '';

        // If course_id is missing but folder_id is given, resolve from folder
        if ($courseId <= 0 && $folderId) {
            $folder = LessonFolder::findById($folderId);
            if ($folder && $folder->course_id) {
                $courseId = $folder->course_id;
            }
        }

        if (empty($title)) {
            Response::validationError('Title is required.', ['title' => ['Please enter a lesson title.']]);
        }
        if ($courseId <= 0 && !$folderId) {
            Response::validationError('Course is required.', ['course_id' => ['Please select a course.']]);
        }

        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
            Response::validationError('File upload failed.', ['file' => ['No file uploaded or upload error.']]);
        }

        $file = $_FILES['file'];
        $allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/plain',
            'text/csv',
            'application/zip',
            'application/x-zip-compressed',
            'application/octet-stream',
        ];
        $maxSize = 50 * 1024 * 1024; // 50MB

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowedExts = ['pdf','doc','docx','ppt','pptx','xls','xlsx','txt','csv','zip'];

        if (!in_array($ext, $allowedExts, true)) {
            Response::validationError('Invalid file type.', ['file' => ['Only PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, CSV, and ZIP files are allowed.']]);
        }

        if ($file['size'] > $maxSize) {
            Response::validationError('File too large.', ['file' => ['Maximum file size is 50MB.']]);
        }

        $filename = $authUser->id . '_' . time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $file['name']);
        $uploadDir = __DIR__ . '/../../uploads/lessons/';
        $destPath = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            Response::serverError('Failed to save file.');
        }

        $webPath = \App\Config\App::baseUrl() . '/uploads/lessons/' . $filename;

        $lesson = Lesson::create([
            'course_id' => $courseId,
            'folder_id' => $folderId,
            'title' => $title,
            'description' => $description,
            'file_path' => $webPath,
            'file_type' => $mime,
            'file_size' => $file['size'],
            'original_filename' => $file['name'],
            'uploaded_by' => $authUser->id,
        ]);

        ActivityLog::log('lesson.create', $lesson->id, 'lesson', $authUser->id);

        Response::success(['lesson' => $lesson->toArray()], 'Lesson uploaded successfully.');
    }

    public static function update(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general', 'teacher', 'admin_educational', 'admin_monitor']);

        $lesson = Lesson::findById($id);
        if (!$lesson) {
            Response::notFound('Lesson not found.');
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            Response::validationError('Invalid request body.');
        }

        $updateData = [];
        if (isset($data['title'])) $updateData['title'] = $data['title'];
        if (isset($data['description'])) $updateData['description'] = $data['description'];
        if (isset($data['course_id'])) $updateData['course_id'] = (int)$data['course_id'];
        if (array_key_exists('folder_id', $data)) $updateData['folder_id'] = $data['folder_id'] !== null && $data['folder_id'] !== '' ? (int)$data['folder_id'] : null;

        if (empty($updateData)) {
            Response::validationError('No data to update.');
        }

        $lesson->update($updateData);
        ActivityLog::log('lesson.update', $lesson->id, 'lesson', $authUser->id);

        $fresh = Lesson::findById($lesson->id);
        Response::success(['lesson' => $fresh->toArray()], 'Lesson updated.');
    }

    public static function destroy(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general', 'teacher', 'admin_educational', 'admin_monitor']);

        $lesson = Lesson::findById($id);
        if (!$lesson) {
            Response::notFound('Lesson not found.');
        }

        $filePath = __DIR__ . '/../../' . ltrim($lesson->file_path, '/');
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $lesson->delete();
        ActivityLog::log('lesson.delete', $lesson->id, 'lesson', $authUser->id);

        Response::success([], 'Lesson deleted.');
    }

    public static function byCourse(int $courseId): never
    {
        AuthMiddleware::authenticate();
        $lessons = Lesson::findAll(['course_id' => $courseId]);
        $data = array_map(function(Lesson $l) {
            $arr = $l->toArray();
            $uploader = User::findById($l->uploaded_by);
            $arr['uploader_name'] = $uploader ? $uploader->full_name : 'Unknown';
            $arr['folder_name'] = $l->folder_id ? (($folder = LessonFolder::findById($l->folder_id)) ? $folder->name : null) : null;
            return $arr;
        }, $lessons);
        Response::success(['lessons' => $data, 'course_id' => $courseId]);
    }
}

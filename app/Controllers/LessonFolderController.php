<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\LessonFolder;
use App\Models\Course;
use App\Models\ActivityLog;

class LessonFolderController
{
    public static function index(): never
    {
        AuthMiddleware::authenticate();
        $courseId = !empty($_GET['course_id']) ? (int)$_GET['course_id'] : null;
        $filters = [];
        if (array_key_exists('course_id', $_GET)) $filters['course_id'] = $courseId;
        $folders = LessonFolder::findAll($filters);

        $data = array_map(function(LessonFolder $f) {
            $arr = $f->toArray();
            if ($f->course_id) {
                $course = Course::findById($f->course_id);
                $arr['course_name'] = $course ? $course->name : 'Unknown';
                $arr['course_code'] = $course ? $course->code : '';
            } else {
                $arr['course_name'] = null;
                $arr['course_code'] = null;
            }
            return $arr;
        }, $folders);

        Response::success(['folders' => $data]);
    }

    public static function byCourse(int $courseId): never
    {
        AuthMiddleware::authenticate();
        $folders = LessonFolder::findByCourse($courseId);
        Response::success(['folders' => array_map(fn($f) => $f->toArray(), $folders), 'course_id' => $courseId]);
    }

    public static function show(int $id): never
    {
        AuthMiddleware::authenticate();
        $folder = LessonFolder::findById($id);
        if (!$folder) {
            Response::notFound('Folder not found.');
        }
        Response::success(['folder' => $folder->toArray()]);
    }

    public static function create(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general', 'teacher', 'admin_educational', 'admin_monitor']);

        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            Response::validationError('Invalid request body.');
        }

        $name = trim($data['name'] ?? '');
        $courseId = !empty($data['course_id']) ? (int)$data['course_id'] : null;

        if (empty($name)) {
            Response::validationError('Folder name is required.', ['name' => ['Please enter a folder name.']]);
        }

        if ($courseId) {
            $course = Course::findById($courseId);
            if (!$course) {
                Response::notFound('Course not found.');
            }
        }

        $folder = LessonFolder::create([
            'course_id' => $courseId,
            'name' => $name,
            'description' => trim($data['description'] ?? ''),
            'created_by' => $authUser->id,
            'sort_order' => (int)($data['sort_order'] ?? 0),
        ]);

        ActivityLog::log('lesson_folder.create', $folder->id, 'lesson_folder', $authUser->id);

        Response::success(['folder' => $folder->toArray()], 'Folder created successfully.');
    }

    public static function update(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general', 'teacher', 'admin_educational', 'admin_monitor']);

        $folder = LessonFolder::findById($id);
        if (!$folder) {
            Response::notFound('Folder not found.');
        }

        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            Response::validationError('Invalid request body.');
        }

        $updateData = [];
        if (isset($data['name'])) $updateData['name'] = trim($data['name']);
        if (isset($data['description'])) $updateData['description'] = trim($data['description']);
        if (isset($data['sort_order'])) $updateData['sort_order'] = (int)$data['sort_order'];

        if (empty($updateData)) {
            Response::validationError('No data to update.');
        }

        $folder->update($updateData);
        ActivityLog::log('lesson_folder.update', $folder->id, 'lesson_folder', $authUser->id);

        $fresh = LessonFolder::findById($folder->id);
        Response::success(['folder' => $fresh->toArray()], 'Folder updated.');
    }

    public static function destroy(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyRole($authUser, ['super_admin', 'admin_general', 'teacher', 'admin_educational', 'admin_monitor']);

        $folder = LessonFolder::findById($id);
        if (!$folder) {
            Response::notFound('Folder not found.');
        }

        $folder->delete();
        ActivityLog::log('lesson_folder.delete', $folder->id, 'lesson_folder', $authUser->id);

        Response::success([], 'Folder deleted.');
    }
}

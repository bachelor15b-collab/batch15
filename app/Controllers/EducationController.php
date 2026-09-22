<?php
/**
 * Education Controller (Academic management)
 *
 * GET    /education/dashboard
 * GET    /education/departments
 * POST   /education/departments
 * GET    /education/semesters
 * POST   /education/semesters
 * GET    /education/courses
 * POST   /education/courses
 * GET    /education/courses/{id}
 * PUT    /education/courses/{id}
 * DELETE /education/courses/{id}
 * GET    /education/enrollments
 * POST   /education/enrollments
 * GET    /education/grades
 * POST   /education/grades
 * GET    /education/students/{id}/grades
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Department;
use App\Models\Semester;
use App\Models\ActivityLog;
use App\Models\Notification;
use App\Config\Database;

class EducationController
{
    /**
     * GET /education/dashboard
     */
    public static function dashboard(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $db = Database::getInstance();

        $totalCourses      = Course::countAll();
        $totalStudents     = $db->query("SELECT COUNT(*) FROM users WHERE role_slug='student' AND status='active'")->fetchColumn();
        $activeEnrollments = Enrollment::countAll(['status' => 'active']);
        $totalTeachers     = $db->query("SELECT COUNT(*) FROM users WHERE role_slug='teacher' AND status='active'")->fetchColumn();

        $currentSemester = Semester::getCurrent();
        $departments     = Department::findAll();

        Response::success([
            'total_courses'      => (int)$totalCourses,
            'total_students'     => (int)$totalStudents,
            'active_enrollments' => (int)$activeEnrollments,
            'total_teachers'     => (int)$totalTeachers,
            'current_semester'   => $currentSemester ? $currentSemester->toArray() : null,
            'departments'        => array_map(fn($d) => $d->toArray(), $departments),
        ]);
    }

    /**
     * GET /education/departments
     */
    public static function departments(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $departments = Department::findAll();
        Response::success(['departments' => array_map(fn($d) => $d->toArray(), $departments)]);
    }

    /**
     * POST /education/departments
     */
    public static function createDepartment(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('name');
        $v->required('code');

        if (!$v->passes()) {
            Response::validationError('Department creation failed.', $v->errors());
        }

        $dept = Department::create($data);
        ActivityLog::log('education.dept_create', $authUser->id, 'department', $dept->id);

        Response::success(['department' => $dept->toArray()], 'Department created.');
    }

    /**
     * GET /education/semesters
     */
    public static function semesters(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $semesters = Semester::findAll();
        Response::success(['semesters' => array_map(fn($s) => $s->toArray(), $semesters)]);
    }

    /**
     * POST /education/semesters
     */
    public static function createSemester(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('name');
        $v->required('code');
        $v->required('start_date');
        $v->required('end_date');

        if (!$v->passes()) {
            Response::validationError('Semester creation failed.', $v->errors());
        }

        $semester = Semester::create($data);

        if (!empty($data['is_current'])) {
            $db = Database::getInstance();
            $db->prepare('UPDATE semesters SET is_current=0 WHERE id!=?')->execute([$semester->id]);
        }

        ActivityLog::log('education.semester_create', $authUser->id, 'semester', $semester->id);

        Response::success(['semester' => $semester->toArray()], 'Semester created.');
    }

    /**
     * GET /education/courses
     */
    public static function courses(): never
    {
        $authUser = AuthMiddleware::authenticate();
        if (!RoleMiddleware::hasAnyRole($authUser, ['super_admin', 'admin_educational', 'admin_general', 'admin_sports', 'admin_monitor', 'teacher', 'student'])) {
            Response::forbidden();
        }

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $deptId  = $_GET['department_id'] ?? '';
        $teacherId = $_GET['teacher_id'] ?? '';

        $filters = [];
        if ($deptId) $filters['department_id'] = (int)$deptId;
        if ($teacherId) $filters['teacher_id'] = (int)$teacherId;

        $courses = Course::findAll($filters, $page, $perPage);
        $total   = Course::countAll($filters);

        Response::success([
            'courses'     => array_map(fn($c) => $c->toArray(), $courses),
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * POST /education/courses
     */
    public static function createCourse(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('code');
        $v->required('name');

        if (!$v->passes()) {
            Response::validationError('Course creation failed.', $v->errors());
        }

        $course = Course::create($data);
        ActivityLog::log('education.course_create', $authUser->id, 'course', $course->id);

        Response::success(['course' => $course->toArray()], 'Course created.');
    }

    /**
     * GET /education/courses/{id}
     */
    public static function getCourse(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $course = Course::findById($id);
        if (!$course) {
            Response::notFound('Course not found.');
        }

        Response::success(['course' => $course->toArray()]);
    }

    /**
     * GET /education/courses/{id}/detail — public access (any authenticated user)
     */
    public static function courseDetail(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();

        $course = Course::findById($id);
        if (!$course) {
            Response::notFound('Course not found.');
        }

        $db = Database::getInstance();

        // Get department name
        $deptName = null;
        if ($course->department_id) {
            $stmt = $db->prepare('SELECT name FROM departments WHERE id=?');
            $stmt->execute([$course->department_id]);
            $deptName = $stmt->fetchColumn() ?: null;
        }

        // Get teacher name
        $teacherName = null;
        if ($course->teacher_id) {
            $stmt = $db->prepare('SELECT full_name FROM users WHERE id=?');
            $stmt->execute([$course->teacher_id]);
            $teacherName = $stmt->fetchColumn() ?: null;
        }

        $data = $course->toArray();
        $data['department_name'] = $deptName;
        $data['teacher_name'] = $teacherName;

        Response::success(['course' => $data]);
    }

    /**
     * PUT /education/courses/{id}
     */
    public static function updateCourse(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $course = Course::findById($id);
        if (!$course) {
            Response::notFound('Course not found.');
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $course->update($data);

        ActivityLog::log('education.course_update', $authUser->id, 'course', $id);

        Response::success(['course' => $course->toArray()], 'Course updated.');
    }

    /**
     * DELETE /education/courses/{id}
     */
    public static function deleteCourse(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $course = Course::findById($id);
        if (!$course) {
            Response::notFound('Course not found.');
        }

        $course->delete();

        ActivityLog::log('education.course_delete', $authUser->id, 'course', $id);

        Response::success(null, 'Course deleted.');
    }

    /**
     * GET /education/enrollments
     */
    public static function enrollments(): never
    {
        $authUser = AuthMiddleware::authenticate();

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $courseId = $_GET['course_id'] ?? '';
        $status   = $_GET['status'] ?? '';
        $userId   = $_GET['user_id'] ?? '';

        // Students can only view their own enrollments
        if ($authUser->role_slug === 'student') {
            // Force user_id to self
            $userId = (string)$authUser->id;
        } elseif (!RoleMiddleware::hasAnyRole($authUser, ['super_admin', 'admin_educational', 'admin_general', 'teacher'])) {
            Response::forbidden();
        }

        $filters = [];
        if ($courseId) $filters['course_id'] = (int)$courseId;
        if ($status) $filters['status'] = $status;
        if ($userId) $filters['user_id'] = (int)$userId;

        $enrollments = Enrollment::findAll($filters, $page, $perPage);
        $total       = Enrollment::countAll($filters);

        Response::success([
            'enrollments' => array_map(fn($e) => $e->toArray(), $enrollments),
            'total'       => $total,
            'page'        => $page,
            'per_page'    => $perPage,
            'total_pages' => ceil($total / $perPage),
        ]);
    }

    /**
     * POST /education/enrollments
     */
    public static function createEnrollment(): never
    {
        $authUser = AuthMiddleware::authenticate();

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('course_id')->integer('course_id');

        // Students can only enroll themselves
        if ($authUser->role_slug === 'student') {
            $data['user_id'] = (string)$authUser->id;
        } else {
            RoleMiddleware::requireAnyAdmin($authUser);
            $v->required('user_id')->integer('user_id');
        }

        if (!$v->passes()) {
            Response::validationError('Enrollment failed.', $v->errors());
        }

        $existing = Enrollment::findByUserAndCourse((int)$data['user_id'], (int)$data['course_id']);
        if ($existing) {
            Response::validationError('User is already enrolled in this course.');
        }

        $enrollment = Enrollment::create($data);

        ActivityLog::log('education.enroll_create', $authUser->id, 'enrollment', $enrollment->id, [
            'user_id'   => $data['user_id'],
            'course_id' => $data['course_id'],
        ]);

        Notification::create((int)$data['user_id'], 'Course Enrollment', 'You have been enrolled in a new course.', 'info');

        Response::success(['enrollment' => $enrollment->toArray()], 'Enrollment created.');
    }

    /**
     * GET /education/grades
     */
    public static function grades(): never
    {
        $authUser = AuthMiddleware::authenticate();
        $userId   = $_GET['user_id'] ?? '';

        // Students can only view their own grades; admins can view any
        if ($authUser->role_slug === 'student') {
            if ($userId && (int)$userId !== $authUser->id) {
                Response::forbidden('You can only view your own grades.');
            }
            $userId = (string)$authUser->id;
        } elseif ($userId) {
            RoleMiddleware::requireAnyAdmin($authUser);
        }

        $page    = (int) ($_GET['page'] ?? 1);
        $perPage = (int) ($_GET['per_page'] ?? 20);
        $courseId = $_GET['course_id'] ?? '';

        $filters = [];
        if ($courseId) $filters['course_id'] = (int)$courseId;
        if ($userId) $filters['user_id'] = (int)$userId;

        $grades = Grade::findAll($filters, $page, $perPage);
        $courseIds = array_unique(array_filter(array_map(fn($g) => $g->course_id, $grades), fn($id) => $id > 0));
        $courseNames = [];
        if ($courseIds) {
            $db = Database::getInstance();
            $placeholders = implode(',', array_fill(0, count($courseIds), '?'));
            $stmt = $db->prepare("SELECT id, name, code FROM courses WHERE id IN ($placeholders)");
            $stmt->execute(array_values($courseIds));
            foreach ($stmt->fetchAll() as $c) {
                $courseNames[$c['id']] = $c['name'] . ($c['code'] ? ' (' . $c['code'] . ')' : '');
            }
        }

        $result = array_map(function($g) use ($courseNames) {
            $arr = $g->toArray();
            $arr['course_name'] = $courseNames[$g->course_id] ?? ('Course #' . $g->course_id);
            return $arr;
        }, $grades);

        Response::success([
            'grades' => $result,
        ]);
    }

    /**
     * POST /education/grades
     */
    public static function createGrade(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('user_id')->integer('user_id');
        $v->required('course_id')->integer('course_id');

        if (!$v->passes()) {
            Response::validationError('Grade submission failed.', $v->errors());
        }

        $data['graded_by'] = $authUser->id;

        if (isset($data['score']) && !isset($data['letter_grade'])) {
            $score = (float)$data['score'];
            if ($score >= 90) $data['letter_grade'] = 'A';
            elseif ($score >= 80) $data['letter_grade'] = 'B';
            elseif ($score >= 70) $data['letter_grade'] = 'C';
            elseif ($score >= 60) $data['letter_grade'] = 'D';
            else $data['letter_grade'] = 'F';
        }

        $grade = Grade::create($data);

        ActivityLog::log('education.grade_create', $authUser->id, 'grade', $grade->id, [
            'user_id'      => $data['user_id'],
            'course_id'    => $data['course_id'],
            'score'        => $data['score'] ?? null,
            'letter_grade' => $data['letter_grade'] ?? null,
        ]);

        Notification::create((int)$data['user_id'], 'Grade Posted', "Your grade for course has been posted.", 'info');

        Response::success(['grade' => $grade->toArray()], 'Grade recorded.');
    }

    /**
     * GET /education/students/{id}/grades
     */
    public static function studentGrades(int $id): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $grades = Grade::findAll(['user_id' => $id]);

        Response::success([
            'user_id' => $id,
            'grades'  => array_map(fn($g) => $g->toArray(), $grades),
        ]);
    }
}

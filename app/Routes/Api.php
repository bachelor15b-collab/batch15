<?php
/**
 * CS15 Hub API Router
 *
 * Dispatches requests to the appropriate controller and method.
 */
namespace App\Routes;

use App\Helpers\Response;

class Api
{
    private static array $routes = [];

    /**
     * Register a route.
     */
    public static function add(string $method, string $path, callable $handler): void
    {
        self::$routes[] = [
            'method'  => strtoupper($method),
            'path'    => $path,
            'handler' => $handler,
        ];
    }

    /**
     * Register GET route.
     */
    public static function get(string $path, callable $handler): void
    {
        self::add('GET', $path, $handler);
    }

    /**
     * Register POST route.
     */
    public static function post(string $path, callable $handler): void
    {
        self::add('POST', $path, $handler);
    }

    /**
     * Register PUT route.
     */
    public static function put(string $path, callable $handler): void
    {
        self::add('PUT', $path, $handler);
    }

    /**
     * Register PATCH route.
     */
    public static function patch(string $path, callable $handler): void
    {
        self::add('PATCH', $path, $handler);
    }

    /**
     * Register DELETE route.
     */
    public static function delete(string $path, callable $handler): void
    {
        self::add('DELETE', $path, $handler);
    }

    /**
     * Resolve the current request to a handler and execute it.
     */
    public static function resolve(string $method, string $uri): never
    {
        // Normalize path
        $path = parse_url($uri, PHP_URL_PATH);
        $path = rtrim($path, '/');
        if ($path === '' || $path === false) {
            $path = '/';
        }

        // Remove base path prefix (/B15/api)
        $base = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
        if ($base && stripos($path, $base) === 0) {
            $path = substr($path, strlen($base));
        }
        if ($path === '' || $path === false) {
            $path = '/';
        }

        $method = strtoupper($method);

        // CORS preflight handled in index.php

        foreach (self::$routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }

            $params = self::matchRoute($route['path'], $path);
            if ($params !== false) {
                // Call the handler with captured params
                call_user_func_array($route['handler'], $params);
                exit;
            }
        }

        // No route matched
        Response::notFound('API endpoint not found: ' . $method . ' ' . $path);
    }

    /**
     * Match a route pattern against the request path.
     * Supports {param} placeholders.
     */
    private static function matchRoute(string $pattern, string $path): array|false
    {
        // Convert route pattern to regex
        $regex = preg_replace('/\{(\w+)\}/', '(?P<$1>[^/]+)', $pattern);
        $regex = '#^' . $regex . '$#';

        if (preg_match($regex, $path, $matches)) {
            // Filter out numeric keys and URL-decode values
            $params = array_filter($matches, fn($key) => !is_int($key), ARRAY_FILTER_USE_KEY);
            return array_map('rawurldecode', array_values($params));
        }

        return false;
    }

    /**
     * Register all application routes.
     */
    public static function registerRoutes(): void
    {
        // â”€â”€â”€ Auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        self::post('/auth/register', ['App\\Controllers\\AuthController', 'register']);
        self::post('/auth/login',    ['App\\Controllers\\AuthController', 'login']);
        self::post('/auth/logout',   ['App\\Controllers\\AuthController', 'logout']);
        self::get('/auth/me',        ['App\\Controllers\\AuthController', 'me']);

        self::get('/auth/google',         ['App\\Controllers\\AuthController', 'googleLogin']);
        self::get('/auth/google/callback',['App\\Controllers\\AuthController', 'googleCallback']);

        self::post('/auth/avatar',   ['App\\Controllers\\AuthController', 'uploadAvatar']);
        self::delete('/auth/avatar', ['App\\Controllers\\AuthController', 'deleteAvatar']);
        // â”€â”€â”€ Users â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        self::get('/users',                ['App\\Controllers\\UserController', 'index']);
        self::get('/users/messaging',      ['App\\Controllers\\UserController', 'messagingContacts']);
        self::get('/users/leaderboard',    ['App\\Controllers\\UserController', 'leaderboard']);
        self::post('/users/xp/award',      ['App\\Controllers\\UserController', 'awardXp']);
        self::post('/users/claim-student', ['App\\Controllers\\UserController', 'claimStudent']);
        self::get('/users/claim-status',   ['App\\Controllers\\UserController', 'claimStatus']);
        self::get('/users/{id}',           ['App\\Controllers\\UserController', 'show']);
        self::put('/users/{id}',           ['App\\Controllers\\UserController', 'update']);

        // â”€â”€â”€ Admin â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        self::post('/admin/assign-role',        ['App\\Controllers\\AdminController', 'assignRole']);
        self::get('/admin/student-claims',                ['App\\Controllers\\AdminController', 'studentClaims']);
        self::post('/admin/student-claims/{id}/approve',  ['App\\Controllers\\AdminController', 'approveClaim']);
        self::post('/admin/student-claims/{id}/deny',     ['App\\Controllers\\AdminController', 'denyClaim']);
        self::get('/admin/users',               ['App\\Controllers\\AdminController', 'users']);
        self::put('/admin/users/{id}/suspend',  ['App\\Controllers\\AdminController', 'suspendUser']);
        self::put('/admin/users/{id}/restore',  ['App\\Controllers\\AdminController', 'restoreUser']);
        self::delete('/admin/users/{id}',       ['App\\Controllers\\AdminController', 'deleteUser']);
        self::get('/admin/config',              ['App\\Controllers\\AdminController', 'getConfig']);
        self::put('/admin/config',              ['App\\Controllers\\AdminController', 'updateConfig']);
        self::get('/admin/analytics',           ['App\\Controllers\\AdminController', 'analytics']);

        // â”€â”€â”€ Posts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        self::get('/posts',               ['App\\Controllers\\PostController', 'index']);
        self::post('/posts',              ['App\\Controllers\\PostController', 'create']);
        self::get('/posts/{slug}',        ['App\\Controllers\\PostController', 'show']);
        self::put('/posts/{id}',          ['App\\Controllers\\PostController', 'update']);
        self::delete('/posts/{id}',       ['App\\Controllers\\PostController', 'destroy']);

        // Comments & Likes
        self::get('/posts/{id}/comments',    ['App\\Controllers\\PostCommentController', 'index']);
        self::post('/posts/{id}/comments',   ['App\\Controllers\\PostCommentController', 'create']);
        self::delete('/comments/{id}',       ['App\\Controllers\\PostCommentController', 'destroy']);
        self::post('/comments/{id}/like',    ['App\\Controllers\\PostCommentController', 'toggleLike']);
        self::post('/posts/{id}/like',       ['App\\Controllers\\PostLikeController', 'toggle']);

        // â”€â”€â”€ Messages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        self::get('/messages/inbox',              ['App\\Controllers\\MessageController', 'inbox']);
        self::get('/messages/sent',               ['App\\Controllers\\MessageController', 'sent']);
        self::post('/messages',                   ['App\\Controllers\\MessageController', 'send']);
        self::get('/messages/conversations',      ['App\\Controllers\\MessageController', 'conversations']);
        self::get('/messages/conversation/{id}',  ['App\\Controllers\\MessageController', 'conversation']);
        self::get('/messages/search',             ['App\\Controllers\\MessageController', 'search']);
        self::get('/messages/unread-count',       ['App\\Controllers\\MessageController', 'unreadCount']);
        self::get('/messages/{id}',               ['App\\Controllers\\MessageController', 'show']);
        self::put('/messages/{id}/read',          ['App\\Controllers\\MessageController', 'markRead']);

        // â”€â”€â”€ Challenges â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        self::get('/challenges',                    ['App\\Controllers\\ChallengeController', 'index']);
        self::post('/challenges',                   ['App\\Controllers\\ChallengeController', 'create']);
        self::get('/challenges/{id}',               ['App\\Controllers\\ChallengeController', 'show']);
        self::put('/challenges/{id}',               ['App\\Controllers\\ChallengeController', 'update']);
        self::delete('/challenges/{id}',            ['App\\Controllers\\ChallengeController', 'destroy']);
        self::post('/challenges/{id}/submit',       ['App\\Controllers\\ChallengeController', 'submit']);
        self::post('/challenges/{id}/grade',        ['App\\Controllers\\ChallengeController', 'grade']);
        self::get('/challenges/{id}/submissions',   ['App\\Controllers\\ChallengeController', 'submissions']);

        // â”€â”€â”€ Elections â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        self::get('/elections',                    ['App\\Controllers\\ElectionController', 'index']);
        self::post('/elections',                   ['App\\Controllers\\ElectionController', 'create']);
        self::get('/elections/{id}',               ['App\\Controllers\\ElectionController', 'show']);
        self::put('/elections/{id}',               ['App\\Controllers\\ElectionController', 'update']);
        self::delete('/elections/{id}',            ['App\\Controllers\\ElectionController', 'destroy']);
        self::get('/elections/{id}/candidates',    ['App\\Controllers\\ElectionController', 'candidates']);
        self::post('/elections/{id}/candidates',   ['App\\Controllers\\ElectionController', 'addCandidate']);
        self::post('/elections/{id}/vote',         ['App\\Controllers\\ElectionController', 'vote']);
        self::get('/elections/{id}/results',       ['App\\Controllers\\ElectionController', 'results']);

        // â”€â”€â”€ SOC â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        self::get('/soc/login-attempts',    ['App\\Controllers\\SocController', 'loginAttempts']);
        self::get('/soc/activity-logs',     ['App\\Controllers\\SocController', 'activityLogs']);
        self::get('/soc/suspicious-ips',    ['App\\Controllers\\SocController', 'suspiciousIps']);
        self::post('/soc/block-ip',         ['App\\Controllers\\SocController', 'blockIp']);
        self::post('/soc/unblock-ip',       ['App\\Controllers\\SocController', 'unblockIp']);
        self::get('/soc/blocked-ips',       ['App\\Controllers\\SocController', 'blockedIps']);
        self::get('/soc/stats',              ['App\\Controllers\\SocController', 'stats']);
        self::post('/soc/users/{id}/suspend', ['App\\Controllers\\SocController', 'suspendUser']);
        self::post('/soc/users/{id}/restore', ['App\\Controllers\\SocController', 'restoreUser']);
        self::get('/soc/users',               ['App\\Controllers\\SocController', 'users']);
        self::put('/soc/users/{id}',          ['App\\Controllers\\SocController', 'updateUser']);
        self::get('/soc/users/{id}/activity', ['App\\Controllers\\SocController', 'userActivity']);
        self::get('/soc/users/{id}/ips',      ['App\\Controllers\\SocController', 'userIps']);
        self::delete('/soc/users/{id}',        ['App\\Controllers\\SocController', 'deleteUser']);

        // â”€â”€â”€ Analytics â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        self::get('/analytics/dashboard',   ['App\\Controllers\\AnalyticsController', 'dashboard']);
        self::get('/analytics/users',       ['App\\Controllers\\AnalyticsController', 'users']);
        self::get('/analytics/content',     ['App\\Controllers\\AnalyticsController', 'content']);
        self::get('/analytics/challenges',  ['App\\Controllers\\AnalyticsController', 'challenges']);

        // â”€â”€â”€ Notifications â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        self::get('/notifications',              ['App\\Controllers\\NotificationController', 'index']);
        self::get('/notifications/unread-count', ['App\\Controllers\\NotificationController', 'unreadCount']);
        self::put('/notifications/{id}/read',    ['App\\Controllers\\NotificationController', 'markRead']);
        self::put('/notifications/read-all',     ['App\\Controllers\\NotificationController', 'markAllRead']);

        // ─── Finance ─────────────────────────────────────────────
        self::get('/finance/dashboard',              ['App\\Controllers\\FinanceController', 'dashboard']);
        self::get('/finance/invoices',               ['App\\Controllers\\FinanceController', 'invoices']);
        self::post('/finance/invoices',              ['App\\Controllers\\FinanceController', 'createInvoice']);
        self::get('/finance/invoices/{id}',          ['App\\Controllers\\FinanceController', 'getInvoice']);
        self::put('/finance/invoices/{id}',          ['App\\Controllers\\FinanceController', 'updateInvoice']);
        self::delete('/finance/invoices/{id}',       ['App\\Controllers\\FinanceController', 'deleteInvoice']);
        self::get('/finance/payments',               ['App\\Controllers\\FinanceController', 'payments']);
        self::post('/finance/payments',              ['App\\Controllers\\FinanceController', 'recordPayment']);
        self::get('/finance/reports',                ['App\\Controllers\\FinanceController', 'reports']);
        // Financial Management (monthly student payments)
        self::get('/finance/records',                ['App\\Controllers\\FinanceController', 'records']);
        self::post('/finance/records',               ['App\\Controllers\\FinanceController', 'createRecord']);
        self::get('/finance/records/{id}',           ['App\\Controllers\\FinanceController', 'getRecord']);
        self::post('/finance/records/{id}/submit',   ['App\\Controllers\\FinanceController', 'submitRecord']);
        self::get('/finance/records/{id}/pdf',       ['App\\Controllers\\FinanceController', 'downloadPdf']);
        self::get('/finance/records/{id}/csv',       ['App\\Controllers\\FinanceController', 'downloadCsv']);
        self::put('/finance/records/{id}/payments/{studentId}', ['App\\Controllers\\FinanceController', 'togglePayment']);

        // ─── Assignments ─────────────────────────────────────────
        self::get('/assignments',                     ['App\\Controllers\\AssignmentController', 'index']);
        self::post('/assignments',                    ['App\\Controllers\\AssignmentController', 'create']);
        self::get('/assignments/my',                  ['App\\Controllers\\AssignmentController', 'myAssignments']);
        self::get('/assignments/submissions/unread',  ['App\\Controllers\\AssignmentController', 'unreadSubmissionsCount']);
        self::get('/assignments/{id}',                ['App\\Controllers\\AssignmentController', 'show']);
        self::put('/assignments/{id}',                ['App\\Controllers\\AssignmentController', 'update']);
        self::delete('/assignments/{id}',             ['App\\Controllers\\AssignmentController', 'destroy']);
        self::post('/assignments/{id}/submit',        ['App\\Controllers\\AssignmentController', 'submit']);
        self::get('/assignments/{id}/submissions',    ['App\\Controllers\\AssignmentController', 'submissions']);
        self::put('/submissions/{id}/grade',          ['App\\Controllers\\AssignmentController', 'gradeSubmission']);

        // ─── Education ───────────────────────────────────────────
        self::get('/education/dashboard',            ['App\\Controllers\\EducationController', 'dashboard']);
        self::get('/education/departments',          ['App\\Controllers\\EducationController', 'departments']);
        self::post('/education/departments',         ['App\\Controllers\\EducationController', 'createDepartment']);
        self::get('/education/semesters',            ['App\\Controllers\\EducationController', 'semesters']);
        self::post('/education/semesters',           ['App\\Controllers\\EducationController', 'createSemester']);
        self::get('/education/courses',              ['App\\Controllers\\EducationController', 'courses']);
        self::post('/education/courses',             ['App\\Controllers\\EducationController', 'createCourse']);
        self::get('/education/courses/{id}',         ['App\\Controllers\\EducationController', 'getCourse']);
        self::get('/education/courses/{id}/detail',  ['App\\Controllers\\EducationController', 'courseDetail']);
        self::put('/education/courses/{id}',         ['App\\Controllers\\EducationController', 'updateCourse']);
        self::delete('/education/courses/{id}',      ['App\\Controllers\\EducationController', 'deleteCourse']);
        self::get('/education/enrollments',          ['App\\Controllers\\EducationController', 'enrollments']);
        self::post('/education/enrollments',         ['App\\Controllers\\EducationController', 'createEnrollment']);
        self::get('/education/grades',               ['App\\Controllers\\EducationController', 'grades']);
        self::post('/education/grades',              ['App\\Controllers\\EducationController', 'createGrade']);
        self::get('/education/students/{id}/grades', ['App\\Controllers\\EducationController', 'studentGrades']);

        // ─── Lessons ─────────────────────────────────────────────
        self::get('/education/lessons',                  ['App\\Controllers\\LessonController', 'index']);
        self::post('/education/lessons',                 ['App\\Controllers\\LessonController', 'create']);
        self::get('/education/lessons/{id}',             ['App\\Controllers\\LessonController', 'show']);
        self::put('/education/lessons/{id}',             ['App\\Controllers\\LessonController', 'update']);
        self::delete('/education/lessons/{id}',          ['App\\Controllers\\LessonController', 'destroy']);
        self::get('/education/lessons/course/{courseId}',['App\\Controllers\\LessonController', 'byCourse']);

        // ─── Lesson Folders ──────────────────────────────────────
        self::get('/education/lesson-folders',                  ['App\\Controllers\\LessonFolderController', 'index']);
        self::post('/education/lesson-folders',                 ['App\\Controllers\\LessonFolderController', 'create']);
        self::get('/education/lesson-folders/{id}',             ['App\\Controllers\\LessonFolderController', 'show']);
        self::put('/education/lesson-folders/{id}',             ['App\\Controllers\\LessonFolderController', 'update']);
        self::delete('/education/lesson-folders/{id}',          ['App\\Controllers\\LessonFolderController', 'destroy']);
        self::get('/education/lesson-folders/course/{courseId}',['App\\Controllers\\LessonFolderController', 'byCourse']);

        // ─── Sports ──────────────────────────────────────────────
        self::get('/sports/dashboard',               ['App\\Controllers\\SportsController', 'dashboard']);
        self::get('/sports/teams',                   ['App\\Controllers\\SportsController', 'teams']);
        self::post('/sports/teams',                  ['App\\Controllers\\SportsController', 'createTeam']);
        self::get('/sports/teams/{id}',              ['App\\Controllers\\SportsController', 'getTeam']);
        self::put('/sports/teams/{id}',              ['App\\Controllers\\SportsController', 'updateTeam']);
        self::post('/sports/teams/{id}/members',     ['App\\Controllers\\SportsController', 'addTeamMember']);
        self::delete('/sports/teams/{id}/members/{userId}', ['App\\Controllers\\SportsController', 'removeTeamMember']);
        self::get('/sports/events',                  ['App\\Controllers\\SportsController', 'events']);
        self::post('/sports/events',                 ['App\\Controllers\\SportsController', 'createEvent']);
        self::get('/sports/events/{id}',             ['App\\Controllers\\SportsController', 'getEvent']);
        self::put('/sports/events/{id}/score',       ['App\\Controllers\\SportsController', 'updateEventScore']);
        self::put('/sports/events/{id}/status',      ['App\\Controllers\\SportsController', 'updateEventStatus']);

        // ─── Operations (Facilities & Bookings) ──────────────────
        self::get('/operations/dashboard',           ['App\\Controllers\\OperationsController', 'dashboard']);
        self::get('/operations/facilities',          ['App\\Controllers\\OperationsController', 'facilities']);
        self::post('/operations/facilities',         ['App\\Controllers\\OperationsController', 'createFacility']);
        self::get('/operations/facilities/{id}',     ['App\\Controllers\\OperationsController', 'getFacility']);
        self::put('/operations/facilities/{id}/status', ['App\\Controllers\\OperationsController', 'updateFacilityStatus']);
        self::get('/operations/bookings',            ['App\\Controllers\\OperationsController', 'bookings']);
        self::post('/operations/bookings',           ['App\\Controllers\\OperationsController', 'createBooking']);
        self::get('/operations/bookings/{id}',       ['App\\Controllers\\OperationsController', 'getBooking']);
        self::put('/operations/bookings/{id}/approve', ['App\\Controllers\\OperationsController', 'approveBooking']);
        self::put('/operations/bookings/{id}/reject',  ['App\\Controllers\\OperationsController', 'rejectBooking']);

        // ─── Monitor ─────────────────────────────────────────────
        self::get('/monitor/dashboard',              ['App\\Controllers\\MonitorController', 'dashboard']);
        self::get('/monitor/health',                 ['App\\Controllers\\MonitorController', 'health']);
        self::post('/monitor/health/check',          ['App\\Controllers\\MonitorController', 'runHealthCheck']);
        self::get('/monitor/incidents',              ['App\\Controllers\\MonitorController', 'incidents']);
        self::post('/monitor/incidents',             ['App\\Controllers\\MonitorController', 'createIncident']);
        self::get('/monitor/incidents/{id}',         ['App\\Controllers\\MonitorController', 'getIncident']);
        self::put('/monitor/incidents/{id}/assign',  ['App\\Controllers\\MonitorController', 'assignIncident']);
        self::put('/monitor/incidents/{id}/resolve', ['App\\Controllers\\MonitorController', 'resolveIncident']);
        self::get('/monitor/alerts',                 ['App\\Controllers\\MonitorController', 'alerts']);
        self::post('/monitor/alerts/acknowledge',    ['App\\Controllers\\MonitorController', 'acknowledgeAlert']);
        self::post('/monitor/alerts/acknowledge-all',['App\\Controllers\\MonitorController', 'acknowledgeAllAlerts']);
        self::get('/monitor/alert-rules',            ['App\\Controllers\\MonitorController', 'alertRules']);
        self::post('/monitor/alert-rules',           ['App\\Controllers\\MonitorController', 'createAlertRule']);
        self::put('/monitor/alert-rules/{id}',       ['App\\Controllers\\MonitorController', 'updateAlertRule']);
        self::delete('/monitor/alert-rules/{id}',    ['App\\Controllers\\MonitorController', 'deleteAlertRule']);

        // ——— Gallery ———
        self::get('/gallery',                    ['App\\Controllers\\GalleryController', 'index']);
        self::get('/gallery/{id}',               ['App\\Controllers\\GalleryController', 'show']);
        self::post('/gallery',                   ['App\\Controllers\\GalleryController', 'create']);
        self::post('/gallery/{id}/image',        ['App\\Controllers\\GalleryController', 'uploadImage']);
        self::put('/gallery/{id}',               ['App\\Controllers\\GalleryController', 'update']);
        self::delete('/gallery/{id}',            ['App\\Controllers\\GalleryController', 'destroy']);

        // ——— Projects ———
        self::get('/projects',                   ['App\\Controllers\\ProjectController', 'index']);
        self::get('/projects/{id}',              ['App\\Controllers\\ProjectController', 'show']);
        self::post('/projects',                  ['App\\Controllers\\ProjectController', 'create']);
        self::put('/projects/{id}',              ['App\\Controllers\\ProjectController', 'update']);
        self::delete('/projects/{id}',           ['App\\Controllers\\ProjectController', 'destroy']);

        // ——— Members ———
        self::get('/members',                    ['App\\Controllers\\MemberController', 'index']);
        self::get('/members/{id}',               ['App\\Controllers\\MemberController', 'show']);
        self::post('/members',                   ['App\\Controllers\\MemberController', 'create']);
        self::post('/members/{id}/picture',      ['App\\Controllers\\MemberController', 'uploadPicture']);
        self::put('/members/{id}',               ['App\\Controllers\\MemberController', 'update']);
        self::delete('/members/{id}',            ['App\\Controllers\\MemberController', 'destroy']);
        self::post('/members/{id}/approve',      ['App\\Controllers\\MemberController', 'approve']);
        self::post('/members/{id}/reject',       ['App\\Controllers\\MemberController', 'reject']);

        // ─── YouTube / Batch15Tube ──────────────────────────────
        self::get('/youtube/skills',               ['App\\Controllers\\YouTubeController', 'skills']);
        self::get('/youtube/skills/{id}',          ['App\\Controllers\\YouTubeController', 'skill']);
        self::get('/youtube/videos',               ['App\\Controllers\\YouTubeController', 'videos']);
        self::get('/youtube/videos/{id}',          ['App\\Controllers\\YouTubeController', 'video']);
        self::get('/youtube/search',               ['App\\Controllers\\YouTubeController', 'search']);
        self::get('/youtube/categories',           ['App\\Controllers\\YouTubeController', 'categories']);
        self::get('/youtube/featured',             ['App\\Controllers\\YouTubeController', 'featured']);
        self::post('/youtube/progress',            ['App\\Controllers\\YouTubeController', 'updateProgress']);
        self::get('/youtube/progress/{userId}',    ['App\\Controllers\\YouTubeController', 'userProgress']);
        self::get('/youtube/my-progress',          ['App\\Controllers\\YouTubeController', 'myProgress']);

        // ─── YouTube Admin CRUD ──────────────────────────────
        self::post('/youtube/admin/skills',          ['App\\Controllers\\YouTubeController', 'createSkill']);
        self::put('/youtube/admin/skills/{id}',      ['App\\Controllers\\YouTubeController', 'updateSkill']);
        self::delete('/youtube/admin/skills/{id}',   ['App\\Controllers\\YouTubeController', 'deleteSkill']);
        self::post('/youtube/admin/videos',          ['App\\Controllers\\YouTubeController', 'createVideo']);
        self::put('/youtube/admin/videos/{id}',      ['App\\Controllers\\YouTubeController', 'updateVideo']);
        self::delete('/youtube/admin/videos/{id}',   ['App\\Controllers\\YouTubeController', 'deleteVideo']);
    }
}




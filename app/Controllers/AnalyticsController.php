<?php
/**
 * Analytics Controller
 *
 * GET /analytics/dashboard
 * GET /analytics/users
 * GET /analytics/content
 * GET /analytics/challenges
 * GET /analytics/elections
 */
namespace App\Controllers;

use App\Helpers\Response;
use App\Middleware\AuthMiddleware;
use App\Middleware\RoleMiddleware;
use App\Config\Database;
use App\Models\User;
use App\Models\Post;
use App\Models\LoginAttempt;

class AnalyticsController
{
    /**
     * GET /analytics/dashboard — overview stats
     */
    public static function dashboard(): never
    {
        $authUser = AuthMiddleware::authenticate();
        // Allow all authenticated users for dashboard stats
        // (students & teachers see their own subset via frontend)

        $db = Database::getInstance();

        // Users
        $totalUsers     = User::countAll();
        $activeUsers    = User::countAll('', 'active');
        $students       = User::countAll('student');
        $teachers       = User::countAll('teacher');

        // Content
        $totalPosts   = Post::countAll();
        $publishedPost = Post::countAll(['status' => 'published']);

        // Login activity (24h)
        $login24h    = $db->query("SELECT COUNT(*) FROM login_attempts WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)")->fetchColumn();
        $failed24h   = $db->query("SELECT COUNT(*) FROM login_attempts WHERE success = 0 AND created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)")->fetchColumn();

        // Challenges
        $openChallenges = $db->query("SELECT COUNT(*) FROM challenges WHERE status = 'open'")->fetchColumn();
        $submissions    = $db->query("SELECT COUNT(*) FROM submissions")->fetchColumn();

        // Elections
        $activeElections = $db->query("SELECT COUNT(*) FROM elections WHERE status = 'active'")->fetchColumn();
        $totalVotes      = $db->query("SELECT COUNT(*) FROM votes")->fetchColumn();

        // Messages
        $totalMessages = $db->query("SELECT COUNT(*) FROM messages")->fetchColumn();
        $unreadMessages = $db->query("SELECT COUNT(*) FROM messages WHERE read_status = 0")->fetchColumn();

        // Recent registrations (30 days)
        $registrations = $db->query(
            "SELECT DATE(created_at) AS date, COUNT(*) AS count
             FROM users
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
             GROUP BY DATE(created_at)
             ORDER BY date"
        )->fetchAll();

        Response::success([
            'users' => [
                'total'   => (int) $totalUsers,
                'active'  => (int) $activeUsers,
                'students' => (int) $students,
                'teachers' => (int) $teachers,
            ],
            'content' => [
                'total_posts' => (int) $totalPosts,
                'published'   => (int) $publishedPost,
            ],
            'activity' => [
                'logins_24h'  => (int) $login24h,
                'failed_24h'  => (int) $failed24h,
                'messages'    => (int) $totalMessages,
                'unread'      => (int) $unreadMessages,
            ],
            'challenges' => [
                'open'        => (int) $openChallenges,
                'submissions' => (int) $submissions,
            ],
            'elections' => [
                'active'       => (int) $activeElections,
                'total_votes'  => (int) $totalVotes,
            ],
            'registrations_30d' => $registrations,
        ]);
    }

    /**
     * GET /analytics/users
     */
    public static function users(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $db = Database::getInstance();

        // Per role
        $roleStats = $db->query(
            "SELECT role_slug, COUNT(*) AS count FROM users GROUP BY role_slug ORDER BY count DESC"
        )->fetchAll();

        // Per status
        $statusStats = $db->query(
            "SELECT status, COUNT(*) AS count FROM users GROUP BY status"
        )->fetchAll();

        // Registration trend (12 months)
        $monthly = $db->query(
            "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
             FROM users
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
             GROUP BY month
             ORDER BY month"
        )->fetchAll();

        Response::success([
            'by_role'     => $roleStats,
            'by_status'   => $statusStats,
            'monthly'     => $monthly,
        ]);
    }

    /**
     * GET /analytics/content
     */
    public static function content(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $db = Database::getInstance();

        $byType = $db->query(
            "SELECT post_type, COUNT(*) AS count FROM content_posts GROUP BY post_type ORDER BY count DESC"
        )->fetchAll();

        $byStatus = $db->query(
            "SELECT status, COUNT(*) AS count FROM content_posts GROUP BY status"
        )->fetchAll();

        $byAuthor = $db->query(
            "SELECT cp.author_id, u.username, u.full_name, COUNT(*) AS count
             FROM content_posts cp
             JOIN users u ON u.id = cp.author_id
             GROUP BY cp.author_id, u.username, u.full_name
             ORDER BY count DESC
             LIMIT 10"
        )->fetchAll();

        Response::success([
            'by_type'   => $byType,
            'by_status' => $byStatus,
            'top_authors' => $byAuthor,
        ]);
    }

    /**
     * GET /analytics/challenges
     */
    public static function challenges(): never
    {
        $authUser = AuthMiddleware::authenticate();
        RoleMiddleware::requireAnyAdmin($authUser);

        $db = Database::getInstance();

        $byDifficulty = $db->query(
            "SELECT difficulty, COUNT(*) AS count FROM challenges GROUP BY difficulty"
        )->fetchAll();

        $byStatus = $db->query(
            "SELECT status, COUNT(*) AS count FROM challenges GROUP BY status"
        )->fetchAll();

        $topSubmitted = $db->query(
            "SELECT c.id, c.title, COUNT(s.id) AS submission_count
             FROM challenges c
             LEFT JOIN submissions s ON s.challenge_id = c.id
             GROUP BY c.id, c.title
             ORDER BY submission_count DESC
             LIMIT 10"
        )->fetchAll();

        Response::success([
            'by_difficulty'   => $byDifficulty,
            'by_status'       => $byStatus,
            'most_submitted'  => $topSubmitted,
        ]);
    }
}

<?php
/**
 * Login Attempt model for SOC monitoring.
 */
namespace App\Models;

use App\Config\Database;

class LoginAttempt
{
    /**
     * Record a login attempt.
     */
    public static function record(
        ?int $userId,
        ?string $email,
        string $ipAddress,
        bool $success,
        ?string $failReason = null,
        ?string $userAgent = null,
        ?string $os = null,
        ?string $browser = null,
        ?string $deviceType = null
    ): void {
        $db   = Database::getInstance();
        $ua = $userAgent ?? ($_SERVER['HTTP_USER_AGENT'] ?? null);
        if (!$os && $ua) {
            $parsed = \App\Helpers\UserAgentParser::parse($ua);
            $os = $parsed['os'];
            $browser = $parsed['browser'];
            $deviceType = $parsed['device_type'];
        }
        $stmt = $db->prepare(
            'INSERT INTO login_attempts (user_id, email, ip_address, user_agent, success, fail_reason, os, browser, device_type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $userId,
            $email,
            $ipAddress,
            $ua,
            $success ? 1 : 0,
            $failReason,
            $os,
            $browser,
            $deviceType,
        ]);
    }

    /**
     * Get recent failed attempts for a user.
     */
    public static function getRecentFailures(int $userId, int $minutes = 15): int
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT COUNT(*) FROM login_attempts
             WHERE user_id = ? AND success = 0 AND created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)'
        );
        $stmt->execute([$userId, $minutes]);
        return (int) $stmt->fetchColumn();
    }

    /**
     * Get how many seconds remain until the lockout lifts.
     */
    public static function getBlockSecondsRemaining(int $userId, int $minutes = 15): int
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT created_at FROM login_attempts
             WHERE user_id = ? AND success = 0
             ORDER BY created_at DESC LIMIT 5'
        );
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll();
        if (count($rows) < 5) {
            return 0;
        }
        $oldest       = strtotime(end($rows)['created_at']);
        $unblockAt    = $oldest + ($minutes * 60);
        return max(0, $unblockAt - time());
    }

    /**
     * Get recent failed attempts from an IP.
     */
    public static function getIpFailures(string $ip, int $minutes = 15): int
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT COUNT(*) FROM login_attempts
             WHERE ip_address = ? AND success = 0 AND created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)'
        );
        $stmt->execute([$ip, $minutes]);
        return (int) $stmt->fetchColumn();
    }

    /**
     * Find all login attempts with filters (for SOC).
     */
    public static function findAll(array $filters = [], int $page = 1, int $perPage = 50): array
    {
        $db     = Database::getInstance();
        $where  = [];
        $params = [];

        if (!empty($filters['ip_address'])) {
            $where[]  = 'la.ip_address = ?';
            $params[] = $filters['ip_address'];
        }
        if (!empty($filters['user_id'])) {
            $where[]  = 'la.user_id = ?';
            $params[] = (int) $filters['user_id'];
        }
        if (isset($filters['success']) && $filters['success'] !== '') {
            $where[]  = 'la.success = ?';
            $params[] = (int) $filters['success'];
        }
        if (!empty($filters['date_from'])) {
            $where[]  = 'la.created_at >= ?';
            $params[] = $filters['date_from'];
        }
        if (!empty($filters['date_to'])) {
            $where[]  = 'la.created_at <= ?';
            $params[] = $filters['date_to'];
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;

        $stmt = $db->prepare(
            "SELECT la.*, u.username, u.full_name
             FROM login_attempts la
             LEFT JOIN users u ON u.id = la.user_id
             {$whereClause}
             ORDER BY la.created_at DESC
             LIMIT ? OFFSET ?"
        );
        $params[] = $perPage;
        $params[] = $offset;
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Count login attempts with filters.
     */
    public static function countAll(array $filters = []): int
    {
        $db     = Database::getInstance();
        $where  = [];
        $params = [];

        if (!empty($filters['ip_address'])) {
            $where[]  = 'ip_address = ?';
            $params[] = $filters['ip_address'];
        }
        if (!empty($filters['user_id'])) {
            $where[]  = 'user_id = ?';
            $params[] = (int) $filters['user_id'];
        }
        if (isset($filters['success']) && $filters['success'] !== '') {
            $where[]  = 'success = ?';
            $params[] = (int) $filters['success'];
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $stmt = $db->prepare("SELECT COUNT(*) FROM login_attempts {$whereClause}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    /**
     * Get suspicious IPs (multiple failed attempts).
     */
    public static function getSuspiciousIps(int $threshold = 5, int $minutes = 30): array
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT ip_address, COUNT(*) AS attempts, MAX(created_at) AS last_attempt
             FROM login_attempts
             WHERE success = 0 AND created_at >= DATE_SUB(NOW(), INTERVAL ? MINUTE)
             GROUP BY ip_address
             HAVING attempts >= ?
             ORDER BY attempts DESC'
        );
        $stmt->execute([$minutes, $threshold]);
        return $stmt->fetchAll();
    }

    /**
     * Get login attempt statistics.
     */
    public static function getStats(string $period = '24h'): array
    {
        $db = Database::getInstance();

        switch ($period) {
            case '7d':
                $interval = '7 DAY';
                break;
            case '30d':
                $interval = '30 DAY';
                break;
            case '24h':
            default:
                $interval = '1 DAY';
                break;
        }

        $stmt = $db->prepare("
            SELECT
                SUM(success = 1) AS successful,
                SUM(success = 0) AS failed,
                COUNT(DISTINCT ip_address) AS unique_ips,
                COUNT(DISTINCT user_id) AS unique_users
            FROM login_attempts
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL {$interval})
        ");
        $stmt->execute();
        return $stmt->fetch();
    }
}

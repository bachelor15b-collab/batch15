<?php
/**
 * Activity Log model.
 */
namespace App\Models;

use App\Config\Database;

class ActivityLog
{
    public int $id;
    public ?int $user_id;
    public string $action;
    public ?string $entity_type;
    public ?int $entity_id;
    public ?string $details;
    public string $ip_address;
    public ?string $user_agent;
    public string $created_at;

    public function __construct(array $data) {}

    /**
     * Log an activity entry.
     */
    public static function log(
        string $action,
        ?int $userId = null,
        ?string $entityType = null,
        ?int $entityId = null,
        ?array $details = null,
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): void {
        $db = Database::getInstance();
        $ua = $userAgent ?? ($_SERVER['HTTP_USER_AGENT'] ?? null);
        $ip = $ipAddress ?? ($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0');
        $os = null;
        $browser = null;
        $deviceType = 'unknown';
        if ($ua) {
            $parsed = \App\Helpers\UserAgentParser::parse($ua);
            $os = $parsed['os'];
            $browser = $parsed['browser'];
            $deviceType = $parsed['device_type'];
        }
        $stmt = $db->prepare(
            'INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address, user_agent, os, browser, device_type)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $userId,
            $action,
            $entityType,
            $entityId,
            $details ? json_encode($details) : null,
            $ip,
            $ua,
            $os,
            $browser,
            $deviceType,
        ]);
    }

    /**
     * Find recent activity logs with optional filters.
     */
    public static function findAll(array $filters = [], int $page = 1, int $perPage = 50): array
    {
        $db     = Database::getInstance();
        $where  = [];
        $params = [];

        if (!empty($filters['user_id'])) {
            $where[]  = 'user_id = ?';
            $params[] = (int) $filters['user_id'];
        }
        if (!empty($filters['action'])) {
            $where[]  = 'action LIKE ?';
            $params[] = '%' . $filters['action'] . '%';
        }
        if (!empty($filters['entity_type'])) {
            $where[]  = 'entity_type = ?';
            $params[] = $filters['entity_type'];
        }
        if (!empty($filters['ip_address'])) {
            $where[]  = 'ip_address = ?';
            $params[] = $filters['ip_address'];
        }
        if (!empty($filters['date_from'])) {
            $where[]  = 'created_at >= ?';
            $params[] = $filters['date_from'];
        }
        if (!empty($filters['date_to'])) {
            $where[]  = 'created_at <= ?';
            $params[] = $filters['date_to'];
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;

        $stmt = $db->prepare(
            "SELECT al.*, u.username, u.full_name
             FROM activity_logs al
             LEFT JOIN users u ON u.id = al.user_id
             {$whereClause}
             ORDER BY al.created_at DESC
             LIMIT ? OFFSET ?"
        );
        $params[] = $perPage;
        $params[] = $offset;
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Count logs with optional filters.
     */
    public static function countAll(array $filters = []): int
    {
        $db     = Database::getInstance();
        $where  = [];
        $params = [];

        if (!empty($filters['user_id'])) {
            $where[]  = 'user_id = ?';
            $params[] = (int) $filters['user_id'];
        }
        if (!empty($filters['action'])) {
            $where[]  = 'action LIKE ?';
            $params[] = '%' . $filters['action'] . '%';
        }
        if (!empty($filters['ip_address'])) {
            $where[]  = 'ip_address = ?';
            $params[] = $filters['ip_address'];
        }
        if (!empty($filters['date_from'])) {
            $where[]  = 'created_at >= ?';
            $params[] = $filters['date_from'];
        }
        if (!empty($filters['date_to'])) {
            $where[]  = 'created_at <= ?';
            $params[] = $filters['date_to'];
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $stmt = $db->prepare("SELECT COUNT(*) FROM activity_logs {$whereClause}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    /**
     * Get activity summary grouped by action.
     */
    public static function getSummary(string $period = '24h'): array
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

        $stmt = $db->prepare(
            "SELECT action, COUNT(*) AS count
             FROM activity_logs
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL {$interval})
             GROUP BY action
             ORDER BY count DESC
             LIMIT 20"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }
}

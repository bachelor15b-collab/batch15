<?php
namespace App\Models;
use App\Config\Database;

class Alert
{
    public static function findAll(array $filters = [], int $page = 1, int $perPage = 20): array
    {
        $db = Database::getInstance();
        $where = [];
        $params = [];
        if (!empty($filters['severity'])) {
            $where[] = 'severity = ?';
            $params[] = $filters['severity'];
        }
        if (isset($filters['acknowledged'])) {
            $where[] = 'acknowledged = ?';
            $params[] = (int)$filters['acknowledged'];
        }
        $clause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;
        $stmt = $db->prepare("SELECT * FROM alerts {$clause} ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $params[] = $perPage;
        $params[] = $offset;
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function create(array $data): void
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('INSERT INTO alerts (rule_id, title, message, severity) VALUES (?, ?, ?, ?)');
        $stmt->execute([
            $data['rule_id'] ?? null,
            $data['title'] ?? '',
            $data['message'] ?? '',
            $data['severity'] ?? 'medium',
        ]);
    }

    public static function acknowledge(int $alertId, int $userId): bool
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('UPDATE alerts SET acknowledged = 1, acknowledged_by = ? WHERE id = ?');
        return $stmt->execute([$userId, $alertId]);
    }

    public static function acknowledgeAll(int $userId): bool
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('UPDATE alerts SET acknowledged = 1, acknowledged_by = ? WHERE acknowledged = 0');
        return $stmt->execute([$userId]);
    }

    public static function countUnacknowledged(): int
    {
        $db = Database::getInstance();
        return (int)$db->query('SELECT COUNT(*) FROM alerts WHERE acknowledged = 0')->fetchColumn();
    }
}

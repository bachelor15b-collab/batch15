<?php
/**
 * Blocked IPs model (SOC feature).
 */
namespace App\Models;

use App\Config\Database;

class BlockedIp
{
    public static function block(string $ip, string $reason, int $blockedBy): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO blocked_ips (ip_address, reason, blocked_by) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE reason = VALUES(reason), blocked_by = VALUES(blocked_by)'
        );
        return $stmt->execute([$ip, $reason, $blockedBy]);
    }

    public static function unblock(string $ip): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('DELETE FROM blocked_ips WHERE ip_address = ?');
        return $stmt->execute([$ip]);
    }

    public static function isBlocked(string $ip): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT COUNT(*) FROM blocked_ips WHERE ip_address = ?');
        $stmt->execute([$ip]);
        return (int) $stmt->fetchColumn() > 0;
    }

    public static function findAll(int $page = 1, int $perPage = 50): array
    {
        $db     = Database::getInstance();
        $offset = ($page - 1) * $perPage;
        $stmt   = $db->prepare(
            'SELECT bi.*, u.username AS blocker_username
             FROM blocked_ips bi
             LEFT JOIN users u ON u.id = bi.blocked_by
             ORDER BY bi.created_at DESC
             LIMIT ? OFFSET ?'
        );
        $stmt->execute([$perPage, $offset]);
        return $stmt->fetchAll();
    }
}

<?php
/**
 * User XP / Leaderboard model.
 */
namespace App\Models;

use App\Config\Database;

class UserXp
{
    public static function award(int $userId, int $xp): void
    {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO user_xp (user_id, total_xp, level)
             VALUES (?, ?, 1)
             ON DUPLICATE KEY UPDATE total_xp = total_xp + ?'
        );
        $stmt->execute([$userId, $xp, $xp]);

        // Recalculate level
        self::recalculateLevel($userId);
    }

    public static function recalculateLevel(int $userId): void
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT total_xp FROM user_xp WHERE user_id = ?');
        $stmt->execute([$userId]);
        $xp = (int) $stmt->fetchColumn();

        // Level formula: every 500 XP = 1 level
        $level = max(1, floor($xp / 500) + 1);

        $stmt = $db->prepare('UPDATE user_xp SET level = ? WHERE user_id = ?');
        $stmt->execute([$level, $userId]);
    }

    public static function getLeaderboard(int $limit = 20): array
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT u.id, u.username, u.full_name, u.avatar_url, ux.total_xp, ux.level
             FROM user_xp ux
             JOIN users u ON u.id = ux.user_id
             WHERE u.status = ?
             ORDER BY ux.total_xp DESC
             LIMIT ?'
        );
        $stmt->execute(['active', $limit]);
        return $stmt->fetchAll();
    }

    public static function getRank(int $userId): ?array
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT u.id, u.username, u.full_name, u.avatar_url, ux.total_xp, ux.level
             FROM user_xp ux
             JOIN users u ON u.id = ux.user_id
             WHERE u.id = ?'
        );
        $stmt->execute([$userId]);
        $row = $stmt->fetch();
        if (!$row) return null;

        // Calculate rank
        $rankStmt = $db->prepare(
            'SELECT COUNT(*) + 1 AS rank FROM user_xp WHERE total_xp > ?'
        );
        $rankStmt->execute([$row['total_xp']]);
        $row['rank'] = (int) $rankStmt->fetchColumn();
        return $row;
    }
}

<?php
namespace App\Models;
use App\Config\Database;
class UserAchievement {
    public static function award(int $userId, int $achievementId): bool {
        $db = Database::getInstance();
        $s = $db->prepare('INSERT IGNORE INTO user_achievements (user_id,achievement_id) VALUES (?,?)');
        $s->execute([$userId, $achievementId]);
        if ($s && $s->rowCount() > 0) {
            $ach = Achievement::findById($achievementId);
            if ($ach) { UserXp::award($userId, $ach->xp_reward); }
            return true;
        }
        return false;
    }
    public static function findByUser(int $userId): array {
        $db = Database::getInstance();
        $s = $db->prepare('SELECT ua.*,a.name,a.description,a.icon,a.xp_reward FROM user_achievements ua JOIN achievements a ON a.id=ua.achievement_id WHERE ua.user_id=? ORDER BY ua.earned_at DESC');
        $s->execute([$userId]);
        return $s->fetchAll();
    }
    public static function countByUser(int $userId): int {
        $db = Database::getInstance();
        $s = $db->prepare('SELECT COUNT(*) FROM user_achievements WHERE user_id=?');
        $s->execute([$userId]);
        return (int) $s->fetchColumn();
    }
}

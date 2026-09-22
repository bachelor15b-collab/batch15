<?php
namespace App\Models;

use App\Config\Database;

class PostCommentLike
{
    private static function ensureTable(): void
    {
        $db = Database::getInstance();
        $db->exec('CREATE TABLE IF NOT EXISTS comment_likes (
            id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            comment_id INT UNSIGNED NOT NULL,
            user_id    INT UNSIGNED NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uk_comment_like (comment_id, user_id),
            INDEX idx_cl_comment (comment_id),
            INDEX idx_cl_user (user_id)
        ) ENGINE=InnoDB');
    }

    public static function toggle(int $commentId, int $userId): array
    {
        self::ensureTable();
        $db = Database::getInstance();

        $stmt = $db->prepare('SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ? LIMIT 1');
        $stmt->execute([$commentId, $userId]);
        $existing = $stmt->fetch();

        if ($existing) {
            $db->prepare('DELETE FROM comment_likes WHERE id = ?')->execute([$existing['id']]);
            return ['liked' => false];
        } else {
            $db->prepare('INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)')->execute([$commentId, $userId]);
            return ['liked' => true];
        }
    }

    public static function isLiked(int $commentId, int $userId): bool
    {
        self::ensureTable();
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT id FROM comment_likes WHERE comment_id = ? AND user_id = ? LIMIT 1');
        $stmt->execute([$commentId, $userId]);
        return (bool) $stmt->fetch();
    }

    public static function countByComment(int $commentId): int
    {
        self::ensureTable();
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT COUNT(*) FROM comment_likes WHERE comment_id = ?');
        $stmt->execute([$commentId]);
        return (int) $stmt->fetchColumn();
    }
}

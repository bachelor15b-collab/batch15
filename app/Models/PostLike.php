<?php
namespace App\Models;

use App\Config\Database;

class PostLike
{
    public static function toggle(int $postId, int $userId): array
    {
        $db = Database::getInstance();

        $stmt = $db->prepare('SELECT id FROM post_likes WHERE post_id = ? AND user_id = ? LIMIT 1');
        $stmt->execute([$postId, $userId]);
        $existing = $stmt->fetch();

        if ($existing) {
            $db->prepare('DELETE FROM post_likes WHERE id = ?')->execute([$existing['id']]);
            $db->prepare('UPDATE content_posts SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?')->execute([$postId]);
            return ['liked' => false];
        } else {
            $db->prepare('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)')->execute([$postId, $userId]);
            $db->prepare('UPDATE content_posts SET likes_count = likes_count + 1 WHERE id = ?')->execute([$postId]);
            return ['liked' => true];
        }
    }

    public static function isLiked(int $postId, int $userId): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT id FROM post_likes WHERE post_id = ? AND user_id = ? LIMIT 1');
        $stmt->execute([$postId, $userId]);
        return (bool) $stmt->fetch();
    }

    public static function countByPost(int $postId): int
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT COUNT(*) FROM post_likes WHERE post_id = ?');
        $stmt->execute([$postId]);
        return (int) $stmt->fetchColumn();
    }
}

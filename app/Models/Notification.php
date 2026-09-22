<?php
/**
 * Notification model.
 */
namespace App\Models;

use App\Config\Database;

class Notification
{
    /**
     * Create a notification.
     */
    public static function create(
        int $userId,
        string $title,
        string $message,
        string $type = 'info',
        ?string $referenceType = null,
        ?int $referenceId = null
    ): bool {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO notifications (user_id, title, message, type, reference_type, reference_id)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        return $stmt->execute([$userId, $title, $message, $type, $referenceType, $referenceId]);
    }

    /**
     * Get notifications for a user.
     */
    public static function findForUser(int $userId, int $page = 1, int $perPage = 20): array
    {
        $db     = Database::getInstance();
        $offset = ($page - 1) * $perPage;
        $stmt   = $db->prepare(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
        );
        $stmt->execute([$userId, $perPage, $offset]);
        return $stmt->fetchAll();
    }

    /**
     * Count unread notifications.
     */
    public static function unreadCount(int $userId): int
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT COUNT(*) FROM notifications WHERE user_id = ? AND read_status = 0');
        $stmt->execute([$userId]);
        return (int) $stmt->fetchColumn();
    }

    /**
     * Mark a notification as read.
     */
    public static function markAsRead(int $id, int $userId): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('UPDATE notifications SET read_status = 1 WHERE id = ? AND user_id = ?');
        return $stmt->execute([$id, $userId]);
    }

    /**
     * Mark all notifications as read for a user.
     */
    public static function markAllAsRead(int $userId): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('UPDATE notifications SET read_status = 1 WHERE user_id = ? AND read_status = 0');
        return $stmt->execute([$userId]);
    }

    /**
     * Broadcast to all users of a specific role.
     */
    public static function broadcastToRole(
        string $roleSlug,
        string $title,
        string $message,
        string $type = 'info',
        ?string $referenceType = null,
        ?int $referenceId = null
    ): int {
        $users = User::findAll($roleSlug, 'active');
        $count = 0;
        foreach ($users as $user) {
            self::create($user->id, $title, $message, $type, $referenceType, $referenceId);
            $count++;
        }
        return $count;
    }
}

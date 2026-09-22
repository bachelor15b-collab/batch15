<?php
/**
 * Message model.
 */
namespace App\Models;

use App\Config\Database;

class Message
{
    public int $id;
    public int $sender_id;
    public int $receiver_id;
    public ?string $subject;
    public string $message;
    public ?string $attachment;
    public int $read_status;
    public ?int $parent_id;
    public string $created_at;

    public function __construct(array $data)
    {
        $this->id          = (int) $data['id'];
        $this->sender_id   = (int) $data['sender_id'];
        $this->receiver_id = (int) $data['receiver_id'];
        $this->subject     = $data['subject'] ?? null;
        $this->message     = $data['message'];
        $this->attachment  = $data['attachment'] ?? null;
        $this->read_status = (int) ($data['read_status'] ?? 0);
        $this->parent_id   = isset($data['parent_id']) ? (int) $data['parent_id'] : null;
        $this->created_at  = $data['created_at'];
    }

    public static function findById(int $id): ?self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM messages WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function inbox(int $userId, int $page = 1, int $perPage = 20): array
    {
        $db     = Database::getInstance();
        $offset = ($page - 1) * $perPage;
        $stmt   = $db->prepare(
            'SELECT m.*, u.username AS sender_username, u.full_name AS sender_name
             FROM messages m
             JOIN users u ON u.id = m.sender_id
             WHERE m.receiver_id = ?
             ORDER BY m.created_at DESC
             LIMIT ? OFFSET ?'
        );
        $stmt->execute([$userId, $perPage, $offset]);
        return $stmt->fetchAll();
    }

    public static function sent(int $userId, int $page = 1, int $perPage = 20): array
    {
        $db     = Database::getInstance();
        $offset = ($page - 1) * $perPage;
        $stmt   = $db->prepare(
            'SELECT m.*, u.username AS receiver_username, u.full_name AS receiver_name
             FROM messages m
             JOIN users u ON u.id = m.receiver_id
             WHERE m.sender_id = ?
             ORDER BY m.created_at DESC
             LIMIT ? OFFSET ?'
        );
        $stmt->execute([$userId, $perPage, $offset]);
        return $stmt->fetchAll();
    }

    public static function unreadCount(int $userId): int
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT COUNT(*) FROM messages WHERE receiver_id = ? AND read_status = 0');
        $stmt->execute([$userId]);
        return (int) $stmt->fetchColumn();
    }

    public static function create(array $data): self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO messages (sender_id, receiver_id, subject, message, attachment, parent_id)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['sender_id'],
            $data['receiver_id'],
            $data['subject'] ?? null,
            $data['message'],
            $data['attachment'] ?? null,
            $data['parent_id'] ?? null,
        ]);
        return self::findById((int) $db->lastInsertId());
    }

    public function markAsRead(): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('UPDATE messages SET read_status = 1 WHERE id = ?');
        return $stmt->execute([$this->id]);
    }

    public function sender(): ?User
    {
        return User::findById($this->sender_id);
    }

    public function receiver(): ?User
    {
        return User::findById($this->receiver_id);
    }

    public static function conversations(int $userId): array
    {
        $db = Database::getInstance();
        $sql = '
            SELECT
                partner.partner_id,
                u.full_name, u.username, u.avatar_url,
                (SELECT message FROM messages
                 WHERE (sender_id = ? AND receiver_id = partner.partner_id)
                    OR (sender_id = partner.partner_id AND receiver_id = ?)
                 ORDER BY created_at DESC LIMIT 1) AS last_message,
                (SELECT created_at FROM messages
                 WHERE (sender_id = ? AND receiver_id = partner.partner_id)
                    OR (sender_id = partner.partner_id AND receiver_id = ?)
                 ORDER BY created_at DESC LIMIT 1) AS last_message_at,
                (SELECT COUNT(*) FROM messages
                 WHERE receiver_id = ? AND sender_id = partner.partner_id AND read_status = 0) AS unread_count
            FROM (
                SELECT DISTINCT
                    CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END AS partner_id
                FROM messages m
                WHERE ? IN (m.sender_id, m.receiver_id)
            ) AS partner
            JOIN users u ON u.id = partner.partner_id
            ORDER BY last_message_at DESC
        ';
        $stmt = $db->prepare($sql);
        $stmt->execute([$userId, $userId, $userId, $userId, $userId, $userId, $userId]);
        return $stmt->fetchAll();
    }

    public static function conversationMessages(int $userId, int $partnerId, int $page = 1, int $perPage = 50): array
    {
        $db     = Database::getInstance();
        $offset = ($page - 1) * $perPage;
        $stmt   = $db->prepare(
            'SELECT m.*,
                u1.username AS sender_username, u1.full_name AS sender_name, u1.avatar_url AS sender_avatar,
                u2.username AS receiver_username, u2.full_name AS receiver_name, u2.avatar_url AS receiver_avatar
             FROM messages m
             JOIN users u1 ON u1.id = m.sender_id
             JOIN users u2 ON u2.id = m.receiver_id
             WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
             ORDER BY m.created_at ASC
             LIMIT ? OFFSET ?'
        );
        $stmt->execute([$userId, $partnerId, $partnerId, $userId, $perPage, $offset]);
        return $stmt->fetchAll();
    }

    public static function search(int $userId, string $query): array
    {
        $db   = Database::getInstance();
        $like = '%' . $query . '%';
        $stmt = $db->prepare(
            'SELECT m.*,
                CASE WHEN m.sender_id = ? THEN u_recv.username ELSE u_send.username END AS partner_username,
                CASE WHEN m.sender_id = ? THEN u_recv.full_name ELSE u_send.full_name END AS partner_name,
                CASE WHEN m.sender_id = ? THEN u_recv.avatar_url ELSE u_send.avatar_url END AS partner_avatar
             FROM messages m
             JOIN users u_send ON u_send.id = m.sender_id
             JOIN users u_recv ON u_recv.id = m.receiver_id
             WHERE ? IN (m.sender_id, m.receiver_id) AND m.message LIKE ?
             ORDER BY m.created_at DESC'
        );
        $stmt->execute([$userId, $userId, $userId, $userId, $like]);
        return $stmt->fetchAll();
    }

    public static function markConversationAsRead(int $userId, int $partnerId): int
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'UPDATE messages SET read_status = 1 WHERE receiver_id = ? AND sender_id = ? AND read_status = 0'
        );
        $stmt->execute([$userId, $partnerId]);
        return $stmt->rowCount();
    }
}

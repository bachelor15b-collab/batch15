<?php
namespace App\Models;

use App\Config\Database;

class PostComment
{
    public int $id;
    public int $post_id;
    public int $user_id;
    public ?int $parent_id;
    public string $content;
    public string $created_at;
    public string $updated_at;

    public function __construct(array $data)
    {
        $this->id         = (int) $data['id'];
        $this->post_id    = (int) $data['post_id'];
        $this->user_id    = (int) $data['user_id'];
        $this->parent_id  = isset($data['parent_id']) ? (int) $data['parent_id'] : null;
        $this->content    = $data['content'];
        $this->created_at = $data['created_at'];
        $this->updated_at = $data['updated_at'] ?? $data['created_at'];
    }

    public static function findById(int $id): ?self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM post_comments WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findByPost(int $postId): array
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT * FROM post_comments WHERE post_id = ? ORDER BY created_at ASC'
        );
        $stmt->execute([$postId]);
        $rows = $stmt->fetchAll();
        $comments = [];
        foreach ($rows as $row) {
            $comments[] = new self($row);
        }
        return $comments;
    }

    public static function create(array $data): self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO post_comments (post_id, user_id, parent_id, content) VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['post_id'],
            $data['user_id'],
            $data['parent_id'] ?? null,
            $data['content'],
        ]);
        return self::findById((int) $db->lastInsertId());
    }

    public function delete(): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('DELETE FROM post_comments WHERE id = ?');
        return $stmt->execute([$this->id]);
    }

    public function user(): ?User
    {
        return User::findById($this->user_id);
    }

    public function replies(): array
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT * FROM post_comments WHERE parent_id = ? ORDER BY created_at ASC'
        );
        $stmt->execute([$this->id]);
        $rows = $stmt->fetchAll();
        $replies = [];
        foreach ($rows as $row) {
            $replies[] = new self($row);
        }
        return $replies;
    }

    public function toArray(?int $authUserId = null): array
    {
        $author = $this->user();
        $arr = [
            'id'         => $this->id,
            'post_id'    => $this->post_id,
            'user_id'    => $this->user_id,
            'parent_id'  => $this->parent_id,
            'content'    => $this->content,
            'created_at' => $this->created_at,
            'user'       => $author ? $author->toArray() : null,
            'likes_count' => PostCommentLike::countByComment($this->id),
        ];
        if ($authUserId !== null) {
            $arr['is_liked'] = PostCommentLike::isLiked($this->id, $authUserId);
        }
        return $arr;
    }
}

<?php
/**
 * Content Post model — unified content engine.
 */
namespace App\Models;

use App\Config\Database;

class Post
{
    public int $id;
    public string $title;
    public string $slug;
    public ?string $excerpt;
    public ?string $content;
    public string $post_type;
    public int $author_id;
    public string $status;
    public ?string $meta;
    public string $created_at;
    public string $updated_at;
    public int $likes_count = 0;
    public int $comments_count = 0;

    public function __construct(array $data)
    {
        $this->id        = (int) $data['id'];
        $this->title     = $data['title'];
        $this->slug      = $data['slug'];
        $this->excerpt   = $data['excerpt'] ?? null;
        $this->content   = $data['content'] ?? null;
        $this->post_type = $data['post_type'];
        $this->author_id = (int) $data['author_id'];
        $this->status    = $data['status'];
        $this->meta      = $data['meta'] ?? null;
        $this->created_at = $data['created_at'];
        $this->updated_at = $data['updated_at'] ?? $data['created_at'];
        $this->likes_count = (int) ($data['likes_count'] ?? 0);
        $this->comments_count = (int) ($data['comments_count'] ?? 0);
    }

    public static function findById(int $id): ?self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM content_posts WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findBySlug(string $slug): ?self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM content_posts WHERE slug = ? LIMIT 1');
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findAll(array $filters = [], int $page = 1, int $perPage = 20): array
    {
        $db     = Database::getInstance();
        $where  = [];
        $params = [];

        if (!empty($filters['post_type'])) {
            $where[]  = 'post_type = ?';
            $params[] = $filters['post_type'];
        }
        if (!empty($filters['status'])) {
            $where[]  = 'status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['author_id'])) {
            $where[]  = 'author_id = ?';
            $params[] = (int) $filters['author_id'];
        }
        if (!empty($filters['search'])) {
            $where[]  = '(title LIKE ? OR content LIKE ?)';
            $search   = '%' . $filters['search'] . '%';
            $params[] = $search;
            $params[] = $search;
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;

        $stmt = $db->prepare("SELECT * FROM content_posts {$whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $params[] = $perPage;
        $params[] = $offset;
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $posts = [];
        foreach ($rows as $row) {
            $posts[] = new self($row);
        }
        return $posts;
    }

    public static function countAll(array $filters = []): int
    {
        $db     = Database::getInstance();
        $where  = [];
        $params = [];

        if (!empty($filters['post_type'])) {
            $where[]  = 'post_type = ?';
            $params[] = $filters['post_type'];
        }
        if (!empty($filters['status'])) {
            $where[]  = 'status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['author_id'])) {
            $where[]  = 'author_id = ?';
            $params[] = (int) $filters['author_id'];
        }
        if (!empty($filters['search'])) {
            $where[]  = '(title LIKE ? OR content LIKE ?)';
            $search   = '%' . $filters['search'] . '%';
            $params[] = $search;
            $params[] = $search;
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $stmt = $db->prepare("SELECT COUNT(*) FROM content_posts {$whereClause}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public static function create(array $data): self
    {
        $db = Database::getInstance();

        // Generate unique slug
        $slug = $data['slug'] ?? self::generateSlug($data['title']);

        $stmt = $db->prepare(
            'INSERT INTO content_posts (title, slug, excerpt, content, post_type, author_id, status, meta)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['title'],
            $slug,
            $data['excerpt'] ?? null,
            $data['content'] ?? null,
            $data['post_type'] ?? 'blog',
            $data['author_id'],
            $data['status'] ?? 'draft',
            isset($data['meta']) ? json_encode($data['meta']) : null,
        ]);

        return self::findById((int) $db->lastInsertId());
    }

    public function update(array $data): bool
    {
        $db     = Database::getInstance();
        $sets   = [];
        $params = [];

        $allowed = ['title', 'excerpt', 'content', 'post_type', 'status', 'meta'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $sets[]   = "{$field} = ?";
                $params[] = $field === 'meta' && is_array($data[$field])
                    ? json_encode($data[$field])
                    : $data[$field];
            }
        }

        if (isset($data['slug'])) {
            $sets[]   = 'slug = ?';
            $params[] = $data['slug'];
        }

        if (empty($sets)) {
            return false;
        }

        $params[] = $this->id;
        $stmt = $db->prepare('UPDATE content_posts SET ' . implode(', ', $sets) . ' WHERE id = ?');
        return $stmt->execute($params);
    }

    public function delete(): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('DELETE FROM content_posts WHERE id = ?');
        return $stmt->execute([$this->id]);
    }

    public function author(): ?User
    {
        return User::findById($this->author_id);
    }

    public function toArray(): array
    {
        return [
            'id'        => $this->id,
            'title'     => $this->title,
            'slug'      => $this->slug,
            'excerpt'   => $this->excerpt,
            'content'   => $this->content,
            'post_type' => $this->post_type,
            'author_id' => $this->author_id,
            'status'    => $this->status,
            'meta'      => $this->meta ? json_decode($this->meta, true) : null,
            'likes_count' => $this->likes_count,
            'comments_count' => $this->comments_count,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    public static function generateSlug(string $title, int $suffix = 0): string
    {
        $slug = mb_strtolower(trim($title));
        $slug = preg_replace('/[^a-z0-9]+/', '-', $slug);
        $slug = trim($slug, '-');
        if ($suffix > 0) {
            $slug .= '-' . $suffix;
        }

        // Check uniqueness
        $existing = self::findBySlug($slug);
        if ($existing) {
            return self::generateSlug($title, $suffix + 1);
        }

        return $slug;
    }
}

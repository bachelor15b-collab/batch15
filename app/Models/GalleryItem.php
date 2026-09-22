<?php
namespace App\Models;

use App\Config\Database;

class GalleryItem
{
    public int $id;
    public string $title;
    public ?string $description;
    public ?string $image_url;
    public ?string $video_url;
    public string $category;
    public ?int $author_id;
    public ?string $author_name;
    public string $status;
    public string $created_at;
    public string $updated_at;

    public function __construct(array $data = [])
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    public static function findById(int $id): ?self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM gallery_items WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findAll(array $filters = [], int $page = 1, int $perPage = 50): array
    {
        $db = Database::getInstance();
        $where = [];
        $params = [];

        if (!empty($filters['status'])) {
            $where[] = 'g.status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['category'])) {
            $where[] = 'g.category = ?';
            $params[] = $filters['category'];
        }
        if (!empty($filters['search'])) {
            $where[] = '(g.title LIKE ? OR g.description LIKE ?)';
            $s = '%' . $filters['search'] . '%';
            $params[] = $s;
            $params[] = $s;
        }

        $wc = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;

        $stmt = $db->prepare("SELECT g.* FROM gallery_items g {$wc} ORDER BY g.created_at DESC LIMIT ? OFFSET ?");
        $params[] = $perPage;
        $params[] = $offset;
        $stmt->execute($params);
        return array_map(fn($r) => new self($r), $stmt->fetchAll());
    }

    public static function countAll(array $filters = []): int
    {
        $db = Database::getInstance();
        $where = [];
        $params = [];

        if (!empty($filters['status'])) {
            $where[] = 'status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['category'])) {
            $where[] = 'category = ?';
            $params[] = $filters['category'];
        }

        $wc = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $stmt = $db->prepare("SELECT COUNT(*) FROM gallery_items {$wc}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public function create(): int
    {
        $db = Database::getInstance();
        $stmt = $db->prepare("INSERT INTO gallery_items
            (title, description, image_url, video_url, category, author_id, author_name, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $this->title, $this->description, $this->image_url, $this->video_url,
            $this->category, $this->author_id, $this->author_name, $this->status ?? 'published',
        ]);
        $this->id = (int) $db->lastInsertId();
        return $this->id;
    }

    public function update(array $data): void
    {
        $allowed = ['title', 'description', 'image_url', 'video_url', 'category', 'author_name', 'status'];
        $updates = [];
        $params = [];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $updates[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        if (empty($updates)) return;
        $params[] = $this->id;
        $db = Database::getInstance();
        $db->prepare("UPDATE gallery_items SET " . implode(', ', $updates) . " WHERE id = ?")->execute($params);
    }

    public function delete(): void
    {
        $db = Database::getInstance();
        $db->prepare("DELETE FROM gallery_items WHERE id = ?")->execute([$this->id]);
    }

    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'image_url'   => $this->image_url,
            'video_url'   => $this->video_url,
            'category'    => $this->category,
            'author_id'   => $this->author_id,
            'author_name' => $this->author_name,
            'status'      => $this->status,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
        ];
    }
}

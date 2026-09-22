<?php
namespace App\Models;

use App\Config\Database;

class Project
{
    public int $id;
    public string $title;
    public ?string $description;
    public ?array $tech;
    public ?string $github_url;
    public ?string $demo_url;
    public string $status;
    public ?int $author_id;
    public ?string $author_name;
    public string $created_at;
    public string $updated_at;

    public function __construct(array $data = [])
    {
        if (isset($data['tech']) && is_string($data['tech'])) {
            $decoded = json_decode($data['tech'], true);
            $this->tech = is_array($decoded) ? array_values(array_filter(array_map('trim', $decoded))) : [];
        } elseif (isset($data['tech'])) {
            $this->tech = array_values(array_filter(array_map('trim', (array)$data['tech'])));
        } else {
            $this->tech = [];
        }
        unset($data['tech']);

        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    public static function findById(int $id): ?self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM projects WHERE id = ?');
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
            $where[] = 'p.status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['author_id'])) {
            $where[] = 'p.author_id = ?';
            $params[] = $filters['author_id'];
        }
        if (!empty($filters['search'])) {
            $where[] = '(p.title LIKE ? OR p.description LIKE ? OR p.tech LIKE ?)';
            $s = '%' . $filters['search'] . '%';
            $params[] = $s;
            $params[] = $s;
            $params[] = $s;
        }

        $wc = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;

        $stmt = $db->prepare("SELECT p.* FROM projects p {$wc} ORDER BY p.created_at DESC LIMIT ? OFFSET ?");
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
        if (!empty($filters['author_id'])) {
            $where[] = 'author_id = ?';
            $params[] = $filters['author_id'];
        }

        $wc = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $stmt = $db->prepare("SELECT COUNT(*) FROM projects {$wc}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public function create(): int
    {
        $db = Database::getInstance();
        $stmt = $db->prepare("INSERT INTO projects
            (title, description, tech, github_url, demo_url, status, author_id, author_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $this->title, $this->description, $this->techToJson(), $this->github_url,
            $this->demo_url, $this->status ?? 'planning', $this->author_id, $this->author_name,
        ]);
        $this->id = (int) $db->lastInsertId();
        return $this->id;
    }

    public function update(array $data): void
    {
        $allowed = ['title', 'description', 'tech', 'github_url', 'demo_url', 'status', 'author_name'];
        $updates = [];
        $params = [];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $updates[] = "$field = ?";
                $params[] = ($field === 'tech') ? json_encode(array_values(array_filter(array_map('trim', (array)$data[$field])))) : $data[$field];
            }
        }
        if (empty($updates)) return;
        $params[] = $this->id;
        $db = Database::getInstance();
        $db->prepare("UPDATE projects SET " . implode(', ', $updates) . " WHERE id = ?")->execute($params);
    }

    public function delete(): void
    {
        $db = Database::getInstance();
        $db->prepare("DELETE FROM projects WHERE id = ?")->execute([$this->id]);
    }

    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'title'       => $this->title,
            'description' => $this->description,
            'tech'        => $this->tech,
            'github_url'  => $this->github_url,
            'demo_url'    => $this->demo_url,
            'status'      => $this->status,
            'author_id'   => $this->author_id,
            'author_name' => $this->author_name,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
        ];
    }

    private function techToJson(): ?string
    {
        if (!$this->tech) return null;
        return json_encode(array_values(array_filter(array_map('trim', $this->tech))));
    }
}
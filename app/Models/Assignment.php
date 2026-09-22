<?php
namespace App\Models;

use App\Config\Database;

class Assignment
{
    public int $id;
    public int $course_id;
    public string $title;
    public ?string $description;
    public ?string $due_date;
    public float $max_score;
    public string $status;
    public int $created_by;
    public string $created_at;
    public string $updated_at;

    public function __construct(array $data)
    {
        $this->id          = (int) $data['id'];
        $this->course_id   = (int) $data['course_id'];
        $this->title       = $data['title'];
        $this->description = $data['description'] ?? null;
        $this->due_date    = $data['due_date'] ?? null;
        $this->max_score   = (float) ($data['max_score'] ?? 100);
        $this->status      = $data['status'];
        $this->created_by  = (int) $data['created_by'];
        $this->created_at  = $data['created_at'];
        $this->updated_at  = $data['updated_at'] ?? $data['created_at'];
    }

    public static function findById(int $id): ?self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM assignments WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findAll(array $filters = [], int $page = 1, int $perPage = 20): array
    {
        $db     = Database::getInstance();
        $where  = [];
        $params = [];

        if (!empty($filters['course_id'])) {
            $where[]  = 'course_id = ?';
            $params[] = (int) $filters['course_id'];
        }
        if (!empty($filters['status'])) {
            $where[]  = 'status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['created_by'])) {
            $where[]  = 'created_by = ?';
            $params[] = (int) $filters['created_by'];
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;

        $stmt = $db->prepare("SELECT * FROM assignments {$whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $params[] = $perPage;
        $params[] = $offset;
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $assignments = [];
        foreach ($rows as $row) {
            $assignments[] = new self($row);
        }
        return $assignments;
    }

    public static function countAll(array $filters = []): int
    {
        $db     = Database::getInstance();
        $where  = [];
        $params = [];

        if (!empty($filters['course_id'])) {
            $where[]  = 'course_id = ?';
            $params[] = (int) $filters['course_id'];
        }
        if (!empty($filters['status'])) {
            $where[]  = 'status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['created_by'])) {
            $where[]  = 'created_by = ?';
            $params[] = (int) $filters['created_by'];
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $stmt = $db->prepare("SELECT COUNT(*) FROM assignments {$whereClause}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public static function findByCourse(int $courseId): array
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM assignments WHERE course_id = ? ORDER BY created_at DESC');
        $stmt->execute([$courseId]);
        $rows = $stmt->fetchAll();
        $assignments = [];
        foreach ($rows as $row) {
            $assignments[] = new self($row);
        }
        return $assignments;
    }

    public static function create(array $data): self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO assignments (course_id, title, description, due_date, max_score, status, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['course_id'],
            $data['title'],
            $data['description'] ?? null,
            $data['due_date'] ?? null,
            $data['max_score'] ?? 100,
            $data['status'] ?? 'active',
            $data['created_by'],
        ]);

        return self::findById((int) $db->lastInsertId());
    }

    public function update(array $data): bool
    {
        $db     = Database::getInstance();
        $sets   = [];
        $params = [];

        $allowed = ['title', 'description', 'due_date', 'max_score', 'status'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $sets[]  = "{$field} = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($sets)) return false;

        $params[] = $this->id;
        $stmt = $db->prepare('UPDATE assignments SET ' . implode(', ', $sets) . ' WHERE id = ?');
        return $stmt->execute($params);
    }

    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'course_id'   => $this->course_id,
            'title'       => $this->title,
            'description' => $this->description,
            'due_date'    => $this->due_date,
            'max_score'   => $this->max_score,
            'status'      => $this->status,
            'created_by'  => $this->created_by,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
        ];
    }
}

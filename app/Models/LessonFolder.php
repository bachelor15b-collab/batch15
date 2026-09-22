<?php
namespace App\Models;

use App\Config\Database;

class LessonFolder
{
    public int $id;
    public ?int $course_id;
    public string $name;
    public ?string $description;
    public int $created_by;
    public int $sort_order;
    public string $created_at;
    public string $updated_at;

    public function __construct(array $d)
    {
        $this->id         = (int) $d['id'];
        $this->course_id  = $d['course_id'] !== null ? (int) $d['course_id'] : null;
        $this->name       = $d['name'];
        $this->description = $d['description'] ?? null;
        $this->created_by = (int) $d['created_by'];
        $this->sort_order = (int) ($d['sort_order'] ?? 0);
        $this->created_at = $d['created_at'];
        $this->updated_at = $d['updated_at'] ?? $d['created_at'];
    }

    public static function ensureTable(): void
    {
        $db = Database::getInstance();
        $db->exec('CREATE TABLE IF NOT EXISTS lesson_folders (
            id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            course_id   INT UNSIGNED NULL,
            name        VARCHAR(255) NOT NULL,
            description TEXT NULL,
            created_by  INT UNSIGNED NOT NULL,
            sort_order  INT UNSIGNED DEFAULT 0,
            created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_lf_course (course_id),
            INDEX idx_lf_created_by (created_by)
        ) ENGINE=InnoDB');

        // Ensure course_id is nullable (for admin-created cross-course folders)
        try {
            $db->exec('ALTER TABLE lesson_folders MODIFY course_id INT UNSIGNED NULL');
        } catch (\Exception $e) {
            // ignore
        }

        // Add folder_id column to lessons table if not present
        try {
            $db->exec('ALTER TABLE lessons ADD COLUMN folder_id INT UNSIGNED NULL AFTER course_id, ADD INDEX idx_lesson_folder (folder_id)');
        } catch (\Exception $e) {
            // Column likely already exists – ignore
        }
    }

    public static function findById(int $id): ?self
    {
        self::ensureTable();
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM lesson_folders WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findByCourse(int $courseId): array
    {
        self::ensureTable();
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM lesson_folders WHERE course_id = ? ORDER BY sort_order ASC, name ASC');
        $stmt->execute([$courseId]);
        return array_map(fn($r) => new self($r), $stmt->fetchAll());
    }

    public static function findAll(array $filters = []): array
    {
        self::ensureTable();
        $db = Database::getInstance();
        $where = [];
        $params = [];
        if (array_key_exists('course_id', $filters)) {
            if ($filters['course_id'] === null) {
                $where[] = 'course_id IS NULL';
            } else {
                $where[] = 'course_id = ?';
                $params[] = (int) $filters['course_id'];
            }
        }
        $wc = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $stmt = $db->prepare("SELECT * FROM lesson_folders {$wc} ORDER BY sort_order ASC, name ASC");
        $stmt->execute($params);
        return array_map(fn($r) => new self($r), $stmt->fetchAll());
    }

    public static function create(array $d): self
    {
        self::ensureTable();
        $db = Database::getInstance();
        $stmt = $db->prepare('INSERT INTO lesson_folders (course_id, name, description, created_by, sort_order) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute([
            $d['course_id'] ?? null,
            $d['name'],
            $d['description'] ?? null,
            $d['created_by'],
            $d['sort_order'] ?? 0,
        ]);
        return self::findById((int) $db->lastInsertId());
    }

    public function update(array $d): bool
    {
        $db = Database::getInstance();
        $sets = [];
        $params = [];
        $allowed = ['name', 'description', 'sort_order'];
        foreach ($allowed as $f) {
            if (array_key_exists($f, $d)) {
                $sets[] = "{$f}=?";
                $params[] = $d[$f];
            }
        }
        if (empty($sets)) return false;
        $params[] = $this->id;
        $stmt = $db->prepare('UPDATE lesson_folders SET ' . implode(',', $sets) . ' WHERE id=?');
        return $stmt->execute($params);
    }

    public function delete(): bool
    {
        $db = Database::getInstance();
        // Unlink lessons in this folder
        $db->prepare('UPDATE lessons SET folder_id = NULL WHERE folder_id = ?')->execute([$this->id]);
        $stmt = $db->prepare('DELETE FROM lesson_folders WHERE id = ?');
        return $stmt->execute([$this->id]);
    }

    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'course_id'   => $this->course_id,
            'name'        => $this->name,
            'description' => $this->description,
            'created_by'  => $this->created_by,
            'sort_order'  => $this->sort_order,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
        ];
    }
}

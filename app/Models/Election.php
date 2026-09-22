<?php
/**
 * Election model.
 */
namespace App\Models;

use App\Config\Database;

class Election
{
    public int $id;
    public string $title;
    public ?string $description;
    public string $status;
    public string $start_date;
    public string $end_date;
    public int $created_by;
    public string $created_at;
    public string $updated_at;

    public function __construct(array $data)
    {
        $this->id          = (int) $data['id'];
        $this->title       = $data['title'];
        $this->description = $data['description'] ?? null;
        $this->status      = $data['status'];
        $this->start_date  = $data['start_date'];
        $this->end_date    = $data['end_date'];
        $this->created_by  = (int) $data['created_by'];
        $this->created_at  = $data['created_at'];
        $this->updated_at  = $data['updated_at'] ?? $data['created_at'];
    }

    public static function findById(int $id): ?self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM elections WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findAll(string $status = '', int $page = 1, int $perPage = 20): array
    {
        $db     = Database::getInstance();
        $where  = [];
        $params = [];

        if ($status) {
            $where[]  = 'status = ?';
            $params[] = $status;
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;

        $stmt = $db->prepare("SELECT * FROM elections {$whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $params[] = $perPage;
        $params[] = $offset;
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $elections = [];
        foreach ($rows as $row) {
            $elections[] = new self($row);
        }
        return $elections;
    }

    public static function create(array $data): self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO elections (title, description, status, start_date, end_date, created_by)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['title'],
            $data['description'] ?? null,
            $data['status'] ?? 'pending',
            $data['start_date'],
            $data['end_date'],
            $data['created_by'],
        ]);
        return self::findById((int) $db->lastInsertId());
    }

    public function update(array $data): bool
    {
        $db     = Database::getInstance();
        $sets   = [];
        $params = [];

        $allowed = ['title', 'description', 'status', 'start_date', 'end_date'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $sets[]   = "{$field} = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($sets)) return false;
        $params[] = $this->id;
        $stmt = $db->prepare('UPDATE elections SET ' . implode(', ', $sets) . ' WHERE id = ?');
        return $stmt->execute($params);
    }

    public function delete(): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('DELETE FROM elections WHERE id = ?');
        return $stmt->execute([$this->id]);
    }

    public function candidates(): array
    {
        return Candidate::findByElection($this->id);
    }

    public function hasVoted(int $userId): bool
    {
        return Vote::hasVoted($this->id, $userId);
    }

    public function results(): array
    {
        return Vote::results($this->id);
    }
}

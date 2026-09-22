<?php
namespace App\Models;

use App\Config\Database;

class FinancialRecord
{
    public int $id;
    public string $month_name;
    public string $status;
    public string $created_at;
    public int $created_by;

    public function __construct(array $data)
    {
        $this->id = (int)$data['id'];
        $this->month_name = $data['month_name'];
        $this->status = $data['status'];
        $this->created_at = $data['created_at'];
        $this->created_by = (int)$data['created_by'];
    }

    public static function findById(int $id): ?self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM financial_records WHERE id = ? LIMIT 1');
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
            $where[] = 'status = ?';
            $params[] = $filters['status'];
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;
        $stmt = $db->prepare("SELECT * FROM financial_records {$whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?");
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

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $stmt = $db->prepare("SELECT COUNT(*) FROM financial_records {$whereClause}");
        $stmt->execute($params);
        return (int)$stmt->fetchColumn();
    }

    public static function getActive(): ?self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM financial_records WHERE status = ? ORDER BY created_at DESC LIMIT 1');
        $stmt->execute(['active']);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function create(array $data): self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO financial_records (month_name, status, created_by) VALUES (?, ?, ?)'
        );
        $stmt->execute([
            $data['month_name'],
            $data['status'] ?? 'active',
            $data['created_by'],
        ]);
        return self::findById((int)$db->lastInsertId());
    }

    public function updateStatus(string $status): bool
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('UPDATE financial_records SET status = ? WHERE id = ?');
        return $stmt->execute([$status, $this->id]);
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'month_name' => $this->month_name,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'created_by' => $this->created_by,
        ];
    }
}

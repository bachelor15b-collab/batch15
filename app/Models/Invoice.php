<?php
/**
 * Invoice model — Finance module
 */
namespace App\Models;

use App\Config\Database;

class Invoice
{
    public int $id;
    public string $invoice_no;
    public int $user_id;
    public float $amount;
    public ?string $description;
    public string $status;
    public string $due_date;
    public ?string $paid_at;
    public int $created_by;
    public string $created_at;
    public string $updated_at;

    public function __construct(array $data)
    {
        $this->id = (int)$data['id'];
        $this->invoice_no = $data['invoice_no'];
        $this->user_id = (int)$data['user_id'];
        $this->amount = (float)$data['amount'];
        $this->description = $data['description'] ?? null;
        $this->status = $data['status'];
        $this->due_date = $data['due_date'];
        $this->paid_at = $data['paid_at'] ?? null;
        $this->created_by = (int)$data['created_by'];
        $this->created_at = $data['created_at'];
        $this->updated_at = $data['updated_at'] ?? $data['created_at'];
    }

    public static function findById(int $id): ?self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM invoices WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findAll(array $filters = [], int $page = 1, int $perPage = 20): array
    {
        $db = Database::getInstance();
        $where = [];
        $params = [];

        if (!empty($filters['user_id'])) { $where[] = 'user_id = ?'; $params[] = (int)$filters['user_id']; }
        if (!empty($filters['status'])) { $where[] = 'status = ?'; $params[] = $filters['status']; }
        if (!empty($filters['date_from'])) { $where[] = 'created_at >= ?'; $params[] = $filters['date_from']; }
        if (!empty($filters['date_to'])) { $where[] = 'created_at <= ?'; $params[] = $filters['date_to']; }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;
        $stmt = $db->prepare("SELECT * FROM invoices {$whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?");
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

        if (!empty($filters['user_id'])) { $where[] = 'user_id = ?'; $params[] = (int)$filters['user_id']; }
        if (!empty($filters['status'])) { $where[] = 'status = ?'; $params[] = $filters['status']; }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $stmt = $db->prepare("SELECT COUNT(*) FROM invoices {$whereClause}");
        $stmt->execute($params);
        return (int)$stmt->fetchColumn();
    }

    public static function create(array $data): self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO invoices (invoice_no, user_id, amount, description, status, due_date, created_by)
             VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['invoice_no'],
            $data['user_id'],
            $data['amount'],
            $data['description'] ?? null,
            $data['status'] ?? 'pending',
            $data['due_date'],
            $data['created_by'],
        ]);
        return self::findById((int)$db->lastInsertId());
    }

    public function updateStatus(string $status, ?string $paidAt = null): bool
    {
        $db = Database::getInstance();
        if ($paidAt) {
            $stmt = $db->prepare('UPDATE invoices SET status = ?, paid_at = ? WHERE id = ?');
            return $stmt->execute([$status, $paidAt, $this->id]);
        }
        $stmt = $db->prepare('UPDATE invoices SET status = ? WHERE id = ?');
        return $stmt->execute([$status, $this->id]);
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'invoice_no' => $this->invoice_no,
            'user_id' => $this->user_id,
            'amount' => $this->amount,
            'description' => $this->description,
            'status' => $this->status,
            'due_date' => $this->due_date,
            'paid_at' => $this->paid_at,
            'created_by' => $this->created_by,
            'created_at' => $this->created_at,
        ];
    }
}

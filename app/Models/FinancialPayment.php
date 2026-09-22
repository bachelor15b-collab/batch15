<?php
namespace App\Models;

use App\Config\Database;

class FinancialPayment
{
    public int $id;
    public int $record_id;
    public int $student_id;
    public string $status;
    public ?string $paid_at;
    public string $updated_at;

    public function __construct(array $data)
    {
        $this->id = (int)$data['id'];
        $this->record_id = (int)$data['record_id'];
        $this->student_id = (int)$data['student_id'];
        $this->status = $data['status'];
        $this->paid_at = $data['paid_at'] ?? null;
        $this->updated_at = $data['updated_at'];
    }

    public static function findById(int $id): ?self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM financial_payments WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findByRecordAndStudent(int $recordId, int $studentId): ?self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM financial_payments WHERE record_id = ? AND student_id = ? LIMIT 1');
        $stmt->execute([$recordId, $studentId]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findByRecord(int $recordId): array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM financial_payments WHERE record_id = ? ORDER BY student_id');
        $stmt->execute([$recordId]);
        return array_map(fn($r) => new self($r), $stmt->fetchAll());
    }

    public static function create(array $data): self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO financial_payments (record_id, student_id, status) VALUES (?, ?, ?)'
        );
        $stmt->execute([
            $data['record_id'],
            $data['student_id'],
            $data['status'] ?? 'unpaid',
        ]);
        return self::findById((int)$db->lastInsertId());
    }

    public function toggleStatus(): bool
    {
        $db = Database::getInstance();
        $newStatus = $this->status === 'paid' ? 'unpaid' : 'paid';
        $paidAt = $newStatus === 'paid' ? date('Y-m-d H:i:s') : null;
        $stmt = $db->prepare('UPDATE financial_payments SET status = ?, paid_at = ? WHERE id = ?');
        $result = $stmt->execute([$newStatus, $paidAt, $this->id]);
        if ($result) {
            $this->status = $newStatus;
            $this->paid_at = $paidAt;
        }
        return $result;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'record_id' => $this->record_id,
            'student_id' => $this->student_id,
            'status' => $this->status,
            'paid_at' => $this->paid_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

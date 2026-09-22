<?php
namespace App\Models;
use App\Config\Database;

class Payment
{
    public int $id; public ?int $invoice_id; public int $user_id; public float $amount;
    public string $method; public ?string $reference; public ?string $notes;
    public int $received_by; public string $created_at;

    public function __construct(array $d) {
        $this->id = (int)$d['id']; $this->invoice_id = isset($d['invoice_id']) ? (int)$d['invoice_id'] : null;
        $this->user_id = (int)$d['user_id']; $this->amount = (float)$d['amount'];
        $this->method = $d['method']; $this->reference = $d['reference'] ?? null;
        $this->notes = $d['notes'] ?? null; $this->received_by = (int)$d['received_by'];
        $this->created_at = $d['created_at'];
    }

    public static function findById(int $id): ?self {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM payments WHERE id = ? LIMIT 1');
        $stmt->execute([$id]); $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findAll(array $filters = [], int $page = 1, int $perPage = 20): array {
        $db = Database::getInstance(); $where = []; $params = [];
        if (!empty($filters['user_id'])) { $where[] = 'user_id = ?'; $params[] = (int)$filters['user_id']; }
        if (!empty($filters['method'])) { $where[] = 'method = ?'; $params[] = $filters['method']; }
        if (!empty($filters['date_from'])) { $where[] = 'created_at >= ?'; $params[] = $filters['date_from']; }
        if (!empty($filters['date_to'])) { $where[] = 'created_at <= ?'; $params[] = $filters['date_to']; }
        $wc = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;
        $stmt = $db->prepare("SELECT * FROM payments {$wc} ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $params[] = $perPage; $params[] = $offset;
        $stmt->execute($params);
        return array_map(fn($r) => new self($r), $stmt->fetchAll());
    }

    public static function countAll(array $filters = []): int {
        $db = Database::getInstance(); $where = []; $params = [];
        if (!empty($filters['user_id'])) { $where[] = 'user_id = ?'; $params[] = (int)$filters['user_id']; }
        if (!empty($filters['method'])) { $where[] = 'method = ?'; $params[] = $filters['method']; }
        $wc = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $stmt = $db->prepare("SELECT COUNT(*) FROM payments {$wc}");
        $stmt->execute($params); return (int)$stmt->fetchColumn();
    }

    public static function create(array $data): self {
        $db = Database::getInstance();
        $stmt = $db->prepare('INSERT INTO payments (invoice_id, user_id, amount, method, reference, notes, received_by) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$data['invoice_id'] ?? null, $data['user_id'], $data['amount'], $data['method'], $data['reference'] ?? null, $data['notes'] ?? null, $data['received_by']]);
        return self::findById((int)$db->lastInsertId());
    }

    public static function getTotalByMethod(): array {
        $db = Database::getInstance();
        return $db->query("SELECT method, SUM(amount) AS total, COUNT(*) AS count FROM payments GROUP BY method")->fetchAll();
    }

    public function toArray(): array {
        return ['id'=>$this->id,'invoice_id'=>$this->invoice_id,'user_id'=>$this->user_id,'amount'=>$this->amount,'method'=>$this->method,'reference'=>$this->reference,'notes'=>$this->notes,'received_by'=>$this->received_by,'created_at'=>$this->created_at];
    }
}

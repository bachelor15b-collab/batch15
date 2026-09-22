<?php
namespace App\Models;

use App\Config\Database;

class StudentClaim
{
    public int $id;
    public int $user_id;
    public ?string $student_id;
    public string $status;
    public ?int $reviewed_by;
    public ?string $review_note;
    public string $created_at;
    public string $updated_at;

    public function __construct(array $d)
    {
        $this->id          = (int)$d['id'];
        $this->user_id     = (int)$d['user_id'];
        $this->student_id  = $d['student_id'] ?? null;
        $this->status      = $d['status'];
        $this->reviewed_by = isset($d['reviewed_by']) ? (int)$d['reviewed_by'] : null;
        $this->review_note = $d['review_note'] ?? null;
        $this->created_at  = $d['created_at'];
        $this->updated_at  = $d['updated_at'] ?? $d['created_at'];
    }

    public static function findById(int $id): ?self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM student_claims WHERE id=? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findByUser(int $userId): ?self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM student_claims WHERE user_id=? LIMIT 1');
        $stmt->execute([$userId]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findPendingByStudentId(string $studentId, ?int $excludeUserId = null): ?self
    {
        $db = Database::getInstance();
        if ($excludeUserId !== null) {
            $stmt = $db->prepare('SELECT * FROM student_claims WHERE student_id=? AND status="pending" AND user_id!=? LIMIT 1');
            $stmt->execute([$studentId, $excludeUserId]);
        } else {
            $stmt = $db->prepare('SELECT * FROM student_claims WHERE student_id=? AND status="pending" LIMIT 1');
            $stmt->execute([$studentId]);
        }
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findAll(array $filters = [], int $page = 1, int $perPage = 50): array
    {
        $db = Database::getInstance();
        $where = [];
        $params = [];

        if (!empty($filters['status'])) {
            $where[] = 'sc.status=?';
            $params[] = $filters['status'];
        }

        $wc = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;

        $stmt = $db->prepare("
            SELECT sc.*, u.username, u.full_name, u.email, u.created_at AS user_since
            FROM student_claims sc
            JOIN users u ON sc.user_id = u.id
            {$wc}
            ORDER BY sc.created_at DESC
            LIMIT ? OFFSET ?
        ");
        $params[] = $perPage;
        $params[] = $offset;
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function create(int $userId, ?string $studentId = null): self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('INSERT INTO student_claims (user_id, student_id, status) VALUES (?, ?, "pending")');
        $stmt->execute([$userId, $studentId]);
        return self::findById((int)$db->lastInsertId());
    }

    public function resubmit(string $studentId): void
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('UPDATE student_claims SET student_id=?, status="pending", reviewed_by=NULL, review_note=NULL, updated_at=NOW() WHERE id=?');
        $stmt->execute([$studentId, $this->id]);
        $this->student_id = $studentId;
        $this->status = 'pending';
        $this->reviewed_by = null;
        $this->review_note = null;
    }

    public function approve(int $adminId): void
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('UPDATE student_claims SET status=?, reviewed_by=? WHERE id=?');
        $stmt->execute(['approved', $adminId, $this->id]);
    }

    public function deny(int $adminId, string $note): void
    {
        $db = Database::getInstance();
        $stmt = $db->prepare('UPDATE student_claims SET status=?, reviewed_by=?, review_note=? WHERE id=?');
        $stmt->execute(['denied', $adminId, $note, $this->id]);
    }

    public static function notifyReviewers(User $user, string $studentId, int $claimId): void
    {
        $message = "A new user (@{$user->username}) submitted student ID {$studentId} and is awaiting verification.";
        foreach (['super_admin', 'admin_educational', 'admin_general'] as $roleSlug) {
            Notification::broadcastToRole($roleSlug, 'New Student Claim', $message, 'info', 'student_claim', $claimId);
        }
    }

    public function toArray(): array
    {
        return [
            'id'          => $this->id,
            'user_id'     => $this->user_id,
            'student_id'  => $this->student_id,
            'status'      => $this->status,
            'reviewed_by' => $this->reviewed_by,
            'review_note' => $this->review_note,
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
        ];
    }
}
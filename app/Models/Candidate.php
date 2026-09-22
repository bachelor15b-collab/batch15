<?php
/**
 * Candidate model.
 */
namespace App\Models;

use App\Config\Database;

class Candidate
{
    public int $id;
    public int $election_id;
    public int $user_id;
    public ?string $manifesto;
    public ?string $position;
    public string $created_at;

    public function __construct(array $data)
    {
        $this->id          = (int) $data['id'];
        $this->election_id = (int) $data['election_id'];
        $this->user_id     = (int) $data['user_id'];
        $this->manifesto   = $data['manifesto'] ?? null;
        $this->position    = $data['position'] ?? null;
        $this->created_at  = $data['created_at'];
    }

    public static function findById(int $id): ?self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM candidates WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findByElection(int $electionId): array
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT c.*, u.username, u.full_name, u.avatar_url
             FROM candidates c
             JOIN users u ON u.id = c.user_id
             WHERE c.election_id = ?
             ORDER BY c.id'
        );
        $stmt->execute([$electionId]);
        return $stmt->fetchAll();
    }

    public static function create(array $data): self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO candidates (election_id, user_id, manifesto, position)
             VALUES (?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['election_id'],
            $data['user_id'],
            $data['manifesto'] ?? null,
            $data['position'] ?? null,
        ]);
        return self::findById((int) $db->lastInsertId());
    }

    public function voteCount(): int
    {
        return Vote::countByCandidate($this->id);
    }

    public function user(): ?User
    {
        return User::findById($this->user_id);
    }
}

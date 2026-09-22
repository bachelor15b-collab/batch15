<?php
/**
 * Vote model.
 */
namespace App\Models;

use App\Config\Database;

class Vote
{
    public int $id;
    public int $election_id;
    public int $user_id;
    public int $candidate_id;
    public string $created_at;

    public function __construct(array $data)
    {
        $this->id           = (int) $data['id'];
        $this->election_id  = (int) $data['election_id'];
        $this->user_id      = (int) $data['user_id'];
        $this->candidate_id = (int) $data['candidate_id'];
        $this->created_at   = $data['created_at'];
    }

    public static function cast(int $electionId, int $userId, int $candidateId): ?self
    {
        $db = Database::getInstance();

        // Check one-user-one-vote
        if (self::hasVoted($electionId, $userId)) {
            return null;
        }

        // Check election is active
        $election = Election::findById($electionId);
        if (!$election || $election->status !== 'active') {
            return null;
        }

        // Verify candidate belongs to this election
        $stmt = $db->prepare('SELECT id FROM candidates WHERE id = ? AND election_id = ?');
        $stmt->execute([$candidateId, $electionId]);
        if (!$stmt->fetch()) {
            return null;
        }

        $stmt = $db->prepare(
            'INSERT INTO votes (election_id, user_id, candidate_id) VALUES (?, ?, ?)'
        );
        $stmt->execute([$electionId, $userId, $candidateId]);

        $voteId = (int) $db->lastInsertId();
        return new self([
            'id'           => $voteId,
            'election_id'  => $electionId,
            'user_id'      => $userId,
            'candidate_id' => $candidateId,
            'created_at'   => date('Y-m-d H:i:s'),
        ]);
    }

    public static function hasVoted(int $electionId, int $userId): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT COUNT(*) FROM votes WHERE election_id = ? AND user_id = ?');
        $stmt->execute([$electionId, $userId]);
        return (int) $stmt->fetchColumn() > 0;
    }

    public static function countByCandidate(int $candidateId): int
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT COUNT(*) FROM votes WHERE candidate_id = ?');
        $stmt->execute([$candidateId]);
        return (int) $stmt->fetchColumn();
    }

    public static function results(int $electionId): array
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT c.id AS candidate_id, c.position, u.username, u.full_name, u.avatar_url,
                    COUNT(v.id) AS vote_count
             FROM candidates c
             JOIN users u ON u.id = c.user_id
             LEFT JOIN votes v ON v.candidate_id = c.id
             WHERE c.election_id = ?
             GROUP BY c.id, c.position, u.username, u.full_name, u.avatar_url
             ORDER BY vote_count DESC'
        );
        $stmt->execute([$electionId]);
        return $stmt->fetchAll();
    }

    public static function totalVotes(int $electionId): int
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT COUNT(*) FROM votes WHERE election_id = ?');
        $stmt->execute([$electionId]);
        return (int) $stmt->fetchColumn();
    }

    public static function votersByCandidate(int $electionId): array
    {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT v.candidate_id, u.id AS voter_id, u.full_name, u.username, u.avatar_url
             FROM votes v
             JOIN users u ON u.id = v.user_id
             WHERE v.election_id = ?
             ORDER BY v.candidate_id'
        );
        $stmt->execute([$electionId]);
        $rows = $stmt->fetchAll();
        $grouped = [];
        foreach ($rows as $r) {
            $cid = (int) $r['candidate_id'];
            if (!isset($grouped[$cid])) $grouped[$cid] = [];
            $grouped[$cid][] = [
                'id'        => (int) $r['voter_id'],
                'full_name' => $r['full_name'],
                'username'  => $r['username'],
                'avatar'    => $r['avatar_url'],
            ];
        }
        return $grouped;
    }

    public static function voterParticipation(int $electionId): array
    {
        $db = Database::getInstance();

        // Total eligible voters (students)
        $total = (int) $db->query("SELECT COUNT(*) FROM users WHERE role_slug = 'student' AND status = 'active'")->fetchColumn();

        // Voted
        $voted = self::totalVotes($electionId);

        return [
            'total_eligible' => $total,
            'total_voted'    => $voted,
            'percentage'     => $total > 0 ? round(($voted / $total) * 100, 2) : 0,
        ];
    }
}

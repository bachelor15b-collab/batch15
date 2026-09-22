<?php
/**
 * Challenge Submission model.
 */
namespace App\Models;

use App\Config\Database;

class Submission
{
    public int $id;
    public int $challenge_id;
    public int $user_id;
    public string $code;
    public string $language;
    public ?float $score;
    public ?int $passed;
    public ?string $feedback;
    public string $created_at;

    public function __construct(array $data)
    {
        $this->id           = (int) $data['id'];
        $this->challenge_id = (int) $data['challenge_id'];
        $this->user_id      = (int) $data['user_id'];
        $this->code         = $data['code'];
        $this->language     = $data['language'] ?? 'php';
        $this->score        = isset($data['score']) ? (float) $data['score'] : null;
        $this->passed       = isset($data['passed']) ? (int) $data['passed'] : null;
        $this->feedback     = $data['feedback'] ?? null;
        $this->created_at   = $data['created_at'];
    }

    public static function findById(int $id): ?self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM submissions WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findByChallenge(int $challengeId, int $page = 1, int $perPage = 20): array
    {
        $db     = Database::getInstance();
        $offset = ($page - 1) * $perPage;
        $stmt   = $db->prepare(
            'SELECT s.*, u.username, u.full_name FROM submissions s
             JOIN users u ON u.id = s.user_id
             WHERE s.challenge_id = ?
             ORDER BY s.score DESC, s.created_at ASC
             LIMIT ? OFFSET ?'
        );
        $stmt->execute([$challengeId, $perPage, $offset]);
        return $stmt->fetchAll();
    }

    public static function findByUser(int $userId, int $page = 1, int $perPage = 20): array
    {
        $db     = Database::getInstance();
        $offset = ($page - 1) * $perPage;
        $stmt   = $db->prepare(
            'SELECT s.*, c.title AS challenge_title FROM submissions s
             JOIN challenges c ON c.id = s.challenge_id
             WHERE s.user_id = ?
             ORDER BY s.created_at DESC
             LIMIT ? OFFSET ?'
        );
        $stmt->execute([$userId, $perPage, $offset]);
        return $stmt->fetchAll();
    }

    public static function create(array $data): self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO submissions (challenge_id, user_id, code, language)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE code = VALUES(code), language = VALUES(language), passed = NULL, score = NULL, feedback = NULL'
        );
        $stmt->execute([
            $data['challenge_id'],
            $data['user_id'],
            $data['code'],
            $data['language'] ?? 'php',
        ]);
        return self::findById((int) $db->lastInsertId());
    }

    public function grade(float $score, ?string $feedback = null): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('UPDATE submissions SET score = ?, passed = ?, feedback = ? WHERE id = ?');
        $passed = $score >= 70 ? 1 : 0;
        $result = $stmt->execute([$score, $passed, $feedback, $this->id]);

        if ($result && $passed) {
            // Award XP
            $challenge = Challenge::findById($this->challenge_id);
            if ($challenge) {
                UserXp::award($this->user_id, $challenge->xp_reward);
            }
        }

        return $result;
    }

    public function user(): ?User
    {
        return User::findById($this->user_id);
    }

    public function challenge(): ?Challenge
    {
        return Challenge::findById($this->challenge_id);
    }
}

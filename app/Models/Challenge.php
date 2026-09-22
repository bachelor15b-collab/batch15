<?php
/**
 * Challenge model.
 */
namespace App\Models;

use App\Config\Database;

class Challenge
{
    public int $id;
    public string $title;
    public string $description;
    public string $difficulty;
    public int $xp_reward;
    public ?string $image_url;
    public ?string $link_url;
    public ?string $starter_code;
    public ?string $test_cases;
    public ?string $due_at;
    public string $status;
    public int $author_id;
    public string $created_at;
    public string $updated_at;

    public function __construct(array $data)
    {
        $this->id           = (int) $data['id'];
        $this->title        = $data['title'];
        $this->description  = $data['description'];
        $this->difficulty   = $data['difficulty'];
        $this->xp_reward    = (int) ($data['xp_reward'] ?? 100);
        $this->image_url    = $data['image_url'] ?? null;
        $this->link_url     = $data['link_url'] ?? null;
        $this->starter_code = $data['starter_code'] ?? null;
        $this->test_cases   = $data['test_cases'] ?? null;
        $this->due_at       = $data['due_at'] ?? null;
        $this->status       = $data['status'];
        $this->author_id    = (int) $data['author_id'];
        $this->created_at   = $data['created_at'];
        $this->updated_at   = $data['updated_at'] ?? $data['created_at'];
    }

    public static function findById(int $id): ?self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM challenges WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findAll(array $filters = [], int $page = 1, int $perPage = 20): array
    {
        $db     = Database::getInstance();
        $where  = [];
        $params = [];

        if (!empty($filters['status'])) {
            $where[]  = 'status = ?';
            $params[] = $filters['status'];
        }
        if (!empty($filters['difficulty'])) {
            $where[]  = 'difficulty = ?';
            $params[] = $filters['difficulty'];
        }
        if (!empty($filters['author_id'])) {
            $where[]  = 'author_id = ?';
            $params[] = (int) $filters['author_id'];
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;

        $stmt = $db->prepare("SELECT * FROM challenges {$whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $params[] = $perPage;
        $params[] = $offset;
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $challenges = [];
        foreach ($rows as $row) {
            $challenges[] = new self($row);
        }
        return $challenges;
    }

    public static function create(array $data): self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO challenges (title, description, difficulty, xp_reward, image_url, link_url, starter_code, test_cases, due_at, status, author_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $data['title'],
            $data['description'],
            $data['difficulty'] ?? 'medium',
            $data['xp_reward'] ?? 100,
            $data['image_url'] ?? null,
            $data['link_url'] ?? null,
            $data['starter_code'] ?? null,
            isset($data['test_cases']) ? json_encode($data['test_cases']) : null,
            $data['due_at'] ?? null,
            $data['status'] ?? 'draft',
            $data['author_id'],
        ]);
        return self::findById((int) $db->lastInsertId());
    }

    public function update(array $data): bool
    {
        $db     = Database::getInstance();
        $sets   = [];
        $params = [];

        $allowed = ['title', 'description', 'difficulty', 'xp_reward', 'image_url', 'link_url', 'starter_code', 'test_cases', 'due_at', 'status'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $sets[]   = "{$field} = ?";
                $params[] = $field === 'test_cases' && is_array($data[$field])
                    ? json_encode($data[$field])
                    : $data[$field];
            }
        }

        if (empty($sets)) return false;

        $params[] = $this->id;
        $stmt = $db->prepare('UPDATE challenges SET ' . implode(', ', $sets) . ' WHERE id = ?');
        return $stmt->execute($params);
    }

    public function delete(): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('DELETE FROM challenges WHERE id = ?');
        return $stmt->execute([$this->id]);
    }

    public function author(): ?User
    {
        return User::findById($this->author_id);
    }

    public function submissions(int $page = 1, int $perPage = 20): array
    {
        return Submission::findByChallenge($this->id, $page, $perPage);
    }

    public function toArray(): array
    {
        return [
            'id'           => $this->id,
            'title'        => $this->title,
            'description'  => $this->description,
            'difficulty'   => $this->difficulty,
            'xp_reward'    => $this->xp_reward,
            'image_url'    => $this->image_url,
            'link_url'     => $this->link_url,
            'starter_code' => $this->starter_code,
            'test_cases'   => $this->test_cases ? json_decode($this->test_cases, true) : null,
            'due_at'       => $this->due_at,
            'status'       => $this->status,
            'author_id'    => $this->author_id,
            'created_at'   => $this->created_at,
            'updated_at'   => $this->updated_at,
        ];
    }
}

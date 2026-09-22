<?php
namespace App\Models;

use App\Config\Database;

class MemberProfile
{
    public int $id;
    public int $user_id;
    public ?string $first_name;
    public ?string $middle_name;
    public ?string $last_name;
    public ?string $picture_url;
    public ?string $level;
    public ?string $year;
    public ?string $semester;
    public ?string $bio;
    public ?string $skills;
    public ?string $languages;
    public ?string $website;
    public ?string $email_contact;
    public ?string $github;
    public ?string $linkedin;
    public ?string $twitter;
    public ?string $certificates;
    public string $status;
    public string $created_at;
    public string $updated_at;

    public ?string $username = null;
    public ?string $full_name = null;
    public ?string $email = null;

    public function __construct(array $data = [])
    {
        foreach ($data as $key => $value) {
            if (property_exists($this, $key)) {
                $this->$key = $value;
            }
        }
    }

    public static function findById(int $id): ?self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT mp.*, u.username, u.full_name, u.email
            FROM member_profiles mp
            JOIN users u ON u.id = mp.user_id
            WHERE mp.id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findByUserId(int $userId): ?self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare("SELECT mp.*, u.username, u.full_name, u.email
            FROM member_profiles mp
            JOIN users u ON u.id = mp.user_id
            WHERE mp.user_id = ?");
        $stmt->execute([$userId]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findAll(array $filters = [], int $page = 1, int $perPage = 20): array
    {
        $db = Database::getInstance();
        $where = [];
        $params = [];

        $includeUserId = !empty($filters['include_user_id']) ? (int)$filters['include_user_id'] : null;

        if (!empty($filters['status'])) {
            if ($includeUserId) {
                $where[] = '(mp.status = ? OR mp.user_id = ?)';
                $params[] = $filters['status'];
                $params[] = $includeUserId;
            } else {
                $where[] = 'mp.status = ?';
                $params[] = $filters['status'];
            }
        } elseif ($includeUserId) {
            $where[] = 'mp.user_id = ?';
            $params[] = $includeUserId;
        }
        if (!empty($filters['search'])) {
            $where[] = '(mp.first_name LIKE ? OR mp.last_name LIKE ? OR mp.bio LIKE ?)';
            $s = '%' . $filters['search'] . '%';
            $params[] = $s;
            $params[] = $s;
            $params[] = $s;
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;

        $stmt = $db->prepare("SELECT mp.*, u.username, u.full_name, u.email
            FROM member_profiles mp
            JOIN users u ON u.id = mp.user_id
            $whereClause
            ORDER BY mp.created_at DESC
            LIMIT ? OFFSET ?");
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

        $includeUserId = !empty($filters['include_user_id']) ? (int)$filters['include_user_id'] : null;

        if (!empty($filters['status'])) {
            if ($includeUserId) {
                $where[] = '(mp.status = ? OR mp.user_id = ?)';
                $params[] = $filters['status'];
                $params[] = $includeUserId;
            } else {
                $where[] = 'mp.status = ?';
                $params[] = $filters['status'];
            }
        } elseif ($includeUserId) {
            $where[] = 'mp.user_id = ?';
            $params[] = $includeUserId;
        }
        if (!empty($filters['search'])) {
            $where[] = '(mp.first_name LIKE ? OR mp.last_name LIKE ? OR mp.bio LIKE ?)';
            $s = '%' . $filters['search'] . '%';
            $params[] = $s;
            $params[] = $s;
            $params[] = $s;
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $stmt = $db->prepare("SELECT COUNT(*) FROM member_profiles mp $whereClause");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public function create(): int
    {
        $db = Database::getInstance();
        $stmt = $db->prepare("INSERT INTO member_profiles
            (user_id, first_name, middle_name, last_name, picture_url, level, year, semester,
             bio, skills, languages, website, email_contact, github, linkedin, twitter, certificates, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $this->user_id, $this->first_name, $this->middle_name, $this->last_name,
            $this->picture_url, $this->level, $this->year, $this->semester,
            $this->bio, $this->skills, $this->languages, $this->website,
            $this->email_contact, $this->github, $this->linkedin, $this->twitter,
            $this->certificates, $this->status ?? 'pending',
        ]);
        $this->id = (int) $db->lastInsertId();
        return $this->id;
    }

    public function update(array $data): void
    {
        $allowed = ['first_name','middle_name','last_name','picture_url','level','year',
            'semester','bio','skills','languages','website','email_contact','github',
            'linkedin','twitter','certificates','status'];
        $updates = [];
        $params = [];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $updates[] = "$field = ?";
                $params[] = $data[$field];
            }
        }
        if (empty($updates)) return;
        $params[] = $this->id;
        $db = Database::getInstance();
        $db->prepare("UPDATE member_profiles SET " . implode(', ', $updates) . " WHERE id = ?")->execute($params);
    }

    public function toArray(): array
    {
        return [
            'id'            => $this->id,
            'user_id'       => $this->user_id,
            'first_name'    => $this->first_name,
            'middle_name'   => $this->middle_name,
            'last_name'     => $this->last_name,
            'picture_url'   => $this->picture_url,
            'level'         => $this->level,
            'year'          => $this->year,
            'semester'      => $this->semester,
            'bio'           => $this->bio,
            'skills'        => $this->skills,
            'languages'     => $this->languages,
            'website'       => $this->website,
            'email_contact' => $this->email_contact,
            'github'        => $this->github,
            'linkedin'      => $this->linkedin,
            'twitter'       => $this->twitter,
            'certificates'  => $this->certificates,
            'status'        => $this->status,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,
            'username'      => $this->username,
            'full_name'     => $this->full_name,
            'email'         => $this->email,
        ];
    }
}

<?php
namespace App\Models;

use App\Config\Database;

class MemberProfile
{
    public int $id;
    public ?int $user_id = null;
    public ?string $student_id = null;
    public ?string $first_name = null;
    public ?string $middle_name = null;
    public ?string $last_name = null;
    public ?string $picture_url = null;
    public ?string $level = null;
    public ?string $year = null;
    public ?string $semester = null;
    public string $source = 'self';
    public ?string $roster_key = null;
    public ?string $bio = null;
    public ?string $skills = null;
    public ?string $languages = null;
    public ?string $interests = null;
    public ?string $website = null;
    public ?string $email_contact = null;
    public ?string $github = null;
    public ?string $linkedin = null;
    public ?string $twitter = null;
    public ?string $facebook = null;
    public ?string $instagram = null;
    public ?string $certificates = null;
    public string $status = 'pending';
    public string $created_at = '';
    public string $updated_at = '';

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
            LEFT JOIN users u ON u.id = mp.user_id
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
            LEFT JOIN users u ON u.id = mp.user_id
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
            $where[] = '(mp.first_name LIKE ? OR mp.last_name LIKE ? OR mp.bio LIKE ? OR mp.skills LIKE ? OR mp.interests LIKE ?)';
            $s = '%' . $filters['search'] . '%';
            $params[] = $s; $params[] = $s; $params[] = $s; $params[] = $s; $params[] = $s;
        }
        if (!empty($filters['skills'])) {
            $where[] = 'mp.skills LIKE ?';
            $params[] = '%' . $filters['skills'] . '%';
        }
        if (!empty($filters['interests'])) {
            $where[] = 'mp.interests LIKE ?';
            $params[] = '%' . $filters['interests'] . '%';
        }
        if (!empty($filters['language'])) {
            $where[] = 'mp.languages LIKE ?';
            $params[] = '%' . $filters['language'] . '%';
        }
        if (!empty($filters['level'])) {
            $where[] = 'mp.level = ?';
            $params[] = $filters['level'];
        }
        if (!empty($filters['source'])) {
            $where[] = 'mp.source = ?';
            $params[] = $filters['source'];
        }
        if (isset($filters['has_account']) && $filters['has_account'] === true) {
            $where[] = 'mp.user_id IS NOT NULL';
        } elseif (isset($filters['has_account']) && $filters['has_account'] === false) {
            $where[] = 'mp.user_id IS NULL';
        }

        $orderBy = 'mp.last_name ASC, mp.first_name ASC';
        if (!empty($filters['sort']) && $filters['sort'] === 'recent') {
            $orderBy = 'mp.created_at DESC';
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;

        $stmt = $db->prepare("SELECT mp.*, u.username, u.full_name, u.email
            FROM member_profiles mp
            LEFT JOIN users u ON u.id = mp.user_id
            $whereClause
            ORDER BY $orderBy
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
            $where[] = '(mp.first_name LIKE ? OR mp.last_name LIKE ? OR mp.bio LIKE ? OR mp.skills LIKE ? OR mp.interests LIKE ?)';
            $s = '%' . $filters['search'] . '%';
            $params[] = $s; $params[] = $s; $params[] = $s; $params[] = $s; $params[] = $s;
        }
        if (!empty($filters['skills'])) {
            $where[] = 'mp.skills LIKE ?';
            $params[] = '%' . $filters['skills'] . '%';
        }
        if (!empty($filters['interests'])) {
            $where[] = 'mp.interests LIKE ?';
            $params[] = '%' . $filters['interests'] . '%';
        }
        if (!empty($filters['language'])) {
            $where[] = 'mp.languages LIKE ?';
            $params[] = '%' . $filters['language'] . '%';
        }
        if (!empty($filters['level'])) {
            $where[] = 'mp.level = ?';
            $params[] = $filters['level'];
        }
        if (!empty($filters['source'])) {
            $where[] = 'mp.source = ?';
            $params[] = $filters['source'];
        }
        if (isset($filters['has_account']) && $filters['has_account'] === true) {
            $where[] = 'mp.user_id IS NOT NULL';
        } elseif (isset($filters['has_account']) && $filters['has_account'] === false) {
            $where[] = 'mp.user_id IS NULL';
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
            (user_id, student_id, first_name, middle_name, last_name, picture_url, level, year, semester,
             source, roster_key, bio, skills, languages, interests, website, email_contact,
             github, linkedin, twitter, facebook, instagram, certificates, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $this->user_id, $this->student_id, $this->first_name, $this->middle_name, $this->last_name,
            $this->picture_url ?? '', $this->level, $this->year, $this->semester,
            $this->source ?? 'self', $this->roster_key, $this->bio, $this->skills, $this->languages,
            $this->interests, $this->website, $this->email_contact, $this->github, $this->linkedin,
            $this->twitter, $this->facebook, $this->instagram, $this->certificates,
            $this->status ?? 'pending',
        ]);
        $this->id = (int) $db->lastInsertId();
        $fresh = self::findById($this->id);
        if ($fresh) {
            $this->status = $fresh->status;
            $this->source = $fresh->source;
            $this->created_at = $fresh->created_at;
            $this->updated_at = $fresh->updated_at;
        }
        return $this->id;
    }

    public function update(array $data): void
    {
        $allowed = ['user_id','first_name','middle_name','last_name','picture_url','level','year',
            'semester','student_id','source','roster_key','bio','skills','languages','interests',
            'website','email_contact','github','linkedin','twitter','facebook','instagram',
            'certificates','status'];
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
            'student_id'    => $this->student_id,
            'first_name'    => $this->first_name,
            'middle_name'   => $this->middle_name,
            'last_name'     => $this->last_name,
            'picture_url'   => $this->picture_url,
            'level'         => $this->level,
            'year'          => $this->year,
            'semester'      => $this->semester,
            'source'        => $this->source,
            'roster_key'    => $this->roster_key,
            'bio'           => $this->bio,
            'skills'        => $this->skills,
            'languages'     => $this->languages,
            'interests'     => $this->interests,
            'website'       => $this->website,
            'email_contact' => $this->email_contact,
            'github'        => $this->github,
            'linkedin'      => $this->linkedin,
            'twitter'       => $this->twitter,
            'facebook'      => $this->facebook,
            'instagram'     => $this->instagram,
            'certificates'  => $this->certificates,
            'status'        => $this->status,
            'created_at'    => $this->created_at,
            'updated_at'    => $this->updated_at,
            'username'      => $this->username,
            'full_name'     => $this->user_id ? ($this->full_name ?: trim($this->first_name . ' ' . ($this->middle_name ?? '') . ' ' . $this->last_name)) : trim($this->first_name . ' ' . ($this->middle_name ?? '') . ' ' . $this->last_name),
            'email'         => $this->email,
            'has_account'   => $this->user_id !== null,
        ];
    }
}

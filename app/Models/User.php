<?php
/**
 * User model.
 */
namespace App\Models;

use App\Config\Database;
use App\Helpers\Security;

class User
{
    public int $id;
    public string $username;
    public string $email;
    public string $password_hash;
    public string $role_slug;
    public ?string $full_name;
    public ?string $avatar_url;
    public string $status;
    public ?string $last_login_ip;
    public ?string $last_login_at;
    public string $created_at;
    public string $updated_at;

    public function __construct(array $data)
    {
        $this->id            = (int) $data['id'];
        $this->username      = $data['username'];
        $this->email         = $data['email'];
        $this->password_hash = $data['password_hash'];
        $this->role_slug     = $data['role_slug'];
        $this->full_name     = $data['full_name'] ?? null;
        $this->avatar_url    = $data['avatar_url'] ?? null;
        $this->status        = $data['status'];
        $this->last_login_ip = $data['last_login_ip'] ?? null;
        $this->last_login_at = $data['last_login_at'] ?? null;
        $this->created_at    = $data['created_at'];
        $this->updated_at    = $data['updated_at'] ?? $data['created_at'];
    }

    public static function findById(int $id): ?self
    {
        $db  = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findByEmail(string $email): ?self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findByUsername(string $username): ?self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM users WHERE username = ? LIMIT 1');
        $stmt->execute([$username]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function create(array $data): self
    {
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO users (username, email, password_hash, role_slug, full_name, status)
             VALUES (?, ?, ?, ?, ?, ?)'
        );
        $role  = $data['role_slug'] ?? 'user';
        $name  = $data['full_name'] ?? null;
        $hash  = Security::hashPassword($data['password']);
        $status = 'active';

        $stmt->execute([$data['username'], $data['email'], $hash, $role, $name, $status]);

        return self::findById((int) $db->lastInsertId());
    }

    public static function findAll(string $roleSlug = '', string $status = '', int $page = 1, int $perPage = 20): array
    {
        $db     = Database::getInstance();
        $where  = [];
        $params = [];

        if ($roleSlug) {
            $where[]  = 'role_slug = ?';
            $params[] = $roleSlug;
        }
        if ($status) {
            $where[]  = 'status = ?';
            $params[] = $status;
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $offset = ($page - 1) * $perPage;

        $stmt = $db->prepare("SELECT * FROM users {$whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?");
        $params[] = $perPage;
        $params[] = $offset;
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $users = [];
        foreach ($rows as $row) {
            $users[] = new self($row);
        }
        return $users;
    }

    public static function countAll(string $roleSlug = '', string $status = ''): int
    {
        $db     = Database::getInstance();
        $where  = [];
        $params = [];

        if ($roleSlug) {
            $where[]  = 'role_slug = ?';
            $params[] = $roleSlug;
        }
        if ($status) {
            $where[]  = 'status = ?';
            $params[] = $status;
        }

        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        $stmt = $db->prepare("SELECT COUNT(*) FROM users {$whereClause}");
        $stmt->execute($params);
        return (int) $stmt->fetchColumn();
    }

    public function update(array $data): bool
    {
        $db      = Database::getInstance();
        $sets    = [];
        $params  = [];

        $allowed = ['email', 'full_name', 'avatar_url', 'status', 'role_slug'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $sets[]   = "{$field} = ?";
                $params[] = $data[$field];
            }
        }

        if (isset($data['password'])) {
            $sets[]   = 'password_hash = ?';
            $params[] = Security::hashPassword($data['password']);
        }

        if (empty($sets)) {
            return false;
        }

        $params[] = $this->id;
        $stmt = $db->prepare('UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?');
        return $stmt->execute($params);
    }

    public function updateLastLogin(string $ip): void
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('UPDATE users SET last_login_ip = ?, last_login_at = NOW() WHERE id = ?');
        $stmt->execute([$ip, $this->id]);
    }

    public function suspend(): bool
    {
        $result = $this->update(['status' => 'suspended']);
        if ($result) $this->status = 'suspended';
        return $result;
    }

    public function restore(): bool
    {
        $result = $this->update(['status' => 'active']);
        if ($result) $this->status = 'active';
        return $result;
    }

    public function softDelete(): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('UPDATE users SET status = ? WHERE id = ?');
        return $stmt->execute(['deleted', $this->id]);
    }

    public function changeRole(string $newRoleSlug): bool
    {
        $result = $this->update(['role_slug' => $newRoleSlug]);
        if ($result) {
            $this->role_slug = $newRoleSlug;
        }
        return $result;
    }

    public function toArray(): array
    {
        return [
            'id'         => $this->id,
            'username'   => $this->username,
            'email'      => $this->email,
            'role_slug'  => $this->role_slug,
            'full_name'  => $this->full_name,
            'avatar_url' => $this->avatar_url,
            'status'     => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}

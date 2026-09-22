<?php
/**
 * Role model.
 */
namespace App\Models;

use App\Config\Database;

class Role
{
    public int $id;
    public string $name;
    public string $slug;
    public ?string $description;
    public string $created_at;

    public function __construct(array $data)
    {
        $this->id          = (int) $data['id'];
        $this->name        = $data['name'];
        $this->slug        = $data['slug'];
        $this->description = $data['description'] ?? null;
        $this->created_at  = $data['created_at'];
    }

    public static function findBySlug(string $slug): ?self
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM roles WHERE slug = ? LIMIT 1');
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        return $row ? new self($row) : null;
    }

    public static function findAll(): array
    {
        $db   = Database::getInstance();
        $stmt = $db->query('SELECT * FROM roles ORDER BY id');
        $rows = $stmt->fetchAll();
        $roles = [];
        foreach ($rows as $row) {
            $roles[] = new self($row);
        }
        return $roles;
    }

    public static function getAllSlugs(): array
    {
        $db   = Database::getInstance();
        $stmt = $db->query('SELECT slug FROM roles');
        return $stmt->fetchAll(\PDO::FETCH_COLUMN);
    }
}

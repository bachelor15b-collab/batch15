<?php
/**
 * System Configuration model (Super Admin settings).
 */
namespace App\Models;

use App\Config\Database;

class SystemConfig
{
    /**
     * Get a config value.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('SELECT `value` FROM system_config WHERE `key` = ?');
        $stmt->execute([$key]);
        $value = $stmt->fetchColumn();
        return $value !== false ? $value : $default;
    }

    /**
     * Set a config value.
     */
    public static function set(string $key, string $value, ?int $updatedBy = null): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO system_config (`key`, `value`, updated_by)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), updated_by = VALUES(updated_by)'
        );
        return $stmt->execute([$key, $value, $updatedBy]);
    }

    /**
     * Get all config values.
     */
    public static function getAll(): array
    {
        $db   = Database::getInstance();
        $stmt = $db->query('SELECT * FROM system_config ORDER BY `key`');
        $rows = $stmt->fetchAll();
        $config = [];
        foreach ($rows as $row) {
            $config[$row['key']] = $row['value'];
        }
        return $config;
    }

    /**
     * Delete a config key.
     */
    public static function delete(string $key): bool
    {
        $db   = Database::getInstance();
        $stmt = $db->prepare('DELETE FROM system_config WHERE `key` = ?');
        return $stmt->execute([$key]);
    }
}

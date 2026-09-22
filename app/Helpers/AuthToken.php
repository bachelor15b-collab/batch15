<?php
namespace App\Helpers;

use App\Config\Database;

class AuthToken
{
    const TOKEN_BYTES = 32;
    const EXPIRY_SECONDS = 2592000; // 30 days

    private static function ensureTable(): void
    {
        $db = Database::getInstance();
        $db->exec('CREATE TABLE IF NOT EXISTS auth_tokens (
            id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            user_id    INT UNSIGNED NOT NULL,
            token_hash VARCHAR(64) NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_token_hash (token_hash),
            INDEX idx_user_id (user_id)
        ) ENGINE=InnoDB');
    }

    public static function generate(int $userId): string
    {
        self::ensureTable();

        $token = bin2hex(random_bytes(self::TOKEN_BYTES));
        $hash = hash('sha256', $token);
        $expires = date('Y-m-d H:i:s', time() + self::EXPIRY_SECONDS);

        $db = Database::getInstance();
        $stmt = $db->prepare(
            'INSERT INTO auth_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)'
        );
        $stmt->execute([$userId, $hash, $expires]);

        return $token;
    }

    public static function validate(string $token): ?array
    {
        self::ensureTable();

        $hash = hash('sha256', $token);
        $db = Database::getInstance();
        $stmt = $db->prepare(
            'SELECT t.*, u.id AS uid, u.username, u.role_slug, u.status
             FROM auth_tokens t
             JOIN users u ON u.id = t.user_id
             WHERE t.token_hash = ? AND t.expires_at > NOW()
             LIMIT 1'
        );
        $stmt->execute([$hash]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function revoke(string $token): void
    {
        self::ensureTable();

        $hash = hash('sha256', $token);
        $db = Database::getInstance();
        $stmt = $db->prepare('DELETE FROM auth_tokens WHERE token_hash = ?');
        $stmt->execute([$hash]);
    }

    public static function revokeAllForUser(int $userId): void
    {
        self::ensureTable();

        $db = Database::getInstance();
        $stmt = $db->prepare('DELETE FROM auth_tokens WHERE user_id = ?');
        $stmt->execute([$userId]);
    }

    public static function cleanupExpired(): void
    {
        self::ensureTable();

        $db = Database::getInstance();
        $db->exec('DELETE FROM auth_tokens WHERE expires_at <= NOW()');
    }
}

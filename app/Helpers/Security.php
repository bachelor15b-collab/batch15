<?php
namespace App\Helpers;

class Security
{
    public static function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost'   => 4,
            'threads'     => 1,
        ]);
    }

    public static function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    public static function needsRehash(string $hash): bool
    {
        return password_needs_rehash($hash, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost'   => 4,
            'threads'     => 1,
        ]);
    }

    public static function sanitize(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8', false);
    }

    public static function sanitizeArray(array $data): array
    {
        $cleaned = [];
        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $cleaned[$key] = self::sanitize($value);
            } elseif (is_array($value)) {
                $cleaned[$key] = self::sanitizeArray($value);
            } else {
                $cleaned[$key] = $value;
            }
        }
        return $cleaned;
    }

    public static function getClientIp(): string
    {
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }

    public static function getUserAgent(): string
    {
        return $_SERVER['HTTP_USER_AGENT'] ?? '';
    }

    public static function randomString(int $length = 32): string
    {
        return bin2hex(random_bytes($length));
    }

    public static function checkRateLimit(string $key, int $maxAttempts, int $windowSeconds): int|false
    {
        $dir = __DIR__ . '/../../uploads/_rate_limits';
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        $file = $dir . '/' . md5($key) . '.json';

        $data = ['attempts' => 0, 'first_attempt' => time()];
        if (file_exists($file)) {
            $saved = @json_decode(@file_get_contents($file), true);
            if ($saved && isset($saved['attempts'])) {
                $data = $saved;
            }
        }

        if ($data['attempts'] >= $maxAttempts) {
            if (time() - $data['first_attempt'] < $windowSeconds) {
                return false;
            }
            $data = ['attempts' => 0, 'first_attempt' => time()];
        }

        $data['attempts']++;
        @file_put_contents($file, json_encode($data), LOCK_EX);

        return $maxAttempts - $data['attempts'];
    }

    public static function resetRateLimit(string $key): void
    {
        $file = __DIR__ . '/../../uploads/_rate_limits/' . md5($key) . '.json';
        if (file_exists($file)) {
            @unlink($file);
        }
    }
}

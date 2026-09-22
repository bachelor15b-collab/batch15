<?php
/**
 * Application-wide configuration constants.
 */
namespace App\Config;

class App
{
    // Session
    const SESSION_LIFETIME    = 7200;       // 2 hours
    const SESSION_NAME        = 'CS15_SESS';

    // Rate limiting
    const MAX_LOGIN_ATTEMPTS  = 5;
    const LOCKOUT_MINUTES     = 15;
    const RATE_LIMIT_WINDOW   = 60;         // seconds
    const RATE_LIMIT_MAX_REQS = 60;         // per window

    // Security
    const CSRF_TOKEN_LENGTH   = 32;
    const BCRYPT_COST         = 12;

    // Pagination
    const DEFAULT_PER_PAGE    = 20;

    // Paths
    const UPLOAD_DIR          = __DIR__ . '/../../uploads';

    // CORS (strict allow-list only)
    const ALLOWED_ORIGINS     = ['http://localhost', 'http://localhost:3000', 'http://localhost:5173'];

    /**
     * Get the deployment root URL path (auto-detected).
     * Works from any entry point (index.php or api/index.php).
     * e.g. '' for root, '/B15' for subfolder.
     */
    public static function baseUrl(): string
    {
        $scriptName = $_SERVER['SCRIPT_NAME'] ?? '/index.php';
        $dir = dirname($scriptName);
        // If we're in /api subdirectory, go up one more level
        if (basename($dir) === 'api') {
            $dir = dirname($dir);
        }
        if ($dir === '/' || $dir === '\\') return '';
        return $dir;
    }

    /**
     * Get the API base path (auto-detected).
     * e.g. '/api' for root, '/B15/api' for subfolder.
     */
    public static function apiBasePath(): string
    {
        $base = self::baseUrl();
        return ($base ? $base : '') . '/api';
    }

    /**
     * Get config value with optional default.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $constants = (new \ReflectionClass(self::class))->getConstants();
        return $constants[$key] ?? $default;
    }
}

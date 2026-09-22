<?php
/**
 * CORS headers configuration.
 */
namespace App\Config;

use App\Config\App;

class Cors
{
    /**
     * Apply CORS headers for the current request.
     */
    public static function handle(): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        $allowed = App::ALLOWED_ORIGINS;

        if ($origin && in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Vary: Origin');
            header('Access-Control-Allow-Credentials: true');
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Auth-Token, X-Requested-With');
        header('Access-Control-Max-Age: 86400');

        // Handle preflight
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code($origin && !in_array($origin, $allowed, true) ? 403 : 204);
            exit;
        }
    }
}

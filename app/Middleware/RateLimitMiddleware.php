<?php
/**
 * Rate limiting middleware.
 * Protects against brute force and DoS attacks.
 */
namespace App\Middleware;

use App\Config\App;
use App\Helpers\Security;
use App\Helpers\Response;

class RateLimitMiddleware
{
    /**
     * Apply rate limiting by IP address.
     */
    public static function perIp(int $maxRequests = 60, int $windowSeconds = 60): void
    {
        $ip  = Security::getClientIp();
        $key = 'ratelimit_ip_' . $ip;

        $remaining = Security::checkRateLimit($key, $maxRequests, $windowSeconds);

        header('X-RateLimit-Limit: ' . $maxRequests);
        header('X-RateLimit-Remaining: ' . ($remaining === false ? 0 : $remaining));

        if ($remaining === false) {
            Response::tooManyRequests('Too many requests. Please try again later.');
        }
    }

    /**
     * Apply rate limiting by user ID (for authenticated endpoints).
     */
    public static function perUser(int $userId, int $maxRequests = 120, int $windowSeconds = 60): void
    {
        $key = 'ratelimit_user_' . $userId;

        $remaining = Security::checkRateLimit($key, $maxRequests, $windowSeconds);

        header('X-RateLimit-Limit: ' . $maxRequests);
        header('X-RateLimit-Remaining: ' . ($remaining === false ? 0 : $remaining));

        if ($remaining === false) {
            Response::tooManyRequests('Too many requests. Please try again later.');
        }
    }
}

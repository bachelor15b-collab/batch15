<?php
namespace App\Middleware;

use App\Helpers\AuthToken;
use App\Helpers\Response;
use App\Models\User;

class AuthMiddleware
{
    public static function authenticate(): ?User
    {
        $token = self::getBearerToken();
        if (!$token) {
            Response::unauthorized('Authentication required. Please log in.');
        }

        $row = AuthToken::validate($token);
        if (!$row) {
            Response::unauthorized('Invalid or expired token. Please log in again.');
        }

        $user = User::findById((int)$row['uid']);
        if (!$user || $user->status !== 'active') {
            AuthToken::revokeAllForUser((int)$row['uid']);
            Response::unauthorized('Account not found or has been suspended.');
        }

        // Extend token expiry on each authenticated request
        self::extendToken($token);

        return $user;
    }

    public static function optional(): ?User
    {
        $token = self::getBearerToken();
        if (!$token) {
            return null;
        }

        $row = AuthToken::validate($token);
        if (!$row) {
            return null;
        }

        $user = User::findById((int)$row['uid']);
        if (!$user || $user->status !== 'active') {
            AuthToken::revokeAllForUser((int)$row['uid']);
            return null;
        }

        self::extendToken($token);
        return $user;
    }

    private static function getBearerToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION']
               ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
               ?? '';

        if (preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
            return $m[1];
        }

        return $_SERVER['HTTP_X_AUTH_TOKEN'] ?? null;
    }

    private static function extendToken(string $token): void
    {
        $hash = hash('sha256', $token);
        $expires = date('Y-m-d H:i:s', time() + \App\Helpers\AuthToken::EXPIRY_SECONDS);
        $db = \App\Config\Database::getInstance();
        $stmt = $db->prepare('UPDATE auth_tokens SET expires_at = ? WHERE token_hash = ?');
        $stmt->execute([$expires, $hash]);
    }
}

<?php
/**
 * Google OAuth 2.0 helper.
 */
namespace App\Helpers;

use App\Config\Database;

class GoogleOAuth
{
    /**
     * Generate an authorization URL and persist the state token.
     */
    public static function getAuthorizationUrl(): string
    {
        $config = \App\Config\Database::getGoogleConfig();
        $state = bin2hex(random_bytes(32));

        self::saveState($state);

        $params = http_build_query([
            'client_id'     => $config['client_id'],
            'redirect_uri'  => $config['redirect_uri'],
            'response_type' => 'code',
            'scope'         => 'openid email profile',
            'state'         => $state,
            'access_type'   => 'offline',
            'prompt'        => 'consent',
        ]);

        return 'https://accounts.google.com/o/oauth2/v2/auth?' . $params;
    }

    /**
     * Exchange an authorization code for an access token.
     */
    public static function exchangeCode(string $code): ?array
    {
        $config = \App\Config\Database::getGoogleConfig();

        $response = self::post('https://oauth2.googleapis.com/token', [
            'code'          => $code,
            'client_id'     => $config['client_id'],
            'client_secret' => $config['client_secret'],
            'redirect_uri'  => $config['redirect_uri'],
            'grant_type'    => 'authorization_code',
        ]);

        return $response;
    }

    /**
     * Fetch the authenticated user's profile from Google.
     */
    public static function getUserInfo(string $accessToken): ?array
    {
        $ch = curl_init('https://www.googleapis.com/oauth2/v2/userinfo');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER    => ['Authorization: Bearer ' . $accessToken],
            CURLOPT_TIMEOUT       => 10,
        ]);

        $body = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($code !== 200 || !$body) {
            return null;
        }

        return json_decode($body, true);
    }

    /**
     * Persist a state token (valid for 10 minutes).
     */
    public static function saveState(string $state): void
    {
        $db = Database::getInstance();
        $expires = date('Y-m-d H:i:s', time() + 600);

        $stmt = $db->prepare(
            'INSERT INTO oauth_states (state_token, expires_at) VALUES (?, ?)'
        );
        $stmt->execute([$state, $expires]);
    }

    /**
     * Validate and consume a state token (single use).
     */
    public static function validateState(string $state): bool
    {
        $db = Database::getInstance();

        $stmt = $db->prepare(
            'SELECT id FROM oauth_states WHERE state_token = ? AND expires_at > NOW() LIMIT 1'
        );
        $stmt->execute([$state]);
        $row = $stmt->fetch();

        if (!$row) {
            return false;
        }

        // Delete the state (single use)
        $db->prepare('DELETE FROM oauth_states WHERE id = ?')->execute([$row['id']]);

        return true;
    }

    /**
     * Clean up expired state tokens (called periodically).
     */
    public static function cleanupStates(): void
    {
        $db = Database::getInstance();
        $db->exec('DELETE FROM oauth_states WHERE expires_at < NOW()');
    }

    /**
     * POST helper using cURL.
     */
    private static function post(string $url, array $data): ?array
    {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => http_build_query($data),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/x-www-form-urlencoded'],
        ]);

        $body = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($code !== 200 || !$body) {
            return null;
        }

        return json_decode($body, true);
    }
}

<?php
namespace App\Helpers;

class Maintenance
{
    /**
     * Run periodic cleanup routines at most once every 6 hours.
     */
    public static function runDueCleanup(): void
    {
        $markerDir = __DIR__ . '/../../uploads/_rate_limits';
        if (!is_dir($markerDir)) {
            @mkdir($markerDir, 0755, true);
        }
        $markerFile = $markerDir . '/_maintenance.json';
        $everySeconds = 6 * 3600;
        $now = time();

        $last = 0;
        if (file_exists($markerFile)) {
            $data = @json_decode(@file_get_contents($markerFile), true);
            $last = (int) ($data['at'] ?? 0);
        }

        if (($now - $last) < $everySeconds) {
            return;
        }

        @file_put_contents($markerFile, json_encode(['at' => $now]), LOCK_EX);

        AuthToken::cleanupExpired();
        GoogleOAuth::cleanupStates();
    }
}
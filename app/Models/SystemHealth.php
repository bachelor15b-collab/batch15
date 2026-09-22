<?php
namespace App\Models;
use App\Config\Database;
class SystemHealth {
    public static function record(string $service, string $status, ?int $responseTimeMs = null): void {
        $db = Database::getInstance();
        $stmt = $db->prepare('INSERT INTO system_health (service_name, status, response_time_ms) VALUES (?, ?, ?)');
        $stmt->execute([$service, $status, $responseTimeMs]);
    }
    public static function getLatest(): array {
        $db = Database::getInstance();
        return $db->query('SELECT sh.* FROM system_health sh INNER JOIN (SELECT service_name, MAX(checked_at) AS max_checked FROM system_health GROUP BY service_name) latest ON sh.service_name = latest.service_name AND sh.checked_at = latest.max_checked')->fetchAll();
    }
    public static function getHistory(string $service, int $limit = 60): array {
        $db = Database::getInstance();
        $stmt = $db->prepare('SELECT * FROM system_health WHERE service_name = ? ORDER BY checked_at DESC LIMIT ?');
        $stmt->execute([$service, $limit]);
        return $stmt->fetchAll();
    }
    public static function getSummary(): array {
        $db = Database::getInstance();
        return $db->query('SELECT service_name, status, COUNT(*) AS checks, AVG(response_time_ms) AS avg_response FROM system_health GROUP BY service_name, status')->fetchAll();
    }
}
<?php
/**
 * User-Agent parser — extracts OS, browser, and device type.
 * Lightweight: no external dependencies.
 */
namespace App\Helpers;

class UserAgentParser
{
    public static function parse(?string $ua): array
    {
        if (!$ua) {
            return ['os' => 'Unknown', 'browser' => 'Unknown', 'device_type' => 'unknown'];
        }

        return [
            'os'          => self::parseOS($ua),
            'browser'     => self::parseBrowser($ua),
            'device_type' => self::parseDeviceType($ua),
        ];
    }

    private static function parseOS(string $ua): string
    {
        if (preg_match('/Windows NT 10/i', $ua)) return 'Windows 10/11';
        if (preg_match('/Windows NT 6\.3/i', $ua)) return 'Windows 8.1';
        if (preg_match('/Windows NT 6\.2/i', $ua)) return 'Windows 8';
        if (preg_match('/Windows NT 6\.1/i', $ua)) return 'Windows 7';
        if (preg_match('/Windows/i', $ua)) return 'Windows';
        if (preg_match('/Mac OS X ([\d_]+)/i', $ua, $m)) return 'macOS ' . str_replace('_', '.', $m[1]);
        if (preg_match('/iPhone OS ([\d_]+)/i', $ua, $m)) return 'iOS ' . str_replace('_', '.', $m[1]);
        if (preg_match('/iPad.*OS ([\d_]+)/i', $ua, $m)) return 'iPadOS ' . str_replace('_', '.', $m[1]);
        if (preg_match('/Android ([\d.]+)/i', $ua, $m)) return 'Android ' . $m[1];
        if (preg_match('/Linux/i', $ua)) return 'Linux';
        if (preg_match('/CrOS/i', $ua)) return 'Chrome OS';
        if (preg_match('/Ubuntu/i', $ua)) return 'Ubuntu';
        return 'Unknown';
    }

    private static function parseBrowser(string $ua): string
    {
        if (preg_match('/Edg(?:e|A|iOS)?\/([\d.]+)/i', $ua, $m)) return 'Edge ' . ($m[1] ?? '');
        if (preg_match('/OPR\/([\d.]+)/i', $ua, $m)) return 'Opera ' . $m[1];
        if (preg_match('/Opera\/([\d.]+)/i', $ua, $m)) return 'Opera ' . $m[1];
        if (preg_match('/Vivaldi\/([\d.]+)/i', $ua, $m)) return 'Vivaldi ' . $m[1];
        if (preg_match('/Brave/i', $ua)) return 'Brave';
        if (preg_match('/SamsungBrowser\/([\d.]+)/i', $ua, $m)) return 'Samsung Browser ' . $m[1];
        if (preg_match('/UCBrowser\/([\d.]+)/i', $ua, $m)) return 'UC Browser ' . $m[1];
        if (preg_match('/Firefox\/([\d.]+)/i', $ua, $m)) return 'Firefox ' . $m[1];
        if (preg_match('/CriOS\/([\d.]+)/i', $ua, $m)) return 'Chrome (iOS) ' . $m[1];
        if (preg_match('/Chrome\/([\d.]+)/i', $ua, $m)) return 'Chrome ' . $m[1];
        if (preg_match('/Version\/([\d.]+).*Safari/i', $ua, $m)) return 'Safari ' . $m[1];
        if (preg_match('/Safari\/([\d.]+)/i', $ua, $m)) return 'Safari';
        if (preg_match('/MSIE ([\d.]+)/i', $ua, $m)) return 'IE ' . $m[1];
        if (preg_match('/Trident\/.*rv:([\d.]+)/i', $ua, $m)) return 'IE ' . $m[1];
        if (preg_match('/bot|crawler|spider|scraper/i', $ua)) return 'Bot';
        return 'Unknown';
    }

    private static function parseDeviceType(string $ua): string
    {
        if (preg_match('/bot|crawl|slurp|spider|mediapartners/i', $ua)) return 'bot';
        if (preg_match('/tablet|ipad/i', $ua)) return 'tablet';
        if (preg_match('/mobile|iphone|android.*mobile|windows phone/i', $ua)) return 'mobile';
        if (preg_match('/windows|macintosh|linux|cros/i', $ua)) return 'desktop';
        return 'unknown';
    }
}

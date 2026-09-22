<?php
/**
 * Database configuration & connection factory.
 */
namespace App\Config;

class Database
{
    private static ?\PDO $instance = null;

    private static string $host     = '127.0.0.1';
    private static string $port     = '3306';
    private static string $dbname   = 'cs15_hub';
    private static string $username = 'root';
    private static string $password = '';
    private static string $charset  = 'utf8mb4';
    private static bool $loadedFromEnv = false;

    /**
     * Prevent direct instantiation.
     */
    private function __construct() {}

    /**
     * Load credentials from environment or local config.
     */
    private static function loadCredentials(): void
    {
        if (self::$loadedFromEnv) return;

        $localConfig = __DIR__ . '/database.local.php';
        $hasLocal    = file_exists($localConfig);
        $config      = $hasLocal ? require $localConfig : [];

        // env vars take priority, then local config, then defaults
        $envHost = getenv('DB_HOST') ?: ($_SERVER['DB_HOST'] ?? '');
        if ($envHost !== '') {
            self::$host     = $envHost;
            self::$port     = getenv('DB_PORT') ?: ($_SERVER['DB_PORT'] ?? '3306');
            self::$dbname   = getenv('DB_NAME') ?: ($_SERVER['DB_NAME'] ?? 'cs15_hub');
            self::$username = getenv('DB_USER') ?: ($_SERVER['DB_USER'] ?? 'root');
            self::$password = getenv('DB_PASSWORD') ?: ($_SERVER['DB_PASSWORD'] ?? getenv('DB_PASS') ?: ($_SERVER['DB_PASS'] ?? ''));
        } elseif ($hasLocal) {
            self::$host     = $config['host'] ?? self::$host;
            self::$port     = $config['port'] ?? self::$port;
            self::$dbname   = $config['dbname'] ?? self::$dbname;
            self::$username = $config['username'] ?? self::$username;
            self::$password = $config['password'] ?? self::$password;
        }

        self::$loadedFromEnv = true;
    }

    /**
     * Return the singleton PDO connection.
     */
    public static function getInstance(): \PDO
    {
        if (self::$instance === null) {
            self::loadCredentials();

            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                self::$host,
                self::$port,
                self::$dbname,
                self::$charset
            );

            self::$instance = new \PDO($dsn, self::$username, self::$password, [
                \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
                \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
                \PDO::ATTR_EMULATE_PREPARES   => false,
            ]);
        }

        return self::$instance;
    }

    /**
     * Return the Batch15Tube YouTube database connection.
     */
    public static function getYoutubeInstance(): \PDO
    {
        return self::getCustomInstance(
            'batch15tube',
            getenv('DB_HOST') ?: '127.0.0.1',
            getenv('DB_PORT') ?: '3306',
            getenv('DB_USER') ?: 'root',
            getenv('DB_PASSWORD') ?: ''
        );
    }

    /**
     * Return Google OAuth configuration.
     */
    public static function getGoogleConfig(): array
    {
        $localConfig = __DIR__ . '/database.local.php';
        $config = file_exists($localConfig) ? require $localConfig : [];

        $clientId     = getenv('GOOGLE_CLIENT_ID')     ?: ($config['google_client_id']     ?? '');
        $clientSecret = getenv('GOOGLE_CLIENT_SECRET') ?: ($config['google_client_secret'] ?? '');
        $redirectUri  = getenv('GOOGLE_REDIRECT_URI')  ?: ($config['google_redirect_uri']  ?? '');

        // Fallback: auto-detect redirect URI from current request
        if (!$redirectUri) {
            $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
            $host   = $_SERVER['HTTP_HOST'] ?? 'localhost';
            $redirectUri = $scheme . '://' . $host . '/api/auth/google/callback';
        }

        return [
            'client_id'     => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri'  => $redirectUri,
        ];
    }

    /**
     * Return a PDO connection to a specific database.
     */
    private static function getCustomInstance(
        string $dbname,
        string $host = '127.0.0.1',
        string $port = '3306',
        string $username = 'root',
        string $password = ''
    ): \PDO
    {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=%s',
            $host,
            $port,
            $dbname,
            'utf8mb4'
        );

        return new \PDO($dsn, $username, $password, [
            \PDO::ATTR_ERRMODE            => \PDO::ERRMODE_EXCEPTION,
            \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
            \PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }

    /**
     * Override connection params (useful for testing).
     */
    public static function configure(
        string $host,
        string $port,
        string $dbname,
        string $username,
        string $password
    ): void {
        self::$host     = $host;
        self::$port     = $port;
        self::$dbname   = $dbname;
        self::$username = $username;
        self::$password = $password;
        self::$instance = null;
        self::$loadedFromEnv = true;
    }
}

<?php
/**
 * CS15 Hub API — Entry Point
 *
 * All API requests are routed through this file.
 */

// ─── Autoloader ──────────────────────────────────────────────
spl_autoload_register(function (string $class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/../app/';

    if (str_starts_with($class, $prefix)) {
        $relativeClass = substr($class, strlen($prefix));
        $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

        if (file_exists($file)) {
            require_once $file;
        }
    }
});

// ─── Error Handling ──────────────────────────────────────────
// Prevent any buffered output from breaking redirects
ob_start();

set_exception_handler(function (Throwable $e) {
    ob_clean();
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
    exit;
});

set_error_handler(function (int $severity, string $message, string $file, int $line) {
    if (!(error_reporting() & $severity)) {
        return false;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

// ─── Bootstrap ───────────────────────────────────────────────
use App\Config\Cors;
use App\Helpers\Maintenance;
use App\Middleware\RateLimitMiddleware;
use App\Routes\Api;

// Apply CORS headers
Cors::handle();

// Apply global rate limit (per IP)
RateLimitMiddleware::perIp(120, 60);

// Periodic cleanup of expired tokens / OAuth states
Maintenance::runDueCleanup();

// Get request info
$method = $_SERVER['REQUEST_METHOD'];
$uri    = $_SERVER['REQUEST_URI'];

// Register all API routes
Api::registerRoutes();

// Resolve the request
Api::resolve($method, $uri);

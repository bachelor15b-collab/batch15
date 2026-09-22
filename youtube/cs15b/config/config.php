<?php
// Batch15Tube Configuration

define('SITE_NAME', 'Batch15Tube');
define('SITE_URL', 'http://localhost/cs15b');
define('SITE_DESCRIPTION', 'Educational Video Platform for IT & CS Students');

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'batch15tube');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASSWORD') ?: (getenv('DB_PASS') !== false ? getenv('DB_PASS') : ''));

define('UPLOAD_PATH', __DIR__ . '/../uploads');
define('AVATAR_PATH', UPLOAD_PATH . '/avatars');
define('CERTIFICATE_PATH', UPLOAD_PATH . '/certificates');

define('DEFAULT_AVATAR', 'default.png');
define('MAX_FREE_VIDEOS', 2);
define('SESSION_TIMEOUT', 604800);
define('REMEMBER_ME_DURATION', 2592000);

define('TIMEZONE', 'UTC');
date_default_timezone_set(TIMEZONE);

session_start();

require_once __DIR__ . '/database.php';
require_once __DIR__ . '/functions.php';

if (isset($_COOKIE['remember_token']) && !isset($_SESSION['user_id'])) {
    $token = $_COOKIE['remember_token'];
    $stmt = $pdo->prepare("SELECT * FROM users WHERE remember_token = ? AND is_active = 1 AND is_suspended = 0");
    $stmt->execute([$token]);
    $user = $stmt->fetch();
    if ($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['first_name'] = $user['first_name'];
        $_SESSION['last_name'] = $user['last_name'];
        $_SESSION['avatar'] = $user['avatar'];
        $_SESSION['theme'] = $user['theme'];
        $_SESSION['language'] = $user['language'];
    }
}

// Validate session user still exists in DB (handles DB reset)
if (isset($_SESSION['user_id'])) {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    if (!$stmt->fetch()) {
        session_destroy();
        setcookie('remember_token', '', time() - 3600, '/');
        if (!isset($skipRedirect)) {
            header("Location: " . SITE_URL . "/public/index.php");
            exit;
        }
    }
}

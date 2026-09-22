<?php
require_once __DIR__ . '/../config/config.php';

if (isLoggedIn()) {
    $stmt = $pdo->prepare("UPDATE users SET remember_token = NULL WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    logActivity($_SESSION['user_id'], 'Logout', 'User logged out');
}

$_SESSION = [];
session_destroy();
setcookie('remember_token', '', time() - 3600, '/', '', false, true);

redirect(SITE_URL . '/public/index.php');

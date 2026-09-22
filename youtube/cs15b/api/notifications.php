<?php
require_once __DIR__ . '/../config/config.php';

if (!isLoggedIn()) {
    jsonResponse(['success' => false, 'message' => 'Login required'], 401);
}

$notifications = getNotifications($_SESSION['user_id'], 20);

jsonResponse(['success' => true, 'notifications' => $notifications]);

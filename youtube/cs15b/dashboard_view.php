<?php
require_once __DIR__ . '/config/config.php';

// Auto-login as test user
$email = 'ahmed@gmail.com';
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    // Create user first
    $first_name = 'Ahmed';
    $last_name = 'Hassan';
    $username = 'ahmed';
    $password = password_hash('123456', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, username, email, password, avatar, theme, language, is_active, created_at) VALUES (?, ?, ?, ?, ?, 'default.png', 'light', 'en', 1, NOW())");
    $stmt->execute([$first_name, $last_name, $username, $email, $password]);
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
}

// Set session
$_SESSION['user_id'] = $user['id'];
$_SESSION['username'] = $user['username'];
$_SESSION['first_name'] = $user['first_name'];
$_SESSION['last_name'] = $user['last_name'];
$_SESSION['avatar'] = $user['avatar'] ?? 'default.png';
$_SESSION['theme'] = $user['theme'] ?? 'light';
$_SESSION['language'] = $user['language'] ?? 'en';

// Now include the dashboard
require __DIR__ . '/public/index.php';

<?php
require_once __DIR__ . '/../config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $lang = $_POST['language'] ?? 'en';
    if (in_array($lang, ['en', 'so', 'ar'])) {
        $_SESSION['language'] = $lang;
        if (isLoggedIn()) {
            $stmt = $pdo->prepare("UPDATE users SET language = ? WHERE id = ?");
            $stmt->execute([$lang, $_SESSION['user_id']]);
        }
    }
}

jsonResponse(['success' => true]);

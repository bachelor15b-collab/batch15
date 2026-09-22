<?php
require_once __DIR__ . '/../config/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $theme = $_POST['theme'] ?? 'light';
    if (in_array($theme, ['light', 'dark'])) {
        $_SESSION['theme'] = $theme;
        if (isLoggedIn()) {
            $stmt = $pdo->prepare("UPDATE users SET theme = ? WHERE id = ?");
            $stmt->execute([$theme, $_SESSION['user_id']]);
        }
    }
}

jsonResponse(['success' => true]);

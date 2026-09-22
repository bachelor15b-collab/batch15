<?php
require_once __DIR__ . '/../config/config.php';

if (!isLoggedIn()) {
    jsonResponse(['success' => false, 'message' => 'Login required'], 401);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $videoId = intval($_POST['video_id'] ?? 0);
    $content = sanitize($_POST['content'] ?? '');

    if (!$videoId || empty($content)) {
        jsonResponse(['success' => false, 'message' => 'Invalid input'], 400);
    }

    $stmt = $pdo->prepare("INSERT INTO comments (user_id, video_id, content) VALUES (?, ?, ?)");
    $stmt->execute([$_SESSION['user_id'], $videoId, $content]);

    $stmt = $pdo->prepare("UPDATE videos SET comments_count = comments_count + 1 WHERE id = ?");
    $stmt->execute([$videoId]);

    jsonResponse(['success' => true, 'message' => 'Comment added']);
}

jsonResponse(['success' => false, 'message' => 'Invalid request'], 400);

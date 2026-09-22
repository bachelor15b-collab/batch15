<?php
require_once __DIR__ . '/../config/config.php';

if (!isLoggedIn()) {
    jsonResponse(['success' => false, 'message' => 'Login required'], 401);
}

$videoId = intval($_POST['video_id'] ?? 0);
if (!$videoId) {
    jsonResponse(['success' => false, 'message' => 'Invalid video'], 400);
}

$existing = isVideoLiked($_SESSION['user_id'], $videoId);

if ($existing) {
    $stmt = $pdo->prepare("DELETE FROM likes WHERE id = ?");
    $stmt->execute([$existing['id']]);
    $stmt = $pdo->prepare("UPDATE videos SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?");
    $stmt->execute([$videoId]);
    $liked = false;
} else {
    $stmt = $pdo->prepare("INSERT INTO likes (user_id, video_id) VALUES (?, ?)");
    $stmt->execute([$_SESSION['user_id'], $videoId]);
    $stmt = $pdo->prepare("UPDATE videos SET likes_count = likes_count + 1 WHERE id = ?");
    $stmt->execute([$videoId]);
    $liked = true;
}

$stmt = $pdo->prepare("SELECT likes_count FROM videos WHERE id = ?");
$stmt->execute([$videoId]);
$count = $stmt->fetch()['likes_count'];

jsonResponse(['success' => true, 'liked' => $liked, 'count' => $count]);

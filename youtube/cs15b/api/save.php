<?php
require_once __DIR__ . '/../config/config.php';

if (!isLoggedIn()) {
    jsonResponse(['success' => false, 'message' => 'Login required'], 401);
}

$videoId = intval($_POST['video_id'] ?? 0);
if (!$videoId) {
    jsonResponse(['success' => false, 'message' => 'Invalid video'], 400);
}

$saved = isVideoSaved($_SESSION['user_id'], $videoId);

if ($saved) {
    $stmt = $pdo->prepare("DELETE FROM saved_videos WHERE user_id = ? AND video_id = ?");
    $stmt->execute([$_SESSION['user_id'], $videoId]);
    $isSaved = false;
} else {
    $stmt = $pdo->prepare("INSERT INTO saved_videos (user_id, video_id) VALUES (?, ?)");
    $stmt->execute([$_SESSION['user_id'], $videoId]);
    $isSaved = true;
}

jsonResponse(['success' => true, 'saved' => $isSaved]);

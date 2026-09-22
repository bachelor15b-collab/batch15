<?php
require_once __DIR__ . '/../config/config.php';

if (!isLoggedIn()) {
    jsonResponse(['success' => false, 'message' => 'Login required'], 401);
}

$videoId = intval($_POST['video_id'] ?? 0);
$progress = floatval($_POST['progress'] ?? 0);
$duration = intval($_POST['duration'] ?? 0);

if (!$videoId) {
    jsonResponse(['success' => false, 'message' => 'Invalid video'], 400);
}

// Update progress
$stmt = $pdo->prepare(
    "INSERT INTO video_progress (user_id, video_id, progress, completed)
     VALUES (?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE progress = VALUES(progress), completed = VALUES(completed), last_watched = NOW()"
);
$completed = $progress >= 90 ? 1 : 0;
$stmt->execute([$_SESSION['user_id'], $videoId, $progress, $completed]);

// Update watch history duration if provided
if ($duration > 0) {
    $stmt = $pdo->prepare(
        "UPDATE watch_history SET duration_watched = ? WHERE user_id = ? AND video_id = ? ORDER BY watched_at DESC LIMIT 1"
    );
    $stmt->execute([$duration, $_SESSION['user_id'], $videoId]);
}

// Award XP
if ($completed) {
    $stmt = $pdo->prepare("UPDATE users SET xp_points = xp_points + 50 WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);

    // Check for certificate
    $stmt2 = $pdo->prepare("SELECT id FROM videos WHERE skill_id = (SELECT skill_id FROM videos WHERE id = ?) AND is_active = 1");
    $stmt2->execute([$videoId]);
    $totalLessons = $stmt2->rowCount();

    $stmt3 = $pdo->prepare(
        "SELECT COUNT(*) as total FROM video_progress vp
         JOIN videos v ON vp.video_id = v.id
         WHERE vp.user_id = ? AND vp.completed = 1 AND v.skill_id = (SELECT skill_id FROM videos WHERE id = ?)"
    );
    $stmt3->execute([$_SESSION['user_id'], $videoId]);
    $completedLessons = $stmt3->fetch()['total'];

    if ($completedLessons >= $totalLessons && $totalLessons > 0) {
        $stmt4 = $pdo->prepare("SELECT skill_id FROM videos WHERE id = ?");
        $stmt4->execute([$videoId]);
        $skillId = $stmt4->fetch()['skill_id'];

        $stmt5 = $pdo->prepare("SELECT id FROM certificates WHERE user_id = ? AND skill_id = ?");
        $stmt5->execute([$_SESSION['user_id'], $skillId]);

        if (!$stmt5->fetch()) {
            $code = 'BT-' . strtoupper(bin2hex(random_bytes(4)));
            $stmt6 = $pdo->prepare("INSERT INTO certificates (user_id, skill_id, certificate_code, issued_date) VALUES (?, ?, ?, CURDATE())");
            $stmt6->execute([$_SESSION['user_id'], $skillId, $code]);
        }
    }
}

jsonResponse(['success' => true, 'progress' => $progress, 'completed' => $completed]);

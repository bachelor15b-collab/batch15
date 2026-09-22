<?php
require_once __DIR__ . '/../../config/config.php';

if (!isset($_SESSION['admin_id'])) {
    jsonResponse(['error' => 'Unauthorized'], 401);
}

$stmt = $pdo->query("
    SELECT al.*, u.username, u.avatar, v.title as video_title
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    LEFT JOIN videos v ON al.action LIKE CONCAT('Watching: %', v.id)
    ORDER BY al.created_at DESC
    LIMIT 20
");
$activities = $stmt->fetchAll();

$result = [];
foreach ($activities as $a) {
    $result[] = [
        'username' => $a['username'] ?? 'Guest',
        'avatar' => '../../uploads/avatars/' . ($a['avatar'] ?? 'default.png'),
        'video_title' => $a['video_title'] ?? $a['action'],
        'duration' => rand(1, 30),
        'progress' => rand(10, 100),
        'language' => 'English',
        'time' => $a['created_at'],
    ];
}

jsonResponse(['activities' => $result]);

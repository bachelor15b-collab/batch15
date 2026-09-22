<?php
require_once __DIR__ . '/../config/config.php';
if (!isLoggedIn()) redirect(SITE_URL . '/auth/login.php');
$pageTitle = 'Completed Lessons';
$stmt = $pdo->prepare("
    SELECT v.*, vp.completed, vp.last_watched, s.name as skill_name, s.color as skill_color
    FROM video_progress vp
    JOIN videos v ON vp.video_id = v.id
    LEFT JOIN skills s ON v.skill_id = s.id
    WHERE vp.user_id = ? AND vp.completed = 1
    ORDER BY vp.last_watched DESC
");
$stmt->execute([$_SESSION['user_id']]);
$videos = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Completed - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <?php include __DIR__ . '/../includes/header.php'; ?>
    <div style="max-width:1400px;margin:0 auto;">
        <h1 style="font-size:28px;font-weight:700;margin-bottom:24px;"><i class="fas fa-check-circle" style="color:#10b981;"></i> Completed Lessons</h1>
        <?php if (empty($videos)): ?>
        <div style="text-align:center;padding:60px 20px;color:var(--text-secondary);">
            <i class="fas fa-check-circle" style="font-size:48px;margin-bottom:16px;opacity:0.5;"></i>
            <h2 style="color:var(--text-primary);">No completed lessons yet</h2>
            <p>Keep learning and complete lessons to see them here</p>
            <a href="<?= SITE_URL ?>/public/index.php" class="btn btn-primary" style="margin-top:16px;">Continue Learning</a>
        </div>
        <?php else: ?>
        <div class="video-grid">
            <?php foreach ($videos as $video): ?>
            <div class="video-card" data-url="<?= SITE_URL ?>/public/video.php?id=<?= $video['id'] ?>">
                <div class="video-thumbnail">
                    <img src="<?= htmlspecialchars($video['thumbnail'] ?? SITE_URL . '/assets/images/placeholder.jpg') ?>" alt="" loading="lazy">
                    <span class="video-duration"><?= htmlspecialchars($video['duration'] ?? '0:00') ?></span>
                    <div style="position:absolute;top:8px;left:8px;background:#10b981;color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">
                        <i class="fas fa-check"></i> Done
                    </div>
                </div>
                <div class="video-info">
                    <h3 class="video-title"><?= htmlspecialchars($video['title']) ?></h3>
                    <div class="video-meta"><span>Completed <?= timeAgo($video['last_watched']) ?></span></div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
    <?php include __DIR__ . '/../includes/footer.php'; ?>
</body>
</html>

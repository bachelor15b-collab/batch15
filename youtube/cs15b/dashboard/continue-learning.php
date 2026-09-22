<?php
require_once __DIR__ . '/../config/config.php';
if (!isLoggedIn()) redirect(SITE_URL . '/auth/login.php');
$pageTitle = 'Continue Learning';
$stmt = $pdo->prepare("
    SELECT v.*, vp.progress, vp.last_watched, s.name as skill_name, s.color as skill_color
    FROM video_progress vp
    JOIN videos v ON vp.video_id = v.id
    LEFT JOIN skills s ON v.skill_id = s.id
    WHERE vp.user_id = ? AND vp.completed = 0 AND vp.progress > 0
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
    <title>Continue Learning - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <?php include __DIR__ . '/../includes/header.php'; ?>
    <div style="max-width:1400px;margin:0 auto;">
        <h1 style="font-size:28px;font-weight:700;margin-bottom:24px;"><i class="fas fa-play-circle" style="color:var(--primary)"></i> Continue Learning</h1>
        <?php if (empty($videos)): ?>
        <div style="text-align:center;padding:60px 20px;color:var(--text-secondary);">
            <i class="fas fa-play-circle" style="font-size:48px;margin-bottom:16px;opacity:0.5;"></i>
            <h2 style="color:var(--text-primary);">Nothing in progress</h2>
            <p>Start a new lesson to track your progress</p>
            <a href="<?= SITE_URL ?>/public/index.php" class="btn btn-primary" style="margin-top:16px;">Browse Lessons</a>
        </div>
        <?php else: ?>
        <div class="video-grid">
            <?php foreach ($videos as $video): ?>
            <div class="video-card" data-url="<?= SITE_URL ?>/public/video.php?id=<?= $video['id'] ?>">
                <div class="video-thumbnail">
                    <img src="<?= htmlspecialchars($video['thumbnail'] ?? SITE_URL . '/assets/images/placeholder.jpg') ?>" alt="" loading="lazy">
                    <span class="video-duration"><?= htmlspecialchars($video['duration'] ?? '0:00') ?></span>
                    <div style="position:absolute;bottom:8px;left:8px;right:8px;">
                        <div style="background:rgba(0,0,0,0.6);height:4px;border-radius:2px;overflow:hidden;">
                            <div style="height:100%;width:<?= $video['progress'] ?>%;background:var(--primary);border-radius:2px;"></div>
                        </div>
                    </div>
                </div>
                <div class="video-info">
                    <h3 class="video-title"><?= htmlspecialchars($video['title']) ?></h3>
                    <div class="video-meta">
                        <span><?= round($video['progress']) ?>% complete</span>
                        <span>&middot;</span>
                        <span>Last watched <?= timeAgo($video['last_watched']) ?></span>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
    <?php include __DIR__ . '/../includes/footer.php'; ?>
</body>
</html>

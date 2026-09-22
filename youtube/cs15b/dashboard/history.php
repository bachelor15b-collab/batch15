<?php
require_once __DIR__ . '/../config/config.php';
if (!isLoggedIn()) redirect(SITE_URL . '/auth/login.php');
$pageTitle = 'Watch History';
$history = getWatchHistory($_SESSION['user_id'], 100);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Watch History - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <?php include __DIR__ . '/../includes/header.php'; ?>
    <div style="max-width:1400px;margin:0 auto;">
        <h1 style="font-size:28px;font-weight:700;margin-bottom:24px;"><i class="fas fa-history"></i> Watch History</h1>
        <?php if (empty($history)): ?>
        <div style="text-align:center;padding:60px 20px;color:var(--text-secondary);">
            <i class="fas fa-history" style="font-size:48px;margin-bottom:16px;opacity:0.5;"></i>
            <h2 style="color:var(--text-primary);">No history yet</h2>
            <p>Start watching videos to build your history</p>
            <a href="<?= SITE_URL ?>/public/index.php" class="btn btn-primary" style="margin-top:16px;">Browse Videos</a>
        </div>
        <?php else: ?>
        <div class="video-grid">
            <?php foreach ($history as $video): ?>
            <div class="video-card" data-url="<?= SITE_URL ?>/public/video.php?id=<?= $video['id'] ?>">
                <div class="video-thumbnail">
                    <img src="<?= htmlspecialchars($video['thumbnail'] ?? SITE_URL . '/assets/images/placeholder.jpg') ?>" alt="" loading="lazy">
                    <span class="video-duration"><?= htmlspecialchars($video['duration'] ?? '0:00') ?></span>
                </div>
                <div class="video-info">
                    <h3 class="video-title"><?= htmlspecialchars($video['title']) ?></h3>
                    <div class="video-meta"><span>Watched <?= timeAgo($video['watched_at']) ?></span></div>
                    <?php if (!empty($video['skill_name'])): ?>
                    <span class="video-skill-tag" style="background:<?= htmlspecialchars($video['skill_color']) ?>"><?= htmlspecialchars($video['skill_name']) ?></span>
                    <?php endif; ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
    <?php include __DIR__ . '/../includes/footer.php'; ?>
</body>
</html>

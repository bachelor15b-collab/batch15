<?php
require_once __DIR__ . '/../config/config.php';
$pageTitle = 'Trending';
$stmt = $pdo->query("SELECT v.*, s.name as skill_name, s.color as skill_color FROM videos v LEFT JOIN skills s ON v.skill_id = s.id WHERE v.is_active = 1 AND v.is_hidden = 0 ORDER BY v.views DESC LIMIT 50");
$videos = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trending - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <?php include __DIR__ . '/../includes/header.php'; ?>
    <div class="page-container" style="max-width:1400px;margin:0 auto;">
        <h1 class="page-title" style="font-size:28px;font-weight:700;margin-bottom:8px;"><i class="fas fa-fire" style="color:var(--secondary)"></i> Trending</h1>
        <p style="color:var(--text-secondary);margin-bottom:24px;">Most popular lessons across all skills</p>
        <div class="video-grid">
            <?php foreach ($videos as $i => $video): ?>
            <div class="video-card" data-url="<?= SITE_URL ?>/public/video.php?id=<?= $video['id'] ?>">
                <div class="video-thumbnail">
                    <img src="<?= htmlspecialchars($video['thumbnail'] ?? SITE_URL . '/assets/images/placeholder.jpg') ?>" alt="" loading="lazy">
                    <span class="video-duration"><?= htmlspecialchars($video['duration'] ?? '0:00') ?></span>
                </div>
                <div class="video-info">
                    <h3 class="video-title"><?= htmlspecialchars($video['title']) ?></h3>
                    <div class="video-meta">
                        <span><?= htmlspecialchars($video['instructor'] ?? 'Batch15Tube') ?></span>
                        <span>&middot;</span>
                        <span><?= number_format($video['views'] ?? 0) ?> views</span>
                    </div>
                    <?php if (!empty($video['skill_name'])): ?>
                    <span class="video-skill-tag" style="background:<?= htmlspecialchars($video['skill_color']) ?>"><?= htmlspecialchars($video['skill_name']) ?></span>
                    <?php endif; ?>
                </div>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php include __DIR__ . '/../includes/footer.php'; ?>
</body>
</html>

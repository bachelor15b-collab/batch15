<?php
require_once __DIR__ . '/../config/config.php';
$pageTitle = 'Explore';
$videos = getVideos(100);
$skills = getSkills();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Explore - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <?php include __DIR__ . '/../includes/header.php'; ?>

    <div class="page-container" style="max-width:1400px;margin:0 auto;">
        <h1 class="page-title" style="font-size:28px;font-weight:700;margin-bottom:24px;">Explore Skills</h1>
        <div class="skills-carousel" style="margin-bottom:32px;">
            <?php foreach ($skills as $skill): ?>
            <a href="<?= SITE_URL ?>/public/skill.php?slug=<?= $skill['slug'] ?>" class="skill-card" style="background: <?= $skill['color'] ?>">
                <div class="skill-card-icon"><i class="fas fa-<?= $skill['icon'] ?? 'code' ?>"></i></div>
                <div class="skill-card-name"><?= htmlspecialchars($skill['name']) ?></div>
            </a>
            <?php endforeach; ?>
        </div>

        <h2 class="section-title" style="margin-bottom:20px;">All Videos</h2>
        <div class="video-grid">
            <?php foreach ($videos as $video): ?>
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

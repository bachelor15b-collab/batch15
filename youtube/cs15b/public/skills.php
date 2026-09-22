<?php
require_once __DIR__ . '/../config/config.php';
$pageTitle = 'All Skills';
$skills = getSkills();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>All Skills - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
        .skill-card-large { padding: 24px 16px; border-radius: var(--radius); text-align: center; color: white; cursor: pointer; transition: var(--transition); }
        .skill-card-large:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); }
        .skill-card-large i { font-size: 36px; margin-bottom: 12px; display: block; }
        .skill-card-large span { font-size: 13px; font-weight: 600; }
    </style>
</head>
<body>
    <?php include __DIR__ . '/../includes/header.php'; ?>
    <div class="page-container" style="max-width:1400px;margin:0 auto;">
        <h1 class="page-title" style="font-size:28px;font-weight:700;margin-bottom:24px;">All Skills</h1>
        <p style="color:var(--text-secondary);margin-bottom:24px;">Choose a skill to start learning. Each skill has a complete learning roadmap with video lessons.</p>
        <div class="skills-grid">
            <?php foreach ($skills as $skill): ?>
            <a href="<?= SITE_URL ?>/public/skill.php?slug=<?= $skill['slug'] ?>" class="skill-card-large" style="background:<?= $skill['color'] ?>">
                <i class="fas fa-<?= $skill['icon'] ?? 'code' ?>"></i>
                <span><?= htmlspecialchars($skill['name']) ?></span>
            </a>
            <?php endforeach; ?>
        </div>
    </div>
    <?php include __DIR__ . '/../includes/footer.php'; ?>
</body>
</html>

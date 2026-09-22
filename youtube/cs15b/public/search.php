<?php
require_once __DIR__ . '/../config/config.php';
$pageTitle = 'Search Results';
$query = sanitize($_GET['q'] ?? '');
$results = [];

if (!empty($query)) {
    $searchTerm = '%' . $query . '%';
    $stmt = $pdo->prepare(
        "SELECT v.*, s.name as skill_name, s.color as skill_color
         FROM videos v
         LEFT JOIN skills s ON v.skill_id = s.id
         WHERE v.is_active = 1 AND v.is_hidden = 0
         AND (v.title LIKE ? OR v.description LIKE ? OR v.instructor LIKE ? OR s.name LIKE ?)
         ORDER BY v.views DESC
         LIMIT 50"
    );
    $stmt->execute([$searchTerm, $searchTerm, $searchTerm, $searchTerm]);
    $results = $stmt->fetchAll();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search: <?= htmlspecialchars($query) ?> - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <?php include __DIR__ . '/../includes/header.php'; ?>
    <div class="page-container" style="max-width:1400px;margin:0 auto;">
        <h1 class="page-title" style="font-size:28px;font-weight:700;margin-bottom:8px;">
            Results for "<?= htmlspecialchars($query) ?>"
        </h1>
        <p style="color:var(--text-secondary);margin-bottom:24px;"><?= count($results) ?> results found</p>

        <?php if (empty($results)): ?>
        <div style="text-align:center;padding:60px 20px;color:var(--text-secondary);">
            <i class="fas fa-search" style="font-size:48px;margin-bottom:16px;opacity:0.5;"></i>
            <h2 style="color:var(--text-primary);">No results found</h2>
            <p>Try different keywords or browse skills</p>
            <a href="<?= SITE_URL ?>/public/skills.php" class="btn btn-primary" style="margin-top:16px;">Browse Skills</a>
        </div>
        <?php else: ?>
        <div class="video-grid">
            <?php foreach ($results as $video): ?>
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
        <?php endif; ?>
    </div>
    <?php include __DIR__ . '/../includes/footer.php'; ?>
</body>
</html>

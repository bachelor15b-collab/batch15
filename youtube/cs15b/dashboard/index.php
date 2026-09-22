<?php
require_once __DIR__ . '/../config/config.php';
if (!isLoggedIn()) redirect(SITE_URL . '/auth/login.php');
$pageTitle = 'Dashboard';

$user = getUser();
$totalHours = getTotalWatchHours($_SESSION['user_id']);
$completedLessons = getCompletedLessons($_SESSION['user_id']);
$currentSkill = getCurrentSkill($_SESSION['user_id']);
$streak = getLearningStreak($_SESSION['user_id']);
$certificates = getCertificates($_SESSION['user_id']);
$recentHistory = getWatchHistory($_SESSION['user_id'], 10);
$savedVideos = getSavedVideos($_SESSION['user_id']);
$notifications = getNotifications($_SESSION['user_id'], 5);

// Calculate total lessons
$stmt = $pdo->query("SELECT COUNT(*) as total FROM videos WHERE is_active = 1 AND is_hidden = 0");
$totalLessons = $stmt->fetch()['total'];
$remainingLessons = $totalLessons - $completedLessons;

// Weekly hours
$stmt = $pdo->prepare("
    SELECT DAYOFWEEK(watched_at) as day, COALESCE(SUM(duration_watched), 0) as hours
    FROM watch_history
    WHERE user_id = ? AND watched_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY DAYOFWEEK(watched_at)
    ORDER BY day
");
$stmt->execute([$_SESSION['user_id']]);
$weeklyData = $stmt->fetchAll();
$weeklyHours = array_fill(0, 7, 0);
foreach ($weeklyData as $d) {
    $idx = ($d['day'] + 5) % 7;
    $weeklyHours[$idx] = round($d['hours'] / 3600, 1);
}
$weeklyHoursStr = implode(',', $weeklyHours);

// Monthly hours
$stmt = $pdo->prepare("
    SELECT MONTH(watched_at) as month, COALESCE(SUM(duration_watched), 0) as hours
    FROM watch_history
    WHERE user_id = ? AND watched_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY MONTH(watched_at)
    ORDER BY month
");
$stmt->execute([$_SESSION['user_id']]);
$monthlyData = $stmt->fetchAll();
$monthlyHours = array_fill(0, 12, 0);
foreach ($monthlyData as $d) {
    $monthlyHours[$d['month'] - 1] = round($d['hours'] / 3600, 1);
}
$monthlyHoursStr = implode(',', $monthlyHours);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        .dashboard-header { display:flex;align-items:center;gap:20px;margin-bottom:32px;flex-wrap:wrap; }
        .dashboard-avatar { width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--primary); }
        .dashboard-user h1 { font-size:24px; }
        .dashboard-user p { color:var(--text-secondary); }
        .charts-grid { display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:32px; }
        @media (max-width:768px) { .charts-grid { grid-template-columns:1fr; } }
    </style>
</head>
<body>
    <?php include __DIR__ . '/../includes/header.php'; ?>
    <div class="page-container" style="max-width:1400px;margin:0 auto;">
        <!-- Header -->
        <div class="dashboard-header">
            <img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($user['avatar'] ?? 'default.png') ?>" class="dashboard-avatar">
            <div class="dashboard-user">
                <h1>Welcome back, <?= htmlspecialchars($user['first_name']) ?>!</h1>
                <p>
                    <span class="xp-badge"><i class="fas fa-star"></i> <?= number_format($user['xp_points'] ?? 0) ?> XP</span>
                    <span class="level-badge"><i class="fas fa-trophy"></i> Level <?= $user['level'] ?? 1 ?></span>
                    <?php if ($streak > 0): ?>
                    <span style="margin-left:8px;">🔥 <?= $streak ?> day streak</span>
                    <?php endif; ?>
                </p>
            </div>
        </div>

        <!-- Overview Cards -->
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <div class="card-icon" style="background:rgba(108,99,255,0.1);color:var(--primary);"><i class="fas fa-clock"></i></div>
                <div class="card-value"><?= round($totalHours / 3600, 1) ?>h</div>
                <div class="card-label">Total Hours Watched</div>
            </div>
            <div class="dashboard-card">
                <div class="card-icon" style="background:rgba(16,185,129,0.1);color:#10b981;"><i class="fas fa-check-circle"></i></div>
                <div class="card-value"><?= $completedLessons ?></div>
                <div class="card-label">Completed Lessons</div>
            </div>
            <div class="dashboard-card">
                <div class="card-icon" style="background:rgba(249,115,22,0.1);color:#f97316;"><i class="fas fa-book-open"></i></div>
                <div class="card-value"><?= max(0, $remainingLessons) ?></div>
                <div class="card-label">Remaining Lessons</div>
            </div>
            <div class="dashboard-card">
                <div class="card-icon" style="background:rgba(59,130,246,0.1);color:#3b82f6;"><i class="fas fa-graduation-cap"></i></div>
                <div class="card-value"><?= $currentSkill['name'] ?? 'N/A' ?></div>
                <div class="card-label">Current Skill</div>
            </div>
            <div class="dashboard-card">
                <div class="card-icon" style="background:rgba(239,68,68,0.1);color:#ef4444;"><i class="fas fa-fire"></i></div>
                <div class="card-value"><?= $streak ?></div>
                <div class="card-label">Learning Streak (days)</div>
            </div>
            <div class="dashboard-card">
                <div class="card-icon" style="background:rgba(139,92,246,0.1);color:#8b5cf6;"><i class="fas fa-certificate"></i></div>
                <div class="card-value"><?= count($certificates) ?></div>
                <div class="card-label">Certificates</div>
            </div>
        </div>

        <!-- Charts -->
        <div class="charts-grid">
            <div class="chart-container">
                <h3 class="chart-title">Weekly Study Hours</h3>
                <canvas id="weeklyChart" width="400" height="200" data-hours="<?= $weeklyHoursStr ?>"></canvas>
            </div>
            <div class="chart-container">
                <h3 class="chart-title">Monthly Progress</h3>
                <canvas id="monthlyChart" width="400" height="200" data-monthly="<?= $monthlyHoursStr ?>"></canvas>
            </div>
        </div>

        <!-- Continue Learning -->
        <?php if (!empty($recentHistory)): ?>
        <section style="margin-bottom:32px;">
            <div class="section-header">
                <h2 class="section-title">Continue Learning</h2>
                <a href="<?= SITE_URL ?>/dashboard/continue-learning.php" class="see-all">See All</a>
            </div>
            <div class="video-grid">
                <?php foreach (array_slice($recentHistory, 0, 4) as $video): ?>
                <div class="video-card" data-url="<?= SITE_URL ?>/public/video.php?id=<?= $video['id'] ?>">
                    <div class="video-thumbnail">
                        <img src="<?= htmlspecialchars($video['thumbnail'] ?? SITE_URL . '/assets/images/placeholder.jpg') ?>" alt="" loading="lazy">
                        <span class="video-duration"><?= htmlspecialchars($video['duration'] ?? '0:00') ?></span>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title"><?= htmlspecialchars($video['title']) ?></h3>
                        <div class="video-meta"><span><?= timeAgo($video['watched_at']) ?></span></div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </section>
        <?php endif; ?>

        <!-- Saved Videos -->
        <?php if (!empty($savedVideos)): ?>
        <section style="margin-bottom:32px;">
            <div class="section-header">
                <h2 class="section-title">Saved Videos</h2>
                <a href="<?= SITE_URL ?>/dashboard/saved.php" class="see-all">See All</a>
            </div>
            <div class="video-grid">
                <?php foreach (array_slice($savedVideos, 0, 4) as $video): ?>
                <div class="video-card" data-url="<?= SITE_URL ?>/public/video.php?id=<?= $video['id'] ?>">
                    <div class="video-thumbnail">
                        <img src="<?= htmlspecialchars($video['thumbnail'] ?? SITE_URL . '/assets/images/placeholder.jpg') ?>" alt="" loading="lazy">
                        <span class="video-duration"><?= htmlspecialchars($video['duration'] ?? '0:00') ?></span>
                    </div>
                    <div class="video-info">
                        <h3 class="video-title"><?= htmlspecialchars($video['title']) ?></h3>
                        <div class="video-meta"><span>Saved <?= timeAgo($video['saved_at']) ?></span></div>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
        </section>
        <?php endif; ?>

        <!-- Certificates -->
        <?php if (!empty($certificates)): ?>
        <section style="margin-bottom:32px;">
            <div class="section-header">
                <h2 class="section-title">Certificates</h2>
                <a href="<?= SITE_URL ?>/dashboard/certificates.php" class="see-all">See All</a>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px;">
                <?php foreach ($certificates as $cert): ?>
                <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius);padding:20px;text-align:center;">
                    <i class="fas fa-certificate" style="font-size:36px;color:<?= $cert['skill_color'] ?? 'var(--primary)' ?>;margin-bottom:8px;"></i>
                    <h4 style="font-size:14px;"><?= htmlspecialchars($cert['skill_name']) ?></h4>
                    <p style="font-size:12px;color:var(--text-secondary);"><?= $cert['issued_date'] ?></p>
                    <a href="<?= SITE_URL ?>/certificates/download.php?id=<?= $cert['id'] ?>" class="btn btn-outline" style="margin-top:12px;font-size:12px;padding:6px 16px;">
                        <i class="fas fa-download"></i> Download
                    </a>
                </div>
                <?php endforeach; ?>
            </div>
        </section>
        <?php endif; ?>
    </div>

    <?php include __DIR__ . '/../includes/footer.php'; ?>
    <script src="<?= SITE_URL ?>/assets/js/dashboard.js"></script>
</body>
</html>

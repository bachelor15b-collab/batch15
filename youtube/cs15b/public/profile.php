<?php
require_once __DIR__ . '/../config/config.php';
if (!isLoggedIn()) redirect(SITE_URL . '/auth/login.php');
$pageTitle = 'Profile';
$user = getUser();
$certificates = getCertificates($_SESSION['user_id']);
$completedLessons = getCompletedLessons($_SESSION['user_id']);
$streak = getLearningStreak($_SESSION['user_id']);
$totalHours = getTotalWatchHours($_SESSION['user_id']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        .profile-header { display:flex;align-items:center;gap:32px;padding:40px;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid var(--border-color);margin-bottom:32px;flex-wrap:wrap; }
        .profile-avatar { width:120px;height:120px;border-radius:50%;object-fit:cover;border:4px solid var(--primary); }
        .profile-info h1 { font-size:28px;margin-bottom:4px; }
        .profile-stats { display:flex;gap:32px;margin-top:16px;flex-wrap:wrap; }
        .profile-stat { text-align:center; }
        .profile-stat-value { font-size:20px;font-weight:800; }
        .profile-stat-label { font-size:12px;color:var(--text-secondary); }
        .badge-container { display:flex;gap:16px;flex-wrap:wrap;margin-top:16px; }
        .earned-badge { display:flex;align-items:center;gap:8px;padding:8px 16px;background:var(--bg-tertiary);border-radius:20px;font-size:13px;font-weight:600; }
        .earned-badge i { color:gold; }
    </style>
</head>
<body>
    <?php include __DIR__ . '/../includes/header.php'; ?>
    <div style="max-width:1200px;margin:0 auto;">
        <!-- Profile Header -->
        <div class="profile-header">
            <img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($user['avatar'] ?? 'default.png') ?>" class="profile-avatar">
            <div class="profile-info">
                <h1><?= htmlspecialchars($user['first_name'] . ' ' . $user['last_name']) ?></h1>
                <p style="color:var(--text-secondary);">@<?= htmlspecialchars($user['username']) ?> &middot; Joined <?= date('M Y', strtotime($user['created_at'])) ?></p>
                <div class="profile-stats">
                    <div class="profile-stat"><div class="profile-stat-value"><?= round($totalHours / 3600, 1) ?>h</div><div class="profile-stat-label">Watched</div></div>
                    <div class="profile-stat"><div class="profile-stat-value"><?= $completedLessons ?></div><div class="profile-stat-label">Completed</div></div>
                    <div class="profile-stat"><div class="profile-stat-value"><?= $streak ?></div><div class="profile-stat-label">Day Streak</div></div>
                    <div class="profile-stat"><div class="profile-stat-value"><?= count($certificates) ?></div><div class="profile-stat-label">Certificates</div></div>
                    <div class="profile-stat"><div class="profile-stat-value"><?= number_format($user['xp_points'] ?? 0) ?></div><div class="profile-stat-label">XP Points</div></div>
                </div>
                <div class="badge-container">
                    <span class="earned-badge"><i class="fas fa-star"></i> Level <?= $user['level'] ?? 1 ?></span>
                    <?php if ($streak >= 7): ?><span class="earned-badge"><i class="fas fa-fire"></i> <?= $streak ?>-Day Streak</span><?php endif; ?>
                    <?php if ($completedLessons >= 10): ?><span class="earned-badge"><i class="fas fa-graduation-cap"></i> Dedicated Learner</span><?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    <?php include __DIR__ . '/../includes/footer.php'; ?>
</body>
</html>

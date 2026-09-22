<?php
require_once __DIR__ . '/../config/config.php';
if (!isset($_SESSION['admin_id'])) redirect(SITE_URL . '/admin/index.php');
$pageTitle = 'Analytics';

// Daily views (last 30 days)
$stmt = $pdo->query("
    SELECT DATE(watched_at) as date, COUNT(*) as views
    FROM watch_history
    WHERE watched_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(watched_at)
    ORDER BY date
");
$dailyViews = $stmt->fetchAll();

// Popular skills
$stmt = $pdo->query("
    SELECT s.name, s.color, COUNT(wh.id) as total
    FROM watch_history wh
    JOIN videos v ON wh.video_id = v.id
    JOIN skills s ON v.skill_id = s.id
    GROUP BY s.id
    ORDER BY total DESC
    LIMIT 10
");
$popularSkills = $stmt->fetchAll();

// Most watched videos
$stmt = $pdo->query("
    SELECT v.title, v.views, s.name as skill_name
    FROM videos v
    LEFT JOIN skills s ON v.skill_id = s.id
    ORDER BY v.views DESC
    LIMIT 10
");
$mostWatched = $stmt->fetchAll();

// Completion rate
$stmt = $pdo->query("
    SELECT COUNT(*) as total, SUM(completed) as completed_count FROM video_progress
");
$completion = $stmt->fetch();
$completionRate = $completion['total'] > 0 ? round(($completion['completed_count'] / $completion['total']) * 100, 1) : 0;

// Language usage
$stmt = $pdo->query("
    SELECT language, COUNT(*) as total FROM users GROUP BY language
");
$langUsage = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics - Batch15Tube Admin</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/admin.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <div class="admin-wrapper">
        <aside class="admin-sidebar">
            <div class="admin-logo"><i class="fas fa-play-circle" style="color:var(--primary)"></i><span>Batch15Tube</span></div>
            <nav class="admin-nav">
                <a href="<?= SITE_URL ?>/admin/index.php" class="admin-nav-item"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                <a href="<?= SITE_URL ?>/admin/users.php" class="admin-nav-item"><i class="fas fa-users"></i> Users</a>
                <a href="<?= SITE_URL ?>/admin/videos.php" class="admin-nav-item"><i class="fas fa-video"></i> Videos</a>
                <a href="<?= SITE_URL ?>/admin/skills.php" class="admin-nav-item"><i class="fas fa-code"></i> Skills</a>
                <a href="<?= SITE_URL ?>/admin/analytics.php" class="admin-nav-item active"><i class="fas fa-chart-bar"></i> Analytics</a>
                <a href="<?= SITE_URL ?>/admin/settings.php" class="admin-nav-item"><i class="fas fa-cog"></i> Settings</a>
                <hr class="admin-nav-divider">
                <a href="<?= SITE_URL ?>/admin/index.php?logout=1" class="admin-nav-item"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </nav>
        </aside>

        <main class="admin-main">
            <div class="admin-topbar">
                <h1 class="admin-page-title"><i class="fas fa-chart-bar"></i> Analytics</h1>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                <!-- Daily Views -->
                <div class="chart-container">
                    <h3 class="chart-title">Daily Views (Last 30 Days)</h3>
                    <canvas id="dailyViewsChart" width="500" height="250"
                        data-labels='<?= json_encode(array_column($dailyViews, 'date')) ?>'
                        data-values='<?= json_encode(array_column($dailyViews, 'views')) ?>'>
                    </canvas>
                </div>

                <!-- Popular Skills -->
                <div class="chart-container">
                    <h3 class="chart-title">Popular Skills</h3>
                    <canvas id="popularSkillsChart" width="500" height="250"
                        data-labels='<?= json_encode(array_column($popularSkills, 'name')) ?>'
                        data-values='<?= json_encode(array_column($popularSkills, 'total')) ?>'
                        data-colors='<?= json_encode(array_column($popularSkills, 'color')) ?>'>
                    </canvas>
                </div>

                <!-- Most Watched Videos -->
                <div class="chart-container">
                    <h3 class="chart-title">Most Watched Videos</h3>
                    <canvas id="mostWatchedChart" width="500" height="250"
                        data-labels='<?= json_encode(array_column($mostWatched, 'title')) ?>'
                        data-values='<?= json_encode(array_column($mostWatched, 'views')) ?>'>
                    </canvas>
                </div>

                <!-- Completion Rate -->
                <div class="chart-container">
                    <h3 class="chart-title">Course Completion Rate</h3>
                    <div style="text-align:center;padding:40px;">
                        <div style="font-size:64px;font-weight:800;color:var(--primary);"><?= $completionRate ?>%</div>
                        <p style="color:var(--text-secondary);">Overall completion rate</p>
                        <div style="max-width:300px;margin:16px auto;">
                            <div style="height:12px;background:var(--bg-tertiary);border-radius:6px;overflow:hidden;">
                                <div style="height:100%;width:<?= $completionRate ?>%;background:var(--primary);border-radius:6px;"></div>
                            </div>
                        </div>
                        <p style="font-size:13px;color:var(--text-secondary);"><?= $completion['completed_count'] ?> completed out of <?= $completion['total'] ?> total</p>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="<?= SITE_URL ?>/assets/js/admin.js"></script>
    <script>
    function drawBarChart(canvas) {
        var labels, values, colors;
        try { labels = JSON.parse(canvas.getAttribute('data-labels')); } catch(e) { return; }
        try { values = JSON.parse(canvas.getAttribute('data-values')); } catch(e) { return; }
        try { colors = JSON.parse(canvas.getAttribute('data-colors')); } catch(e) { colors = []; }

        var ctx = canvas.getContext('2d');
        var w = canvas.width, h = canvas.height;
        var max = Math.max.apply(null, values) || 1;
        var barW = (w - 80) / labels.length - 8;
        var chartH = h - 60;

        ctx.clearRect(0, 0, w, h);

        values.forEach(function(v, i) {
            var x = 40 + i * (barW + 8);
            var barH = (v / max) * chartH;
            var y = h - 30 - barH;
            var c = colors[i] || '#6C63FF';
            ctx.fillStyle = c;
            ctx.beginPath();
            var r = Math.min(4, barW / 4);
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + barW - r, y);
            ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
            ctx.lineTo(x + barW, y + barH - r);
            ctx.quadraticCurveTo(x + barW, y + barH, x + barW - r, y + barH);
            ctx.lineTo(x + r, y + barH);
            ctx.quadraticCurveTo(x, y + barH, x, y + barH - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#666';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            var label = labels[i];
            if (label.length > 10) label = label.substring(0, 10) + '..';
            ctx.fillText(label, x + barW / 2, h - 10);
        });
    }

    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('canvas[id]').forEach(function(canvas) {
            if (canvas.getAttribute('data-labels')) {
                drawBarChart(canvas);
            }
        });
    });
    </script>
</body>
</html>

<?php
require_once __DIR__ . '/../config/config.php';
$pageTitle = 'Home';
$videos = getVideos(50);
$skills = getSkills();

// Get trending videos (most viewed)
$stmt = $pdo->query("SELECT v.*, s.name as skill_name, s.color as skill_color, s.slug as skill_slug
                      FROM videos v LEFT JOIN skills s ON v.skill_id = s.id
                      WHERE v.is_active = 1
                      ORDER BY v.views DESC LIMIT 8");
$trending = $stmt->fetchAll();

// Dashboard data for logged-in users
$totalHours = 0;
$completedLessons = 0;
$streak = 0;
$totalLessons = 0;
$remainingLessons = 0;
$savedCount = 0;
$certCount = 0;
$xpPoints = 0;
$level = 1;
$currentSkillName = 'N/A';
$continueLearning = [];
$recentHistory = [];

if (isLoggedIn()) {
    // Continue learning
    $stmt = $pdo->prepare("
        SELECT v.*, s.name as skill_name, s.color as skill_color, vp.progress
        FROM video_progress vp
        JOIN videos v ON vp.video_id = v.id
        LEFT JOIN skills s ON v.skill_id = s.id
        WHERE vp.user_id = ? AND vp.completed = 0 AND vp.progress > 0
        ORDER BY vp.last_watched DESC LIMIT 6
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $continueLearning = $stmt->fetchAll();

    // Total watch hours
    $stmt = $pdo->prepare("SELECT COALESCE(SUM(duration_watched), 0) as total FROM watch_history WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $totalHours = $stmt->fetch()['total'];

    // Completed lessons
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM video_progress WHERE user_id = ? AND completed = 1");
    $stmt->execute([$_SESSION['user_id']]);
    $completedLessons = $stmt->fetch()['total'];

    // Total lessons
    $stmt = $pdo->query("SELECT COUNT(*) as total FROM videos WHERE is_active = 1 AND is_hidden = 0");
    $totalLessons = $stmt->fetch()['total'];
    $remainingLessons = max(0, $totalLessons - $completedLessons);

    // Saved videos count
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM saved_videos WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $savedCount = $stmt->fetch()['total'];

    // Certificates count
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM certificates WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $certCount = $stmt->fetch()['total'];

    // User XP and level
    $user = getUser();
    $xpPoints = $user['xp_points'] ?? 0;
    $level = $user['level'] ?? 1;

    // Streak
    $stmt = $pdo->prepare("SELECT streak FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $streak = (int)$stmt->fetchColumn();

    // Current skill
    $stmt = $pdo->prepare("
        SELECT s.name FROM video_progress vp
        JOIN videos v ON vp.video_id = v.id
        JOIN skills s ON v.skill_id = s.id
        WHERE vp.user_id = ? AND vp.completed = 0
        GROUP BY s.id ORDER BY MAX(vp.last_watched) DESC LIMIT 1
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $row = $stmt->fetch();
    $currentSkillName = $row ? $row['name'] : 'N/A';

    // Recent watch history
    $stmt = $pdo->prepare("
        SELECT v.*, wh.watched_at
        FROM watch_history wh
        JOIN videos v ON wh.video_id = v.id
        WHERE wh.user_id = ?
        GROUP BY wh.video_id
        ORDER BY MAX(wh.watched_at) DESC LIMIT 6
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $recentHistory = $stmt->fetchAll();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Batch15Tube - Learn IT & Computer Science</title>
    <meta name="description" content="Batch15Tube - Educational Video Platform for IT & CS Students">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        .hero-section {
            background: linear-gradient(135deg, var(--primary), #FF6584);
            border-radius: var(--radius-lg);
            padding: 48px 40px;
            color: white;
            margin-bottom: 32px;
            position: relative;
            overflow: hidden;
        }
        .hero-section::before {
            content: '';
            position: absolute;
            inset: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="80" font-size="80" opacity="0.05">⚡</text></svg>') repeat;
            background-size: 100px;
        }
        .hero-title { font-size: 36px; font-weight: 800; margin-bottom: 12px; position: relative; }
        .hero-subtitle { font-size: 18px; opacity: 0.9; max-width: 500px; position: relative; }
        .hero-stats { display: flex; gap: 32px; margin-top: 24px; position: relative; }
        .hero-stat-value { font-size: 28px; font-weight: 800; }
        .hero-stat-label { font-size: 14px; opacity: 0.8; }
        .home-layout { display: grid; grid-template-columns: 1fr 300px; gap: 24px; }
        @media (max-width: 992px) { .home-layout { grid-template-columns: 1fr; } }
        @media (max-width: 480px) { .hero-section { padding: 32px 20px; } .hero-title { font-size: 24px; } .hero-stats { gap: 16px; flex-wrap: wrap; } }

        /* Stats Grid */
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 16px;
            margin-bottom: 32px;
        }
        .stat-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius);
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 14px;
            transition: all 0.3s ease;
        }
        .stat-card:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-hover);
        }
        .stat-card-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            flex-shrink: 0;
        }
        .stat-card-value { font-size: 22px; font-weight: 800; line-height: 1.2; }
        .stat-card-label { font-size: 12px; color: var(--text-secondary); }

        /* Continue Learning */
        .continue-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 32px;
        }
        .continue-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius);
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 14px;
            text-decoration: none;
            color: var(--text-primary);
            transition: all 0.3s ease;
        }
        .continue-card:hover {
            transform: translateY(-3px);
            box-shadow: var(--shadow-hover);
        }
        .continue-thumb {
            width: 64px;
            height: 48px;
            border-radius: 8px;
            object-fit: cover;
            background: var(--bg-tertiary);
            flex-shrink: 0;
        }
        .continue-info { flex: 1; min-width: 0; }
        .continue-title { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .continue-progress { margin-top: 6px; height: 4px; background: var(--bg-tertiary); border-radius: 2px; overflow: hidden; }
        .continue-progress-bar { height: 100%; background: var(--primary); border-radius: 2px; transition: width 0.3s; }

        /* Trending */
        .trending-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
        }
        .trending-badge {
            position: absolute;
            top: 8px;
            left: 8px;
            background: rgba(255,101,132,0.9);
            color: white;
            font-size: 11px;
            font-weight: 700;
            padding: 2px 10px;
            border-radius: 4px;
            z-index: 2;
        }

        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 22px;
            font-weight: 700;
        }
        .section-title-icon {
            margin-right: 10px;
            color: var(--primary);
        }
        .see-all {
            font-size: 14px;
            font-weight: 600;
            color: var(--primary);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: gap 0.2s;
        }
        .see-all:hover { gap: 10px; }

        .empty-state {
            text-align: center;
            padding: 48px 20px;
            color: var(--text-secondary);
        }
        .empty-state i { font-size: 48px; margin-bottom: 16px; opacity: 0.4; }
    </style>
</head>
<body>
    <div id="app">
        <!-- Header -->
        <header class="main-header">
            <div class="header-left">
                <button class="sidebar-toggle" id="sidebarToggle" aria-label="Toggle sidebar">
                    <i class="fas fa-bars"></i>
                </button>
                <a href="<?= SITE_URL ?>/public/index.php" class="logo">
                    <i class="fas fa-play-circle logo-icon"></i>
                    <span class="logo-text">Batch15<span class="logo-highlight">Tube</span></span>
                </a>
            </div>
            <div class="header-center">
                <form class="search-bar" action="<?= SITE_URL ?>/public/search.php" method="GET">
                    <input type="text" name="q" placeholder="Search skills, lessons, instructors..." class="search-input" autocomplete="off" id="searchInput">
                    <button type="submit" class="search-btn"><i class="fas fa-search"></i></button>
                </form>
            </div>
            <div class="header-right">
                <button class="icon-btn categories-btn" id="categoriesBtn"><i class="fas fa-th-large"></i></button>
                <?php if (isLoggedIn()): ?>
                <button class="icon-btn notifications-btn" id="notificationsBtn">
                    <i class="fas fa-bell"></i>
                    <?php $unread = getUnreadNotificationCount($_SESSION['user_id']); ?>
                    <?php if ($unread > 0): ?><span class="notification-badge"><?= $unread > 99 ? '99+' : $unread ?></span><?php endif; ?>
                </button>
                <?php endif; ?>
                <button class="icon-btn theme-toggle" id="themeToggle"><i class="fas fa-moon"></i></button>
                <div class="language-switcher">
                    <button class="icon-btn lang-btn" id="langBtn"><i class="fas fa-globe"></i></button>
                    <div class="lang-dropdown" id="langDropdown">
                        <a href="#" class="lang-option" data-lang="so">🇸🇴 Somali</a>
                        <a href="#" class="lang-option" data-lang="en">🇬🇧 English</a>
                        <a href="#" class="lang-option" data-lang="ar">🇸🇦 Arabic</a>
                    </div>
                </div>
                <?php if (isLoggedIn()): ?>
                <div class="user-menu">
                    <button class="user-avatar-btn" id="userMenuBtn">
                        <img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($_SESSION['avatar'] ?? 'default.png') ?>" alt="Avatar" class="avatar-img" onerror="this.src='<?= SITE_URL ?>/uploads/avatars/default.png'">
                        <span class="user-name"><?= htmlspecialchars($_SESSION['first_name']) ?></span>
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="<?= SITE_URL ?>/dashboard/index.php" class="dropdown-item"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                        <a href="<?= SITE_URL ?>/dashboard/history.php" class="dropdown-item"><i class="fas fa-history"></i> History</a>
                        <a href="<?= SITE_URL ?>/dashboard/saved.php" class="dropdown-item"><i class="fas fa-bookmark"></i> Saved Videos</a>
                        <a href="<?= SITE_URL ?>/dashboard/settings.php" class="dropdown-item"><i class="fas fa-cog"></i> Settings</a>
                        <hr class="dropdown-divider">
                        <a href="<?= SITE_URL ?>/auth/logout.php" class="dropdown-item text-danger"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
                <?php else: ?>
                <a href="<?= SITE_URL ?>/auth/login.php" class="btn btn-outline">Login</a>
                <a href="<?= SITE_URL ?>/auth/register.php" class="btn btn-primary">Register</a>
                <?php endif; ?>
            </div>
        </header>

        <!-- Categories Popup -->
        <div class="categories-overlay" id="categoriesOverlay">
            <div class="categories-popup">
                <div class="categories-header">
                    <h3>All Categories</h3>
                    <button class="close-btn" id="closeCategories">&times;</button>
                </div>
                <div class="categories-grid">
                    <?php $allSkills = getSkills(); ?>
                    <?php foreach ($allSkills as $skill): ?>
                    <a href="<?= SITE_URL ?>/public/skill.php?slug=<?= $skill['slug'] ?>" class="category-card" style="--cat-color: <?= $skill['color'] ?>">
                        <i class="fas fa-<?= $skill['icon'] ?? 'code' ?>"></i>
                        <span><?= htmlspecialchars($skill['name']) ?></span>
                    </a>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>

        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <nav class="sidebar-nav">
                <a href="<?= SITE_URL ?>/public/index.php" class="sidebar-item active"><i class="fas fa-home"></i> <span>Home</span></a>
                <a href="<?= SITE_URL ?>/public/explore.php" class="sidebar-item"><i class="fas fa-compass"></i> <span>Explore</span></a>
                <a href="<?= SITE_URL ?>/public/skills.php" class="sidebar-item"><i class="fas fa-code"></i> <span>Skills</span></a>
                <a href="<?= SITE_URL ?>/public/trending.php" class="sidebar-item"><i class="fas fa-fire"></i> <span>Trending</span></a>
                <?php if (isLoggedIn()): ?>
                <hr class="sidebar-divider">
                <a href="<?= SITE_URL ?>/dashboard/index.php" class="sidebar-item"><i class="fas fa-tachometer-alt"></i> <span>Dashboard</span></a>
                <a href="<?= SITE_URL ?>/dashboard/history.php" class="sidebar-item"><i class="fas fa-history"></i> <span>History</span></a>
                <a href="<?= SITE_URL ?>/dashboard/saved.php" class="sidebar-item"><i class="fas fa-bookmark"></i> <span>Saved Videos</span></a>
                <a href="<?= SITE_URL ?>/dashboard/completed.php" class="sidebar-item"><i class="fas fa-check-circle"></i> <span>Completed</span></a>
                <a href="<?= SITE_URL ?>/dashboard/continue-learning.php" class="sidebar-item"><i class="fas fa-play-circle"></i> <span>Continue Learning</span></a>
                <a href="<?= SITE_URL ?>/dashboard/certificates.php" class="sidebar-item"><i class="fas fa-certificate"></i> <span>Certificates</span></a>
                <hr class="sidebar-divider">
                <a href="<?= SITE_URL ?>/dashboard/settings.php" class="sidebar-item"><i class="fas fa-cog"></i> <span>Settings</span></a>
                <?php endif; ?>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content" id="mainContent">
            <!-- Hero Section -->
            <div class="hero-section">
                <h1 class="hero-title">
                    <?php if (isLoggedIn()): ?>
                    Welcome back, <?= htmlspecialchars($_SESSION['first_name']) ?> &#x1F44B;
                    <?php else: ?>
                    Learn IT & Computer Science
                    <?php endif; ?>
                </h1>
                <p class="hero-subtitle">
                    <?php if (isLoggedIn()): ?>
                    Continue your learning journey. Pick up where you left off.
                    <?php else: ?>
                    Free educational videos on programming, cybersecurity, cloud computing, and more.
                    <?php endif; ?>
                </p>
                <div class="hero-stats">
                    <div><div class="hero-stat-value">59</div><div class="hero-stat-label">Skills</div></div>
                    <div><div class="hero-stat-value"><?= number_format(count($videos)) ?></div><div class="hero-stat-label">Lessons</div></div>
                    <div><div class="hero-stat-value">1000+</div><div class="hero-stat-label">Students</div></div>
                </div>
            </div>

            <!-- My Stats (Logged In Only) -->
            <?php if (isLoggedIn()): ?>
            <section style="margin-bottom:32px;">
                <div class="section-header">
                    <h2 class="section-title"><i class="fas fa-chart-bar section-title-icon"></i> My Stats</h2>
                    <a href="<?= SITE_URL ?>/dashboard/index.php" class="see-all">Full Dashboard <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-card-icon" style="background:rgba(108,99,255,0.12);color:var(--primary);"><i class="fas fa-clock"></i></div>
                        <div>
                            <div class="stat-card-value"><?= round($totalHours / 3600, 1) ?>h</div>
                            <div class="stat-card-label">Watch Hours</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="background:rgba(16,185,129,0.12);color:#10b981;"><i class="fas fa-check-circle"></i></div>
                        <div>
                            <div class="stat-card-value"><?= $completedLessons ?></div>
                            <div class="stat-card-label">Completed</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="background:rgba(249,115,22,0.12);color:#f97316;"><i class="fas fa-book-open"></i></div>
                        <div>
                            <div class="stat-card-value"><?= $remainingLessons ?></div>
                            <div class="stat-card-label">Remaining</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="background:rgba(239,68,68,0.12);color:#ef4444;"><i class="fas fa-fire"></i></div>
                        <div>
                            <div class="stat-card-value"><?= $streak ?></div>
                            <div class="stat-card-label">Day Streak</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="background:rgba(245,158,11,0.12);color:#f59e0b;"><i class="fas fa-star"></i></div>
                        <div>
                            <div class="stat-card-value"><?= number_format($xpPoints) ?></div>
                            <div class="stat-card-label">XP Points</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="background:rgba(139,92,246,0.12);color:#8b5cf6;"><i class="fas fa-trophy"></i></div>
                        <div>
                            <div class="stat-card-value">Lv.<?= $level ?></div>
                            <div class="stat-card-label">Level</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="background:rgba(59,130,246,0.12);color:#3b82f6;"><i class="fas fa-graduation-cap"></i></div>
                        <div>
                            <div class="stat-card-value"><?= htmlspecialchars($currentSkillName) ?></div>
                            <div class="stat-card-label">Current Skill</div>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="background:rgba(16,185,129,0.12);color:#10b981;"><i class="fas fa-bookmark"></i></div>
                        <div>
                            <div class="stat-card-value"><?= $savedCount ?></div>
                            <div class="stat-card-label">Saved</div>
                        </div>
                    </div>
                </div>
            </section>
            <?php endif; ?>

            <!-- Continue Learning -->
            <?php if (isLoggedIn() && !empty($continueLearning)): ?>
            <section style="margin-bottom:32px;">
                <div class="section-header">
                    <h2 class="section-title"><i class="fas fa-play-circle section-title-icon"></i> Continue Learning</h2>
                    <a href="<?= SITE_URL ?>/dashboard/continue-learning.php" class="see-all">View All <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="continue-grid">
                    <?php foreach ($continueLearning as $cl): ?>
                    <a href="<?= SITE_URL ?>/public/video.php?id=<?= $cl['id'] ?>" class="continue-card">
                        <img src="<?= htmlspecialchars($cl['thumbnail'] ?? SITE_URL . '/assets/images/placeholder.jpg') ?>" alt="" class="continue-thumb" loading="lazy">
                        <div class="continue-info">
                            <div class="continue-title"><?= htmlspecialchars($cl['title']) ?></div>
                            <?php $pct = min(100, round($cl['progress'] ?? 0)); ?>
                            <div class="continue-progress">
                                <div class="continue-progress-bar" style="width:<?= $pct ?>%"></div>
                            </div>
                            <div style="font-size:11px;color:var(--text-tertiary);margin-top:2px;"><?= $pct ?>% complete</div>
                        </div>
                    </a>
                    <?php endforeach; ?>
                </div>
            </section>
            <?php endif; ?>

            <!-- Recent History (Logged In) -->
            <?php if (isLoggedIn() && !empty($recentHistory)): ?>
            <section style="margin-bottom:32px;">
                <div class="section-header">
                    <h2 class="section-title"><i class="fas fa-history section-title-icon"></i> Recently Watched</h2>
                    <a href="<?= SITE_URL ?>/dashboard/history.php" class="see-all">View All <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="video-grid">
                    <?php foreach ($recentHistory as $video): ?>
                    <div class="video-card" data-url="<?= SITE_URL ?>/public/video.php?id=<?= $video['id'] ?>">
                        <div class="video-thumbnail">
                            <img src="<?= htmlspecialchars($video['thumbnail'] ?? SITE_URL . '/assets/images/placeholder.jpg') ?>" alt="<?= htmlspecialchars($video['title']) ?>" loading="lazy">
                            <span class="video-duration"><?= htmlspecialchars($video['duration'] ?? '0:00') ?></span>
                        </div>
                        <div class="video-info">
                            <h3 class="video-title"><?= htmlspecialchars($video['title']) ?></h3>
                            <div class="video-meta">
                                <span><?= htmlspecialchars($video['instructor'] ?? 'Batch15Tube') ?></span>
                                <span>&middot;</span>
                                <span><?= timeAgo($video['watched_at']) ?></span>
                            </div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </section>
            <?php endif; ?>

            <!-- Skills Section -->
            <section style="margin-bottom:32px;">
                <div class="section-header">
                    <h2 class="section-title"><i class="fas fa-code section-title-icon"></i> Popular Skills</h2>
                    <a href="<?= SITE_URL ?>/public/skills.php" class="see-all">See All <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="skills-carousel">
                    <?php foreach ($skills as $skill): ?>
                    <a href="<?= SITE_URL ?>/public/skill.php?slug=<?= $skill['slug'] ?>" class="skill-card" style="background: <?= $skill['color'] ?>">
                        <div class="skill-card-icon"><i class="fas fa-<?= $skill['icon'] ?? 'code' ?>"></i></div>
                        <div class="skill-card-name"><?= htmlspecialchars($skill['name']) ?></div>
                    </a>
                    <?php endforeach; ?>
                </div>
            </section>

            <!-- Trending Videos -->
            <?php if (!empty($trending)): ?>
            <section style="margin-bottom:32px;">
                <div class="section-header">
                    <h2 class="section-title"><i class="fas fa-fire section-title-icon" style="color:#FF6584;"></i> Trending Now</h2>
                    <a href="<?= SITE_URL ?>/public/trending.php" class="see-all">View All <i class="fas fa-arrow-right"></i></a>
                </div>
                <div class="trending-grid">
                    <?php foreach ($trending as $i => $video): ?>
                    <div class="video-card" data-url="<?= SITE_URL ?>/public/video.php?id=<?= $video['id'] ?>">
                        <div class="video-thumbnail">
                            <img src="<?= htmlspecialchars($video['thumbnail'] ?? SITE_URL . '/assets/images/placeholder.jpg') ?>" alt="<?= htmlspecialchars($video['title']) ?>" loading="lazy">
                            <span class="video-duration"><?= htmlspecialchars($video['duration'] ?? '0:00') ?></span>
                            <?php if ($i < 3): ?><span class="trending-badge">#<?= $i + 1 ?></span><?php endif; ?>
                        </div>
                        <div class="video-info">
                            <h3 class="video-title"><?= htmlspecialchars($video['title']) ?></h3>
                            <div class="video-meta">
                                <span><?= htmlspecialchars($video['instructor'] ?? 'Batch15Tube') ?></span>
                                <span>&middot;</span>
                                <span><?= number_format($video['views'] ?? 0) ?> views</span>
                            </div>
                            <?php if (!empty($video['skill_name'])): ?>
                            <span class="video-skill-tag" style="background:<?= htmlspecialchars($video['skill_color']) ?>">
                                <?= htmlspecialchars($video['skill_name']) ?>
                            </span>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
            </section>
            <?php endif; ?>

            <!-- All Videos -->
            <section>
                <div class="section-header">
                    <h2 class="section-title"><i class="fas fa-list section-title-icon"></i> Recommended Videos</h2>
                </div>
                <div class="video-grid" id="video-grid">
                    <?php foreach ($videos as $video): ?>
                    <div class="video-card" data-url="<?= SITE_URL ?>/public/video.php?id=<?= $video['id'] ?>">
                        <div class="video-thumbnail">
                            <img src="<?= htmlspecialchars($video['thumbnail'] ?? SITE_URL . '/assets/images/placeholder.jpg') ?>" alt="<?= htmlspecialchars($video['title']) ?>" loading="lazy">
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
                            <span class="video-skill-tag" style="background:<?= htmlspecialchars($video['skill_color']) ?>">
                                <?= htmlspecialchars($video['skill_name']) ?>
                            </span>
                            <?php endif; ?>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <div id="scroll-sentinel" class="loading-spinner">
                    <div class="spinner"></div>
                </div>
            </section>
        </main>
    </div>

    <!-- Language Selection Popup -->
    <div class="lang-popup-overlay" id="langPopupOverlay">
        <div class="lang-popup">
            <div class="lang-popup-icon"><i class="fas fa-language"></i></div>
            <h2>Choose Language</h2>
            <p>Select your preferred language for this lesson</p>
            <div class="lang-choices">
                <button class="lang-choice" data-lang="so"><span class="lang-flag">🇸🇴</span><span class="lang-name">Somali</span></button>
                <button class="lang-choice" data-lang="en"><span class="lang-flag">🇬🇧</span><span class="lang-name">English</span></button>
                <button class="lang-choice" data-lang="ar"><span class="lang-flag">🇸🇦</span><span class="lang-name">Arabic</span></button>
            </div>
        </div>
    </div>

    <!-- Guest Restriction -->
    <div class="restriction-overlay" id="restrictionOverlay">
        <div class="restriction-popup">
            <div class="restriction-icon"><i class="fas fa-lock"></i></div>
            <h2>Create Free Account to Continue Learning</h2>
            <p>You have reached your free viewing limit.</p>
            <p>Register now to unlock unlimited lessons.</p>
            <a href="<?= SITE_URL ?>/auth/register.php" class="btn btn-primary btn-lg">Register Now</a>
            <a href="<?= SITE_URL ?>/auth/login.php" class="btn btn-outline">Already have an account? Login</a>
        </div>
    </div>

    <script src="<?= SITE_URL ?>/assets/js/main.js"></script>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Sidebar
        document.getElementById('sidebarToggle').addEventListener('click', function() {
            var sidebar = document.getElementById('sidebar');
            var mainContent = document.getElementById('mainContent');
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('open');
                var overlay = document.querySelector('.sidebar-overlay');
                if (!overlay) {
                    overlay = document.createElement('div');
                    overlay.className = 'sidebar-overlay';
                    overlay.addEventListener('click', function() { sidebar.classList.remove('open'); overlay.classList.remove('show'); });
                    document.body.appendChild(overlay);
                }
                overlay.classList.toggle('show');
            } else {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
            }
        });

        // Theme
        var themeToggle = document.getElementById('themeToggle');
        var html = document.documentElement;
        themeToggle.addEventListener('click', function() {
            var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            themeToggle.querySelector('i').className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            fetch('<?= SITE_URL ?>/api/theme.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'theme=' + next });
        });

        // Language
        document.getElementById('langBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('langDropdown').classList.toggle('show');
        });
        document.addEventListener('click', function() { document.getElementById('langDropdown').classList.remove('show'); });
        document.querySelectorAll('.lang-option').forEach(function(el) {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                var lang = this.getAttribute('data-lang');
                fetch('<?= SITE_URL ?>/api/language.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'language=' + lang })
                    .then(function() { location.reload(); });
            });
        });

        // User Menu
        var userBtn = document.getElementById('userMenuBtn');
        var userDropdown = document.getElementById('userDropdown');
        if (userBtn && userDropdown) {
            userBtn.addEventListener('click', function(e) { e.stopPropagation(); userDropdown.classList.toggle('show'); });
            document.addEventListener('click', function() { userDropdown.classList.remove('show'); });
        }

        // Categories
        document.getElementById('categoriesBtn').addEventListener('click', function() {
            document.getElementById('categoriesOverlay').classList.add('show');
        });
        document.getElementById('closeCategories').addEventListener('click', function() {
            document.getElementById('categoriesOverlay').classList.remove('show');
        });
        document.getElementById('categoriesOverlay').addEventListener('click', function(e) {
            if (e.target === this) this.classList.remove('show');
        });

        // Video click -> language popup
        document.querySelectorAll('.video-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var url = this.getAttribute('data-url');
                var popup = document.getElementById('langPopupOverlay');
                if (popup) {
                    popup.classList.add('show');
                    popup.setAttribute('data-redirect', url);
                }
            });
        });

        // Language choice
        document.querySelectorAll('.lang-choice').forEach(function(el) {
            el.addEventListener('click', function() {
                var lang = this.getAttribute('data-lang');
                var popup = document.getElementById('langPopupOverlay');
                var redirect = popup ? popup.getAttribute('data-redirect') : '';
                fetch('<?= SITE_URL ?>/api/language.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'language=' + lang })
                    .then(function() { if (redirect) window.location.href = redirect; if (popup) popup.classList.remove('show'); });
            });
        });

        // Infinite scroll
        var sentinel = document.getElementById('scroll-sentinel');
        var grid = document.getElementById('video-grid');
        var page = 1;
        if (sentinel && grid && 'IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting) {
                    page++;
                    fetch('<?= SITE_URL ?>/api/videos.php?page=' + page)
                        .then(function(r) { return r.json(); })
                        .then(function(data) {
                            if (data.videos && data.videos.length > 0) {
                                data.videos.forEach(function(v) {
                                    grid.insertAdjacentHTML('beforeend',
                                        '<div class="video-card" data-url="<?= SITE_URL ?>/public/video.php?id=' + v.id + '">' +
                                        '<div class="video-thumbnail"><img src="' + (v.thumbnail || '<?= SITE_URL ?>/assets/images/placeholder.jpg') + '" alt="" loading="lazy"><span class="video-duration">' + (v.duration || '0:00') + '</span></div>' +
                                        '<div class="video-info"><h3 class="video-title">' + v.title.replace(/</g,'&lt;') + '</h3>' +
                                        '<div class="video-meta"><span>' + (v.instructor || 'Batch15Tube') + '</span><span>&middot;</span><span>' + (v.views || 0) + ' views</span></div>' +
                                        (v.skill_name ? '<span class="video-skill-tag" style="background:' + v.skill_color + '">' + v.skill_name.replace(/</g,'&lt;') + '</span>' : '') +
                                        '</div></div>'
                                    );
                                });
                                document.querySelectorAll('.video-card:not([data-bound])').forEach(function(card) {
                                    card.addEventListener('click', function() {
                                        var url = this.getAttribute('data-url');
                                        var popup = document.getElementById('langPopupOverlay');
                                        if (popup) { popup.classList.add('show'); popup.setAttribute('data-redirect', url); }
                                    });
                                    card.setAttribute('data-bound', '1');
                                });
                            } else {
                                sentinel.style.display = 'none';
                            }
                        });
                }
            });
            observer.observe(sentinel);
        }
    });
    </script>
</body>
</html>

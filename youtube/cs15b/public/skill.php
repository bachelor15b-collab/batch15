<?php
require_once __DIR__ . '/../config/config.php';

$slug = sanitize($_GET['slug'] ?? '');
$stmt = $pdo->prepare("SELECT * FROM skills WHERE slug = ? AND is_active = 1");
$stmt->execute([$slug]);
$skill = $stmt->fetch();

if (!$skill) {
    redirect(SITE_URL . '/public/index.php');
}

$pageTitle = $skill['name'];

// Get sub skills
$stmt = $pdo->prepare("SELECT * FROM sub_skills WHERE skill_id = ? AND is_active = 1 ORDER BY sort_order ASC");
$stmt->execute([$skill['id']]);
$subSkills = $stmt->fetchAll();

// Get videos
$stmt = $pdo->prepare(
    "SELECT * FROM videos WHERE skill_id = ? AND is_active = 1 AND is_hidden = 0 ORDER BY sort_order ASC, created_at DESC"
);
$stmt->execute([$skill['id']]);
$videos = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($skill['name']) ?> - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <div id="app">
        <header class="main-header">
            <div class="header-left">
                <button class="sidebar-toggle" id="sidebarToggle"><i class="fas fa-bars"></i></button>
                <a href="<?= SITE_URL ?>/public/index.php" class="logo"><i class="fas fa-play-circle logo-icon"></i><span class="logo-text">Batch15<span class="logo-highlight">Tube</span></span></a>
            </div>
            <div class="header-center">
                <form class="search-bar" action="<?= SITE_URL ?>/public/search.php" method="GET">
                    <input type="text" name="q" placeholder="Search..." class="search-input">
                    <button type="submit" class="search-btn"><i class="fas fa-search"></i></button>
                </form>
            </div>
            <div class="header-right">
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
                        <img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($_SESSION['avatar'] ?? 'default.png') ?>" class="avatar-img">
                        <span class="user-name"><?= htmlspecialchars($_SESSION['first_name']) ?></span>
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="<?= SITE_URL ?>/dashboard/index.php" class="dropdown-item"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                        <a href="<?= SITE_URL ?>/auth/logout.php" class="dropdown-item text-danger"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
                <?php else: ?>
                <a href="<?= SITE_URL ?>/auth/login.php" class="btn btn-outline">Login</a>
                <a href="<?= SITE_URL ?>/auth/register.php" class="btn btn-primary">Register</a>
                <?php endif; ?>
            </div>
        </header>

        <main class="main-content" id="mainContent" style="margin-left:0;max-width:1200px;margin-right:auto;">
            <!-- Skill Hero -->
            <div class="skill-hero" style="background: <?= $skill['color'] ?>">
                <div class="skill-hero-content">
                    <h1><?= htmlspecialchars($skill['name']) ?></h1>
                    <p><?= htmlspecialchars($skill['description'] ?? 'Learn ' . $skill['name'] . ' with Batch15Tube') ?></p>
                </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 360px;gap:24px;">
                <div>
                    <!-- Roadmap -->
                    <?php if (!empty($subSkills)): ?>
                    <h2 class="section-title" style="margin-bottom:16px;">Learning Roadmap</h2>
                    <div class="roadmap-list">
                        <?php foreach ($subSkills as $i => $sub): ?>
                        <div class="roadmap-item">
                            <div class="roadmap-number"><?= $i + 1 ?></div>
                            <div class="roadmap-name"><?= htmlspecialchars($sub['name']) ?></div>
                            <i class="fas fa-chevron-right" style="margin-left:auto;color:var(--text-tertiary)"></i>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>

                    <!-- Videos -->
                    <h2 class="section-title" style="margin:24px 0 16px;">Lessons</h2>
                    <?php if (empty($videos)): ?>
                    <p style="color:var(--text-secondary);padding:32px;text-align:center;">No lessons available yet. Check back soon!</p>
                    <?php else: ?>
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
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                    <?php endif; ?>
                </div>

                <!-- Sidebar -->
                <div>
                    <div style="background:var(--bg-card);border-radius:var(--radius);border:1px solid var(--border-color);padding:20px;position:sticky;top:80px;">
                        <h3 style="font-size:16px;margin-bottom:16px;">About this Skill</h3>
                        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;">
                            <p><strong>Skill:</strong> <?= htmlspecialchars($skill['name']) ?></p>
                            <p><strong>Lessons:</strong> <?= count($videos) ?></p>
                            <p><strong>Topics:</strong> <?= count($subSkills) ?></p>
                        </div>
                        <?php if (isLoggedIn()): ?>
                        <a href="<?= SITE_URL ?>/public/video.php?id=<?= $videos[0]['id'] ?? 0 ?>" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;margin-top:16px;">
                            <i class="fas fa-play"></i> Start Learning
                        </a>
                        <?php else: ?>
                        <a href="<?= SITE_URL ?>/auth/register.php" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;margin-top:16px;">
                            <i class="fas fa-user-plus"></i> Register to Learn
                        </a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </main>
    </div>

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

    <script src="<?= SITE_URL ?>/assets/js/main.js"></script>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('themeToggle').addEventListener('click', function() {
            var html = document.documentElement;
            var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            this.querySelector('i').className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            fetch('<?= SITE_URL ?>/api/theme.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'theme=' + next });
        });

        document.getElementById('langBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('langDropdown').classList.toggle('show');
        });
        document.addEventListener('click', function() { document.getElementById('langDropdown').classList.remove('show'); });
        document.querySelectorAll('.lang-option').forEach(function(el) {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                fetch('<?= SITE_URL ?>/api/language.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'language=' + this.getAttribute('data-lang') })
                    .then(function() { location.reload(); });
            });
        });

        var userBtn = document.getElementById('userMenuBtn');
        var userDropdown = document.getElementById('userDropdown');
        if (userBtn && userDropdown) {
            userBtn.addEventListener('click', function(e) { e.stopPropagation(); userDropdown.classList.toggle('show'); });
            document.addEventListener('click', function() { userDropdown.classList.remove('show'); });
        }

        document.querySelectorAll('.video-card').forEach(function(card) {
            card.addEventListener('click', function() {
                var url = this.getAttribute('data-url');
                var popup = document.getElementById('langPopupOverlay');
                if (popup) { popup.classList.add('show'); popup.setAttribute('data-redirect', url); }
            });
        });

        document.querySelectorAll('.lang-choice').forEach(function(el) {
            el.addEventListener('click', function() {
                var lang = this.getAttribute('data-lang');
                var popup = document.getElementById('langPopupOverlay');
                var redirect = popup ? popup.getAttribute('data-redirect') : '';
                fetch('<?= SITE_URL ?>/api/language.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'language=' + lang })
                    .then(function() { if (redirect) window.location.href = redirect; if (popup) popup.classList.remove('show'); });
            });
        });
    });
    </script>
</body>
</html>

<!DOCTYPE html>
<html lang="<?= $_SESSION['language'] ?? 'en' ?>"
      data-theme="<?= $_SESSION['theme'] ?? 'light' ?>"
      dir="<?= ($_SESSION['language'] ?? 'en') === 'ar' ? 'rtl' : 'ltr' ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($pageTitle) ? $pageTitle . ' - ' : '' ?><?= SITE_NAME ?></title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <?php if (isset($pageStyle)): ?>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/<?= $pageStyle ?>">
    <?php endif; ?>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <div id="app">
        <!-- Top Header -->
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
                    <button type="submit" class="search-btn" aria-label="Search">
                        <i class="fas fa-search"></i>
                    </button>
                </form>
            </div>

            <div class="header-right">
                <button class="icon-btn categories-btn" id="categoriesBtn" aria-label="Categories">
                    <i class="fas fa-th-large"></i>
                </button>

                <?php if (isLoggedIn()): ?>
                    <button class="icon-btn notifications-btn" id="notificationsBtn" aria-label="Notifications">
                        <i class="fas fa-bell"></i>
                        <?php $unread = getUnreadNotificationCount($_SESSION['user_id']); ?>
                        <?php if ($unread > 0): ?>
                        <span class="notification-badge"><?= $unread > 99 ? '99+' : $unread ?></span>
                        <?php endif; ?>
                    </button>
                <?php endif; ?>

                <button class="icon-btn theme-toggle" id="themeToggle" aria-label="Toggle theme">
                    <i class="fas fa-moon"></i>
                </button>

                <div class="language-switcher">
                    <button class="icon-btn lang-btn" id="langBtn" aria-label="Language">
                        <i class="fas fa-globe"></i>
                    </button>
                    <div class="lang-dropdown" id="langDropdown">
                        <a href="#" class="lang-option" data-lang="so">🇸🇴 Somali</a>
                        <a href="#" class="lang-option" data-lang="en">🇬🇧 English</a>
                        <a href="#" class="lang-option" data-lang="ar">🇸🇦 Arabic</a>
                    </div>
                </div>

                <?php if (isLoggedIn()): ?>
                    <div class="user-menu">
                        <button class="user-avatar-btn" id="userMenuBtn">
                            <img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($_SESSION['avatar'] ?? 'default.png') ?>"
                                 alt="Avatar" class="avatar-img">
                            <span class="user-name"><?= htmlspecialchars($_SESSION['first_name']) ?></span>
                        </button>
                        <div class="user-dropdown" id="userDropdown">
                            <a href="<?= SITE_URL ?>/dashboard/index.php" class="dropdown-item">
                                <i class="fas fa-tachometer-alt"></i> Dashboard
                            </a>
                            <a href="<?= SITE_URL ?>/public/profile.php" class="dropdown-item">
                                <i class="fas fa-user"></i> Profile
                            </a>
                            <a href="<?= SITE_URL ?>/dashboard/my-learning.php" class="dropdown-item">
                                <i class="fas fa-graduation-cap"></i> My Learning
                            </a>
                            <a href="<?= SITE_URL ?>/dashboard/saved.php" class="dropdown-item">
                                <i class="fas fa-bookmark"></i> Saved Videos
                            </a>
                            <a href="<?= SITE_URL ?>/dashboard/settings.php" class="dropdown-item">
                                <i class="fas fa-cog"></i> Settings
                            </a>
                            <hr class="dropdown-divider">
                            <a href="<?= SITE_URL ?>/auth/logout.php" class="dropdown-item text-danger">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </a>
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
                    <a href="<?= SITE_URL ?>/public/skill.php?slug=<?= $skill['slug'] ?>" class="category-card"
                       style="--cat-color: <?= $skill['color'] ?>">
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
                <a href="<?= SITE_URL ?>/public/index.php" class="sidebar-item active">
                    <i class="fas fa-home"></i> <span>Home</span>
                </a>
                <a href="<?= SITE_URL ?>/public/explore.php" class="sidebar-item">
                    <i class="fas fa-compass"></i> <span>Explore</span>
                </a>
                <a href="<?= SITE_URL ?>/public/skills.php" class="sidebar-item">
                    <i class="fas fa-code"></i> <span>Skills</span>
                </a>
                <a href="<?= SITE_URL ?>/public/trending.php" class="sidebar-item">
                    <i class="fas fa-fire"></i> <span>Trending</span>
                </a>
                <?php if (isLoggedIn()): ?>
                <hr class="sidebar-divider">
                <a href="<?= SITE_URL ?>/dashboard/index.php" class="sidebar-item">
                    <i class="fas fa-graduation-cap"></i> <span>My Learning</span>
                </a>
                <a href="<?= SITE_URL ?>/dashboard/history.php" class="sidebar-item">
                    <i class="fas fa-history"></i> <span>History</span>
                </a>
                <a href="<?= SITE_URL ?>/dashboard/saved.php" class="sidebar-item">
                    <i class="fas fa-bookmark"></i> <span>Saved Videos</span>
                </a>
                <a href="<?= SITE_URL ?>/dashboard/completed.php" class="sidebar-item">
                    <i class="fas fa-check-circle"></i> <span>Completed</span>
                </a>
                <a href="<?= SITE_URL ?>/dashboard/continue-learning.php" class="sidebar-item">
                    <i class="fas fa-play-circle"></i> <span>Continue Learning</span>
                </a>
                <a href="<?= SITE_URL ?>/dashboard/certificates.php" class="sidebar-item">
                    <i class="fas fa-certificate"></i> <span>Certificates</span>
                </a>
                <hr class="sidebar-divider">
                <a href="<?= SITE_URL ?>/dashboard/settings.php" class="sidebar-item">
                    <i class="fas fa-cog"></i> <span>Settings</span>
                </a>
                <?php endif; ?>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content" id="mainContent">

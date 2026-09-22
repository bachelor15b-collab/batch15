<?php
require_once __DIR__ . '/../config/config.php';

// Admin auth check
if (!isset($_SESSION['admin_id'])) {
    // Simple admin login
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $username = sanitize($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM admins WHERE username = ? AND is_active = 1");
        $stmt->execute([$username]);
        $admin = $stmt->fetch();
        if ($admin && password_verify($password, $admin['password'])) {
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_name'] = $admin['full_name'];
            $_SESSION['admin_role'] = $admin['role'];
            $stmt = $pdo->prepare("UPDATE admins SET last_login = NOW(), ip_address = ? WHERE id = ?");
            $stmt->execute([$_SERVER['REMOTE_ADDR'] ?? '0.0.0.0', $admin['id']]);
            redirect(SITE_URL . '/admin/index.php');
        } else {
            $error = 'Invalid credentials';
        }
    }
    ?>
    <!DOCTYPE html>
    <html lang="en" data-theme="light">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Login - Batch15Tube</title>
        <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    </head>
    <body>
        <div class="auth-page">
            <div class="auth-container">
                <div class="auth-header">
                    <div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#6C63FF,#FF6584);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:32px;color:#fff;">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <h2 class="auth-logo">Admin Panel</h2>
                    <p class="auth-subtitle">Batch15Tube Administration</p>
                </div>
                <?php if (isset($error)): ?>
                <div class="toast toast-error" style="margin-bottom:20px;animation:none;display:flex;"><?= htmlspecialchars($error) ?></div>
                <?php endif; ?>
                <form method="POST">
                    <div class="form-group"><label class="form-label">Username</label><input type="text" name="username" class="form-input" required></div>
                    <div class="form-group"><label class="form-label">Password</label><input type="password" name="password" class="form-input" required></div>
                    <button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;"><i class="fas fa-sign-in-alt"></i> Login</button>
                </form>
                <div style="text-align:center;margin-top:20px;padding-top:20px;border-top:1px solid var(--border-color);">
                    <div style="display:flex;align-items:center;justify-content:center;gap:10px;font-size:13px;color:var(--text-secondary);">
                        <img src="<?= SITE_URL ?>/uploads/avatars/default.png" style="width:28px;height:28px;border-radius:50%;object-fit:cover;border:1px solid var(--border-color);">
                        <span><strong style="color:var(--primary);">admin</strong> / <strong style="color:var(--secondary);">admin123</strong></span>
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

$pageTitle = 'Admin Dashboard';

// Stats
$stmt = $pdo->query("SELECT COUNT(*) as total FROM users");
$totalUsers = $stmt->fetch()['total'];
$stmt = $pdo->query("SELECT COUNT(*) as total FROM users WHERE is_active = 1");
$activeUsers = $stmt->fetch()['total'];
$stmt = $pdo->query("SELECT COUNT(*) as total FROM videos WHERE is_active = 1");
$totalVideos = $stmt->fetch()['total'];
$stmt = $pdo->query("SELECT COUNT(*) as total FROM skills WHERE is_active = 1");
$totalSkills = $stmt->fetch()['total'];
$stmt = $pdo->query("SELECT COALESCE(SUM(views), 0) as total FROM videos");
$totalViews = $stmt->fetch()['total'];
$stmt = $pdo->query("SELECT COALESCE(SUM(duration_watched), 0) as total FROM watch_history");
$totalHours = round($stmt->fetch()['total'] / 3600, 1);
$stmt = $pdo->query("SELECT COUNT(*) as total FROM users WHERE DATE(created_at) = CURDATE()");
$todayRegistrations = $stmt->fetch()['total'];
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/admin.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <div class="admin-wrapper">
        <!-- Sidebar -->
        <aside class="admin-sidebar" id="adminSidebar">
            <div class="admin-logo">
                <i class="fas fa-play-circle" style="color:var(--primary)"></i>
                <span>Batch15Tube</span>
            </div>
            <nav class="admin-nav">
                <a href="<?= SITE_URL ?>/admin/index.php" class="admin-nav-item active"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                <a href="<?= SITE_URL ?>/admin/users.php" class="admin-nav-item"><i class="fas fa-users"></i> Users</a>
                <a href="<?= SITE_URL ?>/admin/videos.php" class="admin-nav-item"><i class="fas fa-video"></i> Videos</a>
                <a href="<?= SITE_URL ?>/admin/skills.php" class="admin-nav-item"><i class="fas fa-code"></i> Skills</a>
                <a href="<?= SITE_URL ?>/admin/categories.php" class="admin-nav-item"><i class="fas fa-th"></i> Categories</a>
                <a href="<?= SITE_URL ?>/admin/languages.php" class="admin-nav-item"><i class="fas fa-globe"></i> Languages</a>
                <a href="<?= SITE_URL ?>/admin/comments.php" class="admin-nav-item"><i class="fas fa-comments"></i> Comments</a>
                <a href="<?= SITE_URL ?>/admin/reports.php" class="admin-nav-item"><i class="fas fa-flag"></i> Reports</a>
                <a href="<?= SITE_URL ?>/admin/analytics.php" class="admin-nav-item"><i class="fas fa-chart-bar"></i> Analytics</a>
                <a href="<?= SITE_URL ?>/admin/certificates.php" class="admin-nav-item"><i class="fas fa-certificate"></i> Certificates</a>
                <a href="<?= SITE_URL ?>/admin/settings.php" class="admin-nav-item"><i class="fas fa-cog"></i> Settings</a>
                <hr class="admin-nav-divider">
                <a href="http://localhost/phpmyadmin" target="_blank" class="admin-nav-item"><i class="fas fa-database"></i> phpMyAdmin</a>
                <a href="<?= SITE_URL ?>/public/index.php" class="admin-nav-item"><i class="fas fa-arrow-left"></i> Back to Site</a>
                <a href="?logout=1" class="admin-nav-item"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </nav>
        </aside>

        <!-- Main -->
        <main class="admin-main">
            <div class="admin-topbar">
                <h1 class="admin-page-title">Dashboard</h1>
                <div class="admin-top-actions">
                    <a href="http://localhost/phpmyadmin" target="_blank" class="btn btn-outline" style="padding:8px 16px;font-size:13px;"><i class="fas fa-database"></i> phpMyAdmin</a>
                    <div style="display:flex;align-items:center;gap:8px;">
                        <?php
                        $stmt = $pdo->query("SELECT avatar FROM admins WHERE id = " . intval($_SESSION['admin_id']));
                        $adminRow = $stmt->fetch();
                        $adminAvatar = SITE_URL . '/uploads/avatars/default.png';
                        if ($adminRow && !empty($adminRow['avatar'])) {
                            $adminAvatar = SITE_URL . '/uploads/avatars/' . htmlspecialchars($adminRow['avatar']);
                        }
                        ?>
                        <img src="<?= $adminAvatar ?>" style="width:32px;height:32px;border-radius:50%;object-fit:cover;border:2px solid var(--primary);">
                        <span style="font-size:14px;color:var(--text-secondary);">
                            <?= htmlspecialchars($_SESSION['admin_name']) ?>
                        </span>
                    </div>
                    <a href="?logout=1" class="btn btn-outline" style="padding:8px 16px;font-size:13px;">Logout</a>
                </div>
            </div>

            <!-- Stats -->
            <div class="admin-stats-grid">
                <div class="admin-stat-card">
                    <div class="admin-stat-icon blue"><i class="fas fa-users"></i></div>
                    <div>
                        <div class="admin-stat-value"><?= $totalUsers ?></div>
                        <div class="admin-stat-label">Total Users</div>
                    </div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-icon green"><i class="fas fa-user-check"></i></div>
                    <div>
                        <div class="admin-stat-value"><?= $activeUsers ?></div>
                        <div class="admin-stat-label">Active Users</div>
                    </div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-icon purple"><i class="fas fa-video"></i></div>
                    <div>
                        <div class="admin-stat-value"><?= $totalVideos ?></div>
                        <div class="admin-stat-label">Total Videos</div>
                    </div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-icon orange"><i class="fas fa-code"></i></div>
                    <div>
                        <div class="admin-stat-value"><?= $totalSkills ?></div>
                        <div class="admin-stat-label">Total Skills</div>
                    </div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-icon teal"><i class="fas fa-eye"></i></div>
                    <div>
                        <div class="admin-stat-value"><?= number_format($totalViews) ?></div>
                        <div class="admin-stat-label">Views Today</div>
                    </div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-icon pink"><i class="fas fa-clock"></i></div>
                    <div>
                        <div class="admin-stat-value"><?= $totalHours ?>h</div>
                        <div class="admin-stat-label">Total Watch Hours</div>
                    </div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-icon yellow"><i class="fas fa-user-plus"></i></div>
                    <div>
                        <div class="admin-stat-value"><?= $todayRegistrations ?></div>
                        <div class="admin-stat-label">Registrations Today</div>
                    </div>
                </div>
                <div class="admin-stat-card">
                    <div class="admin-stat-icon red"><i class="fas fa-users"></i></div>
                    <div>
                        <div class="admin-stat-value">0</div>
                        <div class="admin-stat-label">Online Now</div>
                    </div>
                </div>
            </div>

            <!-- Recent Users -->
            <div class="admin-table-container">
                <div class="table-header">
                    <h3>Recent Users</h3>
                    <a href="<?= SITE_URL ?>/admin/users.php" class="btn btn-outline" style="padding:8px 16px;font-size:13px;">View All</a>
                </div>
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Joined</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php $stmt = $pdo->query("SELECT * FROM users ORDER BY created_at DESC LIMIT 10"); ?>
                        <?php while ($u = $stmt->fetch()): ?>
                        <tr>
                            <td><?= htmlspecialchars($u['first_name'] . ' ' . $u['last_name']) ?></td>
                            <td><?= htmlspecialchars($u['email']) ?></td>
                            <td><?= date('M d, Y', strtotime($u['created_at'])) ?></td>
                            <td><span class="status-badge <?= $u['is_active'] ? 'active' : 'inactive' ?>"><?= $u['is_active'] ? 'Active' : 'Inactive' ?></span></td>
                        </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>

            <!-- Live Activity -->
            <div class="live-activity">
                <div class="live-activity-header">
                    <h3><span class="live-dot"></span> Live Activity</h3>
                </div>
                <div id="liveActivity">
                    <?php
                    $stmt = $pdo->query("
                        SELECT al.*, u.username, u.avatar
                        FROM activity_logs al
                        LEFT JOIN users u ON al.user_id = u.id
                        ORDER BY al.created_at DESC LIMIT 10
                    ");
                    while ($a = $stmt->fetch()):
                    ?>
                    <div class="live-item">
                        <img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($a['avatar'] ?? 'default.png') ?>" class="live-user-avatar" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" onerror="this.src='<?= SITE_URL ?>/uploads/avatars/default.png'">
                        <div class="live-info">
                            <div class="live-username"><?= htmlspecialchars($a['username'] ?? 'Guest') ?></div>
                            <div class="live-watching"><?= htmlspecialchars($a['action']) ?></div>
                        </div>
                        <div class="live-stats">
                            <span><?= timeAgo($a['created_at']) ?></span>
                        </div>
                    </div>
                    <?php endwhile; ?>
                </div>
            </div>
        </main>
    </div>

    <?php if (isset($_GET['logout'])): ?>
    <?php
    $_SESSION = [];
    session_destroy();
    redirect(SITE_URL . '/admin/index.php');
    ?>
    <?php endif; ?>

    <script src="<?= SITE_URL ?>/assets/js/admin.js"></script>
</body>
</html>

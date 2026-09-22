<?php
require_once __DIR__ . '/../config/config.php';
if (!isset($_SESSION['admin_id'])) redirect(SITE_URL . '/admin/index.php');
$pageTitle = 'Manage Users';

// Actions
if (isset($_GET['action']) && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $action = $_GET['action'];
    if ($action === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
    } elseif ($action === 'suspend') {
        $stmt = $pdo->prepare("UPDATE users SET is_suspended = 1 WHERE id = ?");
        $stmt->execute([$id]);
    } elseif ($action === 'activate') {
        $stmt = $pdo->prepare("UPDATE users SET is_suspended = 0 WHERE id = ?");
        $stmt->execute([$id]);
    }
    redirect(SITE_URL . '/admin/users.php');
}

$search = sanitize($_GET['search'] ?? '');
$filter = sanitize($_GET['filter'] ?? '');
$page = intval($_GET['p'] ?? 1);
$limit = 20;
$offset = ($page - 1) * $limit;

$where = "WHERE 1=1";
$params = [];
if ($search) {
    $where .= " AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR username LIKE ?)";
    $s = "%$search%";
    $params = [$s, $s, $s, $s];
}
if ($filter === 'active') { $where .= " AND is_active = 1"; }
if ($filter === 'suspended') { $where .= " AND is_suspended = 1"; }

$stmt = $pdo->prepare("SELECT COUNT(*) FROM users $where");
$stmt->execute($params);
$total = $stmt->fetchColumn();

$stmt = $pdo->prepare("SELECT * FROM users $where ORDER BY created_at DESC LIMIT $limit OFFSET $offset");
$stmt->execute($params);
$users = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Users - Batch15Tube Admin</title>
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
                <a href="<?= SITE_URL ?>/admin/users.php" class="admin-nav-item active"><i class="fas fa-users"></i> Users</a>
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
                <a href="<?= SITE_URL ?>/public/index.php" class="admin-nav-item"><i class="fas fa-arrow-left"></i> Back to Site</a>
                <a href="<?= SITE_URL ?>/admin/index.php?logout=1" class="admin-nav-item"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </nav>
        </aside>

        <main class="admin-main">
            <div class="admin-topbar">
                <h1 class="admin-page-title"><i class="fas fa-users"></i> Manage Users (<?= $total ?>)</h1>
            </div>

            <div class="admin-table-container">
                <div class="admin-table-toolbar">
                    <form method="GET" style="display:flex;gap:12px;flex-wrap:wrap;flex:1;">
                        <div class="search-bar" style="max-width:300px;">
                            <input type="text" name="search" class="search-input" placeholder="Search users..." value="<?= htmlspecialchars($search) ?>">
                            <button type="submit" class="search-btn"><i class="fas fa-search"></i></button>
                        </div>
                        <select name="filter" class="form-input" style="width:auto;padding:8px 12px;" onchange="this.form.submit()">
                            <option value="">All Users</option>
                            <option value="active" <?= $filter === 'active' ? 'selected' : '' ?>>Active</option>
                            <option value="suspended" <?= $filter === 'suspended' ? 'selected' : '' ?>>Suspended</option>
                        </select>
                    </form>
                    <button class="export-btn" onclick="exportTable('usersTable', 'users')"><i class="fas fa-download"></i> Export CSV</button>
                </div>

                <table class="admin-table" id="usersTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Avatar</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Joined</th>
                            <th>Last Login</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $u): ?>
                        <tr>
                            <td><?= $u['id'] ?></td>
                            <td><img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($u['avatar'] ?: 'default.png') ?>" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" onerror="this.src='<?= SITE_URL ?>/uploads/avatars/default.png'"></td>
                            <td><?= htmlspecialchars($u['first_name'] . ' ' . $u['last_name']) ?></td>
                            <td><?= htmlspecialchars($u['username']) ?></td>
                            <td><?= htmlspecialchars($u['email']) ?></td>
                            <td><?= date('M d, Y', strtotime($u['created_at'])) ?></td>
                            <td><?= $u['last_login'] ? date('M d, Y H:i', strtotime($u['last_login'])) : 'Never' ?></td>
                            <td>
                                <?php if ($u['is_suspended']): ?>
                                <span class="status-badge suspended">Suspended</span>
                                <?php else: ?>
                                <span class="status-badge active">Active</span>
                                <?php endif; ?>
                            </td>
                            <td>
                                <div class="actions">
                                    <a href="?action=activate&id=<?= $u['id'] ?>" class="action-icon view" title="Activate"><i class="fas fa-check"></i></a>
                                    <a href="?action=suspend&id=<?= $u['id'] ?>" class="action-icon hide" title="Suspend" onclick="return confirm('Suspend this user?')"><i class="fas fa-ban"></i></a>
                                    <a href="?action=delete&id=<?= $u['id'] ?>" class="action-icon delete" title="Delete" onclick="return confirm('Delete this user permanently?')"><i class="fas fa-trash"></i></a>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>
    <script src="<?= SITE_URL ?>/assets/js/admin.js"></script>
</body>
</html>

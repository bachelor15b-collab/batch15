<?php
require_once __DIR__ . '/../config/config.php';
if (!isset($_SESSION['admin_id'])) redirect(SITE_URL . '/admin/index.php');

if (isset($_GET['delete'])) {
    $stmt = $pdo->prepare("DELETE FROM comments WHERE id = ?");
    $stmt->execute([intval($_GET['delete'])]);
    redirect(SITE_URL . '/admin/comments.php');
}
if (isset($_GET['approve'])) {
    $stmt = $pdo->prepare("UPDATE comments SET is_approved = NOT is_approved WHERE id = ?");
    $stmt->execute([intval($_GET['approve'])]);
    redirect(SITE_URL . '/admin/comments.php');
}

$stmt = $pdo->query("SELECT c.*, u.username, v.title as video_title FROM comments c JOIN users u ON c.user_id = u.id JOIN videos v ON c.video_id = v.id ORDER BY c.created_at DESC");
$comments = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comments - Batch15Tube Admin</title>
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
                <a href="<?= SITE_URL ?>/admin/comments.php" class="admin-nav-item active"><i class="fas fa-comments"></i> Comments</a>
                <a href="<?= SITE_URL ?>/admin/settings.php" class="admin-nav-item"><i class="fas fa-cog"></i> Settings</a>
                <hr class="admin-nav-divider">
                <a href="<?= SITE_URL ?>/admin/index.php?logout=1" class="admin-nav-item"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </nav>
        </aside>
        <main class="admin-main">
            <div class="admin-topbar"><h1 class="admin-page-title"><i class="fas fa-comments"></i> Comments</h1></div>
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>User</th><th>Video</th><th>Comment</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
                    <tbody>
                        <?php foreach ($comments as $c): ?>
                        <tr>
                            <td><?= $c['id'] ?></td>
                            <td><?= htmlspecialchars($c['username']) ?></td>
                            <td><?= htmlspecialchars(mb_substr($c['video_title'], 0, 30)) ?>...</td>
                            <td><?= htmlspecialchars(mb_substr($c['content'], 0, 50)) ?>...</td>
                            <td><?= date('M d, Y', strtotime($c['created_at'])) ?></td>
                            <td><span class="status-badge <?= $c['is_approved'] ? 'active' : 'pending' ?>"><?= $c['is_approved'] ? 'Approved' : 'Pending' ?></span></td>
                            <td>
                                <div class="actions">
                                    <a href="?approve=<?= $c['id'] ?>" class="action-icon view"><i class="fas fa-<?= $c['is_approved'] ? 'eye-slash' : 'eye' ?>"></i></a>
                                    <a href="?delete=<?= $c['id'] ?>" class="action-icon delete" onclick="return confirm('Delete?')"><i class="fas fa-trash"></i></a>
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

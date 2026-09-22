<?php
require_once __DIR__ . '/../config/config.php';
if (!isset($_SESSION['admin_id'])) redirect(SITE_URL . '/admin/index.php');

if (isset($_GET['resolve'])) {
    $stmt = $pdo->prepare("UPDATE reports SET status = 'resolved', resolved_by = ?, resolved_at = NOW() WHERE id = ?");
    $stmt->execute([$_SESSION['admin_id'], intval($_GET['resolve'])]);
    redirect(SITE_URL . '/admin/reports.php');
}

$stmt = $pdo->query("SELECT r.*, u.username as reporter, v.title as video_title FROM reports r LEFT JOIN users u ON r.reported_by = u.id LEFT JOIN videos v ON r.video_id = v.id ORDER BY r.created_at DESC");
$reports = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reports - Batch15Tube Admin</title>
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
                <a href="<?= SITE_URL ?>/admin/reports.php" class="admin-nav-item active"><i class="fas fa-flag"></i> Reports</a>
                <a href="<?= SITE_URL ?>/admin/settings.php" class="admin-nav-item"><i class="fas fa-cog"></i> Settings</a>
                <hr class="admin-nav-divider">
                <a href="<?= SITE_URL ?>/admin/index.php?logout=1" class="admin-nav-item"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </nav>
        </aside>
        <main class="admin-main">
            <div class="admin-topbar"><h1 class="admin-page-title"><i class="fas fa-flag"></i> Reports</h1></div>
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>Reporter</th><th>Video</th><th>Reason</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>
                        <?php foreach ($reports as $r): ?>
                        <tr>
                            <td><?= $r['id'] ?></td>
                            <td><?= htmlspecialchars($r['reporter'] ?? 'Anonymous') ?></td>
                            <td><?= htmlspecialchars(mb_substr($r['video_title'] ?? 'N/A', 0, 30)) ?></td>
                            <td><?= htmlspecialchars($r['reason']) ?></td>
                            <td><span class="status-badge <?= $r['status'] === 'pending' ? 'pending' : ($r['status'] === 'resolved' ? 'active' : 'inactive') ?>"><?= ucfirst($r['status']) ?></span></td>
                            <td><?= date('M d, Y', strtotime($r['created_at'])) ?></td>
                            <td>
                                <?php if ($r['status'] !== 'resolved'): ?>
                                <a href="?resolve=<?= $r['id'] ?>" class="action-icon view" onclick="return confirm('Mark as resolved?')"><i class="fas fa-check"></i></a>
                                <?php endif; ?>
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

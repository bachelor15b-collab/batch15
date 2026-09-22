<?php
require_once __DIR__ . '/../config/config.php';
if (!isset($_SESSION['admin_id'])) redirect(SITE_URL . '/admin/index.php');

if (isset($_GET['verify'])) {
    $stmt = $pdo->prepare("UPDATE certificates SET is_verified = NOT is_verified WHERE id = ?");
    $stmt->execute([intval($_GET['verify'])]);
    redirect(SITE_URL . '/admin/certificates.php');
}

$stmt = $pdo->query("SELECT c.*, u.first_name, u.last_name, u.username, s.name as skill_name FROM certificates c JOIN users u ON c.user_id = u.id JOIN skills s ON c.skill_id = s.id ORDER BY c.issued_date DESC");
$certificates = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certificates - Batch15Tube Admin</title>
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
                <a href="<?= SITE_URL ?>/admin/certificates.php" class="admin-nav-item active"><i class="fas fa-certificate"></i> Certificates</a>
                <a href="<?= SITE_URL ?>/admin/settings.php" class="admin-nav-item"><i class="fas fa-cog"></i> Settings</a>
                <hr class="admin-nav-divider">
                <a href="<?= SITE_URL ?>/admin/index.php?logout=1" class="admin-nav-item"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </nav>
        </aside>
        <main class="admin-main">
            <div class="admin-topbar"><h1 class="admin-page-title"><i class="fas fa-certificate"></i> Certificates</h1></div>
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>Student</th><th>Skill</th><th>Code</th><th>Issued</th><th>Downloads</th><th>Verified</th><th>Actions</th></tr></thead>
                    <tbody>
                        <?php foreach ($certificates as $c): ?>
                        <tr>
                            <td><?= $c['id'] ?></td>
                            <td><?= htmlspecialchars($c['first_name'] . ' ' . $c['last_name']) ?></td>
                            <td><?= htmlspecialchars($c['skill_name']) ?></td>
                            <td><?= htmlspecialchars($c['certificate_code']) ?></td>
                            <td><?= $c['issued_date'] ?></td>
                            <td><?= $c['downloaded_count'] ?></td>
                            <td><span class="status-badge <?= $c['is_verified'] ? 'active' : 'pending' ?>"><?= $c['is_verified'] ? 'Verified' : 'Unverified' ?></span></td>
                            <td><a href="?verify=<?= $c['id'] ?>" class="action-icon view"><i class="fas fa-<?= $c['is_verified'] ? 'times' : 'check' ?>"></i></a></td>
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

<?php
require_once __DIR__ . '/../config/config.php';
if (!isset($_SESSION['admin_id'])) redirect(SITE_URL . '/admin/index.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $code = sanitize($_POST['code']);
    $name = sanitize($_POST['name']);
    if ($_POST['action'] === 'add') {
        $stmt = $pdo->prepare("INSERT INTO languages (code, name) VALUES (?, ?)");
        $stmt->execute([$code, $name]);
    } elseif ($_POST['action'] === 'delete' && isset($_POST['id'])) {
        $stmt = $pdo->prepare("DELETE FROM languages WHERE id = ?");
        $stmt->execute([intval($_POST['id'])]);
    }
    redirect(SITE_URL . '/admin/languages.php');
}

$stmt = $pdo->query("SELECT * FROM languages ORDER BY sort_order");
$languages = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Languages - Batch15Tube Admin</title>
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
                <a href="<?= SITE_URL ?>/admin/languages.php" class="admin-nav-item active"><i class="fas fa-globe"></i> Languages</a>
                <a href="<?= SITE_URL ?>/admin/settings.php" class="admin-nav-item"><i class="fas fa-cog"></i> Settings</a>
                <hr class="admin-nav-divider">
                <a href="<?= SITE_URL ?>/admin/index.php?logout=1" class="admin-nav-item"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </nav>
        </aside>
        <main class="admin-main">
            <div class="admin-topbar">
                <h1 class="admin-page-title"><i class="fas fa-globe"></i> Languages</h1>
                <button class="btn btn-primary" data-modal="addLanguageModal"><i class="fas fa-plus"></i> Add Language</button>
            </div>
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>Code</th><th>Name</th><th>Actions</th></tr></thead>
                    <tbody>
                        <?php foreach ($languages as $l): ?>
                        <tr>
                            <td><?= $l['id'] ?></td>
                            <td><?= htmlspecialchars($l['code']) ?></td>
                            <td><?= htmlspecialchars($l['name']) ?></td>
                            <td><form method="POST" style="display:inline;"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= $l['id'] ?>"><button type="submit" class="action-icon delete"><i class="fas fa-trash"></i></button></form></td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <div class="modal-overlay" id="addLanguageModal">
        <div class="modal">
            <div class="modal-header"><h3 class="modal-title">Add Language</h3><button class="close-btn modal-close">&times;</button></div>
            <form method="POST" class="admin-form">
                <input type="hidden" name="action" value="add">
                <div class="form-group"><label class="form-label">Code (e.g. en, so, ar)</label><input type="text" name="code" class="form-input" required maxlength="10"></div>
                <div class="form-group"><label class="form-label">Name</label><input type="text" name="name" class="form-input" required></div>
                <div class="form-actions"><button type="button" class="btn btn-outline modal-close">Cancel</button><button type="submit" class="btn btn-primary">Save</button></div>
            </form>
        </div>
    </div>
    <script src="<?= SITE_URL ?>/assets/js/admin.js"></script>
</body>
</html>

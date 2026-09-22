<?php
require_once __DIR__ . '/../config/config.php';
if (!isset($_SESSION['admin_id'])) redirect(SITE_URL . '/admin/index.php');

$message = '';
$admin = $pdo->prepare("SELECT * FROM admins WHERE id = ?");
$admin->execute([$_SESSION['admin_id']]);
$admin = $admin->fetch();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'profile') {
        $fullName = sanitize($_POST['full_name']);
        $email = sanitize($_POST['email']);
        $stmt = $pdo->prepare("UPDATE admins SET full_name = ?, email = ? WHERE id = ?");
        $stmt->execute([$fullName, $email, $_SESSION['admin_id']]);
        $_SESSION['admin_name'] = $fullName;
        $message = 'Profile updated!';
    } elseif (isset($_POST['action']) && $_POST['action'] === 'avatar') {
        if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {
            $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
            $allowed = ['jpg', 'jpeg', 'png', 'gif'];
            if (in_array(strtolower($ext), $allowed)) {
                $filename = 'admin_' . $_SESSION['admin_id'] . '_' . time() . '.' . $ext;
                move_uploaded_file($_FILES['avatar']['tmp_name'], AVATAR_PATH . '/' . $filename);
                $stmt = $pdo->prepare("UPDATE admins SET avatar = ? WHERE id = ?");
                $stmt->execute([$filename, $_SESSION['admin_id']]);
                $message = 'Avatar updated!';
            } else {
                $message = 'Invalid file type';
            }
        }
    } elseif (isset($_POST['action']) && $_POST['action'] === 'password') {
        $current = $_POST['current_password'] ?? '';
        $newPass = $_POST['new_password'] ?? '';
        $confirm = $_POST['confirm_password'] ?? '';
        if (!password_verify($current, $admin['password'])) {
            $message = 'Current password is incorrect';
        } elseif ($newPass !== $confirm) {
            $message = 'Passwords do not match';
        } elseif (strlen($newPass) < 6) {
            $message = 'Password must be at least 6 characters';
        } else {
            $hash = password_hash($newPass, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE admins SET password = ? WHERE id = ?");
            $stmt->execute([$hash, $_SESSION['admin_id']]);
            $message = 'Password changed!';
        }
    } else {
        foreach ($_POST['settings'] as $key => $value) {
            $value = sanitize($value);
            $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
            $stmt->execute([$key, $value]);
        }
        $message = 'Settings saved successfully!';
    }
    $admin = $pdo->prepare("SELECT * FROM admins WHERE id = ?");
    $admin->execute([$_SESSION['admin_id']]);
    $admin = $admin->fetch();
}

$stmt = $pdo->query("SELECT * FROM settings");
$settings = [];
while ($s = $stmt->fetch()) {
    $settings[$s['setting_key']] = $s['setting_value'];
}
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings - Batch15Tube Admin</title>
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
                <a href="<?= SITE_URL ?>/admin/analytics.php" class="admin-nav-item"><i class="fas fa-chart-bar"></i> Analytics</a>
                <a href="<?= SITE_URL ?>/admin/settings.php" class="admin-nav-item active"><i class="fas fa-cog"></i> Settings</a>
                <hr class="admin-nav-divider">
                <a href="<?= SITE_URL ?>/admin/index.php?logout=1" class="admin-nav-item"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </nav>
        </aside>

        <main class="admin-main">
            <div class="admin-topbar">
                <h1 class="admin-page-title"><i class="fas fa-cog"></i> System Settings</h1>
            </div>

            <?php if ($message): ?>
            <div class="toast toast-success" style="margin-bottom:20px;animation:none;display:flex;"><?= htmlspecialchars($message) ?></div>
            <?php endif; ?>

            <!-- Admin Profile -->
            <div class="admin-table-container" style="max-width:600px;margin-bottom:24px;">
                <h3 style="padding:16px 24px;border-bottom:1px solid var(--border-color);"><i class="fas fa-user-shield" style="color:var(--primary);"></i> Admin Profile</h3>
                <div style="display:flex;align-items:center;gap:20px;padding:20px 24px;border-bottom:1px solid var(--border-color);">
                    <img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($admin['avatar'] ?: 'default.png') ?>" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid var(--primary);" onerror="this.src='<?= SITE_URL ?>/uploads/avatars/default.png'">
                    <div>
                        <div style="font-size:18px;font-weight:700;"><?= htmlspecialchars($admin['full_name']) ?></div>
                        <div style="font-size:13px;color:var(--text-secondary);"><i class="fas fa-shield-alt" style="color:var(--primary);"></i> <?= htmlspecialchars($admin['role'] ?? 'Administrator') ?></div>
                    </div>
                </div>
                <form method="POST" style="padding:24px;border-bottom:1px solid var(--border-color);">
                    <input type="hidden" name="action" value="avatar">
                    <div class="form-group">
                        <label class="form-label">Update Profile Picture</label>
                        <input type="file" name="avatar" accept="image/*" style="padding:10px;" class="form-input">
                    </div>
                    <button type="submit" class="btn btn-primary">Upload Avatar</button>
                </form>
                <form method="POST" style="padding:24px;border-bottom:1px solid var(--border-color);">
                    <input type="hidden" name="action" value="profile">
                    <div class="form-group"><label class="form-label">Full Name</label><input type="text" name="full_name" class="form-input" value="<?= htmlspecialchars($admin['full_name']) ?>"></div>
                    <div class="form-group"><label class="form-label">Email</label><input type="email" name="email" class="form-input" value="<?= htmlspecialchars($admin['email'] ?? '') ?>"></div>
                    <button type="submit" class="btn btn-primary">Update Profile</button>
                </form>
                <form method="POST" style="padding:24px;">
                    <input type="hidden" name="action" value="password">
                    <div class="form-group"><label class="form-label">Current Password</label><input type="password" name="current_password" class="form-input" required></div>
                    <div class="form-group"><label class="form-label">New Password</label><input type="password" name="new_password" class="form-input" required minlength="6"></div>
                    <div class="form-group"><label class="form-label">Confirm Password</label><input type="password" name="confirm_password" class="form-input" required minlength="6"></div>
                    <button type="submit" class="btn btn-primary">Change Password</button>
                </form>
            </div>

            <!-- System Settings -->
            <div class="admin-table-container" style="max-width:600px;">
                <h3 style="padding:16px 24px;border-bottom:1px solid var(--border-color);"><i class="fas fa-cog" style="color:var(--primary);"></i> System Settings</h3>
                <form method="POST" class="admin-form" style="padding:24px;">
                    <div class="form-group">
                        <label class="form-label">Site Name</label>
                        <input type="text" name="settings[site_name]" class="form-input" value="<?= htmlspecialchars($settings['site_name'] ?? 'Batch15Tube') ?>">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Site Description</label>
                        <textarea name="settings[site_description]" class="form-textarea" rows="2"><?= htmlspecialchars($settings['site_description'] ?? '') ?></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Max Free Videos (Guests)</label>
                        <input type="number" name="settings[max_free_videos]" class="form-input" value="<?= htmlspecialchars($settings['max_free_videos'] ?? '2') ?>">
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <input type="hidden" name="settings[allow_registration]" value="0">
                            <input type="checkbox" name="settings[allow_registration]" value="1" <?= ($settings['allow_registration'] ?? '1') === '1' ? 'checked' : '' ?>>
                            Allow Registration
                        </label>
                    </div>
                    <div class="form-group">
                        <label class="form-label">
                            <input type="hidden" name="settings[maintenance_mode]" value="0">
                            <input type="checkbox" name="settings[maintenance_mode]" value="1" <?= ($settings['maintenance_mode'] ?? '0') === '1' ? 'checked' : '' ?>>
                            Maintenance Mode
                        </label>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Settings</button>
                </form>
            </div>
        </main>
    </div>
    <script src="<?= SITE_URL ?>/assets/js/admin.js"></script>
</body>
</html>

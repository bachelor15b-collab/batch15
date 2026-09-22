<?php
require_once __DIR__ . '/../config/config.php';
if (!isLoggedIn()) redirect(SITE_URL . '/auth/login.php');
$pageTitle = 'Settings';
$user = getUser();
$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    if ($action === 'profile') {
        $firstName = sanitize($_POST['first_name']);
        $lastName = sanitize($_POST['last_name']);
        $stmt = $pdo->prepare("UPDATE users SET first_name = ?, last_name = ? WHERE id = ?");
        $stmt->execute([$firstName, $lastName, $_SESSION['user_id']]);
        $_SESSION['first_name'] = $firstName;
        $_SESSION['last_name'] = $lastName;
        $message = 'Profile updated successfully!';
    } elseif ($action === 'password') {
        $current = $_POST['current_password'] ?? '';
        $newPass = $_POST['new_password'] ?? '';
        $confirm = $_POST['confirm_password'] ?? '';
        if (!password_verify($current, $user['password'])) {
            $error = 'Current password is incorrect';
        } elseif ($newPass !== $confirm) {
            $error = 'Passwords do not match';
        } elseif (strlen($newPass) < 6) {
            $error = 'Password must be at least 6 characters';
        } else {
            $hash = password_hash($newPass, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt->execute([$hash, $_SESSION['user_id']]);
            $message = 'Password changed successfully!';
        }
    } elseif ($action === 'avatar') {
        if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {
            $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
            $allowed = ['jpg', 'jpeg', 'png', 'gif'];
            if (in_array(strtolower($ext), $allowed)) {
                $filename = 'user_' . $_SESSION['user_id'] . '_' . time() . '.' . $ext;
                move_uploaded_file($_FILES['avatar']['tmp_name'], AVATAR_PATH . '/' . $filename);
                $stmt = $pdo->prepare("UPDATE users SET avatar = ? WHERE id = ?");
                $stmt->execute([$filename, $_SESSION['user_id']]);
                $_SESSION['avatar'] = $filename;
                $message = 'Avatar updated!';
            } else {
                $error = 'Invalid file type';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Settings - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        .settings-layout { display:grid;grid-template-columns:240px 1fr;gap:24px; }
        .settings-nav { background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius);overflow:hidden;position:sticky;top:80px; }
        .settings-nav-item { display:flex;align-items:center;gap:12px;padding:14px 20px;border-bottom:1px solid var(--border-color);cursor:pointer;transition:var(--transition);font-size:14px; }
        .settings-nav-item:last-child { border-bottom:none; }
        .settings-nav-item:hover { background:var(--bg-tertiary); }
        .settings-nav-item.active { color:var(--primary);font-weight:600;background:rgba(108,99,255,0.05); }
        .settings-section { display:none; }
        .settings-section.active { display:block; }
        @media (max-width:768px) { .settings-layout { grid-template-columns:1fr; } }
    </style>
</head>
<body>
    <?php include __DIR__ . '/../includes/header.php'; ?>
    <div style="max-width:1200px;margin:0 auto;">
        <h1 style="font-size:28px;font-weight:700;margin-bottom:24px;"><i class="fas fa-cog"></i> Settings</h1>

        <?php if ($message): ?>
        <div class="toast toast-success" style="margin-bottom:20px;animation:none;display:flex;"><?= htmlspecialchars($message) ?></div>
        <?php endif; ?>
        <?php if ($error): ?>
        <div class="toast toast-error" style="margin-bottom:20px;animation:none;display:flex;"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <div class="settings-layout">
            <div class="settings-nav">
                <div class="settings-nav-item active" data-section="profile"><i class="fas fa-user"></i> Profile</div>
                <div class="settings-nav-item" data-section="password"><i class="fas fa-lock"></i> Password</div>
                <div class="settings-nav-item" data-section="avatar"><i class="fas fa-image"></i> Avatar</div>
                <div class="settings-nav-item" data-section="notifications"><i class="fas fa-bell"></i> Notifications</div>
                <div class="settings-nav-item" data-section="language-pref"><i class="fas fa-globe"></i> Language</div>
            </div>

            <div>
                <!-- Profile -->
                <div class="settings-section active" id="section-profile">
                    <div class="dashboard-card">
                        <h3 style="margin-bottom:20px;">Profile Information</h3>
                        <form method="POST">
                            <input type="hidden" name="action" value="profile">
                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                                <div class="form-group"><label class="form-label">First Name</label><input type="text" name="first_name" class="form-input" value="<?= htmlspecialchars($user['first_name']) ?>"></div>
                                <div class="form-group"><label class="form-label">Last Name</label><input type="text" name="last_name" class="form-input" value="<?= htmlspecialchars($user['last_name']) ?>"></div>
                            </div>
                            <div class="form-group"><label class="form-label">Username</label><input type="text" class="form-input" value="<?= htmlspecialchars($user['username']) ?>" disabled></div>
                            <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" value="<?= htmlspecialchars($user['email']) ?>" disabled></div>
                            <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                    </div>
                </div>

                <!-- Password -->
                <div class="settings-section" id="section-password">
                    <div class="dashboard-card">
                        <h3 style="margin-bottom:20px;">Change Password</h3>
                        <form method="POST">
                            <input type="hidden" name="action" value="password">
                            <div class="form-group"><label class="form-label">Current Password</label><input type="password" name="current_password" class="form-input" required></div>
                            <div class="form-group"><label class="form-label">New Password</label><input type="password" name="new_password" class="form-input" required minlength="6"></div>
                            <div class="form-group"><label class="form-label">Confirm New Password</label><input type="password" name="confirm_password" class="form-input" required minlength="6"></div>
                            <button type="submit" class="btn btn-primary">Change Password</button>
                        </form>
                    </div>
                </div>

                <!-- Avatar -->
                <div class="settings-section" id="section-avatar">
                    <div class="dashboard-card">
                        <h3 style="margin-bottom:20px;">Profile Picture</h3>
                        <form method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="action" value="avatar">
                            <div style="display:flex;align-items:center;gap:24px;margin-bottom:20px;">
                                <img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($user['avatar'] ?? 'default.png') ?>" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid var(--primary);">
                                <div>
                                    <p style="font-weight:600;"><?= htmlspecialchars($user['first_name'] . ' ' . $user['last_name']) ?></p>
                                    <p style="font-size:13px;color:var(--text-secondary);">JPG, PNG or GIF. Max 2MB.</p>
                                </div>
                            </div>
                            <input type="file" name="avatar" accept="image/*" class="form-input" style="padding:10px;">
                            <button type="submit" class="btn btn-primary" style="margin-top:12px;">Upload</button>
                        </form>
                    </div>
                </div>

                <!-- Notifications -->
                <div class="settings-section" id="section-notifications">
                    <div class="dashboard-card">
                        <h3 style="margin-bottom:20px;">Notification Preferences</h3>
                        <p style="color:var(--text-secondary);margin-bottom:16px;">Manage your notification settings</p>
                        <div style="display:flex;flex-direction:column;gap:12px;">
                            <label class="form-checkbox"><input type="checkbox" checked><span>Email notifications</span></label>
                            <label class="form-checkbox"><input type="checkbox" checked><span>Push notifications</span></label>
                            <label class="form-checkbox"><input type="checkbox" checked><span>New lesson alerts</span></label>
                            <label class="form-checkbox"><input type="checkbox" checked><span>Certificate updates</span></label>
                        </div>
                    </div>
                </div>

                <!-- Language -->
                <div class="settings-section" id="section-language-pref">
                    <div class="dashboard-card">
                        <h3 style="margin-bottom:20px;">Language Preference</h3>
                        <p style="color:var(--text-secondary);margin-bottom:16px;">Choose your preferred learning language</p>
                        <div style="display:flex;flex-direction:column;gap:12px;">
                            <a href="#" class="lang-option" data-lang="so" style="display:flex;align-items:center;gap:12px;padding:12px 16px;border:2px solid var(--border-color);border-radius:var(--radius-sm);">🇸🇴 Somali</a>
                            <a href="#" class="lang-option" data-lang="en" style="display:flex;align-items:center;gap:12px;padding:12px 16px;border:2px solid var(--border-color);border-radius:var(--radius-sm);">🇬🇧 English</a>
                            <a href="#" class="lang-option" data-lang="ar" style="display:flex;align-items:center;gap:12px;padding:12px 16px;border:2px solid var(--border-color);border-radius:var(--radius-sm);">🇸🇦 Arabic</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php include __DIR__ . '/../includes/footer.php'; ?>
    <script>
    document.querySelectorAll('.settings-nav-item').forEach(function(item) {
        item.addEventListener('click', function() {
            document.querySelectorAll('.settings-nav-item').forEach(function(i) { i.classList.remove('active'); });
            document.querySelectorAll('.settings-section').forEach(function(s) { s.classList.remove('active'); });
            this.classList.add('active');
            document.getElementById('section-' + this.getAttribute('data-section')).classList.add('active');
        });
    });
    document.querySelectorAll('.lang-option').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            fetch('<?= SITE_URL ?>/api/language.php', { method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'}, body:'language='+this.getAttribute('data-lang') })
                .then(function() { location.reload(); });
        });
    });
    </script>
</body>
</html>

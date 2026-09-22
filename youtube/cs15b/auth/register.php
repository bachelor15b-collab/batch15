<?php
require_once __DIR__ . '/../config/config.php';
$pageTitle = 'Register';

if (isLoggedIn()) {
    redirect(SITE_URL . '/public/index.php');
}

$error = '';
$success = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $error = 'Invalid form token';
    } else {
        $firstName = sanitize($_POST['first_name'] ?? '');
        $lastName = sanitize($_POST['last_name'] ?? '');
        $username = sanitize($_POST['username'] ?? '');
        $email = sanitize($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';

        if (empty($firstName) || empty($lastName) || empty($username) || empty($email) || empty($password)) {
            $error = 'All fields are required';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $error = 'Invalid email format';
        } elseif (strpos($email, '@gmail.com') === false) {
            $error = 'Please use a Gmail address';
        } elseif (strlen($password) < 6) {
            $error = 'Password must be at least 6 characters';
        } elseif ($password !== $confirmPassword) {
            $error = 'Passwords do not match';
        } else {
            $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $email]);
            if ($stmt->fetch()) {
                $error = 'Username or email already exists';
            } else {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $rememberToken = bin2hex(random_bytes(32));
                $avatar = 'default.png';

                // Handle avatar upload
                if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === 0) {
                    $ext = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
                    $allowed = ['jpg', 'jpeg', 'png', 'gif'];
                    if (in_array(strtolower($ext), $allowed)) {
                        $avatar = 'user_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
                        move_uploaded_file($_FILES['avatar']['tmp_name'], AVATAR_PATH . '/' . $avatar);
                    }
                }

                $stmt = $pdo->prepare(
                    "INSERT INTO users (first_name, last_name, username, email, password, avatar, remember_token, is_active, is_verified)
                     VALUES (?, ?, ?, ?, ?, ?, ?, 1, 1)"
                );
                $stmt->execute([$firstName, $lastName, $username, $email, $hashedPassword, $avatar, $rememberToken]);

                $userId = $pdo->lastInsertId();

                $_SESSION['user_id'] = $userId;
                $_SESSION['username'] = $username;
                $_SESSION['first_name'] = $firstName;
                $_SESSION['last_name'] = $lastName;
                $_SESSION['avatar'] = $avatar;
                $_SESSION['theme'] = 'light';
                $_SESSION['language'] = 'en';

                setcookie('remember_token', $rememberToken, time() + 2592000, '/', '', false, true);

                logActivity($userId, 'Registration', 'New user registered');
                logLogin($userId, 'success');

                redirect(SITE_URL . '/public/index.php');
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-header">
                <a href="<?= SITE_URL ?>/public/index.php" class="auth-logo">
                    <i class="fas fa-play-circle" style="color:var(--primary)"></i> Batch15Tube
                </a>
                <p class="auth-subtitle">Create your account to start learning</p>
            </div>

            <?php if ($error): ?>
            <div class="toast toast-error" style="margin-bottom:20px;animation:none;display:flex;">
                <i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($error) ?>
            </div>
            <?php endif; ?>

            <form method="POST" action="" class="auth-form" enctype="multipart/form-data">
                <?= csrfField() ?>
                <div class="form-row" style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                    <div class="form-group">
                        <label class="form-label">First Name</label>
                        <input type="text" name="first_name" class="form-input" placeholder="John" required value="<?= htmlspecialchars($_POST['first_name'] ?? '') ?>">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Last Name</label>
                        <input type="text" name="last_name" class="form-input" placeholder="Doe" required value="<?= htmlspecialchars($_POST['last_name'] ?? '') ?>">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">Username</label>
                    <input type="text" name="username" class="form-input" placeholder="johndoe" required value="<?= htmlspecialchars($_POST['username'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label class="form-label">Gmail</label>
                    <input type="email" name="email" class="form-input" placeholder="yourname@gmail.com" required value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" name="password" class="form-input" placeholder="Min. 6 characters" required minlength="6">
                </div>
                <div class="form-group">
                    <label class="form-label">Confirm Password</label>
                    <input type="password" name="confirm_password" class="form-input" placeholder="Repeat password" required minlength="6">
                </div>
                <div class="form-group">
                    <label class="form-label">Profile Picture <span style="font-size:12px;color:var(--text-secondary);">(optional)</span></label>
                    <div style="display:flex;align-items:center;gap:16px;">
                        <img src="<?= SITE_URL ?>/uploads/avatars/default.png" id="avatarPreview" style="width:50px;height:50px;border-radius:50%;object-fit:cover;border:2px solid var(--border-color);">
                        <input type="file" name="avatar" accept="image/*" class="form-input" style="padding:8px;flex:1;" onchange="document.getElementById('avatarPreview').src = window.URL.createObjectURL(this.files[0])">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;">
                    <i class="fas fa-user-plus"></i> Create Account
                </button>
            </form>

            <div class="auth-footer">
                Already have an account? <a href="<?= SITE_URL ?>/auth/login.php">Login</a>
            </div>
        </div>
    </div>
</body>
</html>

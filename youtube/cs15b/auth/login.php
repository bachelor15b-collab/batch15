<?php
require_once __DIR__ . '/../config/config.php';
$pageTitle = 'Login';

if (isLoggedIn()) {
    redirect(SITE_URL . '/public/index.php');
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCSRFToken($_POST['csrf_token'] ?? '')) {
        $error = 'Invalid form token';
    } else {
        $email = sanitize($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $remember = isset($_POST['remember']);

        if (empty($email) || empty($password)) {
            $error = 'Email and password are required';
        } else {
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND is_active = 1 AND is_suspended = 0");
            $stmt->execute([$email]);
            $user = $stmt->fetch();

            if ($user && password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['first_name'] = $user['first_name'];
                $_SESSION['last_name'] = $user['last_name'];
                $_SESSION['avatar'] = $user['avatar'];
                $_SESSION['theme'] = $user['theme'];
                $_SESSION['language'] = $user['language'];

                if ($remember) {
                    $token = bin2hex(random_bytes(32));
                    $stmt = $pdo->prepare("UPDATE users SET remember_token = ? WHERE id = ?");
                    $stmt->execute([$token, $user['id']]);
                    setcookie('remember_token', $token, time() + 2592000, '/', '', false, true);
                }

                $stmt = $pdo->prepare("UPDATE users SET last_login = NOW(), ip_address = ? WHERE id = ?");
                $stmt->execute([$_SERVER['REMOTE_ADDR'] ?? '0.0.0.0', $user['id']]);

                logActivity($user['id'], 'Login', 'User logged in');
                logLogin($user['id'], 'success');

                redirect(SITE_URL . '/public/index.php');
            } else {
                $error = 'Invalid email or password';
                logLogin(null, 'failed');
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
    <title>Login - Batch15Tube</title>
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
                <p class="auth-subtitle">Welcome back! Login to continue learning</p>
            </div>

            <?php if ($error): ?>
            <div class="toast toast-error" style="margin-bottom:20px;animation:none;display:flex;">
                <i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($error) ?>
            </div>
            <?php endif; ?>

            <form method="POST" action="" class="auth-form">
                <?= csrfField() ?>
                <div class="form-group">
                    <label class="form-label">Gmail</label>
                    <input type="email" name="email" class="form-input" placeholder="yourname@gmail.com" required value="<?= htmlspecialchars($_POST['email'] ?? '') ?>">
                </div>
                <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" name="password" class="form-input" placeholder="Enter your password" required>
                </div>
                <div class="form-group" style="display:flex;align-items:center;justify-content:space-between;">
                    <label class="form-checkbox">
                        <input type="checkbox" name="remember" checked>
                        <span>Remember me</span>
                    </label>
                    <a href="<?= SITE_URL ?>/auth/forgot.php" class="forgot-link">Forgot password?</a>
                </div>
                <button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;">
                    <i class="fas fa-sign-in-alt"></i> Login
                </button>
            </form>

            <div class="auth-footer" style="flex-direction:column;gap:8px;">
                <div>Don't have an account? <a href="<?= SITE_URL ?>/auth/register.php">Register</a></div>
                <div style="font-size:13px;color:var(--text-secondary);">
                    <i class="fas fa-shield-alt"></i> Admin? <a href="<?= SITE_URL ?>/admin/index.php" style="color:var(--primary);">Login here</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

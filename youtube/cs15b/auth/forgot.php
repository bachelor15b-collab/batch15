<?php
require_once __DIR__ . '/../config/config.php';
$pageTitle = 'Forgot Password';

$message = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitize($_POST['email'] ?? '');
    if (empty($email)) {
        $error = 'Please enter your email';
    } else {
        $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if ($user) {
            $token = bin2hex(random_bytes(32));
            $expires = date('Y-m-d H:i:s', time() + 3600);
            $stmt = $pdo->prepare("UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?");
            $stmt->execute([$token, $expires, $user['id']]);
            $message = 'Password reset link has been sent to your email.';
        } else {
            $message = 'If this email exists, a reset link has been sent.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - Batch15Tube</title>
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
                <p class="auth-subtitle">Reset your password</p>
            </div>

            <?php if ($message): ?>
            <div class="toast toast-success" style="margin-bottom:20px;animation:none;display:flex;">
                <i class="fas fa-check-circle"></i> <?= htmlspecialchars($message) ?>
            </div>
            <?php endif; ?>

            <?php if ($error): ?>
            <div class="toast toast-error" style="margin-bottom:20px;animation:none;display:flex;">
                <i class="fas fa-exclamation-circle"></i> <?= htmlspecialchars($error) ?>
            </div>
            <?php endif; ?>

            <form method="POST" action="" class="auth-form">
                <?= csrfField() ?>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" name="email" class="form-input" placeholder="yourname@gmail.com" required>
                </div>
                <button type="submit" class="btn btn-primary btn-lg" style="width:100%;justify-content:center;">
                    <i class="fas fa-paper-plane"></i> Send Reset Link
                </button>
            </form>

            <div class="auth-footer">
                Remember your password? <a href="<?= SITE_URL ?>/auth/login.php">Login</a>
            </div>
        </div>
    </div>
</body>
</html>

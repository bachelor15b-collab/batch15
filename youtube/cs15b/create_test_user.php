<?php
require_once __DIR__ . '/config/config.php';

$first_name = 'Ahmed';
$last_name = 'Hassan';
$username = 'ahmed';
$email = 'ahmed@gmail.com';
$password = password_hash('123456', PASSWORD_DEFAULT);
$avatar = 'default.png';
$theme = 'light';
$language = 'en';

try {
    $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, username, email, password, avatar, theme, language, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())");
    $stmt->execute([$first_name, $last_name, $username, $email, $password, $avatar, $theme, $language]);
    $userId = $pdo->lastInsertId();
    echo "<h2 style='color:green;'>✅ User created!</h2>";
    echo "<p><strong>Email:</strong> ahmed@gmail.com</p>";
    echo "<p><strong>Password:</strong> 123456</p>";
    echo "<p><strong>User ID:</strong> $userId</p>";

    // Auto login
    $_SESSION['user_id'] = $userId;
    $_SESSION['username'] = $username;
    $_SESSION['first_name'] = $first_name;
    $_SESSION['last_name'] = $last_name;
    $_SESSION['avatar'] = $avatar;
    $_SESSION['theme'] = $theme;
    $_SESSION['language'] = $language;
    echo "<p><a href='" . SITE_URL . "/public/index.php' style='font-size:18px;'>🚀 Go to Dashboard</a></p>";
} catch (Exception $e) {
    if (strpos($e->getMessage(), 'Duplicate') !== false) {
        // User exists, do login
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if ($user) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['first_name'] = $user['first_name'];
            $_SESSION['last_name'] = $user['last_name'];
            $_SESSION['avatar'] = $user['avatar'];
            $_SESSION['theme'] = $user['theme'];
            $_SESSION['language'] = $user['language'];
            echo "<p style='color:blue;'>User already exists. Logged in!</p>";
            echo "<p><a href='" . SITE_URL . "/public/index.php' style='font-size:18px;'>🚀 Go to Dashboard</a></p>";
        }
    } else {
        echo "<p style='color:red;'>Error: " . $e->getMessage() . "</p>";
    }
}

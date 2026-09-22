<?php
require_once __DIR__ . '/config/config.php';

$hash = password_hash('admin123', PASSWORD_DEFAULT);
echo "New hash: " . $hash . "<br>";

$stmt = $pdo->prepare("UPDATE admins SET password = ? WHERE username = 'admin'");
if ($stmt->execute([$hash])) {
    echo "✅ Admin password updated to: <strong>admin123</strong><br>";
    echo "<a href='admin/index.php'>➡ Login now</a>";
} else {
    echo "❌ Failed to update";
}

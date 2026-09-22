<?php
/**
 * Batch15Tube - Database Setup Script
 * Run this once to create the database and seed initial data.
 * Delete or secure this file after use.
 */

$host = 'localhost';
$user = 'root';
$pass = '';

echo "<!DOCTYPE html><html lang='en'><head>
<meta charset='UTF-8'>
<meta name='viewport' content='width=device-width, initial-scale=1.0'>
<title>Batch15Tube - Setup</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; background: #0f0f0f; color: #f1f1f1; }
h1 { color: #6C63FF; }
.success { color: #10b981; }
.error { color: #ef4444; }
.info { color: #60a5fa; }
pre { background: #1a1a1a; padding: 12px; border-radius: 8px; }
code { background: #272727; padding: 2px 6px; border-radius: 4px; }
</style></head><body>
<h1>🚀 Batch15Tube - Database Setup</h1>
<hr>";

try {
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    echo "<p class='success'>✅ Connected to MySQL server.</p>";

    $pdo->exec("CREATE DATABASE IF NOT EXISTS batch15tube CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "<p class='success'>✅ Database 'batch15tube' ready.</p>";

    $pdo->exec("USE batch15tube");

    // Disable FK checks to drop ALL old tables cleanly
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

    // Drop ALL existing tables first
    $oldTables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    foreach ($oldTables as $t) {
        $pdo->exec("DROP TABLE IF EXISTS `$t`");
        echo "<p class='info'>🗑 Dropped table: {$t}</p>";
    }

    // Re-enable FK checks
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
    echo "<p class='success'>✅ All old tables dropped.</p>";

    // Read and execute schema.sql
    $sql = file_get_contents(__DIR__ . '/sql/schema.sql');
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    $count = 0;
    foreach ($statements as $stmt) {
        if (strlen($stmt) > 3) {
            try {
                $pdo->exec($stmt);
                $count++;
            } catch (PDOException $e) {
                echo "<p class='error'>❌ Schema err: " . htmlspecialchars($e->getMessage()) . "</p>";
            }
        }
    }
    echo "<p class='success'>✅ Schema executed: {$count} statements.</p>";

    // Run seeder
    $seederSql = file_get_contents(__DIR__ . '/sql/seeder.sql');
    $seedStmts = array_filter(array_map('trim', explode(';', $seederSql)));
    $seedCount = 0;
    foreach ($seedStmts as $stmt) {
        if (strlen($stmt) > 5) {
            try {
                $pdo->exec($stmt);
                $seedCount++;
            } catch (PDOException $e) {
                echo "<p class='error'>❌ Seed err: " . htmlspecialchars($e->getMessage()) . "</p>";
            }
        }
    }
    echo "<p class='success'>✅ Seeder executed: {$seedCount} statements.</p>";

    // Fix admin password to "admin123" (AFTER seeder so it's not overwritten)
    $adminHash = password_hash('admin123', PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("UPDATE admins SET password = ? WHERE username = 'admin'");
    $stmt->execute([$adminHash]);
    echo "<p class='success'>✅ Admin password set to: <strong>admin123</strong></p>";

    // Verify
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    $skills = $pdo->query("SELECT COUNT(*) FROM skills")->fetchColumn();
    $videos = $pdo->query("SELECT COUNT(*) FROM videos")->fetchColumn();
    $admins = $pdo->query("SELECT COUNT(*) FROM admins")->fetchColumn();
    $subSkills = $pdo->query("SELECT COUNT(*) FROM sub_skills")->fetchColumn();
    $categories = $pdo->query("SELECT COUNT(*) FROM categories")->fetchColumn();

    echo "<h2>📊 Summary</h2>
    <ul>
    <li>📋 Tables: " . count($tables) . "</li>
    <li>📚 Skills: {$skills}</li>
    <li>📝 Sub Skills: {$subSkills}</li>
    <li>📂 Categories: {$categories}</li>
    <li>🎬 Videos: {$videos}</li>
    <li>👤 Admins: {$admins}</li>
    </ul>";

    echo "<hr>
    <p class='success'>✅ Setup complete!</p>
    <p><a href='index.php' style='color:#6C63FF;'>🏠 Visit Batch15Tube</a> | 
       <a href='admin/index.php' style='color:#6C63FF;'>🔐 Admin Panel</a></p>
    <p><strong>Admin:</strong> <code>admin</code> / <code>admin123</code></p>
    <p><strong>phpMyAdmin:</strong> <a href='http://localhost/phpmyadmin' target='_blank' style='color:#6C63FF;'>localhost/phpmyadmin</a></p>
    <p class='info'>⚠️ Delete <code>setup.php</code> after setup for security.</p>";

} catch (PDOException $e) {
    echo "<p class='error'>❌ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<p>Make sure XAMPP MySQL is running in XAMPP Control Panel.</p>";
    echo "<p><a href='javascript:location.reload()' style='color:#6C63FF;'>↻ Retry</a></p>";
}
?>
</body></html>

<?php
require_once __DIR__ . '/../config/config.php';
if (!isLoggedIn()) redirect(SITE_URL . '/auth/login.php');
$pageTitle = 'My Certificates';
$certificates = getCertificates($_SESSION['user_id']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Certificates - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <?php include __DIR__ . '/../includes/header.php'; ?>
    <div style="max-width:1400px;margin:0 auto;">
        <h1 style="font-size:28px;font-weight:700;margin-bottom:24px;"><i class="fas fa-certificate" style="color:var(--primary)"></i> My Certificates</h1>
        <?php if (empty($certificates)): ?>
        <div style="text-align:center;padding:60px 20px;color:var(--text-secondary);">
            <i class="fas fa-certificate" style="font-size:64px;margin-bottom:16px;opacity:0.3;color:var(--primary);"></i>
            <h2 style="color:var(--text-primary);">No certificates yet</h2>
            <p>Complete all lessons in a skill to earn a certificate</p>
            <a href="<?= SITE_URL ?>/public/skills.php" class="btn btn-primary" style="margin-top:16px;">Browse Skills</a>
        </div>
        <?php else: ?>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:24px;">
            <?php foreach ($certificates as $cert): ?>
            <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:var(--radius-lg);padding:32px;text-align:center;position:relative;overflow:hidden;">
                <div style="position:absolute;top:0;left:0;right:0;height:6px;background:<?= $cert['skill_color'] ?? 'var(--primary)' ?>;"></div>
                <i class="fas fa-certificate" style="font-size:56px;color:<?= $cert['skill_color'] ?? 'var(--primary)' ?>;margin-bottom:16px;"></i>
                <h3 style="font-size:20px;margin-bottom:8px;"><?= htmlspecialchars($cert['skill_name']) ?></h3>
                <p style="font-size:13px;color:var(--text-secondary);margin-bottom:4px;">Certificate of Completion</p>
                <p style="font-size:13px;color:var(--text-secondary);margin-bottom:16px;">Issued: <?= $cert['issued_date'] ?></p>
                <p style="font-size:12px;color:var(--text-tertiary);margin-bottom:16px;">Code: <?= htmlspecialchars($cert['certificate_code']) ?></p>
                <a href="<?= SITE_URL ?>/certificates/download.php?id=<?= $cert['id'] ?>" class="btn btn-primary">
                    <i class="fas fa-download"></i> Download PDF
                </a>
            </div>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>
    </div>
    <?php include __DIR__ . '/../includes/footer.php'; ?>
</body>
</html>

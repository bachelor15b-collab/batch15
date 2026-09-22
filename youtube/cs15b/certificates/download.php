<?php
require_once __DIR__ . '/../config/config.php';

if (!isLoggedIn()) {
    redirect(SITE_URL . '/auth/login.php');
}

$certId = intval($_GET['id'] ?? 0);

$stmt = $pdo->prepare("
    SELECT c.*, s.name as skill_name, u.first_name, u.last_name, u.username
    FROM certificates c
    JOIN skills s ON c.skill_id = s.id
    JOIN users u ON c.user_id = u.id
    WHERE c.id = ? AND c.user_id = ?
");
$stmt->execute([$certId, $_SESSION['user_id']]);
$cert = $stmt->fetch();

if (!$cert) {
    die('Certificate not found');
}

// Update download count
$stmt = $pdo->prepare("UPDATE certificates SET downloaded_count = downloaded_count + 1 WHERE id = ?");
$stmt->execute([$certId]);

// Generate simple HTML certificate for PDF
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Certificate - <?= htmlspecialchars($cert['skill_name']) ?></title>
    <style>
        @page { size: landscape; margin: 0; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            width: 297mm;
            height: 210mm;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Georgia', 'Times New Roman', serif;
            background: #f8f9fa;
        }
        .certificate {
            width: 277mm;
            height: 190mm;
            background: white;
            border: 4px solid #6C63FF;
            border-radius: 20px;
            padding: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            position: relative;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .certificate::before {
            content: '';
            position: absolute;
            inset: 10px;
            border: 2px solid #6C63FF;
            border-radius: 12px;
            opacity: 0.3;
        }
        .certificate::after {
            content: '✦';
            position: absolute;
            top: 30px;
            right: 40px;
            font-size: 40px;
            color: #6C63FF;
            opacity: 0.3;
        }
        h1 { font-size: 42px; color: #6C63FF; margin-bottom: 8px; }
        h2 { font-size: 28px; color: #333; margin-bottom: 16px; font-weight: 400; }
        .recipient { font-size: 36px; color: #1a1a1a; font-weight: 700; margin: 16px 0; }
        .skill { font-size: 32px; color: #6C63FF; font-weight: 700; margin: 8px 0; }
        p { font-size: 16px; color: #666; line-height: 1.8; max-width: 500px; }
        .date { font-size: 16px; color: #999; margin-top: 24px; }
        .code { font-size: 12px; color: #ccc; margin-top: 16px; }
        .footer { display: flex; justify-content: space-between; width: 100%; margin-top: 40px; padding: 0 60px; }
        .footer-line { border-top: 2px solid #ccc; padding-top: 8px; width: 200px; font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class="certificate">
        <h1>Certificate of Completion</h1>
        <h2>This certifies that</h2>
        <div class="recipient"><?= htmlspecialchars($cert['first_name'] . ' ' . $cert['last_name']) ?></div>
        <h2>has successfully completed the course</h2>
        <div class="skill"><?= htmlspecialchars($cert['skill_name']) ?></div>
        <p>Demonstrating proficiency and understanding of the core concepts, tools, and best practices.</p>
        <div class="date">Issued on <?= $cert['issued_date'] ?></div>
        <div class="code">Certificate Code: <?= htmlspecialchars($cert['certificate_code']) ?></div>
        <div class="footer">
            <div class="footer-line">Batch15Tube</div>
            <div class="footer-line">Date</div>
        </div>
    </div>
    <script>
    window.print();
    </script>
</body>
</html>
<?php
// If using a PDF library, you'd generate a PDF here
// For now, the browser print dialog will save as PDF
?>

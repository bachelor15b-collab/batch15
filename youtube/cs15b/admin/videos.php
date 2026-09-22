<?php
require_once __DIR__ . '/../config/config.php';
if (!isset($_SESSION['admin_id'])) redirect(SITE_URL . '/admin/index.php');
$pageTitle = 'Manage Videos';

// Handle add/edit
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];
    $title = sanitize($_POST['title']);
    $description = sanitize($_POST['description']);
    $skillId = intval($_POST['skill_id'] ?? 0);
    $categoryId = intval($_POST['category_id'] ?? 0);
    $youtubeUrl = sanitize($_POST['youtube_url']);
    $instructor = sanitize($_POST['instructor'] ?? 'Batch15Tube');
    $duration = sanitize($_POST['duration'] ?? '0:00');
    $videoId = getYouTubeId($youtubeUrl);
    $embedUrl = getYouTubeEmbedUrl($youtubeUrl);
    $thumbnail = getYouTubeThumbnail($youtubeUrl);

    if (!$videoId) {
        redirect(SITE_URL . '/admin/videos.php?error=invalid_youtube');
    }
    if ($action === 'add') {
        $slug = slugify($title);
        $stmt = $pdo->prepare("SELECT id FROM videos WHERE slug = ?");
        $stmt->execute([$slug]);
        if ($stmt->fetch()) {
            $slug .= '-' . time();
        }
        $stmt = $pdo->prepare("INSERT INTO videos (skill_id, category_id, title, slug, description, youtube_id, embed_url, thumbnail, instructor, duration) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$skillId, $categoryId, $title, $slug, $description, $videoId, $embedUrl, $thumbnail, $instructor, $duration]);
    } elseif ($action === 'edit' && isset($_POST['id'])) {
        $id = intval($_POST['id']);
        $slug = slugify($title);
        $stmt = $pdo->prepare("UPDATE videos SET skill_id = ?, category_id = ?, title = ?, slug = ?, description = ?, youtube_id = ?, embed_url = ?, thumbnail = ?, instructor = ?, duration = ? WHERE id = ?");
        $stmt->execute([$skillId, $categoryId, $title, $slug, $description, $videoId, $embedUrl, $thumbnail, $instructor, $duration, $id]);
    }
    redirect(SITE_URL . '/admin/videos.php');
}

if (isset($_GET['delete'])) {
    $stmt = $pdo->prepare("DELETE FROM videos WHERE id = ?");
    $stmt->execute([intval($_GET['delete'])]);
    redirect(SITE_URL . '/admin/videos.php');
}

if (isset($_GET['toggle'])) {
    $stmt = $pdo->prepare("UPDATE videos SET is_hidden = NOT is_hidden WHERE id = ?");
    $stmt->execute([intval($_GET['toggle'])]);
    redirect(SITE_URL . '/admin/videos.php');
}

$stmt = $pdo->query("SELECT v.*, s.name as skill_name FROM videos v LEFT JOIN skills s ON v.skill_id = s.id ORDER BY v.created_at DESC");
$videos = $stmt->fetchAll();
$skills = getSkills();
$categories = $pdo->query("SELECT * FROM categories WHERE is_active = 1 ORDER BY name ASC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Videos - Batch15Tube Admin</title>
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
                <a href="<?= SITE_URL ?>/admin/videos.php" class="admin-nav-item active"><i class="fas fa-video"></i> Videos</a>
                <a href="<?= SITE_URL ?>/admin/skills.php" class="admin-nav-item"><i class="fas fa-code"></i> Skills</a>
                <a href="<?= SITE_URL ?>/admin/categories.php" class="admin-nav-item"><i class="fas fa-th"></i> Categories</a>
                <a href="<?= SITE_URL ?>/admin/languages.php" class="admin-nav-item"><i class="fas fa-globe"></i> Languages</a>
                <a href="<?= SITE_URL ?>/admin/comments.php" class="admin-nav-item"><i class="fas fa-comments"></i> Comments</a>
                <a href="<?= SITE_URL ?>/admin/reports.php" class="admin-nav-item"><i class="fas fa-flag"></i> Reports</a>
                <a href="<?= SITE_URL ?>/admin/analytics.php" class="admin-nav-item"><i class="fas fa-chart-bar"></i> Analytics</a>
                <a href="<?= SITE_URL ?>/admin/certificates.php" class="admin-nav-item"><i class="fas fa-certificate"></i> Certificates</a>
                <a href="<?= SITE_URL ?>/admin/settings.php" class="admin-nav-item"><i class="fas fa-cog"></i> Settings</a>
                <hr class="admin-nav-divider">
                <a href="<?= SITE_URL ?>/public/index.php" class="admin-nav-item"><i class="fas fa-arrow-left"></i> Back to Site</a>
                <a href="<?= SITE_URL ?>/admin/index.php?logout=1" class="admin-nav-item"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </nav>
        </aside>

        <main class="admin-main">
            <div class="admin-topbar">
                <h1 class="admin-page-title"><i class="fas fa-video"></i> Manage Videos</h1>
                <button class="btn btn-primary" data-modal="addVideoModal"><i class="fas fa-plus"></i> Add Video</button>
            </div>

            <?php if (isset($_GET['error']) && $_GET['error'] === 'invalid_youtube'): ?>
            <div class="toast toast-error" style="margin-bottom:20px;"><i class="fas fa-exclamation-circle"></i> Invalid YouTube URL. Please enter a valid YouTube video link.</div>
            <?php endif; ?>
            <div class="admin-table-container">
                <table class="admin-table">
                    <thead>
                        <tr><th>ID</th><th>Title</th><th>Skill</th><th>Instructor</th><th>Duration</th><th>Views</th><th>Status</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        <?php foreach ($videos as $v): ?>
                        <tr>
                            <td><?= $v['id'] ?></td>
                            <td><?= htmlspecialchars($v['title']) ?></td>
                            <td><?= htmlspecialchars($v['skill_name'] ?? 'N/A') ?></td>
                            <td><?= htmlspecialchars($v['instructor'] ?? 'Batch15Tube') ?></td>
                            <td><?= htmlspecialchars($v['duration'] ?? '0:00') ?></td>
                            <td><?= number_format($v['views'] ?? 0) ?></td>
                            <td><span class="status-badge <?= $v['is_hidden'] ? 'inactive' : 'active' ?>"><?= $v['is_hidden'] ? 'Hidden' : 'Visible' ?></span></td>
                            <td>
                                <div class="actions">
                                    <a href="?toggle=<?= $v['id'] ?>" class="action-icon view" title="<?= $v['is_hidden'] ? 'Show' : 'Hide' ?>"><i class="fas fa-<?= $v['is_hidden'] ? 'eye' : 'eye-slash' ?>"></i></a>
                                    <a href="?delete=<?= $v['id'] ?>" class="action-icon delete" title="Delete" onclick="return confirm('Delete this video?')"><i class="fas fa-trash"></i></a>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <!-- Add Video Modal -->
    <div class="modal-overlay" id="addVideoModal">
        <div class="modal">
            <div class="modal-header">
                <h3 class="modal-title">Add New Video</h3>
                <button class="close-btn modal-close">&times;</button>
            </div>
            <form method="POST" class="admin-form">
                <input type="hidden" name="action" value="add">
                <div class="form-group">
                    <label class="form-label">YouTube URL</label>
                    <input type="url" name="youtube_url" class="form-input" id="youtubeUrl" placeholder="https://youtube.com/watch?v=..." required>
                    <div id="thumbnailPreview" style="margin-top:8px;"></div>
                    <input type="hidden" name="youtube_id" id="youtubeId">
                </div>
                <div class="form-group">
                    <label class="form-label">Title</label>
                    <input type="text" name="title" class="form-input" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Description</label>
                    <textarea name="description" class="form-textarea" rows="3"></textarea>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                    <div class="form-group">
                        <label class="form-label">Skill</label>
                        <select name="skill_id" class="form-select">
                            <option value="">None</option>
                            <?php foreach ($skills as $s): ?>
                            <option value="<?= $s['id'] ?>"><?= htmlspecialchars($s['name']) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Category</label>
                        <select name="category_id" class="form-select">
                            <option value="">None</option>
                            <?php foreach ($categories as $c): ?>
                            <option value="<?= $c['id'] ?>"><?= htmlspecialchars($c['name']) ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                    <div class="form-group">
                        <label class="form-label">Instructor</label>
                        <input type="text" name="instructor" class="form-input" value="Batch15Tube">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Duration</label>
                        <input type="text" name="duration" class="form-input" placeholder="10:30">
                    </div>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn btn-outline modal-close">Cancel</button>
                    <button type="submit" class="btn btn-primary">Add Video</button>
                </div>
            </form>
        </div>
    </div>

    <script src="<?= SITE_URL ?>/assets/js/admin.js"></script>
    <script>
    document.getElementById('youtubeUrl')?.addEventListener('input', function() {
        var url = this.value.trim();
        var match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (match) {
            document.getElementById('thumbnailPreview').innerHTML = '<img src="https://img.youtube.com/vi/' + match[1] + '/maxresdefault.jpg" style="max-width:200px;border-radius:8px;margin-top:8px;">';
            document.getElementById('youtubeId').value = match[1];
        } else {
            document.getElementById('thumbnailPreview').innerHTML = '';
        }
    });
    </script>
</body>
</html>

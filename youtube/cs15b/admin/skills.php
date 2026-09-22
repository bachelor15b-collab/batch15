<?php
require_once __DIR__ . '/../config/config.php';
if (!isset($_SESSION['admin_id'])) redirect(SITE_URL . '/admin/index.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];
    $name = sanitize($_POST['name']);
    $description = sanitize($_POST['description']);
    $color = sanitize($_POST['color'] ?? '#6C63FF');
    $icon = sanitize($_POST['icon'] ?? 'code');

    if ($action === 'add') {
        $slug = slugify($name);
        $stmt = $pdo->prepare("INSERT INTO skills (name, slug, description, color, icon) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$name, $slug, $description, $color, $icon]);
    } elseif ($action === 'edit' && isset($_POST['id'])) {
        $id = intval($_POST['id']);
        $slug = slugify($name);
        $stmt = $pdo->prepare("UPDATE skills SET name = ?, slug = ?, description = ?, color = ?, icon = ? WHERE id = ?");
        $stmt->execute([$name, $slug, $description, $color, $icon, $id]);
    } elseif ($action === 'delete' && isset($_POST['id'])) {
        $stmt = $pdo->prepare("DELETE FROM skills WHERE id = ?");
        $stmt->execute([intval($_POST['id'])]);
    }
    redirect(SITE_URL . '/admin/skills.php');
}

// Sub-skills
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['sub_action'])) {
    $subName = sanitize($_POST['sub_name']);
    $skillId = intval($_POST['skill_id']);
    if ($_POST['sub_action'] === 'add') {
        $slug = slugify($subName);
        $stmt = $pdo->prepare("INSERT INTO sub_skills (skill_id, name, slug) VALUES (?, ?, ?)");
        $stmt->execute([$skillId, $subName, $slug]);
    } elseif ($_POST['sub_action'] === 'delete' && isset($_POST['id'])) {
        $stmt = $pdo->prepare("DELETE FROM sub_skills WHERE id = ?");
        $stmt->execute([intval($_POST['id'])]);
    }
    redirect(SITE_URL . '/admin/skills.php');
}

$skills = getSkills();
$stmt = $pdo->query("SELECT ss.*, s.name as skill_name FROM sub_skills ss JOIN skills s ON ss.skill_id = s.id ORDER BY ss.skill_id, ss.sort_order");
$subSkills = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Skills - Batch15Tube Admin</title>
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
                <a href="<?= SITE_URL ?>/admin/videos.php" class="admin-nav-item"><i class="fas fa-video"></i> Videos</a>
                <a href="<?= SITE_URL ?>/admin/skills.php" class="admin-nav-item active"><i class="fas fa-code"></i> Skills</a>
                <a href="<?= SITE_URL ?>/admin/categories.php" class="admin-nav-item"><i class="fas fa-th"></i> Categories</a>
                <a href="<?= SITE_URL ?>/admin/languages.php" class="admin-nav-item"><i class="fas fa-globe"></i> Languages</a>
                <a href="<?= SITE_URL ?>/admin/analytics.php" class="admin-nav-item"><i class="fas fa-chart-bar"></i> Analytics</a>
                <a href="<?= SITE_URL ?>/admin/settings.php" class="admin-nav-item"><i class="fas fa-cog"></i> Settings</a>
                <hr class="admin-nav-divider">
                <a href="<?= SITE_URL ?>/admin/index.php?logout=1" class="admin-nav-item"><i class="fas fa-sign-out-alt"></i> Logout</a>
            </nav>
        </aside>

        <main class="admin-main">
            <div class="admin-topbar">
                <h1 class="admin-page-title"><i class="fas fa-code"></i> Manage Skills</h1>
                <button class="btn btn-primary" data-modal="addSkillModal"><i class="fas fa-plus"></i> Add Skill</button>
            </div>

            <div class="admin-table-container" style="margin-bottom:24px;">
                <div class="table-header"><h3>Skills</h3></div>
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>Name</th><th>Slug</th><th>Color</th><th>Icon</th><th>Actions</th></tr></thead>
                    <tbody>
                        <?php foreach ($skills as $s): ?>
                        <tr>
                            <td><?= $s['id'] ?></td>
                            <td><?= htmlspecialchars($s['name']) ?></td>
                            <td><?= htmlspecialchars($s['slug']) ?></td>
                            <td><span style="display:inline-block;width:24px;height:24px;border-radius:4px;background:<?= $s['color'] ?>"></span></td>
                            <td><i class="fas fa-<?= htmlspecialchars($s['icon'] ?? 'code') ?>"></i></td>
                            <td>
                                <div class="actions">
                                    <button class="action-icon edit" onclick="editSkill(<?= $s['id'] ?>, '<?= htmlspecialchars($s['name'], ENT_QUOTES) ?>', '<?= htmlspecialchars($s['description'] ?? '', ENT_QUOTES) ?>', '<?= $s['color'] ?>', '<?= htmlspecialchars($s['icon'] ?? 'code', ENT_QUOTES) ?>')"><i class="fas fa-edit"></i></button>
                                    <form method="POST" style="display:inline;"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= $s['id'] ?>"><button type="submit" class="action-icon delete" onclick="return confirm('Delete this skill?')"><i class="fas fa-trash"></i></button></form>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <!-- Sub Skills -->
            <div class="admin-table-container">
                <div class="table-header">
                    <h3>Sub Skills / Roadmap Items</h3>
                    <button class="btn btn-outline" data-modal="addSubSkillModal"><i class="fas fa-plus"></i> Add Topic</button>
                </div>
                <table class="admin-table">
                    <thead><tr><th>ID</th><th>Skill</th><th>Name</th><th>Actions</th></tr></thead>
                    <tbody>
                        <?php foreach ($subSkills as $ss): ?>
                        <tr>
                            <td><?= $ss['id'] ?></td>
                            <td><?= htmlspecialchars($ss['skill_name']) ?></td>
                            <td><?= htmlspecialchars($ss['name']) ?></td>
                            <td>
                                <form method="POST" style="display:inline;">
                                    <input type="hidden" name="sub_action" value="delete">
                                    <input type="hidden" name="id" value="<?= $ss['id'] ?>">
                                    <button type="submit" class="action-icon delete"><i class="fas fa-trash"></i></button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </main>
    </div>

    <!-- Add Skill Modal -->
    <div class="modal-overlay" id="addSkillModal">
        <div class="modal">
            <div class="modal-header"><h3 class="modal-title">Add Skill</h3><button class="close-btn modal-close">&times;</button></div>
            <form method="POST" class="admin-form">
                <input type="hidden" name="action" value="add">
                <div class="form-group"><label class="form-label">Name</label><input type="text" name="name" class="form-input" required></div>
                <div class="form-group"><label class="form-label">Description</label><textarea name="description" class="form-textarea" rows="2"></textarea></div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                    <div class="form-group"><label class="form-label">Color</label><input type="color" name="color" class="form-input" value="#6C63FF"></div>
                    <div class="form-group"><label class="form-label">Icon (Font Awesome)</label><input type="text" name="icon" class="form-input" value="code" placeholder="e.g. code, server, shield"></div>
                </div>
                <div class="form-actions"><button type="button" class="btn btn-outline modal-close">Cancel</button><button type="submit" class="btn btn-primary">Save</button></div>
            </form>
        </div>
    </div>

    <!-- Edit Skill Modal -->
    <div class="modal-overlay" id="editSkillModal">
        <div class="modal">
            <div class="modal-header"><h3 class="modal-title">Edit Skill</h3><button class="close-btn modal-close">&times;</button></div>
            <form method="POST" class="admin-form">
                <input type="hidden" name="action" value="edit">
                <input type="hidden" name="id" id="editId">
                <div class="form-group"><label class="form-label">Name</label><input type="text" name="name" class="form-input" id="editName" required></div>
                <div class="form-group"><label class="form-label">Description</label><textarea name="description" class="form-textarea" rows="2" id="editDesc"></textarea></div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                    <div class="form-group"><label class="form-label">Color</label><input type="color" name="color" class="form-input" id="editColor"></div>
                    <div class="form-group"><label class="form-label">Icon</label><input type="text" name="icon" class="form-input" id="editIcon"></div>
                </div>
                <div class="form-actions"><button type="button" class="btn btn-outline modal-close">Cancel</button><button type="submit" class="btn btn-primary">Update</button></div>
            </form>
        </div>
    </div>

    <!-- Add Sub Skill Modal -->
    <div class="modal-overlay" id="addSubSkillModal">
        <div class="modal">
            <div class="modal-header"><h3 class="modal-title">Add Topic (Roadmap Item)</h3><button class="close-btn modal-close">&times;</button></div>
            <form method="POST" class="admin-form">
                <input type="hidden" name="sub_action" value="add">
                <div class="form-group">
                    <label class="form-label">Skill</label>
                    <select name="skill_id" class="form-select" required>
                        <?php foreach ($skills as $s): ?>
                        <option value="<?= $s['id'] ?>"><?= htmlspecialchars($s['name']) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="form-group"><label class="form-label">Topic Name</label><input type="text" name="sub_name" class="form-input" required></div>
                <div class="form-actions"><button type="button" class="btn btn-outline modal-close">Cancel</button><button type="submit" class="btn btn-primary">Save</button></div>
            </form>
        </div>
    </div>

    <script src="<?= SITE_URL ?>/assets/js/admin.js"></script>
    <script>
    function editSkill(id, name, desc, color, icon) {
        document.getElementById('editId').value = id;
        document.getElementById('editName').value = name;
        document.getElementById('editDesc').value = desc;
        document.getElementById('editColor').value = color;
        document.getElementById('editIcon').value = icon;
        document.getElementById('editSkillModal').classList.add('show');
    }
    </script>
</body>
</html>

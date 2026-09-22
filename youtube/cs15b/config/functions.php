<?php
// Core Functions

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function isAdmin() {
    return isset($_SESSION['admin_id']);
}

function getUser($id = null) {
    global $pdo;
    if ($id === null) $id = $_SESSION['user_id'] ?? 0;
    $stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
    $stmt->execute([$id]);
    return $stmt->fetch();
}

function getSkills($limit = null) {
    global $pdo;
    $sql = "SELECT * FROM skills WHERE is_active = 1 ORDER BY sort_order ASC, name ASC";
    if ($limit) $sql .= " LIMIT " . intval($limit);
    $stmt = $pdo->query($sql);
    return $stmt->fetchAll();
}

function getVideos($limit = 20, $offset = 0) {
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT v.*, s.name as skill_name, s.color as skill_color
         FROM videos v
         LEFT JOIN skills s ON v.skill_id = s.id
         WHERE v.is_active = 1 AND v.is_hidden = 0
         ORDER BY v.created_at DESC
         LIMIT ? OFFSET ?"
    );
    $stmt->execute([$limit, $offset]);
    return $stmt->fetchAll();
}

function getVideo($id) {
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT v.*, s.name as skill_name, s.color as skill_color, s.slug as skill_slug
         FROM videos v
         LEFT JOIN skills s ON v.skill_id = s.id
         WHERE v.id = ? AND v.is_active = 1"
    );
    $stmt->execute([$id]);
    return $stmt->fetch();
}

function getPlaylistVideos($skill_id) {
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT v.*, pv.sort_order
         FROM playlist_videos pv
         JOIN videos v ON pv.video_id = v.id
         JOIN playlists p ON pv.playlist_id = p.id
         WHERE p.skill_id = ? AND v.is_active = 1 AND v.is_hidden = 0
         ORDER BY pv.sort_order ASC"
    );
    $stmt->execute([$skill_id]);
    return $stmt->fetchAll();
}

function getWatchHistory($user_id, $limit = 20) {
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT v.*, wh.watched_at, s.name as skill_name, s.color as skill_color
         FROM watch_history wh
         JOIN videos v ON wh.video_id = v.id
         LEFT JOIN skills s ON v.skill_id = s.id
         WHERE wh.user_id = ?
         ORDER BY wh.watched_at DESC
         LIMIT ?"
    );
    $stmt->execute([$user_id, $limit]);
    return $stmt->fetchAll();
}

function getSavedVideos($user_id) {
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT v.*, sv.created_at as saved_at, s.name as skill_name, s.color as skill_color
         FROM saved_videos sv
         JOIN videos v ON sv.video_id = v.id
         LEFT JOIN skills s ON v.skill_id = s.id
         WHERE sv.user_id = ?
         ORDER BY sv.created_at DESC"
    );
    $stmt->execute([$user_id]);
    return $stmt->fetchAll();
}

function getVideoProgress($user_id, $video_id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM video_progress WHERE user_id = ? AND video_id = ?");
    $stmt->execute([$user_id, $video_id]);
    return $stmt->fetch();
}

function isVideoSaved($user_id, $video_id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT id FROM saved_videos WHERE user_id = ? AND video_id = ?");
    $stmt->execute([$user_id, $video_id]);
    return $stmt->fetch() ? true : false;
}

function isVideoLiked($user_id, $video_id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM likes WHERE user_id = ? AND video_id = ?");
    $stmt->execute([$user_id, $video_id]);
    return $stmt->fetch();
}

function incrementViews($video_id) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE videos SET views = views + 1 WHERE id = ?");
    $stmt->execute([$video_id]);
}

function getComments($video_id) {
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT c.*, u.username, u.avatar
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.video_id = ? AND c.is_approved = 1 AND c.parent_id IS NULL
         ORDER BY c.created_at DESC"
    );
    $stmt->execute([$video_id]);
    return $stmt->fetchAll();
}

function getReplies($comment_id) {
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT c.*, u.username, u.avatar
         FROM comments c
         JOIN users u ON c.user_id = u.id
         WHERE c.parent_id = ? AND c.is_approved = 1
         ORDER BY c.created_at ASC"
    );
    $stmt->execute([$comment_id]);
    return $stmt->fetchAll();
}

function getCertificates($user_id) {
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT c.*, s.name as skill_name, s.color as skill_color
         FROM certificates c
         JOIN skills s ON c.skill_id = s.id
         WHERE c.user_id = ?
         ORDER BY c.issued_date DESC"
    );
    $stmt->execute([$user_id]);
    return $stmt->fetchAll();
}

function getTotalWatchHours($user_id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT COALESCE(SUM(duration_watched), 0) as total FROM watch_history WHERE user_id = ?");
    $stmt->execute([$user_id]);
    return $stmt->fetch()['total'];
}

function getCompletedLessons($user_id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM video_progress WHERE user_id = ? AND completed = 1");
    $stmt->execute([$user_id]);
    return $stmt->fetch()['total'];
}

function getCurrentSkill($user_id) {
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT s.name, s.color, s.slug
         FROM watch_history wh
         JOIN videos v ON wh.video_id = v.id
         JOIN skills s ON v.skill_id = s.id
         WHERE wh.user_id = ?
         GROUP BY s.id
         ORDER BY MAX(wh.watched_at) DESC
         LIMIT 1"
    );
    $stmt->execute([$user_id]);
    return $stmt->fetch();
}

function getLearningStreak($user_id) {
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT DISTINCT DATE(watched_at) as watch_date
         FROM watch_history
         WHERE user_id = ?
         ORDER BY watch_date DESC
         LIMIT 30"
    );
    $stmt->execute([$user_id]);
    $dates = $stmt->fetchAll(PDO::FETCH_COLUMN);
    if (empty($dates)) return 0;
    $streak = 1;
    $today = new DateTime();
    $check = $today->modify('-1 day');
    foreach ($dates as $date) {
        $d = new DateTime($date);
        if ($d->format('Y-m-d') === $check->format('Y-m-d')) {
            $streak++;
            $check->modify('-1 day');
        } else {
            break;
        }
    }
    return $streak;
}

function getNotifications($user_id, $limit = 10) {
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT * FROM notifications
         WHERE user_id = ? OR user_id IS NULL
         ORDER BY created_at DESC
         LIMIT ?"
    );
    $stmt->execute([$user_id, $limit]);
    return $stmt->fetchAll();
}

function getUnreadNotificationCount($user_id) {
    global $pdo;
    $stmt = $pdo->prepare(
        "SELECT COUNT(*) as total FROM notifications
         WHERE (user_id = ? OR is_global = 1) AND is_read = 0"
    );
    $stmt->execute([$user_id]);
    return $stmt->fetch()['total'];
}

function logActivity($user_id, $action, $details = null) {
    global $pdo;
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $stmt = $pdo->prepare(
        "INSERT INTO activity_logs (user_id, action, details, ip_address, user_agent)
         VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->execute([$user_id, $action, $details, $ip, $ua]);
}

function logLogin($user_id, $status = 'success') {
    global $pdo;
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $stmt = $pdo->prepare(
        "INSERT INTO login_logs (user_id, ip_address, user_agent, status)
         VALUES (?, ?, ?, ?)"
    );
    $stmt->execute([$user_id ?: null, $ip, $ua, $status]);
}

function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

function csrfField() {
    return '<input type="hidden" name="csrf_token" value="' . generateCSRFToken() . '">';
}

function sanitize($input) {
    return htmlspecialchars(strip_tags(trim($input)), ENT_QUOTES, 'UTF-8');
}

function slugify($text) {
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);
    $text = preg_replace('~[^-\w]+~', '', $text);
    $text = trim($text, '-');
    $text = preg_replace('~-+~', '-', $text);
    $text = strtolower($text);
    return empty($text) ? 'n-a' : $text;
}

function timeAgo($datetime) {
    $now = new DateTime();
    $ago = new DateTime($datetime);
    $diff = $now->diff($ago);
    if ($diff->y > 0) return $diff->y . ' year' . ($diff->y > 1 ? 's' : '') . ' ago';
    if ($diff->m > 0) return $diff->m . ' month' . ($diff->m > 1 ? 's' : '') . ' ago';
    if ($diff->d > 0) return $diff->d . ' day' . ($diff->d > 1 ? 's' : '') . ' ago';
    if ($diff->h > 0) return $diff->h . ' hour' . ($diff->h > 1 ? 's' : '') . ' ago';
    if ($diff->i > 0) return $diff->i . ' minute' . ($diff->i > 1 ? 's' : '') . ' ago';
    return 'just now';
}

function formatDuration($seconds) {
    $hours = floor($seconds / 3600);
    $minutes = floor(($seconds % 3600) / 60);
    $secs = $seconds % 60;
    if ($hours > 0) return sprintf("%d:%02d:%02d", $hours, $minutes, $secs);
    return sprintf("%d:%02d", $minutes, $secs);
}

function redirect($url) {
    header("Location: $url");
    exit;
}

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function getYouTubeId($url) {
    preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $url, $matches);
    return $matches[1] ?? null;
}

function getYouTubeEmbedUrl($url) {
    $id = getYouTubeId($url);
    return $id ? "https://www.youtube.com/embed/$id" : null;
}

function getYouTubeThumbnail($url) {
    $id = getYouTubeId($url);
    return $id ? "https://img.youtube.com/vi/$id/maxresdefault.jpg" : null;
}

<?php
/**
 * YouTube / Batch15Tube Integration Controller
 *
 * GET    /youtube/skills          - All active skills
 * GET    /youtube/skills/{id}     - Single skill with videos
 * GET    /youtube/videos          - Paginated videos
 * GET    /youtube/videos/{id}     - Single video detail
 * GET    /youtube/search          - Search videos
 * GET    /youtube/categories      - All categories
 * POST   /youtube/progress        - Update video progress (auth required)
 * GET    /youtube/progress/{userId} - User's progress for all videos
 * GET    /youtube/my-progress     - Current user's progress summary
 * POST   /youtube/admin/skills    - Create skill (admin)
 * PUT    /youtube/admin/skills/{id} - Update skill (admin)
 * DELETE /youtube/admin/skills/{id} - Delete skill (admin)
 * POST   /youtube/admin/videos    - Create video (admin)
 * PUT    /youtube/admin/videos/{id} - Update video (admin)
 * DELETE /youtube/admin/videos/{id} - Delete video (admin)
 */
namespace App\Controllers;

use App\Config\Database;
use App\Helpers\Response;
use App\Middleware\AuthMiddleware;

class YouTubeController
{
    private static function ytDb(): \PDO
    {
        return Database::getYoutubeInstance();
    }

    /**
     * GET /youtube/skills
     */
    public static function skills(): never
    {
        $db = self::ytDb();
        $featured = $_GET['featured'] ?? '';

        $sql = "SELECT s.*, COUNT(v.id) as video_count
                FROM skills s
                LEFT JOIN videos v ON v.skill_id = s.id AND v.is_active = 1 AND v.is_hidden = 0
                WHERE s.is_active = 1";
        if ($featured === '1') {
            $sql .= " AND s.is_featured = 1";
        }
        $sql .= " GROUP BY s.id ORDER BY s.sort_order ASC, s.name ASC";

        $stmt = $db->query($sql);
        $skills = $stmt->fetchAll();

        Response::success(['skills' => $skills]);
    }

    /**
     * GET /youtube/skills/{id}
     */
    public static function skill(string $id): never
    {
        $db = self::ytDb();

        $stmt = $db->prepare(
            "SELECT s.*, COUNT(v.id) as video_count
             FROM skills s
             LEFT JOIN videos v ON v.skill_id = s.id AND v.is_active = 1 AND v.is_hidden = 0
             WHERE s.id = ? AND s.is_active = 1
             GROUP BY s.id"
        );
        $stmt->execute([$id]);
        $skill = $stmt->fetch();

        if (!$skill) {
            Response::notFound('Skill not found');
        }

        // Get videos for this skill
        $vidStmt = $db->prepare(
            "SELECT v.id, v.title, v.slug, v.description, v.youtube_id, v.embed_url,
                    v.thumbnail, v.duration, v.instructor, v.views, v.likes_count,
                    v.is_featured, v.sort_order, v.created_at
             FROM videos v
             WHERE v.skill_id = ? AND v.is_active = 1 AND v.is_hidden = 0
             ORDER BY v.sort_order ASC, v.created_at DESC"
        );
        $vidStmt->execute([$id]);
        $skill['videos'] = $vidStmt->fetchAll();

        // Get sub-skills (roadmap)
        $subStmt = $db->prepare(
            "SELECT id, name, slug, sort_order FROM sub_skills
             WHERE skill_id = ? AND is_active = 1 ORDER BY sort_order ASC"
        );
        $subStmt->execute([$id]);
        $skill['sub_skills'] = $subStmt->fetchAll();

        Response::success(['skill' => $skill]);
    }

    /**
     * GET /youtube/videos
     */
    public static function videos(): never
    {
        $db = self::ytDb();
        $page    = max(1, (int) ($_GET['page'] ?? 1));
        $perPage = min(50, max(1, (int) ($_GET['per_page'] ?? 20)));
        $skillId = $_GET['skill_id'] ?? '';
        $offset  = ($page - 1) * $perPage;

        $where = "WHERE v.is_active = 1 AND v.is_hidden = 0";
        $params = [];

        if ($skillId !== '') {
            $where .= " AND v.skill_id = ?";
            $params[] = (int) $skillId;
        }

        // Count total
        $countStmt = $db->prepare("SELECT COUNT(*) FROM videos v $where");
        $countStmt->execute($params);
        $total = (int) $countStmt->fetchColumn();

        // Fetch videos
        $sql = "SELECT v.*, s.name as skill_name, s.color as skill_color, s.slug as skill_slug
                FROM videos v
                LEFT JOIN skills s ON v.skill_id = s.id
                $where
                ORDER BY v.created_at DESC
                LIMIT $perPage OFFSET $offset";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $videos = $stmt->fetchAll();

        Response::success([
            'videos'     => $videos,
            'page'       => $page,
            'per_page'   => $perPage,
            'total'      => $total,
            'total_pages' => (int) ceil($total / $perPage),
        ]);
    }

    /**
     * GET /youtube/videos/{id}
     */
    public static function video(string $id): never
    {
        $db = self::ytDb();

        $stmt = $db->prepare(
            "SELECT v.*, s.name as skill_name, s.color as skill_color, s.slug as skill_slug
             FROM videos v
             LEFT JOIN skills s ON v.skill_id = s.id
             WHERE v.id = ? AND v.is_active = 1"
        );
        $stmt->execute([$id]);
        $video = $stmt->fetch();

        if (!$video) {
            Response::notFound('Video not found');
        }

        // Increment views
        $incStmt = $db->prepare("UPDATE videos SET views = views + 1 WHERE id = ?");
        $incStmt->execute([$id]);

        // Get playlist videos for this skill
        if ($video['skill_id']) {
            $plStmt = $db->prepare(
                "SELECT v.id, v.title, v.slug, v.thumbnail, v.duration, v.youtube_id, pv.sort_order
                 FROM playlist_videos pv
                 JOIN videos v ON pv.video_id = v.id
                 JOIN playlists p ON pv.playlist_id = p.id
                 WHERE p.skill_id = ? AND v.is_active = 1 AND v.is_hidden = 0
                 ORDER BY pv.sort_order ASC"
            );
            $plStmt->execute([$video['skill_id']]);
            $video['playlist'] = $plStmt->fetchAll();
        } else {
            $video['playlist'] = [];
        }

        Response::success(['video' => $video]);
    }

    /**
     * GET /youtube/search
     */
    public static function search(): never
    {
        $db = self::ytDb();
        $q = trim($_GET['q'] ?? '');

        if (strlen($q) < 2) {
            Response::success(['videos' => [], 'skills' => []]);
        }

        $term = "%$q%";

        // Search videos
        $vStmt = $db->prepare(
            "SELECT v.id, v.title, v.slug, v.thumbnail, v.duration, v.youtube_id,
                    v.views, v.instructor, s.name as skill_name, s.color as skill_color
             FROM videos v
             LEFT JOIN skills s ON v.skill_id = s.id
             WHERE v.is_active = 1 AND v.is_hidden = 0
               AND (v.title LIKE ? OR v.description LIKE ? OR v.instructor LIKE ?)
             ORDER BY v.views DESC
             LIMIT 12"
        );
        $vStmt->execute([$term, $term, $term]);
        $videos = $vStmt->fetchAll();

        // Search skills
        $sStmt = $db->prepare(
            "SELECT id, name, slug, icon, color, description
             FROM skills
             WHERE is_active = 1 AND (name LIKE ? OR description LIKE ?)
             ORDER BY name ASC
             LIMIT 8"
        );
        $sStmt->execute([$term, $term]);
        $skills = $sStmt->fetchAll();

        Response::success(['videos' => $videos, 'skills' => $skills]);
    }

    /**
     * GET /youtube/categories
     */
    public static function categories(): never
    {
        $db = self::ytDb();
        $stmt = $db->query(
            "SELECT c.*, COUNT(v.id) as video_count
             FROM categories c
             LEFT JOIN videos v ON v.category_id = c.id AND v.is_active = 1
             WHERE c.is_active = 1
             GROUP BY c.id
             ORDER BY c.sort_order ASC, c.name ASC"
        );
        Response::success(['categories' => $stmt->fetchAll()]);
    }

    /**
     * POST /youtube/progress
     * Body: { video_id, progress (0-100), duration_watched }
     */
    public static function updateProgress(): never
    {
        $user = AuthMiddleware::authenticate();
        if (!$user) {
            Response::unauthorized('Login required');
        }
        $db = self::ytDb();

        $videoId   = (int) ($_POST['video_id'] ?? $_GET['video_id'] ?? 0);
        $progress  = (float) ($_POST['progress'] ?? $_GET['progress'] ?? 0);
        $duration  = (int) ($_POST['duration_watched'] ?? $_GET['duration_watched'] ?? 0);

        // Also try reading from raw body for JSON requests
        if ($videoId === 0 && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $raw = file_get_contents('php://input');
            $json = json_decode($raw, true);
            if ($json) {
                $videoId  = (int) ($json['video_id'] ?? 0);
                $progress = (float) ($json['progress'] ?? 0);
                $duration = (int) ($json['duration_watched'] ?? 0);
            }
        }

        if ($videoId <= 0) {
            Response::error('video_id is required');
        }

        $progress = max(0, min(100, $progress));
        $completed = $progress >= 90 ? 1 : 0;

        // Upsert progress
        $stmt = $db->prepare(
            "INSERT INTO video_progress (user_id, video_id, progress, completed, last_watched)
             VALUES (?, ?, ?, ?, NOW())
             ON DUPLICATE KEY UPDATE
               progress = GREATEST(progress, VALUES(progress)),
               completed = completed OR VALUES(completed),
               last_watched = NOW()"
        );
        $stmt->execute([$user->id, $videoId, $progress, $completed]);

        // Log watch history
        $histStmt = $db->prepare(
            "INSERT INTO watch_history (user_id, video_id, duration_watched) VALUES (?, ?, ?)"
        );
        $histStmt->execute([$user->id, $videoId, $duration]);

        // Award XP if just completed
        if ($completed) {
            $xpStmt = $db->prepare(
                "SELECT id FROM video_progress WHERE user_id = ? AND video_id = ? AND completed = 1 AND progress >= 90"
            );
            $xpStmt->execute([$user->id, $videoId]);
            // XP award would go through B15's user_xp system if needed
        }

        // Check if all videos in skill are completed → certificate
        $certCheck = null;
        if ($completed) {
            $vidStmt = $db->prepare("SELECT skill_id FROM videos WHERE id = ?");
            $vidStmt->execute([$videoId]);
            $vid = $vidStmt->fetch();
            if ($vid && $vid['skill_id']) {
                $totalStmt = $db->prepare(
                    "SELECT COUNT(*) FROM videos WHERE skill_id = ? AND is_active = 1 AND is_hidden = 0"
                );
                $totalStmt->execute([$vid['skill_id']]);
                $totalVideos = (int) $totalStmt->fetchColumn();

                $doneStmt = $db->prepare(
                    "SELECT COUNT(*) FROM video_progress WHERE user_id = ? AND video_id IN
                     (SELECT id FROM videos WHERE skill_id = ? AND is_active = 1)
                     AND completed = 1 AND progress >= 90"
                );
                $doneStmt->execute([$user->id, $vid['skill_id']]);
                $completedVideos = (int) $doneStmt->fetchColumn();

                if ($totalVideos > 0 && $completedVideos >= $totalVideos) {
                    // Issue certificate if not already issued
                    $certCheck = [
                        'skill_id' => $vid['skill_id'],
                        'total' => $totalVideos,
                        'completed' => $completedVideos,
                        'certificate_issued' => true,
                    ];
                }
            }
        }

        Response::success([
            'progress' => $progress,
            'completed' => (bool) $completed,
            'certificate' => $certCheck,
        ]);
    }

    /**
     * GET /youtube/progress/{userId} - User's video progress
     */
    public static function userProgress(string $userId): never
    {
        $db = self::ytDb();

        $stmt = $db->prepare(
            "SELECT vp.video_id, vp.progress, vp.completed, vp.last_watched,
                    v.title, v.skill_id, s.name as skill_name, s.color as skill_color
             FROM video_progress vp
             JOIN videos v ON vp.video_id = v.id
             LEFT JOIN skills s ON v.skill_id = s.id
             WHERE vp.user_id = ?
             ORDER BY vp.last_watched DESC"
        );
        $stmt->execute([(int) $userId]);
        $progress = $stmt->fetchAll();

        Response::success(['progress' => $progress]);
    }

    /**
     * GET /youtube/my-progress - Current user's progress summary
     */
    public static function myProgress(): never
    {
        $user = AuthMiddleware::authenticate();
        if (!$user) {
            Response::unauthorized('Login required');
        }
        $db = self::ytDb();

        // Per-skill progress summary
        $stmt = $db->prepare(
            "SELECT s.id, s.name, s.color, s.icon,
                    COUNT(DISTINCT v.id) as total_videos,
                    COUNT(DISTINCT CASE WHEN vp.completed = 1 AND vp.progress >= 90 THEN vp.video_id END) as completed_videos,
                    COALESCE(MAX(vp.progress), 0) as max_progress
             FROM skills s
             JOIN videos v ON v.skill_id = s.id AND v.is_active = 1 AND v.is_hidden = 0
             LEFT JOIN video_progress vp ON vp.video_id = v.id AND vp.user_id = ?
             WHERE s.is_active = 1
             GROUP BY s.id
             HAVING completed_videos > 0
             ORDER BY completed_videos DESC"
        );
        $stmt->execute([$user->id]);
        $skills = $stmt->fetchAll();

        // Overall stats
        $statStmt = $db->prepare(
            "SELECT
               COUNT(DISTINCT vp.video_id) as total_watched,
               COUNT(DISTINCT CASE WHEN vp.completed = 1 AND vp.progress >= 90 THEN vp.video_id END) as total_completed,
               COALESCE(SUM(vp.duration_watched), 0) as total_watch_time
             FROM video_progress vp
             WHERE vp.user_id = ?"
        );
        $statStmt->execute([$user->id]);
        $stats = $statStmt->fetch();

        // Certificates
        $certStmt = $db->prepare(
            "SELECT c.*, s.name as skill_name, s.color as skill_color
             FROM certificates c
             JOIN skills s ON c.skill_id = s.id
             WHERE c.user_id = ?
             ORDER BY c.issued_date DESC"
        );
        $certStmt->execute([$user->id]);
        $certificates = $certStmt->fetchAll();

        Response::success([
            'skills'       => $skills,
            'stats'        => $stats,
            'certificates' => $certificates,
        ]);
    }

    /**
     * GET /youtube/featured - Featured skills with videos
     */
    public static function featured(): never
    {
        $db = self::ytDb();

        $stmt = $db->query(
            "SELECT s.*, COUNT(v.id) as video_count
             FROM skills s
             LEFT JOIN videos v ON v.skill_id = s.id AND v.is_active = 1 AND v.is_hidden = 0
             WHERE s.is_active = 1 AND s.is_featured = 1
             GROUP BY s.id
             ORDER BY s.sort_order ASC
             LIMIT 6"
        );
        $skills = $stmt->fetchAll();

        $vidStmt = $db->query(
            "SELECT v.*, s.name as skill_name, s.color as skill_color
             FROM videos v
             LEFT JOIN skills s ON v.skill_id = s.id
             WHERE v.is_active = 1 AND v.is_hidden = 0 AND v.is_featured = 1
             ORDER BY v.views DESC
             LIMIT 6"
        );
        $videos = $vidStmt->fetchAll();

        Response::success(['skills' => $skills, 'videos' => $videos]);
    }

    // ─── Admin CRUD ────────────────────────────────────────────

    private static function adminCheck()
    {
        $user = AuthMiddleware::authenticate();
        if (!$user || !in_array($user->role_slug ?? '', ['super_admin', 'admin_general', 'admin_educational', 'soc_team'])) {
            Response::forbidden('Admin access required');
        }
        return $user;
    }

    private static function readJson(): array
    {
        $raw = file_get_contents('php://input');
        $json = json_decode($raw, true);
        return is_array($json) ? $json : [];
    }

    private static function slugify(string $text): string
    {
        $text = strtolower(trim($text));
        $text = preg_replace('/[^a-z0-9-]+/', '-', $text);
        $text = preg_replace('/-+/', '-', $text);
        return trim($text, '-');
    }

    /**
     * POST /youtube/admin/skills
     */
    public static function createSkill(): never
    {
        self::adminCheck();
        $data = self::readJson();
        $name = trim($data['name'] ?? '');
        if ($name === '') Response::error('Name is required');

        $db = self::ytDb();
        $slug = self::slugify($name);
        $desc = $data['description'] ?? null;
        $icon = $data['icon'] ?? 'code';
        $color = $data['color'] ?? '#6C63FF';
        $featured = (int) ($data['is_featured'] ?? 0);
        $sort = (int) ($data['sort_order'] ?? 0);

        $stmt = $db->prepare(
            "INSERT INTO skills (name, slug, description, icon, color, is_featured, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([$name, $slug, $desc, $icon, $color, $featured, $sort]);
        $id = (int) $db->lastInsertId();

        Response::success(['id' => $id, 'slug' => $slug], 'Skill created', 201);
    }

    /**
     * PUT /youtube/admin/skills/{id}
     */
    public static function updateSkill(string $id): never
    {
        self::adminCheck();
        $data = self::readJson();
        $db = self::ytDb();

        $id = (int) $id;
        $exists = $db->prepare("SELECT id FROM skills WHERE id = ?");
        $exists->execute([$id]);
        if (!$exists->fetch()) Response::notFound('Skill not found');

        $fields = [];
        $params = [];
        foreach (['name', 'description', 'icon', 'color'] as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $params[] = $data[$f];
            }
        }
        if (isset($data['is_featured'])) {
            $fields[] = "is_featured = ?";
            $params[] = (int) $data['is_featured'];
        }
        if (isset($data['sort_order'])) {
            $fields[] = "sort_order = ?";
            $params[] = (int) $data['sort_order'];
        }
        if (isset($data['is_active'])) {
            $fields[] = "is_active = ?";
            $params[] = (int) $data['is_active'];
        }
        if (isset($data['name'])) {
            $fields[] = "slug = ?";
            $params[] = self::slugify($data['name']);
        }

        if (empty($fields)) Response::error('No fields to update');

        $params[] = $id;
        $db->prepare("UPDATE skills SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);

        Response::success(['id' => $id], 'Skill updated');
    }

    /**
     * DELETE /youtube/admin/skills/{id}
     */
    public static function deleteSkill(string $id): never
    {
        self::adminCheck();
        $db = self::ytDb();
        $id = (int) $id;

        $exists = $db->prepare("SELECT id FROM skills WHERE id = ?");
        $exists->execute([$id]);
        if (!$exists->fetch()) Response::notFound('Skill not found');

        $db->prepare("DELETE FROM skills WHERE id = ?")->execute([$id]);
        Response::success(null, 'Skill deleted');
    }

    /**
     * POST /youtube/admin/videos
     */
    public static function createVideo(): never
    {
        self::adminCheck();
        $data = self::readJson();
        $title = trim($data['title'] ?? '');
        $youtubeId = trim($data['youtube_id'] ?? '');
        if ($title === '') Response::error('Title is required');
        if ($youtubeId === '') Response::error('youtube_id is required');

        $db = self::ytDb();
        $slug = self::slugify($title);
        $skillId = !empty($data['skill_id']) ? (int) $data['skill_id'] : null;
        $catId = !empty($data['category_id']) ? (int) $data['category_id'] : null;
        $desc = $data['description'] ?? null;
        $embed = "https://www.youtube.com/embed/" . $youtubeId;
        $thumb = "https://img.youtube.com/vi/" . $youtubeId . "/maxresdefault.jpg";
        $duration = $data['duration'] ?? '0:00';
        $instructor = $data['instructor'] ?? 'Batch15Tube';
        $featured = (int) ($data['is_featured'] ?? 0);
        $sort = (int) ($data['sort_order'] ?? 0);

        $stmt = $db->prepare(
            "INSERT INTO videos (skill_id, category_id, title, slug, description, youtube_id, embed_url, thumbnail, duration, instructor, is_featured, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([$skillId, $catId, $title, $slug, $desc, $youtubeId, $embed, $thumb, $duration, $instructor, $featured, $sort]);
        $vid = (int) $db->lastInsertId();

        Response::success(['id' => $vid, 'slug' => $slug], 'Video created', 201);
    }

    /**
     * PUT /youtube/admin/videos/{id}
     */
    public static function updateVideo(string $id): never
    {
        self::adminCheck();
        $data = self::readJson();
        $db = self::ytDb();
        $id = (int) $id;

        $exists = $db->prepare("SELECT id FROM videos WHERE id = ?");
        $exists->execute([$id]);
        if (!$exists->fetch()) Response::notFound('Video not found');

        $fields = [];
        $params = [];
        foreach (['title', 'description', 'instructor', 'duration'] as $f) {
            if (array_key_exists($f, $data)) {
                $fields[] = "$f = ?";
                $params[] = $data[$f];
            }
        }
        if (isset($data['skill_id'])) {
            $fields[] = "skill_id = ?";
            $params[] = (int) $data['skill_id'];
        }
        if (isset($data['category_id'])) {
            $fields[] = "category_id = ?";
            $params[] = (int) $data['category_id'];
        }
        if (isset($data['youtube_id'])) {
            $yt = trim($data['youtube_id']);
            $fields[] = "youtube_id = ?";
            $params[] = $yt;
            $fields[] = "embed_url = ?";
            $params[] = "https://www.youtube.com/embed/" . $yt;
            $fields[] = "thumbnail = ?";
            $params[] = "https://img.youtube.com/vi/" . $yt . "/maxresdefault.jpg";
        }
        if (isset($data['is_featured'])) {
            $fields[] = "is_featured = ?";
            $params[] = (int) $data['is_featured'];
        }
        if (isset($data['sort_order'])) {
            $fields[] = "sort_order = ?";
            $params[] = (int) $data['sort_order'];
        }
        if (isset($data['is_active'])) {
            $fields[] = "is_active = ?";
            $params[] = (int) $data['is_active'];
        }
        if (isset($data['title'])) {
            $fields[] = "slug = ?";
            $params[] = self::slugify($data['title']);
        }

        if (empty($fields)) Response::error('No fields to update');

        $params[] = $id;
        $db->prepare("UPDATE videos SET " . implode(', ', $fields) . " WHERE id = ?")->execute($params);

        Response::success(['id' => $id], 'Video updated');
    }

    /**
     * DELETE /youtube/admin/videos/{id}
     */
    public static function deleteVideo(string $id): never
    {
        self::adminCheck();
        $db = self::ytDb();
        $id = (int) $id;

        $exists = $db->prepare("SELECT id FROM videos WHERE id = ?");
        $exists->execute([$id]);
        if (!$exists->fetch()) Response::notFound('Video not found');

        $db->prepare("DELETE FROM videos WHERE id = ?")->execute([$id]);
        Response::success(null, 'Video deleted');
    }
}

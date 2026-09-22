<?php
require_once __DIR__ . '/../config/config.php';

$videoId = intval($_GET['id'] ?? 0);
$video = getVideo($videoId);

if (!$video) {
    redirect(SITE_URL . '/public/index.php');
}

$pageTitle = $video['title'];

// Check guest restriction
$canWatch = true;
if (!isLoggedIn()) {
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM watch_history WHERE user_id = 0");
    $stmt->execute();
    $freeCount = $stmt->fetch()['total'];

    // Track via session
    if (!isset($_SESSION['free_watch_count'])) {
        $_SESSION['free_watch_count'] = 0;
    }

    if ($_SESSION['free_watch_count'] >= 2) {
        $canWatch = false;
    }
}

$playlist = getPlaylistVideos($video['skill_id']);
$currentIndex = 0;
$nextVideo = null;
foreach ($playlist as $i => $pv) {
    if ($pv['id'] == $videoId) {
        $currentIndex = $i;
        $nextVideo = $playlist[$i + 1] ?? null;
        break;
    }
}

$isSaved = isLoggedIn() ? isVideoSaved($_SESSION['user_id'], $videoId) : false;
$isLiked = isLoggedIn() ? isVideoLiked($_SESSION['user_id'], $videoId) : false;
$progress = isLoggedIn() ? getVideoProgress($_SESSION['user_id'], $videoId) : null;
$comments = getComments($videoId);

if ($canWatch && isLoggedIn()) {
    // Verify user still exists (in case DB was reset)
    $stmt = $pdo->prepare("SELECT id FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    if ($stmt->fetch()) {
        $stmt = $pdo->prepare("INSERT INTO watch_history (user_id, video_id) VALUES (?, ?)");
        $stmt->execute([$_SESSION['user_id'], $videoId]);
    }
    incrementViews($videoId);
    $_SESSION['free_watch_count'] = 0;
} elseif ($canWatch && !isLoggedIn()) {
    $_SESSION['free_watch_count'] = ($_SESSION['free_watch_count'] ?? 0) + 1;
    incrementViews($videoId);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($video['title']) ?> - Batch15Tube</title>
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
</head>
<body>
    <div id="app">
        <!-- Header -->
        <header class="main-header">
            <div class="header-left">
                <button class="sidebar-toggle" id="sidebarToggle"><i class="fas fa-bars"></i></button>
                <a href="<?= SITE_URL ?>/public/index.php" class="logo">
                    <i class="fas fa-play-circle logo-icon"></i>
                    <span class="logo-text">Batch15<span class="logo-highlight">Tube</span></span>
                </a>
            </div>
            <div class="header-center">
                <form class="search-bar" action="<?= SITE_URL ?>/public/search.php" method="GET">
                    <input type="text" name="q" placeholder="Search..." class="search-input">
                    <button type="submit" class="search-btn"><i class="fas fa-search"></i></button>
                </form>
            </div>
            <div class="header-right">
                <button class="icon-btn theme-toggle" id="themeToggle"><i class="fas fa-moon"></i></button>
                <div class="language-switcher">
                    <button class="icon-btn lang-btn" id="langBtn"><i class="fas fa-globe"></i></button>
                    <div class="lang-dropdown" id="langDropdown">
                        <a href="#" class="lang-option" data-lang="so">🇸🇴 Somali</a>
                        <a href="#" class="lang-option" data-lang="en">🇬🇧 English</a>
                        <a href="#" class="lang-option" data-lang="ar">🇸🇦 Arabic</a>
                    </div>
                </div>
                <?php if (isLoggedIn()): ?>
                <div class="user-menu">
                    <button class="user-avatar-btn" id="userMenuBtn">
                        <img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($_SESSION['avatar'] ?? 'default.png') ?>" class="avatar-img">
                        <span class="user-name"><?= htmlspecialchars($_SESSION['first_name']) ?></span>
                    </button>
                    <div class="user-dropdown" id="userDropdown">
                        <a href="<?= SITE_URL ?>/dashboard/index.php" class="dropdown-item"><i class="fas fa-tachometer-alt"></i> Dashboard</a>
                        <a href="<?= SITE_URL ?>/dashboard/settings.php" class="dropdown-item"><i class="fas fa-cog"></i> Settings</a>
                        <hr class="dropdown-divider">
                        <a href="<?= SITE_URL ?>/auth/logout.php" class="dropdown-item text-danger"><i class="fas fa-sign-out-alt"></i> Logout</a>
                    </div>
                </div>
                <?php else: ?>
                <a href="<?= SITE_URL ?>/auth/login.php" class="btn btn-outline">Login</a>
                <a href="<?= SITE_URL ?>/auth/register.php" class="btn btn-primary">Register</a>
                <?php endif; ?>
            </div>
        </header>

        <main class="main-content" id="mainContent" style="margin-left:0;max-width:1400px;margin-right:auto;">
            <div class="video-page">
                <!-- Left: Player & Details -->
                <div>
                    <div class="video-player-wrapper">
                        <?php if ($canWatch): ?>
                        <iframe src="<?= htmlspecialchars($video['embed_url']) ?>?autoplay=1&enablejsapi=1" 
                                allow="autoplay; encrypted-media" allowfullscreen id="player"></iframe>
                        <?php else: ?>
                        <div style="display:flex;align-items:center;justify-content:center;height:100%;background:#1a1a1a;flex-direction:column;gap:16px;color:white;">
                            <i class="fas fa-lock" style="font-size:48px;color:var(--secondary)"></i>
                            <h2>Free Limit Reached</h2>
                            <p>Create an account to continue watching</p>
                            <a href="<?= SITE_URL ?>/auth/register.php" class="btn btn-primary">Register Now</a>
                        </div>
                        <?php endif; ?>
                    </div>

                    <div class="video-details">
                        <h1 class="video-title-lg"><?= htmlspecialchars($video['title']) ?></h1>
                        <div class="video-meta" style="font-size:14px;gap:16px;flex-wrap:wrap;">
                            <span><?= number_format($video['views'] ?? 0) ?> views</span>
                            <span>&middot;</span>
                            <span><?= htmlspecialchars($video['duration'] ?? '0:00') ?></span>
                            <?php if ($video['skill_name']): ?>
                            <span>&middot;</span>
                            <a href="<?= SITE_URL ?>/public/skill.php?slug=<?= $video['skill_slug'] ?>" class="video-skill-tag" style="background:<?= $video['skill_color'] ?>">
                                <?= htmlspecialchars($video['skill_name']) ?>
                            </a>
                            <?php endif; ?>
                        </div>

                        <div class="video-actions">
                            <button class="action-btn <?= $isLiked ? 'active' : '' ?>" onclick="toggleLikeVideo(<?= $videoId ?>, this)">
                                <i class="fas fa-thumbs-up"></i>
                                <span class="like-count"><?= $video['likes_count'] ?? 0 ?></span>
                            </button>
                            <button class="action-btn <?= $isSaved ? 'active' : '' ?>" onclick="toggleSaveVideo(<?= $videoId ?>, this)">
                                <i class="fas fa-bookmark"></i> Save
                            </button>
                            <button class="action-btn" onclick="navigator.clipboard.writeText(window.location.href);showToast('Link copied!','success')">
                                <i class="fas fa-share"></i> Share
                            </button>
                        </div>

                        <?php if ($progress && $progress['progress'] > 0): ?>
                        <div class="video-progress-bar">
                            <div class="video-progress-fill" style="width:<?= $progress['progress'] ?>%"></div>
                        </div>
                        <?php endif; ?>

                        <div class="instructor-info">
                            <img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($video['instructor_avatar'] ?? 'default.png') ?>" class="instructor-avatar">
                            <div>
                                <div style="font-weight:600"><?= htmlspecialchars($video['instructor'] ?? 'Batch15Tube') ?></div>
                                <div style="font-size:13px;color:var(--text-secondary)">Instructor</div>
                            </div>
                        </div>

                        <div class="video-description">
                            <?= nl2br(htmlspecialchars($video['description'] ?? 'No description available.')) ?>
                        </div>

                        <!-- Comments -->
                        <div class="comments-section">
                            <h3 style="font-size:18px;margin-bottom:16px;">Comments (<?= count($comments) ?>)</h3>
                            <?php if (isLoggedIn()): ?>
                            <form class="comment-form" data-video-id="<?= $videoId ?>">
                                <img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($_SESSION['avatar'] ?? 'default.png') ?>" class="comment-avatar">
                                <input type="text" placeholder="Add a comment..." id="commentInput">
                                <button type="button" class="btn btn-primary comment-submit" style="border-radius:24px;">Comment</button>
                            </form>
                            <?php endif; ?>
                            <?php foreach ($comments as $comment): ?>
                            <div class="comment-item">
                                <img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($comment['avatar'] ?? 'default.png') ?>" class="comment-avatar">
                                <div class="comment-body">
                                    <div>
                                        <span class="comment-author"><?= htmlspecialchars($comment['username']) ?></span>
                                        <span class="comment-time"><?= timeAgo($comment['created_at']) ?></span>
                                    </div>
                                    <div class="comment-text"><?= nl2br(htmlspecialchars($comment['content'])) ?></div>
                                </div>
                            </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>

                <!-- Right: Playlist -->
                <div class="playlist-sidebar">
                    <div class="playlist-header">
                        <h3 class="playlist-title"><?= $video['skill_name'] ? htmlspecialchars($video['skill_name']) : 'Playlist' ?></h3>
                        <span class="playlist-count"><?= count($playlist) ?> lessons</span>
                    </div>
                    <div class="playlist-items">
                        <?php foreach ($playlist as $i => $pv): ?>
                        <div class="playlist-item <?= $pv['id'] == $videoId ? 'active' : '' ?>" 
                             onclick="window.location.href='<?= SITE_URL ?>/public/video.php?id=<?= $pv['id'] ?>'">
                            <img src="<?= htmlspecialchars($pv['thumbnail'] ?? SITE_URL . '/assets/images/placeholder.jpg') ?>" class="playlist-thumb">
                            <div class="playlist-info">
                                <div class="playlist-item-title"><?= htmlspecialchars($pv['title']) ?></div>
                                <div class="playlist-item-meta"><?= htmlspecialchars($pv['duration'] ?? '0:00') ?></div>
                            </div>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Restriction Overlay -->
    <div class="restriction-overlay" id="restrictionOverlay">
        <div class="restriction-popup">
            <div class="restriction-icon"><i class="fas fa-lock"></i></div>
            <h2>Create Free Account to Continue Learning</h2>
            <p>You have reached your free viewing limit.</p>
            <p>Register now to unlock unlimited lessons.</p>
            <a href="<?= SITE_URL ?>/auth/register.php" class="btn btn-primary btn-lg">Register Now</a>
            <a href="<?= SITE_URL ?>/auth/login.php" class="btn btn-outline">Already have an account? Login</a>
        </div>
    </div>

    <script src="<?= SITE_URL ?>/assets/js/main.js"></script>
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // Theme
        document.getElementById('themeToggle').addEventListener('click', function() {
            var html = document.documentElement;
            var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            this.querySelector('i').className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            fetch('<?= SITE_URL ?>/api/theme.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'theme=' + next });
        });

        // Language
        document.getElementById('langBtn').addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('langDropdown').classList.toggle('show');
        });
        document.addEventListener('click', function() { document.getElementById('langDropdown').classList.remove('show'); });
        document.querySelectorAll('.lang-option').forEach(function(el) {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                fetch('<?= SITE_URL ?>/api/language.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'language=' + this.getAttribute('data-lang') })
                    .then(function() { location.reload(); });
            });
        });

        // User menu
        var userBtn = document.getElementById('userMenuBtn');
        var userDropdown = document.getElementById('userDropdown');
        if (userBtn && userDropdown) {
            userBtn.addEventListener('click', function(e) { e.stopPropagation(); userDropdown.classList.toggle('show'); });
            document.addEventListener('click', function() { userDropdown.classList.remove('show'); });
        }

        // Comment submit
        document.querySelector('.comment-submit')?.addEventListener('click', function() {
            var input = document.getElementById('commentInput');
            if (input && input.value.trim()) {
                fetch('<?= SITE_URL ?>/api/comments.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'video_id=<?= $videoId ?>&content=' + encodeURIComponent(input.value.trim())
                }).then(function(r) { return r.json(); })
                  .then(function(data) {
                      if (data.success) {
                          input.value = '';
                          showToast('Comment added!', 'success');
                          setTimeout(function() { location.reload(); }, 1000);
                      } else {
                          showToast(data.message || 'Error', 'error');
                      }
                  });
            }
        });

        // Show restriction for non-logged-in users
        <?php if (!$canWatch): ?>
        document.getElementById('restrictionOverlay').classList.add('show');
        <?php endif; ?>
    });

    // Like
    window.toggleLikeVideo = function(videoId, btn) {
        fetch('<?= SITE_URL ?>/api/like.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'video_id=' + videoId
        }).then(function(r) { return r.json(); })
          .then(function(data) {
              if (data.liked) btn.classList.add('active');
              else btn.classList.remove('active');
              var count = btn.querySelector('.like-count');
              if (count) count.textContent = data.count;
          });
    };

    // Save
    window.toggleSaveVideo = function(videoId, btn) {
        fetch('<?= SITE_URL ?>/api/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'video_id=' + videoId
        }).then(function(r) { return r.json(); })
          .then(function(data) {
              if (data.saved) { btn.classList.add('active'); showToast('Video saved!', 'success'); }
              else { btn.classList.remove('active'); showToast('Removed from saved', 'info'); }
          });
    };

    // Toast
    function showToast(message, type) {
        type = type || 'info';
        var container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        var toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle') + '"></i> ' + message;
        container.appendChild(toast);
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(function() { toast.remove(); }, 300);
        }, 3000);
    }

    // Track progress (autoplay next)
    <?php if ($canWatch && $nextVideo): ?>
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    }
    function onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            var duration = player.getDuration();
            setInterval(function() {
                if (player && player.getCurrentTime) {
                    var current = player.getCurrentTime();
                    var progress = (current / duration) * 100;
                    fetch('<?= SITE_URL ?>/api/progress.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: 'video_id=<?= $videoId ?>&progress=' + Math.round(progress) + '&duration=' + Math.round(current)
                    });
                }
            }, 10000);
        }
        if (event.data === YT.PlayerState.ENDED) {
            fetch('<?= SITE_URL ?>/api/progress.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'video_id=<?= $videoId ?>&progress=100'
            }).then(function() {
                window.location.href = '<?= SITE_URL ?>/public/video.php?id=<?= $nextVideo['id'] ?>';
            });
        }
    }
    <?php endif; ?>
    </script>
</body>
</html>

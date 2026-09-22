<?php
require_once __DIR__ . '/config/config.php';

if (isLoggedIn()) {
    redirect(SITE_URL . '/public/index.php');
}

$skills = getSkills();
$skillCount = count($skills);
$videoCount = 0;
try {
    $stmt = $pdo->query("SELECT COUNT(*) FROM videos WHERE is_active = 1 AND is_hidden = 0");
    $videoCount = (int)$stmt->fetchColumn();
} catch (Exception $e) { $videoCount = 500; }

// Get skills with video thumbnails
$skillCards = [];
try {
    $stmt = $pdo->query("
        SELECT s.*, 
               (SELECT v.thumbnail FROM videos v WHERE v.skill_id = s.id AND v.is_active = 1 LIMIT 1) as video_thumbnail,
               (SELECT v.youtube_id FROM videos v WHERE v.skill_id = s.id AND v.is_active = 1 LIMIT 1) as youtube_id
        FROM skills s 
        WHERE s.is_active = 1 
        ORDER BY s.sort_order ASC, s.name ASC
    ");
    $skillCards = $stmt->fetchAll();
} catch (Exception $e) { $skillCards = $skills; }

// Fetch recent videos for homepage preview
$recentVideos = [];
try {
    $stmt = $pdo->query("SELECT v.*, s.name as skill_name, s.color as skill_color 
                          FROM videos v 
                          LEFT JOIN skills s ON v.skill_id = s.id 
                          WHERE v.is_active = 1 AND v.is_hidden = 0 
                          ORDER BY RAND() LIMIT 8");
    $recentVideos = $stmt->fetchAll();
} catch (Exception $e) { $recentVideos = []; }

// Get admin info for footer profile
$adminInfo = null;
try {
    $stmt = $pdo->query("SELECT full_name, avatar, role FROM admins WHERE is_active = 1 LIMIT 1");
    $adminInfo = $stmt->fetch();
} catch (Exception $e) { $adminInfo = null; }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Batch15Tube - Learn IT & Computer Science</title>
    <meta name="description" content="Free educational video platform for IT and Computer Science students. Learn programming, cybersecurity, cloud computing and more.">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/style.css">
    <link rel="stylesheet" href="<?= SITE_URL ?>/assets/css/responsive.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:var(--bg-primary); color:var(--text-primary); font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif; overflow-x:hidden; }
        .hero { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:40px 20px; position:relative; overflow:hidden; background:linear-gradient(135deg,#0f0f1a 0%,#1a1a3e 30%,#0f3460 60%,#1a1a2e 100%); color:#fff; }
        .hero::before { content:''; position:absolute; width:800px; height:800px; border-radius:50%; background:radial-gradient(circle,rgba(108,99,255,0.12) 0%,transparent 60%); top:-300px; right:-200px; animation:heroGlow 8s ease-in-out infinite alternate; }
        .hero::after { content:''; position:absolute; width:500px; height:500px; border-radius:50%; background:radial-gradient(circle,rgba(255,101,132,0.08) 0%,transparent 60%); bottom:-150px; left:-150px; animation:heroGlow 10s ease-in-out infinite alternate-reverse; }
        @keyframes heroGlow { 0%{transform:scale(1) translate(0,0)} 100%{transform:scale(1.1) translate(30px,-30px)} }
        .hero-content { position:relative; z-index:2; max-width:900px; }
        .hero-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(108,99,255,0.15); border:1px solid rgba(108,99,255,0.3); padding:6px 18px; border-radius:20px; font-size:13px; font-weight:600; color:#8B85FF; margin-bottom:24px; animation:fadeInUp 0.6s ease; }
        .hero-logo { font-size:72px; font-weight:900; margin-bottom:16px; animation:fadeInUp 0.6s ease 0.1s both; }
        .hero-logo i { color:#6C63FF; } .hero-logo span { color:#6C63FF; }
        .hero-tagline { font-size:22px; opacity:0.9; margin-bottom:36px; line-height:1.6; animation:fadeInUp 0.6s ease 0.2s both; }
        .hero-buttons { display:flex; gap:16px; flex-wrap:wrap; justify-content:center; animation:fadeInUp 0.6s ease 0.3s both; }
        .hero-btn { display:inline-flex; align-items:center; gap:10px; padding:16px 36px; border-radius:12px; font-size:16px; font-weight:600; text-decoration:none; transition:all 0.3s ease; cursor:pointer; }
        .hero-btn-primary { background:#6C63FF; color:#fff; }
        .hero-btn-primary:hover { background:#5A52D5; transform:translateY(-3px); box-shadow:0 8px 25px rgba(108,99,255,0.4); }
        .hero-btn-outline { border:2px solid rgba(255,255,255,0.25); color:#fff; background:transparent; }
        .hero-btn-outline:hover { border-color:#6C63FF; background:rgba(108,99,255,0.1); transform:translateY(-3px); }
        .hero-btn-dashboard { background:linear-gradient(135deg,#FF6584,#FF4500); color:#fff; }
        .hero-btn-dashboard:hover { transform:translateY(-3px); box-shadow:0 8px 25px rgba(255,101,132,0.4); }
        .floating-shapes { position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:1; }
        .shape { position:absolute; border-radius:50%; opacity:0.05; animation:floatShape 15s infinite; }
        .shape:nth-child(1) { width:120px;height:120px;background:#6C63FF;top:15%;left:10%;animation-duration:18s; }
        .shape:nth-child(2) { width:80px;height:80px;background:#FF6584;top:60%;left:80%;animation-duration:14s;animation-delay:-2s; }
        .shape:nth-child(3) { width:60px;height:60px;background:#00D9A6;top:30%;left:70%;animation-duration:20s;animation-delay:-5s; }
        .shape:nth-child(4) { width:150px;height:150px;background:#FF9900;top:70%;left:20%;animation-duration:16s;animation-delay:-8s; }
        .shape:nth-child(5) { width:40px;height:40px;background:#FF2D20;top:10%;left:50%;animation-duration:12s;animation-delay:-3s; }
        @keyframes floatShape { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(40px,-40px) scale(1.1)} 66%{transform:translate(-20px,20px) scale(0.9)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .stats-row { display:flex; gap:48px; margin-top:48px; animation:fadeInUp 0.6s ease 0.4s both; justify-content:center; }
        .stat-item { text-align:center; }
        .stat-value { font-size:38px; font-weight:800; background:linear-gradient(135deg,#6C63FF,#FF6584); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
        .stat-label { font-size:14px; opacity:0.6; margin-top:4px; }
        .topbar { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:16px 32px; background:rgba(15,15,26,0.9); backdrop-filter:blur(10px); border-bottom:1px solid rgba(255,255,255,0.06); }
        .topbar-logo { font-size:22px; font-weight:800; color:#fff; text-decoration:none; display:flex; align-items:center; gap:8px; }
        .topbar-logo i { color:#6C63FF; }
        .topbar-links { display:flex; gap:12px; align-items:center; }
        .topbar-link { color:rgba(255,255,255,0.7); text-decoration:none; font-size:14px; font-weight:500; padding:6px 14px; border-radius:8px; transition:all 0.2s; }
        .topbar-link:hover { color:#fff; background:rgba(255,255,255,0.06); }
        .topbar-btn { padding:8px 20px; border-radius:8px; font-size:13px; font-weight:600; text-decoration:none; transition:all 0.2s; }
        .topbar-btn-primary { background:#6C63FF; color:#fff; }
        .topbar-btn-primary:hover { background:#5A52D5; }
        .topbar-btn-outline { border:1px solid rgba(255,255,255,0.2); color:#fff; }
        .topbar-btn-outline:hover { border-color:#6C63FF; }
        .section { padding:80px 24px; max-width:1200px; margin:0 auto; }
        .section-header { text-align:center; margin-bottom:48px; }
        .section-title { font-size:32px; font-weight:800; }
        .section-subtitle { color:var(--text-secondary); margin-top:8px; font-size:16px; }
        .features-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:24px; }
        .feature-card { background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:36px 28px; text-align:center; transition:all 0.4s ease; position:relative; overflow:hidden; }
        .feature-card::before { content:''; position:absolute; top:0;left:0;right:0;height:3px; background:linear-gradient(90deg,#6C63FF,#FF6584,#00D9A6); transform:scaleX(0); transition:transform 0.4s ease; }
        .feature-card:hover::before { transform:scaleX(1); }
        .feature-card:hover { transform:translateY(-6px); box-shadow:0 12px 32px rgba(0,0,0,0.1); }
        .feature-icon { font-size:42px; color:#6C63FF; margin-bottom:20px; display:inline-block; background:linear-gradient(135deg,#6C63FF22,#FF658422); padding:16px; border-radius:16px; }
        .feature-title { font-size:18px; font-weight:700; margin-bottom:10px; }
        .feature-desc { font-size:14px; color:var(--text-secondary); line-height:1.7; }
        .skills-section { background:var(--bg-secondary); padding:80px 24px; text-align:center; }
        .skills-cloud { display:flex; flex-wrap:wrap; gap:12px; justify-content:center; max-width:1000px; margin:36px auto 0; }
        .skill-pill { padding:10px 22px; border-radius:24px; color:#fff; font-size:13px; font-weight:600; text-decoration:none; transition:all 0.3s ease; display:inline-flex; align-items:center; gap:8px; }
        .skill-pill:hover { transform:scale(1.06) translateY(-2px); box-shadow:0 4px 16px rgba(0,0,0,0.2); }
        .skill-pill i { font-size:12px; opacity:0.8; }
        .skills-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:20px; margin:36px auto 0; max-width:1100px; }
        .skill-card-vid { background:var(--bg-card); border:1px solid var(--border-color); border-radius:14px; overflow:hidden; text-decoration:none; color:var(--text-primary); transition:all 0.3s ease; display:block; }
        .skill-card-vid:hover { transform:translateY(-5px); box-shadow:0 10px 30px rgba(0,0,0,0.12); }
        .skill-card-thumb { width:100%; height:120px; object-fit:cover; display:block; background:var(--bg-tertiary); }
        .skill-card-body { padding:14px 16px; display:flex; align-items:center; gap:10px; }
        .skill-card-icon-sm { width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#fff;flex-shrink:0; }
        .skill-card-name { font-size:13px; font-weight:600; }
        .cta-section { padding:80px 24px; text-align:center; background:linear-gradient(135deg,#1a1a3e,#0f3460); color:#fff; }
        .cta-title { font-size:36px; font-weight:800; margin-bottom:12px; }
        .cta-subtitle { font-size:18px; opacity:0.8; margin-bottom:32px; }
        .testimonials-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:24px; }
        .testimonial-card { background:var(--bg-card); border:1px solid var(--border-color); border-radius:16px; padding:32px; text-align:left; }
        .testimonial-stars { color:#FFD700; margin-bottom:12px; font-size:14px; }
        .testimonial-text { font-size:14px; line-height:1.7; color:var(--text-secondary); margin-bottom:20px; font-style:italic; }
        .testimonial-author { display:flex; align-items:center; gap:12px; }
        .testimonial-avatar { width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#6C63FF,#FF6584);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px; }
        .testimonial-name { font-weight:600; font-size:14px; }
        .testimonial-role { font-size:12px; color:var(--text-secondary); }
        .footer { background:var(--bg-secondary); border-top:1px solid var(--border-color); padding:48px 24px 32px; }
        .footer-inner { max-width:1200px; margin:0 auto; }
        .footer-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:32px; margin-bottom:32px; }
        .footer-col-title { font-weight:700; font-size:14px; margin-bottom:16px; text-transform:uppercase; letter-spacing:1px; color:var(--text-secondary); }
        .footer-col a { display:block; color:var(--text-primary); text-decoration:none; font-size:14px; padding:4px 0; transition:color 0.2s; }
        .footer-col a:hover { color:#6C63FF; }
        .footer-bottom { text-align:center; padding-top:24px; border-top:1px solid var(--border-color); font-size:13px; color:var(--text-secondary); }
        .dashboard-preview { background:var(--bg-card); border:1px solid var(--border-color); border-radius:20px; padding:60px 40px; text-align:center; margin-top:60px; }
        .dashboard-preview-title { font-size:28px; font-weight:800; margin-bottom:12px; }
        .dashboard-preview-desc { font-size:16px; color:var(--text-secondary); margin-bottom:28px; }
        .dashboard-preview-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; max-width:600px; margin:0 auto; }
        .dashboard-preview-item { background:var(--bg-secondary); border-radius:12px; padding:20px 12px; text-align:center; }
        .dashboard-preview-item i { font-size:24px; color:#6C63FF; margin-bottom:8px; }
        .dashboard-preview-item span { display:block; font-size:12px; color:var(--text-secondary); }
        .wave-divider { position:relative; height:80px; overflow:hidden; margin-top:-2px; }
        .wave-divider svg { position:absolute; bottom:0; width:100%; height:80px; }
        @media (max-width:768px) { .hero-logo{font-size:42px} .hero-tagline{font-size:18px} .stats-row{gap:24px} .stat-value{font-size:28px} .section-title{font-size:24px} .cta-title{font-size:24px} .topbar{padding:12px 16px} .topbar-links{gap:6px} .dashboard-preview-grid{grid-template-columns:repeat(2,1fr)} }
    </style>
</head>
<body>
    <!-- Top Navigation Bar -->
    <nav class="topbar">
        <a href="<?= SITE_URL ?>/" class="topbar-logo">
            <i class="fas fa-play-circle"></i> Batch15<span style="color:#6C63FF;">Tube</span>
        </a>
        <div class="topbar-links">
            <a href="<?= SITE_URL ?>/public/index.php" class="topbar-link"><i class="fas fa-th-large"></i> Dashboard</a>
            <a href="<?= SITE_URL ?>/public/skills.php" class="topbar-link"><i class="fas fa-code"></i> Skills</a>
            <a href="<?= SITE_URL ?>/public/explore.php" class="topbar-link"><i class="fas fa-compass"></i> Explore</a>
            <a href="<?= SITE_URL ?>/auth/login.php" class="topbar-btn topbar-btn-outline">Login</a>
            <a href="<?= SITE_URL ?>/auth/register.php" class="topbar-btn topbar-btn-primary">Register</a>
        </div>
    </nav>

    <!-- Hero -->
    <section class="hero">
        <div class="floating-shapes">
            <div class="shape"></div><div class="shape"></div><div class="shape"></div><div class="shape"></div><div class="shape"></div>
        </div>
        <div class="hero-content">
            <div class="hero-badge"><i class="fas fa-sparkles"></i> Free Educational Platform</div>
            <div class="hero-logo"><i class="fas fa-play-circle"></i> Batch15<span>Tube</span></div>
            <p class="hero-tagline">Master IT &amp; Computer Science with free video courses.<br>Learn programming, cybersecurity, cloud computing, and more.</p>
            <div class="hero-buttons">
                <a href="<?= SITE_URL ?>/public/index.php" class="hero-btn hero-btn-dashboard">
                    <i class="fas fa-th-large"></i> Go to Dashboard
                </a>
                <a href="<?= SITE_URL ?>/auth/register.php" class="hero-btn hero-btn-primary">
                    <i class="fas fa-user-plus"></i> Create Free Account
                </a>
                <a href="<?= SITE_URL ?>/auth/login.php" class="hero-btn hero-btn-outline">
                    <i class="fas fa-sign-in-alt"></i> Login
                </a>
            </div>
            <div class="stats-row">
                <div class="stat-item"><div class="stat-value"><?= $skillCount ?>+</div><div class="stat-label">Skills</div></div>
                <div class="stat-item"><div class="stat-value"><?= number_format($videoCount) ?>+</div><div class="stat-label">Lessons</div></div>
                <div class="stat-item"><div class="stat-value">1000+</div><div class="stat-label">Students</div></div>
            </div>
        </div>
    </section>

    <!-- Wave -->
    <div class="wave-divider" style="background:#0f0f1a;">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style="fill:var(--bg-primary);">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,80L1392,80C1344,80,1248,80,1152,80C1056,80,960,80,864,80C768,80,672,80,576,80C480,80,384,80,288,80C192,80,96,80,48,80L0,80Z"></path>
        </svg>
    </div>

    <!-- Features -->
    <div class="section">
        <div class="section-header">
            <h2 class="section-title">Why Batch15Tube?</h2>
            <p class="section-subtitle">Everything you need to master IT and Computer Science</p>
        </div>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-video"></i></div>
                <div class="feature-title">Video Lessons</div>
                <div class="feature-desc">High-quality YouTube-embedded video lessons across <?= $skillCount ?> IT and CS skills. Learn at your own pace.</div>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-road"></i></div>
                <div class="feature-title">Learning Roadmaps</div>
                <div class="feature-desc">Structured curriculums guide you from beginner to advanced in every skill with clear milestones.</div>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-trophy"></i></div>
                <div class="feature-title">Certificates</div>
                <div class="feature-desc">Earn certificates upon completing courses to showcase your achievements and skills.</div>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-chart-line"></i></div>
                <div class="feature-title">Track Progress</div>
                <div class="feature-desc">Dashboard with analytics, study streaks, XP points, and detailed progress tracking.</div>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-moon"></i></div>
                <div class="feature-title">Dark Mode</div>
                <div class="feature-desc">Comfortable learning day or night with dark/light theme toggle across the entire platform.</div>
            </div>
            <div class="feature-card">
                <div class="feature-icon"><i class="fas fa-globe"></i></div>
                <div class="feature-title">Multi-Language</div>
                <div class="feature-desc">Learn in Somali, English, or Arabic with language selector for accessibility.</div>
            </div>
        </div>
    </div>

    <!-- Dashboard Preview -->
    <div class="section" style="padding-top:0;">
        <div class="dashboard-preview">
            <h2 class="dashboard-preview-title">📊 Your Learning Dashboard</h2>
            <p class="dashboard-preview-desc">Track your progress, earn XP, complete lessons, and get certificates — all in one place.</p>
            <div class="dashboard-preview-grid">
                <div class="dashboard-preview-item"><i class="fas fa-clock"></i><span>Watch Hours</span></div>
                <div class="dashboard-preview-item"><i class="fas fa-check-circle"></i><span>Completed</span></div>
                <div class="dashboard-preview-item"><i class="fas fa-fire"></i><span>Day Streak</span></div>
                <div class="dashboard-preview-item"><i class="fas fa-trophy"></i><span>Level & XP</span></div>
            </div>
            <div style="margin-top:24px;">
                <a href="<?= SITE_URL ?>/auth/register.php" class="hero-btn hero-btn-primary" style="display:inline-flex;">
                    <i class="fas fa-rocket"></i> Start Learning Now
                </a>
                <a href="<?= SITE_URL ?>/public/index.php" class="hero-btn hero-btn-outline" style="display:inline-flex;border-color:#6C63FF;color:#6C63FF;margin-left:12px;">
                    <i class="fas fa-th-large"></i> Explore Dashboard
                </a>
            </div>
        </div>
    </div>

    <!-- Skills -->
    <div class="skills-section">
        <div class="section-header">
            <h2 class="section-title">Explore Skills</h2>
            <p class="section-subtitle">Choose from <?= $skillCount ?> IT &amp; Computer Science skills — each with video courses</p>
        </div>
        <div class="skills-grid">
            <?php foreach ($skillCards as $skill): 
                $thumb = $skill['video_thumbnail'] ?? '';
                $ytid = $skill['youtube_id'] ?? '';
                if (empty($thumb) && !empty($ytid)) {
                    $thumb = 'https://img.youtube.com/vi/' . $ytid . '/mqdefault.jpg';
                }
                if (empty($thumb)) {
                    $thumb = SITE_URL . '/assets/images/placeholder.jpg';
                }
            ?>
            <a href="<?= SITE_URL ?>/public/skill.php?slug=<?= urlencode($skill['slug']) ?>" class="skill-card-vid">
                <img src="<?= htmlspecialchars($thumb) ?>" alt="<?= htmlspecialchars($skill['name']) ?>" class="skill-card-thumb" loading="lazy">
                <div class="skill-card-body">
                    <div class="skill-card-icon-sm" style="background:<?= htmlspecialchars($skill['color']) ?>">
                        <i class="fas fa-<?= htmlspecialchars($skill['icon'] ?? 'code') ?>"></i>
                    </div>
                    <span class="skill-card-name"><?= htmlspecialchars($skill['name']) ?></span>
                </div>
            </a>
            <?php endforeach; ?>
        </div>
        <div style="margin-top:28px;">
            <a href="<?= SITE_URL ?>/public/skills.php" class="hero-btn hero-btn-primary" style="display:inline-flex;">
                View All Skills <i class="fas fa-arrow-right"></i>
            </a>
            <a href="<?= SITE_URL ?>/public/index.php" class="hero-btn" style="display:inline-flex;border:2px solid var(--border-color);border-radius:12px;padding:16px 36px;font-weight:600;text-decoration:none;color:var(--text-primary);margin-left:12px;">
                Browse Videos <i class="fas fa-video"></i>
            </a>
        </div>
    </div>

    <!-- Testimonials -->
    <div class="section">
        <div class="section-header">
            <h2 class="section-title">What Students Say</h2>
            <p class="section-subtitle">Join thousands of learners worldwide</p>
        </div>
        <div class="testimonials-grid">
            <div class="testimonial-card">
                <div class="testimonial-stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                <div class="testimonial-text">"Batch15Tube helped me go from knowing nothing about programming to building my own web apps. The structured roadmaps are amazing!"</div>
                <div class="testimonial-author"><div class="testimonial-avatar">A</div><div><div class="testimonial-name">Ahmed Hassan</div><div class="testimonial-role">CS Student</div></div></div>
            </div>
            <div class="testimonial-card">
                <div class="testimonial-stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                <div class="testimonial-text">"The cybersecurity course is top-notch. I learned ethical hacking and networking from scratch. Highly recommended for IT students."</div>
                <div class="testimonial-author"><div class="testimonial-avatar">F</div><div><div class="testimonial-name">Fatima Ali</div><div class="testimonial-role">IT Professional</div></div></div>
            </div>
            <div class="testimonial-card">
                <div class="testimonial-stars"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>
                <div class="testimonial-text">"Having courses in Somali, English, and Arabic is incredible. The multi-language support makes learning accessible for everyone."</div>
                <div class="testimonial-author"><div class="testimonial-avatar">M</div><div><div class="testimonial-name">Mohamed Ibrahim</div><div class="testimonial-role">Software Developer</div></div></div>
            </div>
        </div>
    </div>

    <!-- CTA -->
    <div class="cta-section">
        <h2 class="cta-title">Ready to Start Learning?</h2>
        <p class="cta-subtitle">Join thousands of students mastering IT &amp; Computer Science for free.</p>
        <a href="<?= SITE_URL ?>/auth/register.php" class="hero-btn hero-btn-primary" style="background:#FF6584;">
            <i class="fas fa-rocket"></i> Get Started Free
        </a>
        <a href="<?= SITE_URL ?>/public/index.php" class="hero-btn hero-btn-outline" style="margin-left:12px;">
            <i class="fas fa-th-large"></i> Go to Dashboard
        </a>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-inner">
            <div class="footer-grid">
                <div class="footer-col">
                    <div style="font-size:22px;font-weight:800;margin-bottom:12px;"><i class="fas fa-play-circle" style="color:#6C63FF;"></i> Batch15<span style="color:#6C63FF;">Tube</span></div>
                    <p style="font-size:13px;color:var(--text-secondary);line-height:1.6;margin-bottom:16px;">Free educational video platform for IT &amp; Computer Science students.</p>
                    <div style="display:flex;gap:10px;">
                        <a href="#" style="width:34px;height:34px;border-radius:50%;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;color:var(--text-secondary);text-decoration:none;transition:all 0.2s;" onmouseover="this.style.background='#6C63FF';this.style.color='#fff'" onmouseout="this.style.background='var(--bg-tertiary)';this.style.color='var(--text-secondary)'"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" style="width:34px;height:34px;border-radius:50%;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;color:var(--text-secondary);text-decoration:none;transition:all 0.2s;" onmouseover="this.style.background='#1DA1F2';this.style.color='#fff'" onmouseout="this.style.background='var(--bg-tertiary)';this.style.color='var(--text-secondary)'"><i class="fab fa-twitter"></i></a>
                        <a href="#" style="width:34px;height:34px;border-radius:50%;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;color:var(--text-secondary);text-decoration:none;transition:all 0.2s;" onmouseover="this.style.background='#E4405F';this.style.color='#fff'" onmouseout="this.style.background='var(--bg-tertiary)';this.style.color='var(--text-secondary)'"><i class="fab fa-instagram"></i></a>
                        <a href="#" style="width:34px;height:34px;border-radius:50%;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;color:var(--text-secondary);text-decoration:none;transition:all 0.2s;" onmouseover="this.style.background='#FF0000';this.style.color='#fff'" onmouseout="this.style.background='var(--bg-tertiary)';this.style.color='var(--text-secondary)'"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>
                <div class="footer-col">
                    <div class="footer-col-title">Platform</div>
                    <a href="<?= SITE_URL ?>/public/index.php">Dashboard</a>
                    <a href="<?= SITE_URL ?>/public/skills.php">Skills</a>
                    <a href="<?= SITE_URL ?>/public/explore.php">Explore</a>
                    <a href="<?= SITE_URL ?>/public/trending.php">Trending</a>
                </div>
                <div class="footer-col">
                    <div class="footer-col-title">Quick Links</div>
                    <a href="<?= SITE_URL ?>/auth/login.php">Login</a>
                    <a href="<?= SITE_URL ?>/auth/register.php">Register</a>
                    <a href="<?= SITE_URL ?>/auth/forgot.php">Forgot Password</a>
                    <a href="<?= SITE_URL ?>/public/skills.php">All Skills</a>
                </div>
                <div class="footer-col">
                    <div class="footer-col-title">Profiles</div>
                    <?php if ($adminInfo): ?>
                    <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
                        <img src="<?= SITE_URL ?>/uploads/avatars/<?= htmlspecialchars($adminInfo['avatar'] ?: 'default.png') ?>" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid var(--primary);" onerror="this.src='<?= SITE_URL ?>/uploads/avatars/default.png'">
                        <div>
                            <div style="font-size:13px;font-weight:600;"><?= htmlspecialchars($adminInfo['full_name']) ?></div>
                            <div style="font-size:11px;color:var(--text-secondary);"><i class="fas fa-shield-alt" style="color:#6C63FF;font-size:10px;"></i> <?= htmlspecialchars($adminInfo['role'] ?? 'Administrator') ?></div>
                        </div>
                    </div>
                    <?php endif; ?>
                    <div style="display:flex;align-items:center;gap:10px;">
                        <img src="<?= SITE_URL ?>/uploads/avatars/default.png" style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid var(--secondary);">
                        <div>
                            <div style="font-size:13px;font-weight:600;">Students</div>
                            <div style="font-size:11px;color:var(--text-secondary);"><i class="fas fa-user-graduate" style="color:#FF6584;font-size:10px;"></i> 1000+ Learners</div>
                        </div>
                    </div>
                    <div style="margin-top:12px;">
                        <a href="<?= SITE_URL ?>/admin/index.php" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:8px;background:rgba(108,99,255,0.1);color:var(--primary);text-decoration:none;font-size:12px;font-weight:600;"><i class="fas fa-shield-alt"></i> Admin Panel</a>
                        <a href="<?= SITE_URL ?>/dashboard/settings.php" style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:8px;background:rgba(255,101,132,0.1);color:var(--secondary);text-decoration:none;font-size:12px;font-weight:600;margin-left:6px;"><i class="fas fa-user-cog"></i> User Settings</a>
                    </div>
                </div>
                <div class="footer-col">
                    <div class="footer-col-title">Resources</div>
                    <a href="http://localhost/phpmyadmin" target="_blank"><i class="fas fa-database"></i> phpMyAdmin</a>
                    <a href="#"><i class="fas fa-question-circle"></i> Help Center</a>
                    <a href="#"><i class="fas fa-envelope"></i> Contact Us</a>
                    <a href="#"><i class="fas fa-file-alt"></i> Terms of Service</a>
                </div>
            </div>
            <div class="footer-bottom">
                &copy; 2026 Batch15Tube. Built with <i class="fas fa-heart" style="color:#FF6584;"></i> for IT &amp; CS Students.
                <span style="margin:0 12px;opacity:0.3;">|</span>
                <i class="fas fa-user-shield" style="color:#6C63FF;"></i> Admin: <?= $adminInfo ? htmlspecialchars($adminInfo['full_name']) : 'admin' ?>
            </div>
        </div>
    </footer>
</body>
</html>

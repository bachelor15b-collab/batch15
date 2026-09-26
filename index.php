<?php
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

function v($path) {
  $full = __DIR__ . '/' . $path;
  return file_exists($full) ? '?v=' . filemtime($full) : '';
}

// ─── SEO dispatch (robots, sitemap, crawler snapshots) ──────────
spl_autoload_register(function (string $class) {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/app/';
    if (str_starts_with($class, $prefix)) {
        $file = $baseDir . str_replace('\\', '/', substr($class, strlen($prefix))) . '.php';
        if (file_exists($file)) {
            require_once $file;
        }
    }
});

$__relative = \App\Support\SeoSnapshots::pathRoute();
if ($__relative === '/robots.txt') {
    \App\Support\SeoSnapshots::serveRobots();
}
if ($__relative === '/sitemap.xml') {
    \App\Support\SeoSnapshots::serveSitemap();
}
$__ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
if ($__ua !== '' && \App\Support\SeoSnapshots::isCrawler($__ua) && \App\Support\SeoSnapshots::isPublicRoute($__relative)) {
    \App\Support\SeoSnapshots::render($__relative);
}

// Canonical origin + shared SEO values for the shell document
$__origin = \App\Support\SeoSnapshots::canonicalOrigin();
$__base   = \App\Support\SeoSnapshots::basePath();
$__home   = $__origin . $__base . '/';
$__ogImg  = $__origin . $__base . '/assets/images/social-preview-1200x630.png';
?><!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CS15 Hub — Jazeera University Computer Science Batch 15</title>
  <meta name="description" content="CS15 Hub is Jazeera University's portal for Computer Science Batch 15 — course tools, projects, messaging, elections, and the official BTCH 15-B Profiling class directory of 58 students.">
  <meta name="author" content="CS Batch 15, Jazeera University">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#0f172a">
  <link rel="canonical" id="canonicalLink" href="<?= htmlspecialchars($__home) ?>">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="CS15 Hub">
  <meta property="og:title" content="CS15 Hub — Jazeera University Computer Science Batch 15">
  <meta property="og:description" content="Jazeera University's portal for CS Batch 15 — courses, projects, messaging, elections, and the official BTCH 15-B Profiling class directory of 58 students.">
  <meta property="og:url" id="ogUrl" content="<?= htmlspecialchars($__home) ?>">
  <meta property="og:image" id="ogImage" content="<?= htmlspecialchars($__ogImg) ?>">
  <meta property="og:locale" content="en_US">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="CS15 Hub — Jazeera University Computer Science Batch 15">
  <meta name="twitter:description" content="Jazeera University's portal for CS Batch 15 — courses, projects, messaging, elections, and the official BTCH 15-B Profiling class directory of 58 students.">
  <meta name="twitter:image" id="twitterImage" content="<?= htmlspecialchars($__ogImg) ?>">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "<?= htmlspecialchars(rtrim($__home, '/')) ?>/#organization",
    "name": "Jazeera University CS & IT Batch 15",
    "alternateName": ["CS15 Hub", "CS Batch 15", "BTCH 15-B"],
    "url": "<?= htmlspecialchars($__home) ?>",
    "logo": "<?= htmlspecialchars($__ogImg) ?>",
    "description": "Student-built platform of Jazeera University Computer Science & IT Batch 15 (BTCH 15-B): class directory, projects, gallery, and community tools.",
    "parentOrganization": {
      "@type": "EducationalOrganization",
      "name": "Jazeera University",
      "address": { "@type": "PostalAddress", "addressCountry": "SO", "addressLocality": "Mogadishu" }
    }
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "<?= htmlspecialchars(rtrim($__home, '/')) ?>/#website",
    "name": "CS15 Hub",
    "url": "<?= htmlspecialchars($__home) ?>",
    "publisher": { "@id": "<?= htmlspecialchars(rtrim($__home, '/')) ?>/#organization" },
    "inLanguage": "en"
  }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="icon" type="image/x-icon" href="favicon_io/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon_io/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="favicon_io/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="favicon_io/apple-touch-icon.png">
  <link rel="manifest" href="favicon_io/site.webmanifest">
</head>
<body>
  <div id="app">
    <div class="app-loader">
      <div class="loader-spinner"></div>
      <span class="loader-text">Loading CS15 Hub...</span>
    </div>
  </div>

  <div id="modal-container"></div>
  <div id="toast-container"></div>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
  <script>window.BASE_URL = '<?= \App\Support\SeoSnapshots::canonicalOrigin() . rtrim(\App\Support\SeoSnapshots::basePath(), '/') ?>';</script>
  <script src="assets/js/data.js<?= v('assets/js/data.js') ?>"></script>
  <script src="assets/js/members-data.js<?= v('assets/js/members-data.js') ?>"></script>
  <script src="assets/js/api.js<?= v('assets/js/api.js') ?>"></script>
  <script src="assets/js/components.js<?= v('assets/js/components.js') ?>"></script>
  <script src="assets/js/pages-public.js<?= v('assets/js/pages-public.js') ?>"></script>
  <script src="assets/js/pages-auth.js<?= v('assets/js/pages-auth.js') ?>"></script>
  <script src="assets/js/pages-dashboard.js<?= v('assets/js/pages-dashboard.js') ?>"></script>
  <script src="assets/js/pages-app.js<?= v('assets/js/pages-app.js') ?>"></script>
  <script src="assets/js/quiz-questions.js<?= v('assets/js/quiz-questions.js') ?>"></script>
  <script src="assets/js/app.js<?= v('assets/js/app.js') ?>"></script>
  <script src="assets/js/seo.js<?= v('assets/js/seo.js') ?>"></script>
</body>
</html>
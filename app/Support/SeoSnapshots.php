<?php
/**
 * CS15 Hub — SEO supporting layer.
 *
 * Serves host-aware /robots.txt and /sitemap.xml, and renders crawler
 * HTML snapshots of the public routes so search-engine and social
 * crawlers see real content even though the app is a hash-routed SPA.
 */
namespace App\Support;

use App\Config\Database;

class SeoSnapshots
{
    /** Clean (no-hash) public routes that are rendered as HTML snapshots. */
    public const PUBLIC_ROUTES = [
        '/'          => 'home',
        '/about'     => 'about',
        '/projects'  => 'projects',
        '/gallery'   => 'gallery',
        '/members'   => 'members',
        '/contact'   => 'contact',
        '/terms'     => 'terms',
        '/privacy'   => 'privacy',
    ];

    /** Routes excluded from the sitemap even though public. */
    private const SITEMAP_EXCLUDE = ['/terms', '/privacy'];

    private const BRAND = 'CS15 Hub — Jazeera University Computer Science &amp; IT Batch 15';

    public static function isCrawler(?string $userAgent): bool
    {
        if (empty($userAgent)) {
            return false;
        }
        $ua  = strtolower($userAgent);
        $hits = [
            'googlebot', 'bingbot', 'duckduckbot', 'slurp', 'yandex', 'baiduspider',
            'sogou', 'applebot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
            'whatsapp', 'telegrambot', 'slackbot', 'discordbot', 'gptbot', 'anthropic-ai',
            'claudebot', 'perplexitybot', 'bytespider', 'petalbot', 'semrushbot',
            'ahrefsbot', 'mj12bot', 'dotbot', 'ia_archiver', 'bingpreview', 'embedly',
            'pinterest', 'vkshare', 'tumblr', 'buibrowser', 'chatgpt', 'google-extended',
        ];
        foreach ($hits as $needle) {
            if (str_contains($ua, $needle)) {
                return true;
            }
        }
        return false;
    }

    /** Relative path of the current request (no query string, no base path). */
    public static function pathRoute(): string
    {
        $path      = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
        $script    = $_SERVER['SCRIPT_NAME'] ?? '/index.php';
        $base      = rtrim(dirname($script), '/');
        $relative  = $base !== '' ? (str_starts_with($path, $base) ? substr($path, strlen($base)) : $path) : $path;
        $relative  = '/' . trim($relative, '/');
        if ($relative === '/') {
            return '/';
        }
        return $relative;
    }

    /** Absolute canonical origin, e.g. https://batch15.com (host-aware). */
    public static function canonicalOrigin(): string
    {
        if (defined('CS15_CANONICAL_HOST')) {
            return 'https://' . rtrim(constant('CS15_CANONICAL_HOST'), '/');
        }
        $host   = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $https  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
        $scheme = $https ? 'https' : 'http';
        return $scheme . '://' . $host;
    }

    /** Base path (subdirectory installs), e.g. /batch15hub/B15 or ''. */
    public static function basePath(): string
    {
        $script = $_SERVER['SCRIPT_NAME'] ?? '/index.php';
        $base   = rtrim(dirname($script), '/');
        return $base === '/' ? '' : $base;
    }

    private static function url(string $route): string
    {
        return self::canonicalOrigin() . self::basePath() . (($route === '/') ? '/' : $route);
    }

    public static function serveRobots(): void
    {
        header('Content-Type: text/plain; charset=utf-8');
        header('X-Robots-Tag: all');
        $lines = [
            'User-agent: *',
            'Allow: /',
            'Disallow: /api/',
            'Disallow: /api/*',
            'Disallow: /youtube/',
            '',
            'Sitemap: ' . self::url('/sitemap.xml'),
        ];
        echo implode("\n", $lines);
        exit;
    }

    public static function serveSitemap(): void
    {
        header('Content-Type: application/xml; charset=utf-8');
        header('X-Robots-Tag: all');
        $now = date('Y-m-d');
        $urls = [];
        foreach (self::PUBLIC_ROUTES as $route => $key) {
            if (in_array($route, self::SITEMAP_EXCLUDE, true)) {
                continue;
            }
            $priority = $route === '/' ? '1.0' : ($route === '/members' ? '0.9' : '0.7');
            $urls[]   = ['loc' => self::url($route), 'lastmod' => $now, 'priority' => $priority];
        }
        $xml  = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
        $xml .= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n";
        foreach ($urls as $u) {
            $xml .= "  <url>\n";
            $xml .= "    <loc>{$u['loc']}</loc>\n";
            $xml .= "    <lastmod>{$u['lastmod']}</lastmod>\n";
            $xml .= "    <changefreq>monthly</changefreq>\n";
            $xml .= "    <priority>{$u['priority']}</priority>\n";
            $xml .= "  </url>\n";
        }
        $xml .= "</urlset>\n";
        echo $xml;
        exit;
    }

    public static function isPublicRoute(string $route): bool
    {
        return array_key_exists($route, self::PUBLIC_ROUTES);
    }

    public static function render(string $route): void
    {
        header('Content-Type: text/html; charset=utf-8');
        header('X-Robots-Tag: index,follow');
        echo self::document($route);
        exit;
    }

    /** Full standalone HTML document for a public route. */
    public static function document(string $route): string
    {
        $key   = self::PUBLIC_ROUTES[$route];
        $meta  = self::metaFor($key, $route);
        $url   = self::url($route);
        $body  = self::bodyFor($key, $route);
        $json  = self::jsonLd($key, $route);
        $ogImg = self::url('/assets/images/social-preview-1200x630.png');

        $h  = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n";
        $h .= "<meta charset=\"utf-8\">\n";
        $h .= "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n";
        $h .= "<title>" . htmlspecialchars($meta['title'], ENT_QUOTES) . "</title>\n";
        $h .= "<meta name=\"description\" content=\"" . htmlspecialchars($meta['description'], ENT_QUOTES) . "\">\n";
        $h .= "<meta name=\"robots\" content=\"index,follow\">\n";
        $h .= "<link rel=\"canonical\" href=\"$url\">\n";
        $h .= "<meta property=\"og:type\" content=\"website\">\n";
        $h .= "<meta property=\"og:site_name\" content=\"CS15 Hub\">\n";
        $h .= "<meta property=\"og:title\" content=\"" . htmlspecialchars($meta['title'], ENT_QUOTES) . "\">\n";
        $h .= "<meta property=\"og:description\" content=\"" . htmlspecialchars($meta['description'], ENT_QUOTES) . "\">\n";
        $h .= "<meta property=\"og:url\" content=\"$url\">\n";
        $h .= "<meta property=\"og:image\" content=\"$ogImg\">\n";
        $h .= "<meta property=\"og:locale\" content=\"en_US\">\n";
        $h .= "<meta name=\"twitter:card\" content=\"summary_large_image\">\n";
        $h .= "<meta name=\"twitter:title\" content=\"" . htmlspecialchars($meta['title'], ENT_QUOTES) . "\">\n";
        $h .= "<meta name=\"twitter:description\" content=\"" . htmlspecialchars($meta['description'], ENT_QUOTES) . "\">\n";
        $h .= "<meta name=\"twitter:image\" content=\"$ogImg\">\n";
        foreach ($json as $block) {
            $h .= "<script type=\"application/ld+json\">" . json_encode($block, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) . "</script>\n";
        }
        $h .= "<style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;margin:0;color:#0f172a;background:#f8fafc;line-height:1.65}a{color:#2563eb}header{background:#0f172a;color:#fff;padding:18px 24px}header a{color:#fff;text-decoration:none;font-weight:600}nav{display:flex;flex-wrap:wrap;gap:18px;margin-top:10px}nav a{font-weight:500;color:#cbd5e1}main{max-width:960px;margin:0 auto;padding:40px 24px}h1{font-size:1.9rem;margin:.2em 0 .4em}h2{font-size:1.35rem;margin-top:1.1em}.lead{font-size:1.08rem;color:#334155}ul.memberlist{columns:2;gap:28px;padding-left:20px}ul.memberlist li{margin-bottom:6px;break-inside:avoid}footer{background:#0f172a;color:#94a3b8;padding:22px 24px;font-size:.9rem}footer a{color:#93c5fd}.card{border:1px solid #e2e8f0;border-radius:12px;padding:18px 20px;margin:14px 0;background:#fff}.pill{display:inline-block;background:#e0e7ff;color:#3730a3;border-radius:999px;padding:1px 10px;font-size:.78rem}.empty{color:#64748b;font-style:italic}@media(max-width:700px){ul.memberlist{columns:1}}</style>\n";
        $h .= "</head>\n<body>\n";
        $h .= self::header($route);
        $h .= $body;
        $h .= self::footer();
        $h .= "</body>\n</html>\n";
        return $h;
    }

    private static function metaFor(string $key, string $route): array
    {
        $map = [
            'home'     => ['title' => 'CS15 Hub — Jazeera University Computer Science Batch 15', 'description' => 'Student-built platform of Jazeera University Computer Science & IT Batch 15 (BTCH 15-B): class directory, student projects, gallery, courses, and community tools. 58 classmates profiled.'],
            'about'    => ['title' => 'About CS15 Hub — Jazeera University Computer Science Batch 15', 'description' => 'CS15 Hub is Jazeera University\'s digital home for Computer Science Batch 15: course materials, assignments, projects, messaging, and the BTCH 15-B class profiling directory of 58 students.'],
            'projects' => ['title' => 'Student Projects — CS15 Hub, Jazeera University Batch 15', 'description' => 'Projects built by Computer Science Batch 15 students at Jazeera University, shared on CS15 Hub with code, tech stack, and live demos.'],
            'gallery'  => ['title' => 'Gallery — CS15 Hub, Jazeera University Batch 15', 'description' => 'Photos and media from academic events, classes, and social moments of Jazeera University Computer Science Batch 15.'],
            'members'  => ['title' => 'Class Directory (BTCH 15-B Profiling) — CS15 Hub', 'description' => 'The BTCH 15-B class directory of Jazeera University Computer Science & IT Batch 15: 58 documented classmates with their courses, learning styles, interests, and skills.'],
            'contact'  => ['title' => 'Contact — CS15 Hub, Jazeera University Batch 15', 'description' => 'Get in touch with CS15 Hub, the Computer Science Batch 15 community at Jazeera University, Mogadishu.'],
            'terms'    => ['title' => 'Terms of Service — CS15 Hub', 'description' => 'Terms of service for using CS15 Hub, the Computer Science Batch 15 platform at Jazeera University.'],
            'privacy'  => ['title' => 'Privacy Policy — CS15 Hub', 'description' => 'How CS15 Hub handles student accounts, profiles, and data for Jazeera University Computer Science Batch 15.'],
        ];
        return $map[$key];
    }

    private static function header(string $route): string
    {
        $links = [
            ['/', 'Home'], ['/about', 'About'], ['/members', 'Members'], ['/projects', 'Projects'], ['/gallery', 'Gallery'], ['/contact', 'Contact'],
        ];
        $h = "<header>\n<div><a href=\"" . self::url('/') . "\">CS15 Hub — Jazeera University Computer Science &amp; IT Batch 15</a></div>\n";
        $h .= "<nav>\n";
        foreach ($links as [$href, $label]) {
            $h .= '<a href="' . self::url($href) . '">' . $label . '</a>' . "\n";
        }
        $h .= "</nav>\n</header>\n";
        return $h;
    }

    private static function footer(): string
    {
        $h  = "<footer>\n";
        $h .= "<div>Sitemap: <a href=\"" . self::url('/sitemap.xml') . "\">sitemap.xml</a></div>\n";
        $h .= "<div>&copy; " . date('Y') . " CS15 Hub — student-built platform of Jazeera University Computer Science &amp; IT Batch 15, Mogadishu, Somalia.</div>\n";
        $h .= "</footer>\n";
        return $h;
    }

    private static function bodyFor(string $key, string $route): string
    {
        $method = 'content_' . $key;
        return method_exists(self::class, $method) ? self::$method() : '<main><h1>' . htmlspecialchars($route) . '</h1></main>';
    }

    // ─── Route content ─────────────────────────────────────────────

    private static function content_home(): string
    {
        $h  = "<main>\n";
        $h .= "<h1>Where Future Engineers Are Built</h1>\n";
        $h .= "<p class=\"lead\">CS15 Hub is Jazeera University's dedicated portal for Computer Science Batch 15 — a student-built ecosystem for course materials, assignments, projects, messaging, elections, and more. Batch 15-B is documented in the official &ldquo;BTCH 15-B Profiling&rdquo; class directory, which records " . count(self::members()) . " classmates and their courses, learning styles, interests, and unique skills.</p>\n";
        $h .= "<section class=\"card\"><h2>Batch 15-B at a glance</h2><ul>\n";
        $h .= "<li><strong>58</strong> profiled classmates in the BTCH 15-B directory</li>\n";
        $h .= "<li><strong>7</strong> active courses for the current academic year</li>\n";
        $h .= "<li><strong>10+</strong> integrated platform modules (directory, projects, gallery, courses, messaging, and more)</li>\n";
        $h .= "</ul></section>\n";
        $h .= "<section><h2>Explore the platform</h2><ul>\n";
        $h .= '<li><a href="' . self::url('/members') . '">Class Directory (BTCH 15-B Profiling)</a></li>' . "\n";
        $h .= '<li><a href="' . self::url('/about') . '">About CS15 Hub</a></li>' . "\n";
        $h .= '<li><a href="' . self::url('/projects') . '">Student Projects</a></li>' . "\n";
        $h .= '<li><a href="' . self::url('/gallery') . '">Gallery</a></li>' . "\n";
        $h .= '<li><a href="' . self::url('/contact') . '">Contact</a></li>' . "\n";
        $h .= "</ul></section>\n";
        $h .= "</main>\n";
        return $h;
    }

    private static function content_about(): string
    {
        $h  = "<main>\n";
        $h .= "<h1>The Digital Home of CS Batch 15</h1>\n";
        $h .= "<p class=\"lead\">CS15 Hub is Jazeera University's dedicated portal for Computer Science Batch 15 — a student-built ecosystem for course materials, assignments, projects, messaging, elections, and more. Batch 15-B is documented in the official &ldquo;BTCH 15-B Profiling&rdquo; class directory of " . count(self::members()) . " students.</p>\n";
        $h .= "<section class=\"card\"><h2>Our Mission</h2><p>To provide CS Batch 15 students with a world-class digital platform that enhances learning outcomes through personalized tools, fosters meaningful collaboration between students and faculty, and prepares every graduate for successful careers in the technology landscape.</p></section>\n";
        $h .= "<section class=\"card\"><h2>Our Vision</h2><p>To be a leading academic technology platform that supports computer science education, innovation, and community engagement — with tools that help every student move from learner to industry-ready professional.</p></section>\n";
        $h .= "<section><h2>Who it belongs to</h2><p>CS15 Hub is operated by the students of Computer Science &amp; IT Batch 15 (BTCH 15-B) at Jazeera University, Department of Computer Science, Mogadishu, Somalia.</p></section>\n";
        $h .= "</main>\n";
        return $h;
    }

    private static function content_projects(): string
    {
        $items = self::projects();
        $h  = "<main>\n";
        $h .= "<h1>Student Projects</h1>\n";
        $h .= "<p class=\"lead\">Projects built by Computer Science Batch 15 students at Jazeera University. Projects are added through the platform as students build and publish their work with source code and demos.</p>\n";
        if (empty($items)) {
            $h .= "<p class=\"empty\">No projects have been published yet. Batch 15 students can add their projects from the platform once they log in.</p>\n";
        } else {
            $h .= "<section><h2>Published projects</h2><ul>\n";
            foreach ($items as $p) {
                $h .= '<li><strong>' . htmlspecialchars($p['title']) . '</strong> — ' . htmlspecialchars($p['description']) . '</li>' . "\n";
            }
            $h .= "</ul></section>\n";
        }
        $h .= "</main>\n";
        return $h;
    }

    private static function content_gallery(): string
    {
        $items = self::gallery();
        $h  = "<main>\n";
        $h .= "<h1>Gallery</h1>\n";
        $h .= "<p class=\"lead\">Photos and media from academic events, classes, and social moments of Jazeera University Computer Science Batch 15.</p>\n";
        if (empty($items)) {
            $h .= "<p class=\"empty\">No gallery items have been published yet.</p>\n";
        } else {
            $h .= "<section><h2>Published media</h2><ul>\n";
            foreach ($items as $g) {
                $h .= '<li><strong>' . htmlspecialchars($g['title']) . '</strong> — ' . htmlspecialchars($g['description']) . '</li>' . "\n";
            }
            $h .= "</ul></section>\n";
        }
        $h .= "</main>\n";
        return $h;
    }

    private static function content_members(): string
    {
        $members = self::members();
        $h  = "<main>\n";
        $h .= "<h1>Class Directory (BTCH 15-B Profiling)</h1>\n";
        $h .= "<p class=\"lead\">The official BTCH 15-B profiling records " . count($members) . " classmates of Jazeera University Computer Science &amp; IT Batch 15, including each student's courses, learning style, interests, and unique skills.</p>\n";
        if (empty($members)) {
            $h .= "<p class=\"empty\">No profiles are available yet.</p>\n";
        } else {
            $h .= "<section><h2>Profiled classmates</h2><ul class=\"memberlist\">\n";
            foreach ($members as $m) {
                $skills = is_array($m['skills'] ?? null) ? $m['skills'] : [];
                $extra  = [];
                if (!empty($m['learningStyle'])) {
                    $extra[] = 'Learning style: ' . $m['learningStyle'];
                }
                if (!empty($m['courses'])) {
                    $extra[] = 'Courses: ' . implode(', ', (array)$m['courses']);
                }
                if (!empty($skills)) {
                    $extra[] = 'Skills: ' . implode(', ', array_slice($skills, 0, 5));
                }
                $h .= "<li><strong>" . htmlspecialchars($m['name']) . "</strong>" . ($extra ? " — " . htmlspecialchars(implode(' · ', $extra)) : '') . "</li>\n";
            }
            $h .= "</ul></section>\n";
        }
        $h .= "</main>\n";
        return $h;
    }

    private static function content_contact(): string
    {
        $h  = "<main>\n";
        $h .= "<h1>Contact</h1>\n";
        $h .= "<p class=\"lead\">Reach out to the CS15 Hub team and the Computer Science Batch 15 community at Jazeera University.</p>\n";
        $h .= "<section class=\"card\"><h2>Visit Our Campus</h2><p>Jazeera University Main Campus — Computer Science Department, Mogadishu, Somalia.</p></section>\n";
        $h .= "<section class=\"card\"><h2>Email Us</h2><p>Registered Batch 15 members can contact each other through the platform's in-app messaging system.</p></section>\n";
        $h .= "<section class=\"card\"><h2>Office Hours</h2><p>Follow the department's published semester schedule for faculty and lab availability.</p></section>\n";
        $h .= "</main>\n";
        return $h;
    }

    private static function content_terms(): string
    {
        $h  = "<main>\n";
        $h .= "<h1>Terms of Service</h1>\n";
        $h .= "<p class=\"lead\">By using CS15 Hub you agree to these terms.</p>\n";
        $h .= "<section class=\"card\"><h2>1. About the platform</h2><p>CS15 Hub is a student-run platform supporting the learning and community activities of Jazeera University Computer Science &amp; IT Batch 15. Accounts are available to qualifying students, faculty, and alumni.</p></section>\n";
        $h .= "<section class=\"card\"><h2>2. Acceptable use</h2><p>Use the platform lawfully, respect other members, and do not publish content that is harmful, misleading, or infringing.</p></section>\n";
        $h .= "<section class=\"card\"><h2>3. Accounts</h2><p>You are responsible for safeguarding your credentials and for activity under your account. The platform may suspend accounts that violate these terms.</p></section>\n";
        $h .= "</main>\n";
        return $h;
    }

    private static function content_privacy(): string
    {
        $h  = "<main>\n";
        $h .= "<h1>Privacy Policy</h1>\n";
        $h .= "<p class=\"lead\">How CS15 Hub handles your information.</p>\n";
        $h .= "<section class=\"card\"><h2>1. Data we hold</h2><p>Profile information you provide (name, photo, courses, interests, skills), plus activity such as posts, projects, and messages.</p></section>\n";
        $h .= "<section class=\"card\"><h2>2. How it is used</h2><p>To operate the platform, keep the class directory accurate, and support teaching and community activities.</p></section>\n";
        $h .= "<section class=\"card\"><h2>3. Sharing</h2><p>Public profiles may be visible on the public class directory. We do not sell personal data.</p></section>\n";
        $h .= "</main>\n";
        return $h;
    }

    // ─── Data ──────────────────────────────────────────────────────

    /** 58-strong class directory from roster.json (no DB needed). */
    private static function members(): array
    {
        static $cached = null;
        if ($cached !== null) {
            return $cached;
        }
        $file = __DIR__ . '/../../data/roster.json';
        if (!is_file($file)) {
            return $cached = [];
        }
        $raw = json_decode((string)file_get_contents($file), true);
        $out = [];
        foreach ((array)$raw as $row) {
            $out[] = [
                'name'        => (string)($row['name'] ?? ''),
                'learningStyle' => (string)($row['learningStyle'] ?? ''),
                'courses'     => (array)($row['courses'] ?? []),
                'skills'      => (array)($row['uniqueSkills'] ?? []),
                'interests'   => (array)($row['interests'] ?? []),
            ];
        }
        usort($out, fn($a, $b) => strcmp($a['name'], $b['name']));
        return $cached = $out;
    }

    /** Published projects from the DB (empty tables handled gracefully). */
    private static function projects(): array
    {
        return self::rows('projects', ['title', 'description'], 'status', 'completed');
    }

    private static function gallery(): array
    {
        return self::rows('gallery_items', ['title', 'description'], 'status', 'published');
    }

    private static function rows(string $table, array $cols, string $statusCol, string $statusVal): array
    {
        try {
            $pdo = Database::getInstance();
            $sql = sprintf(
                "SELECT %s FROM %s WHERE %s = ? ORDER BY created_at DESC LIMIT 50",
                implode(', ', $cols),
                $table,
                $statusCol
            );
            $st = $pdo->prepare($sql);
            $st->execute([$statusVal]);
            return $st->fetchAll();
        } catch (\Throwable $e) {
            return [];
        }
    }

    // ─── Structured data ───────────────────────────────────────────

    private static function jsonLd(string $key, string $route): array
    {
        $url   = self::url($route);
        $base  = self::canonicalOrigin();
        $ogImg = self::url('/assets/images/social-preview-1200x630.png');

        $org = [
            '@type' => 'Organization',
            '@id'   => $base . '/#organization',
            'name'  => 'Jazeera University CS & IT Batch 15',
            'alternateName' => ['CS15 Hub', 'CS Batch 15', 'BTCH 15-B'],
            'url'   => $base . '/',
            'logo'  => ['@type' => 'ImageObject', 'url' => $ogImg],
            'description' => 'Student-built platform of Jazeera University Computer Science & IT Batch 15 (BTCH 15-B): class directory, projects, gallery, and community tools.',
            'parentOrganization' => [
                '@type' => 'EducationalOrganization',
                'name'  => 'Jazeera University',
                'address' => ['@type' => 'PostalAddress', 'addressCountry' => 'SO', 'addressLocality' => 'Mogadishu'],
            ],
        ];

        $webSite = [
            '@context' => 'https://schema.org',
            '@type'    => 'WebSite',
            '@id'      => $base . '/#website',
            'name'     => 'CS15 Hub',
            'url'      => $base . '/',
            'publisher' => ['@id' => $base . '/#organization'],
            'inLanguage' => 'en',
        ];

        $webPage = [
            '@context' => 'https://schema.org',
            '@type'    => 'WebPage',
            'name'     => self::metaFor($key, $route)['title'],
            'description' => self::metaFor($key, $route)['description'],
            'url'      => $url,
            'isPartOf' => ['@id' => $base . '/#website'],
            'about'    => ['@id' => $base . '/#organization'],
        ];

        $breadcrumb = [
            '@context' => 'https://schema.org',
            '@type'    => 'BreadcrumbList',
            'itemListElement' => [
                ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $base . '/'],
                ['@type' => 'ListItem', 'position' => 2, 'name' => self::metaFor($key, $route)['title'], 'item' => $url],
            ],
        ];

        $blocks = [$webSite, $webPage, $breadcrumb];
        if ($key === 'members') {
            $blocks[] = self::membersSchema();
        }
        if ($key === 'projects') {
            $blocks[] = self::projectsSchema();
        }
        array_unshift($blocks, $org);
        return $blocks;
    }

    private static function membersSchema(): array
    {
        $list = [];
        $i    = 0;
        foreach (self::members() as $m) {
            $i++;
            $entry = [
                '@type' => 'Person',
                'name'  => $m['name'],
                'url'   => self::url('/members'),
                'alumniOf' => ['@type' => 'CollegeOrUniversity', 'name' => 'Jazeera University'],
            ];
            if (!empty($m['skills'])) {
                $entry['knowsAbout'] = $m['skills'];
            }
            $list[] = $entry;
            if ($i >= 60) {
                break;
            }
        }
        return [
            '@context' => 'https://schema.org',
            '@type'    => 'ItemList',
            'name'     => 'BTCH 15-B Class Directory',
            'itemListElement' => $list,
        ];
    }

    private static function projectsSchema(): array
    {
        $items = self::projects();
        $list  = [];
        $i     = 0;
        foreach ($items as $p) {
            $i++;
            $list[] = [
                '@type' => 'CreativeWork',
                'name'  => $p['title'],
                'description' => $p['description'],
                'url'   => self::url('/projects'),
            ];
        }
        return [
            '@context' => 'https://schema.org',
            '@type'    => 'ItemList',
            'name'     => 'CS Batch 15 Student Projects',
            'itemListElement' => $list,
        ];
    }
}
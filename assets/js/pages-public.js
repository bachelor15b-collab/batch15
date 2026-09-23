/* ============================================
   CS15 Hub - Public Page Templates
   ============================================ */
function refreshBottomNav() {
  const oldNav = document.querySelector('.bottom-nav');
  if (oldNav) oldNav.remove();
  document.getElementById('bottomMoreOverlay')?.remove();
  document.getElementById('bottomMoreSheet')?.remove();
  renderMobileBottomNav();
}

function updateBottomNavActive() {
  const nav = document.querySelector('.bottom-nav');
  if (!nav) return;
  const path = (router?.currentPath || window.location.hash.slice(1) || '/');
  const links = nav.querySelectorAll('a');
  links.forEach(a => {
    const href = a.getAttribute('data-href');
    a.classList.toggle('active', href === path || (href === '/dashboard' && path.startsWith('/dashboard')));
  });
  // Scroll active into view
  const active = nav.querySelector('a.active');
  if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

function toggleBottomMore() {
  const sheet = document.getElementById('bottomMoreSheet');
  const overlay = document.getElementById('bottomMoreOverlay');
  if (!sheet || !overlay) return;
  const open = sheet.classList.toggle('open');
  overlay.classList.toggle('show', open);
  document.body.classList.toggle('overflow-hidden', open);
}

function renderMobileBottomNav() {
  const user = DB?.currentUser;
  if (document.querySelector('.bottom-nav')) return;

  const nav = document.createElement("div");
  nav.className = "bottom-nav";

  const mainItems = user
    ? [
        { href: '/', icon: 'bi-house', label: 'Home' },
        { href: '/challenges', icon: 'bi-trophy', label: 'Challenges' },
        { href: '/lessons', icon: 'bi-journal-arrow-down', label: 'Lessons' },
        { href: '/members', icon: 'bi-people', label: 'Members' },
        { href: '/dashboard', icon: 'bi-person', label: 'Me' },
      ]
    : [
        { href: '/', icon: 'bi-house', label: 'Home' },
        { href: '/posts', icon: 'bi-journal-text', label: 'Posts' },
        { href: '/members', icon: 'bi-people', label: 'Members' },
        { href: '/login', icon: 'bi-person', label: 'Login' },
      ];

  const moreItems = [
    { href: '/about', icon: 'bi-info-circle', label: 'About' },
    { href: '/projects', icon: 'bi-folder', label: 'Projects' },
    { href: '/gallery', icon: 'bi-images', label: 'Gallery' },
    { href: '/contact', icon: 'bi-chat-dots', label: 'Contact' },
  ];

  nav.innerHTML = mainItems.map(item => `
    <a data-href="${item.href}" onclick="router.navigate('${item.href}')">
      <i class="bi ${item.icon}"></i>
      <span>${item.label}</span>
    </a>
  `).join('') + (user ? '' : `
    <a class="bottom-more-btn" onclick="toggleBottomMore()">
      <i class="bi bi-grid-3x3-gap-fill"></i>
      <span>More</span>
    </a>
  `);

  document.body.appendChild(nav);

  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'bottom-more-overlay';
  overlay.id = 'bottomMoreOverlay';
  overlay.onclick = toggleBottomMore;
  document.body.appendChild(overlay);

  // Sheet
  const sheet = document.createElement('div');
  sheet.className = 'bottom-more-sheet';
  sheet.id = 'bottomMoreSheet';
  sheet.innerHTML = `
    <div class="bottom-more-handle"></div>
    <div class="bottom-more-grid">
      ${moreItems.map(item => `
        <a data-href="${item.href}" onclick="toggleBottomMore();setTimeout(()=>router.navigate('${item.href}'),200)">
          <i class="bi ${item.icon}"></i>
          <span>${item.label}</span>
        </a>
      `).join('')}
    </div>
  `;
  document.body.appendChild(sheet);

  setTimeout(updateBottomNavActive, 100);
}
let _pendingNavFilter = null;
let _pendingScrollTo = null;

function navigateWithFilter(path, filterFn, arg) {
  _pendingNavFilter = { fn: filterFn, arg };
  if (router.currentPath === path) {
    router.resolve(path);
  } else {
    router.navigate(path);
  }
}

function navigateAndScroll(path, sectionId) {
  _pendingScrollTo = sectionId;
  if (router.currentPath === path) {
    router.resolve(path);
  } else {
    router.navigate(path);
  }
}

const PublicPages = {
  renderPublicNavbar() {
    const user = DB.currentUser;
    return `
      <nav class="public-navbar" id="publicNavbar">
        <a class="public-navbar-brand" href="#/" onclick="router.navigate('/')">
          <img class="brand-logo-img" src="logo.png" alt="CS15 Hub — Batch 15 logo" width="40" height="40">
          <span class="brand-logo-text">CS15 Hub</span>
        </a>
        <div class="public-navbar-links" id="publicNavLinks">
          <a href="#/" class="${router.currentPath === '/' ? 'active' : ''}" onclick="router.navigate('/')">Home</a>
          <div class="nav-dropdown">
            <a href="#/about" class="nav-dropdown-trigger ${router.currentPath === '/about' ? 'active' : ''}" onclick="router.navigate('/about')">About <i class="bi bi-chevron-down nav-arrow"></i></a>
            <div class="nav-dropdown-menu">
              <a href="#/about" onclick="navigateAndScroll('/about','about-mission')"><i class="bi bi-info-circle"></i><span><strong>Mission & Vision</strong><small>Our purpose and goals</small></span></a>
              <a href="#/about" onclick="navigateAndScroll('/about','about-values')"><i class="bi bi-heart"></i><span><strong>Core Values</strong><small>What we stand for</small></span></a>
              <a href="#/about" onclick="navigateAndScroll('/about','about-journey')"><i class="bi bi-clock-history"></i><span><strong>Our Journey</strong><small>Timeline & milestones</small></span></a>
              <a href="#/about" onclick="navigateAndScroll('/about','about-features')"><i class="bi bi-grid"></i><span><strong>Platform Features</strong><small>Everything we offer</small></span></a>
            </div>
          </div>
          <div class="nav-dropdown">
            <a href="#/projects" class="nav-dropdown-trigger ${router.currentPath === '/projects' ? 'active' : ''}" onclick="router.navigate('/projects')">Projects <i class="bi bi-chevron-down nav-arrow"></i></a>
            <div class="nav-dropdown-menu">
              <a href="#/projects" onclick="router.navigate('/projects')"><i class="bi bi-columns-gap"></i><span><strong>All Projects</strong><small>Browse all submissions</small></span></a>
              <a href="#/projects" onclick="navigateWithFilter('/projects','filterProjects','completed')"><i class="bi bi-check-circle"></i><span><strong>Completed</strong><small>Finished projects</small></span></a>
              <a href="#/projects" onclick="navigateWithFilter('/projects','filterProjects','in_progress')"><i class="bi bi-arrow-repeat"></i><span><strong>In Progress</strong><small>Active developments</small></span></a>
              <a href="#/projects" onclick="navigateWithFilter('/projects','filterProjects','planning')"><i class="bi bi-pencil"></i><span><strong>Planning</strong><small>Upcoming projects</small></span></a>
            </div>
          </div>
          <div class="nav-dropdown">
            <a href="#/gallery" class="nav-dropdown-trigger ${router.currentPath === '/gallery' ? 'active' : ''}" onclick="router.navigate('/gallery')">Gallery <i class="bi bi-chevron-down nav-arrow"></i></a>
            <div class="nav-dropdown-menu">
              <a href="#/gallery" onclick="router.navigate('/gallery')"><i class="bi bi-images"></i><span><strong>All Media</strong><small>Every photo & video</small></span></a>
              <a href="#/gallery" onclick="navigateWithFilter('/gallery','filterGallery','events')"><i class="bi bi-calendar-event"></i><span><strong>Events</strong><small>Event coverage</small></span></a>
              <a href="#/gallery" onclick="navigateWithFilter('/gallery','filterGallery','academic')"><i class="bi bi-journal-text"></i><span><strong>Academic</strong><small>Learning moments</small></span></a>
              <a href="#/gallery" onclick="navigateWithFilter('/gallery','filterGallery','social')"><i class="bi bi-people"></i><span><strong>Social</strong><small>Community gatherings</small></span></a>
            </div>
          </div>
          <div class="nav-dropdown">
            <a href="#/members" class="nav-dropdown-trigger ${router.currentPath === '/members' ? 'active' : ''}" onclick="router.navigate('/members')">BTCH 15-B Profiling <i class="bi bi-chevron-down nav-arrow"></i></a>
            <div class="nav-dropdown-menu">
              <a href="#/members" onclick="router.navigate('/members')"><i class="bi bi-people"></i><span><strong>All Members</strong><small>Batch 15-B class directory</small></span></a>
            </div>
          </div>
          <div class="nav-dropdown">
            <a href="#/contact" class="nav-dropdown-trigger ${router.currentPath === '/contact' ? 'active' : ''}" onclick="router.navigate('/contact')">Contact <i class="bi bi-chevron-down nav-arrow"></i></a>
            <div class="nav-dropdown-menu">
              <a href="#/contact" onclick="router.navigate('/contact')"><i class="bi bi-chat-dots"></i><span><strong>Get in Touch</strong><small>Send us a message</small></span></a>
            </div>
          </div>
        </div>
        <div class="public-navbar-actions">
          ${user ? `<button class="btn btn-sm btn-ghost" onclick="router.navigate('/dashboard')"><i class="bi bi-speedometer2"></i> Dashboard</button>` : `<button class="btn btn-sm btn-ghost" onclick="router.navigate('/login')"><i class="bi bi-box-arrow-in-right"></i> Login</button><button class="btn btn-sm btn-primary" onclick="router.navigate('/register')">Register</button>`}
        </div>
        <button class="btn btn-sm btn-ghost mobile-menu-btn d-md-none" onclick="toggleMobileMenu()"><i class="bi bi-list fs-4"></i></button>
      </nav>
      <div class="mobile-menu" id="mobileMenu">
        <div class="mobile-menu-brand"><img class="brand-logo-img" src="logo.png" alt="CS15 Hub — Batch 15 logo" width="40" height="40"><span class="fw-bold">CS15 Hub</span></div>
        <a href="#/" onclick="router.navigate('/');toggleMobileMenu()"><i class="bi bi-house"></i> Home</a>
        <a href="#/about" onclick="router.navigate('/about');toggleMobileMenu()"><i class="bi bi-info-circle"></i> About</a>
        <a href="#/projects" onclick="router.navigate('/projects');toggleMobileMenu()"><i class="bi bi-columns-gap"></i> Projects</a>
        <a href="#/gallery" onclick="router.navigate('/gallery');toggleMobileMenu()"><i class="bi bi-images"></i> Gallery</a>
        <a href="#/members" onclick="router.navigate('/members');toggleMobileMenu()"><i class="bi bi-people"></i> BTCH 15-B Profiling</a>
        <a href="#/contact" onclick="router.navigate('/contact');toggleMobileMenu()"><i class="bi bi-chat-dots"></i> Contact</a>
        <hr>
        ${user
          ? `<a href="#/dashboard" onclick="router.navigate('/dashboard');toggleMobileMenu()"><i class="bi bi-speedometer2"></i> Dashboard</a>`
          : `<a href="#/login" onclick="router.navigate('/login');toggleMobileMenu()"><i class="bi bi-box-arrow-in-right"></i> Login</a>
             <a href="#/register" onclick="router.navigate('/register');toggleMobileMenu()"><i class="bi bi-person-plus"></i> Register</a>`}
      </div>
    `;
  },

  home() {
    return `
      ${this.renderPublicNavbar()}
      <div class="public-page">
        <!-- HERO SECTION -->
        <section class="hero-section">
          <div class="container">
            <div class="hero-layout">
              <div class="hero-text-col animate-fadeInLeft">
                <div class="mb-4"><span class="badge badge-info"><i class="bi bi-mortarboard-fill"></i> CS Batch 15 — Academic Year 2025/2026</span></div>
                <h1 class="hero-title">Where Future<br>Engineers Are Built</h1>
                <p class="hero-subtitle">Jazeera University's Computer Science Batch 15 platform — a student-built ecosystem for learning, building, and working together. Home to a documented class directory of 58 Batch 15-B members and 7 active semester courses.</p>
                <div class="hero-actions">
                  <button class="btn btn-primary btn-lg" onclick="router.navigate('/members')"><i class="bi bi-people"></i> View BTCH 15-B Profiling</button>
                  <button class="btn btn-secondary btn-lg" onclick="router.navigate('/about')"><i class="bi bi-play-circle"></i> Learn More</button>
                </div>
                <div class="mt-6 d-flex gap-4 flex-wrap" id="heroStats">
                  <div class="text-center p-3" style="min-width:100px"><div class="fw-bold fs-3 text-primary"><span data-count="58" data-duration="1200">0</span></div><div class="text-secondary text-sm">Class Members Profiled</div></div>
                  <div class="text-center p-3" style="min-width:100px"><div class="fw-bold fs-3 text-primary"><span data-count="7" data-duration="1200">0</span></div><div class="text-secondary text-sm">Active Courses</div></div>
                  <div class="text-center p-3" style="min-width:100px"><div class="fw-bold fs-3 text-primary"><span data-count="10" data-duration="1000">0</span><span class="fs-5">+</span></div><div class="text-secondary text-sm">Integrated Modules</div></div>
                  <div class="text-center p-3" style="min-width:100px"><div class="fw-bold fs-3 text-primary"><span data-count="1" data-duration="800">0</span></div><div class="text-secondary text-sm">Connected Batch Community</div></div>
                </div>
              </div>
              <div class="hero-visual-col animate-fadeInRightScale">
                <div class="hero-badge-text"><span class="typing-text" id="heroRotatingText">Computer Science — Batch 15</span><span class="typing-cursor">|</span></div>
                <div class="laptop-mockup float-anim">
                  <div class="laptop-screen">
                    <div class="laptop-notch"></div>
                    <div class="laptop-screen-inner">
                      <div class="dashboard-preview">
                        <div class="dash-topbar">
                          <div class="dash-welcome">Welcome, <span>Batch 15-B</span> 👋</div>
                          <div class="dash-actions">
                            <div class="dash-notification">
                              <i class="bi bi-bell"></i>
                              <div class="dash-notification-dot"></div>
                            </div>
                            <div class="dash-avatar">B</div>
                          </div>
                        </div>
                        <div class="dash-body">
                          <div class="dash-sidebar">
                            <div class="dash-sidebar-item active"><i class="bi bi-speedometer2"></i></div>
                            <div class="dash-sidebar-item"><i class="bi bi-book"></i></div>
                            <div class="dash-sidebar-item"><i class="bi bi-folder"></i></div>
                            <div class="dash-sidebar-item"><i class="bi bi-people"></i></div>
                            <div class="dash-sidebar-item"><i class="bi bi-chat"></i></div>
                            <div class="dash-sidebar-item"><i class="bi bi-graph-up"></i></div>
                            <div class="dash-sidebar-item"><i class="bi bi-gear"></i></div>
                          </div>
                          <div class="dash-main">
                            <div class="dash-stats">
                              <div class="dash-stat">
                                <div class="dash-stat-value blue" data-count="58" data-duration="1500">0</div>
                                <div class="dash-stat-label">Profiled Members</div>
                              </div>
                              <div class="dash-stat">
                                <div class="dash-stat-value green" data-count="7" data-duration="1000">0</div>
                                <div class="dash-stat-label">Active Courses</div>
                              </div>
                              <div class="dash-stat">
                                <div class="dash-stat-value purple" data-count="10" data-suffix="+" data-duration="1200">0</div>
                                <div class="dash-stat-label">Modules</div>
                              </div>
                            </div>
                            <div class="dash-bottom">
                              <div class="dash-activity">
                                <div class="dash-activity-title">Recent Activity</div>
                                <div class="dash-activity-item"><div class="dash-activity-dot green"></div><span class="dash-activity-text">New project submitted</span><span class="dash-activity-time">2m ago</span></div>
                                <div class="dash-activity-item"><div class="dash-activity-dot blue"></div><span class="dash-activity-text">Assignment graded</span><span class="dash-activity-time">15m ago</span></div>
                                <div class="dash-activity-item"><div class="dash-activity-dot yellow"></div><span class="dash-activity-text">New announcement</span><span class="dash-activity-time">1h ago</span></div>
                                <div class="dash-activity-item"><div class="dash-activity-dot green"></div><span class="dash-activity-text">Challenge completed</span><span class="dash-activity-time">2h ago</span></div>
                              </div>
                              <div class="dash-chart">
                                <div class="dash-chart-title">Engagement</div>
                                <div class="dash-chart-visual">
                                  <div class="dash-chart-bar"></div><div class="dash-chart-bar"></div><div class="dash-chart-bar"></div><div class="dash-chart-bar"></div><div class="dash-chart-bar"></div><div class="dash-chart-bar"></div><div class="dash-chart-bar"></div><div class="dash-chart-bar"></div><div class="dash-chart-bar"></div><div class="dash-chart-bar"></div>
                                </div>
                                <div class="dash-chart-label"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="laptop-base"></div>
                  <div class="laptop-glow"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- FEATURES SECTION -->
        <section class="section reveal" style="background:var(--bg-secondary)">
          <div class="container">
            <div class="section-title">
              <h2>Everything You Need to Succeed</h2>
              <p>A complete academic ecosystem designed for CS Batch 15 students, faculty, and administrators. Eight integrated modules powering every aspect of your academic journey.</p>
            </div>
            <div class="grid-3 stagger-children">
              <div class="card card-hover p-4 text-center">
                <div class="stat-card-icon blue mx-auto mb-3"><i class="bi bi-book"></i></div>
                <h5>Learning Management System</h5>
                <p class="text-secondary text-sm mt-2">Access course materials, submit assignments, track grades, and monitor attendance. The current semester runs 7 active courses: PHP, MySQL, Operating System, Operations Research, Network, Embedded System, and Data Structure.</p>
              </div>
              <div class="card card-hover p-4 text-center">
                <div class="stat-card-icon green mx-auto mb-3"><i class="bi bi-code-slash"></i></div>
                <h5>Projects & Portfolio Builder</h5>
                <p class="text-secondary text-sm mt-2">Showcase your work with a professional portfolio, collaborate on team projects, and get feedback from faculty.</p>
              </div>
              <div class="card card-hover p-4 text-center">
                <div class="stat-card-icon purple mx-auto mb-3"><i class="bi bi-trophy"></i></div>
                <h5>Challenges & Gamification</h5>
                <p class="text-secondary text-sm mt-2">Participate in coding challenges, earn XP and badges, and climb the class leaderboard.</p>
              </div>
              <div class="card card-hover p-4 text-center">
                <div class="stat-card-icon yellow mx-auto mb-3"><i class="bi bi-chat-dots"></i></div>
                <h5>Messaging System</h5>
                <p class="text-secondary text-sm mt-2">Connect with classmates and faculty through the built-in messaging platform with real-time conversations.</p>
              </div>
              <div class="card card-hover p-4 text-center">
                <div class="stat-card-icon pink mx-auto mb-3"><i class="bi bi-check2-square"></i></div>
                <h5>Elections & Democratic Voting</h5>
                <p class="text-secondary text-sm mt-2">Participate in student council elections with a transparent voting system and view results in real time.</p>
              </div>
              <div class="card card-hover p-4 text-center">
                <div class="stat-card-icon orange mx-auto mb-3"><i class="bi bi-shield-check"></i></div>
                <h5>Security Operations Center</h5>
                <p class="text-secondary text-sm mt-2">Hands-on SOC experience with real-time monitoring, threat detection tools, and incident response workflows built into the platform.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- ACHIEVEMENTS SECTION -->
        <section class="section reveal">
          <div class="container">
            <div class="section-title">
              <h2>CS15 Hub at a Glance</h2>
              <p>What the platform looks like today — measured against real records held in the project.</p>
            </div>
            <div class="grid-4 stagger-children" id="achievementsGrid">
              ${UI.skeleton('stat', 4)}
            </div>
          </div>
        </section>

        <!-- PROFILE DIRECTORY SECTION -->
        <section class="section reveal" style="background:var(--bg-secondary)">
          <div class="container">
            <div class="section-title">
              <h2>Meet Batch 15-B</h2>
              <p>An official class directory compiled from the BTCH 15-B Profiling document — learning styles, programming ability, interests, and unique skills of 58 classmates.</p>
            </div>
            <div class="text-center mt-2">
              <button class="btn btn-primary" onclick="router.navigate('/members')"><i class="bi bi-people"></i> Browse the Full Directory</button>
            </div>
          </div>
        </section>

        <!-- LATEST UPDATES SECTION -->
        <section class="section reveal">
          <div class="container">
            <div class="section-title">
              <h2>Latest Updates</h2>
              <p>Stay informed with the latest announcements, resources, blog posts, and activities from the CS15 community.</p>
            </div>
            <div class="grid-3 stagger-children" id="homePosts">
              ${UI.skeleton('card', 3)}
            </div>
            <div class="text-center mt-6">
              <button class="btn btn-outline" onclick="router.navigate('/posts')">View All Posts <i class="bi bi-arrow-right"></i></button>
            </div>
          </div>
        </section>

        <!-- CTA SECTION -->
        <section class="section reveal" style="background:linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(99, 102, 241, 0.05));border-top:1px solid var(--border-primary);border-bottom:1px solid var(--border-primary)">
          <div class="container text-center">
            <h2 class="mb-3">Ready to Join the CS15 Community?</h2>
            <p class="text-secondary fs-5 mb-6" style="max-width:600px;margin-left:auto;margin-right:auto">Create your account today and unlock access to all courses, projects, challenges, and collaboration tools.</p>
            <div class="d-flex justify-center gap-4">
              <button class="btn btn-primary btn-lg" onclick="router.navigate('/register')"><i class="bi bi-person-plus"></i> Create Free Account</button>
              <button class="btn btn-secondary btn-lg" onclick="router.navigate('/about')"><i class="bi bi-info-circle"></i> Learn More</button>
            </div>
          </div>
        </section>

        <!-- FOOTER -->
        <footer style="background:var(--bg-secondary);border-top:1px solid var(--border-primary);padding:48px 0 32px">
          <div class="container">
            <div class="grid-4" style="gap:32px">
              <div>
                <a href="#/" onclick="router.navigate('/')" class="d-flex align-items-center gap-2 mb-3" style="text-decoration:none;color:inherit"><img class="brand-logo-img" src="logo.png" alt="CS15 Hub — Batch 15 logo" width="36" height="36"><span class="fw-bold fs-5">CS15 Hub</span></a>
                <p class="text-sm text-secondary" style="line-height:1.8">Jazeera University's Computer Science Batch 15 academic portal — a student-built hub for courses, projects, messaging, elections, and the official BTCH 15-B Profiling class directory.</p>
                <div class="d-flex gap-3 mt-4">
                  <span class="badge badge-info"><i class="bi bi-people"></i> 58 profiled members</span>
                </div>
              </div>
              <div>
                <h6 class="mb-4" style="font-size:0.95rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-tertiary)">Quick Links</h6>
                <div class="d-flex flex-column gap-2">
                  <a href="#/" class="text-sm text-secondary" onclick="router.navigate('/')" style="transition:all 0.2s"><i class="bi bi-chevron-right" style="font-size:0.65rem"></i> Home</a>
                  <a href="#/about" class="text-sm text-secondary" onclick="router.navigate('/about')" style="transition:all 0.2s"><i class="bi bi-chevron-right" style="font-size:0.65rem"></i> About Us</a>
                  <a href="#/projects" class="text-sm text-secondary" onclick="router.navigate('/projects')" style="transition:all 0.2s"><i class="bi bi-chevron-right" style="font-size:0.65rem"></i> Projects</a>
                  <a href="#/members" class="text-sm text-secondary" onclick="router.navigate('/members')" style="transition:all 0.2s"><i class="bi bi-chevron-right" style="font-size:0.65rem"></i> BTCH 15-B Profiling</a>
                  <a href="#/gallery" class="text-sm text-secondary" onclick="router.navigate('/gallery')" style="transition:all 0.2s"><i class="bi bi-chevron-right" style="font-size:0.65rem"></i> Gallery</a>
                  <a href="#/contact" class="text-sm text-secondary" onclick="router.navigate('/contact')" style="transition:all 0.2s"><i class="bi bi-chevron-right" style="font-size:0.65rem"></i> Contact</a>
                </div>
              </div>
              <div>
                <h6 class="mb-4" style="font-size:0.95rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-tertiary)">Resources</h6>
                <div class="d-flex flex-column gap-2">
                  <a href="#/posts" class="text-sm text-secondary" onclick="router.navigate('/posts')" style="transition:all 0.2s"><i class="bi bi-chevron-right" style="font-size:0.65rem"></i> Blog & News</a>
                  <a href="#/posts" class="text-sm text-secondary" onclick="router.navigate('/posts')" style="transition:all 0.2s"><i class="bi bi-chevron-right" style="font-size:0.65rem"></i> Study Resources</a>
                  <a href="#/challenges" class="text-sm text-secondary" onclick="router.navigate('/challenges')" style="transition:all 0.2s"><i class="bi bi-chevron-right" style="font-size:0.65rem"></i> Coding Challenges</a>
                  <a href="#/leaderboard" class="text-sm text-secondary" onclick="router.navigate('/leaderboard')" style="transition:all 0.2s"><i class="bi bi-chevron-right" style="font-size:0.65rem"></i> Leaderboard</a>
                  <a href="#/portfolio" class="text-sm text-secondary" onclick="router.navigate('/portfolio')" style="transition:all 0.2s"><i class="bi bi-chevron-right" style="font-size:0.65rem"></i> Student Portfolios</a>
                  <a href="#/login" class="text-sm text-secondary" onclick="router.navigate('/login')" style="transition:all 0.2s"><i class="bi bi-chevron-right" style="font-size:0.65rem"></i> Student Login</a>
                </div>
              </div>
              <div>
                <h6 class="mb-4" style="font-size:0.95rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-tertiary)">The Batch</h6>
                <div class="d-flex flex-column gap-3 text-sm text-secondary">
                  <div class="d-flex align-items-start gap-2"><i class="bi bi-geo-alt mt-1" style="color:var(--accent-primary)"></i><span>Jazeera University,<br>Computer Science Department</span></div>
                  <a href="#/members" class="d-flex align-items-center gap-2" style="color:inherit" onclick="router.navigate('/members')"><i class="bi bi-people" style="color:var(--accent-primary)"></i><span>View the class directory</span></a>
                  <a href="#/contact" class="d-flex align-items-center gap-2" style="color:inherit" onclick="router.navigate('/contact')"><i class="bi bi-chat-dots" style="color:var(--accent-primary)"></i><span>Get in touch</span></a>
                </div>
              </div>
            </div>
            <div class="divider mt-8"></div>
            <div class="d-flex justify-between items-center flex-wrap gap-3 mt-4">
              <div class="text-sm text-tertiary">&copy; 2025&ndash;2026 Jazeera University — CS Batch 15. All rights reserved.</div>
              <div class="text-sm text-tertiary">Built by the batch, for the batch.</div>
            </div>
          </div>
        </footer>
      </div>
    `;
  },

  async homeLoaded() {
    try {
      const res = await API.getPosts({});
      const container = document.getElementById('homePosts');
      if (container) {
        if (!res.items || !res.items.length) {
          container.innerHTML = '<div class="card p-6 text-center" style="grid-column:1/-1"><i class="bi bi-journal-text fs-1 text-tertiary"></i><h5 class="mt-3">No announcements yet</h5><p class="text-secondary text-sm">Latest updates from the class will appear here.</p></div>';
        } else {
          container.innerHTML = res.items.map(p => `
            <div class="post-card stagger-item">
              <div class="post-card-image d-flex align-items-center justify-content-center" style="background:linear-gradient(135deg, var(--bg-tertiary), var(--bg-card))">
                <i class="bi bi-${p.type === 'announcement' ? 'megaphone' : p.type === 'blog' ? 'pencil-square' : p.type === 'resource' ? 'folder' : p.type === 'challenge' ? 'lightning' : p.type === 'project' ? 'journal-code' : 'images'} fs-1 text-tertiary"></i>
              </div>
              <div class="post-card-body">
                <div class="post-card-meta">
                  <span class="post-card-category ${p.type}">${p.type}</span>
                  <span>${UI.formatDate(p.publishedAt)}</span>
                  <span><i class="bi bi-eye"></i> ${p.views}</span>
                </div>
                <h3 class="post-card-title">${esc(p.title)}</h3>
                <p class="post-card-excerpt">${esc(p.excerpt)}</p>
                <div class="d-flex flex-wrap gap-1 mb-3">${p.tags.slice(0, 3).map(t => UI.badge(t, 'gray')).join('')}</div>
                <div class="post-card-footer">
                  <button class="btn btn-sm btn-ghost" onclick="router.navigate('/posts/'+encodeURIComponent('${p.slug}'))">Read More <i class="bi bi-arrow-right"></i></button>
                  <div class="d-flex align-items-center gap-2 text-tertiary text-sm"><i class="bi bi-heart"></i> ${p.likes}</div>
                </div>
              </div>
            </div>
          `).join('');
        }
      }
      // Load achievements
      const achievements = await API.getAchievements();
      const achContainer = document.getElementById('achievementsGrid');
      if (achContainer) {
        achContainer.innerHTML = achievements.map(a => UI.statCard(a.icon, a.value, a.label, null, a.color)).join('');
        UI.initCounters(achContainer);
      }
      UI.initCounters();
      UI.initScrollReveal();
      // Rotate badge text above laptop with typing effect
      const phrases = [
        'Computer Science — Batch 15',
        'Where Future Engineers Are Built',
        'Innovate. Create. Inspire.',
        'Jazeera University CS Program',
        'Building Tomorrow\'s Leaders'
      ];
      const txt = document.getElementById('heroRotatingText');
      if (txt) {
        let idx = 0;
        let typingTimer = null;
        function typePhrase(text) {
          if (typingTimer) clearInterval(typingTimer);
          txt.textContent = '';
          let ci = 0;
          typingTimer = setInterval(() => {
            if (ci < text.length) {
              txt.textContent += text[ci];
              ci++;
            } else {
              clearInterval(typingTimer);
              typingTimer = null;
            }
          }, 50);
        }
        typePhrase(phrases[0]);
        setInterval(() => {
          idx = (idx + 1) % phrases.length;
          typePhrase(phrases[idx]);
        }, 4000);
      }
    } catch(e) { console.error(e); }
  },

  about() {
    return `
      ${this.renderPublicNavbar()}
      <div class="public-page">
        <section class="section reveal" style="padding-top:100px">
          <div class="container">
            <div class="row align-items-center">
              <div class="col-lg-6 animate-fadeInUp">
                <span class="badge badge-info mb-3"><i class="bi bi-info-circle"></i> About CS15 Hub</span>
                <h1 class="display-4 fw-bold mb-4">The Digital Home of CS Batch 15</h1>
                <p class="text-secondary fs-5 mb-4" style="line-height:1.8">CS15 Hub is Jazeera University's dedicated portal for Computer Science Batch 15 — a student-built ecosystem for course materials, assignments, projects, messaging, elections, and more. Batch 15-B is documented in the official "BTCH 15-B Profiling" class directory, which records 58 classmates and their courses, learning styles, interests, and unique skills.</p>
                <div class="d-flex gap-4 flex-wrap">
                  <div class="text-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md);min-width:100px"><div class="fw-bold fs-3 text-primary"><span data-count="2025" data-duration="800">0</span></div><div class="text-xs text-tertiary">Academic Year Started</div></div>
                  <div class="text-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md);min-width:100px"><div class="fw-bold fs-3 text-primary"><span data-count="58" data-duration="1200">0</span></div><div class="text-xs text-tertiary">Profiled Members</div></div>
                  <div class="text-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md);min-width:100px"><div class="fw-bold fs-3 text-primary"><span data-count="7" data-duration="1000">0</span></div><div class="text-xs text-tertiary">Active Courses</div></div>
                  <div class="text-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md);min-width:100px"><div class="fw-bold fs-3 text-primary"><span data-count="10" data-duration="1200">0</span>+</div><div class="text-xs text-tertiary">Integrated Modules</div></div>
                </div>
              </div>
              <div class="col-lg-6 mt-4 mt-lg-0 animate-fadeInUp">
                <div class="card p-6 text-center" style="min-height:340px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, rgba(37,99,235,0.05), rgba(99,102,241,0.05))">
                  <i class="bi bi-mortarboard-fill" style="font-size:5rem;color:var(--accent-primary);opacity:0.4"></i>
                  <h4 class="mt-4">CS Batch 15-B</h4>
                  <p class="text-secondary">Jazeera University — Department of Computer Science</p>
                  <div class="d-flex gap-3 mt-4">
                    <div><div class="fw-bold text-primary"><span data-count="58" data-duration="1000">0</span></div><div class="text-xs text-tertiary">Profiled Members</div></div>
                    <div class="divider-vertical" style="width:1px;background:var(--border-primary)"></div>
                    <div><div class="fw-bold text-primary"><span data-count="7" data-duration="1200">0</span></div><div class="text-xs text-tertiary">Courses</div></div>
                    <div class="divider-vertical" style="width:1px;background:var(--border-primary)"></div>
                    <div><div class="fw-bold text-primary"><span data-count="10" data-duration="1200">0</span>+</div><div class="text-xs text-tertiary">Modules</div></div>
                  </div>
                  <button class="btn btn-primary mt-4" onclick="router.navigate('/members')"><i class="bi bi-people"></i> Browse the Profiling</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="section reveal" id="about-mission" style="background:var(--bg-secondary)">
          <div class="container">
            <div class="section-title">
              <h2>Our Mission & Vision</h2>
              <p>The guiding principles that drive everything we build and every decision we make.</p>
            </div>
            <div class="grid-2">
              <div class="card p-6 card-hover">
                <div class="stat-card-icon blue mb-4"><i class="bi bi-bullseye"></i></div>
                <h4>Our Mission</h4>
                <p class="text-secondary mt-3" style="line-height:1.8">To provide CS Batch 15 students with a world-class digital platform that enhances learning outcomes through personalized tools, fosters meaningful collaboration between students and faculty, and prepares every graduate for successful careers in the ever-evolving technology landscape. We strive to create an inclusive environment where innovation thrives and every student has the resources they need to excel.</p>
              </div>
              <div class="card p-6 card-hover">
                <div class="stat-card-icon purple mb-4"><i class="bi bi-eye"></i></div>
                <h4>Our Vision</h4>
                <p class="text-secondary mt-3" style="line-height:1.8">To be the leading academic technology platform that sets the global standard for computer science education, innovation, and community engagement. We envision a future where every CS student has seamless access to cutting-edge educational tools, real-time collaboration capabilities, and a portfolio that showcases their journey from learner to industry-ready professional.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="section reveal" id="about-values">
          <div class="container">
            <div class="section-title">
              <h2>Our Core Values</h2>
              <p>The principles that define our approach to education and technology.</p>
            </div>
            <div class="grid-3 stagger-children">
              <div class="card card-hover p-4 text-center">
                <div class="stat-card-icon blue mx-auto mb-3"><i class="bi bi-star"></i></div>
                <h5>Excellence</h5>
                <p class="text-sm text-secondary mt-2">We pursue the highest standards in education, technology, and service delivery — always measured against the real work of the class.</p>
              </div>
              <div class="card card-hover p-4 text-center">
                <div class="stat-card-icon green mx-auto mb-3"><i class="bi bi-people"></i></div>
                <h5>Community</h5>
                <p class="text-sm text-secondary mt-2">We believe in the power of collaboration. The platform connects 58 profiled Batch 15-B classmates with faculty and administrators in one shared space.</p>
              </div>
              <div class="card card-hover p-4 text-center">
                <div class="stat-card-icon purple mx-auto mb-3"><i class="bi bi-lightbulb"></i></div>
                <h5>Innovation</h5>
                <p class="text-sm text-secondary mt-2">The platform is built by the batch, for the batch — combining course tools, projects, gamification, and even a security operations center for hands-on learning.</p>
              </div>
              <div class="card card-hover p-4 text-center">
                <div class="stat-card-icon yellow mx-auto mb-3"><i class="bi bi-shield-check"></i></div>
                <h5>Trust & Security</h5>
                <p class="text-sm text-secondary mt-2">Access is role-based and session-protected, and the integrated SOC dashboard provides hands-on experience with monitoring and incident workflows.</p>
              </div>
              <div class="card card-hover p-4 text-center">
                <div class="stat-card-icon pink mx-auto mb-3"><i class="bi bi-graph-up"></i></div>
                <h5>Growth</h5>
                <p class="text-sm text-secondary mt-2">We evolve continuously based on feedback from classmates and faculty, with updates adding new features and improving performance.</p>
              </div>
              <div class="card card-hover p-4 text-center">
                <div class="stat-card-icon orange mx-auto mb-3"><i class="bi bi-universal-access"></i></div>
                <h5>Inclusivity</h5>
                <p class="text-sm text-secondary mt-2">We design for everyone — accessible interfaces, multi-language support, and equal access to educational resources regardless of background.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="section reveal" id="about-journey" style="background:var(--bg-secondary)">
          <div class="container">
            <div class="section-title">
              <h2>Our Journey</h2>
              <p>How CS Batch 15 and its learning platform came together.</p>
            </div>
            <div class="timeline" id="aboutTimeline" style="padding-left:32px;max-width:800px;margin:0 auto">
              ${UI.skeleton('table', 3)}
            </div>
          </div>
        </section>

        <section class="section reveal" id="about-features">
          <div class="container">
            <div class="section-title">
              <h2>Platform Features</h2>
              <p>Integrated modules providing end-to-end support for the academic journey.</p>
            </div>
            <div class="grid-3 stagger-children">
              <div class="card card-hover p-4"><div class="stat-card-icon blue mb-3"><i class="bi bi-journal-text"></i></div><h5>Learning Management System</h5><p class="text-sm text-secondary mt-2">Full-featured LMS with course materials, assignment submission, automated grading, and attendance tracking. The current semester spans 7 active courses.</p></div>
              <div class="card card-hover p-4"><div class="stat-card-icon green mb-3"><i class="bi bi-folder"></i></div><h5>Content Management</h5><p class="text-sm text-secondary mt-2">Unified content system supporting blogs, announcements, study resources, and project documentation.</p></div>
              <div class="card card-hover p-4"><div class="stat-card-icon yellow mb-3"><i class="bi bi-person-badge"></i></div><h5>Portfolio Builder</h5><p class="text-sm text-secondary mt-2">Build and showcase your professional portfolio with project descriptions, technology stacks, and team collaborations. Share it with potential employers.</p></div>
              <div class="card card-hover p-4"><div class="stat-card-icon red mb-3"><i class="bi bi-lightning"></i></div><h5>Gamification Engine</h5><p class="text-sm text-secondary mt-2">Earn points and badges through challenges and assignments, then climb the class leaderboard.</p></div>
              <div class="card card-hover p-4"><div class="stat-card-icon purple mb-3"><i class="bi bi-chat"></i></div><h5>Real-time Messaging</h5><p class="text-sm text-secondary mt-2">Built-in messaging system with real-time conversations, typing indicators, file sharing, and group chats.</p></div>
              <div class="card card-hover p-4"><div class="stat-card-icon pink mb-3"><i class="bi bi-shield"></i></div><h5>Security Operations Center</h5><p class="text-sm text-secondary mt-2">Hands-on SOC dashboard with real-time monitoring, threat detection, IP tracking, and incident response workflows.</p></div>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  async aboutLoaded() {
    try {
      const timeline = await API.getTimeline();
      const container = document.getElementById('aboutTimeline');
      if (!container) return;
      container.innerHTML = timeline.map(t => `
        <div class="timeline-item stagger-item">
          <div class="timeline-dot green"></div>
          <div class="timeline-content">
            <div class="d-flex align-items-center gap-3 mb-2">
              <span class="badge badge-primary" style="font-size:0.8rem;padding:4px 12px">${t.year}</span>
              <h5 style="margin:0">${esc(t.title)}</h5>
            </div>
            <p class="text-secondary text-sm" style="line-height:1.8">${esc(t.description)}</p>
          </div>
        </div>
      `).join('');
      UI.initCounters();
      UI.initScrollReveal();
      // Handle pending scroll-to-section
      if (_pendingScrollTo) {
        const el = document.getElementById(_pendingScrollTo);
        if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        _pendingScrollTo = null;
      }
    } catch(e) { console.error(e); }
  },

  projects() {
    return `
      ${this.renderPublicNavbar()}
      <div class="public-page">
        <section class="section reveal" style="padding-top:100px">
          <div class="container">
            ${UI.section('Student Projects', 'Projects submitted by CS Batch 15 students through the platform.')}
            <div class="d-flex gap-2 mb-4 flex-wrap" id="projectsFilters">
              <button class="btn btn-sm btn-primary" data-filter="all" onclick="filterProjects('all')">All Projects</button>
              <button class="btn btn-sm btn-secondary" data-filter="completed" onclick="filterProjects('completed')">Completed</button>
              <button class="btn btn-sm btn-secondary" data-filter="in_progress" onclick="filterProjects('in_progress')">In Progress</button>
              <button class="btn btn-sm btn-secondary" data-filter="planning" onclick="filterProjects('planning')">Planning</button>
            </div>
            <div class="grid-3 stagger-children" id="projectsGrid">
              ${UI.skeleton('card', 6)}
            </div>
          </div>
        </section>
      </div>
    `;
  },

  async projectsLoaded() {
    try {
      const projects = await API.getProjects();
      const container = document.getElementById('projectsGrid');
      if (!container) return;
      if (!projects || !projects.length) {
        container.innerHTML = '<div class="card p-6 text-center" style="grid-column:1/-1"><i class="bi bi-journal-code fs-1 text-tertiary"></i><h5 class="mt-3">No projects published yet</h5><p class="text-secondary text-sm">Student projects will appear here once they are submitted through the platform.</p></div>';
        return;
      }
      window._allProjects = projects;
      this.renderProjects(projects);
      UI.initCounters();
      UI.initScrollReveal();
      // Apply pending filter if any
      if (_pendingNavFilter && _pendingNavFilter.fn === 'filterProjects') {
        setTimeout(() => { filterProjects(_pendingNavFilter.arg); _pendingNavFilter = null; }, 100);
      }
    } catch(e) { console.error(e); }
  },

  renderProjects(projects) {
    const container = document.getElementById('projectsGrid');
    if (!container) return;
    const statusColors = { completed: 'success', in_progress: 'warning', planning: 'info' };
    const icons = ['bi-cart', 'bi-robot', 'bi-building', 'bi-cloud-sun', 'bi-map', 'bi-code-square'];
    container.innerHTML = projects.map(p => `
      <div class="project-card stagger-item" onclick="showProjectDetail(${p.id})">
        <div class="project-card-image" style="background:linear-gradient(135deg, ${p.id % 2 === 0 ? '#1e3a5f' : '#2d1b4e'}, var(--bg-tertiary))">
          <i class="bi ${icons[p.id % icons.length]} text-secondary" style="opacity:0.4;font-size:3.5rem"></i>
        </div>
        <div class="project-card-body">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <h5 class="project-card-title mb-0">${esc(p.title)}</h5>
            ${UI.badge(p.status.replace('_', ' '), statusColors[p.status])}
          </div>
          <p class="project-card-desc">${esc(p.description)}</p>
          <div class="project-card-tech mb-3">${(p.tech || []).map(t => `<span>${esc(t)}</span>`).join('')}</div>
          <div class="d-flex align-items-center justify-content-between">
            <span class="text-sm text-tertiary"><i class="bi bi-person"></i> ${esc(p.author_name || 'Student')}</span>
          </div>
          <div class="mt-3 pt-3" style="border-top:1px solid var(--border-primary)">
            <div class="d-flex gap-3 justify-content-between">
              ${p.github_url ? `<a href="${p.github_url}" target="_blank" class="btn btn-sm btn-ghost" onclick="event.stopPropagation()"><i class="bi bi-github"></i> Source</a>` : ''}
              ${p.demo_url ? `<a href="${p.demo_url}" target="_blank" class="btn btn-sm btn-ghost" onclick="event.stopPropagation()"><i class="bi bi-box-arrow-up-right"></i> Demo</a>` : ''}
            </div>
          </div>
        </div>
      </div>
    `).join('');
  },

  gallery() {
    return `
      ${this.renderPublicNavbar()}
      <div class="public-page">
        <section class="section reveal" style="padding-top:100px">
          <div class="container">
            ${UI.section('Gallery', 'Photos and moments from CS Batch 15 events, academic activities, social gatherings, and campus life.')}
            <div class="d-flex gap-2 mb-4 flex-wrap" id="galleryFilters">
              <button class="btn btn-sm btn-primary" data-filter="all" onclick="filterGallery('all')">All</button>
              <button class="btn btn-sm btn-secondary" data-filter="events" onclick="filterGallery('events')">Events</button>
              <button class="btn btn-sm btn-secondary" data-filter="academic" onclick="filterGallery('academic')">Academic</button>
              <button class="btn btn-sm btn-secondary" data-filter="social" onclick="filterGallery('social')">Social</button>
            </div>
            <div class="gallery-grid stagger-children" id="galleryGrid">
              ${UI.skeleton('card', 8)}
            </div>
          </div>
        </section>
      </div>
    `;
  },

  async galleryLoaded() {
    try {
      const res = await API.getGallery();
      const items = res.items || [];
      const container = document.getElementById('galleryGrid');
      if (!container) return;
      if (!items.length) {
        container.innerHTML = '<div class="card p-6 text-center" style="grid-column:1/-1"><i class="bi bi-images fs-1 text-tertiary"></i><h5 class="mt-3">No photos yet</h5><p class="text-secondary text-sm">Batch 15 photos will appear here once they are uploaded to the gallery.</p></div>';
        return;
      }
      window._allGallery = items;
      this.renderGallery(items);
      const countEl = document.getElementById('galleryCount');
      if (countEl) countEl.textContent = items.length + ' Photo' + (items.length !== 1 ? 's' : '');
      UI.initCounters();
      UI.initScrollReveal();
      // Apply pending filter if any
      if (_pendingNavFilter && _pendingNavFilter.fn === 'filterGallery') {
        setTimeout(() => { filterGallery(_pendingNavFilter.arg); _pendingNavFilter = null; }, 100);
      }
    } catch(e) { console.error(e); }
  },

  renderGallery(items) {
    const container = document.getElementById('galleryGrid');
    if (!container) return;
    const bgColors = ['#1e3a5f', '#2d1b4e', '#1a3d2b', '#3d2b1a', '#4a1a2b', '#1a2b4a', '#2b4a1a', '#4a2a1a'];
    container.innerHTML = items.map((item, i) => {
      const hasVideo = item.video_url;
      const hasImage = item.image_url;
      const modalContent = hasVideo
        ? `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;margin-bottom:16px"><iframe src="${item.video_url}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen></iframe></div><p class="text-secondary">${item.description || ''}</p><p class="text-sm text-tertiary mt-2"><i class="bi bi-person"></i> ${item.author_name || 'Unknown'} &bull; ${UI.formatDate(item.created_at)}</p>`
        : `<img src="${hasImage ? item.image_url : 'https://placehold.co/600x400/1e293b/ffffff?text=' + encodeURIComponent(item.title)}" style="width:100%;border-radius:8px;max-height:70vh;object-fit:cover"><p class="mt-3 text-secondary">${item.description || ''}</p><p class="text-sm text-tertiary"><i class="bi bi-person"></i> ${item.author_name || 'Unknown'} &bull; ${UI.formatDate(item.created_at)}</p>`;
      const escapedTitle = item.title.replace(/'/g, "\\'");
      const escapedContent = modalContent.replace(/'/g, "\\'");
      return `
      <div class="gallery-item stagger-item" onclick="UI.showModal('${escapedTitle}', '${escapedContent}')">
        ${hasImage
          ? `<img src="${item.image_url}" alt="${item.title}" style="width:100%;height:100%;object-fit:cover">`
          : hasVideo
            ? `<div style="width:100%;height:100%;background:#1a1a2e;display:flex;align-items:center;justify-content:center;font-size:3rem;color:rgba(255,255,255,0.3)"><i class="bi bi-play-circle"></i></div>`
            : `<div style="width:100%;height:100%;background:${bgColors[i % bgColors.length]};display:flex;align-items:center;justify-content:center;font-size:3rem;color:rgba(255,255,255,0.2)"><i class="bi bi-${['camera','laptop','people','award','book','people','moon','easel'][i % 8]}"></i></div>`}
        <div class="gallery-item-overlay">
          <div class="gallery-item-title">${esc(item.title)}</div>
          <div class="gallery-item-desc">${esc(item.description || '')}</div>
        </div>
      </div>`;
    }).join('');
  },

  members() {
    return `
      ${this.renderPublicNavbar()}
      <div class="public-page">
        <section class="section reveal" style="padding-top:100px">
          <div class="container">
            <div class="directory-hero">
              <h1 class="directory-hero-title">CS Batch 15-B <span class="text-accent">Profiles</span></h1>
              <p class="directory-hero-sub">Connect with your batchmates — skills, interests, languages, and links to everything they build and share.</p>
              <div class="d-flex gap-2 flex-wrap justify-center" id="dirHeroStats"></div>
            </div>

            <div class="card directory-toolbar p-4">
              <div class="directory-search-row">
                <div class="directory-search">
                  <i class="bi bi-search"></i>
                  <input type="text" id="memberSearch" placeholder="Search name, skill, interest..." oninput="memberSearchDebounced(this.value)">
                </div>
                <button class="btn btn-secondary btn-sm" onclick="resetMemberFilters()"><i class="bi bi-arrow-counterclockwise"></i> Reset</button>
              </div>
              <div class="directory-filters">
                <select id="memberLevelFilter" class="form-select" onchange="filterMembers()"><option value="">All levels</option></select>
                <select id="memberSkillFilter" class="form-select" onchange="filterMembers()"><option value="">All skills</option></select>
                <select id="memberInterestFilter" class="form-select" onchange="filterMembers()"><option value="">All interests</option></select>
                <select id="memberLangFilter" class="form-select" onchange="filterMembers()"><option value="">All languages</option></select>
                <button class="btn btn-sm btn-ghost" id="memberSortBtn" onclick="toggleMemberSort()"><i class="bi bi-sort-alpha-down"></i> <span id="memberSortLabel">Name</span></button>
              </div>
              <div class="text-sm text-tertiary mt-3" id="membersCount"></div>
            </div>

            <div class="members-grid stagger-children" id="membersGrid">
              ${UI.skeleton('card', 8)}
            </div>
            <div class="text-center mt-4" id="memberLoadMore" style="display:none">
              <button class="btn btn-outline btn-sm" onclick="memberLoadMore()"><i class="bi bi-plus-lg"></i> Load more</button>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  async membersLoaded() {
    const container = document.getElementById('membersGrid');
    if (!container) return;
    window._memberDir = { page: 1, per_page: 60, total: 0, sort: 'name' };

    try {
      const facets = await API.getMemberFacets();
      const set = (id, items) => {
        const sel = document.getElementById(id);
        if (!sel || !items) return;
        items.forEach(v => { const o = document.createElement('option'); o.value = v; o.textContent = v; sel.appendChild(o); });
      };
      set('memberLevelFilter', facets.levels);
      set('memberSkillFilter', facets.skills);
      set('memberInterestFilter', facets.interests);
      set('memberLangFilter', facets.languages);
    } catch (e) {}

    window._memberDir.sort = 'name';
    await memberFetchAndRender();
  },

  contact() {
    return `
      ${this.renderPublicNavbar()}
      <div class="public-page">
        <section class="section reveal" style="padding-top:100px">
          <div class="container">
            <div class="row">
              <div class="col-lg-5 animate-fadeInUp">
                ${UI.section('Get in Touch', 'Questions, suggestions, or feedback about the platform? The class admins are reachable through the contact details below, or catch us on campus.')}
                <div class="d-flex flex-column gap-4 mt-4">
                  <div class="contact-info-card"><div class="contact-info-icon"><i class="bi bi-geo-alt"></i></div><div><h6>Visit Our Campus</h6><p class="text-sm text-secondary mt-1">Jazeera University Main Campus<br>Computer Science Department</p></div></div>
                  <div class="contact-info-card"><div class="contact-info-icon"><i class="bi bi-person-badge"></i></div><div><h6>Email Us</h6><p class="text-sm text-secondary mt-1">Class representatives and faculty can be reached through the messaging system inside the platform, or via the university contact directory.</p></div></div>
                  <div class="contact-info-card"><div class="contact-info-icon"><i class="bi bi-clock"></i></div><div><h6>Office Hours</h6><p class="text-sm text-secondary mt-1">Follow the department's published semester schedule for lectures and office hours.</p></div></div>
                </div>
                <div class="d-flex gap-3 mt-4">
                  <div class="card p-3 text-center" style="flex:1;background:var(--bg-tertiary);border-color:transparent">
                    <i class="bi bi-chat-dots fs-4" style="color:var(--accent-primary)"></i>
                    <div class="text-xs text-tertiary mt-2">Ask in class</div>
                  </div>
                  <div class="card p-3 text-center" style="flex:1;background:var(--bg-tertiary);border-color:transparent">
                    <i class="bi bi-journal-text fs-4" style="color:var(--accent-success)"></i>
                    <div class="text-xs text-tertiary mt-2">Via the portal</div>
                  </div>
                  <div class="card p-3 text-center" style="flex:1;background:var(--bg-tertiary);border-color:transparent">
                    <i class="bi bi-person-badge fs-4" style="color:var(--accent-warning)"></i>
                    <div class="text-xs text-tertiary mt-2">Class reps</div>
                  </div>
                </div>
              </div>
              <div class="col-lg-6 offset-lg-1 mt-4 mt-lg-0 animate-fadeInUp">
                <div class="card p-6">
                  <h4 class="mb-2">Send Us a Message</h4>
                  <p class="text-sm text-secondary mb-4">The form below is a demo. For real questions, reach out to your class representatives or faculty.</p>
                  <form onsubmit="event.preventDefault();UI.showToast('Message Received','This contact form is a demo — reach out to the class admins using the details on this page.','success')">
                    <div class="grid-2">
                      <div class="form-group"><label class="form-label">Full Name <span class="text-danger">*</span></label><input class="form-input" placeholder="Your full name" required></div>
                      <div class="form-group"><label class="form-label">Email Address <span class="text-danger">*</span></label><input type="email" class="form-input" placeholder="your@email.com" required></div>
                    </div>
                    <div class="form-group"><label class="form-label">Subject</label>
                      <select class="form-select">
                        <option>General Inquiry</option>
                        <option>Technical Support</option>
                        <option>Academic Question</option>
                        <option>Feature Request</option>
                        <option>Report a Bug</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div class="form-group"><label class="form-label">Message <span class="text-danger">*</span></label><textarea class="form-textarea" rows="5" placeholder="Please describe your inquiry in detail..." required></textarea></div>
                    <button type="submit" class="btn btn-primary btn-lg w-100"><i class="bi bi-send"></i> Send Message</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  contactLoaded() {
    UI.initScrollReveal();
    UI.initCounters();
  },
};

// Global filter functions
function setActiveFilter(containerId, active) {
  document.querySelectorAll(`#${containerId} [data-filter]`).forEach(btn => {
    btn.className = btn.className.replace('btn-primary', 'btn-secondary');
    if (btn.dataset.filter === active) btn.className = btn.className.replace('btn-secondary', 'btn-primary');
  });
}

function filterProjects(status) {
  const projects = window._allProjects || [];
  if (status === 'all') { PublicPages.renderProjects(projects); } else { PublicPages.renderProjects(projects.filter(p => p.status === status)); }
  setActiveFilter('projectsFilters', status);
}

function filterGallery(category) {
  const items = window._allGallery || [];
  if (category === 'all') { PublicPages.renderGallery(items); } else { PublicPages.renderGallery(items.filter(i => i.category === category)); }
  setActiveFilter('galleryFilters', category);
}

// ——— Member directory (API-driven) ———
function memberSearchDebounced(value) {
  clearTimeout(window._memberDirSearchT);
  window._memberDirSearchT = setTimeout(() => {
    window._memberDir.query = (value || '').trim();
    window._memberDir.page = 1;
    memberFetchAndRender();
  }, 350);
}

function resetMemberFilters() {
  ['memberSearch', 'memberLevelFilter', 'memberSkillFilter', 'memberInterestFilter', 'memberLangFilter'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  window._memberDir.query = '';
  window._memberDir.page = 1;
  memberFetchAndRender();
}

function filterMembers() { window._memberDir.page = 1; memberFetchAndRender(); }

function toggleMemberSort() { setMemberSort(window._memberDir.sort === 'name' ? 'recent' : 'name'); }

function setMemberSort(s) {
  window._memberDir.sort = s;
  window._memberDir.page = 1;
  const btn = document.getElementById('memberSortBtn');
  if (btn) btn.innerHTML = (s === 'recent' ? '<i class="bi bi-clock-history"></i>' : '<i class="bi bi-sort-alpha-down"></i>') + ` <span>${s === 'recent' ? 'Recently added' : 'Name'}</span>`;
  memberFetchAndRender();
}

async function memberFetchAndRender() {
  const grid = document.getElementById('membersGrid');
  const countEl = document.getElementById('membersCount');
  if (!grid) return;
  const d = window._memberDir;
  const val = id => { const el = document.getElementById(id); return el ? el.value : ''; };
  const params = { page: d.page, per_page: d.per_page, sort: d.sort };
  if (d.query) params.search = d.query;
  if (val('memberLevelFilter')) params.level = val('memberLevelFilter');
  if (val('memberSkillFilter')) params.skills = val('memberSkillFilter');
  if (val('memberInterestFilter')) params.interests = val('memberInterestFilter');
  if (val('memberLangFilter')) params.language = val('memberLangFilter');

  grid.classList.add('is-loading');
  if (d.page === 1) grid.innerHTML = UI.skeleton('card', 8);
  try {
    const res = await API.getMembers(params);
    const list = res.members || [];
    d.total = res.total || list.length;
    renderMemberGrid(list);
    if (countEl) {
      const filtered = d.query || params.level || params.skills || params.interests || params.language;
      countEl.innerHTML = filtered
        ? `<i class="bi bi-funnel"></i> <strong>${d.total}</strong> matching member${d.total === 1 ? '' : 's'}`
        : `<i class="bi bi-people"></i> <strong>${d.total}</strong> batch member${d.total === 1 ? '' : 's'} in the directory`;
    }
    const moreBtn = document.getElementById('memberLoadMore');
    if (moreBtn) moreBtn.style.display = d.total > d.page * d.per_page ? '' : 'none';
  } catch (e) {
    grid.innerHTML = `<div class="empty-state col-full"><i class="bi bi-wifi-off"></i><p>Couldn't load the directory — check your connection and retry.</p></div>`;
    if (countEl) countEl.innerHTML = '';
  } finally {
    grid.classList.remove('is-loading');
  }
}

function memberLoadMore() {
  window._memberDir.per_page += 60;
  memberFetchAndRender();
}

function renderMemberGrid(list) {
  const grid = document.getElementById('membersGrid');
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = `<div class="empty-state col-full"><i class="bi bi-search"></i><p>No members match your filters.<br><span class="text-xs text-tertiary">Try clearing the search or choosing fewer filters.</span></p></div>`;
    return;
  }
  grid.innerHTML = list.map((db, i) => {
    const name = db.full_name || [db.first_name, db.middle_name, db.last_name, db.username].filter(Boolean).join(' ') || ('Member #' + db.id);
    const skillsArr = splitLines(db.skills);
    const chips = skillsArr.slice(0, 3).map(s => `<span class="chip chip-sm">${esc(s)}</span>`).join('');
    const extra = skillsArr.length > 3 ? `<span class="text-xs text-tertiary">+${skillsArr.length - 3}</span>` : '';
    const socials = miniSocials(db);
    return `
      <div class="member-card stagger-item" style="animation-delay:${Math.min(i * 45, 600)}ms" onclick="showMemberDetail(${db.id})">
        ${memberAvatarHtml(db, name)}
        <div class="member-card-name">${esc(name)}</div>
        <div class="member-card-role">${db.level ? esc(db.level) : ''}${db.year ? (db.level ? ' · ' : '') + esc(db.year) : ''}</div>
        <p class="member-card-bio">${esc(clampText(db.bio, 110))}</p>
        ${chips ? `<div class="member-chip-row">${chips}${extra}</div>` : ''}
        ${socials ? `<div class="member-socials">${socials}</div>` : ''}
        <div class="member-card-foot">
          ${db.has_account ? `<span class="badge badge-success badge-sm"><i class="bi bi-patch-check"></i> Verified</span>` : `<span class="text-xs text-tertiary">Roster entry</span>`}
          <span class="text-sm text-accent member-card-open">View profile <i class="bi bi-arrow-right"></i></span>
        </div>
      </div>
    `;
  }).join('');
  requestAnimationFrame(() => { if (window.UI && typeof UI.initScrollReveal === 'function') UI.initScrollReveal(); });
}

function memberAvatarHtml(db, name) {
  return db.picture_url
    ? `<div class="member-card-avatar"><img src="${db.picture_url}" alt="${esc(name)}" loading="lazy" onerror="this.parentElement.innerHTML='&lt;span&gt;${UI.getInitials(name)}&lt;/span&gt;';this.parentElement.style.background='${memberGradient(name)}'"><span class="avatar-fallback">${UI.getInitials(name)}</span></div>`
    : `<div class="member-card-avatar" style="background:${memberGradient(name)}"><span>${UI.getInitials(name)}</span></div>`;
}

function memberGradient(name) {
  const palettes = [
    'linear-gradient(135deg,#2563EB,#7c3aed)',
    'linear-gradient(135deg,#0d9488,#2563EB)',
    'linear-gradient(135deg,#dc2626,#f59e0b)',
    'linear-gradient(135deg,#db2777,#8b5cf6)',
    'linear-gradient(135deg,#059669,#0ea5e9)',
    'linear-gradient(135deg,#ea580c,#db2777)',
    'linear-gradient(135deg,#4f46e5,#0ea5e9)',
    'linear-gradient(135deg,#16a34a,#84cc16)',
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
}

function splitLines(s) { return s ? String(s).split('\n').map(x => x.trim()).filter(Boolean) : []; }

function clampText(s, n) {
  if (!s) return '';
  const t = String(s).replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n).trimEnd() + '…' : t;
}

function miniSocials(db) {
  const map = [
    ['bi-globe2', 'website', 'Website'],
    ['bi-github', 'github', 'GitHub'],
    ['bi-linkedin', 'linkedin', 'LinkedIn'],
    ['bi-twitter-x', 'twitter', 'X'],
    ['bi-facebook', 'facebook', 'Facebook'],
    ['bi-instagram', 'instagram', 'Instagram'],
  ];
  return map.filter(([ , key]) => db[key]).map(([icon, key, label]) =>
    `<a href="${memberSocialUrl(key, db[key])}" title="${label}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="bi ${icon}"></i></a>`
  ).join('');
}

function memberSocialUrl(key, value) {
  const v = String(value).trim();
  if (/^https?:\/\//i.test(v)) return v;
  const prefixes = {
    website: 'https://', github: 'https://github.com/', linkedin: 'https://linkedin.com/in/',
    twitter: 'https://twitter.com/', facebook: 'https://facebook.com/', instagram: 'https://instagram.com/',
  };
  return (prefixes[key] || 'https://') + v.replace(/^@/, '');
}

function showProjectDetail(id) {
  const projects = window._allProjects || [];
  const p = projects.find(pr => pr.id === id);
  if (!p) return;
  const statusColors = { completed: 'success', in_progress: 'warning', planning: 'info' };
  UI.showModal(p.title, `
    <div class="mb-4">
      <div class="d-flex justify-between items-center mb-3">
        <span class="badge badge-${statusColors[p.status]}">${p.status.replace('_', ' ')}</span>
        <span class="text-sm text-secondary"><i class="bi bi-person"></i> ${esc(p.author_name || 'Student')}</span>
      </div>
      <p class="text-secondary" style="line-height:1.8">${esc(p.description)}</p>
    </div>
    ${(p.tech || []).length ? `<div class="mb-4">
      <h6 class="mb-2">Technology Stack</h6>
      <div class="d-flex flex-wrap gap-2">${(p.tech || []).map(t => UI.badge(t, 'info')).join('')}</div>
    </div>` : ''}
    <div class="d-flex gap-3 mt-4 pt-4" style="border-top:1px solid var(--border-primary)">
      ${p.github_url ? `<a href="${p.github_url}" target="_blank" class="btn btn-sm btn-secondary"><i class="bi bi-github"></i> View Source</a>` : ''}
      ${p.demo_url ? `<a href="${p.demo_url}" target="_blank" class="btn btn-sm btn-primary"><i class="bi bi-box-arrow-up-right"></i> Live Demo</a>` : ''}
    </div>
  `);
}

async function showMemberDetail(id) {
  let db;
  try {
    const res = await API.getMember(id);
    db = res.member || res;
  } catch (e) { UI.toast('Couldn\'t load that profile.', 'error'); return; }
  if (!db || !db.id) return;

  const name = db.full_name || [db.first_name, db.middle_name, db.last_name].filter(Boolean).join(' ') || 'Member';
  const skillsArr = splitLines(db.skills);
  const languagesArr = splitLines(db.languages);
  const interestsArr = splitLines(db.interests);
  const certArr = splitLines(db.certificates);
  const term = [db.year, db.semester].filter(Boolean).join(' — ');
  const socials = [
    ['bi-globe2', 'website', 'Website'],
    ['bi-github', 'github', 'GitHub'],
    ['bi-linkedin', 'linkedin', 'LinkedIn'],
    ['bi-twitter-x', 'twitter', 'X'],
    ['bi-facebook', 'facebook', 'Facebook'],
    ['bi-instagram', 'instagram', 'Instagram'],
  ].filter(([ , key]) => db[key]).map(([icon, key, label]) =>
    `<a href="${memberSocialUrl(key, db[key])}" target="_blank" rel="noopener" class="btn btn-sm btn-secondary"><i class="bi ${icon}"></i> ${label}</a>`
  ).join('');

  UI.showModal(esc(name), `
    <div class="profile-modal">
      <div class="profile-modal-cover" style="background:${memberGradient(name)}">
        ${db.picture_url
          ? `<div class="profile-modal-avatar"><img src="${db.picture_url}" alt="${esc(name)}" onerror="this.closest('.profile-modal-avatar').outerHTML='&lt;div class=&quot;profile-modal-avatar&quot; style=&quot;background:${memberGradient(name)}&quot;&gt;${UI.getInitials(name)}&lt;/div&gt;'"></div>`
          : `<div class="profile-modal-avatar" style="background:${memberGradient(name)}">${UI.getInitials(name)}</div>`}
      </div>
      <div class="text-center mb-3">
        <h4 class="mt-2 mb-1">${esc(name)}</h4>
        <div class="d-flex gap-2 flex-wrap justify-center">
          ${db.has_account ? '<span class="badge badge-success"><i class="bi bi-patch-check"></i> Verified member</span>' : '<span class="badge badge-gray">Roster entry</span>'}
          ${db.level ? `<span class="badge badge-info">${esc(db.level)}</span>` : ''}
          ${db.source === 'roster' ? '<span class="badge badge-primary">Official roster</span>' : ''}
        </div>
        ${term ? `<p class="text-xs text-tertiary mt-2"><i class="bi bi-mortarboard"></i> ${esc(term)}</p>` : ''}
      </div>

      ${db.bio ? `<div class="mb-4"><h6 class="member-modal-label">About</h6><p class="text-sm text-secondary" style="line-height:1.8">${esc(db.bio)}</p></div>` : ''}

      ${skillsArr.length ? `<div class="mb-4"><h6 class="member-modal-label"><i class="bi bi-lightning-charge"></i> Skills & focus areas</h6><div class="d-flex flex-wrap gap-2">${skillsArr.map(s => `<span class="chip chip-sm chip-info">${esc(s)}</span>`).join('')}</div></div>` : ''}

      ${interestsArr.length ? `<div class="mb-4"><h6 class="member-modal-label"><i class="bi bi-heart"></i> Interests</h6><div class="d-flex flex-wrap gap-2">${interestsArr.map(i => `<span class="chip chip-sm chip-success">${esc(i)}</span>`).join('')}</div></div>` : ''}

      ${languagesArr.length ? `<div class="mb-4"><h6 class="member-modal-label"><i class="bi bi-translate"></i> Languages</h6><div class="d-flex flex-wrap gap-2">${languagesArr.map(l => `<span class="chip chip-sm">${esc(l)}</span>`).join('')}</div></div>` : ''}

      ${certArr.length ? `<div class="mb-4"><h6 class="member-modal-label"><i class="bi bi-trophy"></i> Certificates & achievements</h6>${certArr.map(c => `<div class="d-flex align-items-center gap-2 mb-1"><i class="bi bi-patch-check text-accent" style="font-size:0.75rem"></i><span class="text-sm text-secondary">${esc(c)}</span></div>`).join('')}</div>` : ''}

      ${db.email || db.email_contact ? `<div class="mb-4"><h6 class="member-modal-label"><i class="bi bi-envelope"></i> Contact</h6>${db.email ? `<p class="text-sm text-secondary mb-1"><i class="bi bi-envelope"></i> ${esc(db.email)}</p>` : ''}${db.email_contact ? `<p class="text-sm text-secondary"><i class="bi bi-envelope-open"></i> ${esc(db.email_contact)}</p>` : ''}</div>` : ''}

      ${socials ? `<div class="d-flex flex-wrap gap-2 mt-4 pt-4" style="border-top:1px solid var(--border-primary)">${socials}</div>` : ''}
    </div>
  `);
}

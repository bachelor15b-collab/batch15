/* ============================================
   CS15 Hub - Dashboard Page Templates (All Roles)
   ============================================ */

const Dashboards = {
  roleConfig: {
    user: { icon: 'bi-person-badge', label: 'User' },
    student: { icon: 'bi-mortarboard', label: 'Student' },
    teacher: { icon: 'bi-person-workspace', label: 'Teacher' },
    financial_admin: { icon: 'bi-cash-stack', label: 'Financial Admin' },
    educational_admin: { icon: 'bi-book', label: 'Educational Admin' },
    general_admin: { icon: 'bi-gear', label: 'General Admin' },
    monitor_admin: { icon: 'bi-shield', label: 'Monitor Admin' },
    sports_admin: { icon: 'bi-trophy', label: 'Sports Admin' },
    super_admin: { icon: 'bi-star', label: 'Super Admin' },
    soc: { icon: 'bi-shield-check', label: 'SOC Team' },
    operations_manager: { icon: 'bi-diagram-3', label: 'Operations Manager' },
  },

  sidebarSections: {
    user: [
      { title: 'Main', items: [
        { icon: 'bi-house-door', label: 'Website', route: '/' },
        { icon: 'bi-speedometer2', label: 'Dashboard', route: '/dashboard' },
        { icon: 'bi-person-badge', label: 'My Member Card', route: '/member-profile' },
        { icon: 'bi-info-circle', label: 'About Us', route: '/about' },
        { icon: 'bi-people', label: 'Our Members', route: '/members' },
        { icon: 'bi-images', label: 'Gallery', route: '/gallery' },
      ]},
      { title: 'Coming Soon', items: [
        { icon: 'bi-stars', label: 'User Features', route: '/dashboard/user' },
      ]},
    ],
    student: [
      { title: 'Main', items: [
        { icon: 'bi-house-door', label: 'Website', route: '/' },
        { icon: 'bi-speedometer2', label: 'Overview', route: '/dashboard' },
        { icon: 'bi-person-badge', label: 'My Member Card', route: '/member-profile' },
        { icon: 'bi-book', label: 'My Courses', route: '/courses' },
        { icon: 'bi-star', label: 'Grades', route: '/grades' },
        { icon: 'bi-trophy', label: 'Leaderboard', route: '/leaderboard' },
        { icon: 'bi-file-check', label: 'Assignments', route: '/assignments' },
        { icon: 'bi-journal-arrow-down', label: 'Lessons', route: '/lessons' },
        { icon: 'bi-people', label: 'Students', route: '/students' },
      ]},
      { title: 'Content', items: [
        { icon: 'bi-journal-text', label: 'Posts', route: '/posts' },
        { icon: 'bi-pencil-square', label: 'Create Post', route: '/posts/create' },
        { icon: 'bi-lightning', label: 'Challenges', route: '/challenges' },
        { icon: 'bi-controller', label: 'Quiz Arena', route: '/quiz' },
        { icon: 'bi-youtube', label: 'Video Courses', route: '/videos' },
      ]},
      { title: 'Community', items: [
        { icon: 'bi-chat-dots', label: 'Messages', route: '/messages' },
        { icon: 'bi-bell', label: 'Notifications', route: '/notifications' },
      ]},
    ],
    teacher: [
      { title: 'Main', items: [
        { icon: 'bi-house-door', label: 'Website', route: '/' },
        { icon: 'bi-speedometer2', label: 'Overview', route: '/dashboard' },
        { icon: 'bi-book', label: 'My Courses', route: '/courses' },
        { icon: 'bi-file-check', label: 'Assignments', route: '/assignments' },
        { icon: 'bi-journal-arrow-down', label: 'Lessons', route: '/lessons' },
        { icon: 'bi-people', label: 'Students', route: '/students' },
      ]},
      { title: 'Content', items: [
        { icon: 'bi-journal-text', label: 'Posts', route: '/posts' },
        { icon: 'bi-pencil-square', label: 'Create Post', route: '/posts/create' },
        { icon: 'bi-lightning', label: 'Challenges', route: '/challenges' },
        { icon: 'bi-controller', label: 'Quiz Arena', route: '/quiz' },
        { icon: 'bi-youtube', label: 'Video Courses', route: '/videos' },
      ]},
      { title: 'Community', items: [
        { icon: 'bi-chat-dots', label: 'Messages', route: '/messages' },
        { icon: 'bi-bell', label: 'Notifications', route: '/notifications' },
      ]},
    ],
    admin: [
      { title: 'Main', items: [
        { icon: 'bi-house-door', label: 'Website', route: '/' },
        { icon: 'bi-speedometer2', label: 'Overview', route: '/dashboard' },
        { icon: 'bi-people', label: 'Users', route: '/users' },
        { icon: 'bi-gear', label: 'Settings', route: '/settings' },
      ]},
      { title: 'Academics', items: [
        { icon: 'bi-book', label: 'My Courses', route: '/courses' },
        { icon: 'bi-star', label: 'Grades', route: '/grades' },
      ]},
      { title: 'Management', items: [
        { icon: 'bi-journal-text', label: 'Posts', route: '/posts' },
        { icon: 'bi-file-check', label: 'Reports', route: '/reports' },
        { icon: 'bi-lightning', label: 'Challenges', route: '/challenges' },
        { icon: 'bi-controller', label: 'Quiz Arena', route: '/quiz' },
        { icon: 'bi-youtube', label: 'Video Courses', route: '/videos' },
        { icon: 'bi-bell', label: 'Notifications', route: '/notifications' },
      ]},
    ],
    soc: [
      { title: 'Main', items: [
        { icon: 'bi-house-door', label: 'Website', route: '/' },
        { icon: 'bi-speedometer2', label: 'Overview', panel: 'overview' },
        { icon: 'bi-shield-exclamation', label: 'Alerts', panel: 'alerts' },
        { icon: 'bi-box-arrow-in-right', label: 'Login Attempts', panel: 'login-attempts' },
        { icon: 'bi-list-ul', label: 'Activity Logs', panel: 'activity-logs' },
      ]},
      { title: 'Security', items: [
        { icon: 'bi-exclamation-triangle', label: 'Suspicious IPs', panel: 'suspicious-ips' },
        { icon: 'bi-slash-circle', label: 'Blocked IPs', panel: 'blocked-ips' },
      ]},
      { title: 'Users', items: [
        { icon: 'bi-people', label: 'User Management', panel: 'soc-users' },
      ]},
      { title: 'Analysis', items: [
        { icon: 'bi-graph-up', label: 'Reports', route: '/reports' },
        { icon: 'bi-clock', label: 'Timeline', route: '/timeline' },
        { icon: 'bi-bar-chart', label: 'Elections', route: '/elections' },
        { icon: 'bi-journal-arrow-down', label: 'Lessons', route: '/lessons' },
        { icon: 'bi-book', label: 'My Courses', route: '/courses' },
        { icon: 'bi-star', label: 'Grades', route: '/grades' },
        { icon: 'bi-controller', label: 'Quiz Arena', route: '/quiz' },
        { icon: 'bi-youtube', label: 'Video Courses', route: '/videos' },
      ]},
    ],
    financial_admin: [
      { title: 'Main', items: [
        { icon: 'bi-house-door', label: 'Website', route: '/' },
        { icon: 'bi-speedometer2', label: 'Overview', panel: 'overview' },
      ]},
      { title: 'Financial Management', items: [
        { icon: 'bi-cash-coin', label: 'Payments', panel: 'financial' },
      ]},
      { title: 'Academics', items: [
        { icon: 'bi-book', label: 'My Courses', route: '/courses' },
        { icon: 'bi-star', label: 'Grades', route: '/grades' },
      ]},
      { title: 'Community', items: [
        { icon: 'bi-chat-dots', label: 'Messages', route: '/messages' },
        { icon: 'bi-bell', label: 'Notifications', route: '/notifications' },
        { icon: 'bi-lightning', label: 'Challenges', route: '/challenges' },
        { icon: 'bi-controller', label: 'Quiz Arena', route: '/quiz' },
        { icon: 'bi-youtube', label: 'Video Courses', route: '/videos' },
      ]},
    ],
    super_admin: [
      { title: 'Main', items: [
        { icon: 'bi-house-door', label: 'Website', route: '/' },
        { icon: 'bi-speedometer2', label: 'Overview', panel: 'overview' },
      ]},
      { title: 'User Management', items: [
        { icon: 'bi-people', label: 'Users', panel: 'users' },
        { icon: 'bi-person-badge', label: 'Role Assignment', panel: 'roles' },
        { icon: 'bi-person-check', label: 'Members', panel: 'members' },
        { icon: 'bi-patch-check', label: 'Member Claims', panel: 'claims' },
      ]},
      { title: 'Security', items: [
        { icon: 'bi-shield-check', label: 'SOC Panel', panel: 'security' },
      ]},
      { title: 'Content', items: [
        { icon: 'bi-journal-text', label: 'Content Center', panel: 'content' },
        { icon: 'bi-journal-arrow-down', label: 'Lessons', panel: 'lessons' },
        { icon: 'bi-controller', label: 'Quiz Manager', panel: 'quiz-manage' },
        { icon: 'bi-youtube', label: 'Video Courses', panel: 'video-courses' },
        { icon: 'bi-images', label: 'Gallery', panel: 'gallery' },
      ]},
      { title: 'Academics', items: [
        { icon: 'bi-book', label: 'My Courses', route: '/courses' },
        { icon: 'bi-bookmark', label: 'Course Management', panel: 'courses' },
        { icon: 'bi-star', label: 'Grades', panel: 'grades' },
      ]},
      { title: 'Analytics', items: [
        { icon: 'bi-graph-up', label: 'Analytics', panel: 'analytics' },
      ]},
      { title: 'Finance', items: [
        { icon: 'bi-cash-coin', label: 'Financial', panel: 'financial' },
      ]},
      { title: 'Community', items: [
        { icon: 'bi-chat-dots', label: 'Messages', route: '/messages' },
        { icon: 'bi-bell', label: 'Notifications', panel: 'notifications' },
        { icon: 'bi-check2-square', label: 'Elections', panel: 'elections' },
        { icon: 'bi-lightning', label: 'Challenges', route: '/challenges' },
      ]},
      { title: 'System', items: [
        { icon: 'bi-list-ul', label: 'Audit Logs', panel: 'audit' },
        { icon: 'bi-gear', label: 'System Config', panel: 'config' },
        { icon: 'bi-lock', label: 'Dashboard Access', panel: 'access' },
        { icon: 'bi-cloud-arrow-down', label: 'Backup & Security', panel: 'backup' },
      ]},
    ],
    general_admin: [
      { title: 'Main', items: [
        { icon: 'bi-house-door', label: 'Website', route: '/' },
        { icon: 'bi-speedometer2', label: 'Overview', panel: 'overview' },
      ]},
      { title: 'User Management', items: [
        { icon: 'bi-people', label: 'Users', panel: 'users' },
        { icon: 'bi-person-check', label: 'Members', panel: 'members' },
        { icon: 'bi-patch-check', label: 'Member Claims', panel: 'claims' },
      ]},
      { title: 'Academics', items: [
        { icon: 'bi-book', label: 'My Courses', route: '/courses' },
        { icon: 'bi-star', label: 'Grades', route: '/grades' },
      ]},
      { title: 'Finance', items: [
        { icon: 'bi-cash-coin', label: 'Financial', panel: 'financial' },
      ]},
      { title: 'Content', items: [
        { icon: 'bi-controller', label: 'Quiz Manager', panel: 'quiz-manage' },
        { icon: 'bi-youtube', label: 'Video Courses', panel: 'video-courses' },
        { icon: 'bi-images', label: 'Gallery', panel: 'gallery' },
      ]},
      { title: 'Community', items: [
        { icon: 'bi-chat-dots', label: 'Messages', panel: 'messages' },
        { icon: 'bi-bell', label: 'Notifications', panel: 'notifications' },
        { icon: 'bi-journal-arrow-down', label: 'Lessons', panel: 'lessons' },
        { icon: 'bi-check2-square', label: 'Elections', panel: 'elections' },
      ]},
    ],
    sports_admin: [
      { title: 'Main', items: [
        { icon: 'bi-house-door', label: 'Website', route: '/' },
        { icon: 'bi-speedometer2', label: 'Overview', route: '/dashboard' },
        { icon: 'bi-book', label: 'My Courses', route: '/courses' },
        { icon: 'bi-star', label: 'Grades', route: '/grades' },
      ]},
      { title: 'Content', items: [
        { icon: 'bi-journal-text', label: 'Posts', route: '/posts' },
        { icon: 'bi-lightning', label: 'Challenges', route: '/challenges' },
        { icon: 'bi-controller', label: 'Quiz Arena', route: '/quiz' },
        { icon: 'bi-youtube', label: 'Video Courses', route: '/videos' },
      ]},
      { title: 'Community', items: [
        { icon: 'bi-chat-dots', label: 'Messages', route: '/messages' },
        { icon: 'bi-check2-square', label: 'Elections', route: '/elections' },
        { icon: 'bi-bell', label: 'Notifications', route: '/notifications' },
      ]},
    ],
    monitor_admin: [
      { title: 'Main', items: [
        { icon: 'bi-house-door', label: 'Website', route: '/' },
        { icon: 'bi-speedometer2', label: 'Overview', panel: 'overview' },
      ]},
      { title: 'Security', items: [
        { icon: 'bi-shield-exclamation', label: 'Alerts', panel: 'alerts' },
        { icon: 'bi-box-arrow-in-right', label: 'Login Attempts', panel: 'login-attempts' },
        { icon: 'bi-list-ul', label: 'Activity Logs', panel: 'activity-logs' },
        { icon: 'bi-exclamation-triangle', label: 'Suspicious IPs', panel: 'suspicious-ips' },
        { icon: 'bi-slash-circle', label: 'Blocked IPs', panel: 'blocked-ips' },
      ]},
      { title: 'Users', items: [
        { icon: 'bi-people', label: 'User Management', panel: 'monitor-users' },
      ]},
      { title: 'Community', items: [
        { icon: 'bi-chat-dots', label: 'Messages', route: '/messages' },
        { icon: 'bi-bell', label: 'Notifications', route: '/notifications' },
        { icon: 'bi-check2-square', label: 'Elections', route: '/elections' },
        { icon: 'bi-lightning', label: 'Challenges', route: '/challenges' },
        { icon: 'bi-book', label: 'My Courses', route: '/courses' },
        { icon: 'bi-star', label: 'Grades', route: '/grades' },
        { icon: 'bi-controller', label: 'Quiz Arena', route: '/quiz' },
        { icon: 'bi-youtube', label: 'Video Courses', route: '/videos' },
      ]},
    ],
    educational_admin: [
      { title: 'Main', items: [
        { icon: 'bi-house-door', label: 'Website', route: '/' },
        { icon: 'bi-speedometer2', label: 'Overview', panel: 'overview' },
      ]},
      { title: 'Education Management', items: [
        { icon: 'bi-book', label: 'Courses', panel: 'courses' },
        { icon: 'bi-people', label: 'Enrollments', panel: 'enrollments' },
        { icon: 'bi-building', label: 'Departments', panel: 'departments' },
        { icon: 'bi-calendar3', label: 'Semesters', panel: 'semesters' },
        { icon: 'bi-star', label: 'Grades', panel: 'grades' },
        { icon: 'bi-trophy', label: 'Leaderboard', panel: 'leaderboard' },
        { icon: 'bi-lightning', label: 'Challenges', panel: 'challenges' },
      ]},
      { title: 'Content', items: [
        { icon: 'bi-journal-arrow-down', label: 'Lessons', panel: 'lessons' },
        { icon: 'bi-controller', label: 'Quiz Manager', panel: 'quiz-manage' },
        { icon: 'bi-youtube', label: 'Video Courses', panel: 'video-courses' },
      ]},
      { title: 'Community', items: [
        { icon: 'bi-chat-dots', label: 'Messages', route: '/messages' },
        { icon: 'bi-bell', label: 'Notifications', route: '/notifications' },
      ]},
    ],
    operations_manager: [
      { title: 'Main', items: [
        { icon: 'bi-house-door', label: 'Website', route: '/' },
        { icon: 'bi-speedometer2', label: 'Overview', panel: 'overview' },
      ]},
      { title: 'Operations', items: [
        { icon: 'bi-people', label: 'Users', panel: 'ops-users' },
        { icon: 'bi-clipboard-check', label: 'Approvals', panel: 'approvals' },
      ]},
      { title: 'Academics', items: [
        { icon: 'bi-book', label: 'My Courses', route: '/courses' },
        { icon: 'bi-star', label: 'Grades', route: '/grades' },
      ]},
      { title: 'Content', items: [
        { icon: 'bi-journal-text', label: 'Posts', route: '/posts' },
        { icon: 'bi-lightning', label: 'Challenges', route: '/challenges' },
        { icon: 'bi-controller', label: 'Quiz Arena', route: '/quiz' },
        { icon: 'bi-youtube', label: 'Video Courses', route: '/videos' },
      ]},
      { title: 'Community', items: [
        { icon: 'bi-chat-dots', label: 'Messages', route: '/messages' },
        { icon: 'bi-bell', label: 'Notifications', route: '/notifications' },
      ]},
    ],
  },

  getSidebar(role) {
    const sections = this.sidebarSections[role] || this.sidebarSections.student;
    const activePanel = window._saPanel || 'overview';
    return sections.map(s => `
      <div class="sidebar-section">${s.title}</div>
      ${s.items.map(i => {
        if (i.panel) {
          const active = activePanel === i.panel ? 'active' : '';
          const loadFn = (typeof _panelLoaders !== 'undefined' && _panelLoaders[i.panel]) ? `;${_panelLoaders[i.panel]}` : '';
          return `<a class="sidebar-item ${active}" onclick="switchSuperAdminPanel('${i.panel}')${loadFn}">
            <i class="bi ${i.icon}"></i>
            <span class="sidebar-item-text">${i.label}</span>
            ${i.badge ? `<span class="sidebar-badge">${i.badge}</span>` : ''}
          </a>`;
        }
        const hasDynamicBadge = ['/messages','/notifications'].includes(i.route);
        return `<a class="sidebar-item ${router.currentPath === i.route ? 'active' : ''}" href="#${i.route}" onclick="event.preventDefault();window.router.navigate('${i.route}')">
          <i class="bi ${i.icon}"></i>
          <span class="sidebar-item-text">${i.label}</span>
          ${i.badge ? `<span class="sidebar-badge">${i.badge}</span>` : ''}
          ${hasDynamicBadge ? `<span class="sidebar-badge sidebar-badge-dynamic" id="badge-${(i.route||'').replace('/','')}" style="display:none">0</span>` : ''}
        </a>`;
      }).join('')}
    `).join('');
  },

  renderShell(title, content, role = 'student') {
    const user = DB.currentUser;
    const cfg = this.roleConfig[role] || this.roleConfig.student;
    const notifCount = (DB.notifications || []).filter(n => !n.read).length;
    return `
      <div class="app-layout">
        <!-- Sidebar Overlay -->
        <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>

        <!-- Sidebar -->
        <aside class="sidebar" id="appSidebar">
          <div class="sidebar-brand">
            <div class="sidebar-brand-icon"><img class="brand-logo-img" src="logo.png" alt="CS15 Hub — Batch 15 logo" width="38" height="38"></div>
            <div class="sidebar-brand-text">
              <span class="fw-bold">CS15 Hub</span>
              <span class="sidebar-brand-sub">Jazeera University</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          ${this.getSidebar(role)}
        </nav>
        </aside>

        <!-- Main Content -->
        <div class="content-wrapper" id="contentWrapper">
          <!-- Navbar -->
          <nav class="navbar" id="appNavbar">
            <button class="navbar-toggle" onclick="toggleSidebar()"><i class="bi bi-list"></i></button>
            <div class="navbar-search">
              <i class="bi bi-search"></i>
              <input type="text" placeholder="Search posts, people, projects..." id="globalSearch" onkeydown="if(event.key==='Enter')handleGlobalSearch(this.value)">
            </div>
            <div class="navbar-actions">
              <button class="navbar-action-btn" onclick="router.navigate('/notifications')" title="Notifications" style="position:relative">
                <i class="bi bi-bell"></i>
                <span class="badge-dot" id="navbarNotifBadge" style="display:none"></span>
                <span class="sidebar-badge" id="navbarNotifCount" style="display:none;position:absolute;top:-4px;right:-4px;font-size:10px;min-width:16px;height:16px;line-height:16px;padding:0 4px">0</span>
              </button>
              <button class="navbar-action-btn" onclick="router.navigate('/messages')" title="Messages" style="position:relative">
                <i class="bi bi-chat-dots"></i>
                <span class="sidebar-badge" id="navbarMsgCount" style="display:none;position:absolute;top:-4px;right:-4px;font-size:10px;min-width:16px;height:16px;line-height:16px;padding:0 4px">0</span>
              </button>
              <div class="dropdown" id="themeDropdown">
                <button class="navbar-action-btn" onclick="toggleDropdown('themeDropdown')" title="Choose theme">
                  <i class="bi bi-palette"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-end" id="themeDropdownMenu" style="min-width:220px;padding:8px">
                  <div class="text-xs text-tertiary px-2 pb-1 fw-medium" style="letter-spacing:0.3px">THEMES</div>
                  <div id="themeOptions"></div>
                </div>
              </div>
              <div class="dropdown" id="profileDropdown">
                <div class="navbar-profile" onclick="toggleDropdown('profileDropdown')">
                  <div class="navbar-profile-avatar">${user?.avatar ? `<img src="${user.avatar}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : UI.getInitials(user?.name || 'U')}</div>
                  <div class="d-none d-md-block">
                    <div class="text-sm fw-medium">${user?.name || 'User'}</div>
                    <div class="text-xs text-tertiary">${cfg.label}</div>
                  </div>
                  <i class="bi bi-chevron-down text-tertiary" style="font-size:0.75rem"></i>
                </div>
                <div class="dropdown-menu" id="profileDropdownMenu">
                  <button class="dropdown-item" onclick="router.navigate('/profile')"><i class="bi bi-person"></i> My Profile</button>
                  <button class="dropdown-item" onclick="router.navigate('/settings')"><i class="bi bi-gear"></i> Settings</button>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item" onclick="handleLogout()"><i class="bi bi-box-arrow-right"></i> Sign Out</button>
                </div>
              </div>
            </div>
          </nav>

          <!-- Page Content -->
          <main class="main-content page-transition">
            ${title ? `<div class="page-header flex items-center justify-between"><div><h1 class="page-header-title">${title}</h1></div></div>` : ''}
            ${content}
          </main>
        </div>
      </div>
    `;
  },

  // ===== USER DASHBOARD =====
  user() {
    const user = DB.currentUser;
    return this.renderShell('Dashboard', `
      <div class="card mb-6" id="claimCard" style="display:${user?.role === 'user' ? 'block' : 'none'}">
        <div class="card-body">
          <h5 class="mb-2"><i class="bi bi-mortarboard text-primary me-2"></i>Are you a CS Batch 15 student?</h5>
          <p class="text-secondary text-sm mb-3">Enter your student ID below and an admin will verify it against the class roster. Until then you'll keep the basic dashboard.</p>
          <div class="d-flex align-items-center gap-2" style="flex-wrap:wrap">
            <input class="form-input" id="claimStudentId" placeholder="e.g. CS2025XXXX" style="max-width:260px" maxlength="64">
            <button class="btn btn-primary btn-lg" id="claimStudentBtn" onclick="Dashboards._submitClaim()">
              <i class="bi bi-patch-check me-2"></i>Claim Student Status
            </button>
          </div>
        </div>
      </div>
      <div id="claimStatusCard" style="display:none" class="card mb-6"></div>
      <div class="grid-2 mb-6 stagger-children">
        <div class="card">
          <div class="card-header"><h5 class="card-title"><i class="bi bi-info-circle me-2"></i>About CS Batch 15</h5></div>
          <div class="card-body">
            <p>Welcome to CS Batch 15 at Jazeera University! This platform connects students, teachers, and administrators for collaborative learning, content management, and skill development.</p>
            <p class="text-sm text-tertiary">Explore posts, challenges, courses, and connect with your peers through messaging and community features.</p>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h5 class="card-title"><i class="bi bi-lightning me-2"></i>Quick Links</h5></div>
          <div class="card-body d-flex flex-column gap-2">
            <a class="btn btn-outline btn-sm" href="#" onclick="router.navigate('/about')"><i class="bi bi-info-circle me-2"></i>About Us</a>
            <a class="btn btn-outline btn-sm" href="#" onclick="router.navigate('/members')"><i class="bi bi-people me-2"></i>Our Members</a>
            <a class="btn btn-outline btn-sm" href="#" onclick="router.navigate('/gallery')"><i class="bi bi-images me-2"></i>Gallery</a>
            <a class="btn btn-outline btn-sm" href="#" onclick="router.navigate('/posts')"><i class="bi bi-journal-text me-2"></i>Blog Posts</a>
          </div>
        </div>
      </div>
      <div class="grid-3 stagger-children">
        <div class="card text-center p-4">
          <div class="display-3 text-secondary mb-3"><i class="bi bi-people"></i></div>
          <h6>Community</h6>
          <p class="text-sm text-tertiary">Connect with fellow members</p>
        </div>
        <div class="card text-center p-4">
          <div class="display-3 text-secondary mb-3"><i class="bi bi-mortarboard"></i></div>
          <h6>Learning</h6>
          <p class="text-sm text-tertiary">Access courses and materials</p>
        </div>
        <div class="card text-center p-4">
          <div class="display-3 text-secondary mb-3"><i class="bi bi-stars"></i></div>
          <h6>More Features Coming Soon</h6>
          <p class="text-sm text-tertiary">Stay tuned for updates</p>
        </div>
      </div>
    `, 'user');
  },

  async userLoaded() {
    try {
      // Check claim status
      const claimData = await API.getClaimStatus();
      const claim = claimData?.claim;
      if (claim?.status === 'approved') {
        await API.restoreSession();
        router.navigate('/dashboard');
        return;
      }
      if (claim) {
        const claimCard = document.getElementById('claimCard');
        const statusCard = document.getElementById('claimStatusCard');
        if (claimCard) claimCard.style.display = 'none';
        if (statusCard) {
          statusCard.style.display = 'block';
          const badges = { pending: 'warning', approved: 'success', denied: 'danger' };
          const icons = { pending: 'hourglass-split', approved: 'check-circle', denied: 'x-circle' };
          const msgs = {
            pending: 'Your claim is being reviewed by an administrator.',
            approved: 'Congratulations! Your claim has been approved. You are now a student.',
            denied: 'Your claim was denied.',
          };
          statusCard.innerHTML = `
            <div class="card-body d-flex align-items-center gap-3">
              <i class="bi bi-${icons[claim.status] || 'question-circle'} fs-1 text-${badges[claim.status] || 'secondary'}"></i>
              <div>
                <h5 class="mb-1">Claim ${claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}</h5>
                <p class="text-secondary text-sm mb-0">${msgs[claim.status] || ''}</p>
                ${claim.student_id ? `<p class="text-sm text-tertiary mb-0 mt-1"><strong>Student ID:</strong> ${claim.student_id}</p>` : ''}
                ${claim.review_note ? `<p class="text-sm text-danger mt-2"><strong>Reason:</strong> ${claim.review_note}</p>` : ''}
                ${claim.status === 'denied' ? `<button class="btn btn-primary btn-sm mt-2" onclick="Dashboards._submitClaim(true)"><i class="bi bi-arrow-clockwise me-1"></i>Re-apply</button>` : ''}
                ${claim.status === 'approved' ? `<button class="btn btn-success btn-sm mt-2" onclick="router.navigate('/dashboard')"><i class="bi bi-arrow-right me-1"></i>Go to Student Dashboard</button>` : ''}
              </div>
            </div>
          `;
        }
      }
    } catch(e) {
      console.error('User dashboard load error:', e);
    }
  },

  // ===== STUDENT DASHBOARD =====
  student() {
    const user = DB.currentUser;
    return this.renderShell('Dashboard', `
      <div class="grid-4 mb-6 stagger-children" id="statCards">
        ${UI.skeleton('stat', 4)}
      </div>
      <div class="grid-2 mb-6">
        <div class="card" id="gradeChart">
          <div class="card-header"><h5 class="card-title">Course Progress</h5></div>
          <div class="chart-container"><canvas id="courseChart"></canvas></div>
        </div>
        <div class="card" id="activityFeed">
          <div class="card-header"><h5 class="card-title">Recent Activity</h5></div>
          <div class="activity-feed" id="activityFeedContent">${UI.skeleton('table', 5)}</div>
        </div>
      </div>
      <div class="grid-2">
        <div class="card" id="upcomingDeadlines">
          <div class="card-header"><h5 class="card-title">Upcoming Deadlines</h5><button class="btn btn-sm btn-ghost">View All</button></div>
          <div id="deadlinesContent">${UI.skeleton('table', 4)}</div>
        </div>
        <div class="card" id="recentGrades">
          <div class="card-header"><h5 class="card-title">Recent Grades</h5><button class="btn btn-sm btn-ghost">View All</button></div>
          <div id="gradesContent">${UI.skeleton('table', 4)}</div>
        </div>
      </div>
    `, 'student');
  },

  async studentLoaded() {
    try {
      const stats = await API.getDashboardStats('student');
      const container = document.getElementById('statCards');
      if (container) {
        const users = stats.users || {};
        const content = stats.content || {};
        const activity = stats.activity || {};
        const challenges = stats.challenges || {};
        container.innerHTML = [
          UI.statCard('bi-book', users.total || 0, 'Enrolled Courses', null, 'blue'),
          UI.statCard('bi-check-circle', content.published || 0, 'Completed', { value: '+2 this week', direction: 'up' }, 'green'),
          UI.statCard('bi-exclamation-triangle', challenges.submissions || 0, 'Pending', null, 'yellow'),
          UI.statCard('bi-trophy', `${challenges.open || 0}`, 'Active Challenges', { value: '+3.5%', direction: 'up' }, 'purple'),
        ].join('');
        UI.initCounters(container);
      }

      this.initCourseChart();
      this.loadActivityFeed();
      this.loadDeadlines();
      this.loadGrades();
    } catch(e) {
      console.error('Student dashboard load error:', e);
      const container = document.getElementById('statCards');
      if (container) container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="bi bi-exclamation-circle empty-state-icon"></i><h3>Could not load dashboard data</h3></div>';
    }
  },

  initCourseChart() {
    const canvas = document.getElementById('courseChart');
    if (!canvas || typeof Chart === 'undefined') return;
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['DSA', 'Web Dev', 'AI', 'DB Systems', 'Soft Eng'],
        datasets: [{
          label: 'Progress %',
          data: [65, 58, 42, 55, 48],
          backgroundColor: ['#2563EB', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'],
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        },
      },
    });
  },

  loadActivityFeed() {
    const container = document.getElementById('activityFeedContent');
    if (!container) return;
    const activities = [
      { text: 'Submitted DSA Assignment - Binary Search Tree', time: '2 hours ago', color: 'green' },
      { text: 'Scored 92/100 on Web Dev Project', time: '5 hours ago', color: 'green' },
      { text: 'Enrolled in AI Fundamentals Course', time: '1 day ago', color: 'blue' },
      { text: 'Completed 30-Day Coding Challenge Day 15', time: '2 days ago', color: 'purple' },
      { text: 'New message from Dr. Omar about assignment', time: '3 days ago', color: 'yellow' },
    ];
    container.innerHTML = activities.map(a => UI.activityItem(a.text, a.time, a.color)).join('');
  },

  loadDeadlines() {
    const container = document.getElementById('deadlinesContent');
    if (!container) return;
    container.innerHTML = `
      <div class="table-container">
        <table class="table table-sm">
          <thead><tr><th>Assignment</th><th>Course</th><th>Due Date</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>Binary Search Tree</td><td>CS301 - DSA</td><td>Dec 5, 2025</td><td>${UI.badge('Pending', 'warning')}</td></tr>
            <tr><td>Responsive Portfolio</td><td>CS302 - Web Dev</td><td>Dec 8, 2025</td><td>${UI.badge('Pending', 'warning')}</td></tr>
            <tr><td>ML Model Comparison</td><td>CS303 - AI</td><td>Dec 10, 2025</td><td>${UI.badge('Not Started', 'danger')}</td></tr>
          </tbody>
        </table>
      </div>
    `;
  },

  loadGrades() {
    const container = document.getElementById('gradesContent');
    if (!container) return;
    container.innerHTML = `
      <div class="table-container">
        <table class="table table-sm">
          <thead><tr><th>Course</th><th>Assignment</th><th>Score</th><th>Grade</th></tr></thead>
          <tbody>
            <tr><td>CS301</td><td>BST Implementation</td><td>92/100</td><td>${UI.badge('A', 'success')}</td></tr>
            <tr><td>CS301</td><td>DB Schema Design</td><td>88/100</td><td>${UI.badge('B+', 'success')}</td></tr>
            <tr><td>CS302</td><td>Portfolio Project</td><td>95/100</td><td>${UI.badge('A', 'success')}</td></tr>
            <tr><td>CS303</td><td>Midterm Exam</td><td>85/100</td><td>${UI.badge('B+', 'success')}</td></tr>
          </tbody>
        </table>
      </div>
    `;
  },

  // ===== TEACHER DASHBOARD =====
  teacher() {
    return this.renderShell('Dashboard', `
      <div class="grid-4 mb-6 stagger-children" id="statCards">
        ${UI.skeleton('stat', 4)}
      </div>
      <div class="grid-2 mb-6">
        <div class="card" id="submissionChart">
          <div class="card-header"><h5 class="card-title">Submissions Overview</h5></div>
          <div class="chart-container"><canvas id="submissionChartCanvas"></canvas></div>
        </div>
        <div class="card">
          <div class="card-header"><h5 class="card-title">Recent Submissions</h5></div>
          <div class="table-container">
            <table class="table table-sm">
              <thead><tr><th>Student</th><th>Course</th><th>Assignment</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td><div class="d-flex align-items-center gap-2"><div class="avatar avatar-sm" style="background:#2563EB">AH</div>Ahmed H.</td><td>CS301</td><td>BST Impl.</td><td>${UI.badge('Submitted', 'success')}</td></tr>
                <tr><td><div class="avatar avatar-sm" style="background:#8b5cf6">SK</div>Sara K.</td><td>CS301</td><td>BST Impl.</td><td>${UI.badge('Graded', 'info')}</td></tr>
                <tr><td><div class="avatar avatar-sm" style="background:#10b981">YA</div>Yusuf A.</td><td>CS302</td><td>Portfolio</td><td>${UI.badge('Pending', 'warning')}</td></tr>
                <tr><td><div class="avatar avatar-sm" style="background:#f59e0b">ZA</div>Zaid A.</td><td>CS301</td><td>BST Impl.</td><td>${UI.badge('Late', 'danger')}</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="grid-3">
        <div class="card"><div class="card-header"><h5 class="card-title">My Courses</h5></div><div id="teacherCourses">${UI.skeleton('table', 3)}</div></div>
        <div class="card"><div class="card-header"><h5 class="card-title">Upcoming Lectures</h5></div><div id="upcomingLectures"><div class="activity-feed">${UI.skeleton('table', 4)}</div></div></div>
        <div class="card"><div class="card-header"><h5 class="card-title">Pending Reviews</h5><span class="badge badge-warning">18</span></div><div id="pendingReviews"><div class="activity-feed">${this._pendingReviewsHTML()}</div></div></div>
      </div>
    `, 'teacher');
  },

  _pendingReviewsHTML() {
    const items = [
      { name: 'Ahmed Hassan', course: 'CS301', item: 'BST Impl.', time: '2h ago' },
      { name: 'Dina Karim', course: 'CS303', item: 'ML Report', time: '5h ago' },
      { name: 'Sara Khalid', course: 'CS301', item: 'BST Impl.', time: '1d ago' },
      { name: 'Zaid Anwar', course: 'CS304', item: 'DB Schema', time: '2d ago' },
    ];
    return items.map(i => `
      <div class="activity-item">
        <div class="activity-dot yellow"></div>
        <div class="activity-content">
          <div class="activity-text">${i.name} - ${i.item} <span class="text-tertiary">(${i.course})</span></div>
          <div class="activity-time">${i.time}</div>
        </div>
      </div>
    `).join('');
  },

  async teacherLoaded() {
    try {
      const userId = DB.currentUser?.id;
      // Fetch real data in parallel
      const [coursesRes, usersRes, assignmentsRes, postsRes, pendingSubs] = await Promise.all([
        API.getCourses({ teacher_id: userId, per_page: 100 }).catch(() => ({ courses: [] })),
        API.getUsers({ role: 'student', per_page: 1 }).catch(() => ({ total: 0 })),
        API.getAssignments({ created_by: userId, per_page: 1 }).catch(() => ({ total: 0 })),
        API.getPosts({ per_page: 1 }).catch(() => ({ total: 0 })),
        API.getUnreadSubmissionsCount().catch(() => 0),
      ]);
      const courses = coursesRes.courses || [];
      const totalStudents = usersRes.total || 0;
      const totalAssignments = assignmentsRes.total || 0;
      const totalPosts = postsRes.total || 0;

      const container = document.getElementById('statCards');
      if (container) {
        container.innerHTML = [
          UI.statCard('bi-book', courses.length, 'Courses Teaching', null, 'blue'),
          UI.statCard('bi-people', totalStudents, 'Total Students', null, 'green'),
          UI.statCard('bi-file-check', totalAssignments, 'Assignments', pendingSubs > 0 ? { value: pendingSubs + ' pending', direction: 'up' } : null, 'yellow'),
          UI.statCard('bi-calendar-check', totalPosts, 'Posts Published', null, 'purple'),
        ].join('');
        UI.initCounters(container);
      }

      this.initSubmissionChart();
      this.loadTeacherCourses(courses);
    } catch(e) {
      console.error('Teacher dashboard load error:', e);
      const container = document.getElementById('statCards');
      if (container) container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="bi bi-exclamation-circle empty-state-icon"></i><h3>Could not load dashboard data</h3></div>';
    }
  },

  initSubmissionChart() {
    const canvas = document.getElementById('submissionChartCanvas');
    if (!canvas || typeof Chart === 'undefined') return;
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [{
          label: 'Submissions',
          data: [45, 62, 58, 78, 85, 72],
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#2563EB',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        },
      },
    });
  },

  loadTeacherCourses(courses) {
    const container = document.getElementById('teacherCourses');
    if (!container) return;
    if (!courses || !courses.length) {
      container.innerHTML = '<div class="text-center text-tertiary py-4">No courses assigned yet</div>';
      return;
    }
    container.innerHTML = `
      <div class="table-container">
        <table class="table table-sm">
          <thead><tr><th>Code</th><th>Course</th><th>Credits</th><th>Status</th></tr></thead>
          <tbody>
            ${courses.map(c => `
              <tr><td>${c.code}</td><td>${c.name}</td><td>${c.credits || '-'}</td><td>${UI.badge(c.status || 'active', 'success')}</td></tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ===== FINANCIAL ADMIN DASHBOARD =====
  financial_admin() {
    const activePanel = window._saPanel || 'overview';
    return this.renderShell('Financial Dashboard', `
      <div class="sa-panel" id="panel-overview" style="display:${activePanel === 'overview' ? 'block' : 'none'}">
        <div class="grid-4 mb-6 stagger-children" id="statCards">
          ${UI.skeleton('stat', 4)}
        </div>
        <div class="grid-2 mb-6">
          <div class="card"><div class="card-header"><h5 class="card-title">Revenue Overview</h5></div><div class="chart-container"><canvas id="revenueChart"></canvas></div></div>
          <div class="card">
            <div class="card-header"><h5 class="card-title">Recent Transactions</h5><button class="btn btn-sm btn-ghost">View All</button></div>
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>#</th><th>Description</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                <tbody>
                  <tr><td>1</td><td>Tuition - Ahmed Hassan</td><td>$2,500</td><td>${UI.badge('Paid', 'success')}</td><td>Nov 20</td></tr>
                  <tr><td>2</td><td>Lab Equipment</td><td>$12,000</td><td>${UI.badge('Pending', 'warning')}</td><td>Nov 19</td></tr>
                  <tr><td>3</td><td>Scholarship - Sara K.</td><td>$1,000</td><td>${UI.badge('Approved', 'info')}</td><td>Nov 18</td></tr>
                  <tr><td>4</td><td>Software Licenses</td><td>$4,500</td><td>${UI.badge('Paid', 'success')}</td><td>Nov 17</td></tr>
                  <tr><td>5</td><td>Guest Lecture Honorarium</td><td>$500</td><td>${UI.badge('Pending', 'warning')}</td><td>Nov 16</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="grid-3">
          <div class="card"><div class="card-header"><h5 class="card-title">Budget Allocation</h5></div><div class="d-flex flex-column gap-3"><div><div class="d-flex justify-between text-sm mb-1"><span>Academic Programs</span><span>65%</span></div><div class="progress"><div class="progress-bar blue" style="width:65%"></div></div></div><div><div class="d-flex justify-between text-sm mb-1"><span>Infrastructure</span><span>45%</span></div><div class="progress"><div class="progress-bar green" style="width:45%"></div></div></div><div><div class="d-flex justify-between text-sm mb-1"><span>Research</span><span>30%</span></div><div class="progress"><div class="progress-bar purple" style="width:30%"></div></div></div><div><div class="d-flex justify-between text-sm mb-1"><span>Student Activities</span><span>20%</span></div><div class="progress"><div class="progress-bar yellow" style="width:20%"></div></div></div></div></div>
          <div class="card"><div class="card-header"><h5 class="card-title">Scholarships</h5><span class="badge badge-info">28 Active</span></div><div class="d-flex flex-column gap-3 mt-2"><div class="d-flex justify-between items-center pb-2" style="border-bottom:1px solid var(--border-primary)"><div><div class="text-sm fw-medium">Merit Scholarship</div><div class="text-xs text-tertiary">12 recipients</div></div><span class="text-sm fw-semibold text-success">$18,000</span></div><div class="d-flex justify-between items-center pb-2" style="border-bottom:1px solid var(--border-primary)"><div><div class="text-sm fw-medium">Need-based Aid</div><div class="text-xs text-tertiary">8 recipients</div></div><span class="text-sm fw-semibold text-success">$12,000</span></div><div class="d-flex justify-between items-center"><div><div class="text-sm fw-medium">Sports Excellence</div><div class="text-xs text-tertiary">5 recipients</div></div><span class="text-sm fw-semibold text-success">$5,000</span></div></div></div>
          <div class="card"><div class="card-header"><h5 class="card-title">Pending Invoices</h5><span class="badge badge-warning">15</span></div></div>
        </div>
      </div>

      <div class="sa-panel" id="panel-financial" style="display:${activePanel === 'financial' ? 'block' : 'none'}">
        <div class="d-flex justify-between items-center mb-4">
          <div><h4 class="fw-bold">Financial Management System</h4><p class="text-sm text-tertiary">Monthly student payment tracking</p></div>
          <div class="d-flex gap-2">
            <button class="btn btn-secondary btn-sm" onclick="refreshFinancialPanel()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
            <button class="btn btn-primary btn-sm" onclick="showCreateMonthModal()"><i class="bi bi-plus-lg"></i> Create New Record</button>
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="grid-4 mb-4" id="financialSummaryCards">
          <div class="stat-card"><div class="stat-card-icon blue"><i class="bi bi-calendar-month"></i></div><div><div class="stat-card-label">Active Month</div><div class="stat-card-value" id="finActiveMonth">-</div></div></div>
          <div class="stat-card"><div class="stat-card-icon green"><i class="bi bi-people"></i></div><div><div class="stat-card-label">Total Students</div><div class="stat-card-value" id="finTotalStudents">-</div></div></div>
          <div class="stat-card"><div class="stat-card-icon success"><i class="bi bi-check-circle"></i></div><div><div class="stat-card-label">Paid</div><div class="stat-card-value" id="finPaidCount">-</div></div></div>
          <div class="stat-card"><div class="stat-card-icon red"><i class="bi bi-x-circle"></i></div><div><div class="stat-card-label">Unpaid</div><div class="stat-card-value" id="finUnpaidCount">-</div></div></div>
        </div>

        <!-- Records List -->
        <div class="card">
          <div class="card-header">
            <h5 class="card-title">Monthly Records</h5>
            <div class="d-flex gap-2">
              <input type="text" class="form-input" id="finSearchInput" placeholder="Search student..." style="width:200px" oninput="filterFinancialStudents()">
              <label class="d-flex items-center gap-1 text-sm" style="cursor:pointer"><input type="checkbox" id="finShowUnpaidOnly" onchange="filterFinancialStudents()"> Show unpaid only</label>
            </div>
          </div>
          <div id="financialRecordsContainer">
            <div class="text-center text-tertiary p-4">Loading records...</div>
          </div>
        </div>

        <!-- Student Payment Table -->
        <div class="card mt-4" id="financialStudentCard" style="display:none">
          <div class="card-header">
            <h5 class="card-title" id="finSelectedMonth">Students</h5>
            <div class="d-flex gap-2">
              <button class="btn btn-success btn-sm" id="finSubmitBtn" onclick="submitFinancialMonth()"><i class="bi bi-check2-square"></i> Submit Month Report</button>
              <button class="btn btn-info btn-sm" onclick="exportFinancialPdf()"><i class="bi bi-filetype-pdf"></i> PDF</button>
              <button class="btn btn-secondary btn-sm" onclick="exportFinancialCsv()"><i class="bi bi-file-earmark-spreadsheet"></i> CSV</button>
            </div>
          </div>
          <div class="table-container">
            <table class="table table-sm" id="finStudentTable">
              <thead><tr><th>#</th><th>Student Name</th><th>Student ID</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
              <tbody id="finStudentBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    `, 'financial_admin');
  },

  // ===== EDUCATIONAL ADMIN DASHBOARD =====
  educational_admin() {
    const user = DB.currentUser;
    return this.renderShell('Educational Dashboard', `
      <div id="sa-panel-container">

        <!-- ============ PANEL: OVERVIEW ============ -->
        <div class="sa-panel" id="panel-overview">
          <div class="card mb-6">
            <div class="d-flex align-items-center gap-4 p-4">
              <div style="position:relative;flex-shrink:0">
                <div id="overviewAvatar">${user?.avatar ? `<img src="${user.avatar}" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:50%">` : `<div class="avatar avatar-lg" style="background:${UI.getAvatarColor(user?.name||'U')};width:64px;height:64px;font-size:1.2rem">${UI.getInitials(user?.name||'U')}</div>`}</div>
                <label for="overviewAvatarInput" style="position:absolute;bottom:0;right:0;width:24px;height:24px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid var(--bg-card)">
                  <i class="bi bi-camera" style="font-size:12px;color:#fff"></i>
                  <input type="file" id="overviewAvatarInput" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none">
                </label>
              </div>
              <div>
                <h5 class="mb-1">${user?.name || 'User'}</h5>
                <p class="text-sm text-tertiary mb-1">${Dashboards.roleConfig[user?.role]?.label || user?.role || ''} &bull; ${user?.email || ''}</p>
              </div>
            </div>
          </div>
          <div class="grid-4 mb-6 stagger-children" id="statCards">${UI.skeleton('stat', 4)}</div>
          <div class="grid-2 mb-6">
            <div class="card"><div class="card-header"><h5 class="card-title">Curriculum Progress</h5></div><div class="chart-container"><canvas id="curriculumChart"></canvas></div></div>
            <div class="card"><div class="card-header"><h5 class="card-title">Faculty Overview</h5></div><div class="table-container"><table class="table table-sm"><thead><tr><th>Name</th><th>Department</th><th>Courses</th><th>Students</th></tr></thead><tbody><tr><td>Omar Mahmoud</td><td>CS</td><td>3</td><td>127</td></tr><tr><td>Layla Abdul</td><td>CS</td><td>2</td><td>82</td></tr><tr><td>Khalid Rashid</td><td>Math</td><td>2</td><td>95</td></tr><tr><td>Noor Ali</td><td>CS</td><td>2</td><td>78</td></tr><tr><td>Hassan Ibrahim</td><td>Physics</td><td>1</td><td>45</td></tr></tbody></table></div></div>
          </div>
          <div class="grid-3">
            <div class="card"><div class="card-header"><h5 class="card-title">Programs</h5></div><div class="d-flex flex-column gap-2"><div class="d-flex justify-between items-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><span class="text-sm fw-medium">B.Sc. Computer Science</span>${UI.badge('Active', 'success')}</div><div class="d-flex justify-between items-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><span class="text-sm fw-medium">B.Sc. Software Engineering</span>${UI.badge('Active', 'success')}</div><div class="d-flex justify-between items-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><span class="text-sm fw-medium">B.Sc. Data Science</span>${UI.badge('Pending', 'warning')}</div><div class="d-flex justify-between items-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><span class="text-sm fw-medium">M.Sc. AI & Robotics</span>${UI.badge('Active', 'success')}</div></div></div>
            <div class="card"><div class="card-header"><h5 class="card-title">Accreditation Status</h5></div><div class="text-center py-4"><div class="display-3 fw-bold text-success mb-2">95%</div><p class="text-secondary text-sm">Overall Compliance</p><div class="mt-3"><div class="d-flex justify-between text-sm mb-2"><span>Curriculum Standards</span><span class="text-success">100%</span></div><div class="progress mb-3"><div class="progress-bar green" style="width:100%"></div></div><div class="d-flex justify-between text-sm mb-2"><span>Faculty Qualifications</span><span class="text-success">95%</span></div><div class="progress mb-3"><div class="progress-bar green" style="width:95%"></div></div><div class="d-flex justify-between text-sm mb-2"><span>Facilities</span><span class="text-warning">85%</span></div><div class="progress"><div class="progress-bar yellow" style="width:85%"></div></div></div></div></div>
            <div class="card"><div class="card-header"><h5 class="card-title">Recent Changes</h5></div></div>
          </div>
        </div>

        <!-- ============ PANEL: COURSES ============ -->
        <div class="sa-panel" id="panel-courses" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Course Management</h4>
            <button class="btn btn-primary btn-sm" onclick="showEdCreateCourseModal()"><i class="bi bi-plus-lg"></i> Add Course</button>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>Code</th><th>Name</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="edCoursesBody"><tr><td colspan="5" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: ENROLLMENTS ============ -->
        <div class="sa-panel" id="panel-enrollments" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Enrollment Management</h4>
            <button class="btn btn-primary btn-sm" onclick="showEdCreateEnrollmentModal()"><i class="bi bi-plus-lg"></i> Enroll Student</button>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>Student</th><th>Course</th><th>Status</th><th>Enrolled</th></tr></thead>
                <tbody id="edEnrollmentsBody"><tr><td colspan="4" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: DEPARTMENTS ============ -->
        <div class="sa-panel" id="panel-departments" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Departments</h4>
            <button class="btn btn-primary btn-sm" onclick="showEdCreateDepartmentModal()"><i class="bi bi-plus-lg"></i> Add Department</button>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>Name</th><th>Code</th><th>Actions</th></tr></thead>
                <tbody id="edDepartmentsBody"><tr><td colspan="3" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: SEMESTERS ============ -->
        <div class="sa-panel" id="panel-semesters" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Semesters</h4>
            <button class="btn btn-primary btn-sm" onclick="showEdCreateSemesterModal()"><i class="bi bi-plus-lg"></i> Add Semester</button>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>Name</th><th>Code</th><th>Start</th><th>End</th><th>Status</th></tr></thead>
                <tbody id="edSemestersBody"><tr><td colspan="5" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: GRADES ============ -->
        <div class="sa-panel" id="panel-grades" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Grade Management</h4>
            <button class="btn btn-primary btn-sm" onclick="showEdCreateGradeModal()"><i class="bi bi-plus-lg"></i> Add Grade</button>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>Student</th><th>Course</th><th>Score</th><th>Grade</th></tr></thead>
                <tbody id="edGradesBody"><tr><td colspan="4" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: LEADERBOARD ============ -->
        <div class="sa-panel" id="panel-leaderboard" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Leaderboard Management</h4>
            <button class="btn btn-primary btn-sm" onclick="showEdAwardXpModal()"><i class="bi bi-plus-lg"></i> Award XP</button>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>Rank</th><th>Student</th><th>Points</th><th>Level</th></tr></thead>
                <tbody id="edLeaderboardBody"><tr><td colspan="4" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: LESSONS ============ -->
        <div class="sa-panel" id="panel-lessons" style="display:none">
          <div id="lessonsFileManager"><div class="text-center text-tertiary p-4">Loading...</div></div>
        </div>

        <!-- ============ PANEL: CHALLENGES (Educational Admin) ============ -->
        <div class="sa-panel" id="panel-challenges" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Challenge Management</h4>
            <button class="btn btn-primary btn-sm" onclick="showSACreateChallengeModal()"><i class="bi bi-plus-lg"></i> Create Challenge</button>
          </div>
          <div class="mb-3 d-flex gap-2">
            <select class="form-input" id="saChallengeStatusFilter" onchange="loadSAChallenges()" style="width:auto">
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <select class="form-input" id="saChallengeDifficultyFilter" onchange="loadSAChallenges()" style="width:auto">
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>Title</th><th>Difficulty</th><th>XP</th><th>Status</th><th>Link</th><th>Actions</th></tr></thead>
                <tbody id="saChallengesBody"><tr><td colspan="7" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: QUIZ MANAGER ============ -->
        <div class="sa-panel" id="panel-quiz-manage" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h4 class="fw-bold">Quiz Arena Manager</h4>
              <p class="text-sm text-tertiary">Manage skills and questions for the Quiz Arena</p>
            </div>
            <div class="d-flex gap-2">
              <input type="text" class="form-input" id="quizManageSearch" placeholder="Search skills..." oninput="filterQuizManage()" style="width:220px">
              <button class="btn btn-primary btn-sm" onclick="loadQuizManagePanel()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
            </div>
          </div>
          <div class="grid-4 mb-4" id="quizManageStats">
            <div class="stat-card"><div class="stat-card-icon blue"><i class="bi bi-controller"></i></div><div><div class="stat-card-label">Total Skills</div><div class="stat-card-value" id="qmAmtSkills">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon green"><i class="bi bi-question-circle"></i></div><div><div class="stat-card-label">Total Questions</div><div class="stat-card-value" id="qmAmtQuestions">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon yellow"><i class="bi bi-people"></i></div><div><div class="stat-card-label">Total Players</div><div class="stat-card-value" id="qmAmtPlayers">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon purple"><i class="bi bi-trophy"></i></div><div><div class="stat-card-label">Quizzes Taken</div><div class="stat-card-value" id="qmAmtQuizzes">-</div></div></div>
          </div>
          <div class="card">
            <div class="card-header"><h5 class="card-title">Skills & Questions</h5></div>
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>Skill</th><th>Category</th><th>Questions</th><th>Difficulty</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="quizManageBody"><tr><td colspan="6" class="text-center text-tertiary py-4">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
          <div class="card mt-4" id="quizEditCard" style="display:none">
            <div class="card-header"><h5 class="card-title" id="quizEditTitle">Edit Questions</h5><button class="btn btn-sm btn-ghost" onclick="document.getElementById('quizEditCard').style.display='none'"><i class="bi bi-x-lg"></i></button></div>
            <div class="p-3" id="quizEditContent"></div>
          </div>
        </div>

        <!-- ============ PANEL: VIDEO COURSES ============ -->
        <div class="sa-panel" id="panel-video-courses" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <div class="d-flex align-items-center gap-2">
              <h4 class="fw-bold mb-0">Video Courses</h4>
              <div class="d-flex gap-1 ms-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md);padding:3px">
                <button class="btn btn-xs vc-mode-btn" data-mode="browse" onclick="switchVcMode('browse')" style="border-radius:var(--radius-sm);padding:4px 12px">Browse</button>
                <button class="btn btn-xs vc-mode-btn" data-mode="manage" onclick="switchVcMode('manage')" style="border-radius:var(--radius-sm);padding:4px 12px">Manage</button>
              </div>
            </div>
            <div class="d-flex gap-2">
              <input type="text" class="form-input form-input-sm" id="vcSearchInput" placeholder="Search skills..." oninput="filterVideoCourses()" style="width:220px">
              <button class="btn btn-sm btn-primary" onclick="loadVideoCoursesPanel()"><i class="bi bi-arrow-clockwise"></i></button>
            </div>
          </div>
          <div class="grid-4 mb-4" id="vcStats">
            <div class="stat-card"><div class="stat-card-icon blue"><i class="bi bi-youtube"></i></div><div><div class="stat-card-label">Total Skills</div><div class="stat-card-value" id="vcAmtSkills">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon red"><i class="bi bi-play-circle"></i></div><div><div class="stat-card-label">Total Videos</div><div class="stat-card-value" id="vcAmtVideos">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon green"><i class="bi bi-eye"></i></div><div><div class="stat-card-label">Total Views</div><div class="stat-card-value" id="vcAmtViews">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon yellow"><i class="bi bi-clock-history"></i></div><div><div class="stat-card-label">Watch Time</div><div class="stat-card-value" id="vcAmtWatchTime">-</div></div></div>
          </div>
          <div id="vcBrowseView">
            <div id="vcSkillGrid" class="grid-3 stagger-children"></div>
            <div id="vcVideoList" style="display:none"></div>
            <div id="vcPlayer" style="display:none"></div>
          </div>
          <div id="vcManageView" style="display:none">
            <div class="card">
              <div class="card-header d-flex justify-between items-center">
                <h5 class="card-title mb-0">Skills & Videos</h5>
                <button class="btn btn-success btn-sm" onclick="showAddYtSkillModalUnified()"><i class="bi bi-plus-lg"></i> Add Skill</button>
              </div>
              <div class="table-container">
                <table class="table table-sm">
                  <thead><tr><th>Skill</th><th>Category</th><th>Videos</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody id="vcManageBody"><tr><td colspan="5" class="text-center text-tertiary py-4">Loading...</td></tr></tbody>
                </table>
              </div>
            </div>
            <div class="card mt-4" id="vcEditCard" style="display:none">
              <div class="card-header d-flex justify-between items-center">
                <h5 class="card-title mb-0" id="vcEditTitle">Edit</h5>
                <button class="btn btn-sm btn-ghost" onclick="document.getElementById('vcEditCard').style.display='none'"><i class="bi bi-x-lg"></i></button>
              </div>
              <div class="p-3" id="vcEditContent"></div>
            </div>
          </div>
        </div>

      </div>
    `, 'educational_admin');
  },

  // ===== GENERAL ADMIN DASHBOARD =====
  general_admin() {
    const user = DB.currentUser;
    return this.renderShell('Admin Dashboard', `
      <div id="sa-panel-container">
        <!-- ============ PANEL 1: OVERVIEW ============ -->
        <div class="sa-panel" id="panel-overview">
          <div class="card mb-6">
            <div class="d-flex align-items-center gap-4 p-4">
              <div style="position:relative;flex-shrink:0">
                <div id="overviewAvatar">${user?.avatar ? `<img src="${user.avatar}" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:50%">` : `<div class="avatar avatar-lg" style="background:${UI.getAvatarColor(user?.name||'U')};width:64px;height:64px;font-size:1.2rem">${UI.getInitials(user?.name||'U')}</div>`}</div>
                <label for="overviewAvatarInput" style="position:absolute;bottom:0;right:0;width:24px;height:24px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid var(--bg-card)">
                  <i class="bi bi-camera" style="font-size:12px;color:#fff"></i>
                  <input type="file" id="overviewAvatarInput" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none">
                </label>
              </div>
              <div>
                <h5 class="mb-1">${user?.name || 'User'}</h5>
                <p class="text-sm text-tertiary mb-1">${Dashboards.roleConfig[user?.role]?.label || user?.role || ''} &bull; ${user?.email || ''}</p>
                ${user?.avatar ? `<button class="btn btn-ghost btn-xs text-danger" onclick="removeDashboardAvatar()"><i class="bi bi-trash"></i> Remove</button>` : ''}
              </div>
            </div>
          </div>
          <div class="grid-4 mb-6 stagger-children" id="statCards">
            ${UI.skeleton('stat', 4)}
          </div>
          <div class="grid-2 mb-6">
            <div class="card"><div class="card-header"><h5 class="card-title">System Overview</h5></div><div class="table-container"><table class="table table-sm"><thead><tr><th>Service</th><th>Status</th><th>Uptime</th><th>Load</th></tr></thead><tbody><tr><td>Web Portal</td><td>${UI.badge('Operational', 'success')}</td><td>99.99%</td><td>23%</td></tr><tr><td>Database</td><td>${UI.badge('Operational', 'success')}</td><td>99.97%</td><td>45%</td></tr><tr><td>API Gateway</td><td>${UI.badge('Operational', 'success')}</td><td>99.95%</td><td>34%</td></tr><tr><td>File Storage</td><td>${UI.badge('Operational', 'success')}</td><td>99.99%</td><td>12%</td></tr><tr><td>Email Service</td><td>${UI.badge('Degraded', 'warning')}</td><td>98.5%</td><td>67%</td></tr></tbody></table></div></div>
            <div class="card"><div class="card-header"><h5 class="card-title">Support Tickets</h5><span class="badge badge-info">23 Active</span></div><div class="d-flex flex-column gap-2"><div class="p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><div class="d-flex justify-between mb-1"><span class="text-sm fw-medium">Login Issue</span>${UI.badge('High', 'danger')}</div><div class="text-xs text-tertiary">User unable to reset password • 2h ago</div></div><div class="p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><div class="d-flex justify-between mb-1"><span class="text-sm fw-medium">Course Enrollment</span>${UI.badge('Medium', 'warning')}</div><div class="text-xs text-tertiary">Student cannot enroll in CS302 • 5h ago</div></div><div class="p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><div class="d-flex justify-between mb-1"><span class="text-sm fw-medium">Grade Display</span>${UI.badge('Low', 'info')}</div><div class="text-xs text-tertiary">Grades not showing correctly • 1d ago</div></div></div></div>
          </div>
          <div class="grid-3">
            <div class="card"><div class="card-header"><h5 class="card-title">Departments</h5></div></div>
            <div class="card"><div class="card-header"><h5 class="card-title">Recent Activity</h5></div></div>
            <div class="card"><div class="card-header"><h5 class="card-title">Pending Approvals</h5><span class="badge badge-warning">8</span></div></div>
          </div>
        </div>

        <!-- ============ PANEL 2: USERS ============ -->
        <div class="sa-panel" id="panel-users" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <div class="d-flex gap-3 align-items-center flex-wrap">
              <div class="search-box" style="width:320px">
                <i class="bi bi-search"></i>
                <input type="text" class="form-control" id="userSearchInput" placeholder="Search by name, email, username..." oninput="filterUserTable()">
              </div>
              <select class="form-select" id="userRoleFilter" onchange="filterUserTable()" style="width:auto">
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="financial_admin">Financial Admin</option>
                <option value="educational_admin">Educational Admin</option>
                <option value="general_admin">General Admin</option>
                <option value="monitor_admin">Monitor Admin</option>
                <option value="sports_admin">Sports Admin</option>
                <option value="operations_manager">Operations</option>
              </select>
              <select class="form-select" id="userStatusFilter" onchange="filterUserTable()" style="width:auto">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div class="d-flex gap-2">
              <span class="text-sm text-tertiary" id="userCountDisplay">0 users</span>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm" id="userTable">
                <thead><tr><th>ID</th><th>Username</th><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="userTableBody"></tbody>
              </table>
            </div>
          </div>
          <div class="grid-2 mt-4">
            <div class="card">
              <div class="card-header"><h5 class="card-title">Assign Role</h5></div>
              <div class="p-3">
                <div class="d-flex gap-2 align-items-end flex-wrap">
                  <div>
                    <label class="form-label text-xs text-tertiary">Select User</label>
                    <select class="form-select" id="roleAssignUser" style="min-width:200px"><option value="">-- Select User --</option></select>
                  </div>
                  <div>
                    <label class="form-label text-xs text-tertiary">New Role</label>
                    <select class="form-select" id="roleAssignTarget" style="min-width:160px">
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="financial_admin">Financial Admin</option>
                      <option value="educational_admin">Educational Admin</option>
                      <option value="general_admin">General Admin</option>
                      <option value="monitor_admin">Monitor Admin</option>
                      <option value="sports_admin">Sports Admin</option>
                      <option value="operations_manager">Operations</option>
                    </select>
                  </div>
                  <button class="btn btn-primary btn-sm" onclick="assignRole()"><i class="bi bi-check2"></i> Assign</button>
                </div>
              </div>
            </div>
            <div class="card">
              <div class="card-header"><h5 class="card-title">Role Change History</h5></div>
              <div class="table-container">
                <table class="table table-sm">
                  <thead><tr><th>User</th><th>From</th><th>To</th><th>By</th><th>Date</th></tr></thead>
                  <tbody id="roleHistoryBody"><tr><td colspan="5" class="text-center text-secondary text-sm">No recent changes</td></tr></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- ============ PANEL 3: ELECTIONS MANAGEMENT ============ -->
        <div class="sa-panel" id="panel-elections" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <div class="d-flex gap-3 align-items-center flex-wrap">
              <select class="form-select" id="electionStatusFilter" onchange="loadElectionsPanel()" style="width:auto">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div class="d-flex gap-2">
              <span class="text-sm text-tertiary" id="electionCountDisplay">0 elections</span>
              <button class="btn btn-primary btn-sm" onclick="showCreateElectionModal()"><i class="bi bi-plus-lg"></i> Create Election</button>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm" id="electionsTable">
                <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Start</th><th>End</th><th>Votes</th><th>Actions</th></tr></thead>
                <tbody id="electionsTableBody"></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL 4: MESSAGES ============ -->
        <div class="sa-panel" id="panel-messages" style="display:none">
          <div class="chat-layout" style="height:calc(100vh - var(--navbar-height) - 210px)">
            <div class="chat-sidebar" id="chatSidebar">
              <div class="chat-search">
                <input type="text" id="chatSearchInput" placeholder="Search conversations..." oninput="AppPages.filterConversations(this.value)">
              </div>
              <button class="btn btn-sm btn-primary w-100 mb-2" onclick="AppPages.showNewChatModal()">
                <i class="bi bi-plus-lg"></i> New Chat
              </button>
              <div id="conversationsList">${UI.skeleton('table', 6)}</div>
            </div>
            <div class="chat-main" id="chatMainArea">
              <div class="chat-header" id="chatHeader">
                <div class="d-flex align-items-center gap-3">
                  <button class="btn btn-sm btn-ghost d-lg-none" onclick="document.getElementById('chatSidebar').classList.toggle('mobile-show')">
                    <i class="bi bi-arrow-left"></i>
                  </button>
                  <div class="avatar avatar-sm" id="chatPartnerAvatar" style="background:#2563EB">SK</div>
                  <div>
                    <div class="text-sm fw-medium" id="chatPartnerName">Select a conversation</div>
                    <div class="text-xs text-tertiary">Choose a chat to start messaging</div>
                  </div>
                </div>
              </div>
              <div class="chat-messages" id="chatMessages">
                <div class="d-flex align-items-center justify-content-center h-100">
                  <div class="text-center text-tertiary">
                    <i class="bi bi-chat-dots" style="font-size:3rem;opacity:0.3"></i>
                    <p class="mt-3">Select a conversation to start chatting</p>
                  </div>
                </div>
              </div>
              <div class="chat-input-area" id="chatInputArea" style="display:none">
                <input type="text" id="chatInput" placeholder="Type a message..." onkeydown="if(event.key==='Enter')AppPages.sendChatMessage()">
                <button class="btn btn-sm btn-primary" onclick="AppPages.sendChatMessage()"><i class="bi bi-send"></i></button>
              </div>
            </div>
          </div>
          <div class="modal-overlay" id="newChatModal" style="display:none" onclick="if(event.target===this)this.style.display='none'">
            <div class="modal-content" style="max-width:400px">
              <div class="modal-header">
                <h5>New Conversation</h5>
                <button class="btn btn-sm btn-ghost" onclick="document.getElementById('newChatModal').style.display='none'"><i class="bi bi-x-lg"></i></button>
              </div>
              <div class="modal-body">
                <input type="text" class="form-input mb-3" id="newChatSearch" placeholder="Search users..." oninput="AppPages.filterNewChatUsers(this.value)">
                <div id="newChatUsersList">${UI.skeleton('table', 5)}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ============ PANEL 5: NOTIFICATIONS ============ -->
        <div class="sa-panel" id="panel-notifications" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <p class="text-secondary text-sm">Stay updated with the latest activities.</p>
            <button class="btn btn-sm btn-ghost" onclick="AppPages.markAllRead()"><i class="bi bi-check-all"></i> Mark all as read</button>
          </div>
          <div class="card p-0" id="notificationsList">
            ${UI.skeleton('table', 8)}
          </div>
        </div>

        <!-- ============ PANEL: LESSONS ============ -->
        <div class="sa-panel" id="panel-lessons" style="display:none">
          <div id="lessonsFileManager"><div class="text-center text-tertiary p-4">Loading...</div></div>
        </div>

        <!-- ============ PANEL: GALLERY MANAGEMENT ============ -->
        <div class="sa-panel" id="panel-gallery" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <h4 class="fw-bold mb-0"><i class="bi bi-images me-2"></i>Gallery Management</h4>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-primary" onclick="Dashboards._showAddGalleryItem()"><i class="bi bi-plus-lg"></i> Add Item</button>
              <button class="btn btn-sm btn-ghost" onclick="Dashboards._loadGallery()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>Preview</th><th>Title</th><th>Category</th><th>Type</th><th>Status</th><th>Author</th><th>Created</th><th>Actions</th></tr></thead>
                <tbody id="galleryTableBody"><tr><td colspan="9" class="text-center text-tertiary py-4">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: MEMBER APPROVALS ============ -->
        <div class="sa-panel" id="panel-members" style="display:none">
          <div id="memberDirectoryRoot">
            <div class="d-flex justify-between align-items-center mb-4">
              <div class="text-sm text-tertiary">Loading member directory…</div>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: QUIZ MANAGER ============ -->
        <div class="sa-panel" id="panel-quiz-manage" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h4 class="fw-bold">Quiz Arena Manager</h4>
              <p class="text-sm text-tertiary">Manage skills and questions for the Quiz Arena</p>
            </div>
            <div class="d-flex gap-2">
              <input type="text" class="form-input" id="quizManageSearch" placeholder="Search skills..." oninput="filterQuizManage()" style="width:220px">
              <button class="btn btn-primary btn-sm" onclick="loadQuizManagePanel()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
            </div>
          </div>
          <div class="grid-4 mb-4" id="quizManageStats">
            <div class="stat-card"><div class="stat-card-icon blue"><i class="bi bi-controller"></i></div><div><div class="stat-card-label">Total Skills</div><div class="stat-card-value" id="qmAmtSkills">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon green"><i class="bi bi-question-circle"></i></div><div><div class="stat-card-label">Total Questions</div><div class="stat-card-value" id="qmAmtQuestions">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon yellow"><i class="bi bi-people"></i></div><div><div class="stat-card-label">Total Players</div><div class="stat-card-value" id="qmAmtPlayers">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon purple"><i class="bi bi-trophy"></i></div><div><div class="stat-card-label">Quizzes Taken</div><div class="stat-card-value" id="qmAmtQuizzes">-</div></div></div>
          </div>
          <div class="card">
            <div class="card-header"><h5 class="card-title">Skills & Questions</h5></div>
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>Skill</th><th>Category</th><th>Questions</th><th>Difficulty</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="quizManageBody"><tr><td colspan="6" class="text-center text-tertiary py-4">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
          <div class="card mt-4" id="quizEditCard" style="display:none">
            <div class="card-header"><h5 class="card-title" id="quizEditTitle">Edit Questions</h5><button class="btn btn-sm btn-ghost" onclick="document.getElementById('quizEditCard').style.display='none'"><i class="bi bi-x-lg"></i></button></div>
            <div class="p-3" id="quizEditContent"></div>
          </div>
        </div>

        <!-- ============ PANEL: VIDEO COURSES ============ -->
        <div class="sa-panel" id="panel-video-courses" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <div class="d-flex align-items-center gap-2">
              <h4 class="fw-bold mb-0">Video Courses</h4>
              <div class="d-flex gap-1 ms-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md);padding:3px">
                <button class="btn btn-xs vc-mode-btn" data-mode="browse" onclick="switchVcMode('browse')" style="border-radius:var(--radius-sm);padding:4px 12px">Browse</button>
                <button class="btn btn-xs vc-mode-btn" data-mode="manage" onclick="switchVcMode('manage')" style="border-radius:var(--radius-sm);padding:4px 12px">Manage</button>
              </div>
            </div>
            <div class="d-flex gap-2">
              <input type="text" class="form-input form-input-sm" id="vcSearchInput" placeholder="Search skills..." oninput="filterVideoCourses()" style="width:220px">
              <button class="btn btn-sm btn-primary" onclick="loadVideoCoursesPanel()"><i class="bi bi-arrow-clockwise"></i></button>
            </div>
          </div>
          <div class="grid-4 mb-4" id="vcStats">
            <div class="stat-card"><div class="stat-card-icon blue"><i class="bi bi-youtube"></i></div><div><div class="stat-card-label">Total Skills</div><div class="stat-card-value" id="vcAmtSkills">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon red"><i class="bi bi-play-circle"></i></div><div><div class="stat-card-label">Total Videos</div><div class="stat-card-value" id="vcAmtVideos">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon green"><i class="bi bi-eye"></i></div><div><div class="stat-card-label">Total Views</div><div class="stat-card-value" id="vcAmtViews">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon yellow"><i class="bi bi-clock-history"></i></div><div><div class="stat-card-label">Watch Time</div><div class="stat-card-value" id="vcAmtWatchTime">-</div></div></div>
          </div>
          <div id="vcBrowseView">
            <div id="vcSkillGrid" class="grid-3 stagger-children"></div>
            <div id="vcVideoList" style="display:none"></div>
            <div id="vcPlayer" style="display:none"></div>
          </div>
          <div id="vcManageView" style="display:none">
            <div class="card">
              <div class="card-header d-flex justify-between items-center">
                <h5 class="card-title mb-0">Skills & Videos</h5>
                <button class="btn btn-success btn-sm" onclick="showAddYtSkillModalUnified()"><i class="bi bi-plus-lg"></i> Add Skill</button>
              </div>
              <div class="table-container">
                <table class="table table-sm">
                  <thead><tr><th>Skill</th><th>Category</th><th>Videos</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody id="vcManageBody"><tr><td colspan="5" class="text-center text-tertiary py-4">Loading...</td></tr></tbody>
                </table>
              </div>
            </div>
            <div class="card mt-4" id="vcEditCard" style="display:none">
              <div class="card-header d-flex justify-between items-center">
                <h5 class="card-title mb-0" id="vcEditTitle">Edit</h5>
                <button class="btn btn-sm btn-ghost" onclick="document.getElementById('vcEditCard').style.display='none'"><i class="bi bi-x-lg"></i></button>
              </div>
              <div class="p-3" id="vcEditContent"></div>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: STUDENT CLAIMS ============ -->
        <div class="sa-panel" id="panel-claims" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4">
            <h4 class="fw-bold mb-0"><i class="bi bi-patch-check me-2"></i>Student Claims</h4>
            <button class="btn btn-sm btn-ghost" onclick="Dashboards._loadClaims()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
          </div>
          <div class="card p-0" id="claimsTableContainer">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>User ID</th><th>Full Name</th><th>Student ID</th><th>Username</th><th>Email</th><th>Registered</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="claimsTableBody"><tr><td colspan="8" class="text-center text-tertiary py-4">Loading claims...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    `, 'general_admin');
  },

  // ===== MONITOR ADMIN DASHBOARD =====
  monitor_admin() {
    return this.renderShell('Security Monitor', `
      <div id="sa-panel-container">

        <!-- ============ PANEL: OVERVIEW ============ -->
        <div class="sa-panel" id="panel-overview">
          <div class="grid-4 mb-6 stagger-children" id="statCards">
            ${UI.skeleton('stat', 4)}
          </div>
          <div class="grid-2 mb-6">
            <div class="card">
              <div class="card-header"><h5 class="card-title">Security Overview</h5></div>
              <div class="chart-container"><canvas id="securityChart"></canvas></div>
            </div>
            <div class="card">
              <div class="card-header">
                <h5 class="card-title">Recent Alerts</h5>
                <button class="btn btn-ghost btn-xs text-primary" onclick="loadMonitorAlerts()">View All</button>
              </div>
              <div id="monitorOverviewAlerts" class="d-flex flex-column gap-2 p-3">
                <div class="text-center text-tertiary text-sm">Loading...</div>
              </div>
            </div>
          </div>
          <div class="grid-3">
            <div class="card">
              <div class="card-header"><h5 class="card-title">System Health</h5></div>
              <div id="monitorSystemHealth" class="d-flex flex-column gap-3 p-3">
                <div class="text-center text-tertiary text-sm">Loading...</div>
              </div>
            </div>
            <div class="card">
              <div class="card-header"><h5 class="card-title">Recent Activity</h5></div>
              <div id="monitorRecentActivity" class="d-flex flex-column gap-2 p-3">
                <div class="text-center text-tertiary text-sm">Loading...</div>
              </div>
            </div>
            <div class="card">
              <div class="card-header"><h5 class="card-title">Activity Summary</h5></div>
              <div id="monitorActivitySummary" class="d-flex flex-column gap-2 p-3">
                <div class="text-center text-tertiary text-sm">Loading...</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: ALERTS ============ -->
        <div class="sa-panel" id="panel-alerts" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Alert Management</h4>
            <div class="d-flex gap-2">
              <span class="text-sm text-tertiary" id="monitorAlertCount">0 alerts</span>
              <button class="btn btn-ghost btn-sm text-primary" onclick="acknowledgeAllMonitorAlerts()"><i class="bi bi-check2-all"></i> Acknowledge All</button>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>Title</th><th>Message</th><th>Severity</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody id="monitorAlertsBody"><tr><td colspan="7" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: LOGIN ATTEMPTS ============ -->
        <div class="sa-panel" id="panel-login-attempts" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Login Attempts</h4>
            <div class="d-flex gap-2">
              <select class="form-input" id="monitorLoginFilterSuccess" onchange="loadMonitorLoginAttempts()" style="width:auto">
                <option value="">All</option>
                <option value="1">Successful</option>
                <option value="0">Failed</option>
              </select>
              <button class="btn btn-ghost btn-sm" onclick="loadMonitorLoginAttempts()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>User</th><th>IP Address</th><th>Status</th><th>Fail Reason</th><th>Device</th><th>OS</th><th>Browser</th><th>Date</th></tr></thead>
                <tbody id="monitorLoginAttemptsBody"><tr><td colspan="9" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: ACTIVITY LOGS ============ -->
        <div class="sa-panel" id="panel-activity-logs" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Activity Logs</h4>
            <button class="btn btn-ghost btn-sm" onclick="loadMonitorActivityLogs()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th><th>IP</th><th>Device</th><th>Date</th></tr></thead>
                <tbody id="monitorActivityLogsBody"><tr><td colspan="8" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: SUSPICIOUS IPS ============ -->
        <div class="sa-panel" id="panel-suspicious-ips" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Suspicious IP Addresses</h4>
            <button class="btn btn-ghost btn-sm" onclick="loadMonitorSuspiciousIps()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>IP Address</th><th>Failed Attempts</th><th>Last Attempt</th><th>Actions</th></tr></thead>
                <tbody id="monitorSuspiciousIpsBody"><tr><td colspan="4" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: BLOCKED IPS ============ -->
        <div class="sa-panel" id="panel-blocked-ips" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Blocked IP Addresses</h4>
            <div class="d-flex gap-2">
              <span class="text-sm text-tertiary" id="monitorBlockedIpCount">0 blocked</span>
              <button class="btn btn-ghost btn-sm" onclick="loadMonitorBlockedIps()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>IP Address</th><th>Reason</th><th>Blocked By</th><th>Blocked At</th><th>Actions</th></tr></thead>
                <tbody id="monitorBlockedIpsBody"><tr><td colspan="5" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: USERS ============ -->
        <div class="sa-panel" id="panel-monitor-users" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">User Management</h4>
            <button class="btn btn-ghost btn-sm" onclick="loadMonitorUsers()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>Username</th><th>Name</th><th>Role</th><th>Status</th><th>Last Login IP</th><th>Devices</th><th>Last Login</th><th>Failed 24h</th><th>IP Blocked</th><th>Actions</th></tr></thead>
                <tbody id="monitorUsersBody"><tr><td colspan="11" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    `, 'monitor_admin');
  },

  // ===== SPORTS ADMIN DASHBOARD =====
  sports_admin() {
    return this.renderShell('Sports Dashboard', `
      <div class="grid-4 mb-6 stagger-children" id="statCards">
        ${UI.skeleton('stat', 4)}
      </div>
      <div class="grid-2 mb-6">
        <div class="card"><div class="card-header"><h5 class="card-title">Upcoming Matches</h5></div><div class="table-container"><table class="table table-sm"><thead><tr><th>Sport</th><th>Teams</th><th>Date</th><th>Venue</th></tr></thead><tbody><tr><td>Football</td><td>CS15 vs CS14</td><td>Dec 5</td><td>Main Field</td></tr><tr><td>Basketball</td><td>CS15 vs CS13</td><td>Dec 8</td><td>Indoor Court</td></tr><tr><td>Volleyball</td><td>CS15 vs CS12</td><td>Dec 12</td><td>Beach Court</td></tr><tr><td>Chess</td><td>CS15 vs Eng</td><td>Dec 15</td><td>Student Lounge</td></tr></tbody></table></div></div>
        <div class="card"><div class="card-header"><h5 class="card-title">Team Performance</h5></div><div class="chart-container"><canvas id="sportsChart"></canvas></div></div>
      </div>
      <div class="grid-3">
        <div class="card"><div class="card-header"><h5 class="card-title">Active Teams</h5><span class="badge badge-info">8</span></div><div class="d-flex flex-wrap gap-2 mt-2"><span class="badge badge-primary">Football</span><span class="badge badge-success">Basketball</span><span class="badge badge-purple">Volleyball</span><span class="badge badge-warning">Chess</span><span class="badge badge-danger">Swimming</span><span class="badge badge-info">Athletics</span><span class="badge badge-primary">Tennis</span><span class="badge badge-success">E-Sports</span></div></div>
        <div class="card"><div class="card-header"><h5 class="card-title">Top Athletes</h5></div></div>
        <div class="card"><div class="card-header"><h5 class="card-title">Facility Usage</h5></div></div>
      </div>
    `, 'sports_admin');
  },

  // ===== SUPER ADMIN DASHBOARD =====
  super_admin() {
    const user = DB.currentUser;
    return this.renderShell('Super Admin', `
      <div id="sa-panel-container">
        <!-- ============ PANEL 1: OVERVIEW ============ -->
        <div class="sa-panel" id="panel-overview">
          <div class="card mb-6" id="profileCard">
            <div class="d-flex align-items-center gap-4 p-4">
              <div style="position:relative;flex-shrink:0">
                <div id="overviewAvatar">${user?.avatar ? `<img src="${user.avatar}" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:50%">` : `<div class="avatar avatar-lg" style="background:${UI.getAvatarColor(user?.name||'U')};width:64px;height:64px;font-size:1.2rem">${UI.getInitials(user?.name||'U')}</div>`}</div>
                <label for="overviewAvatarInput" style="position:absolute;bottom:0;right:0;width:24px;height:24px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid var(--bg-card)">
                  <i class="bi bi-camera" style="font-size:12px;color:#fff"></i>
                  <input type="file" id="overviewAvatarInput" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none">
                </label>
              </div>
              <div>
                <h5 class="mb-1">${user?.name || 'User'}</h5>
                <p class="text-sm text-tertiary mb-1">${Dashboards.roleConfig[user?.role]?.label || user?.role || ''} &bull; ${user?.email || ''}</p>
                ${user?.avatar ? `<button class="btn btn-ghost btn-xs text-danger" onclick="removeDashboardAvatar()"><i class="bi bi-trash"></i> Remove</button>` : ''}
              </div>
            </div>
          </div>
          <div class="grid-4 mb-6 stagger-children" id="statCards">
            ${UI.skeleton('stat', 4)}
          </div>
          <div class="grid-2 mb-6">
            <div class="card"><div class="card-header"><h5 class="card-title">Platform Growth</h5></div><div class="chart-container"><canvas id="growthChart"></canvas></div></div>
            <div class="card">
              <div class="card-header"><h5 class="card-title">System Health</h5><span class="badge badge-success">All Systems Operational</span></div>
              <div class="d-flex flex-column gap-3 mt-3">
                <div class="d-flex justify-between items-center"><span class="text-sm">Web Portal</span><div class="d-flex align-items-center gap-2"><span class="status-indicator status-online"></span><span class="text-sm text-success">Operational</span><span class="text-xs text-tertiary">99.99%</span></div></div>
                <div class="d-flex justify-between items-center"><span class="text-sm">Database Cluster</span><div class="d-flex align-items-center gap-2"><span class="status-indicator status-online"></span><span class="text-sm text-success">Operational</span><span class="text-xs text-tertiary">99.97%</span></div></div>
                <div class="d-flex justify-between items-center"><span class="text-sm">API Services</span><div class="d-flex align-items-center gap-2"><span class="status-indicator status-online"></span><span class="text-sm text-success">Operational</span><span class="text-xs text-tertiary">99.95%</span></div></div>
                <div class="d-flex justify-between items-center"><span class="text-sm">File Storage</span><div class="d-flex align-items-center gap-2"><span class="status-indicator status-online"></span><span class="text-sm text-success">Operational</span><span class="text-xs text-tertiary">99.99%</span></div></div>
                <div class="d-flex justify-between items-center"><span class="text-sm">Email Service</span><div class="d-flex align-items-center gap-2"><span class="status-indicator status-away"></span><span class="text-sm text-warning">Degraded</span><span class="text-xs text-tertiary">98.5%</span></div></div>
              </div>
            </div>
          </div>
          <div class="grid-3">
            <div class="card"><div class="card-header"><h5 class="card-title">User Distribution by Role</h5></div><div class="chart-container"><canvas id="userDistChart"></canvas></div></div>
            <div class="card"><div class="card-header"><h5 class="card-title">Revenue Overview</h5></div><div class="chart-container"><canvas id="revenueChart"></canvas></div></div>
            <div class="card"><div class="card-header"><h5 class="card-title">Recent Requests</h5></div><div id="recentRequestsContent"><div class="d-flex flex-column gap-2 mt-3 px-3 pb-3"><div class="p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><div class="d-flex justify-between mb-1"><span class="text-sm fw-medium">Database Backup</span><span class="badge badge-info">Completed</span></div><div class="text-xs text-tertiary">System • 2m ago</div></div><div class="p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><div class="d-flex justify-between mb-1"><span class="text-sm fw-medium">User Role Change</span><span class="badge badge-warning">Pending</span></div><div class="text-xs text-tertiary">Admin • 15m ago</div></div><div class="p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><div class="d-flex justify-between mb-1"><span class="text-sm fw-medium">Security Alert Review</span><span class="badge badge-danger">Critical</span></div><div class="text-xs text-tertiary">SOC • 1h ago</div></div></div></div></div>
          </div>
        </div>

        <!-- ============ PANEL 2: USER MANAGEMENT ============ -->
        <div class="sa-panel" id="panel-users" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <div class="d-flex gap-3 align-items-center flex-wrap">
              <div class="search-box" style="width:320px">
                <i class="bi bi-search"></i>
                <input type="text" class="form-control" id="userSearchInput" placeholder="Search by name, email, username..." oninput="filterUserTable()">
              </div>
              <select class="form-select" id="userRoleFilter" onchange="filterUserTable()" style="width:auto">
                <option value="all">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
                <option value="soc">SOC</option>
                <option value="operations_manager">Operations</option>
              </select>
              <select class="form-select" id="userStatusFilter" onchange="filterUserTable()" style="width:auto">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div class="d-flex gap-2">
              <span class="text-sm text-tertiary" id="userCountDisplay">0 users</span>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm" id="userTable">
                <thead><tr><th>ID</th><th>Username</th><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="userTableBody"></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL 3: ROLE ASSIGNMENT ============ -->
        <div class="sa-panel" id="panel-roles" style="display:none">
          <div class="grid-2 mb-6">
            <div class="card">
              <div class="card-header"><h5 class="card-title">Role Assignment</h5><span class="badge badge-info">Drag & Assign</span></div>
              <div class="p-3">
                <div class="mb-3">
                  <label class="text-sm fw-medium mb-2">Select User</label>
                  <select class="form-select" id="roleAssignUser"><option value="">-- Select User --</option></select>
                </div>
                <div class="mb-3">
                  <label class="text-sm fw-medium mb-2">Assign Role</label>
                  <select class="form-select" id="roleAssignTarget">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="financial_admin">Financial Admin</option>
                    <option value="educational_admin">Educational Admin</option>
                    <option value="general_admin">General Admin</option>
                    <option value="monitor_admin">Monitor Admin</option>
                    <option value="sports_admin">Sports Admin</option>
                    <option value="soc">SOC Team</option>
                    <option value="operations_manager">Operations Manager</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
                <button class="btn btn-primary w-100" onclick="assignRole()">Assign Role</button>
              </div>
            </div>
            <div class="card">
              <div class="card-header"><h5 class="card-title">Role Change History</h5><button class="btn btn-sm btn-ghost" onclick="exportRoleHistory()">Export</button></div>
              <div class="table-container">
                <table class="table table-sm">
                  <thead><tr><th>User</th><th>Old Role</th><th>New Role</th><th>Changed By</th><th>Time</th></tr></thead>
                  <tbody id="roleHistoryBody">
                    <tr><td colspan="5" class="text-center text-tertiary py-4">No recent role changes</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><h5 class="card-title">Bulk Role Assignment</h5></div>
            <div class="p-3">
              <div class="d-flex gap-3 align-items-end flex-wrap">
                <div>
                  <label class="text-sm fw-medium mb-2">Select Users</label>
                  <select class="form-select" multiple id="bulkUserSelect" style="height:120px;min-width:250px">
                  </select>
                </div>
                <div>
                  <label class="text-sm fw-medium mb-2">Assign Role</label>
                  <select class="form-select" id="bulkRoleTarget">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="soc">SOC Team</option>
                    <option value="operations_manager">Operations Manager</option>
                  </select>
                </div>
                <button class="btn btn-primary" onclick="bulkAssignRole()">Apply to Selected</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ============ PANEL 4: SECURITY (SOC) ============ -->
        <div class="sa-panel" id="panel-security" style="display:none">
          <div class="d-flex align-items-center gap-3 mb-4">
            <span class="badge badge-danger animate-pulse"><span class="status-indicator status-busy me-1"></span> 3 Active Critical</span>
            <span class="badge badge-warning"><span class="status-indicator status-away me-1"></span> 2 High</span>
            <span class="badge badge-info">1 Medium</span>
            <span class="badge badge-gray">1 Low</span>
            <span class="text-sm text-tertiary ml-auto">Last updated: ${new Date().toLocaleTimeString()}</span>
          </div>
          <div class="grid-4 mb-6 stagger-children" id="socStatCards">
            ${UI.skeleton('stat', 4)}
          </div>
          <div class="grid-2 mb-6">
            <div class="card"><div class="card-header"><h5 class="card-title">Login Attempts (24h)</h5></div><div class="chart-container"><canvas id="loginAttemptsChart"></canvas></div></div>
            <div class="card"><div class="card-header"><h5 class="card-title">Active Alerts</h5><span class="badge badge-danger">Live</span></div>
              <div class="d-flex flex-column gap-2" id="socAlertsList">
                <div class="p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><div class="d-flex justify-between"><span class="text-sm fw-medium d-flex align-items-center gap-2"><span class="status-indicator status-busy"></span>Brute Force Attack</span>${UI.badge('Critical', 'danger')}</div><div class="text-xs text-tertiary mt-1">185.234.56.78 • 1500 attempts in 10m</div></div>
                <div class="p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><div class="d-flex justify-between"><span class="text-sm fw-medium d-flex align-items-center gap-2"><span class="status-indicator status-away"></span>Suspicious DB Query</span>${UI.badge('High', 'warning')}</div><div class="text-xs text-tertiary mt-1">10.0.12.45 • Possible exfiltration</div></div>
                <div class="p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><div class="d-flex justify-between"><span class="text-sm fw-medium d-flex align-items-center gap-2"><span class="status-indicator status-away"></span>Failed SSH Attempts</span>${UI.badge('High', 'warning')}</div><div class="text-xs text-tertiary mt-1">45.67.89.123 • 500 attempts</div></div>
              </div>
            </div>
          </div>
          <div class="grid-3">
            <div class="card"><div class="card-header"><h5 class="card-title">IP Tracking</h5></div>
              <div class="table-container">
                <table class="table table-sm">
                  <thead><tr><th>IP Address</th><th>Location</th><th>Risk</th><th>Attempts</th><th>Action</th></tr></thead>
                  <tbody>
                    <tr><td class="text-mono">185.234.56.78</td><td>RU</td><td>${UI.badge('Critical', 'danger')}</td><td>1,542</td><td><button class="btn btn-sm btn-danger" onclick="blockIP('185.234.56.78')">Block</button></td></tr>
                    <tr><td class="text-mono">45.67.89.123</td><td>CN</td><td>${UI.badge('High', 'warning')}</td><td>523</td><td><button class="btn btn-sm btn-danger" onclick="blockIP('45.67.89.123')">Block</button></td></tr>
                    <tr><td class="text-mono">10.0.12.45</td><td>Internal</td><td>${UI.badge('Medium', 'info')}</td><td>89</td><td><button class="btn btn-sm btn-warning" onclick="blockIP('10.0.12.45')">Review</button></td></tr>
                    <tr><td class="text-mono">78.90.12.34</td><td>NG</td><td>${UI.badge('Low', 'gray')}</td><td>12</td><td><button class="btn btn-sm btn-ghost" onclick="blockIP('78.90.12.34')">Ignore</button></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="card"><div class="card-header"><h5 class="card-title">System Alerts</h5></div>
              <div class="d-flex flex-column gap-2 p-3">
                <div class="d-flex justify-between items-center"><span class="text-sm"><span class="status-indicator status-busy me-2"></span>DDoS Pattern Detected</span><span class="text-xs text-tertiary">2m ago</span></div>
                <div class="d-flex justify-between items-center"><span class="text-sm"><span class="status-indicator status-away me-2"></span>Unusual DB Access</span><span class="text-xs text-tertiary">15m ago</span></div>
                <div class="d-flex justify-between items-center"><span class="text-sm"><span class="status-indicator status-online me-2"></span>SSL Certificate Renewed</span><span class="text-xs text-tertiary">1h ago</span></div>
                <div class="d-flex justify-between items-center"><span class="text-sm"><span class="status-indicator status-online me-2"></span>Firewall Updated</span><span class="text-xs text-tertiary">3h ago</span></div>
              </div>
            </div>
            <div class="card"><div class="card-header"><h5 class="card-title">Blocked IPs</h5><span class="badge badge-danger">245</span></div>
              <div class="p-3">
                <div class="d-flex flex-column gap-2">
                  <div class="d-flex justify-between items-center"><span class="text-sm text-mono">185.234.56.78</span><span class="text-xs text-tertiary">Permanent</span></div>
                  <div class="d-flex justify-between items-center"><span class="text-sm text-mono">45.67.89.123</span><span class="text-xs text-tertiary">24h remaining</span></div>
                  <div class="d-flex justify-between items-center"><span class="text-sm text-mono">203.45.67.89</span><span class="text-xs text-tertiary">Permanent</span></div>
                  <div class="d-flex justify-between items-center"><span class="text-sm text-mono">12.34.56.78</span><span class="text-xs text-tertiary">6h remaining</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ============ PANEL 5: CONTENT CENTER ============ -->
        <div class="sa-panel" id="panel-content" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <div class="d-flex gap-3 align-items-center flex-wrap">
              <div class="search-box" style="width:320px">
                <i class="bi bi-search"></i>
                <input type="text" class="form-control" id="contentSearchInput" placeholder="Search posts..." oninput="filterContentTable()">
              </div>
              <select class="form-select" id="contentTypeFilter" onchange="filterContentTable()" style="width:auto">
                <option value="all">All Types</option>
                <option value="blog">Blog</option>
                <option value="announcement">Announcement</option>
                <option value="resource">Resource</option>
                <option value="challenge">Challenge</option>
                <option value="project">Project</option>
                <option value="gallery">Gallery</option>
              </select>
              <select class="form-select" id="contentStatusFilter" onchange="filterContentTable()" style="width:auto">
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <span class="text-sm text-tertiary">0 total posts</span>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm" id="contentTable">
                <thead><tr><th>ID</th><th>Title</th><th>Type</th><th>Author</th><th>Status</th><th>Views</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody id="contentTableBody"></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: LESSONS ============ -->
          <div class="sa-panel" id="panel-lessons" style="display:none">
          <div id="lessonsFileManager"><div class="text-center text-tertiary p-4">Loading...</div></div>
        </div>

        <!-- ============ PANEL: COURSES ============ -->
        <div class="sa-panel" id="panel-courses" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold"><i class="bi bi-book me-2"></i>Course Management</h4>
            <button class="btn btn-primary btn-sm" onclick="showEdCreateCourseModal()"><i class="bi bi-plus-lg"></i> Add Course</button>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>Code</th><th>Name</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="edCoursesBody"><tr><td colspan="5" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: GALLERY MANAGEMENT ============ -->
        <div class="sa-panel" id="panel-gallery" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <h4 class="fw-bold mb-0"><i class="bi bi-images me-2"></i>Gallery Management</h4>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-primary" onclick="Dashboards._showAddGalleryItem()"><i class="bi bi-plus-lg"></i> Add Item</button>
              <button class="btn btn-sm btn-ghost" onclick="Dashboards._loadGallery()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>Preview</th><th>Title</th><th>Category</th><th>Type</th><th>Status</th><th>Author</th><th>Created</th><th>Actions</th></tr></thead>
                <tbody id="galleryTableBody"><tr><td colspan="9" class="text-center text-tertiary py-4">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: MEMBER APPROVALS ============ -->
        <div class="sa-panel" id="panel-members" style="display:none">
          <div id="memberDirectoryRoot">
            <div class="d-flex justify-between align-items-center mb-4">
              <div class="text-sm text-tertiary">Loading member directory…</div>
            </div>
          </div>
        </div>

        <!-- ============ PANEL 12: ELECTIONS MANAGEMENT ============ -->
        <div class="sa-panel" id="panel-elections" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <div class="d-flex gap-3 align-items-center flex-wrap">
              <select class="form-select" id="electionStatusFilter" onchange="loadElectionsPanel()" style="width:auto">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div class="d-flex gap-2">
              <span class="text-sm text-tertiary" id="electionCountDisplay">0 elections</span>
              <button class="btn btn-primary btn-sm" onclick="showCreateElectionModal()"><i class="bi bi-plus-lg"></i> Create Election</button>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm" id="electionsTable">
                <thead><tr><th>ID</th><th>Title</th><th>Status</th><th>Start</th><th>End</th><th>Votes</th><th>Actions</th></tr></thead>
                <tbody id="electionsTableBody"></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: QUIZ MANAGER ============ -->
        <div class="sa-panel" id="panel-quiz-manage" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h4 class="fw-bold">Quiz Arena Manager</h4>
              <p class="text-sm text-tertiary">Manage skills and questions for the Quiz Arena</p>
            </div>
            <div class="d-flex gap-2">
              <input type="text" class="form-input" id="quizManageSearch" placeholder="Search skills..." oninput="filterQuizManage()" style="width:220px">
              <button class="btn btn-primary btn-sm" onclick="loadQuizManagePanel()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
            </div>
          </div>
          <div class="grid-4 mb-4" id="quizManageStats">
            <div class="stat-card"><div class="stat-card-icon blue"><i class="bi bi-controller"></i></div><div><div class="stat-card-label">Total Skills</div><div class="stat-card-value" id="qmAmtSkills">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon green"><i class="bi bi-question-circle"></i></div><div><div class="stat-card-label">Total Questions</div><div class="stat-card-value" id="qmAmtQuestions">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon yellow"><i class="bi bi-people"></i></div><div><div class="stat-card-label">Total Players</div><div class="stat-card-value" id="qmAmtPlayers">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon purple"><i class="bi bi-trophy"></i></div><div><div class="stat-card-label">Quizzes Taken</div><div class="stat-card-value" id="qmAmtQuizzes">-</div></div></div>
          </div>
          <div class="card">
            <div class="card-header"><h5 class="card-title">Skills & Questions</h5></div>
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>Skill</th><th>Category</th><th>Questions</th><th>Difficulty</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="quizManageBody"><tr><td colspan="6" class="text-center text-tertiary py-4">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
          <div class="card mt-4" id="quizEditCard" style="display:none">
            <div class="card-header"><h5 class="card-title" id="quizEditTitle">Edit Questions</h5><button class="btn btn-sm btn-ghost" onclick="document.getElementById('quizEditCard').style.display='none'"><i class="bi bi-x-lg"></i></button></div>
            <div class="p-3" id="quizEditContent"></div>
          </div>
        </div>

        <!-- ============ PANEL: VIDEO COURSES ============ -->
        <div class="sa-panel" id="panel-video-courses" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <div class="d-flex align-items-center gap-2">
              <h4 class="fw-bold mb-0">Video Courses</h4>
              <div class="d-flex gap-1 ms-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md);padding:3px">
                <button class="btn btn-xs vc-mode-btn" data-mode="browse" onclick="switchVcMode('browse')" style="border-radius:var(--radius-sm);padding:4px 12px">Browse</button>
                <button class="btn btn-xs vc-mode-btn" data-mode="manage" onclick="switchVcMode('manage')" style="border-radius:var(--radius-sm);padding:4px 12px">Manage</button>
              </div>
            </div>
            <div class="d-flex gap-2">
              <input type="text" class="form-input form-input-sm" id="vcSearchInput" placeholder="Search skills..." oninput="filterVideoCourses()" style="width:220px">
              <button class="btn btn-sm btn-primary" onclick="loadVideoCoursesPanel()"><i class="bi bi-arrow-clockwise"></i></button>
            </div>
          </div>
          <div class="grid-4 mb-4" id="vcStats">
            <div class="stat-card"><div class="stat-card-icon blue"><i class="bi bi-youtube"></i></div><div><div class="stat-card-label">Total Skills</div><div class="stat-card-value" id="vcAmtSkills">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon red"><i class="bi bi-play-circle"></i></div><div><div class="stat-card-label">Total Videos</div><div class="stat-card-value" id="vcAmtVideos">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon green"><i class="bi bi-eye"></i></div><div><div class="stat-card-label">Total Views</div><div class="stat-card-value" id="vcAmtViews">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon yellow"><i class="bi bi-clock-history"></i></div><div><div class="stat-card-label">Watch Time</div><div class="stat-card-value" id="vcAmtWatchTime">-</div></div></div>
          </div>
          <div id="vcBrowseView">
            <div id="vcSkillGrid" class="grid-3 stagger-children"></div>
            <div id="vcVideoList" style="display:none"></div>
            <div id="vcPlayer" style="display:none"></div>
          </div>
          <div id="vcManageView" style="display:none">
            <div class="card">
              <div class="card-header d-flex justify-between items-center">
                <h5 class="card-title mb-0">Skills & Videos</h5>
                <button class="btn btn-success btn-sm" onclick="showAddYtSkillModalUnified()"><i class="bi bi-plus-lg"></i> Add Skill</button>
              </div>
              <div class="table-container">
                <table class="table table-sm">
                  <thead><tr><th>Skill</th><th>Category</th><th>Videos</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody id="vcManageBody"><tr><td colspan="5" class="text-center text-tertiary py-4">Loading...</td></tr></tbody>
                </table>
              </div>
            </div>
            <div class="card mt-4" id="vcEditCard" style="display:none">
              <div class="card-header d-flex justify-between items-center">
                <h5 class="card-title mb-0" id="vcEditTitle">Edit</h5>
                <button class="btn btn-sm btn-ghost" onclick="document.getElementById('vcEditCard').style.display='none'"><i class="bi bi-x-lg"></i></button>
              </div>
              <div class="p-3" id="vcEditContent"></div>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: GRADES ============ -->
        <div class="sa-panel" id="panel-grades" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Grade Management</h4>
            <button class="btn btn-primary btn-sm" onclick="showEdCreateGradeModal()"><i class="bi bi-plus-lg"></i> Add Grade</button>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>Student</th><th>Course</th><th>Score</th><th>Grade</th></tr></thead>
                <tbody id="edGradesBody"><tr><td colspan="4" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: ANALYTICS ============ -->
        <div class="sa-panel" id="panel-analytics" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Analytics Dashboard</h4>
          </div>
          <div class="grid-3 mb-4">
            <div class="stat-card"><div class="stat-card-icon blue"><i class="bi bi-people"></i></div><div><div class="stat-card-label">Total Users</div><div class="stat-card-value">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon green"><i class="bi bi-book"></i></div><div><div class="stat-card-label">Total Courses</div><div class="stat-card-value">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon purple"><i class="bi bi-file-text"></i></div><div><div class="stat-card-label">Total Posts</div><div class="stat-card-value">-</div></div></div>
          </div>
          <div class="card">
            <div class="card-header"><h5 class="card-title">Platform Overview</h5></div>
            <div class="p-4 text-center text-tertiary">Analytics dashboard — coming soon</div>
          </div>
        </div>

        <!-- ============ PANEL: NOTIFICATIONS ============ -->
        <div class="sa-panel" id="panel-notifications" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Notifications</h4>
            <button class="btn btn-sm btn-ghost" onclick="AppPages.markAllRead()"><i class="bi bi-check-all"></i> Mark all as read</button>
          </div>
          <div class="card p-0" id="notificationsList">
            ${UI.skeleton('table', 8)}
          </div>
        </div>

        <!-- ============ PANEL: AUDIT LOGS ============ -->
        <div class="sa-panel" id="panel-audit" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Audit Logs</h4>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th><th>IP</th></tr></thead>
                <tbody><tr><td colspan="5" class="text-center text-tertiary py-4">Audit logs — coming soon</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: SYSTEM CONFIG ============ -->
        <div class="sa-panel" id="panel-config" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">System Configuration</h4>
          </div>
          <div class="card p-4">
            <p class="text-center text-tertiary">System configuration panel — coming soon</p>
          </div>
        </div>

        <!-- ============ PANEL: DASHBOARD ACCESS ============ -->
        <div class="sa-panel" id="panel-access" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Dashboard Access Control</h4>
          </div>
          <div class="card p-4">
            <p class="text-center text-tertiary">Dashboard access control panel</p>
          </div>
        </div>

        <!-- ============ PANEL: BACKUP & SECURITY ============ -->
        <div class="sa-panel" id="panel-backup" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Backup & Security</h4>
          </div>
          <div class="card p-4">
            <p class="text-center text-tertiary">Backup and security management panel — coming soon</p>
          </div>
        </div>

        <!-- ============ PANEL: STUDENT CLAIMS ============ -->
        <div class="sa-panel" id="panel-claims" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4">
            <h4 class="fw-bold mb-0"><i class="bi bi-patch-check me-2"></i>Student Claims</h4>
            <button class="btn btn-sm btn-ghost" onclick="Dashboards._loadClaims()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
          </div>
          <div class="card p-0">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>User ID</th><th>Full Name</th><th>Student ID</th><th>Username</th><th>Email</th><th>Registered</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="claimsTableBody"><tr><td colspan="8" class="text-center text-tertiary py-4">Loading claims...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    `, 'super_admin');
  },

  // ===== SOC DASHBOARD =====
  soc() {
    return this.renderShell('SOC Dashboard', `
      <div id="sa-panel-container">

        <!-- ============ PANEL: OVERVIEW ============ -->
        <div class="sa-panel" id="panel-overview">
          <div class="grid-4 mb-6 stagger-children" id="statCards">
            ${UI.skeleton('stat', 4)}
          </div>
          <div class="grid-2 mb-6">
            <div class="card">
              <div class="card-header"><h5 class="card-title">Security Overview</h5></div>
              <div class="chart-container"><canvas id="securityChart"></canvas></div>
            </div>
            <div class="card">
              <div class="card-header">
                <h5 class="card-title">Recent Alerts</h5>
                <button class="btn btn-ghost btn-xs text-primary" onclick="loadMonitorAlerts()">View All</button>
              </div>
              <div id="monitorOverviewAlerts" class="d-flex flex-column gap-2 p-3">
                <div class="text-center text-tertiary text-sm">Loading...</div>
              </div>
            </div>
          </div>
          <div class="grid-3">
            <div class="card">
              <div class="card-header"><h5 class="card-title">System Health</h5></div>
              <div id="monitorSystemHealth" class="d-flex flex-column gap-3 p-3">
                <div class="text-center text-tertiary text-sm">Loading...</div>
              </div>
            </div>
            <div class="card">
              <div class="card-header"><h5 class="card-title">Recent Activity</h5></div>
              <div id="monitorRecentActivity" class="d-flex flex-column gap-2 p-3">
                <div class="text-center text-tertiary text-sm">Loading...</div>
              </div>
            </div>
            <div class="card">
              <div class="card-header"><h5 class="card-title">Activity Summary</h5></div>
              <div id="monitorActivitySummary" class="d-flex flex-column gap-2 p-3">
                <div class="text-center text-tertiary text-sm">Loading...</div>
              </div>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: ALERTS ============ -->
        <div class="sa-panel" id="panel-alerts" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Alert Management</h4>
            <div class="d-flex gap-2">
              <span class="text-sm text-tertiary" id="monitorAlertCount">0 alerts</span>
              <button class="btn btn-ghost btn-sm text-primary" onclick="acknowledgeAllMonitorAlerts()"><i class="bi bi-check2-all"></i> Acknowledge All</button>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>Title</th><th>Message</th><th>Severity</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody id="monitorAlertsBody"><tr><td colspan="7" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: LOGIN ATTEMPTS ============ -->
        <div class="sa-panel" id="panel-login-attempts" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Login Attempts</h4>
            <div class="d-flex gap-2">
              <select class="form-input" id="monitorLoginFilterSuccess" onchange="loadMonitorLoginAttempts()" style="width:auto">
                <option value="">All</option>
                <option value="1">Successful</option>
                <option value="0">Failed</option>
              </select>
              <button class="btn btn-ghost btn-sm" onclick="loadMonitorLoginAttempts()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>User</th><th>IP Address</th><th>Status</th><th>Fail Reason</th><th>Device</th><th>OS</th><th>Browser</th><th>Date</th></tr></thead>
                <tbody id="monitorLoginAttemptsBody"><tr><td colspan="9" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: ACTIVITY LOGS ============ -->
        <div class="sa-panel" id="panel-activity-logs" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Activity Logs</h4>
            <button class="btn btn-ghost btn-sm" onclick="loadMonitorActivityLogs()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>User</th><th>Action</th><th>Entity</th><th>Details</th><th>IP</th><th>Device</th><th>Date</th></tr></thead>
                <tbody id="monitorActivityLogsBody"><tr><td colspan="8" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: SUSPICIOUS IPS ============ -->
        <div class="sa-panel" id="panel-suspicious-ips" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Suspicious IP Addresses</h4>
            <button class="btn btn-ghost btn-sm" onclick="loadMonitorSuspiciousIps()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>IP Address</th><th>Failed Attempts</th><th>Last Attempt</th><th>Actions</th></tr></thead>
                <tbody id="monitorSuspiciousIpsBody"><tr><td colspan="4" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: BLOCKED IPS ============ -->
        <div class="sa-panel" id="panel-blocked-ips" style="display:none">
          <div class="d-flex justify-between items-center mb-4">
            <h4 class="fw-bold">Blocked IP Addresses</h4>
            <div class="d-flex gap-2">
              <span class="text-sm text-tertiary" id="monitorBlockedIpCount">0 blocked</span>
              <button class="btn btn-ghost btn-sm" onclick="loadMonitorBlockedIps()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>IP Address</th><th>Reason</th><th>Blocked By</th><th>Blocked At</th><th>Actions</th></tr></thead>
                <tbody id="monitorBlockedIpsBody"><tr><td colspan="5" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: VIDEO COURSES ============ -->
        <div class="sa-panel" id="panel-video-courses" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <div class="d-flex align-items-center gap-2">
              <h4 class="fw-bold mb-0">Video Courses</h4>
              <div class="d-flex gap-1 ms-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md);padding:3px">
                <button class="btn btn-xs vc-mode-btn" data-mode="browse" onclick="switchVcMode('browse')" style="border-radius:var(--radius-sm);padding:4px 12px">Browse</button>
                <button class="btn btn-xs vc-mode-btn" data-mode="manage" onclick="switchVcMode('manage')" style="border-radius:var(--radius-sm);padding:4px 12px">Manage</button>
              </div>
            </div>
            <div class="d-flex gap-2">
              <input type="text" class="form-input form-input-sm" id="vcSearchInput" placeholder="Search skills..." oninput="filterVideoCourses()" style="width:220px">
              <button class="btn btn-sm btn-primary" onclick="loadVideoCoursesPanel()"><i class="bi bi-arrow-clockwise"></i></button>
            </div>
          </div>
          <div class="grid-4 mb-4" id="vcStats">
            <div class="stat-card"><div class="stat-card-icon blue"><i class="bi bi-youtube"></i></div><div><div class="stat-card-label">Total Skills</div><div class="stat-card-value" id="vcAmtSkills">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon red"><i class="bi bi-play-circle"></i></div><div><div class="stat-card-label">Total Videos</div><div class="stat-card-value" id="vcAmtVideos">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon green"><i class="bi bi-eye"></i></div><div><div class="stat-card-label">Total Views</div><div class="stat-card-value" id="vcAmtViews">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon yellow"><i class="bi bi-clock-history"></i></div><div><div class="stat-card-label">Watch Time</div><div class="stat-card-value" id="vcAmtWatchTime">-</div></div></div>
          </div>
          <div id="vcBrowseView">
            <div id="vcSkillGrid" class="grid-3 stagger-children"></div>
            <div id="vcVideoList" style="display:none"></div>
            <div id="vcPlayer" style="display:none"></div>
          </div>
          <div id="vcManageView" style="display:none">
            <div class="card">
              <div class="card-header d-flex justify-between items-center">
                <h5 class="card-title mb-0">Skills & Videos</h5>
                <button class="btn btn-success btn-sm" onclick="showAddYtSkillModalUnified()"><i class="bi bi-plus-lg"></i> Add Skill</button>
              </div>
              <div class="table-container">
                <table class="table table-sm">
                  <thead><tr><th>Skill</th><th>Category</th><th>Videos</th><th>Status</th><th>Actions</th></tr></thead>
                  <tbody id="vcManageBody"><tr><td colspan="5" class="text-center text-tertiary py-4">Loading...</td></tr></tbody>
                </table>
              </div>
            </div>
            <div class="card mt-4" id="vcEditCard" style="display:none">
              <div class="card-header d-flex justify-between items-center">
                <h5 class="card-title mb-0" id="vcEditTitle">Edit</h5>
                <button class="btn btn-sm btn-ghost" onclick="document.getElementById('vcEditCard').style.display='none'"><i class="bi bi-x-lg"></i></button>
              </div>
              <div class="p-3" id="vcEditContent"></div>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: USERS ============ -->
        <div class="sa-panel" id="panel-soc-users" style="display:none">
          <div class="d-flex justify-between items-center mb-4 flex-wrap">
            <h4 class="fw-bold">User Management</h4>
            <div class="d-flex gap-2 flex-wrap">
              <div class="search-box" style="width:200px">
                <i class="bi bi-search"></i>
                <input type="text" class="form-control" id="socUserSearch" placeholder="Search users..." oninput="Dashboards._socLoadUsers()">
              </div>
              <select class="form-select" id="socUserRoleFilter" onchange="Dashboards._socLoadUsers()" style="width:auto">
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="soc">SOC</option>
                <option value="super_admin">Super Admin</option>
                <option value="operations_manager">Operations</option>
                <option value="admin_financial">Financial Admin</option>
                <option value="admin_educational">Educational Admin</option>
                <option value="admin_general">General Admin</option>
                <option value="admin_monitor">Monitor Admin</option>
                <option value="admin_sports">Sports Admin</option>
              </select>
              <select class="form-select" id="socUserStatusFilter" onchange="Dashboards._socLoadUsers()" style="width:auto">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <span class="text-sm text-tertiary" id="socUserCount"></span>
              <button class="btn btn-ghost btn-sm" onclick="Dashboards._socLoadUsers()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Last IP</th><th>Devices</th><th>Last Login</th><th>Failed 24h</th><th>Actions</th></tr></thead>
                <tbody id="socUsersBody"><tr><td colspan="11" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
            <div class="d-flex justify-content-between align-items-center p-3" id="socUsersPagination"></div>
          </div>
        </div>

        <!-- ============ PANEL: GALLERY MANAGEMENT ============ -->
        <div class="sa-panel" id="panel-gallery" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <h4 class="fw-bold mb-0"><i class="bi bi-images me-2"></i>Gallery Management</h4>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-primary" onclick="Dashboards._showAddGalleryItem()"><i class="bi bi-plus-lg"></i> Add Item</button>
              <button class="btn btn-sm btn-ghost" onclick="Dashboards._loadGallery()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>Preview</th><th>Title</th><th>Category</th><th>Type</th><th>Status</th><th>Author</th><th>Created</th><th>Actions</th></tr></thead>
                <tbody id="galleryTableBody"><tr><td colspan="9" class="text-center text-tertiary py-4">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: STUDENT CLAIMS ============ -->
        <div class="sa-panel" id="panel-claims" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4">
            <h4 class="fw-bold mb-0"><i class="bi bi-patch-check me-2"></i>Student Claims</h4>
            <button class="btn btn-sm btn-ghost" onclick="Dashboards._loadClaims()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
          </div>
          <div class="card p-0">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>User ID</th><th>Full Name</th><th>Student ID</th><th>Username</th><th>Email</th><th>Registered</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody id="claimsTableBody"><tr><td colspan="8" class="text-center text-tertiary py-4">Loading claims...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    `, 'soc');
  },

  async socLoaded() {
    await loadMonitorOverview();
  },

  loadAlertsList(alerts) {
    const container = document.getElementById('alertsList');
    if (!container) return;
    const severityColors = { critical: 'danger', high: 'warning', medium: 'info', low: 'gray' };
    container.innerHTML = alerts.slice(0, 4).map(a => `
      <div class="p-3 soc-alert-${a.severity}" style="background:var(--bg-tertiary);border-radius:var(--radius-md);cursor:pointer" onclick="UI.showModal('Alert Details', '<p class=\\'text-sm text-secondary mb-3\\'>${a.details}</p><div class=\\'d-flex flex-column gap-2\\'><div class=\\'d-flex justify-between\\'><span class=\\'text-sm text-tertiary\\'>Source</span><span class=\\'text-sm fw-medium text-mono\\'>${a.source}</span></div><div class=\\'d-flex justify-between\\'><span class=\\'text-sm text-tertiary\\'>Target</span><span class=\\'text-sm\\'>${a.target}</span></div><div class=\\'d-flex justify-between\\'><span class=\\'text-sm text-tertiary\\'>Time</span><span class=\\'text-sm\\'>${a.time}</span></div><div class=\\'d-flex justify-between\\'><span class=\\'text-sm text-tertiary\\'>Status</span><span class=\\'text-sm\\'>${a.status}</span></div></div>')">
        <div class="d-flex justify-between items-center">
          <span class="text-sm fw-medium d-flex align-items-center gap-2">
            <span class="status-indicator ${a.severity === 'critical' ? 'status-busy' : a.severity === 'high' ? 'status-away' : 'status-online'}"></span>
            ${a.title}
          </span>
          ${UI.badge(a.severity.toUpperCase(), severityColors[a.severity])}
        </div>
        <div class="text-xs text-tertiary mt-1">${a.source} &bull; ${UI.formatDate(a.time)}</div>
      </div>
    `).join('');
  },

  loadLoginLogs(logs) {
    const container = document.getElementById('loginLogFeed');
    if (!container) return;
    container.innerHTML = logs.slice(0, 8).map(l => `
      <div class="log-entry">
        <span class="log-timestamp">${new Date(l.time).toLocaleTimeString()}</span>
        <span class="log-level ${l.status === 'success' ? 'SUCCESS' : 'ERROR'}">${l.status === 'success' ? 'OK' : 'FAIL'}</span>
        <span class="log-message">${l.user} <span class="text-tertiary">from</span> ${l.ip} <span class="text-tertiary">(${l.location})</span></span>
      </div>
    `).join('');
  },

  loadTimeline(timeline) {
    const container = document.getElementById('securityTimeline');
    if (!container) return;
    container.innerHTML = timeline.map(t => `
      <div class="timeline-item">
        <div class="timeline-dot ${t.severity === 'critical' ? 'red' : t.severity === 'high' ? 'yellow' : 'green'}"></div>
        <div class="timeline-content">
          <div class="timeline-title">${t.event}</div>
          <div class="timeline-time">${t.time} &bull; ${t.action}</div>
        </div>
      </div>
    `).join('');
  },

  loadSuspiciousTable(activities) {
    const container = document.getElementById('suspiciousBody');
    if (!container) return;
    container.innerHTML = activities.map(a => `
      <tr>
        <td class="fw-medium">${a.type}</td>
        <td class="text-mono">${a.source}</td>
        <td class="text-tertiary">${UI.formatDate(a.time)}</td>
        <td>${UI.badge(a.risk.charAt(0).toUpperCase() + a.risk.slice(1), a.risk === 'critical' ? 'danger' : a.risk === 'high' ? 'warning' : a.risk === 'medium' ? 'info' : 'gray')}</td>
        <td class="text-tertiary">${a.details}</td>
      </tr>
    `).join('');
  },

    // ===== SOC SUB-PAGES (Alerts, Logs, IP Tracking, Reports, Timeline) =====

  socAlerts() {
    return this.renderShell('SOC Alerts', `
      <div class="d-flex align-items-center gap-3 mb-4">
        <span class="badge badge-danger" id="alertsCriticalBadge"><span class="status-indicator status-busy me-1"></span> -</span>
        <span class="badge badge-warning" id="alertsHighBadge"><span class="status-indicator status-away me-1"></span> -</span>
        <span class="badge badge-info" id="alertsMediumBadge">-</span>
        <button class="btn btn-sm btn-primary ms-auto" onclick="router.navigate('/dashboard')"><i class="bi bi-arrow-left"></i> Back to Overview</button>
      </div>
      <div class="card">
        <div class="card-header"><h5 class="card-title">All Alerts</h5></div>
        <div class="d-flex flex-column gap-2 p-3" id="alertsFullList">
          ${UI.skeleton('table', 5)}
        </div>
      </div>
    `, 'soc');
  },

  async socAlertsLoaded() {
    try {
      const soc = await API.getSOCData();
      const alerts = soc.alerts || [];
      const container = document.getElementById('alertsFullList');
      if (!container) return;

      // Update badge counts
      const critical = alerts.filter(a => a.severity === 'critical').length;
      const high = alerts.filter(a => a.severity === 'high').length;
      const medium = alerts.filter(a => a.severity === 'medium').length;
      const cEl = document.getElementById('alertsCriticalBadge');
      const hEl = document.getElementById('alertsHighBadge');
      const mEl = document.getElementById('alertsMediumBadge');
      if (cEl) cEl.innerHTML = `<span class="status-indicator status-busy me-1"></span> ${critical} Critical`;
      if (hEl) hEl.innerHTML = `<span class="status-indicator status-away me-1"></span> ${high} High`;
      if (mEl) mEl.textContent = `${medium} Medium`;

      if (!alerts.length) {
        container.innerHTML = '<div class="text-center text-tertiary py-4">No alerts</div>';
        return;
      }

      const colors = { critical: 'danger', high: 'warning', medium: 'info', low: 'gray' };
      const indicators = { critical: 'status-busy', high: 'status-away', medium: 'status-online', low: 'status-online' };
      container.innerHTML = alerts.map(a => `
        <div class="p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md);border-left:3px solid var(--${a.severity === 'critical' ? 'danger' : a.severity === 'high' ? 'warning' : 'info'})">
          <div class="d-flex justify-between items-center">
            <span class="text-sm fw-medium d-flex align-items-center gap-2"><span class="status-indicator ${indicators[a.severity] || 'status-online'}"></span>${a.title}</span>
            ${UI.badge(a.severity.toUpperCase(), colors[a.severity] || 'info')}
          </div>
          <div class="text-xs text-tertiary mt-1">${a.details} &bull; ${a.source} &bull; ${UI.formatDate(a.time)}</div>
        </div>
      `).join('');
    } catch(e) { console.error(e); }
  },

  socLogs() {
    return this.renderShell('SOC Login Logs', `
      <div class="d-flex align-items-center gap-3 mb-4">
        <span class="text-sm text-tertiary">Login Attempts</span>
        <div class="d-flex gap-2 ms-3">
          <select class="form-select form-select-sm" id="logsFilter" style="width:auto" onchange="Dashboards._socLogsFilterChange()">
            <option value="all">All</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
          </select>
        </div>
        <button class="btn btn-sm btn-primary ms-auto" onclick="router.navigate('/dashboard')"><i class="bi bi-arrow-left"></i> Back to Overview</button>
      </div>
      <div class="card">
        <div class="card-header"><h5 class="card-title">Login Attempts</h5></div>
        <div class="log-feed" id="loginLogFullFeed">
          ${UI.skeleton('table', 6)}
        </div>
      </div>
    `, 'soc');
  },

  async socLogsLoaded() {
    try {
      await Dashboards._socRefreshLogs();
    } catch(e) { console.error(e); }
  },

  _socLogsFilter: 'all',

  _socLogsFilterChange() {
    const el = document.getElementById('logsFilter');
    Dashboards._socLogsFilter = el?.value || 'all';
    Dashboards._socRefreshLogs();
  },

  async _socRefreshLogs() {
    try {
      const filter = Dashboards._socLogsFilter;
      const params = { per_page: 50 };
      if (filter === 'success') params.success = 1;
      if (filter === 'failed') params.success = 0;

      const data = await API.getLoginAttempts(params);
      const attempts = data.attempts || [];
      const container = document.getElementById('loginLogFullFeed');
      if (!container) return;

      if (!attempts.length) {
        container.innerHTML = '<div class="text-center text-tertiary py-4">No login logs available</div>';
        return;
      }

      container.innerHTML = attempts.map(a => {
        const status = a.success ? 'success' : 'error';
        return `<div class="log-entry">
          <span class="log-timestamp">${new Date(a.created_at).toLocaleTimeString()}</span>
          <span class="log-level ${status === 'success' ? 'SUCCESS' : 'ERROR'}">${status === 'success' ? 'OK' : 'FAIL'}</span>
          <span class="log-message">${a.username || a.email || 'Unknown'} <span class="text-tertiary">from</span> ${a.ip_address}${a.location ? ` <span class="text-tertiary">(${a.location})</span>` : ''}</span>
        </div>`;
      }).join('');
    } catch(e) { console.error(e); }
  },

  _socOpenBlockIpModal() {
    const html =
      '<input class="form-control" id="blockIpInput" placeholder="Enter IP address">' +
      '<div class="mt-3">' +
      '<button class="btn btn-primary w-100" onclick="' +
      "API.blockIP(document.getElementById('blockIpInput').value,'Manually blocked by SOC')" +
      ".then(function(){UI.showToast('Blocked','IP blocked','success');UI.closeModal();Dashboards._socRefreshIps()})" +
      '">Block IP</button></div>';
    UI.showModal('Block IP', html);
  },

  socIPTracking() {
    return this.renderShell('SOC IP Tracking', `
      <div class="d-flex align-items-center gap-3 mb-4 flex-wrap">
        <span class="badge badge-info" id="suspiciousIpCount">Loading...</span>
        <div class="d-flex gap-2">
          <input type="number" class="form-control form-control-sm" id="ipThreshold" value="5" min="1" style="width:80px" placeholder="Threshold">
          <button class="btn btn-sm btn-ghost" onclick="Dashboards._socRefreshIps()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
        </div>
        <button class="btn btn-sm btn-primary ms-auto" onclick="router.navigate('/dashboard')"><i class="bi bi-arrow-left"></i> Back to Overview</button>
      </div>
      <div class="card">
        <div class="card-header"><h5 class="card-title">Suspicious IP Addresses</h5>
          <button class="btn btn-sm btn-ghost" onclick="Dashboards._socOpenBlockIpModal()"><i class="bi bi-plus-circle"></i> Manual Block</button>
        </div>
        <div class="table-container">
          <table class="table table-sm">
            <thead><tr><th>IP Address</th><th>Attempts</th><th>Last Attempt</th><th>Blocked?</th><th>Action</th></tr></thead>
            <tbody id="suspiciousIpsBody">
              <tr><td colspan="5" class="text-center text-tertiary py-4">${UI.skeleton('table', 4)}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    `, 'soc');
  },

  async socIPTrackingLoaded() {
    await Dashboards._socRefreshIps();
  },

  _socDemoIps() {
    return [
      { ip_address: '185.234.56.78', attempts: 23, last_attempt: new Date(Date.now() - 60000).toISOString() },
      { ip_address: '45.67.89.123', attempts: 12, last_attempt: new Date(Date.now() - 300000).toISOString() },
      { ip_address: '103.45.12.67', attempts: 8, last_attempt: new Date(Date.now() - 900000).toISOString() },
      { ip_address: '78.90.12.34', attempts: 6, last_attempt: new Date(Date.now() - 1800000).toISOString() },
      { ip_address: '201.54.78.90', attempts: 5, last_attempt: new Date(Date.now() - 3600000).toISOString() },
    ];
  },

  async _socRefreshIps() {
    try {
      const threshold = parseInt(document.getElementById('ipThreshold')?.value || '5');
      let data;
      try {
        data = await API.getSuspiciousIPs(threshold, 30);
      } catch(e) {
        data = { suspicious_ips: [] };
      }
      let ips = data.suspicious_ips || [];

      // Fallback to demo data if DB is empty
      if (!ips.length) {
        ips = Dashboards._socDemoIps();
      }

      const countEl = document.getElementById('suspiciousIpCount');
      if (countEl) countEl.textContent = ips.length + ' Suspicious IPs';

      const body = document.getElementById('suspiciousIpsBody');
      if (!body) return;

      // Also get blocked IPs
      let blockedIps = [];
      try {
        const blockedData = await API.getBlockedIPs({ per_page: 500 });
        blockedIps = (blockedData.blocked_ips || []).map(b => b.ip_address);
      } catch(e) {}

      body.innerHTML = ips.map(ip => {
        const isBlocked = blockedIps.includes(ip.ip_address);
        return `<tr>
          <td class="text-mono fw-medium">${ip.ip_address}</td>
          <td class="text-center"><span class="badge ${ip.attempts > 10 ? 'badge-danger' : ip.attempts > 5 ? 'badge-warning' : 'badge-info'}">${ip.attempts}</span></td>
          <td class="text-tertiary">${UI.formatDate(ip.last_attempt)}</td>
          <td>${isBlocked ? UI.badge('Blocked', 'danger') : UI.badge('Not Blocked', 'gray')}</td>
          <td>${isBlocked
            ? `<button class="btn btn-sm btn-success" onclick="API.unblockIP('${ip.ip_address}').then(()=>{UI.showToast('Unblocked','IP unblocked','success');Dashboards._socRefreshIps()})"><i class="bi bi-unlock"></i> Unblock</button>`
            : `<button class="btn btn-sm btn-danger" onclick="API.blockIP('${ip.ip_address}','Suspicious activity - ${ip.attempts} attempts').then(()=>{UI.showToast('Blocked','IP blocked','success');Dashboards._socRefreshIps()})"><i class="bi bi-lock"></i> Block</button>`
          }</td>
        </tr>`;
      }).join('');
    } catch(e) { console.error(e); }
  },

  socReports() {
    return this.renderShell('SOC Reports', `
      <div class="d-flex align-items-center gap-3 mb-4">
        <button class="btn btn-sm btn-primary ms-auto" onclick="router.navigate('/dashboard')"><i class="bi bi-arrow-left"></i> Back to Overview</button>
      </div>
      <div class="grid-2 mb-6">
        <div class="card">
          <div class="card-header"><h5 class="card-title">Security Summary</h5></div>
          <div class="p-3">
            <div class="d-flex flex-column gap-3">
              <div class="d-flex justify-between items-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)">
                <span class="text-sm">Total Login Attempts (24h)</span>
                <span class="text-sm fw-semibold" id="reportTotalLogins">-</span>
              </div>
              <div class="d-flex justify-between items-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)">
                <span class="text-sm">Failed Attempts</span>
                <span class="text-sm fw-semibold text-danger" id="reportFailedLogins">-</span>
              </div>
              <div class="d-flex justify-between items-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)">
                <span class="text-sm">Blocked IPs</span>
                <span class="text-sm fw-semibold text-warning" id="reportBlockedIps">-</span>
              </div>
              <div class="d-flex justify-between items-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)">
                <span class="text-sm">Active Alerts</span>
                <span class="text-sm fw-semibold" id="reportActiveAlerts">-</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h5 class="card-title">Quick Actions</h5></div>
          <div class="p-3 d-flex flex-column gap-3">
            <button class="btn btn-outline btn-sm" onclick="router.navigate('/alerts')"><i class="bi bi-shield-exclamation"></i> View Active Alerts</button>
            <button class="btn btn-outline btn-sm" onclick="router.navigate('/logs')"><i class="bi bi-list-ul"></i> View Login Logs</button>
            <button class="btn btn-outline btn-sm" onclick="router.navigate('/iptracking')"><i class="bi bi-globe"></i> View IP Tracking</button>
            <button class="btn btn-outline btn-sm" onclick="router.navigate('/soc-users')"><i class="bi bi-people"></i> View Users</button>
          </div>
        </div>
      </div>
    `, 'soc');
  },

  async socReportsLoaded() {
    try {
      const data = await API.getSOCData();
      const el = (id) => document.getElementById(id);
      if (el('reportTotalLogins')) el('reportTotalLogins').textContent = data.loginLogs?.length || 0;
      if (el('reportFailedLogins')) el('reportFailedLogins').textContent = data.loginLogs?.filter(l => l.status === 'error').length || 0;
      if (el('reportBlockedIps')) el('reportBlockedIps').textContent = data.ipsBlocked || 0;
      if (el('reportActiveAlerts')) el('reportActiveAlerts').textContent = data.activeAlerts || 0;
    } catch(e) {}
  },

  socTimeline() {
    return this.renderShell('SOC Timeline', `
      <div class="d-flex align-items-center gap-3 mb-4">
        <span class="text-sm text-tertiary">Security Events Timeline</span>
        <button class="btn btn-sm btn-primary ms-auto" onclick="router.navigate('/dashboard')"><i class="bi bi-arrow-left"></i> Back to Overview</button>
      </div>
      <div class="card">
        <div class="card-header"><h5 class="card-title">Event Timeline</h5></div>
        <div class="timeline p-3" id="timelineFullList">
          ${UI.skeleton('table', 6)}
        </div>
      </div>
    `, 'soc');
  },

  async socTimelineLoaded() {
    try {
      const data = await API.getActivityLogs({ per_page: 30 });
      const logs = data.logs || [];
      const container = document.getElementById('timelineFullList');
      if (!container) return;

      if (!logs.length) {
        container.innerHTML = '<div class="text-center text-tertiary py-4">No timeline events</div>';
        return;
      }

      container.innerHTML = logs.map(l => {
        const severity = l.action?.includes('block') || l.action?.includes('delete') || l.action?.includes('suspend') ? 'critical' : l.action?.includes('fail') || l.action?.includes('error') ? 'high' : 'green';
        return `<div class="timeline-item">
          <div class="timeline-dot ${severity}"></div>
          <div class="timeline-content">
            <div class="timeline-title">${l.action?.replace(/_/g, ' ') || 'Event'}</div>
            <div class="timeline-time">${UI.formatDate(l.created_at)} &bull; ${l.username || ''} ${l.details ? '&bull; ' + (typeof l.details === 'object' ? JSON.stringify(l.details) : l.details) : ''}</div>
          </div>
        </div>`;
      }).join('');
    } catch(e) { console.error(e); }
  },

  // ===== SOC USERS PAGE =====
  socUsers() {
    return this.renderShell('SOC User Management', `
      <div class="d-flex align-items-center gap-3 mb-4 flex-wrap">
        <div class="search-box" style="width:320px">
          <i class="bi bi-search"></i>
          <input type="text" class="form-control" id="socUserSearch2" placeholder="Search users..." oninput="Dashboards._socLoadUsers()">
        </div>
        <select class="form-select" id="socUserRoleFilter2" onchange="Dashboards._socLoadUsers()" style="width:auto">
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="soc">SOC</option>
          <option value="super_admin">Super Admin</option>
          <option value="operations_manager">Operations</option>
          <option value="admin_financial">Financial Admin</option>
          <option value="admin_educational">Educational Admin</option>
          <option value="admin_general">General Admin</option>
          <option value="admin_monitor">Monitor Admin</option>
          <option value="admin_sports">Sports Admin</option>
        </select>
        <select class="form-select" id="socUserStatusFilter2" onchange="Dashboards._socLoadUsers()" style="width:auto">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        <span class="text-sm text-tertiary" id="socUserCount2"></span>
        <button class="btn btn-sm btn-primary ms-auto" onclick="router.navigate('/dashboard')"><i class="bi bi-arrow-left"></i> Back</button>
      </div>
      <div class="card">
        <div class="table-container">
          <table class="table table-sm" id="socUsersTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last IP</th>
                <th>Devices</th>
                <th>Last Login</th>
                <th>Failed (24h)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="socUsersBody2">
              <tr><td colspan="11" class="text-center text-tertiary py-4"><div class="spinner-border spinner-border-sm me-2"></div>Loading users...</td></tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-between align-items-center p-3" id="socUsersPagination2"></div>
      </div>
    `, 'soc');
  },

  _socUsersPage: 1,
  _socUsersData: [],

  async _socLoadUsers() {
    try {
      const search = document.getElementById('socUserSearch')?.value || document.getElementById('socUserSearch2')?.value || '';
      const role = document.getElementById('socUserRoleFilter')?.value || document.getElementById('socUserRoleFilter2')?.value || '';
      const status = document.getElementById('socUserStatusFilter')?.value || document.getElementById('socUserStatusFilter2')?.value || '';
      const page = Dashboards._socUsersPage || 1;

      const data = await API.socGetUsers({ page, per_page: 50, search, role, status });
      Dashboards._socUsersData = data.users || [];
      const tbody = document.getElementById('socUsersBody') || document.getElementById('socUsersBody2');
      const count = document.getElementById('socUserCount') || document.getElementById('socUserCount2');

      if (count) count.textContent = data.total + ' users';

      if (!tbody) return;

      if (!Dashboards._socUsersData.length) {
        tbody.innerHTML = '<tr><td colspan="11" class="text-center text-tertiary py-4">No users found</td></tr>';
        return;
      }

      tbody.innerHTML = Dashboards._socUsersData.map(u => {
        const isSuspended = u.status === 'suspended';
        const ipBlocked = u.ip_blocked ? '<span class="badge badge-danger ms-1">BLOCKED</span>' : '';
        const failedBadge = (u.failed_attempts_24h || 0) > 5
          ? `<span class="badge badge-danger">${u.failed_attempts_24h}</span>`
          : (u.failed_attempts_24h || 0) > 0
            ? `<span class="badge badge-warning">${u.failed_attempts_24h}</span>`
            : `<span class="text-tertiary">${u.failed_attempts_24h || 0}</span>`;

        const isNewIp = (u.new_ips || []).includes(u.last_login_ip);
        const ipBadge = isNewIp
          ? '<span class="badge badge-warning" title="New IP (first seen in last 7 days)"><i class="bi bi-exclamation-triangle"></i> NEW</span> ' + UI.escape(u.last_login_ip || '-')
          : '<span class="text-mono text-xs">' + UI.escape(u.last_login_ip || '-') + '</span>';
        const ipDisplay = ipBadge + (ipBlocked ? ' ' + ipBlocked : '');

        const deviceTypes = (u.device_summary || []).map(d => d.device_type);
        const hasMultiDevice = deviceTypes.length > 1;
        const deviceBadges = (u.devices || []).slice(0, 3).map(d => {
          const icon = d.device_type === 'mobile' ? 'bi-phone' : d.device_type === 'tablet' ? 'bi-tablet' : d.device_type === 'desktop' ? 'bi-laptop' : 'bi-question-circle';
          const color = d.device_type === 'mobile' ? 'info' : d.device_type === 'desktop' ? 'primary' : 'gray';
          return '<span class="badge badge-' + color + '" title="' + UI.escape(d.os || '') + ' ' + UI.escape(d.browser || '') + ' — ' + UI.escape(d.ip_address || '') + '"><i class="bi ' + icon + '"></i> ' + UI.escape((d.os || '').split(' ')[0]) + '</span>';
        }).join(' ');
        const multiBadge = hasMultiDevice ? ' <span class="badge badge-warning" title="Multiple device types detected"><i class="bi bi-layers"></i> Multi</span>' : '';
        const deviceDisplay = deviceBadges ? deviceBadges + multiBadge : '<span class="text-tertiary text-xs">No data</span>';

        return `<tr>
          <td>${u.id}</td>
          <td class="fw-medium">${u.full_name || u.username}</td>
          <td class="text-mono">${u.username}</td>
          <td>${u.email}</td>
          <td>${UI.badge(u.role_slug?.replace(/_/g, ' '), 'info')}</td>
          <td>${isSuspended ? UI.badge('Suspended', 'danger') : UI.badge('Active', 'success')}</td>
          <td>${ipDisplay}</td>
          <td>${deviceDisplay}</td>
          <td class="text-tertiary">${u.last_login_at ? UI.formatDate(u.last_login_at) : '-'}</td>
          <td class="text-center">${failedBadge}</td>
          <td>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-ghost" title="View Activity" onclick="Dashboards._socViewUser(${u.id})"><i class="bi bi-eye"></i></button>
              <button class="btn btn-sm btn-ghost" title="View IPs" onclick="Dashboards._socViewUserIps(${u.id})"><i class="bi bi-globe"></i></button>
              <button class="btn btn-sm btn-ghost" title="Edit User" onclick="Dashboards._socEditUser(${u.id})"><i class="bi bi-pencil"></i></button>
              ${isSuspended
                ? `<button class="btn btn-sm btn-success" title="Restore" onclick="Dashboards._socRestoreUser(${u.id})"><i class="bi bi-check-circle"></i></button>`
                : `<button class="btn btn-sm btn-danger" title="Suspend" onclick="Dashboards._socSuspendUser(${u.id})"><i class="bi bi-pause-circle"></i></button>`
              }
              ${u.role_slug !== 'super_admin' && u.role_slug !== 'soc_team' ? `<button class="btn btn-sm btn-outline-danger" title="Delete" onclick="Dashboards._socDeleteUser(${u.id})"><i class="bi bi-trash"></i></button>` : ''}
            </div>
          </td>
        </tr>`;
      }).join('');
    } catch(e) { console.error(e); }
  },

  async _socViewUser(userId) {
    window._socViewUserId = userId;
    router.navigate('/soc-user-detail');
  },

  async _socViewUserIps(userId) {
    try {
      const data = await API.socGetUserIps(userId);
      const user = data.user || {};
      const ips = data.ips || [];
      let html = `<div class="d-flex justify-content-between align-items-center mb-3"><h6 class="fw-semibold">${user.full_name || user.username} — IP &amp; Device History</h6><span class="text-xs text-tertiary">${ips.length} IPs</span></div>`;
      if (!ips.length) {
        html += '<p class="text-tertiary">No IP data available.</p>';
      } else {
        html += '<div class="table-container"><table class="table table-sm"><thead><tr><th>IP Address</th><th>OS</th><th>Browser</th><th>Device</th><th>Success</th><th>Failed</th><th>Last Seen</th><th>Action</th></tr></thead><tbody>';
        ips.forEach(ip => {
          const devIcon = ip.device_type === 'mobile' ? 'bi-phone' : ip.device_type === 'tablet' ? 'bi-tablet' : ip.device_type === 'desktop' ? 'bi-laptop' : 'bi-question-circle';
          const devColor = ip.device_type === 'mobile' ? 'info' : ip.device_type === 'desktop' ? 'primary' : 'gray';
          html += `<tr>
            <td class="text-mono">${UI.escape(ip.ip_address || '-')}</td>
            <td class="text-sm">${UI.escape(ip.os || '-')}</td>
            <td class="text-sm">${UI.escape(ip.browser || '-')}</td>
            <td><span class="badge badge-${devColor}"><i class="bi ${devIcon}"></i> ${ip.device_type || '-'}</span></td>
            <td class="text-success">${ip.successful || 0}</td>
            <td class="text-danger">${ip.failed || 0}</td>
            <td class="text-tertiary">${UI.formatDate(ip.last_seen)}</td>
            <td>${ip.is_blocked
              ? `<button class="btn btn-sm btn-success" onclick="API.unblockIP('${ip.ip_address}').then(()=>UI.showToast('Unblocked','IP unblocked','success'))"><i class="bi bi-unlock"></i> Unblock</button>`
              : `<button class="btn btn-sm btn-danger" onclick="API.blockIP('${ip.ip_address}','Blocked by SOC').then(()=>UI.showToast('Blocked','IP blocked','success'))"><i class="bi bi-lock"></i> Block</button>`
            }</td>
          </tr>`;
        });
        html += '</tbody></table></div>';
      }
      UI.showModal('IP Addresses', html);
    } catch(e) { UI.showToast('Error', 'Failed to load IPs', 'error'); }
  },

  async _socEditUser(userId) {
    const u = Dashboards._socUsersData.find(x => x.id === userId);
    if (!u) return;
    UI.showModal('Edit User', `
      <div class="d-flex flex-column gap-3">
        <div>
          <label class="text-sm fw-medium mb-1">Full Name</label>
          <input type="text" class="form-control" id="socEditName" value="${(u.full_name || '')}">
        </div>
        <div>
          <label class="text-sm fw-medium mb-1">Email</label>
          <input type="email" class="form-control" id="socEditEmail" value="${u.email}">
        </div>
        <div>
          <label class="text-sm fw-medium mb-1">Status</label>
          <select class="form-select" id="socEditStatus">
            <option value="active" ${u.status === 'active' ? 'selected' : ''}>Active</option>
            <option value="suspended" ${u.status === 'suspended' ? 'selected' : ''}>Suspended</option>
          </select>
        </div>
      </div>
    `, `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="Dashboards._socSaveUser(${userId})">Save Changes</button>
    `);
  },

  async _socSaveUser(userId) {
    const name = document.getElementById('socEditName')?.value;
    const email = document.getElementById('socEditEmail')?.value;
    const status = document.getElementById('socEditStatus')?.value;
    try {
      await API.socUpdateUser(userId, { full_name: name, email, status });
      UI.showToast('Success', 'User updated', 'success');
      UI.closeModal();
      Dashboards._socLoadUsers();
    } catch(e) { UI.showToast('Error', e.message, 'error'); }
  },

  async _socSuspendUser(userId) {
    if (!confirm('Suspend this user?')) return;
    try {
      await API.socSuspendUser(userId);
      UI.showToast('Suspended', 'User has been suspended', 'warning');
      Dashboards._socLoadUsers();
    } catch(e) { UI.showToast('Error', e.message, 'error'); }
  },

  async _socRestoreUser(userId) {
    if (!confirm('Restore this user?')) return;
    try {
      await API.socRestoreUser(userId);
      UI.showToast('Restored', 'User has been restored', 'success');
      Dashboards._socLoadUsers();
    } catch(e) { UI.showToast('Error', e.message, 'error'); }
  },

  async _socDeleteUser(userId) {
    if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) return;
    try {
      await API.socDeleteUser(userId);
      UI.showToast('Deleted', 'User has been deleted', 'warning');
      Dashboards._socLoadUsers();
    } catch(e) { UI.showToast('Error', e.message, 'error'); }
  },

  // ===== SOC USER DETAIL PAGE =====
  socUserDetail() {
    return this.renderShell('User Activity', `
      <div class="d-flex align-items-center gap-3 mb-4">
        <button class="btn btn-sm btn-primary" onclick="router.navigate('/soc-users')"><i class="bi bi-arrow-left"></i> Back to Users</button>
        <span class="text-sm text-tertiary">Activity log for user <strong id="socDetailUserName">#${window._socViewUserId || ''}</strong></span>
        <div class="ms-auto d-flex gap-2">
          <button class="btn btn-sm btn-ghost" onclick="Dashboards._socViewUserIps(window._socViewUserId)"><i class="bi bi-globe"></i> View IPs</button>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h5 class="card-title">Activity Log</h5></div>
        <div class="table-container">
          <table class="table table-sm">
            <thead><tr><th>Time</th><th>Action</th><th>Entity</th><th>Details</th><th>IP Address</th></tr></thead>
            <tbody id="socDetailBody">
              <tr><td colspan="5" class="text-center text-tertiary py-4"><div class="spinner-border spinner-border-sm me-2"></div>Loading...</td></tr>
            </tbody>
          </table>
        </div>
        <div class="d-flex justify-content-between align-items-center p-3" id="socDetailPagination"></div>
      </div>
    `, 'soc');
  },

  _socDetailPage: 1,

  async _socLoadDetail() {
    const userId = window._socViewUserId;
    if (!userId) {
      document.getElementById('socDetailBody').innerHTML = '<tr><td colspan="5" class="text-center text-tertiary py-4">No user selected</td></tr>';
      return;
    }
    try {
      const page = Dashboards._socDetailPage || 1;
      const data = await API.socGetUserActivity(userId, { page, per_page: 50 });
      const tbody = document.getElementById('socDetailBody');
      const nameEl = document.getElementById('socDetailUserName');
      if (nameEl && data.user) nameEl.textContent = data.user.full_name || data.user.username;

      if (!tbody) return;

      const logs = data.logs || [];
      if (!logs.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-tertiary py-4">No activity found</td></tr>';
        return;
      }

      tbody.innerHTML = logs.map(l => `
        <tr>
          <td class="text-tertiary">${UI.formatDate(l.created_at)}</td>
          <td class="fw-medium">${l.action?.replace(/_/g, ' ') || '-'}</td>
          <td>${l.entity_type || '-'}${l.entity_id ? ' #' + l.entity_id : ''}</td>
          <td class="text-tertiary">${typeof l.details === 'object' ? JSON.stringify(l.details) : (l.details || '-')}</td>
          <td class="text-mono">${l.ip_address || '-'}</td>
        </tr>
      `).join('');
    } catch(e) { console.error(e); }
  },

  // ===== OPERATIONS MANAGER DASHBOARD =====
  operations_manager() {
    const user = DB.currentUser;
    return this.renderShell('Operations Dashboard', `
      <div id="sa-panel-container">

        <!-- ============ PANEL: OVERVIEW ============ -->
        <div class="sa-panel" id="panel-overview">
          <div class="card mb-6">
            <div class="d-flex align-items-center gap-4 p-4">
              <div style="position:relative;flex-shrink:0">
                <div id="overviewAvatar">${user?.avatar ? `<img src="${user.avatar}" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:50%">` : `<div class="avatar avatar-lg" style="background:${UI.getAvatarColor(user?.name||'U')};width:64px;height:64px;font-size:1.2rem">${UI.getInitials(user?.name||'U')}</div>`}</div>
                <label for="overviewAvatarInput" style="position:absolute;bottom:0;right:0;width:24px;height:24px;background:var(--accent);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:2px solid var(--bg-card)">
                  <i class="bi bi-camera" style="font-size:12px;color:#fff"></i>
                  <input type="file" id="overviewAvatarInput" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none">
                </label>
              </div>
              <div>
                <h5 class="mb-1">${user?.name || 'User'}</h5>
                <p class="text-sm text-tertiary mb-1">${Dashboards.roleConfig[user?.role]?.label || user?.role || ''} &bull; ${user?.email || ''}</p>
              </div>
            </div>
          </div>
          <div class="grid-4 mb-6 stagger-children" id="statCards">
            ${UI.skeleton('stat', 4)}
          </div>
          <div class="grid-2 mb-6">
            <div class="card"><div class="card-header"><h5 class="card-title">System Performance</h5></div><div class="chart-container"><canvas id="opsChart"></canvas></div></div>
            <div class="card"><div class="card-header"><h5 class="card-title">Active Services</h5></div><div class="d-flex flex-column gap-2"><div class="d-flex justify-between items-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><span class="text-sm d-flex align-items-center gap-2"><span class="status-indicator status-online"></span>Web Portal</span><span class="text-xs text-tertiary">99.99% uptime</span></div><div class="d-flex justify-between items-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><span class="text-sm d-flex align-items-center gap-2"><span class="status-indicator status-online"></span>API Services</span><span class="text-xs text-tertiary">99.95% uptime</span></div><div class="d-flex justify-between items-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><span class="text-sm d-flex align-items-center gap-2"><span class="status-indicator status-away"></span>Email Service</span><span class="text-xs text-tertiary">98.5% uptime</span></div><div class="d-flex justify-between items-center p-3" style="background:var(--bg-tertiary);border-radius:var(--radius-md)"><span class="text-sm d-flex align-items-center gap-2"><span class="status-indicator status-online"></span>Database</span><span class="text-xs text-tertiary">99.97% uptime</span></div></div></div>
          </div>
          <div class="grid-3">
            <div class="card"><div class="card-header"><h5 class="card-title">Task Queue</h5><span class="badge badge-warning">8 Pending</span></div></div>
            <div class="card"><div class="card-header"><h5 class="card-title">Team Performance</h5></div></div>
            <div class="card"><div class="card-header"><h5 class="card-title">Reports</h5></div></div>
          </div>
        </div>

        <!-- ============ PANEL: USERS ============ -->
        <div class="sa-panel" id="panel-ops-users" style="display:none">
          <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
            <h4 class="fw-bold">User Management</h4>
            <div class="d-flex gap-2">
              <div class="search-box" style="width:280px">
                <i class="bi bi-search"></i>
                <input type="text" class="form-control" id="opsUserSearch" placeholder="Search users..." oninput="loadOpsUsers()">
              </div>
              <button class="btn btn-primary btn-sm" onclick="loadOpsUsers()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
            </div>
          </div>
          <div class="card">
            <div class="table-container">
              <table class="table table-sm">
                <thead><tr><th>ID</th><th>Username</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
                <tbody id="opsUsersBody"><tr><td colspan="8" class="text-center text-tertiary">Loading...</td></tr></tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: APPROVALS ============ -->
        <div class="sa-panel" id="panel-approvals" style="display:none">
          <div id="memberDirectoryRoot">
            <div class="d-flex justify-between align-items-center mb-4">
              <div class="text-sm text-tertiary">Loading member directory…</div>
            </div>
          </div>
        </div>

        <!-- ============ PANEL: LESSONS ============ -->
        <div class="sa-panel" id="panel-lessons" style="display:none">
          <div id="lessonsFileManager"><div class="text-center text-tertiary p-4">Loading...</div></div>
        </div>

      </div>
    `, 'operations_manager');
  },

  async opsManagerLoaded() {
    this._loadStats('operations_manager');
  },

  async _loadStats(role) {
    try {
      const stats = await API.getDashboardStats(role);
      const container = document.getElementById('statCards');
      if (!container) return;
      const entries = Object.entries(stats).filter(([k]) => k !== 'registrations_30d').slice(0, 4);
      container.innerHTML = entries.map(([k, v], i) => {
        const icons = ['bi-speedometer2', 'bi-activity', 'bi-graph-up', 'bi-bar-chart', 'bi-people', 'bi-clock', 'bi-check-circle', 'bi-exclamation-triangle'];
        const colors = ['blue', 'green', 'purple', 'yellow', 'red', 'info', 'orange', 'pink'];
        const val = typeof v === 'object' && v !== null ? (v.total ?? v.total_posts ?? v.logins_24h ?? v.open ?? v.active ?? Object.values(v)[0] ?? 0) : v;
        return UI.statCard(icons[i % icons.length], val, k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()), null, colors[i % colors.length]);
      }).join('');
      UI.initCounters(container);
    } catch(e) { console.error(e); }
  },

  // Generic dashboard fallback - route to specific role
  generic() {
    const role = DB.currentUser?.role || 'student';
    if (this[role]) return this[role]();
    return this.student();
  },

  async genericLoaded() {
    const role = DB.currentUser?.role || 'student';
    const loaders = {
      student: 'studentLoaded',
      teacher: 'teacherLoaded',
      financial_admin: 'financialAdminLoaded',
      educational_admin: 'eduAdminLoaded',
      general_admin: 'generalAdminLoaded',
      monitor_admin: 'monitorAdminLoaded',
      sports_admin: 'sportsAdminLoaded',
      super_admin: 'superAdminLoaded',
      soc: 'socLoaded',
      operations_manager: 'opsManagerLoaded',
    };
    // For dashboards without specific loaders, just load stats
    const fn = loaders[role];
    if (fn && this[fn]) {
      this[fn]();
    } else {
      // generic stat loading
      try {
        const stats = await API.getDashboardStats(role);
        const container = document.getElementById('statCards');
        if (container) {
          const entries = Object.entries(stats).filter(([k]) => k !== 'registrations_30d').slice(0, 4);
          container.innerHTML = entries.map(([k, v], i) => {
            const icons = ['bi-speedometer2', 'bi-activity', 'bi-graph-up', 'bi-bar-chart'];
            const colors = ['blue', 'green', 'purple', 'yellow'];
            const val = typeof v === 'object' && v !== null ? (v.total ?? v.total_posts ?? v.logins_24h ?? v.open ?? v.active ?? Object.values(v)[0] ?? 0) : v;
            return UI.statCard(icons[i], val, k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()), null, colors[i]);
          }).join('');
          UI.initCounters(container);
        }
      } catch(e) { console.error(e); }
    }
  },
};

// Make globally accessible for inline onclick handlers
window.Dashboards = Dashboards;

// ===== EDUCATIONAL ADMIN HELPER FUNCTIONS =====

function switchEdPanel(panel) {
  window._saPanel = panel;
  document.querySelectorAll('.sa-panel').forEach(p => p.style.display = 'none');
  const target = document.getElementById('panel-' + panel);
  if (target) target.style.display = 'block';
  document.querySelectorAll('#appSidebar .sidebar-item').forEach(el => {
    const oc = el.getAttribute('onclick') || '';
    el.classList.toggle('active', oc.includes("'" + panel + "'"));
  });
}

const _panelLoaders = {
  courses: 'loadEdCourses()',
  enrollments: 'loadEdEnrollments()',
  departments: 'loadEdDepartments()',
  semesters: 'loadEdSemesters()',
  grades: 'loadEdGrades()',
  leaderboard: 'loadEdLeaderboard()',
  lessons: 'loadEdLessons()',
  challenges: 'loadSAChallenges()',
  alerts: 'loadMonitorAlerts()',
  'login-attempts': 'loadMonitorLoginAttempts()',
  'activity-logs': 'loadMonitorActivityLogs()',
  'suspicious-ips': 'loadMonitorSuspiciousIps()',
  'blocked-ips': 'loadMonitorBlockedIps()',
  'monitor-users': 'loadMonitorUsers()',
  'soc-users': 'Dashboards._socLoadUsers()',
  members: 'loadMemberDirectory()',
  'quiz-manage': 'loadQuizManagePanel()',
  'video-courses': 'loadVideoCoursesPanel()',
  'ops-users': 'loadOpsUsers()',
  'approvals': 'loadMemberDirectory()',
};

let _edCache = { users: [], courses: [], departments: [] };

async function _loadEdRefData() {
  try {
    const [uRes, cRes, dRes] = await Promise.all([
      API.getUsers({ per_page: 200 }),
      API.getCourses({ per_page: 200 }),
      API.getDepartments(),
    ]);
    _edCache.users = uRes.users || [];
    _edCache.courses = (cRes.courses || []).map(c => ({ ...c }));
    _edCache.departments = (dRes.departments || []).map(d => ({ ...d }));
  } catch(e) { console.error('Failed to load ref data:', e); }
}

function _getUserName(id) {
  const u = _edCache.users.find(u => u.id === id);
  return u ? u.name : 'User #' + id;
}

function _getCourseName(id) {
  const c = _edCache.courses.find(c => c.id === id);
  return c ? c.name + ' (' + c.code + ')' : 'Course #' + id;
}

function _getDeptName(id) {
  const d = _edCache.departments.find(d => d.id === id);
  return d ? d.name : 'Dept #' + id;
}

async function loadEdCourses() {
  const tbody = document.getElementById('edCoursesBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    await _loadEdRefData();
    const res = await API.getCourses({ per_page: 200 });
    const courses = res.courses || [];
    if (!courses.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-tertiary">No courses found.</td></tr>';
      return;
    }
    tbody.innerHTML = courses.map(c => `
      <tr>
        <td>${c.code}</td>
        <td>${c.name}</td>
        <td>${_getDeptName(c.department_id)}</td>
        <td>${UI.badge(c.status || 'active', c.status === 'active' ? 'success' : 'gray')}</td>
        <td>
          <button class="btn btn-ghost btn-xs" onclick="showEdEditCourseModal(${c.id})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-ghost btn-xs text-danger" onclick="if(confirm('Delete this course permanently?')){API.deleteCourse(${c.id}).then(()=>loadEdCourses()).catch(e=>alert(e.message))}"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error loading courses.</td></tr>';
    console.error(e);
  }
}

async function loadEdEnrollments() {
  const tbody = document.getElementById('edEnrollmentsBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="4" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    await _loadEdRefData();
    const res = await API.getEnrollments({ per_page: 200 });
    const enrollments = res.enrollments || [];
    if (!enrollments.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-tertiary">No enrollments found.</td></tr>';
      return;
    }
    tbody.innerHTML = enrollments.map(e => `
      <tr>
        <td>${_getUserName(e.user_id)}</td>
        <td>${_getCourseName(e.course_id)}</td>
        <td>${UI.badge(e.status || 'active', e.status === 'active' ? 'success' : 'gray')}</td>
        <td class="text-sm text-tertiary">${e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString() : '-'}</td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error loading enrollments.</td></tr>';
    console.error(e);
  }
}

async function loadEdDepartments() {
  const tbody = document.getElementById('edDepartmentsBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="3" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    const res = await API.getDepartments();
    const depts = res.departments || [];
    if (!depts.length) {
      tbody.innerHTML = '<tr><td colspan="3" class="text-center text-tertiary">No departments found.</td></tr>';
      return;
    }
    tbody.innerHTML = depts.map(d => `
      <tr>
        <td>${d.name}</td>
        <td>${d.code}</td>
        <td>
          <button class="btn btn-ghost btn-xs text-danger" onclick="UI.showToast('Info','Delete not implemented','info')"><i class="bi bi-trash"></i></button>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error loading departments.</td></tr>';
    console.error(e);
  }
}

async function loadEdSemesters() {
  const tbody = document.getElementById('edSemestersBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    const res = await API.getSemesters();
    const semesters = res.semesters || [];
    if (!semesters.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-tertiary">No semesters found.</td></tr>';
      return;
    }
    tbody.innerHTML = semesters.map(s => `
      <tr>
        <td>${s.name}</td>
        <td>${s.code}</td>
        <td class="text-sm text-tertiary">${s.start_date ? new Date(s.start_date).toLocaleDateString() : '-'}</td>
        <td class="text-sm text-tertiary">${s.end_date ? new Date(s.end_date).toLocaleDateString() : '-'}</td>
        <td>${s.is_current ? UI.badge('Current', 'success') : UI.badge('Past', 'gray')}</td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error loading semesters.</td></tr>';
    console.error(e);
  }
}

async function loadEdGrades() {
  const tbody = document.getElementById('edGradesBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="4" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    await _loadEdRefData();
    const res = await API.getGrades({ per_page: 200 });
    const grades = res.grades || [];
    if (!grades.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-tertiary">No grades found.</td></tr>';
      return;
    }
    tbody.innerHTML = grades.map(g => `
      <tr>
        <td>${_getUserName(g.user_id)}</td>
        <td>${_getCourseName(g.course_id)}</td>
        <td>${g.score != null ? g.score + ' / 100' : '-'}</td>
        <td>${g.letter_grade ? UI.badge(g.letter_grade, g.letter_grade === 'F' ? 'danger' : 'success') : '-'}</td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error loading grades.</td></tr>';
    console.error(e);
  }
}

async function loadEdLeaderboard() {
  const tbody = document.getElementById('edLeaderboardBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="4" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    const res = await API.getLeaderboard({ limit: 50 });
    const board = res.leaderboard || [];
    if (!board.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-tertiary">No data yet.</td></tr>';
      return;
    }
    tbody.innerHTML = board.map((entry, i) => `
      <tr>
        <td><span class="badge badge-${i < 3 ? ['gold','silver','bronze'][i] : 'gray'}">#${entry.rank || (i + 1)}</span></td>
        <td><div class="d-flex align-items-center gap-2">${UI.avatar(entry.full_name || entry.username || '?', 'sm', entry.avatar_url)} ${entry.full_name || entry.username}</div></td>
        <td class="fw-bold">${entry.total_xp?.toLocaleString() || 0}</td>
        <td>${UI.badge('Lv.' + (entry.level || 1), 'info')}</td>
      </tr>
    `).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error loading leaderboard.</td></tr>';
    console.error(e);
  }
}

// ---- File Manager State ----
let _fmCurrentFolderId = null;
let _fmCurrentFolderName = null;

async function loadEdLessons() {
  _fmCurrentFolderId = null;
  _fmCurrentFolderName = null;
  await renderFileManager();
}

async function renderFileManager() {
  const container = document.getElementById('lessonsFileManager');
  if (!container) return;
  container.innerHTML = '<div class="text-center text-tertiary p-4">Loading...</div>';
  try {
    const [lessonsRes, foldersRes] = await Promise.all([
      API.getLessons({ per_page: 200 }),
      API.getLessonFolders({})
    ]);
    const allLessons = lessonsRes.lessons || lessonsRes.data || [];
    const allFolders = foldersRes.folders || [];
    window._fmFolders = allFolders;
    window._fmLessons = allLessons;

    const iconMap = { 'PDF': 'bi-file-earmark-pdf', 'DOC': 'bi-file-earmark-word', 'DOCX': 'bi-file-earmark-word', 'PPT': 'bi-file-earmark-slides', 'PPTX': 'bi-file-earmark-slides', 'XLS': 'bi-file-earmark-spreadsheet', 'XLSX': 'bi-file-earmark-spreadsheet', 'TXT': 'bi-file-earmark-text', 'CSV': 'bi-file-earmark-spreadsheet', 'ZIP': 'bi-file-earmark-zip' };

    let html = '';

    if (_fmCurrentFolderId) {
      // === INSIDE A FOLDER ===
      const files = allLessons.filter(l => l.folder_id === _fmCurrentFolderId);

      // Breadcrumb
      html += '<div class="d-flex justify-between items-center mb-3 flex-wrap gap-2">' +
        '<div class="text-sm text-tertiary">' +
        '<span class="breadcrumb-link" onclick="fmNavigateToRoot()">All Files</span>' +
        ' <span class="text-tertiary mx-1">/</span> <span class="fw-medium">' + _fmCurrentFolderName + '</span>' +
        '</div>' +
        '<div class="text-xs text-tertiary">' + files.length + ' file' + (files.length !== 1 ? 's' : '') + '</div>' +
        '</div>';

      if (files.length) {
        // File icons grid
        html += '<div class="d-flex flex-wrap gap-3">';
        files.forEach(l => {
          const ext = (l.original_filename || '').split('.').pop().toUpperCase();
          const size = l.file_size > 1048576 ? (l.file_size / 1048576).toFixed(1) + ' MB' : (l.file_size / 1024).toFixed(1) + ' KB';
          const icon = iconMap[ext] || 'bi-file-earmark';
          // highlight color per type
          const colorMap = { 'PDF': '#e74c3c', 'DOC': '#2b5797', 'DOCX': '#2b5797', 'PPT': '#d24726', 'PPTX': '#d24726', 'XLS': '#217346', 'XLSX': '#217346', 'TXT': '#555', 'CSV': '#217346', 'ZIP': '#f39c12' };
          const color = colorMap[ext] || 'var(--text-tertiary)';
          html += '<div class="fm-file-item text-center" style="width:120px;padding:0.75rem 0.5rem;cursor:pointer;border-radius:var(--radius-md);transition:background 0.15s" onmouseover="this.style.background=\'var(--bg-tertiary)\'" onmouseout="this.style.background=\'\'" title="' + (l.original_filename || l.title) + '">' +
            '<a href="' + l.file_path + '" target="_blank" style="text-decoration:none;color:inherit;display:block" download="' + (l.original_filename || 'download') + '">' +
            '<i class="' + icon + '" style="font-size:2.8rem;color:' + color + ';display:block;margin-bottom:0.4rem"></i>' +
            '<span class="text-xs fw-medium text-truncate d-block" style="max-width:110px">' + (l.title || l.original_filename || '') + '</span>' +
            '<span class="text-2xs text-tertiary d-block">' + size + '</span>' +
            '</a>' +
            '<button class="btn btn-ghost btn-xs text-danger mt-1" onclick="event.stopPropagation();deleteEdLesson(' + l.id + ')" title="Delete" style="opacity:0.6;font-size:10px"><i class="bi bi-trash"></i></button>' +
            '</div>';
        });
        html += '</div>';
      } else {
        // Empty state
        html += '<div class="d-flex flex-column align-items-center justify-content-center p-6" style="min-height:200px;border:2px dashed var(--border-primary);border-radius:var(--radius-lg)" ' +
          'ondragover="event.preventDefault();this.style.background=\'var(--bg-tertiary)\'" ' +
          'ondragleave="this.style.background=\'\'" ' +
          'ondrop="event.preventDefault();handleFmDrop(event)">' +
          '<i class="bi bi-cloud-arrow-up" style="font-size:2.5rem;color:var(--text-tertiary);margin-bottom:0.75rem"></i>' +
          '<p class="text-sm text-tertiary mb-3">This folder is empty</p>' +
          '<button class="btn btn-primary btn-sm" onclick="showFmUploadModal(' + _fmCurrentFolderId + ')"><i class="bi bi-cloud-arrow-up"></i> Upload Files</button>' +
          '</div>';
      }
    } else {
      // === ROOT: folders only ===
      const folders = allFolders;

      html += '<div class="d-flex justify-between items-center mb-3 flex-wrap gap-2">' +
        '<div class="text-sm text-tertiary">All Files</div>' +
        '<div class="text-xs text-tertiary">' + folders.length + ' folder' + (folders.length !== 1 ? 's' : '') + '</div>' +
        '</div>';

      if (folders.length) {
        html += '<div class="d-flex flex-wrap gap-2">';
        // New Folder button styled as folder outline
        html += '<div class="fm-new-folder-btn text-center" onclick="showCreateLessonFolderModal()" style="width:140px;padding:1rem 0.5rem;cursor:pointer;border-radius:var(--radius-md);transition:background 0.15s" onmouseover="this.style.background=\'var(--bg-tertiary)\'" onmouseout="this.style.background=\'\'">' +
          '<i class="bi bi-folder-plus" style="font-size:2.8rem;color:var(--accent);display:block;margin-bottom:0.4rem;opacity:0.6"></i>' +
          '<span class="text-xs fw-medium text-accent">New Folder</span>' +
          '</div>';
        folders.forEach(f => {
          const fcount = (window._fmLessons || []).filter(l => l.folder_id === f.id).length;
          const folderName = f.name.replace(/'/g, "\\'");
          const folderDesc = (f.description || '').replace(/'/g, "\\'");
          html += '<div class="fm-folder-item text-center" onclick="fmNavigateToFolder(' + f.id + ',\'' + folderName + '\')" style="width:140px;padding:1rem 0.5rem;cursor:pointer;border-radius:var(--radius-md);transition:background 0.15s" title="' + folderDesc + '" onmouseover="this.style.background=\'var(--bg-tertiary)\'" onmouseout="this.style.background=\'\'">' +
            '<i class="bi bi-folder" style="font-size:3rem;color:var(--accent);display:block;margin-bottom:0.4rem"></i>' +
            '<span class="text-xs fw-medium text-truncate d-block" style="max-width:130px">' + (f.name || '') + '</span>' +
            '<span class="text-2xs text-tertiary">' + fcount + ' file' + (fcount !== 1 ? 's' : '') + '</span>' +
            '<div class="d-flex gap-1 justify-center mt-1" style="display:none">' +
            '<button class="btn btn-ghost btn-xs" onclick="event.stopPropagation();showEditLessonFolderModal(' + f.id + ',\'' + folderName + '\',\'' + folderDesc + '\')" title="Edit" style="font-size:10px"><i class="bi bi-pencil"></i></button>' +
            '<button class="btn btn-ghost btn-xs text-danger" onclick="event.stopPropagation();deleteLessonFolder(' + f.id + ')" title="Delete" style="font-size:10px"><i class="bi bi-trash"></i></button>' +
            '</div></div>';
        });
        html += '</div>';
      } else {
        // Empty root
        html += '<div class="d-flex flex-column align-items-center justify-content-center p-6" style="min-height:200px;border:2px dashed var(--border-primary);border-radius:var(--radius-lg)">' +
          '<i class="bi bi-folder2-open" style="font-size:2.5rem;color:var(--text-tertiary);margin-bottom:0.75rem"></i>' +
          '<p class="text-sm text-tertiary mb-3">No folders yet</p>' +
          '<button class="btn btn-primary btn-sm" onclick="showCreateLessonFolderModal()"><i class="bi bi-folder-plus"></i> Create Folder</button>' +
          '</div>';
      }
    }

    container.innerHTML = html;
  } catch(e) {
    container.innerHTML = '<div class="text-center text-danger p-4">Error: ' + (e.message || '') + '</div>';
    console.error(e);
  }
}

function fmNavigateToFolder(id, name) {
  _fmCurrentFolderId = id;
  _fmCurrentFolderName = name;
  renderFileManager();
}

function fmNavigateToRoot() {
  _fmCurrentFolderId = null;
  _fmCurrentFolderName = null;
  renderFileManager();
}

function handleFmDrop(e) {
  e.preventDefault();
  this.style.background = '';
  const files = e.dataTransfer.files;
  if (files.length && _fmCurrentFolderId) {
    showFmUploadModal(_fmCurrentFolderId);
  }
}

function deleteEdLesson(id) {
  if (!confirm('Delete this lesson? The file will be permanently removed.')) return;
  API.deleteLesson(id).then(() => { renderFileManager(); UI.showToast('Deleted', 'Lesson deleted.', 'success'); }).catch(e => UI.showToast('Error', e.message, 'error'));
}

function deleteLessonFolder(id) {
  if (!confirm('Delete this folder? Lessons inside will be moved to Unorganized.')) return;
  API.deleteLessonFolder(id).then(() => { renderFileManager(); UI.showToast('Deleted', 'Folder deleted.', 'success'); }).catch(e => UI.showToast('Error', e.message, 'error'));
}

async function showFmUploadModal(folderId) {
  UI.showModal('Upload Files', `
    <form id="fmUploadForm" onsubmit="handleFmUpload(event, ${folderId})">
      <div class="mb-3">
        <label class="form-label">File</label>
        <input type="file" class="form-input" id="fmUploadFile" required accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.zip">
      </div>
      <div class="mb-3">
        <label class="form-label">Name <span class="text-xs text-tertiary">(optional — defaults to filename)</span></label>
        <input type="text" class="form-input" id="fmUploadName" placeholder="e.g. Chapter 1 Notes">
      </div>
      <button type="submit" class="btn btn-primary"><i class="bi bi-cloud-arrow-up"></i> Upload</button>
    </form>
  `);
}

async function handleFmUpload(e, folderId) {
  e.preventDefault();
  const fileEl = document.getElementById('fmUploadFile');
  const nameEl = document.getElementById('fmUploadName');
  if (!fileEl || !fileEl.files || !fileEl.files[0]) { UI.showToast('Error', 'Please select a file.', 'error'); return; }
  const fd = new FormData();
  fd.append('folder_id', folderId);
  fd.append('title', nameEl.value.trim() || fileEl.files[0].name.replace(/\.[^/.]+$/, ''));
  fd.append('file', fileEl.files[0]);
  // Get folder's course_id if set, otherwise leave course_id empty
  const folder = window._fmFolders?.find(f => f.id === folderId);
  if (folder && folder.course_id) fd.append('course_id', folder.course_id);
  const btn = e.target.querySelector('button[type="submit"]');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Uploading...'; }
  try {
    await API.createLesson(fd);
    UI.closeModal();
    renderFileManager();
    UI.showToast('Success', 'File uploaded.', 'success');
  } catch(err) {
    UI.showToast('Error', err.message || 'Failed to upload', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-cloud-arrow-up"></i> Upload'; }
  }
}

async function showCreateLessonFolderModal() {
  UI.showModal('Create Folder', `
    <form id="lessonFolderForm" onsubmit="handleCreateLessonFolder(event)">
      <div class="mb-3">
        <label class="form-label">Folder Name</label>
        <input type="text" class="form-input" id="lfName" required placeholder="e.g. Chapter 1 - Introduction" autofocus>
      </div>
      <button type="submit" class="btn btn-primary">Create Folder</button>
    </form>
  `);
}

async function handleCreateLessonFolder(e) {
  e.preventDefault();
  const name = document.getElementById('lfName').value.trim();
  if (!name) { UI.showToast('Error', 'Folder name is required.', 'error'); return; }
  try {
    await API.createLessonFolder({ name });
    UI.closeModal();
    UI.showToast('Success', 'Folder created.', 'success');
    renderFileManager();
  } catch(err) {
    UI.showToast('Error', err.message || 'Failed to create folder', 'error');
  }
}

async function showEditLessonFolderModal(id, name, description) {
  UI.showModal('Edit Folder', `
    <form id="lessonFolderForm" onsubmit="handleEditLessonFolder(event, ${id})">
      <div class="mb-3">
        <label class="form-label">Folder Name</label>
        <input type="text" class="form-input" id="lfName" value="${name.replace(/"/g, '&quot;')}" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-textarea" id="lfDesc" rows="2">${description.replace(/"/g, '&quot;')}</textarea>
      </div>
      <button type="submit" class="btn btn-primary">Update Folder</button>
    </form>
  `);
}

async function handleEditLessonFolder(e, id) {
  e.preventDefault();
  const data = {
    name: document.getElementById('lfName').value,
    description: document.getElementById('lfDesc').value,
  };
  try {
    await API.updateLessonFolder(id, data);
    UI.closeModal();
    UI.showToast('Success', 'Folder updated.', 'success');
    renderFileManager();
  } catch(err) {
    UI.showToast('Error', err.message || 'Failed to update folder', 'error');
  }
}

// ---- MODALS ----

async function showEdCreateCourseModal() {
  await _loadEdRefData();
  const deptOpts = _edCache.departments.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
  UI.showModal('Create Course', `
    <form id="edCourseForm" onsubmit="handleEdCreateCourse(event)">
      <div class="mb-3">
        <label class="form-label">Course Code</label>
        <input type="text" class="form-input" name="code" required placeholder="e.g. CS401">
      </div>
      <div class="mb-3">
        <label class="form-label">Course Name</label>
        <input type="text" class="form-input" name="name" required placeholder="e.g. Advanced Database Systems">
      </div>
      <div class="mb-3">
        <label class="form-label">Department</label>
        <select class="form-input" name="department_id"><option value="">-- Select --</option>${deptOpts}</select>
      </div>
      <div class="mb-3">
        <label class="form-label">Credits</label>
        <input type="number" class="form-input" name="credits" value="3" min="1" max="6">
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-input" name="description" rows="3"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Create Course</button>
    </form>
  `);
}

async function handleEdCreateCourse(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  try {
    await API.createCourse(data);
    UI.closeModal();
    UI.showToast('Success', 'Course created', 'success');
    loadEdCourses();
  } catch(err) {
    alert(err.message || 'Failed to create course');
  }
}

async function showEdEditCourseModal(courseId) {
  await _loadEdRefData();
  const course = _edCache.courses.find(c => c.id === courseId);
  if (!course) { alert('Course not found'); return; }
  const deptOpts = _edCache.departments.map(d => `<option value="${d.id}" ${d.id == course.department_id ? 'selected' : ''}>${d.name}</option>`).join('');
  UI.showModal('Edit Course', `
    <form id="edCourseForm" onsubmit="handleEdEditCourse(event, ${course.id})">
      <div class="mb-3">
        <label class="form-label">Course Code</label>
        <input type="text" class="form-input" name="code" value="${course.code}" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Course Name</label>
        <input type="text" class="form-input" name="name" value="${course.name}" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Department</label>
        <select class="form-input" name="department_id"><option value="">-- Select --</option>${deptOpts}</select>
      </div>
      <div class="mb-3">
        <label class="form-label">Credits</label>
        <input type="number" class="form-input" name="credits" value="${course.credits || 3}" min="1" max="6">
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-input" name="description" rows="3">${course.description || ''}</textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Status</label>
        <select class="form-input" name="status">
          <option value="active" ${course.status === 'active' ? 'selected' : ''}>Active</option>
          <option value="archived" ${course.status === 'archived' ? 'selected' : ''}>Archived</option>
        </select>
      </div>
      <button type="submit" class="btn btn-primary">Update Course</button>
    </form>
  `);
}

async function handleEdEditCourse(e, courseId) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  try {
    await API.updateCourse(courseId, data);
    UI.closeModal();
    UI.showToast('Success', 'Course updated', 'success');
    loadEdCourses();
  } catch(err) {
    alert(err.message || 'Failed to update course');
  }
}

async function showEdCreateEnrollmentModal() {
  await _loadEdRefData();
  const studentOpts = _edCache.users.filter(u => u.role === 'student').map(u => `<option value="${u.id}">${u.name}</option>`).join('');
  const courseOpts = _edCache.courses.map(c => `<option value="${c.id}">${c.name} (${c.code})</option>`).join('');
  UI.showModal('Enroll Student', `
    <form id="edEnrollForm" onsubmit="handleEdCreateEnrollment(event)">
      <div class="mb-3">
        <label class="form-label">Student</label>
        <select class="form-input" name="user_id" required>${studentOpts || '<option value="">No students available</option>'}</select>
      </div>
      <div class="mb-3">
        <label class="form-label">Course</label>
        <select class="form-input" name="course_id" required>${courseOpts || '<option value="">No courses available</option>'}</select>
      </div>
      <button type="submit" class="btn btn-primary">Enroll</button>
    </form>
  `);
}

async function handleEdCreateEnrollment(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  try {
    await API.createEnrollment(data);
    UI.closeModal();
    UI.showToast('Success', 'Student enrolled', 'success');
    loadEdEnrollments();
  } catch(err) {
    alert(err.message || 'Failed to create enrollment');
  }
}

function showEdCreateDepartmentModal() {
  UI.showModal('Create Department', `
    <form id="edDeptForm" onsubmit="handleEdCreateDepartment(event)">
      <div class="mb-3">
        <label class="form-label">Department Name</label>
        <input type="text" class="form-input" name="name" required placeholder="e.g. Computer Science">
      </div>
      <div class="mb-3">
        <label class="form-label">Code</label>
        <input type="text" class="form-input" name="code" required placeholder="e.g. CS">
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-input" name="description" rows="3"></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Create Department</button>
    </form>
  `);
}

async function handleEdCreateDepartment(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  try {
    await API.createDepartment(data);
    UI.closeModal();
    UI.showToast('Success', 'Department created', 'success');
    loadEdDepartments();
  } catch(err) {
    alert(err.message || 'Failed to create department');
  }
}

function showEdCreateSemesterModal() {
  UI.showModal('Create Semester', `
    <form id="edSemesterForm" onsubmit="handleEdCreateSemester(event)">
      <div class="mb-3">
        <label class="form-label">Semester Name</label>
        <input type="text" class="form-input" name="name" required placeholder="e.g. Fall 2026">
      </div>
      <div class="mb-3">
        <label class="form-label">Code</label>
        <input type="text" class="form-input" name="code" required placeholder="e.g. F2026">
      </div>
      <div class="mb-3">
        <label class="form-label">Start Date</label>
        <input type="date" class="form-input" name="start_date" required>
      </div>
      <div class="mb-3">
        <label class="form-label">End Date</label>
        <input type="date" class="form-input" name="end_date" required>
      </div>
      <div class="mb-3">
        <label class="form-checkbox"><input type="checkbox" name="is_current" value="1"> Set as current semester</label>
      </div>
      <button type="submit" class="btn btn-primary">Create Semester</button>
    </form>
  `);
}

async function handleEdCreateSemester(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  data.is_current = data.is_current ? 1 : 0;
  try {
    await API.createSemester(data);
    UI.closeModal();
    UI.showToast('Success', 'Semester created', 'success');
    loadEdSemesters();
  } catch(err) {
    alert(err.message || 'Failed to create semester');
  }
}

async function showEdCreateGradeModal() {
  await _loadEdRefData();
  const studentOpts = _edCache.users.filter(u => u.role === 'student').map(u => `<option value="${u.id}">${u.name}</option>`).join('');
  const courseOpts = _edCache.courses.map(c => `<option value="${c.id}">${c.name} (${c.code})</option>`).join('');
  UI.showModal('Add Grade', `
    <form id="edGradeForm" onsubmit="handleEdCreateGrade(event)">
      <div class="mb-3">
        <label class="form-label">Student</label>
        <select class="form-input" name="user_id" required>${studentOpts || '<option value="">No students</option>'}</select>
      </div>
      <div class="mb-3">
        <label class="form-label">Course</label>
        <select class="form-input" name="course_id" required>${courseOpts || '<option value="">No courses</option>'}</select>
      </div>
      <div class="mb-3">
        <label class="form-label">Score (0-100)</label>
        <input type="number" class="form-input" name="score" min="0" max="100" step="0.5" required>
      </div>
      <div class="mb-3">
        <label class="form-label">Remarks (optional)</label>
        <input type="text" class="form-input" name="remarks" placeholder="e.g. Excellent work">
      </div>
      <button type="submit" class="btn btn-primary">Record Grade</button>
    </form>
  `);
}

async function handleEdCreateGrade(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  data.score = parseFloat(data.score);
  try {
    await API.createGrade(data);
    UI.closeModal();
    UI.showToast('Success', 'Grade recorded', 'success');
    loadEdGrades();
  } catch(err) {
    alert(err.message || 'Failed to record grade');
  }
}

async function showEdAwardXpModal() {
  await _loadEdRefData();
  const studentOpts = _edCache.users.filter(u => u.role === 'student').map(u => `<option value="${u.id}">${u.name}</option>`).join('');
  UI.showModal('Award XP', `
    <form id="edXpForm" onsubmit="handleEdAwardXp(event)">
      <div class="mb-3">
        <label class="form-label">Student</label>
        <select class="form-input" name="user_id" required>${studentOpts || '<option value="">No students</option>'}</select>
      </div>
      <div class="mb-3">
        <label class="form-label">XP Amount</label>
        <input type="number" class="form-input" name="xp" min="1" max="10000" required placeholder="e.g. 500">
      </div>
      <div class="mb-3">
        <label class="form-label">Reason</label>
        <input type="text" class="form-input" name="reason" required placeholder="e.g. Excellent assignment">
      </div>
      <button type="submit" class="btn btn-primary">Award XP</button>
    </form>
  `);
}

async function handleEdAwardXp(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  data.xp = parseInt(data.xp);
  try {
    await API.awardXp(data);
    UI.closeModal();
    UI.showToast('Success', 'XP awarded', 'success');
    loadEdLeaderboard();
  } catch(err) {
    alert(err.message || 'Failed to award XP');
  }
}

// Helper
UI.formatNumber = function(n) {
  return n >= 1000 ? (n/1000).toFixed(1) + 'k' : n;
};

// Sidebar toggle
function toggleSidebar() {
  const sidebar = document.getElementById('appSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if (window.innerWidth <= 992) {
    sidebar.classList.toggle('mobile-open');
    overlay.classList.toggle('show');
  } else {
    sidebar.classList.toggle('collapsed');
    const wrapper = document.getElementById('contentWrapper');
    if (wrapper) wrapper.classList.toggle('sidebar-collapsed');
    const navbar = document.getElementById('appNavbar');
    if (navbar) navbar.classList.toggle('sidebar-collapsed');
  }
}

function toggleDropdown(id) {
  const menu = document.getElementById(id + 'Menu') || document.querySelector(`#${id} .dropdown-menu`);
  if (menu) menu.classList.toggle('show');
}

// ===== MULTI-THEME SYSTEM =====
const THEMES = [
  { value: 'midnight', label: 'Midnight', icon: 'bi-moon-stars', desc: 'Dark classic', colors: ['#0B1220', '#151d2b', '#2563EB', '#f1f5f9'] },
  { value: 'dawn',     label: 'Dawn',     icon: 'bi-sun',        desc: 'Clean & bright', colors: ['#f8fafc', '#ffffff', '#2563EB', '#0f172a'] },
  { value: 'blush',    label: 'Blush',    icon: 'bi-heart',      desc: 'Bright pink — lady side', colors: ['#fdf2f8', '#ffffff', '#ec4899', '#1a0d14'] },
  { value: 'sunset',   label: 'Sunset',   icon: 'bi-sunset',     desc: 'Warm orange glow', colors: ['#fff7ed', '#ffffff', '#f97316', '#1c0f06'] },
  { value: 'frost',    label: 'Frost',    icon: 'bi-snow',       desc: 'Cool icy blue', colors: ['#f0f9ff', '#ffffff', '#0ea5e9', '#082f49'] },
  { value: 'mint',     label: 'Mint',     icon: 'bi-brightness-high', desc: 'Fresh green', colors: ['#f0fdf4', '#ffffff', '#10b981', '#052e16'] },
  { value: 'peach',    label: 'Peach',    icon: 'bi-sun',        desc: 'Warm coral', colors: ['#fff5f0', '#ffffff', '#f97316', '#1c0f06'] },
  { value: 'lilac',    label: 'Lilac',    icon: 'bi-palette',    desc: 'Soft purple', colors: ['#f8f5ff', '#ffffff', '#8b5cf6', '#1a0a2e'] },
  { value: 'ivory',    label: 'Ivory',    icon: 'bi-brightness-high', desc: 'Warm cream', colors: ['#fefbf7', '#ffffff', '#b8845a', '#1a1008'] },
  { value: 'ocean',    label: 'Ocean',    icon: 'bi-droplet',    desc: 'Deep teal vibes', colors: ['#0a1628', '#0f1d34', '#06b6d4', '#e0f8f8'] },
  { value: 'moss',     label: 'Moss',     icon: 'bi-tree',       desc: 'Earthy green — boy side', colors: ['#0a140e', '#0d1811', '#10b981', '#d1fae5'] },
  { value: 'ember',    label: 'Ember',    icon: 'bi-fire',       desc: 'Dark crimson', colors: ['#1a0a0a', '#1f0c0c', '#ef4444', '#fce7e7'] },
  { value: 'nebula',   label: 'Nebula',   icon: 'bi-star',       desc: 'Space blue-purple', colors: ['#0a0a1a', '#0c0c20', '#818cf8', '#e0e0ff'] },
  { value: 'dusk',     label: 'Dusk',     icon: 'bi-moon',       desc: 'Purple twilight', colors: ['#0f0a1a', '#120d1e', '#8b5cf6', '#ede9fe'] },
  { value: 'onyx',     label: 'Onyx',     icon: 'bi-circle',     desc: 'Monochrome gray', colors: ['#0a0a0a', '#0e0e0e', '#888888', '#e0e0e0'] },
];

// Migrate old localStorage values
(function initTheme() {
  let saved = localStorage.getItem('cs15_theme');
  if (saved === 'dark' || saved === 'light') {
    saved = saved === 'dark' ? 'midnight' : 'dawn';
    localStorage.setItem('cs15_theme', saved);
  } else if (saved === 'rose') {
    saved = 'blush';
    localStorage.setItem('cs15_theme', saved);
  }
  if (saved && THEMES.some(t => t.value === saved)) {
    setTheme(saved);
  }
  // Watch for theme options container appearing in DOM, then render
  const obs = new MutationObserver(() => {
    const el = document.getElementById('themeOptions');
    if (el && !el.children.length) renderThemeOptions();
  });
  obs.observe(document.body, { childList: true, subtree: true });
})();

function setTheme(value) {
  const t = THEMES.find(x => x.value === value);
  if (!t) return;
  const html = document.documentElement;
  html.setAttribute('data-theme', value);
  const lightThemes = ['dawn', 'blush', 'sunset', 'frost', 'mint', 'peach', 'lilac', 'ivory'];
  html.setAttribute('data-bs-theme', lightThemes.includes(value) ? 'light' : 'dark');
  localStorage.setItem('cs15_theme', value);
  renderThemeOptions();
}

function renderThemeOptions() {
  const container = document.getElementById('themeOptions');
  if (!container) return;
  const current = document.documentElement.getAttribute('data-theme') || 'midnight';
  container.innerHTML = THEMES.map(t => {
    const active = t.value === current;
    return `<button class="dropdown-item theme-option ${active ? 'active' : ''}" onclick="selectTheme('${t.value}')" style="display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;${active ? '' : ''}">
      <div class="theme-swatch" style="display:flex;gap:3px;flex-shrink:0">
        ${t.colors.map(c => `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${c};border:1px solid rgba(255,255,255,0.1)"></span>`).join('')}
      </div>
      <div style="flex:1;min-width:0">
        <div style="font-size:0.85rem;font-weight:500;color:var(--text-primary)">${t.label}</div>
        <div style="font-size:0.7rem;color:var(--text-tertiary)">${t.desc}</div>
      </div>
      ${active ? '<i class="bi bi-check-circle-fill" style="color:var(--accent-primary);font-size:0.9rem"></i>' : ''}
    </button>`;
  }).join('');
}

function selectTheme(value) {
  setTheme(value);
  // close dropdown
  const menu = document.getElementById('themeDropdownMenu');
  if (menu) menu.classList.remove('show');
}

async function handleLogout() {
  await API.logout();
  UI.showToast('Signed out', 'You have been logged out.', 'info');
  if (typeof refreshBottomNav === 'function') refreshBottomNav();
  router.navigate('/');
}

async function handleGlobalSearch(query) {
  if (!query.trim()) return;
  try {
    const results = await API.search(query);
    if (results.length === 0) {
      UI.showToast('No Results', `No results found for "${query}"`, 'info');
      return;
    }
    let html = results.slice(0, 8).map(r => {
      if (r.type === 'post') return `<div class="dropdown-item" onclick="router.navigate('/posts/'+encodeURIComponent('${r.slug}'))"><i class="bi bi-file-text"></i> ${r.title}</div>`;
      if (r.type === 'member') return `<div class="dropdown-item" onclick="router.navigate('/profile')"><i class="bi bi-person"></i> ${r.name} <span class="text-tertiary">(${r.role})</span></div>`;
      if (r.type === 'project') return `<div class="dropdown-item" onclick="router.navigate('/projects')"><i class="bi bi-journal-code"></i> ${r.title}</div>`;
      return '';
    }).join('');
    UI.showModal('Search Results', `<div class="dropdown-menu show" style="position:static;box-shadow:none;border:none;background:transparent">${html}</div>`);
  } catch(e) { console.error(e); }
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  document.querySelectorAll('.dropdown-menu.show').forEach(m => {
    if (!e.target.closest('.dropdown')) m.classList.remove('show');
  });
});

// Logout handlers for financial and other admins
Dashboards.financialAdminLoaded = function() {
  const canvas = document.getElementById('revenueChart');
  if (canvas && typeof Chart !== 'undefined') {
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
        datasets: [{
          label: 'Revenue',
          data: [42000, 38500, 45800, 52000, 49000, 53500],
          backgroundColor: '#10b981',
          borderRadius: 6,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', callback: v => '$' + v.toLocaleString() } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        },
      },
    });
  }
  this._loadStats('financial_admin');
  loadFinancialRecords();
};

// ─── Financial Management Functions ─────────────────────────────

let _finRecords = [];
let _finSelectedRecordId = null;
let _finStudents = [];

async function loadFinancialRecords() {
  try {
    const data = await API.getFinancialRecords();
    _finRecords = data.records || [];
    renderFinancialRecords();
    updateFinancialSummary();
  } catch(e) {
    console.error('Failed to load financial records:', e);
    const container = document.getElementById('financialRecordsContainer');
    if (container) container.innerHTML = '<div class="text-center text-tertiary p-4">Failed to load records.</div>';
  }
}

function renderFinancialRecords() {
  const container = document.getElementById('financialRecordsContainer');
  if (!container) return;
  if (_finRecords.length === 0) {
    container.innerHTML = '<div class="text-center text-tertiary p-4">No monthly records yet. Click "Create New Record" to start.</div>';
    return;
  }
  container.innerHTML = `
    <div class="table-container">
      <table class="table table-sm">
        <thead><tr><th>Month</th><th>Students</th><th>Paid</th><th>Unpaid</th><th>Status</th><th>Created By</th><th>Date</th><th>Actions</th></tr></thead>
        <tbody>
          ${_finRecords.map(r => `
            <tr class="${r.status === 'active' ? 'fin-active-row' : ''}" style="${r.status === 'active' ? 'background:var(--bg-hover)' : ''}">
              <td class="fw-medium">${r.month_name}</td>
              <td>${r.student_count || 0}</td>
              <td class="text-success fw-medium">${r.paid_count || 0}</td>
              <td class="text-danger fw-medium">${(r.student_count || 0) - (r.paid_count || 0)}</td>
              <td>${r.status === 'active' ? UI.badge('Active', 'success') : UI.badge('Archived', 'secondary')}</td>
              <td class="text-sm text-tertiary">${r.created_by_name || 'Unknown'}</td>
              <td class="text-sm text-tertiary">${new Date(r.created_at).toLocaleDateString()}</td>
              <td>
                <button class="btn btn-xs btn-ghost" onclick="selectFinancialRecord(${r.id})" title="View Students"><i class="bi bi-eye"></i></button>
                ${r.status === 'archived' ? `<button class="btn btn-xs btn-ghost" onclick="API.downloadFinancialPdf(${r.id})" title="Download PDF"><i class="bi bi-filetype-pdf"></i></button> <button class="btn btn-xs btn-ghost" onclick="API.downloadFinancialCsv(${r.id})" title="Download CSV"><i class="bi bi-file-earmark-spreadsheet"></i></button>` : ''}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function updateFinancialSummary() {
  const active = _finRecords.find(r => r.status === 'active');
  document.getElementById('finActiveMonth').textContent = active ? active.month_name : 'None';
  if (active) {
    const total = active.student_count || 0;
    const paid = active.paid_count || 0;
    document.getElementById('finTotalStudents').textContent = total;
    document.getElementById('finPaidCount').textContent = paid;
    document.getElementById('finUnpaidCount').textContent = total - paid;
  } else {
    document.getElementById('finTotalStudents').textContent = '0';
    document.getElementById('finPaidCount').textContent = '0';
    document.getElementById('finUnpaidCount').textContent = '0';
  }
}

function showCreateMonthModal() {
  UI.showModal('Create New Monthly Record', `
    <form id="createMonthForm" onsubmit="handleCreateMonth(event)">
      <div class="mb-3">
        <label class="form-label">Month Name</label>
        <input type="text" class="form-input" id="monthNameInput" placeholder="e.g. June 2026" required>
      </div>
      <button type="submit" class="btn btn-primary w-full" id="createMonthBtn">Create New Record</button>
    </form>
  `);
  setTimeout(() => document.getElementById('monthNameInput')?.focus(), 100);
}

async function handleCreateMonth(e) {
  e.preventDefault();
  const btn = document.getElementById('createMonthBtn');
  const input = document.getElementById('monthNameInput');
  if (!input || !input.value.trim()) return;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Creating...';
  try {
    await API.createFinancialRecord({ month_name: input.value.trim() });
    UI.closeModal();
    UI.showToast('Success', 'Monthly record created successfully.', 'success');
    await loadFinancialRecords();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to create record.', 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Create New Record'; }
  }
}

async function selectFinancialRecord(recordId) {
  _finSelectedRecordId = recordId;
  try {
    const data = await API.getFinancialRecord(recordId);
    _finStudents = data.students || [];
    const record = data.record || {};
    const card = document.getElementById('financialStudentCard');
    const monthLabel = document.getElementById('finSelectedMonth');
    if (card) card.style.display = 'block';
    if (monthLabel) monthLabel.textContent = `Students - ${record.month_name || 'Unknown'}`;

    // Hide submit button if archived
    const submitBtn = document.getElementById('finSubmitBtn');
    if (submitBtn) submitBtn.style.display = record.status === 'active' ? 'inline-flex' : 'none';

    renderFinancialStudentTable();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to load students.', 'error');
  }
}

function renderFinancialStudentTable() {
  const tbody = document.getElementById('finStudentBody');
  if (!tbody) return;
  const showUnpaidOnly = document.getElementById('finShowUnpaidOnly')?.checked;
  const searchQuery = (document.getElementById('finSearchInput')?.value || '').toLowerCase();

  let filtered = _finStudents;
  if (showUnpaidOnly) filtered = filtered.filter(s => s.status === 'unpaid');
  if (searchQuery) filtered = filtered.filter(s =>
    (s.student_name || '').toLowerCase().includes(searchQuery) ||
    (s.student_id || '').toString().includes(searchQuery) ||
    (s.email || '').toLowerCase().includes(searchQuery)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-tertiary">No students found.</td></tr>';
    return;
  }

  tbody.innerHTML = filtered.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><div class="d-flex items-center gap-2"><div class="avatar avatar-xs" style="background:var(--accent-primary)">${(s.student_name || '?')[0]}</div><span class="fw-medium">${s.student_name || 'Unknown'}</span></div></td>
      <td class="text-sm text-tertiary">#${s.student_id}</td>
      <td class="text-sm text-tertiary">${s.email || ''}</td>
      <td>${s.status === 'paid' ? UI.badge('Paid', 'success') : UI.badge('Unpaid', 'danger')}</td>
      <td>
        <button class="btn btn-sm ${s.status === 'paid' ? 'btn-success' : 'btn-ghost'}" onclick="toggleStudentPayment(${_finSelectedRecordId}, ${s.student_id})" title="${s.status === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid'}">
          ${s.status === 'paid' ? '<i class="bi bi-check-circle"></i> Paid' : '<i class="bi bi-circle"></i> Mark Paid'}
        </button>
      </td>
    </tr>
  `).join('');
}

let _finToggling = false;

async function toggleStudentPayment(recordId, studentId) {
  if (_finToggling) return;
  _finToggling = true;
  try {
    const data = await API.togglePaymentStatus(recordId, studentId);
    const student = _finStudents.find(s => s.student_id === studentId);
    if (student) student.status = data.status;
    renderFinancialStudentTable();
    await loadFinancialRecords();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to update payment.', 'error');
  } finally {
    _finToggling = false;
  }
}

async function submitFinancialMonth() {
  if (!_finSelectedRecordId) return;
  if (!confirm('Are you sure you want to submit and archive this month? No further edits will be possible.')) return;
  try {
    await API.submitFinancialRecord(_finSelectedRecordId);
    UI.showToast('Success', 'Monthly report submitted and archived.', 'success');
    await loadFinancialRecords();
    const card = document.getElementById('financialStudentCard');
    if (card) card.style.display = 'none';
    _finSelectedRecordId = null;
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to submit record.', 'error');
  }
}

function exportFinancialPdf() {
  if (!_finSelectedRecordId) return;
  API.downloadFinancialPdf(_finSelectedRecordId);
}

function exportFinancialCsv() {
  if (!_finSelectedRecordId) return;
  API.downloadFinancialCsv(_finSelectedRecordId);
}

function refreshFinancialPanel() {
  loadFinancialRecords();
}

function filterFinancialStudents() {
  renderFinancialStudentTable();
}

Dashboards.eduAdminLoaded = function() {
  const canvas = document.getElementById('curriculumChart');
  if (canvas && typeof Chart !== 'undefined') {
    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [{
          data: [68, 22, 10],
          backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
          borderWidth: 0,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 16 } } },
        cutout: '65%',
      },
    });
  }
  this._loadStats('educational_admin');
};

Dashboards.monitorAdminLoaded = function() {
  loadMonitorOverview();
};

Dashboards.sportsAdminLoaded = function() {
  const canvas = document.getElementById('sportsChart');
  if (canvas && typeof Chart !== 'undefined') {
    new Chart(canvas, {
      type: 'radar',
      data: {
        labels: ['Football', 'Basketball', 'Volleyball', 'Chess', 'Swimming', 'Athletics'],
        datasets: [{
          label: 'CS15',
          data: [85, 72, 78, 90, 65, 80],
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37,99,235,0.2)',
        }, {
          label: 'Average',
          data: [70, 68, 72, 75, 70, 72],
          borderColor: '#94a3b8',
          backgroundColor: 'rgba(148,163,184,0.1)',
          borderDash: [5, 5],
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#94a3b8' }, ticks: { color: '#94a3b8', backdropColor: 'transparent' } },
        },
      },
    });
  }
  this._loadStats('sports_admin');
};

// =====================================================================
// SUPER ADMIN - Full initializer with all 10 panels
// =====================================================================
function initSACharts() {
  if (typeof Chart === 'undefined') return;
  const chartDefaults = () => ({
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#94a3b8' } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
    },
  });

  // Overview - Growth chart
  const g = document.getElementById('growthChart');
  if (g) new Chart(g, {
    type: 'line',
    data: {
      labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
      datasets: [
        { label: 'Users', data: [890, 1020, 1150, 950, 1080, 1280], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', fill: true, tension: 0.4 },
        { label: 'Engagement', data: [65, 72, 78, 70, 75, 82], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4, yAxisID: 'y1' },
      ],
    },
    options: { ...chartDefaults(), scales: { ...chartDefaults().scales, y1: { beginAtZero: true, position: 'right', grid: { display: false }, ticks: { color: '#94a3b8', callback: v => v + '%' } } } },
  });

  // Overview - User distribution (doughnut)
  const ud = document.getElementById('userDistChart');
  if (ud) {
    API.getUsers({ per_page: 200 }).then(res => {
      const users = res.users || [];
      const roles = {};
      users.forEach(u => { const r = u.role || 'unknown'; roles[r] = (roles[r] || 0) + 1; });
      if (Object.keys(roles).length === 0) roles['No Data'] = 1;
      new Chart(ud, {
        type: 'doughnut',
        data: { labels: Object.keys(roles), datasets: [{ data: Object.values(roles), backgroundColor: ['#2563EB','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899','#3b82f6','#f97316','#6366f1','#14b8a6'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 12 } } }, cutout: '60%' },
      });
    }).catch(() => {});
  }

  // Overview - Revenue chart
  const r = document.getElementById('revenueChart');
  if (r) new Chart(r, {
    type: 'bar',
    data: { labels: ['Sep','Oct','Nov','Dec','Jan','Feb'], datasets: [{ label: 'Revenue', data: [42000, 38500, 45800, 52000, 49000, 53500], backgroundColor: '#10b981', borderRadius: 6 }] },
    options: { ...chartDefaults(), plugins: { legend: { display: false } }, scales: { ...chartDefaults().scales, y: { ...chartDefaults().scales.y, ticks: { color: '#94a3b8', callback: v => '$' + v.toLocaleString() } } } },
  });

  // Security - Login attempts chart
  const la = document.getElementById('loginAttemptsChart');
  if (la) new Chart(la, {
    type: 'line',
    data: { labels: ['00:00','04:00','08:00','12:00','16:00','20:00','Now'], datasets: [
      { label: 'Failed', data: [23, 45, 89, 156, 234, 178, 89], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 },
      { label: 'Success', data: [120, 98, 234, 345, 456, 312, 156], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4 },
    ]},
    options: chartDefaults(),
  });

  // Analytics - User Growth
  const ug = document.getElementById('userGrowthChart');
  if (ug) new Chart(ug, {
    type: 'line',
    data: { labels: ['Sep','Oct','Nov','Dec','Jan','Feb'], datasets: [{ label: 'Total Users', data: [890, 1020, 1150, 1180, 1220, 1280], borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.1)', fill: true, tension: 0.4 }] },
    options: chartDefaults(),
  });

  // Analytics - Engagement Rate
  const er = document.getElementById('engagementChart');
  if (er) new Chart(er, {
    type: 'line',
    data: { labels: ['Sep','Oct','Nov','Dec','Jan','Feb'], datasets: [{ label: 'Engagement %', data: [65, 72, 78, 70, 75, 82], borderColor: '#8b5cf6', backgroundColor: 'rgba(139,92,246,0.1)', fill: true, tension: 0.4 }] },
    options: { ...chartDefaults(), scales: { ...chartDefaults().scales, y: { ...chartDefaults().scales.y, max: 100, ticks: { color: '#94a3b8', callback: v => v + '%' } } } },
  });

  // Analytics - Login Activity
  const la2 = document.getElementById('loginActivityChart');
  if (la2) new Chart(la2, {
    type: 'bar',
    data: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ label: 'Logins', data: [456, 523, 489, 612, 578, 234, 189], backgroundColor: '#3b82f6', borderRadius: 4 }] },
    options: { ...chartDefaults(), plugins: { legend: { display: false } } },
  });

  // Analytics - Post Activity
  const pa = document.getElementById('postActivityChart');
  if (pa) new Chart(pa, {
    type: 'bar',
    data: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [
      { label: 'Posts Created', data: [4, 7, 3, 8, 5, 2, 1], backgroundColor: '#10b981', borderRadius: 4 },
      { label: 'Comments', data: [23, 45, 34, 56, 42, 18, 12], backgroundColor: '#f59e0b', borderRadius: 4 },
    ]},
    options: chartDefaults(),
  });

  // Analytics - Challenge Participation
  const cp = document.getElementById('challengePartChart');
  if (cp) new Chart(cp, {
    type: 'doughnut',
    data: { labels: ['Participated', 'Completed', 'Not Started'], datasets: [{ data: [68, 22, 10], backgroundColor: ['#3b82f6', '#10b981', '#ef4444'], borderWidth: 0 }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 12 } } }, cutout: '60%' },
  });

  // Analytics - Election Voting Stats
  const ev = document.getElementById('electionVoteChart');
  if (ev) new Chart(ev, {
    type: 'radar',
    data: {
      labels: ['Participation', 'Transparency', 'Fairness', 'Accessibility', 'Security'],
      datasets: [
        { label: 'Current Term', data: [85, 92, 78, 88, 95], borderColor: '#2563EB', backgroundColor: 'rgba(37,99,235,0.2)' },
        { label: 'Previous Term', data: [72, 85, 70, 80, 88], borderColor: '#94a3b8', backgroundColor: 'rgba(148,163,184,0.1)', borderDash: [5, 5] },
      ],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94a3b8' } } },
      scales: { r: { grid: { color: 'rgba(255,255,255,0.05)' }, angleLines: { color: 'rgba(255,255,255,0.05)' }, pointLabels: { color: '#94a3b8' }, ticks: { color: '#94a3b8', backdropColor: 'transparent' } } },
    },
  });
}

let _saUsers = [];
let _saPosts = [];

async function populateUserTable() {
  const tbody = document.getElementById('userTableBody');
  if (!tbody) return;
  const search = (document.getElementById('userSearchInput')?.value || '').toLowerCase();
  const roleFilter = document.getElementById('userRoleFilter')?.value || 'all';
  const statusFilter = document.getElementById('userStatusFilter')?.value || 'all';
  try {
    const res = await API.getUsers({ search, status: statusFilter !== 'all' ? statusFilter : undefined, per_page: 200 });
    let users = res.users || [];
    if (roleFilter !== 'all') {
      users = users.filter(u => {
        if (roleFilter === 'admin') return u.role.includes('admin') || u.role === 'super_admin' || u.role === 'operations_manager' || u.role === 'soc';
        return u.role === roleFilter;
      });
    }
    _saUsers = users;
    document.getElementById('userCountDisplay').textContent = users.length + ' users';
    tbody.innerHTML = users.map(u => `<tr>
      <td>${u.id}</td>
      <td class="text-mono">${u.username}</td>
      <td><div class="d-flex align-items-center gap-2">${u.avatar ? `<img src="${u.avatar}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover">` : `<div class="avatar avatar-sm" style="background:${['#2563EB','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899'][u.id%6]};width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:600;color:#fff">${UI.getInitials(u.name)}</div>`}${u.name}</div></td>
      <td class="text-sm text-tertiary">${u.email}</td>
      <td>${UI.badge((u.role||'').replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase()), u.role&&(u.role.includes('admin')||u.role==='super_admin')?'purple':u.role==='teacher'?'info':u.role==='soc'?'danger':'gray')}</td>
      <td class="text-sm">${u.department || '-'}</td>
      <td>${UI.badge(u.status === 'active' ? 'Active' : 'Suspended', u.status === 'active' ? 'success' : 'danger')}</td>
      <td><div class="d-flex gap-1">
        <button class="btn btn-sm btn-ghost" onclick="promoteUser(${u.id})" title="Change Role"><i class="bi bi-person-badge"></i></button>
        ${u.status === 'active' ? `<button class="btn btn-sm btn-ghost text-warning" onclick="suspendUser(${u.id})" title="Suspend"><i class="bi bi-pause-circle"></i></button>` : `<button class="btn btn-sm btn-ghost text-success" onclick="unsuspendUser(${u.id})" title="Activate"><i class="bi bi-play-circle"></i></button>`}
        <button class="btn btn-sm btn-ghost text-danger" onclick="deleteUser(${u.id})" title="Delete"><i class="bi bi-trash"></i></button>
      </div></td>
    </tr>`).join('');
  } catch(e) { console.error('Failed to load users:', e); if (typeof UI !== 'undefined') UI.showToast('Error', 'Failed to load users: ' + (e.message || 'Unknown error'), 'error'); }
}

function filterUserTable() { populateUserTable(); }

function initAvatarUpload() {
  const input = document.getElementById('overviewAvatarInput');
  if (input) {
    input.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        await API.uploadAvatar(file);
        UI.showToast('Success', 'Profile picture updated!', 'success');
        // Update avatar display in place without full reload
        const newUrl = DB.currentUser?.avatar;
        const container = document.getElementById('overviewAvatar');
        if (container && newUrl) {
          container.innerHTML = `<img src="${newUrl}" alt="" style="width:64px;height:64px;object-fit:cover;border-radius:50%">`;
        }
        const navAvatar = document.querySelector('.navbar-profile-avatar');
        if (navAvatar) {
          navAvatar.innerHTML = `<img src="${newUrl}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
        }
        // Update the profile page avatar if on profile view
        const profileAvatar = document.querySelector('.card.text-center.p-6 .avatar.avatar-xl');
        if (profileAvatar && newUrl) {
          profileAvatar.outerHTML = `<div class="avatar avatar-xl mx-auto" style="width:80px;height:80px;overflow:hidden"><img src="${newUrl}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></div>`;
        }
      } catch (err) {
        UI.showToast('Error', err.message || 'Upload failed', 'error');
      }
    });
  }
}

async function removeDashboardAvatar() {
  if (!confirm('Remove your profile picture?')) return;
  try {
    await API.deleteAvatar();
    // Update DOM in place
    const container = document.getElementById('overviewAvatar');
    if (container) {
      const user = DB.currentUser;
      container.innerHTML = `<div class="avatar avatar-lg" style="background:${UI.getAvatarColor(user?.name||'U')};width:64px;height:64px;font-size:1.2rem">${UI.getInitials(user?.name||'U')}</div>`;
    }
    const navAvatar = document.querySelector('.navbar-profile-avatar');
    if (navAvatar) {
      navAvatar.innerHTML = UI.getInitials(DB.currentUser?.name || 'U');
    }
    // Hide remove button
    const removeBtn = document.querySelector('#profileCard .btn-ghost.text-danger');
    if (removeBtn) removeBtn.style.display = 'none';
    UI.showToast('Success', 'Profile picture removed.', 'info');
  } catch (err) {
    UI.showToast('Error', err.message || 'Failed to remove', 'error');
  }
}

async function populateRoleAssign() {
  const sel = document.getElementById('roleAssignUser');
  if (!sel) return;
  try {
    const res = await API.getUsers({ per_page: 200 });
    _saUsers = res.users || [];
    sel.innerHTML = '<option value="">-- Select User --</option>' + _saUsers.map(u => `<option value="${u.id}">${u.name} (${u.username}) - ${u.role}</option>`).join('');
    const bulk = document.getElementById('bulkUserSelect');
    if (bulk) bulk.innerHTML = _saUsers.map(u => `<option value="${u.id}">${u.name} (${u.username})</option>`).join('');
  } catch(e) { console.error('Failed to load users:', e); }
}

async function assignRole() {
  const userId = parseInt(document.getElementById('roleAssignUser')?.value);
  const newRole = document.getElementById('roleAssignTarget')?.value;
  if (!userId || !newRole) { UI.showToast('Error', 'Please select a user and a role', 'error'); return; }
  const user = _saUsers.find(u => u.id === userId);
  if (!user) { UI.showToast('Error', 'User not found', 'error'); return; }
  const isSuperAdmin = DB.currentUser?.role === 'super_admin';
  if (!isSuperAdmin && ['soc','super_admin'].includes(newRole)) {
    UI.showToast('Error', 'You cannot assign SOC or Super Admin roles', 'error');
    return;
  }
  const oldRole = user.role;
  try {
    await API.assignRole(userId, newRole);
    const histBody = document.getElementById('roleHistoryBody');
    if (histBody) {
      const row = histBody.querySelector('.text-center');
      if (row) histBody.innerHTML = '';
      const uName = DB.currentUser?.name || 'Super Admin';
      histBody.innerHTML = `<tr><td>${user.name}</td><td>${UI.badge(oldRole,'gray')}</td><td>${UI.badge(newRole,'success')}</td><td>${uName}</td><td class="text-xs text-tertiary">${new Date().toLocaleString()}</td></tr>` + histBody.innerHTML;
    }
    await populateRoleAssign();
    await populateUserTable();
    UI.showToast('Role Assigned', `${user.name} is now ${newRole.replace(/_/g,' ')}`, 'success');
  } catch(e) { UI.showToast('Error', e.message || 'Failed to assign role', 'error'); }
}

async function bulkAssignRole() {
  const sel = document.getElementById('bulkUserSelect');
  const role = document.getElementById('bulkRoleTarget')?.value;
  if (!sel || !role) return;
  const ids = Array.from(sel.selectedOptions).map(o => parseInt(o.value));
  if (!ids.length) { UI.showToast('Error', 'Please select at least one user', 'error'); return; }
  let success = 0;
  for (const id of ids) {
    try { await API.assignRole(id, role); success++; } catch(e) {}
  }
  await populateRoleAssign();
  await populateUserTable();
  UI.showToast('Bulk Assign', `Updated ${success}/${ids.length} users to ${role.replace(/_/g,' ')}`, 'success');
}

async function promoteUser(id) {
  const user = _saUsers.find(u => u.id === id);
  if (!user) { UI.showToast('Error', 'User not found', 'error'); return; }
  const isSuperAdmin = DB.currentUser?.role === 'super_admin';
  const allRoles = ['student','teacher','financial_admin','educational_admin','general_admin','monitor_admin','sports_admin','soc','operations_manager'];
  const roles = isSuperAdmin ? allRoles : allRoles.filter(r => r !== 'soc');
  const currentIdx = roles.indexOf(user.role);
  if (currentIdx === -1) { UI.showToast('Error', 'Cannot promote this role further', 'error'); return; }
  const nextRole = roles[(currentIdx + 1) % roles.length];
  try {
    await API.assignRole(id, nextRole);
    UI.showToast('Role Changed', `${user.name}: ${user.role} → ${nextRole}`, 'success');
  } catch(e) { UI.showToast('Error', e.message || 'Failed to change role', 'error'); }
  finally {
    await populateUserTable();
    await populateRoleAssign();
  }
}

async function suspendUser(id) {
  try {
    await API.suspendUser(id);
    await populateUserTable();
    const user = _saUsers.find(u => u.id === id);
    UI.showToast('User Suspended', `${user ? user.name : 'User'} has been suspended`, 'warning');
  } catch(e) { UI.showToast('Error', e.message || 'Failed to suspend user', 'error'); }
}

async function unsuspendUser(id) {
  try {
    await API.restoreUser(id);
    await populateUserTable();
    const user = _saUsers.find(u => u.id === id);
    UI.showToast('User Activated', `${user ? user.name : 'User'} has been reactivated`, 'success');
  } catch(e) { UI.showToast('Error', e.message || 'Failed to reactivate user', 'error'); }
}

async function deleteUser(id) {
  if (id === DB.currentUser?.id) { UI.showToast('Error', 'You cannot delete yourself', 'error'); return; }
  try {
    await API.deleteUser(id);
    await populateUserTable();
    await populateRoleAssign();
    UI.showToast('User Deleted', 'User has been removed', 'info');
  } catch(e) { UI.showToast('Error', e.message || 'Failed to delete user', 'error'); }
}

// ===== MEMBER DIRECTORY (admin CRUD) =====

let _memberDir = { page: 1, per_page: 50, search: '', status: '', source: '', linked: '', sort: 'name' };
let _memberDirUsers = [];

async function loadMemberDirectory() {
  const root = document.getElementById('memberDirectoryRoot');
  if (!root) return;
  root.innerHTML = '<div class="d-flex justify-between align-items-center mb-4"><div class="text-sm text-tertiary">Loading member directory\u2026</div></div>';
  try {
    if (!_memberDirUsers.length) {
      const u = await API.getUsers({ per_page: 200 });
      _memberDirUsers = u.users || u.items || [];
    }
    root.innerHTML = memberDirShell();
    await memberDirRefresh();
  } catch (e) {
    root.innerHTML = '<div class="text-center text-danger py-5">Failed to load member directory: ' + UI.escape(e.message) + '</div>';
  }
}

function memberDirShell() {
  const s = (filter, id, label) => `<option value="">${label}</option>${filter.map(v => `<option value="${UI.escape(v)}"${_memberDir[id] === v ? ' selected' : ''}>${UI.escape(v)}</option>`).join('')}`;
  return `
    <div class="d-flex justify-between align-items-center mb-4 flex-wrap gap-3">
      <div>
        <h4 class="fw-bold mb-1">Member Directory</h4>
        <p class="text-sm text-tertiary">Browse, search, and manage every member profile — roster entries, student submissions, and admins.</p>
      </div>
      <div class="d-flex gap-2">
        <span class="badge badge-primary" id="mdStatTotal">-</span>
        <span class="badge badge-success" id="mdStatRoster">-</span>
        <button class="badge badge-warning" id="mdStatPending" style="cursor:pointer" onclick="memberDirGotoPending()" title="Show pending requests">-</button>
        <span class="badge badge-info" id="mdStatVerified">-</span>
        <button class="btn btn-sm btn-ghost" onclick="loadMemberDirectory()" title="Refresh"><i class="bi bi-arrow-clockwise"></i></button>
        <button class="btn btn-primary btn-sm" onclick="memberDirEdit()"><i class="bi bi-person-plus"></i> Add member</button>
      </div>
    </div>
    <div class="card mb-4">
      <div class="p-4">
        <div class="d-flex gap-2 flex-wrap align-items-center">
          <div class="directory-search" style="flex:1;min-width:220px">
            <i class="bi bi-search"></i>
            <input type="text" id="memberDirSearch" placeholder="Search name, email, skill, interest..." value="${UI.escape(_memberDir.search)}" oninput="memberDirSearchDebounced(this.value)">
          </div>
          <select class="form-select" id="memberDirStatus" style="min-width:140px" onchange="_memberDir.status=this.value;_memberDir.page=1;memberDirRefresh()">
            <option value="">All statuses</option>
            ${['approved','pending','rejected'].map(v => `<option value="${v}"${_memberDir.status === v ? ' selected' : ''}>${v[0].toUpperCase() + v.slice(1)}</option>`).join('')}
          </select>
          <select class="form-select" id="memberDirSource" style="min-width:140px" onchange="_memberDir.source=this.value;_memberDir.page=1;memberDirRefresh()">
            <option value="">All sources</option>
            ${['roster','self','admin'].map(v => `<option value="${v}"${_memberDir.source === v ? ' selected' : ''}>${v[0].toUpperCase() + v.slice(1)}</option>`).join('')}
          </select>
          <select class="form-select" id="memberDirLinked" style="min-width:150px" onchange="_memberDir.linked=this.value;_memberDir.page=1;memberDirRefresh()">
            <option value="">All linked status</option>
            <option value="linked"${_memberDir.linked === 'linked' ? ' selected' : ''}>Has account</option>
            <option value="unlinked"${_memberDir.linked === 'unlinked' ? ' selected' : ''}>No account</option>
          </select>
          <button class="btn btn-sm btn-ghost" onclick="memberDirResetFilters()"><i class="bi bi-arrow-counterclockwise"></i> Reset</button>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="table-container">
        <table class="table table-sm">
          <thead><tr><th>Member</th><th>Level</th><th>Term</th><th>Source</th><th>Status</th><th>Account</th><th>Skills</th><th>Actions</th></tr></thead>
          <tbody id="memberDirBody"><tr><td colspan="8" class="text-center text-tertiary py-4">Loading\u2026</td></tr></tbody>
        </table>
      </div>
      <div class="d-flex justify-between align-items-center p-3" id="memberDirPager" style="display:none">
        <span class="text-sm text-tertiary" id="memberDirInfo"></span>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-ghost" onclick="_memberDir.page--;memberDirRefresh()" id="mdPrev">Prev</button>
          <button class="btn btn-sm btn-ghost" onclick="_memberDir.page++;memberDirRefresh()" id="mdNext">Next</button>
        </div>
      </div>
    </div>
  `;
}

function memberDirSearchDebounced(value) {
  clearTimeout(_memberDir._t);
  _memberDir._t = setTimeout(() => { _memberDir.search = value.trim(); _memberDir.page = 1; memberDirRefresh(); }, 350);
}

function memberDirResetFilters() {
  _memberDir.search = ''; _memberDir.status = ''; _memberDir.source = ''; _memberDir.linked = ''; _memberDir.page = 1;
  const root = document.getElementById('memberDirectoryRoot');
  if (root) { root.innerHTML = memberDirShell(); }
  memberDirRefresh();
}

async function memberDirRefresh() {
  const tbody = document.getElementById('memberDirBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="8" class="text-center text-tertiary py-4">Loading\u2026</td></tr>';
  const params = { page: _memberDir.page, per_page: _memberDir.per_page, sort: _memberDir.sort === 'recent' ? 'recent' : undefined };
  if (_memberDir.search) params.search = _memberDir.search;
  if (_memberDir.status) params.status = _memberDir.status;
  if (_memberDir.source) params.source = _memberDir.source;
  if (_memberDir.linked === 'linked') params.has_account = '1';
  if (_memberDir.linked === 'unlinked') params.has_account = '0';
  try {
    const res = await API.getMembers(params);
    const members = res.members || res.items || [];
    const total = res.total || members.length;
    memberDirStats();
    if (!members.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-tertiary py-4">No members found.</td></tr>';
      return;
    }
    tbody.innerHTML = members.map(mdRow).join('');
    const pager = document.getElementById('memberDirPager');
    if (pager) {
      pager.style.display = '';
      const info = document.getElementById('memberDirInfo');
      if (info) info.textContent = `Showing ${Math.min((_memberDir.page - 1) * _memberDir.per_page + 1, total)}–${Math.min(_memberDir.page * _memberDir.per_page, total)} of ${total}`;
      document.getElementById('mdPrev').disabled = _memberDir.page <= 1;
      document.getElementById('mdNext').disabled = _memberDir.page * _memberDir.per_page >= total;
    }
  } catch (e) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger py-4">Error: ' + UI.escape(e.message) + '</td></tr>';
  }
}

function mdRow(m) {
  const name = m.full_name || [m.first_name, m.middle_name, m.last_name, m.username].filter(Boolean).join(' ') || ('Member #' + m.id);
  const skillsArr = m.skills ? m.skills.split('\n').filter(Boolean) : [];
  const statusBadge = { approved: 'success', pending: 'warning', rejected: 'danger' }[m.status] || 'gray';
  const actionBtns =
    '<button class="btn btn-sm btn-secondary" onclick="memberDirEdit(' + m.id + ')" title="Edit"><i class="bi bi-pencil"></i></button>' +
    (m.status === 'pending' ? '<button class="btn btn-sm btn-success" onclick="approveMemberProfile(' + m.id + ')" title="Approve"><i class="bi bi-check-lg"></i></button><button class="btn btn-sm btn-danger" onclick="rejectMemberProfile(' + m.id + ')" title="Reject"><i class="bi bi-x-lg"></i></button>' : '') +
    '<button class="btn btn-sm btn-danger" onclick="memberDirDelete(' + m.id + ',\'' + UI.escape(name).replace(/'/g, "\\'") + '\')" title="Delete"><i class="bi bi-trash"></i></button>';
  return '<tr>' +
    '<td><div class="d-flex align-items-center gap-2"><div class="md-avatar" style="background:' + mdGradient(name) + '">' + UI.getInitials(name) + '</div><div><div class="fw-semibold text-sm">' + UI.escape(name) + '</div><div class="text-xs text-tertiary">#' + m.id + (m.email ? ' · ' + UI.escape(m.email) : '') + '</div></div></div></td>' +
    '<td>' + UI.escape(m.level || '-') + '</td>' +
    '<td class="text-xs text-tertiary">' + ([m.year, m.semester].filter(Boolean).join(' ') || '-') + '</td>' +
    '<td>' + UI.escape(m.source || '-') + '</td>' +
    '<td>' + UI.badge(m.status, statusBadge) + '</td>' +
    '<td>' + (m.has_account ? '<span class="badge badge-info"><i class="bi bi-patch-check"></i> ' + UI.escape(m.username || 'linked') + '</span>' : '<span class="text-xs text-tertiary">no account</span>') + '</td>' +
    '<td class="text-xs text-secondary">' + (skillsArr.length ? UI.escape(skillsArr.slice(0, 2).join(', ')) + (skillsArr.length > 2 ? ' +' + (skillsArr.length - 2) : '') : '-') + '</td>' +
    '<td><div class="d-flex gap-1">' + actionBtns + '</div></td>' +
  '</tr>';
}

async function memberDirStats() {
  try {
    const [t, r, p, v] = await Promise.all([
      API.getMembers({ per_page: 1 }),
      API.getMembers({ source: 'roster', per_page: 1 }),
      API.getMembers({ status: 'pending', per_page: 1 }),
      API.getMembers({ has_account: '1', per_page: 1 }),
    ]);
    const set = (id, label, value) => { const el = document.getElementById(id); if (el) el.textContent = label + ' ' + value; };
    set('mdStatTotal', 'Total', t.total || 0);
    set('mdStatRoster', 'Roster', r.total || 0);
    set('mdStatPending', 'Pending', p.total || 0);
    set('mdStatVerified', 'Verified', v.total || 0);
  } catch (e) {}
}

function mdGradient(name) {
  const palettes = ['#2563EB', '#7c3aed', '#0d9488', '#dc2626', '#db2777', '#059669', '#ea580c', '#4f46e5'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
}

function memberDirGotoPending() {
  switchSuperAdminPanel('members');
  setTimeout(() => {
    const sel = document.getElementById('memberDirStatus');
    if (sel) {
      sel.value = 'pending';
      _memberDir.status = 'pending';
      _memberDir.page = 1;
      memberDirRefresh();
    }
  }, 80);
}

function memberDirEdit(id) {
  const modal = (m) => {
    const field = (fid, label, value, ph, extra) => `
      <div class="form-group">
        <label class="form-label">${label}</label>
        <input class="form-input" id="${fid}" value="${UI.escape(value || '')}" placeholder="${ph || ''}" ${extra || ''}>
      </div>`;
    const area = (fid, label, value, ph) => `
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">${label}</label>
        <textarea class="form-textarea" id="${fid}" rows="2" placeholder="${ph || ''}">${UI.escape(value || '')}</textarea>
      </div>`;
    const usersOps = '<option value="">— no account —</option>' + _memberDirUsers.map(u => `<option value="${u.id}"${m && m.user_id == u.id ? ' selected' : ''}>${UI.escape(u.full_name || u.username || u.email)} (${UI.escape(u.role_slug || 'user')})</option>`).join('');
    const body = `
      <p class="text-sm text-tertiary mb-3">${m ? 'Edit member #' + m.id : 'Add a member to the directory. Link an account to mark it verified.'}</p>
      <div class="form-grid">
        ${field('mdFirst', 'First name *', m && m.first_name, 'First name')}
        ${field('mdMiddle', 'Middle name', m && m.middle_name, 'Middle name')}
        ${field('mdLast', 'Last name *', m && m.last_name, 'Last name')}
        ${field('mdEmailContact', 'Contact email', m && m.email_contact, 'me@example.com')}
        <div class="form-group"><label class="form-label">Level / tag</label><input class="form-input" id="mdLevel" value="${UI.escape((m && m.level) || '')}" placeholder="e.g. All rounder, Full-stack"></div>
        <div class="form-group" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <div><label class="form-label">Year</label><input class="form-input" id="mdYear" value="${UI.escape((m && m.year) || '')}" placeholder="Year 3"></div>
          <div><label class="form-label">Semester</label><input class="form-input" id="mdSemester" value="${UI.escape((m && m.semester) || '')}" placeholder="Semester 5"></div>
        </div>
        ${area('mdBio', 'Bio', m && m.bio, 'Short professional bio')}
        ${area('mdSkills', 'Skills / focus areas (one per line)', m && m.skills, 'JavaScript\nUI/UX')}
        ${area('mdInterests', 'Interests (one per line)', m && m.interests, 'Cybersecurity\nPhotography')}
        ${area('mdLanguages', 'Languages (one per line)', m && m.languages, 'Somali\nEnglish')}
        ${area('mdCerts', 'Certificates (one per line)', m && m.certificates, 'Cisco CCNA')}
        ${field('mdWebsite', 'Website', m && m.website, 'https://…')}
        ${field('mdGithub', 'GitHub', m && m.github, 'username or URL')}
        ${field('mdLinkedin', 'LinkedIn', m && m.linkedin, 'username or URL')}
        ${field('mdTwitter', 'X / Twitter', m && m.twitter, 'username or URL')}
        ${field('mdFacebook', 'Facebook', m && m.facebook, 'username or URL')}
        ${field('mdInstagram', 'Instagram', m && m.instagram, 'username or URL')}
        <div class="form-group"><label class="form-label">Status</label><select class="form-select" id="mdStatus">${['approved','pending','rejected'].map(s => `<option value="${s}"${m && m.status === s ? ' selected' : ''}>${s[0].toUpperCase() + s.slice(1)}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Source</label><select class="form-select" id="mdSource">${['self','roster','admin'].map(s => `<option value="${s}"${m && m.source === s ? ' selected' : ''}>${s[0].toUpperCase() + s.slice(1)}</option>`).join('')}</select></div>
        <div class="form-group" style="grid-column:1/-1"><label class="form-label">Linked account</label><select class="form-select" id="mdLink">${usersOps}</select></div>
        ${m && m.picture_url ? `<div class="form-group" style="grid-column:1/-1"><label class="form-label">Current picture</label><img src="${UI.escape(m.picture_url)}" alt="avatar" style="width:56px;height:56px;border-radius:50%;object-fit:cover;border:1px solid var(--border-primary)"></div>` : ''}
        <div class="form-group" style="grid-column:1/-1"><label class="form-label">Picture (JPG/PNG/WebP, max 2MB)</label><input type="file" class="form-input" id="mdPicture" accept="image/jpeg,image/png,image/gif,image/webp"></div>
        <input type="hidden" id="mdHiddenId" value="${m ? m.id : ''}">
      </div>`;
    const footer = `
      <button class="btn btn-secondary" onclick="UI.closeModal()">Cancel</button>
      <button class="btn btn-primary" onclick="memberDirSave()"><i class="bi bi-check-lg"></i> ${m ? 'Save Changes' : 'Add Member'}</button>`;
    UI.showModal((m ? 'Edit member' : 'Add member'), body, footer);
  };
  if (id) {
    API.getMember(id).then(r => modal(r.member || r)).catch(e => UI.showToast('Error', e.message || 'Failed to load member', 'error'));
  } else {
    modal(null);
  }
}

async function memberDirSave() {
  const val = idv => { const el = document.getElementById(idv); return el ? el.value : ''; };
  const first = val('mdFirst').trim();
  const last = val('mdLast').trim();
  if (!first || !last) { UI.showToast('Error', 'First and last name are required.', 'error'); return; }
  const pick = (v) => { v = v.trim(); return v === '' ? null : v; };
  let id = parseInt(val('mdHiddenId') || '0', 10);
  const payload = {
    first_name: first,
    middle_name: pick(val('mdMiddle')) ,
    last_name: last,
    email_contact: pick(val('mdEmailContact')),
    level: pick(val('mdLevel')),
    year: pick(val('mdYear')),
    semester: pick(val('mdSemester')),
    bio: pick(val('mdBio')),
    skills: pick(val('mdSkills')),
    interests: pick(val('mdInterests')),
    languages: pick(val('mdLanguages')),
    certificates: pick(val('mdCerts')),
    website: pick(val('mdWebsite')),
    github: pick(val('mdGithub')),
    linkedin: pick(val('mdLinkedin')),
    twitter: pick(val('mdTwitter')),
    facebook: pick(val('mdFacebook')),
    instagram: pick(val('mdInstagram')),
    status: val('mdStatus'),
    source: val('mdSource'),
    link_user_id: val('mdLink'),
  };
  const fileEl = document.getElementById('mdPicture');
  try {
    const res = id ? await API.updateMember(id, payload) : await API.createMember(payload);
    const saved = res.member || res;
    id = saved.id;
    if (fileEl && fileEl.files && fileEl.files[0]) {
      await API.uploadMemberPicture(id, fileEl.files[0]);
    }
    UI.showToast('Saved', id ? 'Member updated in the directory.' : 'Member added to the directory.', 'success');
    UI.closeModal();
    loadMemberDirectory();
  } catch (e) {
    const msg = (e.errors && Object.keys(e.errors).length) ? Object.values(e.errors)[0][0] : (e.message || 'Failed to save member');
    UI.showToast('Error', msg, 'error');
  }
}

function memberDirDelete(id, name) {
  if (!confirm('Delete "' + (name || 'this member') + '"? This removes their directory entry permanently.')) return;
  API.deleteMember(id)
    .then(() => { UI.showToast('Deleted', 'Member removed from the directory.', 'info'); memberDirRefresh(); memberDirStats(); })
    .catch(e => UI.showToast('Error', e.message || 'Failed to delete member', 'error'));
}

// Backwards-compatible alias used by approve/reject flows and old entry points
async function loadMemberApprovals() {
  await loadMemberDirectory();
}

async function approveMemberProfile(id) {
  try {
    await API.approveMember(id);
    UI.showToast('Approved', 'Member profile approved successfully', 'success');
    await loadMemberApprovals();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to approve profile', 'error');
  }
}

async function rejectMemberProfile(id) {
  const reason = prompt('Enter rejection reason (optional):');
  if (reason === null) return; // user cancelled
  try {
    await API.rejectMember(id, reason || '');
    UI.showToast('Rejected', 'Member profile has been rejected', 'info');
    await loadMemberApprovals();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to reject profile', 'error');
  }
}

async function populateContentTable() {
  const tbody = document.getElementById('contentTableBody');
  if (!tbody) return;
  const search = (document.getElementById('contentSearchInput')?.value || '').toLowerCase();
  const typeFilter = document.getElementById('contentTypeFilter')?.value || 'all';
  const statusFilter = document.getElementById('contentStatusFilter')?.value || 'all';
  try {
    const params = { per_page: 200 };
    if (typeFilter !== 'all') params.type = typeFilter;
    if (statusFilter !== 'all') params.status = statusFilter;
    if (search) params.search = search;
    const res = await API.getPosts(params);
    let posts = res.items || [];
    _saPosts = posts;
    const postCount = document.getElementById('postCountDisplay') || document.querySelector('#panel-content .text-sm.text-tertiary');
    if (postCount) postCount.textContent = (res.total || posts.length) + ' total posts';
    tbody.innerHTML = posts.map(p => `<tr>
      <td>${p.id}</td>
      <td><span class="fw-medium">${p.title}</span></td>
      <td>${UI.badge((p.post_type||p.type||'').charAt(0).toUpperCase() + (p.post_type||p.type||'').slice(1), (p.post_type||p.type) === 'announcement' ? 'info' : (p.post_type||p.type) === 'blog' ? 'purple' : (p.post_type||p.type) === 'resource' ? 'success' : (p.post_type||p.type) === 'challenge' ? 'warning' : (p.post_type||p.type) === 'project' ? 'primary' : 'gray')}</td>
      <td class="text-sm">${p.author_name || p.author || 'Unknown'}</td>
      <td>${UI.badge((p.status||'draft').charAt(0).toUpperCase() + (p.status||'draft').slice(1), (p.status||'draft') === 'published' ? 'success' : 'warning')}</td>
      <td class="text-sm">${p.views || p.view_count || 0}</td>
      <td class="text-sm text-tertiary">${p.created_at || p.publishedAt ? new Date(p.created_at || p.publishedAt).toLocaleDateString() : '-'}</td>
      <td><div class="d-flex gap-1">
        <button class="btn btn-sm btn-ghost" onclick="editPost(${p.id})" title="Edit"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-ghost text-danger" onclick="deletePost(${p.id})" title="Delete"><i class="bi bi-trash"></i></button>
      </div></td>
    </tr>`).join('');
  } catch(e) { console.error('Failed to load content:', e); }
}

function filterContentTable() { populateContentTable(); }

function editPost(id) {
  const post = _saPosts.find(p => p.id === id);
  if (!post) { UI.showToast('Error', 'Post not found', 'error'); return; }
  UI.showModal('Edit Post', `
    <div class="d-flex flex-column gap-3">
      <div><label class="text-sm fw-medium mb-1">Title</label><input type="text" class="form-control" id="editPostTitle" value="${post.title}"></div>
      <div><label class="text-sm fw-medium mb-1">Status</label>
        <select class="form-select" id="editPostStatus">
          <option value="published" ${post.status==='published'?'selected':''}>Published</option>
          <option value="draft" ${post.status==='draft'?'selected':''}>Draft</option>
          <option value="archived" ${post.status==='archived'?'selected':''}>Archived</option>
        </select>
      </div>
    </div>`,
    `<button class="btn btn-primary" onclick="savePostEdit(${id})">Save Changes</button>`
  );
}

async function savePostEdit(id) {
  const title = document.getElementById('editPostTitle')?.value;
  const status = document.getElementById('editPostStatus')?.value;
  if (!title) { UI.showToast('Error', 'Title is required', 'error'); return; }
  try {
    await API.updatePost(id, { title, status });
    UI.closeModal();
    await populateContentTable();
    UI.showToast('Post Updated', 'Content has been updated successfully', 'success');
  } catch(e) { UI.showToast('Error', e.message || 'Failed to update post', 'error'); }
}

async function deletePost(id) {
  try {
    await API.deletePost(id);
    await populateContentTable();
    UI.showToast('Post Deleted', 'Content has been deleted', 'info');
  } catch(e) { UI.showToast('Error', e.message || 'Failed to delete post', 'error'); }
}

async function populateAuditLogs() {
  const tbody = document.getElementById('auditTableBody');
  if (!tbody) return;
  const search = (document.getElementById('auditSearchInput')?.value || '').toLowerCase();
  const actionFilter = document.getElementById('auditActionFilter')?.value || 'all';
  const userFilter = document.getElementById('auditUserFilter')?.value || 'all';
  try {
    const params = {};
    if (actionFilter !== 'all') params.action = actionFilter;
    if (userFilter !== 'all') params.user_id = parseInt(userFilter);
    const res = await API.getActivityLogs(params);
    let logs = res.logs || res.data || [];
    if (search) {
      logs = logs.filter(l => {
        const userName = l.user_name || l.user || '';
        const action = l.action || '';
        const target = l.target || l.entity_type || '';
        const ip = l.ip_address || l.ip || '';
        return userName.toLowerCase().includes(search) || action.toLowerCase().includes(search) || target.toLowerCase().includes(search) || ip.includes(search);
      });
    }
    tbody.innerHTML = logs.slice(0, 50).map(l => `<tr>
      <td class="text-xs text-tertiary">${l.id}</td>
      <td>${l.user_name || l.user || 'System'}</td>
      <td>${UI.badge((l.action||'').replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()), (l.action||'').includes('login') ? 'success' : (l.action||'').includes('logout') ? 'gray' : (l.action||'').includes('role') ? 'purple' : (l.action||'').includes('edit') ? 'info' : (l.action||'').includes('delete') ? 'danger' : 'warning')}</td>
      <td class="text-sm">${l.target || l.entity_type || '-'}</td>
      <td class="text-xs text-mono text-tertiary">${l.ip_address || l.ip || '-'}</td>
      <td class="text-xs text-tertiary">${l.created_at ? new Date(l.created_at).toLocaleString() : '-'}</td>
    </tr>`).join('');
  } catch(e) { console.error('Failed to load audit logs:', e); }
}

function filterAuditLogs() { populateAuditLogs(); }

async function populateAuditUserFilter() {
  const sel = document.getElementById('auditUserFilter');
  if (!sel) return;
  try {
    const res = await API.getUsers({ per_page: 200 });
    const users = res.users || [];
    sel.innerHTML = '<option value="all">All Users</option>' + users.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
  } catch(e) { console.error('Failed to load users:', e); }
}

function switchSuperAdminPanel(panel) {
  console.log('[SA] switchSuperAdminPanel called:', panel);
  window._saPanel = panel;
  document.querySelectorAll('.sa-panel').forEach(p => p.style.display = 'none');
  let target = document.getElementById('panel-' + panel);
  console.log('[SA] panel element:', target ? target.id : 'NOT FOUND');
  // Lazily inject panels for non-default admin roles
  if (!target && panel === 'financial') {
    const container = document.getElementById('sa-panel-container');
    if (container) {
      const role = DB.currentUser?.role;
      const canSubmit = role === 'admin_financial' || role === 'super_admin';
      container.insertAdjacentHTML('beforeend', `
        <div class="sa-panel" id="panel-financial">
          <div class="d-flex justify-between items-center mb-4">
            <div><h4 class="fw-bold">Financial Management System</h4><p class="text-sm text-tertiary">Monthly student payment tracking</p></div>
            <div class="d-flex gap-2">
              <button class="btn btn-secondary btn-sm" onclick="refreshFinancialPanel()"><i class="bi bi-arrow-clockwise"></i> Refresh</button>
              ${canSubmit ? '<button class="btn btn-primary btn-sm" onclick="showCreateMonthModal()"><i class="bi bi-plus-lg"></i> Create New Record</button>' : ''}
            </div>
          </div>
          <div class="grid-4 mb-4" id="financialSummaryCards">
            <div class="stat-card"><div class="stat-card-icon blue"><i class="bi bi-calendar-month"></i></div><div><div class="stat-card-label">Active Month</div><div class="stat-card-value" id="finActiveMonth">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon green"><i class="bi bi-people"></i></div><div><div class="stat-card-label">Total Students</div><div class="stat-card-value" id="finTotalStudents">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon success"><i class="bi bi-check-circle"></i></div><div><div class="stat-card-label">Paid</div><div class="stat-card-value" id="finPaidCount">-</div></div></div>
            <div class="stat-card"><div class="stat-card-icon red"><i class="bi bi-x-circle"></i></div><div><div class="stat-card-label">Unpaid</div><div class="stat-card-value" id="finUnpaidCount">-</div></div></div>
          </div>
          <div class="card">
            <div class="card-header">
              <h5 class="card-title">Monthly Records</h5>
              <div class="d-flex gap-2">
                <input type="text" class="form-input" id="finSearchInput" placeholder="Search student..." style="width:200px" oninput="filterFinancialStudents()">
                <label class="d-flex items-center gap-1 text-sm" style="cursor:pointer"><input type="checkbox" id="finShowUnpaidOnly" onchange="filterFinancialStudents()"> Show unpaid only</label>
              </div>
            </div>
            <div id="financialRecordsContainer"><div class="text-center text-tertiary p-4">Loading records...</div></div>
          </div>
          <div class="card mt-4" id="financialStudentCard" style="display:none">
            <div class="card-header">
              <h5 class="card-title" id="finSelectedMonth">Students</h5>
              <div class="d-flex gap-2">
                ${canSubmit ? '<button class="btn btn-success btn-sm" id="finSubmitBtn" onclick="submitFinancialMonth()"><i class="bi bi-check2-square"></i> Submit Month Report</button>' : ''}
                <button class="btn btn-info btn-sm" onclick="exportFinancialPdf()"><i class="bi bi-filetype-pdf"></i> PDF</button>
                <button class="btn btn-secondary btn-sm" onclick="exportFinancialCsv()"><i class="bi bi-file-earmark-spreadsheet"></i> CSV</button>
              </div>
            </div>
            <div class="table-container">
              <table class="table table-sm" id="finStudentTable">
                <thead><tr><th>#</th><th>Student Name</th><th>Student ID</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
                <tbody id="finStudentBody"></tbody>
              </table>
            </div>
          </div>
        </div>
      `);
      target = document.getElementById('panel-financial');
      // Load financial data
      loadFinancialRecords();
    }
  }
  if (target) {
    target.style.display = 'block';
    console.log('[SA] panel shown:', panel);
  }
  if (panel === 'quiz-manage') { console.log('[SA] calling loadQuizManagePanel'); loadQuizManagePanel(); }
  if (panel === 'video-courses') { console.log('[SA] calling loadVideoCoursesPanel'); loadVideoCoursesPanel(); }
  if (panel === 'lessons') { loadEdLessons(); }
  // Update sidebar active states
  document.querySelectorAll('#appSidebar .sidebar-item').forEach(el => {
    const onclick = el.getAttribute('onclick') || '';
    el.classList.toggle('active', onclick.includes("'" + panel + "'"));
  });
}

// ===== QUIZ MANAGE PANEL =====
let _quizManageData = [];
async function loadQuizManagePanel() {
  console.log('[QUIZ] loadQuizManagePanel called');
  const tbody = document.getElementById('quizManageBody');
  console.log('[QUIZ] tbody:', !!tbody);
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" class="text-center text-tertiary py-4">Loading...</td></tr>';
  try {
    const skills = AppPages._quizSkills || [];
    const bank = AppPages._quizBank || {};
    _quizManageData = skills.map(sk => ({
      id: sk.id,
      name: sk.name,
      icon: sk.icon,
      desc: sk.desc,
      count: sk.count,
      category: 'Quiz',
      question_count: bank[sk.id] ? bank[sk.id].length : 0
    }));
    document.getElementById('qmAmtSkills').textContent = _quizManageData.length;
    const totalQ = _quizManageData.reduce((s, sk) => s + sk.question_count, 0);
    document.getElementById('qmAmtQuestions').textContent = totalQ;
    document.getElementById('qmAmtPlayers').textContent = '—';
    document.getElementById('qmAmtQuizzes').textContent = '—';
    renderQuizManageTable(_quizManageData);
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4">' + (e.message || 'Failed to load') + '</td></tr>';
  }
}
function renderQuizManageTable(skills) {
  console.log('[QUIZ] renderQuizManageTable called, skills count:', skills.length);
  const tbody = document.getElementById('quizManageBody');
  if (!tbody) { console.error('[QUIZ] renderQuizManageTable: tbody NOT FOUND'); return; }
  if (!skills.length) { tbody.innerHTML = '<tr><td colspan="6" class="text-center text-tertiary py-4">No skills found</td></tr>'; return; }
  tbody.innerHTML = skills.map(sk => `<tr>
      <td class="fw-medium">${sk.icon || ''} ${sk.name || '—'}</td>
      <td class="text-sm">${sk.category || '—'}</td>
      <td><span class="badge badge-info">${sk.question_count}</span></td>
      <td><span class="badge badge-success">Active</span></td>
      <td><span class="badge badge-success">Active</span></td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn btn-sm btn-ghost" onclick="editQuizSkill('${sk.id}')" title="Edit"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-ghost" onclick="viewQuizQuestions('${sk.id}')" title="Questions"><i class="bi bi-list-ul"></i></button>
        </div>
      </td>
    </tr>`).join('');
}
function filterQuizManage() {
  const q = (document.getElementById('quizManageSearch')?.value || '').toLowerCase();
  const filtered = _quizManageData.filter(sk => (sk.name || '').toLowerCase().includes(q));
  renderQuizManageTable(filtered);
}
function editQuizSkill(id) {
  console.log('[QUIZ] editQuizSkill called:', id);
  const bank = AppPages._quizBank || {};
  const questions = bank[id] || [];
  const skill = (AppPages._quizSkills || []).find(s => s.id === id);
  console.log('[QUIZ] skill found:', !!skill, 'questions:', questions.length);
  const card = document.getElementById('quizEditCard');
  const title = document.getElementById('quizEditTitle');
  const content = document.getElementById('quizEditContent');
  console.log('[QUIZ] card:', !!card, 'content:', !!content);
  if (!card || !content) { console.error('[QUIZ] editQuizSkill: missing DOM elements - card:', !!card, 'content:', !!content); return; }
  card.style.display = 'block';
  title.textContent = 'Edit Skill: ' + (skill?.name || id);
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  content.innerHTML = `
    <div class="d-flex flex-column gap-3">
      <div class="d-flex gap-2">
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Skill Name</label><input class="form-input" id="qzSkillName" value="${skill?.name || ''}"></div>
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Icon (emoji)</label><input class="form-input" id="qzSkillIcon" value="${skill?.icon || ''}"></div>
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Description</label><input class="form-input" id="qzSkillDesc" value="${skill?.desc || ''}"></div>
      </div>
      <button class="btn btn-primary btn-sm" style="width:fit-content" onclick="saveQuizSkill('${id}')"><i class="bi bi-check-lg"></i> Save Changes</button>
      <h6 class="mt-2">Questions (${questions.length})</h6>
      <div id="qzQuestionsList" class="d-flex flex-column gap-2" style="max-height:300px;overflow-y:auto">
        ${questions.map((q, i) => `
          <div class="d-flex gap-2 items-center p-2" style="background:var(--bg-secondary);border-radius:var(--radius-sm)">
            <span class="text-sm text-tertiary" style="min-width:24px">#${i + 1}</span>
            <span class="text-sm" style="flex:1">${q.q}</span>
            <span class="badge badge-${q.correct === 0 ? 'success' : 'info'}" style="font-size:0.7rem">${q.opts[q.correct] || ''}</span>
            <button class="btn btn-xs btn-ghost text-danger" onclick="deleteQuizQuestion('${id}',${i})"><i class="bi bi-trash"></i></button>
          </div>
        `).join('')}
      </div>
      <div class="d-flex gap-2 mt-2">
        <input class="form-input" id="qzNewQ" placeholder="New question..." style="flex:2">
        <input class="form-input" id="qzNewOptA" placeholder="Option A (correct)" style="flex:1">
        <input class="form-input" id="qzNewOptB" placeholder="Option B" style="flex:1">
        <input class="form-input" id="qzNewOptC" placeholder="Option C" style="flex:1">
        <input class="form-input" id="qzNewOptD" placeholder="Option D" style="flex:1">
        <button class="btn btn-success btn-sm" onclick="addQuizQuestion('${id}')"><i class="bi bi-plus-lg"></i></button>
      </div>
    </div>`;
}
function saveQuizSkill(id) {
  const skill = (AppPages._quizSkills || []).find(s => s.id === id);
  if (skill) {
    skill.name = document.getElementById('qzSkillName')?.value || skill.name;
    skill.icon = document.getElementById('qzSkillIcon')?.value || skill.icon;
    skill.desc = document.getElementById('qzSkillDesc')?.value || skill.desc;
  }
  UI.showToast('Quiz Skill Updated', 'Skill details saved locally.', 'success');
}
function addQuizQuestion(skillId) {
  const q = document.getElementById('qzNewQ')?.value?.trim();
  const opts = [
    document.getElementById('qzNewOptA')?.value?.trim(),
    document.getElementById('qzNewOptB')?.value?.trim(),
    document.getElementById('qzNewOptC')?.value?.trim(),
    document.getElementById('qzNewOptD')?.value?.trim(),
  ];
  if (!q || opts.some(o => !o)) { UI.showToast('Error', 'Fill in all fields', 'error'); return; }
  if (!AppPages._quizBank) AppPages._quizBank = {};
  if (!AppPages._quizBank[skillId]) AppPages._quizBank[skillId] = [];
  AppPages._quizBank[skillId].push({ q, opts, correct: 0 });
  UI.showToast('Question Added', 'New question added to ' + skillId, 'success');
  viewQuizQuestions(skillId);
  const idx = _quizManageData.findIndex(s => s.id === skillId);
  if (idx >= 0) _quizManageData[idx].question_count = AppPages._quizBank[skillId].length;
  renderQuizManageTable(_quizManageData);
}
function deleteQuizQuestion(skillId, idx) {
  if (!AppPages._quizBank?.[skillId]) return;
  AppPages._quizBank[skillId].splice(idx, 1);
  UI.showToast('Question Deleted', 'Question removed', 'success');
  viewQuizQuestions(skillId);
  const si = _quizManageData.findIndex(s => s.id === skillId);
  if (si >= 0) _quizManageData[si].question_count = AppPages._quizBank[skillId].length;
  renderQuizManageTable(_quizManageData);
}
function viewQuizQuestions(id) { editQuizSkill(id); }

// ===== YOUTUBE MANAGE PANEL =====
let _ytManageData = [];
let _ytManageCategories = [];
async function loadYtManagePanel() {
  console.log('[YT] loadYtManagePanel called');
  const tbody = document.getElementById('ytManageBody');
  console.log('[YT] tbody:', !!tbody);
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" class="text-center text-tertiary py-4">Loading...</td></tr>';
  try {
    const [skills, cats] = await Promise.all([API.getYoutubeSkills(), API.getYoutubeCategories()]);
    _ytManageCategories = cats || [];
    _ytManageData = Array.isArray(skills) ? skills : [];
    document.getElementById('ytAmtSkills').textContent = _ytManageData.length;
    const totalV = _ytManageData.reduce((s, sk) => s + (sk.video_count || 0), 0);
    document.getElementById('ytAmtVideos').textContent = totalV;
    document.getElementById('ytAmtViews').textContent = '—';
    document.getElementById('ytAmtWatchTime').textContent = '—';
    renderYtManageTable(_ytManageData);
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger py-4">' + (e.message || 'Failed to load') + '</td></tr>';
  }
}
function renderYtManageTable(skills) {
  console.log('[YT] renderYtManageTable called, skills count:', skills.length);
  const tbody = document.getElementById('ytManageBody');
  if (!tbody) { console.error('[YT] renderYtManageTable: tbody NOT FOUND'); return; }
  if (!skills.length) { tbody.innerHTML = '<tr><td colspan="6" class="text-center text-tertiary py-4">No skills found</td></tr>'; return; }
  tbody.innerHTML = skills.map(sk => `<tr>
      <td class="fw-medium">${sk.name || '—'}</td>
      <td class="text-sm">${sk.category || '—'}</td>
      <td><span class="badge badge-info">${sk.video_count || 0}</span></td>
      <td class="text-sm">${sk.total_views || '—'}</td>
      <td>${UI.badge(sk.is_active == 1 ? 'Active' : 'Inactive', sk.is_active == 1 ? 'success' : 'warning')}</td>
      <td>
        <div class="d-flex gap-1">
          <button class="btn btn-sm btn-ghost" onclick="editYtSkill(${sk.id})" title="Edit"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-ghost" onclick="viewYtVideos(${sk.id})" title="Videos"><i class="bi bi-play-circle"></i></button>
          <button class="btn btn-sm btn-ghost text-danger" onclick="deleteYtSkill(${sk.id})" title="Delete"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}
function filterYtManage() {
  const q = (document.getElementById('ytManageSearch')?.value || '').toLowerCase();
  const filtered = _ytManageData.filter(sk => (sk.name || '').toLowerCase().includes(q) || (sk.category || '').toLowerCase().includes(q));
  renderYtManageTable(filtered);
}
function editYtSkill(id) {
  console.log('[YT] editYtSkill called:', id);
  const sk = _vcData.find(s => s.id === id) || _ytManageData.find(s => s.id === id);
  if (!sk) { console.error('[YT] editYtSkill: skill not found for id', id); return; }
  const card = document.getElementById('vcEditCard') || document.getElementById('ytEditCard');
  const title = document.getElementById('vcEditTitle') || document.getElementById('ytEditTitle');
  const content = document.getElementById('vcEditContent') || document.getElementById('ytEditContent');
  console.log('[YT] card:', !!card, 'title:', !!title, 'content:', !!content);
  if (!card || !content) return;
  card.style.display = 'block';
  title.textContent = 'Edit Skill: ' + sk.name;
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  const catOpts = _ytManageCategories.map(c => `<option value="${c.id}" ${c.id == sk.category_id ? 'selected' : ''}>${c.name}</option>`).join('');
  content.innerHTML = `
    <div class="d-flex flex-column gap-3">
      <div class="d-flex gap-2">
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Skill Name</label><input class="form-input" id="ytSkillName" value="${sk.name || ''}"></div>
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Category</label><select class="form-input" id="ytSkillCategory">${catOpts}</select></div>
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Icon</label><input class="form-input" id="ytSkillIcon" value="${sk.icon || 'code'}"></div>
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Color</label><input type="color" class="form-input" id="ytSkillColor" value="${sk.color || '#6C63FF'}" style="height:38px"></div>
      </div>
      <div class="d-flex gap-2">
        <div style="flex:2"><label class="text-sm fw-medium mb-1">Description</label><input class="form-input" id="ytSkillDesc" value="${(sk.description || '').replace(/"/g, '&quot;')}"></div>
        <div><label class="text-sm fw-medium mb-1">Featured</label><select class="form-input" id="ytSkillFeatured"><option value="1" ${sk.is_featured == 1 ? 'selected' : ''}>Yes</option><option value="0" ${sk.is_featured != 1 ? 'selected' : ''}>No</option></select></div>
        <div><label class="text-sm fw-medium mb-1">Active</label><select class="form-input" id="ytSkillActive"><option value="1" ${sk.is_active == 1 ? 'selected' : ''}>Yes</option><option value="0" ${sk.is_active != 1 ? 'selected' : ''}>No</option></select></div>
      </div>
      <button class="btn btn-primary btn-sm" style="width:fit-content" onclick="saveYtSkill(${id})"><i class="bi bi-check-lg"></i> Save Changes</button>
    </div>`;
}
async function saveYtSkill(id) {
  try {
    await API.updateYoutubeSkill(id, {
      name: document.getElementById('ytSkillName')?.value,
      category_id: document.getElementById('ytSkillCategory')?.value,
      icon: document.getElementById('ytSkillIcon')?.value,
      color: document.getElementById('ytSkillColor')?.value,
      description: document.getElementById('ytSkillDesc')?.value,
      is_featured: document.getElementById('ytSkillFeatured')?.value,
      is_active: document.getElementById('ytSkillActive')?.value,
    });
    UI.showToast('Skill Updated', 'Changes saved successfully', 'success');
    loadYtManagePanel();
  } catch(e) { UI.showToast('Error', e.message, 'error'); }
}
async function deleteYtSkill(id) {
  const sk = _ytManageData.find(s => s.id === id);
  if (!confirm('Delete skill "' + (sk?.name || id) + '" and all its videos?')) return;
  try {
    await API.deleteYoutubeSkill(id);
    UI.showToast('Skill Deleted', 'Skill removed', 'success');
    loadYtManagePanel();
  } catch(e) { UI.showToast('Error', e.message, 'error'); }
}
async function viewYtVideos(id) {
  console.log('[YT] viewYtVideos called:', id);
  const card = document.getElementById('vcEditCard') || document.getElementById('ytEditCard');
  const title = document.getElementById('vcEditTitle') || document.getElementById('ytEditTitle');
  const content = document.getElementById('vcEditContent') || document.getElementById('ytEditContent');
  if (!card || !content) return;
  card.style.display = 'block';
  title.textContent = 'Videos for Skill #' + id;
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  content.innerHTML = '<div class="text-center text-tertiary py-3"><div class="loader-spinner"></div> Loading videos...</div>';
  try {
    const data = await API.getYoutubeVideos(1, 100, id);
    const videos = data.videos || [];
    const catOpts = _ytManageCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    content.innerHTML = `
      <div class="d-flex flex-column gap-3">
        <div class="d-flex justify-between items-center">
          <h6 class="m-0">Videos (${videos.length})</h6>
          <button class="btn btn-success btn-sm" onclick="showAddYtVideo(${id})"><i class="bi bi-plus-lg"></i> Add Video</button>
        </div>
        <div id="ytVideosList" class="d-flex flex-column gap-2" style="max-height:400px;overflow-y:auto">
          ${videos.map(v => `
            <div class="d-flex gap-2 items-center p-2" style="background:var(--bg-secondary);border-radius:var(--radius-sm)">
              <img src="${v.thumbnail || ''}" style="width:80px;height:45px;object-fit:cover;border-radius:4px" onerror="this.style.display='none'">
              <div style="flex:1">
                <div class="text-sm fw-medium">${v.title || ''}</div>
                <div class="text-xs text-tertiary">${v.instructor || ''} · ${v.duration || ''} · ${(v.views || 0).toLocaleString()} views</div>
              </div>
              <button class="btn btn-xs btn-ghost" onclick="editYtVideo(${v.id},${id})" title="Edit"><i class="bi bi-pencil"></i></button>
              <button class="btn btn-xs btn-ghost text-danger" onclick="deleteYtVideo(${v.id},${id})" title="Delete"><i class="bi bi-trash"></i></button>
            </div>
          `).join('')}
          ${!videos.length ? '<div class="text-center text-tertiary py-3 text-sm">No videos yet</div>' : ''}
        </div>
      </div>`;
  } catch(e) { content.innerHTML = '<div class="text-center text-danger py-3">' + e.message + '</div>'; }
}
function showAddYtVideo(skillId) {
  const content = document.getElementById('vcEditContent') || document.getElementById('ytEditContent');
  if (!content) return;
  const catOpts = _ytManageCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  content.innerHTML = `
    <div class="d-flex flex-column gap-3">
      <h6>Add New Video</h6>
      <div class="d-flex gap-2">
        <div style="flex:2"><label class="text-sm fw-medium mb-1">Title *</label><input class="form-input" id="ytVidTitle"></div>
        <div style="flex:1"><label class="text-sm fw-medium mb-1">YouTube ID *</label><input class="form-input" id="ytVidYtId" placeholder="e.g. dQw4w9WgXcQ"></div>
      </div>
      <div class="d-flex gap-2">
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Description</label><input class="form-input" id="ytVidDesc"></div>
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Instructor</label><input class="form-input" id="ytVidInstructor" value="Batch15Tube"></div>
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Duration</label><input class="form-input" id="ytVidDuration" placeholder="e.g. 1:30:00"></div>
      </div>
      <div class="d-flex gap-2">
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Category</label><select class="form-input" id="ytVidCategory">${catOpts}</select></div>
        <div><label class="text-sm fw-medium mb-1">Featured</label><select class="form-input" id="ytVidFeatured"><option value="0">No</option><option value="1">Yes</option></select></div>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-primary btn-sm" onclick="saveYtVideo(${skillId})"><i class="bi bi-check-lg"></i> Save Video</button>
        <button class="btn btn-ghost btn-sm" onclick="viewYtVideos(${skillId})">Cancel</button>
      </div>
    </div>`;
}
async function saveYtVideo(skillId) {
  const title = document.getElementById('ytVidTitle')?.value?.trim();
  const youtubeId = document.getElementById('ytVidYtId')?.value?.trim();
  if (!title || !youtubeId) { UI.showToast('Error', 'Title and YouTube ID are required', 'error'); return; }
  try {
    await API.createYoutubeVideo({
      title, youtube_id: youtubeId,
      skill_id: skillId,
      description: document.getElementById('ytVidDesc')?.value,
      instructor: document.getElementById('ytVidInstructor')?.value,
      duration: document.getElementById('ytVidDuration')?.value,
      category_id: document.getElementById('ytVidCategory')?.value,
      is_featured: document.getElementById('ytVidFeatured')?.value,
    });
    UI.showToast('Video Added', 'New video created', 'success');
    viewYtVideos(skillId);
    loadYtManagePanel();
  } catch(e) { UI.showToast('Error', e.message, 'error'); }
}
async function editYtVideo(videoId, skillId) {
  const content = document.getElementById('vcEditContent') || document.getElementById('ytEditContent');
  if (!content) return;
  content.innerHTML = '<div class="text-center text-tertiary py-3"><div class="loader-spinner"></div> Loading...</div>';
  try {
    const video = await API.getYoutubeVideo(videoId);
    if (!video) throw new Error('Video not found');
    const catOpts = _ytManageCategories.map(c => `<option value="${c.id}" ${c.id == video.category_id ? 'selected' : ''}>${c.name}</option>`).join('');
    content.innerHTML = `
      <div class="d-flex flex-column gap-3">
        <h6>Edit Video: ${video.title}</h6>
        <div class="d-flex gap-2">
          <div style="flex:2"><label class="text-sm fw-medium mb-1">Title</label><input class="form-input" id="evTitle" value="${(video.title || '').replace(/"/g, '&quot;')}"></div>
          <div style="flex:1"><label class="text-sm fw-medium mb-1">YouTube ID</label><input class="form-input" id="evYtId" value="${video.youtube_id || ''}"></div>
        </div>
        <div class="d-flex gap-2">
          <div style="flex:1"><label class="text-sm fw-medium mb-1">Description</label><input class="form-input" id="evDesc" value="${(video.description || '').replace(/"/g, '&quot;')}"></div>
          <div style="flex:1"><label class="text-sm fw-medium mb-1">Instructor</label><input class="form-input" id="evInstructor" value="${video.instructor || ''}"></div>
          <div style="flex:1"><label class="text-sm fw-medium mb-1">Duration</label><input class="form-input" id="evDuration" value="${video.duration || ''}"></div>
        </div>
        <div class="d-flex gap-2">
          <div style="flex:1"><label class="text-sm fw-medium mb-1">Category</label><select class="form-input" id="evCategory">${catOpts}</select></div>
          <div><label class="text-sm fw-medium mb-1">Featured</label><select class="form-input" id="evFeatured"><option value="1" ${video.is_featured == 1 ? 'selected' : ''}>Yes</option><option value="0" ${video.is_featured != 1 ? 'selected' : ''}>No</option></select></div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-primary btn-sm" onclick="saveEditYtVideo(${videoId},${skillId})"><i class="bi bi-check-lg"></i> Save</button>
          <button class="btn btn-ghost btn-sm" onclick="viewYtVideos(${skillId})">Cancel</button>
        </div>
      </div>`;
  } catch(e) { content.innerHTML = '<div class="text-center text-danger py-3">' + e.message + '</div>'; }
}
async function saveEditYtVideo(videoId, skillId) {
  try {
    await API.updateYoutubeVideo(videoId, {
      title: document.getElementById('evTitle')?.value,
      youtube_id: document.getElementById('evYtId')?.value,
      description: document.getElementById('evDesc')?.value,
      instructor: document.getElementById('evInstructor')?.value,
      duration: document.getElementById('evDuration')?.value,
      category_id: document.getElementById('evCategory')?.value,
      is_featured: document.getElementById('evFeatured')?.value,
    });
    UI.showToast('Video Updated', 'Changes saved', 'success');
    viewYtVideos(skillId);
    loadYtManagePanel();
  } catch(e) { UI.showToast('Error', e.message, 'error'); }
}
async function deleteYtVideo(videoId, skillId) {
  if (!confirm('Delete this video?')) return;
  try {
    await API.deleteYoutubeVideo(videoId);
    UI.showToast('Video Deleted', 'Video removed', 'success');
    viewYtVideos(skillId);
    loadYtManagePanel();
  } catch(e) { UI.showToast('Error', e.message, 'error'); }
}

// ===== UNIFIED VIDEO COURSES PANEL =====
let _vcData = [];
let _vcCategories = [];
let _vcMode = 'browse';

function switchVcMode(mode) {
  _vcMode = mode;
  const bv = document.getElementById('vcBrowseView');
  const mv = document.getElementById('vcManageView');
  if (bv) bv.style.display = mode === 'browse' ? '' : 'none';
  if (mv) mv.style.display = mode === 'manage' ? '' : 'none';
  document.querySelectorAll('.vc-mode-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.mode === mode);
    b.style.background = b.dataset.mode === mode ? 'var(--accent-primary)' : 'transparent';
    b.style.color = b.dataset.mode === mode ? '#fff' : '';
  });
}

async function loadVideoCoursesPanel() {
  try {
    const [skills, cats] = await Promise.all([API.getYoutubeSkills(), API.getYoutubeCategories()]);
    _vcData = Array.isArray(skills) ? skills : (skills?.skills || []);
    _vcCategories = cats || [];
    const amtSkills = document.getElementById('vcAmtSkills');
    const amtVideos = document.getElementById('vcAmtVideos');
    const amtViews = document.getElementById('vcAmtViews');
    const amtTime = document.getElementById('vcAmtWatchTime');
    if (amtSkills) amtSkills.textContent = _vcData.length;
    const totalV = _vcData.reduce((s, sk) => s + (sk.video_count || 0), 0);
    if (amtVideos) amtVideos.textContent = totalV;
    if (amtViews) amtViews.textContent = '—';
    if (amtTime) amtTime.textContent = '—';
    renderVcSkillGrid(_vcData);
    renderVcManageTable(_vcData);
  } catch(e) {
    console.error('Failed to load video courses:', e);
    const grid = document.getElementById('vcSkillGrid');
    if (grid) grid.innerHTML = '<div class="card text-center p-4"><p class="text-secondary">Video courses unavailable.</p></div>';
  }
}

function renderVcSkillGrid(skills) {
  const grid = document.getElementById('vcSkillGrid');
  if (!grid) return;
  if (!skills.length) { grid.innerHTML = '<div class="card text-center p-4"><p class="text-tertiary">No skills found</p></div>'; return; }
  grid.innerHTML = skills.map(s => {
    const color = s.color || 'var(--accent-primary)';
    return `
    <div class="card card-hover stagger-item" style="cursor:pointer;border-left:3px solid ${color}" onclick="openVcSkill(${s.id})">
      <div class="d-flex items-center gap-3 mb-3">
        <div style="width:44px;height:44px;border-radius:12px;background:${color}20;display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:${color}"><i class="bi bi-play-circle"></i></div>
        <div style="flex:1;min-width:0">
          <h5 class="mb-0" style="font-size:0.95rem">${UI.escape(s.name || '')}</h5>
          <span class="text-xs text-tertiary">${s.video_count || 0} videos</span>
        </div>
      </div>
      <p class="text-xs text-tertiary mb-2" style="display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${UI.escape(s.description || '')}</p>
      <div class="d-flex justify-between items-center">
        <div class="progress" style="flex:1;height:4px"><div class="progress-bar" style="width:${Math.floor(Math.random()*40+10)}%;background:${color}"></div></div>
        <button class="btn btn-xs btn-ghost ms-2" onclick="event.stopPropagation();switchVcMode('manage');editYtSkill(${s.id})" title="Edit"><i class="bi bi-pencil"></i></button>
      </div>
    </div>`;
  }).join('');
}

async function openVcSkill(skillId) {
  const grid = document.getElementById('vcSkillGrid');
  const list = document.getElementById('vcVideoList');
  const player = document.getElementById('vcPlayer');
  if (!grid || !list) return;
  grid.style.display = 'none';
  list.style.display = 'block';
  if (player) player.style.display = 'none';
  list.innerHTML = '<div class="p-4 text-center"><div class="spinner"></div></div>';
  try {
    const res = await API.getYoutubeSkill(skillId);
    const s = res?.skill || res;
    const videos = s?.videos || [];
    const subSkills = s?.sub_skills || [];
    const color = s?.color || 'var(--accent-primary)';
    list.innerHTML = `
      <button class="btn btn-ghost btn-sm mb-4" onclick="document.getElementById('vcSkillGrid').style.display='';document.getElementById('vcVideoList').style.display='none';document.getElementById('vcPlayer').style.display='none'"><i class="bi bi-arrow-left"></i> Back to Skills</button>
      <div class="d-flex items-center gap-3 mb-4">
        <div style="width:48px;height:48px;border-radius:12px;background:${color}20;display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:${color}"><i class="bi bi-play-circle-fill"></i></div>
        <div><h3 class="mb-0">${UI.escape(s?.name || 'Skill')}</h3><span class="text-sm text-tertiary">${UI.escape(s?.description || '')}</span></div>
      </div>
      ${subSkills.length > 0 ? '<div class="card mb-4"><h6 class="mb-2" style="font-size:0.85rem"><i class="bi bi-map"></i> Roadmap</h6><div class="d-flex gap-2 flex-wrap">' + subSkills.map((ss, i) => '<span class="badge" style="background:' + color + '15;color:' + color + ';font-size:0.75rem">' + (i+1) + '. ' + UI.escape(ss.name) + '</span>').join('') + '</div></div>' : ''}
      ${videos.length > 0 ? '<div class="grid-3">' + videos.map(v => {
        const thumb = v.thumbnail || (v.youtube_id ? 'https://img.youtube.com/vi/' + v.youtube_id + '/mqdefault.jpg' : '');
        return '<div class="card card-hover" style="cursor:pointer;border-left:2px solid ' + color + '" onclick="playVcVideo(' + v.id + ')">' +
          '<div style="position:relative;margin-bottom:12px;border-radius:var(--radius-md);overflow:hidden;background:var(--bg-tertiary);aspect-ratio:16/9;display:flex;align-items:center;justify-content:center">' +
            (thumb ? '<img src="' + thumb + '" alt="" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display=\'none\'">' : '') +
            '<i class="bi bi-play-circle" style="font-size:2.5rem;color:' + color + ';opacity:0.9;position:absolute;z-index:1"></i>' +
            '<span style="position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,0.8);color:#fff;padding:2px 6px;border-radius:4px;font-size:0.7rem">' + UI.escape(v.duration || '') + '</span>' +
          '</div>' +
          '<h6 class="mb-1" style="font-size:0.88rem;line-height:1.3">' + UI.escape(v.title) + '</h6>' +
          '<div class="d-flex justify-between items-center text-xs text-tertiary"><span><i class="bi bi-eye"></i> ' + (v.views || 0) + '</span><span>' + UI.escape(v.instructor || 'Batch15Tube') + '</span></div>' +
        '</div>';
      }).join('') + '</div>' : '<div class="card text-center p-4"><p class="text-secondary text-sm">No videos yet for this skill.</p></div>'}
    `;
  } catch(e) {
    list.innerHTML = '<div class="card text-center p-4"><p class="text-secondary">Failed to load skill.</p></div>';
  }
}

async function playVcVideo(videoId) {
  const player = document.getElementById('vcPlayer');
  if (!player) return;
  try {
    const video = await API.getYoutubeVideo(videoId);
    if (!video) { player.innerHTML = '<div class="card text-center p-4">Video not found.</div>'; player.style.display = 'block'; return; }
    const embedUrl = video.embed_url || (video.youtube_id ? 'https://www.youtube.com/embed/' + video.youtube_id : '');
    const color = video.skill_color || 'var(--accent-primary)';
    player.innerHTML = `
      <button class="btn btn-ghost btn-sm mb-4" onclick="document.getElementById('vcPlayer').style.display='none';document.getElementById('vcVideoList').style.display=''"><i class="bi bi-arrow-left"></i> Back to Videos</button>
      <div class="card mb-4" style="border-left:3px solid ${color}">
        <div style="position:relative;border-radius:var(--radius-md);overflow:hidden;background:#000;aspect-ratio:16/9">
          ${embedUrl ? '<iframe src="' + embedUrl + '?autoplay=1&enablejsapi=1" style="width:100%;height:100%;border:none" allow="autoplay;encrypted-media" allowfullscreen></iframe>' : ''}
        </div>
        <div class="mt-3">
          <h4 style="font-size:1.1rem">' + UI.escape(video.title || '') + '</h4>
          <div class="d-flex items-center gap-3 text-sm text-tertiary mt-2">
            <span><i class="bi bi-eye"></i> ${video.views || 0} views</span>
            <span><i class="bi bi-person"></i> ${UI.escape(video.instructor || 'Batch15Tube')}</span>
            ${video.duration ? '<span><i class="bi bi-clock"></i> ' + UI.escape(video.duration) + '</span>' : ''}
            <span style="color:' + color + '"><i class="bi bi-tag"></i> ' + UI.escape(video.skill_name || '') + '</span>
          </div>
          ${video.description ? '<p class="mt-3 text-sm" style="line-height:1.6">' + UI.escape(video.description) + '</p>' : ''}
        </div>
      </div>
      ${video.playlist && video.playlist.length > 1 ? '<div class="card"><h6 class="mb-3" style="font-size:0.85rem"><i class="bi bi-list-ol"></i> Playlist (' + video.playlist.length + ')</h6><div style="display:flex;flex-direction:column;gap:8px">' + video.playlist.map((pv, i) => {
        const isActive = pv.id == videoId;
        return '<div class="d-flex items-center gap-3 p-2" style="border-radius:var(--radius-sm);cursor:pointer;background:' + (isActive ? color+'15' : 'transparent') + '" onclick="playVcVideo(' + pv.id + ')">' +
          '<span class="text-xs text-tertiary" style="min-width:20px">' + (i+1) + '</span>' +
          '<div style="flex:1;min-width:0"><div style="font-size:0.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;' + (isActive ? 'font-weight:600' : '') + '">' + UI.escape(pv.title) + '</div><span class="text-xs text-tertiary">' + UI.escape(pv.duration || '') + '</span></div>' +
          (isActive ? '<i class="bi bi-volume-up" style="color:' + color + ';font-size:0.8rem"></i>' : '') +
        '</div>';
      }).join('') + '</div></div>' : ''}
    `;
    player.style.display = 'block';
    player.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch(e) {
    player.innerHTML = '<div class="card text-center p-4"><p class="text-secondary">Failed to load video.</p></div>';
    player.style.display = 'block';
  }
}

function renderVcManageTable(skills) {
  const tbody = document.getElementById('vcManageBody');
  if (!tbody) return;
  if (!skills.length) { tbody.innerHTML = '<tr><td colspan="5" class="text-center text-tertiary py-4">No skills found</td></tr>'; return; }
  tbody.innerHTML = skills.map(sk => `<tr>
    <td class="fw-medium">${UI.escape(sk.name || '—')}</td>
    <td class="text-sm">${UI.escape(sk.category || '—')}</td>
    <td><span class="badge badge-info">${sk.video_count || 0}</span></td>
    <td>${UI.badge(sk.is_active == 1 ? 'Active' : 'Inactive', sk.is_active == 1 ? 'success' : 'warning')}</td>
    <td>
      <div class="d-flex gap-1">
        <button class="btn btn-sm btn-ghost" onclick="editYtSkill(${sk.id})" title="Edit"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-ghost" onclick="viewYtVideos(${sk.id})" title="Videos"><i class="bi bi-play-circle"></i></button>
        <button class="btn btn-sm btn-ghost text-danger" onclick="deleteYtSkill(${sk.id})" title="Delete"><i class="bi bi-trash"></i></button>
      </div>
    </td>
  </tr>`).join('');
}

function filterVideoCourses() {
  const q = (document.getElementById('vcSearchInput')?.value || '').toLowerCase();
  const filtered = q ? _vcData.filter(s => (s.name || '').toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q)) : _vcData;
  renderVcSkillGrid(filtered);
  renderVcManageTable(filtered);
}

function showAddYtSkillModalUnified() {
  const catOpts = _vcCategories.map(c => '<option value="' + c.id + '">' + UI.escape(c.name) + '</option>').join('');
  UI.showModal('Add Video Skill', '<div class="d-flex flex-column gap-3">' +
    '<div class="d-flex gap-2">' +
      '<div style="flex:1"><label class="text-sm fw-medium mb-1">Skill Name *</label><input class="form-input" id="vcNewSkillName"></div>' +
      '<div style="flex:1"><label class="text-sm fw-medium mb-1">Icon</label><input class="form-input" id="vcNewSkillIcon" value="code"></div>' +
      '<div style="flex:1"><label class="text-sm fw-medium mb-1">Color</label><input type="color" class="form-input" id="vcNewSkillColor" value="#6C63FF" style="height:38px"></div>' +
    '</div>' +
    '<div class="d-flex gap-2">' +
      '<div style="flex:2"><label class="text-sm fw-medium mb-1">Description</label><input class="form-input" id="vcNewSkillDesc"></div>' +
      '<div style="flex:1"><label class="text-sm fw-medium mb-1">Category</label><select class="form-input" id="vcNewSkillCat">' + catOpts + '</select></div>' +
    '</div>' +
    '<button class="btn btn-primary btn-sm" style="width:fit-content" onclick="saveNewVcSkill()"><i class="bi bi-plus-lg"></i> Add Skill</button>' +
  '</div>');
}

async function saveNewVcSkill() {
  const name = document.getElementById('vcNewSkillName')?.value?.trim();
  if (!name) { UI.showToast('Error', 'Name required', 'error'); return; }
  try {
    await API.createYoutubeSkill({
      name, icon: document.getElementById('vcNewSkillIcon')?.value || 'code',
      color: document.getElementById('vcNewSkillColor')?.value || '#6C63FF',
      description: document.getElementById('vcNewSkillDesc')?.value,
      category_id: document.getElementById('vcNewSkillCat')?.value,
    });
    UI.closeModal();
    UI.showToast('Created', 'Skill added', 'success');
    loadVideoCoursesPanel();
  } catch(e) { UI.showToast('Error', e.message, 'error'); }
}

// ===== Add Skill buttons for both panels =====
function showAddQuizSkillModal() {
  UI.showModal('Add Quiz Skill', `
    <div class="d-flex flex-column gap-3">
      <div class="d-flex gap-2">
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Skill ID</label><input class="form-input" id="newQzId" placeholder="e.g. my-new-skill"></div>
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Name</label><input class="form-input" id="newQzName"></div>
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Icon</label><input class="form-input" id="newQzIcon" placeholder="e.g. 🚀"></div>
      </div>
      <div><label class="text-sm fw-medium mb-1">Description</label><input class="form-input" id="newQzDesc"></div>
      <div><button class="btn btn-primary btn-sm" onclick="addNewQuizSkill()"><i class="bi bi-plus-lg"></i> Add Skill</button></div>
    </div>
  `);
}
function addNewQuizSkill() {
  const id = document.getElementById('newQzId')?.value?.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  const name = document.getElementById('newQzName')?.value?.trim();
  const icon = document.getElementById('newQzIcon')?.value?.trim();
  const desc = document.getElementById('newQzDesc')?.value?.trim();
  if (!id || !name) { UI.showToast('Error', 'ID and Name are required', 'error'); return; }
  if ((AppPages._quizSkills || []).find(s => s.id === id)) { UI.showToast('Error', 'Skill ID already exists', 'error'); return; }
  AppPages._quizSkills.push({ id, name, icon: icon || '❓', desc: desc || '', count: 0 });
  if (!AppPages._quizBank) AppPages._quizBank = {};
  AppPages._quizBank[id] = [];
  UI.closeModal();
  UI.showToast('Skill Added', name + ' created', 'success');
  loadQuizManagePanel();
}
function showAddYtSkillModal() {
  const catOpts = _ytManageCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
  UI.showModal('Add YouTube Skill', `
    <div class="d-flex flex-column gap-3">
      <div class="d-flex gap-2">
        <div style="flex:2"><label class="text-sm fw-medium mb-1">Name *</label><input class="form-input" id="newYtName"></div>
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Icon</label><input class="form-input" id="newYtIcon" value="code"></div>
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Color</label><input type="color" class="form-input" id="newYtColor" value="#6C63FF" style="height:38px"></div>
      </div>
      <div class="d-flex gap-2">
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Description</label><input class="form-input" id="newYtDesc"></div>
        <div style="flex:1"><label class="text-sm fw-medium mb-1">Category</label><select class="form-input" id="newYtCategory">${catOpts}</select></div>
      </div>
      <div><button class="btn btn-primary btn-sm" onclick="addNewYtSkill()"><i class="bi bi-plus-lg"></i> Add Skill</button></div>
    </div>
  `);
}
async function addNewYtSkill() {
  const name = document.getElementById('newYtName')?.value?.trim();
  if (!name) { UI.showToast('Error', 'Name is required', 'error'); return; }
  try {
    await API.createYoutubeSkill({
      name,
      icon: document.getElementById('newYtIcon')?.value,
      color: document.getElementById('newYtColor')?.value,
      description: document.getElementById('newYtDesc')?.value,
    });
    UI.closeModal();
    UI.showToast('Skill Added', name + ' created', 'success');
    loadYtManagePanel();
  } catch(e) { UI.showToast('Error', e.message, 'error'); }
}

function blockIP(ip) {
  UI.showToast('IP Blocked', `${ip} has been blocked permanently`, 'success');
}

function triggerBackup() {
  UI.showToast('Backup Started', 'Database backup has been initiated. This may take a few minutes.', 'info');
}

function restoreBackup() {
  UI.showModal('Restore Backup', '<p class="text-sm text-secondary mb-3">Select a backup to restore. This will overwrite current data.</p><div class="d-flex flex-column gap-2"><div class="d-flex justify-between items-center p-2" style="background:var(--bg-tertiary);border-radius:var(--radius-sm)"><span class="text-sm">Latest Full Backup</span><span class="text-xs text-tertiary">${new Date().toLocaleDateString()}</span><button class="btn btn-sm btn-primary" onclick="UI.closeModal();UI.showToast(\'Restore Initiated\',\'Restoring from backup...\',\'info\')">Restore</button></div></div>');
}

function downloadLogs(type) {
  UI.showToast('Download Started', `Downloading ${type} logs...`, 'info');
}

function toggleSystemConfig(key) {
  const el = document.getElementById('cfg' + key.charAt(0).toUpperCase() + key.slice(1));
  const state = el?.checked ? 'enabled' : 'disabled';
  UI.showToast('Config Updated', `${key.replace(/([A-Z])/g, ' $1')} ${state}`, 'success');
}

async function saveModuleRestriction(el) {
  const role = el.dataset.role;
  const module = el.dataset.module;
  const enabled = el.checked;
  try {
    await API.updateSystemConfig({ [`module_restriction_${role}_${module}`]: enabled ? '1' : '0' });
    UI.showToast('Module Updated', `${module} for ${role} ${enabled ? 'enabled' : 'locked'}`, enabled ? 'success' : 'warning');
  } catch(e) {
    el.checked = !enabled;
    UI.showToast('Error', 'Failed to save module restriction', 'error');
  }
}

async function loadModuleRestrictions() {
  try {
    const res = await API.getSystemConfig();
    const config = res.config || res || {};
    document.querySelectorAll('#moduleRestrictionsGrid input[type="checkbox"]').forEach(cb => {
      const key = `module_restriction_${cb.dataset.role}_${cb.dataset.module}`;
      if (config[key] === '0') {
        cb.checked = false;
      } else {
        cb.checked = true;
      }
    });
  } catch(e) { console.warn('Could not load module restrictions:', e); }
}

function saveIPRules() { UI.showToast('IP Rules Saved', 'Whitelist/blacklist rules have been updated', 'success'); }
function saveEmailConfig() { UI.showToast('Email Config Saved', 'SMTP settings have been updated', 'success'); }
function saveSecurityControls() { UI.showToast('Security Settings Saved', 'Security controls have been updated', 'success'); }

function setAnalyticsFilter(filter) {
  window._saAnalyticsFilter = filter;
  document.querySelectorAll('#panel-analytics .btn-group .btn, #panel-analytics [onclick*="setAnalyticsFilter"]').forEach(b => {
    if (b.getAttribute('onclick')?.includes("'" + filter + "'")) b.className = 'btn btn-sm btn-primary';
    else b.className = 'btn btn-sm btn-ghost';
  });
}

function exportAnalyticsPDF() { UI.showToast('Export', 'Downloading PDF report...', 'info'); }
function exportAnalyticsExcel() { UI.showToast('Export', 'Downloading Excel report...', 'info'); }
function exportAuditLogs() { UI.showToast('Export', 'Downloading audit logs...', 'info'); }
function exportRoleHistory() { UI.showToast('Export', 'Downloading role change history...', 'info'); }

Dashboards.superAdminLoaded = async function() {
  initSACharts();
  try {
    await Promise.all([
      populateUserTable(),
      populateRoleAssign(),
      populateContentTable(),
      populateAuditLogs(),
      populateAuditUserFilter(),
    ]);
  } catch(e) { console.error('Error loading admin data:', e); UI.showToast('Warning', 'Some admin data could not be loaded.', 'warning'); }
  this._loadStats('super_admin');

  // Load SOC stats into separate soc stat cards
  if (typeof API !== 'undefined') {
    API.getSOCData().then(soc => {
      const socContainer = document.getElementById('socStatCards');
      if (socContainer) {
        const items = [
          { icon: 'bi-shield-exclamation', key: 'activeAlerts', label: 'Active Alerts', color: 'red' },
          { icon: 'bi-exclamation-triangle', key: 'criticalAlerts', label: 'Critical', color: 'red' },
          { icon: 'bi-slash-circle', key: 'ipsBlocked', label: 'IPs Blocked', color: 'yellow' },
          { icon: 'bi-shield-check', key: 'securityScore', label: 'Security Score', color: 'green' },
        ];
        socContainer.innerHTML = items.map(it => UI.statCard(it.icon, soc[it.key] || 0, it.label, null, it.color)).join('');
        UI.initCounters(socContainer);
      }
    }).catch(() => {});
  }

  // Ensure first panel is visible
  switchSuperAdminPanel('overview');
  initAvatarUpload();
};

Dashboards.generalAdminLoaded = async function() {
  try {
    await Promise.all([
      populateUserTable(),
      populateRoleAssign(),
    ]);
  } catch(e) { console.error('Error loading admin data:', e); UI.showToast('Warning', 'Some admin data could not be loaded.', 'warning'); }
  this._loadStats('general_admin');
  switchSuperAdminPanel('overview');
  initAvatarUpload();
};

// ===== Elections Panel Functions =====
async function loadElectionsPanel() {
  const tbody = document.getElementById('electionsTableBody');
  if (!tbody) return;
  const status = document.getElementById('electionStatusFilter')?.value || 'all';
  try {
    const params = status !== 'all' ? { status } : {};
    const r = await API.getElections(params);
    const list = r.elections || r.data || r || [];
    const countDisplay = document.getElementById('electionCountDisplay');
    if (countDisplay) countDisplay.textContent = list.length + ' election' + (list.length !== 1 ? 's' : '');
    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-secondary py-4">No elections found</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(e => `
      <tr>
        <td>${e.id}</td>
        <td class="fw-medium">${e.title}</td>
        <td>${UI.badge((e.status||'unknown').charAt(0).toUpperCase()+(e.status||'unknown').slice(1), e.status==='active'?'success':e.status==='pending'?'warning':'gray')}</td>
        <td class="text-sm">${e.start_date || e.startDate || '-'}</td>
        <td class="text-sm">${e.end_date || e.endDate || '-'}</td>
        <td>${e.totalVotes||e.total_votes||0}</td>
        <td>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-ghost" onclick="showEditElectionModal(${e.id})" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-ghost" onclick="manageCandidates(${e.id})" title="Candidates"><i class="bi bi-people"></i></button>
            <button class="btn btn-sm btn-ghost" onclick="showElectionResults(${e.id})" title="Results"><i class="bi bi-bar-chart"></i></button>
            <button class="btn btn-sm btn-ghost text-danger" onclick="deleteElection(${e.id})" title="Delete"><i class="bi bi-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    console.error('Error loading elections:', e);
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger py-4">' + (e.message || 'Failed to load elections') + '</td></tr>';
  }
}

async function showCreateElectionModal() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.classList.add('show');
  overlay.id = 'electionModal';
  overlay.onclick = function(e) { if (e.target === this) this.remove(); };
  overlay.innerHTML = `
    <div class="modal-content" style="max-width:560px;padding:0">
      <div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-primary)">
        <h5 style="margin:0">Create Election</h5>
        <button class="btn btn-sm btn-ghost" onclick="document.getElementById('electionModal').remove()"><i class="bi bi-x-lg"></i></button>
      </div>
      <form onsubmit="handleCreateElection(event)" style="padding:1.5rem">
        <div class="form-group mb-3">
          <label class="form-label">Title</label>
          <input class="form-input" id="electionTitle" required placeholder="e.g., Student Council 2026">
        </div>
        <div class="form-group mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-textarea" id="electionDesc" rows="3" placeholder="Describe this election..."></textarea>
        </div>
        <div class="grid-2 gap-3 mb-3">
          <div class="form-group">
            <label class="form-label">Start Date</label>
            <input class="form-input" id="electionStart" type="datetime-local" required>
          </div>
          <div class="form-group">
            <label class="form-label">End Date</label>
            <input class="form-input" id="electionEnd" type="datetime-local" required>
          </div>
        </div>
        <div class="form-group mb-4">
          <label class="form-label">Status</label>
          <select class="form-select" id="electionStatus">
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div class="d-flex gap-3 justify-end">
          <button type="button" class="btn btn-secondary" onclick="document.getElementById('electionModal').remove()">Cancel</button>
          <button type="submit" class="btn btn-primary"><i class="bi bi-check-lg"></i> Create Election</button>
        </div>
      </form>
    </div>`;
  document.body.appendChild(overlay);
}

async function handleCreateElection(e) {
  e.preventDefault();
  const data = {
    title: document.getElementById('electionTitle').value,
    description: document.getElementById('electionDesc').value,
    start_date: document.getElementById('electionStart').value,
    end_date: document.getElementById('electionEnd').value,
    status: document.getElementById('electionStatus').value,
  };
  try {
    await API.createElection(data);
    document.getElementById('electionModal').remove();
    loadElectionsPanel();
  } catch(e) {
    alert(e.message || 'Failed to create election');
  }
}

async function showEditElectionModal(id) {
  try {
    const r = await API.getElection(id);
    const e = r.election || r.data || r;
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.classList.add('show');
    overlay.id = 'electionModal';
    overlay.onclick = function(ev) { if (ev.target === this) this.remove(); };
    overlay.innerHTML = `
      <div class="modal-content" style="max-width:560px;padding:0">
        <div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-primary)">
          <h5 style="margin:0">Edit Election</h5>
          <button class="btn btn-sm btn-ghost" onclick="document.getElementById('electionModal').remove()"><i class="bi bi-x-lg"></i></button>
        </div>
        <form onsubmit="handleUpdateElection(event, ${id})" style="padding:1.5rem">
          <div class="form-group mb-3">
            <label class="form-label">Title</label>
            <input class="form-input" id="electionTitle" value="${(e.title||'').replace(/"/g,'&quot;')}" required>
          </div>
          <div class="form-group mb-3">
            <label class="form-label">Description</label>
            <textarea class="form-textarea" id="electionDesc" rows="3">${(e.description||'').replace(/"/g,'&quot;')}</textarea>
          </div>
          <div class="grid-2 gap-3 mb-3">
            <div class="form-group">
              <label class="form-label">Start Date</label>
              <input class="form-input" id="electionStart" type="datetime-local" value="${(e.start_date||e.startDate||'').replace(' ','T')}">
            </div>
            <div class="form-group">
              <label class="form-label">End Date</label>
              <input class="form-input" id="electionEnd" type="datetime-local" value="${(e.end_date||e.endDate||'').replace(' ','T')}">
            </div>
          </div>
          <div class="form-group mb-4">
            <label class="form-label">Status</label>
            <select class="form-select" id="electionStatus">
              <option value="pending" ${e.status==='pending'?'selected':''}>Pending</option>
              <option value="active" ${e.status==='active'?'selected':''}>Active</option>
              <option value="closed" ${e.status==='closed'?'selected':''}>Closed</option>
            </select>
          </div>
          <div class="d-flex gap-3 justify-end">
            <button type="button" class="btn btn-secondary" onclick="document.getElementById('electionModal').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary"><i class="bi bi-check-lg"></i> Update Election</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(overlay);
  } catch(e) {
    alert(e.message || 'Failed to load election');
  }
}

async function handleUpdateElection(e, id) {
  e.preventDefault();
  const data = {
    title: document.getElementById('electionTitle').value,
    description: document.getElementById('electionDesc').value,
    start_date: document.getElementById('electionStart').value,
    end_date: document.getElementById('electionEnd').value,
    status: document.getElementById('electionStatus').value,
  };
  try {
    await API.updateElection(id, data);
    document.getElementById('electionModal').remove();
    loadElectionsPanel();
  } catch(e) {
    alert(e.message || 'Failed to update election');
  }
}

async function deleteElection(id) {
  if (!confirm('Are you sure you want to delete this election?')) return;
  try {
    await API.deleteElection(id);
    loadElectionsPanel();
  } catch(e) {
    alert(e.message || 'Failed to delete election');
  }
}

async function manageCandidates(electionId) {
  try {
    const r = await API.getElection(electionId);
    const election = r.election || r.data || r;
    const cr = await API.getCandidates(electionId);
    const candidates = cr.candidates || cr.data || cr || [];
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.classList.add('show');
    overlay.id = 'candidateModal';
    overlay.onclick = function(e) { if (e.target === this) this.remove(); };
    overlay.innerHTML = `
      <div class="modal-content" style="max-width:600px;padding:0">
        <div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-primary)">
          <h5 style="margin:0">Candidates — ${election.title}</h5>
          <button class="btn btn-sm btn-ghost" onclick="document.getElementById('candidateModal').remove()"><i class="bi bi-x-lg"></i></button>
        </div>
        <div style="padding:1.5rem">
          <div class="mb-3">
            <label class="form-label text-xs text-tertiary mb-1">Search user to add as candidate</label>
            <input class="form-input" id="candidateUserSearch" placeholder="Type student name..." oninput="searchCandidateUsers(this.value, ${electionId})">
            <div id="candidateUserResults" class="mt-1" style="max-height:160px;overflow-y:auto;display:none"></div>
          </div>
          <form onsubmit="handleAddCandidate(event, ${electionId})" class="d-flex gap-2 mb-4 align-items-end">
            <div>
              <label class="form-label text-xs text-tertiary">User ID</label>
              <input class="form-input" id="newCandidateUserId" type="number" placeholder="User ID" required style="width:100px">
            </div>
            <input class="form-input" id="newCandidatePosition" placeholder="Position / role" style="flex:1">
            <textarea class="form-textarea" id="newCandidateManifesto" rows="1" placeholder="Manifesto (optional)" style="flex:1"></textarea>
            <button type="submit" class="btn btn-primary btn-sm"><i class="bi bi-plus"></i> Add</button>
          </form>
          <div id="candidatesList">
            ${candidates.length ? candidates.map(c => `
              <div class="d-flex justify-between align-items-center p-3 mb-2" style="background:var(--bg-tertiary);border-radius:var(--radius-md)">
                <div class="d-flex align-items-center gap-2">
                  ${c.avatar_url ? `<img src="${c.avatar_url}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover">` : ''}
                  <span class="fw-medium">${c.full_name||c.username||'User #'+c.user_id}</span>
                  ${c.position ? '<span class="text-xs text-tertiary ms-2">' + c.position + '</span>' : ''}
                  ${c.manifesto ? '<div class="text-xs text-tertiary mt-1">' + c.manifesto + '</div>' : ''}
                </div>
                <span class="text-xs text-tertiary">${c.vote_count||0} votes</span>
              </div>
            `).join('') : '<div class="text-center text-secondary py-4">No candidates yet</div>'}
          </div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  } catch(e) {
    alert(e.message || 'Failed to load candidates');
  }
}

async function searchCandidateUsers(query, electionId) {
  const resultsContainer = document.getElementById('candidateUserResults');
  if (!resultsContainer) return;
  if (query.length < 2) { resultsContainer.style.display = 'none'; return; }
  try {
    const r = await API.getUsers({ search: query, role: 'student', per_page: 10 });
    const users = r.users || r.data || r || [];
    if (!users.length) {
      resultsContainer.innerHTML = '<div class="text-xs text-secondary p-2">No users found</div>';
      resultsContainer.style.display = 'block';
      return;
    }
    resultsContainer.innerHTML = users.map(u => `
      <div class="p-2 d-flex align-items-center gap-2" style="cursor:pointer;border-radius:var(--radius-sm);background:var(--bg-tertiary);margin-bottom:2px"
           onmouseover="this.style.background='var(--bg-secondary)'" onmouseout="this.style.background='var(--bg-tertiary)'"
           onclick="selectCandidateUser(${u.id}, '${(u.name||u.full_name||u.username||'').replace(/'/g,"\\'")}')">
        ${u.avatar ? `<img src="${u.avatar}" alt="" style="width:24px;height:24px;border-radius:50%;object-fit:cover">` : ''}
        <span class="text-sm">${u.name||u.full_name||u.username} <span class="text-xs text-tertiary">#${u.id}</span></span>
        ${u.email ? '<span class="text-xs text-tertiary ms-2">' + u.email + '</span>' : ''}
      </div>
    `).join('');
    resultsContainer.style.display = 'block';
  } catch(e) {
    resultsContainer.style.display = 'none';
  }
}

function selectCandidateUser(userId, userName) {
  document.getElementById('newCandidateUserId').value = userId;
  const resultsContainer = document.getElementById('candidateUserResults');
  if (resultsContainer) resultsContainer.style.display = 'none';
}

async function handleAddCandidate(e, electionId) {
  e.preventDefault();
  const userId = document.getElementById('newCandidateUserId').value;
  const position = document.getElementById('newCandidatePosition').value;
  const manifesto = document.getElementById('newCandidateManifesto').value;
  try {
    await API.addCandidate(electionId, { user_id: userId, position, manifesto });
    document.getElementById('candidateModal').remove();
    manageCandidates(electionId);
  } catch(e) {
    alert(e.message || 'Failed to add candidate');
  }
}

async function showElectionResults(electionId) {
  try {
    const r = await API.getResults(electionId);
    const candidates = Array.isArray(r.results) ? r.results : [];
    const totalVotes = r.total_votes || 0;
    const participation = r.participation || {};
    const participationStr = participation.total_eligible ? `${participation.total_voted}/${participation.total_eligible} (${participation.percentage}%)` : 'N/A';
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.classList.add('show');
    overlay.id = 'resultsModal';
    overlay.onclick = function(e) { if (e.target === this) this.remove(); };
    overlay.innerHTML = `
      <div class="modal-content" style="max-width:560px;padding:0">
        <div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-primary)">
          <h5 style="margin:0">Election Results</h5>
          <button class="btn btn-sm btn-ghost" onclick="document.getElementById('resultsModal').remove()"><i class="bi bi-x-lg"></i></button>
        </div>
        <div style="padding:1.5rem">
          <div class="text-sm text-tertiary mb-3">Total votes: ${totalVotes} &bull; Participation: ${participationStr}</div>
          ${candidates.length ? candidates.map((c, i) => {
            const pct = c.percentage || (c.vote_count||0) / (totalVotes||1) * 100;
            return `
            <div class="p-3 mb-2" style="background:var(--bg-tertiary);border-radius:var(--radius-md)">
              <div class="d-flex justify-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                  <span class="badge ${i===0?'badge-success':'badge-gray'}">#${i+1}</span>
                  ${c.avatar_url ? `<img src="${c.avatar_url}" alt="" style="width:32px;height:32px;border-radius:50%;object-fit:cover">` : ''}
                  <span class="fw-medium">${c.full_name || c.username || 'User #' + c.candidate_id}</span>
                  ${c.position ? '<span class="text-xs text-tertiary">' + c.position + '</span>' : ''}
                </div>
                <div class="d-flex align-items-center gap-2">
                  <div class="progress" style="width:120px;height:8px"><div class="progress-bar green" style="width:${Math.min(pct,100)}%"></div></div>
                  <span class="text-sm fw-medium">${c.vote_count||0} (${Math.round(pct)}%)</span>
                </div>
              </div>
              ${c.voters?.length ? `
                <div class="mt-2 pt-2" style="border-top:1px solid var(--border-primary)">
                  <span class="text-xs text-tertiary">Voters</span>
                  <div class="d-flex flex-wrap gap-1 mt-1">
                    ${c.voters.map(v => `<span class="badge badge-gray text-xs">${v.full_name||v.username||'User #'+v.id}</span>`).join('')}
                  </div>
                </div>
              ` : ''}
            </div>`;
          }).join('') : '<div class="text-center text-secondary py-4">No results available</div>'}
        </div>
      </div>`;
    document.body.appendChild(overlay);
  } catch(e) {
    alert(e.message || 'Failed to load results');
  }
}

// Also load elections when switching to that panel
const _origSwitchPanel = switchSuperAdminPanel;
switchSuperAdminPanel = function(panel) {
  console.log('[WRAPPER] switchSuperAdminPanel wrapper called:', panel);
  _origSwitchPanel(panel);
  if (panel === 'lessons') setTimeout(loadLessonsPanel, 50);
  if (panel === 'challenges') setTimeout(loadSAChallenges, 50);
  if (panel === 'elections') setTimeout(loadElectionsPanel, 50);
  if (panel === 'users') { populateUserTable(); populateRoleAssign(); }
  if (panel === 'monitor-users') setTimeout(loadMonitorUsers, 50);
  if (panel === 'members') setTimeout(loadMemberDirectory, 50);
  if (panel === 'messages') setTimeout(AppPages.messagingLoaded, 50);
  if (panel === 'notifications') setTimeout(AppPages.notificationsLoaded, 50);
  if (panel === 'access') setTimeout(loadModuleRestrictions, 50);
  if (panel === 'video-courses') setTimeout(loadVideoCoursesPanel, 50);
  if (panel === 'claims') setTimeout(Dashboards._loadClaims, 50);
  if (panel === 'gallery') setTimeout(Dashboards._loadGallery, 50);
  // Update tab button active states
  document.querySelectorAll('.ga-tab').forEach(b => {
    b.classList.toggle('btn-primary', b.dataset.panel === panel);
    b.classList.toggle('btn-ghost', b.dataset.panel !== panel);
  });
};

Dashboards.opsManagerLoaded = function() {
  const canvas = document.getElementById('opsChart');
  if (canvas && typeof Chart !== 'undefined') {
    new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Response Time (ms)',
          data: [145, 132, 158, 128, 142, 118, 125],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          fill: true,
          tension: 0.4,
        }, {
          label: 'Error Rate (%)',
          data: [1.2, 0.8, 1.5, 0.5, 0.9, 0.3, 0.4],
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239,68,68,0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y1',
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
          y1: { beginAtZero: true, position: 'right', grid: { display: false }, ticks: { color: '#94a3b8', callback: v => v + '%' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
        },
      },
    });
  }
  this._loadStats('operations_manager');
};

// ===== Lessons Panel Functions =====
async function loadLessonsPanel() {
  const tbody = document.getElementById('lessonsTableBody');
  if (!tbody) return;
  const courseId = document.getElementById('lessonCourseFilter')?.value || '';
  try {
    const params = courseId ? { course_id: courseId } : {};
    const r = await API.getLessons(params);
    const list = r.lessons || r.data || [];
    const countDisplay = document.getElementById('lessonCountDisplay');
    if (countDisplay) countDisplay.textContent = list.length + ' lesson' + (list.length !== 1 ? 's' : '');
    // Populate course filter
    const filter = document.getElementById('lessonCourseFilter');
    if (filter && !filter.dataset.populated) {
      try {
        const coursesRes = await API.getCourses({ per_page: 100 });
        const courses = coursesRes.courses || [];
        filter.innerHTML = '<option value="">All Courses</option>' + courses.map(c => '<option value="' + c.id + '">' + c.code + ' - ' + c.name + '</option>').join('');
        if (courseId) filter.value = courseId;
      } catch(e) {}
      filter.dataset.populated = '1';
    }
    if (!list.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center text-secondary py-4">No lessons found</td></tr>';
      return;
    }
    tbody.innerHTML = list.map(l => {
      const ext = (l.original_filename || '').split('.').pop().toUpperCase();
      const size = l.file_size > 1048576 ? (l.file_size / 1048576).toFixed(1) + ' MB' : (l.file_size / 1024).toFixed(1) + ' KB';
      return '<tr>' +
        '<td>' + l.id + '</td>' +
        '<td class="fw-medium">' + (l.title || '') + '</td>' +
        '<td class="text-sm">' + (l.course_code || '') + '</td>' +
        '<td class="text-sm">' + (l.folder_name || '-') + '</td>' +
        '<td><a href="' + l.file_path + '" target="_blank" class="text-sm" title="' + (l.original_filename || '') + '"><i class="bi bi-file-earmark-' + (ext === 'PDF' ? 'pdf' : 'text') + ' me-1"></i>' + (l.original_filename || '') + '</a></td>' +
        '<td class="text-sm text-tertiary">' + size + '</td>' +
        '<td class="text-sm">' + (l.uploader_name || '') + '</td>' +
        '<td class="text-sm text-tertiary">' + UI.formatDate(l.created_at) + '</td>' +
        '<td><div class="d-flex gap-1"><button class="btn btn-sm btn-ghost text-danger" onclick="deleteLesson(' + l.id + ')" title="Delete"><i class="bi bi-trash"></i></button></div></td>' +
        '</tr>';
    }).join('');
  } catch(e) {
    console.error('Error loading lessons:', e);
    if (tbody) tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger py-4">' + (e.message || 'Failed to load lessons') + '</td></tr>';
  }
}

async function showUploadLessonModal(preSelectedFolderId) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.classList.add('show');
  overlay.id = 'uploadLessonModal';
  overlay.onclick = function(e) { if (e.target === this) this.remove(); };
  // Fetch courses and folders for dropdowns
  let courseOptions = '<option value="">-- Select Course --</option>';
  let folderOptions = '<option value="">No folder</option>';
  let preSelectedFolder = null;
  if (preSelectedFolderId) {
    try { preSelectedFolder = (await API.getLessonFolders({})).folders?.find(f => f.id === preSelectedFolderId) || null; } catch(e) {}
  }
  try {
    const [coursesRes, foldersRes] = await Promise.all([
      API.getCourses({ per_page: 100 }),
      preSelectedFolder ? Promise.resolve({ folders: [preSelectedFolder] }) : API.getLessonFolders({})
    ]);
    const courses = coursesRes.courses || [];
    courseOptions += courses.map(c => '<option value="' + c.id + '">' + c.code + ' - ' + c.name + '</option>').join('');
    const folders = preSelectedFolder ? [preSelectedFolder] : (foldersRes.folders || []);
    window._allLessonFolders = folders;
  } catch(e) { console.error('Failed to load data for modal:', e); }
  overlay.innerHTML = '<div class="modal-content" style="max-width:520px;padding:0">' +
    '<div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-primary)">' +
    '<h5 style="margin:0">Upload Files</h5>' +
    '<button class="btn btn-sm btn-ghost close-modal-btn"><i class="bi bi-x-lg"></i></button>' +
    '</div>' +
    '<form id="lessonUploadForm" style="padding:1.5rem">' +
    '<div class="form-group mb-3">' +
    '<label class="form-label">Course</label>' +
    '<select class="form-select" id="lessonCourse" required onchange="updateLessonFolderDropdown()">' + courseOptions + '</select>' +
    '</div>' +
    '<div class="form-group mb-3">' +
    '<label class="form-label">Folder</label>' +
    '<select class="form-select" id="lessonFolder">' + folderOptions + '</select>' +
    '</div>' +
    '<div class="form-group mb-3">' +
    '<label class="form-label">Title</label>' +
    '<input class="form-input" id="lessonTitle" required placeholder="e.g., Chapter 1 - Introduction">' +
    '</div>' +
    '<div class="form-group mb-3">' +
    '<label class="form-label">Description (optional)</label>' +
    '<textarea class="form-textarea" id="lessonDesc" rows="2" placeholder="Brief description..."></textarea>' +
    '</div>' +
    '<div class="form-group mb-4">' +
    '<label class="form-label">File (PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, CSV, ZIP)</label>' +
    '<input type="file" class="form-input" id="lessonFile" required accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.zip">' +
    '</div>' +
    '<div class="d-flex gap-3 justify-end">' +
    '<button type="button" class="btn btn-secondary close-modal-btn">Cancel</button>' +
    '<button type="submit" class="btn btn-primary"><i class="bi bi-cloud-arrow-up"></i> Upload</button>' +
    '</div>' +
    '</form>' +
    '</div>';
  document.body.appendChild(overlay);
  // Attach event listeners programmatically
  const form = document.getElementById('lessonUploadForm');
  if (form) form.addEventListener('submit', handleUploadLesson);
  overlay.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => { if (overlay.parentElement) overlay.remove(); });
  });
  // Populate folder dropdown and pre-select folder if specified
  updateLessonFolderDropdown();
  if (preSelectedFolder) {
    if (preSelectedFolder.course_id) {
      document.getElementById('lessonCourse').value = preSelectedFolder.course_id;
      updateLessonFolderDropdown();
    }
    const folderSelect = document.getElementById('lessonFolder');
    if (folderSelect) folderSelect.value = preSelectedFolder.id;
  }
}

function updateLessonFolderDropdown() {
  const courseId = document.getElementById('lessonCourse')?.value;
  const folderSelect = document.getElementById('lessonFolder');
  if (!folderSelect) return;
  const allFolders = window._allLessonFolders || [];
  const filtered = courseId ? allFolders.filter(f => String(f.course_id) === courseId) : allFolders;
  folderSelect.innerHTML = '<option value="">No folder</option>' +
    filtered.map(f => '<option value="' + f.id + '">' + f.name + '</option>').join('');
}

async function handleUploadLesson(e) {
  e.preventDefault();
  const courseEl = document.getElementById('lessonCourse');
  const titleEl = document.getElementById('lessonTitle');
  const descEl = document.getElementById('lessonDesc');
  const fileEl = document.getElementById('lessonFile');
  if (!courseEl || !titleEl || !fileEl) {
    alert('Form elements not found. Please close and try again.');
    return;
  }
  if (!fileEl.files || !fileEl.files[0]) {
    alert('Please select a file to upload.');
    return;
  }
  const folderEl = document.getElementById('lessonFolder');
  const fd = new FormData();
  fd.append('course_id', courseEl.value);
  fd.append('folder_id', folderEl ? folderEl.value : '');
  fd.append('title', titleEl.value);
  fd.append('description', descEl ? descEl.value : '');
  fd.append('file', fileEl.files[0]);
  const btn = e.target.querySelector('button[type="submit"]');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Uploading...'; }
  try {
    await API.createLesson(fd);
    const modal = document.getElementById('uploadLessonModal');
    if (modal && modal.parentElement) modal.remove();
    if (document.getElementById('lessonsFileManager')) { renderFileManager(); } else { loadLessonsPanel(); }
    UI.showToast('Success', 'Lesson uploaded successfully.', 'success');
  } catch(err) {
    console.error('Lesson upload error:', err);
    try { UI.showToast('Error', err.message || 'Failed to upload lesson', 'error'); } catch(e2) { alert('Upload failed: ' + (err.message || 'Unknown error')); }
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-cloud-arrow-up"></i> Upload'; }
  }
}

async function deleteLesson(id) {
  if (!confirm('Delete this lesson? The file will be permanently removed.')) return;
  try {
    await API.deleteLesson(id);
    loadLessonsPanel();
    UI.showToast('Deleted', 'Lesson deleted.', 'success');
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to delete lesson', 'error');
  }
}

// ===== Challenge Management =====
async function loadSAChallenges() {
  const tbody = document.getElementById('saChallengesBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    const statusFilter = document.getElementById('saChallengeStatusFilter');
    const difficultyFilter = document.getElementById('saChallengeDifficultyFilter');
    const params = {};
    if (statusFilter && statusFilter.value) params.status = statusFilter.value;
    if (difficultyFilter && difficultyFilter.value) params.difficulty = difficultyFilter.value;
    const res = await API.getChallenges(params);
    const challenges = res.challenges || [];
    if (!challenges.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-tertiary">No challenges found.</td></tr>';
      return;
    }
    tbody.innerHTML = challenges.map(c => {
      const difficultyBadge = { easy: 'success', medium: 'warning', hard: 'danger', expert: 'dark' }[c.difficulty] || 'gray';
      const statusBadge = c.status === 'open' ? 'success' : c.status === 'closed' ? 'danger' : 'gray';
      return '<tr>' +
        '<td>' + c.id + '</td>' +
        '<td>' + UI.escape(c.title) + '</td>' +
        '<td>' + UI.badge(c.difficulty, difficultyBadge) + '</td>' +
        '<td>' + c.xp_reward + '</td>' +
        '<td>' + UI.badge(c.status, statusBadge) + '</td>' +
        '<td>' + (c.link_url ? '<a href="' + UI.escape(c.link_url) + '" target="_blank" class="text-sm"><i class="bi bi-box-arrow-up-right"></i></a>' : '-') + '</td>' +
        '<td class="d-flex gap-1">' +
          '<button class="btn btn-ghost btn-xs text-primary" onclick="showSAEditChallengeModal(' + c.id + ')" title="Edit"><i class="bi bi-pencil"></i></button>' +
          '<button class="btn btn-ghost btn-xs text-danger" onclick="deleteSAChallenge(' + c.id + ')" title="Delete"><i class="bi bi-trash"></i></button>' +
        '</td>' +
      '</tr>';
    }).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error loading challenges.</td></tr>';
    console.error(e);
  }
}

async function showSACreateChallengeModal() {
  UI.showModal('Create Challenge', `
    <form id="saChallengeForm" onsubmit="handleSACreateChallenge(event)">
      <div class="mb-3">
        <label class="form-label">Title <span class="text-danger">*</span></label>
        <input type="text" class="form-input" name="title" required placeholder="e.g. Build a REST API">
      </div>
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-input" name="description" rows="3" placeholder="Challenge description..."></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Difficulty <span class="text-danger">*</span></label>
        <select class="form-input" name="difficulty" required>
          <option value="easy">Easy</option>
          <option value="medium" selected>Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">XP Reward <span class="text-danger">*</span></label>
        <input type="number" class="form-input" name="xp_reward" required value="100" min="1" max="10000">
      </div>
      <div class="mb-3">
        <label class="form-label">Image URL</label>
        <input type="url" class="form-input" name="image_url" placeholder="https://example.com/image.jpg">
      </div>
      <div class="mb-3">
        <label class="form-label">Link URL</label>
        <input type="url" class="form-input" name="link_url" placeholder="https://example.com/challenge">
      </div>
      <div class="mb-3">
        <label class="form-label">Status</label>
        <select class="form-input" name="status">
          <option value="draft">Draft</option>
          <option value="open" selected>Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Starter Code (optional)</label>
        <textarea class="form-input" name="starter_code" rows="4" placeholder="// Starter code..."></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Test Cases (JSON, optional)</label>
        <textarea class="form-input" name="test_cases" rows="3" placeholder='[{"input":"test","expected":"result"}]'></textarea>
      </div>
      <div class="mb-3">
        <label class="form-label">Due Date (optional)</label>
        <input type="datetime-local" class="form-input" name="due_at">
      </div>
      <button type="submit" class="btn btn-primary">Create Challenge</button>
    </form>
  `);
}

async function handleSACreateChallenge(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  if (data.test_cases) { try { data.test_cases = JSON.parse(data.test_cases); } catch(ex) { delete data.test_cases; } }
  if (!data.image_url) delete data.image_url;
  if (!data.link_url) delete data.link_url;
  if (!data.starter_code) delete data.starter_code;
  if (!data.due_at) delete data.due_at;
  try {
    await API.createChallenge(data);
    UI.closeModal();
    UI.showToast('Success', 'Challenge created successfully.', 'success');
    loadSAChallenges();
  } catch(err) {
    alert(err.message || 'Failed to create challenge');
  }
}

async function showSAEditChallengeModal(id) {
  try {
    const res = await API.getChallenge(id);
    const ch = res.challenge;
    if (!ch) { alert('Challenge not found.'); return; }
    UI.showModal('Edit Challenge #' + id, `
      <form id="saChallengeForm" onsubmit="handleSAEditChallenge(event, ${id})">
        <div class="mb-3">
          <label class="form-label">Title <span class="text-danger">*</span></label>
          <input type="text" class="form-input" name="title" required value="${UI.escape(ch.title)}">
        </div>
        <div class="mb-3">
          <label class="form-label">Description</label>
          <textarea class="form-input" name="description" rows="3">${UI.escape(ch.description || '')}</textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Difficulty <span class="text-danger">*</span></label>
          <select class="form-input" name="difficulty" required>
            ${['easy','medium','hard','expert'].map(d => '<option value="' + d + '"' + (ch.difficulty === d ? ' selected' : '') + '>' + d.charAt(0).toUpperCase() + d.slice(1) + '</option>').join('')}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">XP Reward <span class="text-danger">*</span></label>
          <input type="number" class="form-input" name="xp_reward" required value="${ch.xp_reward || 100}" min="1" max="10000">
        </div>
        <div class="mb-3">
          <label class="form-label">Image URL</label>
          <input type="url" class="form-input" name="image_url" value="${UI.escape(ch.image_url || '')}" placeholder="https://example.com/image.jpg">
        </div>
        <div class="mb-3">
          <label class="form-label">Link URL</label>
          <input type="url" class="form-input" name="link_url" value="${UI.escape(ch.link_url || '')}" placeholder="https://example.com/challenge">
        </div>
        <div class="mb-3">
          <label class="form-label">Status</label>
          <select class="form-input" name="status">
            ${['draft','open','closed'].map(s => '<option value="' + s + '"' + (ch.status === s ? ' selected' : '') + '>' + s.charAt(0).toUpperCase() + s.slice(1) + '</option>').join('')}
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Starter Code (optional)</label>
          <textarea class="form-input" name="starter_code" rows="4">${UI.escape(ch.starter_code || '')}</textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Test Cases (JSON, optional)</label>
          <textarea class="form-input" name="test_cases" rows="3">${ch.test_cases ? JSON.stringify(ch.test_cases) : ''}</textarea>
        </div>
        <div class="mb-3">
          <label class="form-label">Due Date (optional)</label>
          <input type="datetime-local" class="form-input" name="due_at" value="${ch.due_at ? ch.due_at.substring(0,16) : ''}">
        </div>
        <button type="submit" class="btn btn-primary">Update Challenge</button>
      </form>
    `);
  } catch(e) {
    alert(e.message || 'Failed to load challenge');
  }
}

async function handleSAEditChallenge(e, id) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = Object.fromEntries(fd.entries());
  if (data.test_cases) { try { data.test_cases = JSON.parse(data.test_cases); } catch(ex) { delete data.test_cases; } }
  if (!data.image_url) delete data.image_url;
  if (!data.link_url) delete data.link_url;
  if (!data.starter_code) delete data.starter_code;
  if (!data.due_at) delete data.due_at;
  try {
    await API.updateChallenge(id, data);
    UI.closeModal();
    UI.showToast('Success', 'Challenge updated.', 'success');
    loadSAChallenges();
  } catch(err) {
    alert(err.message || 'Failed to update challenge');
  }
}

async function deleteSAChallenge(id) {
  if (!confirm('Delete this challenge? This action cannot be undone.')) return;
  try {
    await API.deleteChallenge(id);
    UI.showToast('Deleted', 'Challenge deleted.', 'success');
    loadSAChallenges();
  } catch(e) {
    alert(e.message || 'Failed to delete challenge');
  }
}

// ===== Monitor Admin Panel Loaders =====
async function loadMonitorOverview() {
  try {
    const stats = await API.getSOCStats();
    const container = document.getElementById('statCards');
    if (container && stats) {
      const loginStats = stats.login_stats || {};
      const totalLogins = (parseInt(loginStats.successful) || 0) + (parseInt(loginStats.failed) || 0);
      const failedLogins = parseInt(loginStats.failed) || 0;
      const suspiciousCount = (stats.suspicious_ips || []).length;
      const blockedCount = stats.blocked_ips || 0;
      container.innerHTML =
        UI.statCard('bi-box-arrow-in-right', totalLogins, 'Total Logins (24h)', null, 'blue') +
        UI.statCard('bi-exclamation-triangle', failedLogins, 'Failed Logins', null, failedLogins > 0 ? 'red' : 'green') +
        UI.statCard('bi-shield-exclamation', suspiciousCount, 'Suspicious IPs', null, suspiciousCount > 0 ? 'yellow' : 'green') +
        UI.statCard('bi-slash-circle', blockedCount, 'Blocked IPs', null, blockedCount > 0 ? 'red' : 'green');
      UI.initCounters(container);
    }
  } catch(e) { console.error('Failed to load monitor stats:', e); }

  // Load system health
  try {
    const healthRes = await API.getSystemHealth();
    const services = healthRes.latest || [];
    const healthEl = document.getElementById('monitorSystemHealth');
    if (healthEl) {
      if (!services.length) {
        healthEl.innerHTML = '<div class="text-center text-tertiary text-sm">No health data</div>';
      } else {
        healthEl.innerHTML = services.map(s =>
          '<div class="d-flex justify-between items-center">' +
            '<span class="text-sm">' + (s.service_name || s.service) + '</span>' +
            '<div class="d-flex align-items-center gap-2">' +
              '<span class="status-indicator status-' + (s.status === 'up' ? 'online' : 'busy') + '"></span>' +
              '<span class="text-sm text-' + (s.status === 'up' ? 'success' : 'danger') + '">' + s.status + '</span>' +
              (s.response_time_ms ? '<span class="text-xs text-tertiary">' + s.response_time_ms + 'ms</span>' : '') +
            '</div>' +
          '</div>'
        ).join('');
      }
    }
  } catch(e) { console.error('Failed to load health:', e); }

  // Load recent activity
  const logs = stats.recent_logs || [];
  const activityEl = document.getElementById('monitorRecentActivity');
  if (activityEl) {
    if (!logs.length) {
      activityEl.innerHTML = '<div class="text-center text-tertiary text-sm">No recent activity</div>';
    } else {
      activityEl.innerHTML = logs.slice(0, 6).map(l =>
        '<div class="p-2" style="background:var(--bg-tertiary);border-radius:var(--radius-sm)">' +
          '<div class="d-flex justify-between"><span class="text-xs fw-medium">' + UI.escape(l.action) + '</span><span class="text-xs text-tertiary">' + UI.escape(l.username || '') + '</span></div>' +
          '<div class="text-xs text-tertiary mt-1">' + (l.created_at ? new Date(l.created_at).toLocaleString() : '') + '</div>' +
        '</div>'
      ).join('');
    }
  }

  // Load activity summary
  const summary = stats.activity_summary || [];
  const summaryEl = document.getElementById('monitorActivitySummary');
  if (summaryEl) {
    if (!summary.length) {
      summaryEl.innerHTML = '<div class="text-center text-tertiary text-sm">No activity data</div>';
    } else {
      summaryEl.innerHTML = summary.slice(0, 8).map(s =>
        '<div class="d-flex justify-between items-center p-1">' +
          '<span class="text-sm text-secondary">' + UI.escape(s.action) + '</span>' +
          '<span class="badge badge-info">' + (s.count || 0) + '</span>' +
        '</div>'
      ).join('');
    }
  }
}

async function loadMonitorAlerts() {
  const tbody = document.getElementById('monitorAlertsBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="7" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    const res = await API.getAlerts({ per_page: 100 });
    const alerts = res.alerts || [];
    const countEl = document.getElementById('monitorAlertCount');
    if (countEl) countEl.textContent = alerts.length + ' alerts';
    if (!alerts.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="text-center text-tertiary">No alerts found.</td></tr>';
      return;
    }
    tbody.innerHTML = alerts.map(a =>
      '<tr>' +
        '<td>' + a.id + '</td>' +
        '<td class="fw-medium">' + (a.title || 'Alert') + '</td>' +
        '<td class="text-sm text-secondary">' + (a.message || '') + '</td>' +
        '<td>' + UI.badge(a.severity, a.severity === 'critical' ? 'danger' : a.severity === 'high' ? 'warning' : a.severity === 'medium' ? 'info' : 'gray') + '</td>' +
        '<td>' + UI.badge(a.acknowledged ? 'Acknowledged' : 'Pending', a.acknowledged ? 'success' : 'warning') + '</td>' +
        '<td class="text-sm text-tertiary">' + (a.created_at ? new Date(a.created_at).toLocaleString() : '-') + '</td>' +
        '<td>' +
          (a.acknowledged ? '' : '<button class="btn btn-ghost btn-xs text-success" onclick="acknowledgeMonitorAlert(' + a.id + ')" title="Acknowledge"><i class="bi bi-check2"></i></button>') +
        '</td>' +
      '</tr>'
    ).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Error loading alerts.</td></tr>';
    console.error(e);
  }
}

async function acknowledgeMonitorAlert(id) {
  try {
    await API.acknowledgeAlert(id);
    UI.showToast('Acknowledged', 'Alert acknowledged.', 'success');
    loadMonitorAlerts();
  } catch(e) {
    alert(e.message || 'Failed to acknowledge alert');
  }
}

async function acknowledgeAllMonitorAlerts() {
  if (!confirm('Acknowledge all alerts?')) return;
  try {
    await API.acknowledgeAllAlerts();
    UI.showToast('Done', 'All alerts acknowledged.', 'success');
    loadMonitorAlerts();
  } catch(e) {
    alert(e.message || 'Failed to acknowledge alerts');
  }
}

async function loadMonitorLoginAttempts() {
  const tbody = document.getElementById('monitorLoginAttemptsBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="9" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    const successFilter = document.getElementById('monitorLoginFilterSuccess');
    const params = { per_page: 100 };
    if (successFilter && successFilter.value !== '') params.success = successFilter.value;
    const res = await API.getLoginAttempts(params);
    const attempts = res.attempts || [];
    if (!attempts.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center text-tertiary">No login attempts found.</td></tr>';
      return;
    }
    tbody.innerHTML = attempts.map(a => {
      const deviceIcon = a.device_type === 'mobile' ? 'bi-phone' : a.device_type === 'tablet' ? 'bi-tablet' : a.device_type === 'desktop' ? 'bi-laptop' : a.device_type === 'bot' ? 'bi-robot' : 'bi-question-circle';
      const deviceColor = a.device_type === 'mobile' ? 'info' : a.device_type === 'tablet' ? 'purple' : a.device_type === 'desktop' ? 'primary' : 'gray';
      return '<tr>' +
        '<td>' + a.id + '</td>' +
        '<td>' + (a.username || 'User#' + a.user_id || '-') + '</td>' +
        '<td class="text-mono text-xs">' + (a.ip_address || '-') + '</td>' +
        '<td>' + UI.badge(a.success ? 'Success' : 'Failed', a.success ? 'success' : 'danger') + '</td>' +
        '<td class="text-sm text-secondary">' + (a.fail_reason || '-') + '</td>' +
        '<td><span class="badge badge-' + deviceColor + '"><i class="bi ' + deviceIcon + '"></i> ' + (a.device_type || 'unknown') + '</span></td>' +
        '<td class="text-sm text-secondary">' + (a.os || '-') + '</td>' +
        '<td class="text-sm text-secondary">' + (a.browser || '-') + '</td>' +
        '<td class="text-sm text-tertiary">' + (a.created_at ? new Date(a.created_at).toLocaleString() : '-') + '</td>' +
      '</tr>';
    }).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-danger">Error loading login attempts.</td></tr>';
    console.error(e);
  }
}

async function loadMonitorActivityLogs() {
  const tbody = document.getElementById('monitorActivityLogsBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="8" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    const res = await API.getActivityLogs({ per_page: 100 });
    const logs = res.logs || [];
    if (!logs.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-tertiary">No activity logs found.</td></tr>';
      return;
    }
    tbody.innerHTML = logs.map(l => {
      const deviceIcon = l.device_type === 'mobile' ? 'bi-phone' : l.device_type === 'tablet' ? 'bi-tablet' : l.device_type === 'desktop' ? 'bi-laptop' : 'bi-question-circle';
      return '<tr>' +
        '<td>' + l.id + '</td>' +
        '<td>' + (l.full_name || l.username || 'User#' + l.user_id) + '</td>' +
        '<td class="text-sm"><code>' + UI.escape(l.action || '') + '</code></td>' +
        '<td class="text-sm">' + (l.entity_type || '-') + ' #' + (l.entity_id || '-') + '</td>' +
        '<td class="text-xs text-tertiary" style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + UI.escape(typeof l.details === 'object' ? JSON.stringify(l.details) : (l.details || '')) + '</td>' +
        '<td class="text-mono text-xs">' + (l.ip_address || '-') + '</td>' +
        '<td><span class="text-xs"><i class="bi ' + deviceIcon + '"></i> ' + (l.os || '-') + '</span></td>' +
        '<td class="text-sm text-tertiary">' + (l.created_at ? new Date(l.created_at).toLocaleString() : '-') + '</td>' +
      '</tr>';
    }).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error loading activity logs.</td></tr>';
    console.error(e);
  }
}

async function loadMonitorSuspiciousIps() {
  const tbody = document.getElementById('monitorSuspiciousIpsBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="4" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    const res = await API.getSuspiciousIPs(5);
    const ips = res.suspicious_ips || [];
    if (!ips.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="text-center text-tertiary">No suspicious IPs found.</td></tr>';
      return;
    }
    tbody.innerHTML = ips.map(ip =>
      '<tr>' +
        '<td class="text-mono">' + (ip.ip_address || '-') + '</td>' +
        '<td><span class="badge badge-danger">' + (ip.attempts || 0) + '</span></td>' +
        '<td class="text-sm text-tertiary">' + (ip.last_attempt ? new Date(ip.last_attempt).toLocaleString() : '-') + '</td>' +
        '<td><button class="btn btn-danger btn-xs" onclick="blockSuspiciousIp(\'' + UI.escape(ip.ip_address) + '\')"><i class="bi bi-shield-exclamation"></i> Block</button></td>' +
      '</tr>'
    ).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error loading suspicious IPs.</td></tr>';
    console.error(e);
  }
}

async function blockSuspiciousIp(ip) {
  if (!confirm('Block IP: ' + ip + '?')) return;
  try {
    await API.blockIP(ip, 'Blocked from SOC dashboard');
    UI.showToast('Blocked', 'IP ' + ip + ' blocked.', 'success');
    loadMonitorSuspiciousIps();
    loadMonitorBlockedIps();
  } catch(e) {
    alert(e.message || 'Failed to block IP');
  }
}

async function loadMonitorBlockedIps() {
  const tbody = document.getElementById('monitorBlockedIpsBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="5" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    const res = await API.getBlockedIPs({ per_page: 100 });
    const ips = res.blocked_ips || [];
    const countEl = document.getElementById('monitorBlockedIpCount');
    if (countEl) countEl.textContent = ips.length + ' blocked';
    if (!ips.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center text-tertiary">No blocked IPs found.</td></tr>';
      return;
    }
    tbody.innerHTML = ips.map(ip =>
      '<tr>' +
        '<td class="text-mono">' + (ip.ip_address || '-') + '</td>' +
        '<td class="text-sm">' + (ip.reason || '-') + '</td>' +
        '<td class="text-sm">' + (ip.blocked_by_name || 'System') + '</td>' +
        '<td class="text-sm text-tertiary">' + (ip.created_at ? new Date(ip.created_at).toLocaleString() : '-') + '</td>' +
        '<td><button class="btn btn-ghost btn-xs text-success" onclick="unblockMonitorIp(\'' + UI.escape(ip.ip_address) + '\')"><i class="bi bi-unlock"></i> Unblock</button></td>' +
      '</tr>'
    ).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error loading blocked IPs.</td></tr>';
    console.error(e);
  }
}

async function unblockMonitorIp(ip) {
  if (!confirm('Unblock IP: ' + ip + '?')) return;
  try {
    await API.unblockIP(ip);
    UI.showToast('Unblocked', 'IP ' + ip + ' unblocked.', 'success');
    loadMonitorBlockedIps();
  } catch(e) {
    alert(e.message || 'Failed to unblock IP');
  }
}

async function loadMonitorUsers() {
  const tbody = document.getElementById('monitorUsersBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="11" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    const res = await API.socGetUsers({ per_page: 100 });
    const users = res.users || [];
    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="11" class="text-center text-tertiary">No users found.</td></tr>';
      return;
    }
    tbody.innerHTML = users.map(u => {
      const deviceCount = (u.devices || []).length;
      const isNewIp = (u.new_ips || []).includes(u.last_login_ip);
      const deviceTypes = (u.device_summary || []).map(d => d.device_type);
      const hasMultiDevice = deviceTypes.length > 1;
      const deviceBadges = (u.devices || []).slice(0, 3).map(d => {
        const icon = d.device_type === 'mobile' ? 'bi-phone' : d.device_type === 'tablet' ? 'bi-tablet' : d.device_type === 'desktop' ? 'bi-laptop' : 'bi-question-circle';
        const color = d.device_type === 'mobile' ? 'info' : d.device_type === 'desktop' ? 'primary' : 'gray';
        return '<span class="badge badge-' + color + '" title="' + UI.escape(d.os || '') + ' ' + UI.escape(d.browser || '') + '"><i class="bi ' + icon + '"></i> ' + UI.escape((d.os || '').split(' ')[0]) + '</span>';
      }).join(' ');
      const ipBadge = isNewIp
        ? '<span class="badge badge-warning" title="New IP (first seen in last 7 days)"><i class="bi bi-exclamation-triangle"></i> NEW</span> ' + (u.last_login_ip || '-')
        : '<span class="text-mono text-xs">' + (u.last_login_ip || '-') + '</span>';

      return '<tr>' +
        '<td>' + u.id + '</td>' +
        '<td class="fw-medium">' + (u.username || '-') + '</td>' +
        '<td class="text-sm">' + (u.full_name || '-') + '</td>' +
        '<td class="text-sm">' + (u.role_slug || '-') + '</td>' +
        '<td>' + UI.badge(u.status || 'active', (u.status === 'active' ? 'success' : 'danger')) + '</td>' +
        '<td>' + ipBadge + '</td>' +
        '<td class="text-sm">' + deviceBadges + (hasMultiDevice ? ' <span class="badge badge-warning" title="Multiple device types detected"><i class="bi bi-layers"></i> Multi</span>' : '') + '</td>' +
        '<td class="text-sm text-tertiary">' + (u.last_login_at ? new Date(u.last_login_at).toLocaleString() : '-') + '</td>' +
        '<td>' + (u.failed_attempts_24h > 0 ? '<span class="badge badge-danger">' + u.failed_attempts_24h + '</span>' : '<span class="text-xs text-tertiary">0</span>') + '</td>' +
        '<td>' + (u.ip_blocked ? '<span class="badge badge-danger"><i class="bi bi-shield-exclamation"></i> Blocked</span>' : '') + '</td>' +
        '<td class="d-flex gap-1">' +
          (u.role_slug !== 'super_admin' && u.role_slug !== 'soc_team'
            ? (u.status === 'suspended'
                ? '<button class="btn btn-ghost btn-xs text-success" onclick="restoreMonitorUser(' + u.id + ')" title="Restore"><i class="bi bi-arrow-counterclockwise"></i></button>'
                : '<button class="btn btn-ghost btn-xs text-danger" onclick="suspendMonitorUser(' + u.id + ')" title="Suspend"><i class="bi bi-pause-circle"></i></button>')
            : '<span class="text-xs text-tertiary">-</span>') +
        '</td>' +
      '</tr>';
    }).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="11" class="text-center text-danger">Error loading users.</td></tr>';
    console.error(e);
  }
}

async function suspendMonitorUser(id) {
  if (!confirm('Suspend this user?')) return;
  try {
    await API.socSuspendUser(id);
    UI.showToast('Suspended', 'User suspended.', 'success');
    loadMonitorUsers();
  } catch(e) {
    alert(e.message || 'Failed to suspend user');
  }
}

async function restoreMonitorUser(id) {
  if (!confirm('Restore this user?')) return;
  try {
    await API.socRestoreUser(id);
    UI.showToast('Restored', 'User restored.', 'success');
    loadMonitorUsers();
  } catch(e) {
    alert(e.message || 'Failed to restore user');
  }
}

// ===== OPS USERS =====
async function loadOpsUsers() {
  const tbody = document.getElementById('opsUsersBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="8" class="text-center text-tertiary">Loading...</td></tr>';
  try {
    const searchEl = document.getElementById('opsUserSearch');
    const params = { per_page: 200 };
    if (searchEl && searchEl.value.trim()) params.search = searchEl.value.trim();
    const res = await API.socGetUsers(params);
    const users = res.users || [];
    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-tertiary">No users found.</td></tr>';
      return;
    }
    tbody.innerHTML = users.map(u =>
      '<tr>' +
        '<td>' + u.id + '</td>' +
        '<td class="fw-medium">' + (u.username || '-') + '</td>' +
        '<td class="text-sm">' + (u.full_name || '-') + '</td>' +
        '<td class="text-sm">' + (u.email || '-') + '</td>' +
        '<td>' + UI.badge(u.role_slug || '-', 'info') + '</td>' +
        '<td>' + UI.badge(u.status || 'active', (u.status === 'active' ? 'success' : 'danger')) + '</td>' +
        '<td class="text-sm text-tertiary">' + (u.created_at ? new Date(u.created_at).toLocaleDateString() : '-') + '</td>' +
        '<td class="d-flex gap-1">' +
          (u.role_slug !== 'super_admin' && u.role_slug !== 'soc_team'
            ? (u.status === 'suspended'
                ? '<button class="btn btn-ghost btn-xs text-success" onclick="restoreMonitorUser(' + u.id + ');loadOpsUsers()" title="Restore"><i class="bi bi-arrow-counterclockwise"></i></button>'
                : '<button class="btn btn-ghost btn-xs text-danger" onclick="suspendMonitorUser(' + u.id + ');loadOpsUsers()" title="Suspend"><i class="bi bi-pause-circle"></i></button>')
            : '<span class="text-xs text-tertiary">-</span>') +
        '</td>' +
      '</tr>'
    ).join('');
  } catch(e) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Error loading users.</td></tr>';
    console.error(e);
  }
}

// ===== Badge Updater =====
Dashboards.updateBadges = async function() {
  if (!DB.currentUser) return;
  try {
    const [msgCount, notifCount] = await Promise.all([
      API.getUnreadMessageCount(),
      API.getUnreadNotificationCount(),
    ]);
    // Sidebar badges
    const msgBadge = document.getElementById('badge-messages');
    if (msgBadge) {
      msgBadge.textContent = msgCount;
      msgBadge.style.display = msgCount > 0 ? 'inline-flex' : 'none';
    }
    const notifBadge = document.getElementById('badge-notifications');
    if (notifBadge) {
      notifBadge.textContent = notifCount;
      notifBadge.style.display = notifCount > 0 ? 'inline-flex' : 'none';
    }
    // Navbar badges
    const navbarMsg = document.getElementById('navbarMsgCount');
    if (navbarMsg) {
      navbarMsg.textContent = msgCount;
      navbarMsg.style.display = msgCount > 0 ? 'inline-flex' : 'none';
    }
    const navbarNotif = document.getElementById('navbarNotifCount');
    if (navbarNotif) {
      navbarNotif.textContent = notifCount;
      navbarNotif.style.display = notifCount > 0 ? 'inline-flex' : 'none';
    }
    const navbarNotifDot = document.getElementById('navbarNotifBadge');
    if (navbarNotifDot) {
      navbarNotifDot.style.display = notifCount > 0 ? 'inline-flex' : 'none';
    }
  } catch(e) { /* silent */ }
};

// Call updateBadges on interval
let _badgeInterval = null;
Dashboards.startBadgePolling = function() {
  Dashboards.stopBadgePolling();
  Dashboards.updateBadges();
  _badgeInterval = setInterval(() => Dashboards.updateBadges(), 15000);
};
Dashboards.stopBadgePolling = function() {
  if (_badgeInterval) { clearInterval(_badgeInterval); _badgeInterval = null; }
};

// ===== Student Claim Helpers =====
Dashboards._submitClaim = async function(reapply) {
  const input = document.getElementById('claimStudentId');
  let studentId = input ? input.value.trim() : '';
  if (!studentId) {
    const entered = prompt('Enter your student ID (e.g. CS2025XXXX):');
    if (!entered || !entered.trim()) return;
    studentId = entered.trim();
  }
  const btn = document.getElementById('claimStudentBtn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...'; }
  try {
    const result = await API.claimStudent(studentId);
    UI.showToast('Claim Submitted', result.message || 'Your claim has been submitted.', 'success');
    await Dashboards.userLoaded();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to submit claim.', 'error');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-patch-check me-2"></i>Claim Student Status'; }
  }
};

Dashboards._loadClaims = async function() {
  const tbody = document.getElementById('claimsTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="8" class="text-center text-tertiary py-4">Loading claims...</td></tr>';
  try {
    const data = await API._fetch('GET', '/admin/student-claims?status=pending');
    const claims = data.claims || [];
    if (!claims.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center text-tertiary py-4">No pending claims.</td></tr>';
      return;
    }
    tbody.innerHTML = claims.map(c => `
      <tr>
        <td class="text-sm text-mono fw-medium">${c.user_id}</td>
        <td class="text-sm fw-medium">${c.full_name || '-'}</td>
        <td class="text-sm text-mono">${c.student_id || '-'}</td>
        <td class="text-sm">@${c.username || '-'}</td>
        <td class="text-sm">${c.email || '-'}</td>
        <td class="text-sm text-tertiary">${c.user_since ? UI.formatDate(c.user_since) : '-'}</td>
        <td><span class="badge badge-warning">Pending</span></td>
        <td>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-success" onclick="Dashboards._approveClaim(${c.id})"><i class="bi bi-check-lg"></i> Approve</button>
            <button class="btn btn-sm btn-danger" onclick="Dashboards._denyClaim(${c.id})"><i class="bi bi-x-lg"></i> Deny</button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    console.error(e);
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger py-4">Failed to load claims.</td></tr>';
  }
};

Dashboards._approveClaim = async function(claimId) {
  if (!confirm('Approve this claim? The user will become a student.')) return;
  try {
    await API._fetch('POST', '/admin/student-claims/' + claimId + '/approve');
    UI.showToast('Approved', 'Claim approved. User is now a student.', 'success');
    Dashboards._loadClaims();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to approve.', 'error');
  }
};

Dashboards._denyClaim = async function(claimId) {
  const note = prompt('Reason for denial (required):');
  if (!note || !note.trim()) return;
  try {
    await API._fetch('POST', '/admin/student-claims/' + claimId + '/deny', { note: note.trim() });
    UI.showToast('Denied', 'Claim denied. User has been notified.', 'warning');
    Dashboards._loadClaims();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to deny.', 'error');
  }
};

// ===== Gallery Management =====
Dashboards._loadGallery = async function() {
  const tbody = document.getElementById('galleryTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="9" class="text-center text-tertiary py-4">Loading...</td></tr>';
  try {
    const data = await API.getGallery({ per_page: 200 });
    const items = data.items || [];
    if (!items.length) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center text-tertiary py-4">No gallery items yet.</td></tr>';
      return;
    }
    tbody.innerHTML = items.map(item => `
      <tr>
        <td class="text-sm text-mono">${item.id}</td>
        <td>${item.image_url ? `<img src="${item.image_url}" alt="" style="width:48px;height:48px;object-fit:cover;border-radius:6px">` : item.video_url ? '<i class="bi bi-play-circle" style="font-size:1.5rem;color:var(--text-tertiary)"></i>' : '<i class="bi bi-image" style="font-size:1.5rem;color:var(--text-tertiary)"></i>'}</td>
        <td class="text-sm fw-medium">${UI.escape(item.title)}</td>
        <td><span class="badge badge-${item.category === 'events' ? 'info' : item.category === 'academic' ? 'success' : 'warning'}">${item.category}</span></td>
        <td class="text-sm">${item.video_url ? '<span class="badge badge-danger"><i class="bi bi-play-circle me-1"></i>Video</span>' : '<span class="badge badge-primary"><i class="bi bi-camera me-1"></i>Photo</span>'}</td>
        <td>${item.status === 'published' ? '<span class="badge badge-success">Published</span>' : '<span class="badge badge-gray">Draft</span>'}</td>
        <td class="text-sm">${UI.escape(item.author_name || '-')}</td>
        <td class="text-sm text-tertiary">${UI.formatDate(item.created_at)}</td>
        <td>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-ghost" onclick="Dashboards._editGalleryItem(${item.id})" title="Edit"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-danger" onclick="Dashboards._deleteGalleryItem(${item.id})" title="Delete"><i class="bi bi-trash"></i></button>
          </div>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    console.error(e);
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-danger py-4">Failed to load gallery.</td></tr>';
  }
};

Dashboards._showAddGalleryItem = function() {
  const id = 'galleryFormModal';
  if (document.getElementById(id)) return;
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = id;
  modal.innerHTML = `
    <div class="modal" style="max-width:600px">
      <div class="modal-header"><h5 class="fw-bold"><i class="bi bi-plus-circle me-2"></i>Add Gallery Item</h5><button class="btn btn-ghost btn-sm" onclick="this.closest('.modal-overlay').remove()"><i class="bi bi-x-lg"></i></button></div>
      <div class="modal-body">
        <div class="d-flex flex-column gap-3">
          <div><label class="text-sm fw-medium mb-1 d-block">Title *</label><input type="text" class="form-control" id="galleryTitle" placeholder="Item title"></div>
          <div><label class="text-sm fw-medium mb-1 d-block">Description</label><textarea class="form-control" id="galleryDesc" rows="2" placeholder="Short description"></textarea></div>
          <div class="d-flex gap-3">
            <div style="flex:1"><label class="text-sm fw-medium mb-1 d-block">Category</label><select class="form-select" id="galleryCategory"><option value="events">Events</option><option value="academic">Academic</option><option value="social">Social</option></select></div>
            <div style="flex:1"><label class="text-sm fw-medium mb-1 d-block">Status</label><select class="form-select" id="galleryStatus"><option value="published">Published</option><option value="draft">Draft</option></select></div>
          </div>
          <div><label class="text-sm fw-medium mb-1 d-block">Author Name</label><input type="text" class="form-control" id="galleryAuthor" placeholder="Photographer name" value="${UI.escape(DB.currentUser?.full_name || DB.currentUser?.name || '')}"></div>
          <div class="d-flex gap-3">
            <div style="flex:1"><label class="text-sm fw-medium mb-1 d-block">Upload Image</label><input type="file" class="form-control" id="galleryImage" accept="image/jpeg,image/png,image/gif,image/webp"></div>
            <div style="flex:1"><label class="text-sm fw-medium mb-1 d-block">Or Video URL</label><input type="text" class="form-control" id="galleryVideoUrl" placeholder="https://www.youtube.com/embed/..."></div>
          </div>
        </div>
      </div>
      <div class="modal-footer d-flex gap-2 justify-end">
        <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="Dashboards._saveGalleryItem()"><i class="bi bi-check-lg"></i> Save</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
};

Dashboards._saveGalleryItem = async function() {
  const title = document.getElementById('galleryTitle')?.value?.trim();
  if (!title) { UI.showToast('Error', 'Title is required.', 'error'); return; }
  const btn = document.querySelector('#galleryFormModal .btn-primary');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Saving...'; }
  try {
    const data = {
      title,
      description: document.getElementById('galleryDesc')?.value?.trim() || null,
      category: document.getElementById('galleryCategory')?.value || 'events',
      status: document.getElementById('galleryStatus')?.value || 'published',
      author_name: document.getElementById('galleryAuthor')?.value?.trim() || null,
      video_url: document.getElementById('galleryVideoUrl')?.value?.trim() || null,
    };
    const result = await API.createGalleryItem(data);
    const item = result.item;
    const fileInput = document.getElementById('galleryImage');
    if (fileInput?.files?.[0] && item?.id) {
      await API.uploadGalleryImage(item.id, fileInput.files[0]);
    }
    document.getElementById('galleryFormModal')?.remove();
    UI.showToast('Success', 'Gallery item created.', 'success');
    Dashboards._loadGallery();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to save.', 'error');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-check-lg"></i> Save'; }
  }
};

Dashboards._deleteGalleryItem = async function(id) {
  if (!confirm('Delete this gallery item?')) return;
  try {
    await API.deleteGalleryItem(id);
    UI.showToast('Deleted', 'Gallery item deleted.', 'success');
    Dashboards._loadGallery();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to delete.', 'error');
  }
};

Dashboards._editGalleryItem = async function(id) {
  try {
    const res = await API.getGalleryItem(id);
    const item = res.item;
    if (!item) { UI.showToast('Error', 'Item not found.', 'error'); return; }
    const existingModal = document.getElementById('galleryFormModal');
    if (existingModal) existingModal.remove();
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'galleryFormModal';
    modal.innerHTML = `
      <div class="modal" style="max-width:600px">
        <div class="modal-header"><h5 class="fw-bold"><i class="bi bi-pencil me-2"></i>Edit Gallery Item</h5><button class="btn btn-ghost btn-sm" onclick="this.closest('.modal-overlay').remove()"><i class="bi bi-x-lg"></i></button></div>
        <div class="modal-body">
          <div class="d-flex flex-column gap-3">
            <div><label class="text-sm fw-medium mb-1 d-block">Title *</label><input type="text" class="form-control" id="galleryTitle" value="${UI.escape(item.title)}"></div>
            <div><label class="text-sm fw-medium mb-1 d-block">Description</label><textarea class="form-control" id="galleryDesc" rows="2">${UI.escape(item.description || '')}</textarea></div>
            <div class="d-flex gap-3">
              <div style="flex:1"><label class="text-sm fw-medium mb-1 d-block">Category</label><select class="form-select" id="galleryCategory"><option value="events" ${item.category === 'events' ? 'selected' : ''}>Events</option><option value="academic" ${item.category === 'academic' ? 'selected' : ''}>Academic</option><option value="social" ${item.category === 'social' ? 'selected' : ''}>Social</option></select></div>
              <div style="flex:1"><label class="text-sm fw-medium mb-1 d-block">Status</label><select class="form-select" id="galleryStatus"><option value="published" ${item.status === 'published' ? 'selected' : ''}>Published</option><option value="draft" ${item.status === 'draft' ? 'selected' : ''}>Draft</option></select></div>
            </div>
            <div><label class="text-sm fw-medium mb-1 d-block">Author Name</label><input type="text" class="form-control" id="galleryAuthor" value="${UI.escape(item.author_name || '')}"></div>
            <div class="d-flex gap-3">
              <div style="flex:1"><label class="text-sm fw-medium mb-1 d-block">Upload Image</label><input type="file" class="form-control" id="galleryImage" accept="image/jpeg,image/png,image/gif,image/webp">${item.image_url ? `<div class="mt-1 text-xs text-tertiary">Current: ${item.image_url.split('/').pop()}</div>` : ''}</div>
              <div style="flex:1"><label class="text-sm fw-medium mb-1 d-block">Or Video URL</label><input type="text" class="form-control" id="galleryVideoUrl" value="${UI.escape(item.video_url || '')}"></div>
            </div>
          </div>
        </div>
        <div class="modal-footer d-flex gap-2 justify-end">
          <button class="btn btn-ghost" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="Dashboards._updateGalleryItem(${id})"><i class="bi bi-check-lg"></i> Update</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to load item.', 'error');
  }
};

Dashboards._updateGalleryItem = async function(id) {
  const title = document.getElementById('galleryTitle')?.value?.trim();
  if (!title) { UI.showToast('Error', 'Title is required.', 'error'); return; }
  const btn = document.querySelector('#galleryFormModal .btn-primary');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Updating...'; }
  try {
    const data = {
      title,
      description: document.getElementById('galleryDesc')?.value?.trim() || null,
      category: document.getElementById('galleryCategory')?.value || 'events',
      status: document.getElementById('galleryStatus')?.value || 'published',
      author_name: document.getElementById('galleryAuthor')?.value?.trim() || null,
      video_url: document.getElementById('galleryVideoUrl')?.value?.trim() || null,
    };
    await API.updateGalleryItem(id, data);
    const fileInput = document.getElementById('galleryImage');
    if (fileInput?.files?.[0]) {
      await API.uploadGalleryImage(id, fileInput.files[0]);
    }
    document.getElementById('galleryFormModal')?.remove();
    UI.showToast('Success', 'Gallery item updated.', 'success');
    Dashboards._loadGallery();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to update.', 'error');
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="bi bi-check-lg"></i> Update'; }
  }
};

// ===== Explicit window bindings for inline onclick handlers =====
// Inline onclick attributes resolve against window.*, not script scope.
// Ensure every function called from HTML onclick is on window.
window.switchSuperAdminPanel = switchSuperAdminPanel;
window.loadQuizManagePanel = loadQuizManagePanel;
window.renderQuizManageTable = renderQuizManageTable;
window.filterQuizManage = filterQuizManage;
window.editQuizSkill = editQuizSkill;
window.viewQuizQuestions = viewQuizQuestions;
window.saveQuizSkill = saveQuizSkill;
window.addQuizQuestion = addQuizQuestion;
window.deleteQuizQuestion = deleteQuizQuestion;
window.showAddQuizSkillModal = showAddQuizSkillModal;
window.addNewQuizSkill = addNewQuizSkill;
window.loadYtManagePanel = loadYtManagePanel;
window.renderYtManageTable = renderYtManageTable;
window.filterYtManage = filterYtManage;
window.editYtSkill = editYtSkill;
window.saveYtSkill = saveYtSkill;
window.deleteYtSkill = deleteYtSkill;
window.viewYtVideos = viewYtVideos;
window.showAddYtVideo = showAddYtVideo;
window.saveYtVideo = saveYtVideo;
window.editYtVideo = editYtVideo;
window.saveEditYtVideo = saveEditYtVideo;
window.deleteYtVideo = deleteYtVideo;
window.showAddYtSkillModal = showAddYtSkillModal;
window.addNewYtSkill = addNewYtSkill;
window.loadLessonsPanel = loadLessonsPanel;
window.showUploadLessonModal = showUploadLessonModal;
window.deleteLesson = deleteLesson;
window.loadSAChallenges = loadSAChallenges;
window.loadElectionsPanel = loadElectionsPanel;
window.populateUserTable = populateUserTable;
window.populateRoleAssign = populateRoleAssign;
window.loadMonitorUsers = loadMonitorUsers;
window.loadMemberApprovals = loadMemberApprovals;
window.loadModuleRestrictions = loadModuleRestrictions;
window.saveModuleRestriction = saveModuleRestriction;
window.toggleSidebar = toggleSidebar;
window.handleLogout = handleLogout;
window.handleGlobalSearch = handleGlobalSearch;
window.removeDashboardAvatar = removeDashboardAvatar;
window.initAvatarUpload = initAvatarUpload;
window.populateContentTable = populateContentTable;
window.populateAuditLogs = populateAuditLogs;
window.populateAuditUserFilter = populateAuditUserFilter;
window.toggleDropdown = toggleDropdown;
window.refreshBottomNav = refreshBottomNav;
window.showSACreateChallengeModal = showSACreateChallengeModal;
window.showCreateElectionModal = showCreateElectionModal;
window.manageCandidates = manageCandidates;
window.showElectionResults = showElectionResults;
window.deleteElection = deleteElection;
window.showEditElectionModal = showEditElectionModal;
window.refreshFinancialPanel = refreshFinancialPanel;
window.showCreateMonthModal = showCreateMonthModal;
window.submitFinancialMonth = submitFinancialMonth;
window.exportFinancialPdf = exportFinancialPdf;
window.exportFinancialCsv = exportFinancialCsv;
window.filterFinancialStudents = filterFinancialStudents;
window.setAnalyticsFilter = setAnalyticsFilter;
window.exportAnalyticsPDF = exportAnalyticsPDF;
window.exportAnalyticsExcel = exportAnalyticsExcel;
window.exportAuditLogs = exportAuditLogs;
window.exportRoleHistory = exportRoleHistory;
window.blockIP = blockIP;
window.triggerBackup = triggerBackup;
window.restoreBackup = restoreBackup;
window.downloadLogs = downloadLogs;
window.toggleSystemConfig = toggleSystemConfig;
window.saveIPRules = saveIPRules;
window.saveEmailConfig = saveEmailConfig;
window.saveSecurityControls = saveSecurityControls;
window.switchEdPanel = switchEdPanel;
window.assignRole = assignRole;
window.bulkAssignRole = bulkAssignRole;
window.acknowledgeAllMonitorAlerts = acknowledgeAllMonitorAlerts;
window.loadMonitorAlerts = loadMonitorAlerts;
window.loadMonitorLoginAttempts = loadMonitorLoginAttempts;
window.loadMonitorActivityLogs = loadMonitorActivityLogs;
window.loadMonitorSuspiciousIps = loadMonitorSuspiciousIps;
window.loadMonitorBlockedIps = loadMonitorBlockedIps;
window.loadEdCourses = loadEdCourses;
window.loadEdEnrollments = loadEdEnrollments;
window.loadEdDepartments = loadEdDepartments;
window.loadEdSemesters = loadEdSemesters;
window.loadEdGrades = loadEdGrades;
window.loadEdLeaderboard = loadEdLeaderboard;
window.loadEdLessons = loadEdLessons;
window.showEdCreateCourseModal = showEdCreateCourseModal;
window.showEdCreateEnrollmentModal = showEdCreateEnrollmentModal;
window.showEdCreateDepartmentModal = showEdCreateDepartmentModal;
window.showEdCreateSemesterModal = showEdCreateSemesterModal;
window.showEdCreateGradeModal = showEdCreateGradeModal;
window.showEdAwardXpModal = showEdAwardXpModal;
window.loadVideoCoursesPanel = loadVideoCoursesPanel;
window.renderVcSkillGrid = renderVcSkillGrid;
window.openVcSkill = openVcSkill;
window.playVcVideo = playVcVideo;
window.renderVcManageTable = renderVcManageTable;
window.filterVideoCourses = filterVideoCourses;
window.switchVcMode = switchVcMode;
window.showAddYtSkillModalUnified = showAddYtSkillModalUnified;
window.saveNewVcSkill = saveNewVcSkill;
window.showCreateLessonFolderModal = showCreateLessonFolderModal;
window.deleteEdLesson = deleteEdLesson;
window.deleteLessonFolder = deleteLessonFolder;
window.showEditLessonFolderModal = showEditLessonFolderModal;
window.handleCreateLessonFolder = handleCreateLessonFolder;
window.handleEditLessonFolder = handleEditLessonFolder;
window.updateLessonFolderDropdown = updateLessonFolderDropdown;
window.renderFileManager = renderFileManager;
window.fmNavigateToFolder = fmNavigateToFolder;
window.fmNavigateToRoot = fmNavigateToRoot;
window.handleFmDrop = handleFmDrop;

window.loadMemberDirectory = loadMemberDirectory;
window.memberDirEdit = memberDirEdit;
window.memberDirSave = memberDirSave;
window.memberDirDelete = memberDirDelete;
window.memberDirRefresh = memberDirRefresh;
window.memberDirResetFilters = memberDirResetFilters;
window.memberDirSearchDebounced = memberDirSearchDebounced;

// Init all dashboard charts on window resize
window.addEventListener('resize', () => {
  // Chart.js handles responsive automatically
});

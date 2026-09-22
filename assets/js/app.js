/* ============================================
   CS15 Hub - Main Application & Router
   Jazeera University - CS Batch 15 Portal
   ============================================ */
setTimeout(() => {
  if (typeof renderMobileBottomNav === "function") {
    renderMobileBottomNav();
  }
}, 500);
class Router {
  constructor() {
    this.currentPath = '/';
    this.params = {};
    this.routes = {};
    this.beforeHooks = [];
  }

  register(path, handler, afterHook = null) {
    this.routes[path] = { handler, afterHook };
  }

  use(fn) {
    this.beforeHooks.push(fn);
  }

  async navigate(path) {
    path = this._normalize(path);
    if (window.location.hash.slice(1) === path) {
      this.resolve(path).catch(e => {
        console.error('Navigation error:', e);
        UI.hideLoader();
        document.getElementById('app').innerHTML = '<div class="d-flex flex-column align-items-center justify-content-center" style="min-height:100vh;padding:2rem"><div class="display-1 fw-bold text-danger">!</div><h3>Navigation Error</h3><p class="text-secondary">' + (e.message || e) + '</p></div>';
      });
      return;
    }
    window.location.hash = path;
  }

  _normalize(path) {
    return '/' + path.replace(/^\/|\/$/g, '').split('/').filter(Boolean).join('/');
  }

  async resolve(path) {
    path = this._normalize(path);
    this.currentPath = path;
    this.params = {};

    for (const hook of this.beforeHooks) {
      const result = hook(path);
      if (result === false) return;
    }

    const parts = path.split('/').filter(Boolean);
    let route = this.routes[path];

    // Dynamic routes: /posts/{slug}
    if (!route && parts[0] === 'posts' && parts[1] && parts[1] !== 'filter' && parts[1] !== 'create') {
      this.params.slug = parts[1];
      route = this.routes['/posts/:slug'];
    }

    // /posts/filter/{type}
    if (!route && parts[0] === 'posts' && parts[1] === 'filter' && parts[2]) {
      this.params.type = parts[2];
      route = this.routes['/posts'];
    }

    // Dynamic routes: /courses/learn/{id}
    if (!route && parts[0] === 'courses' && parts[1] === 'learn' && parts[2]) {
      this.params.id = parts[2];
      route = this.routes['/courses/learn/:id'];
    }

    if (route) {
      const { handler, afterHook } = route;
      UI.showLoader(true);
      try {
        const html = typeof handler === 'function' ? handler() : handler;
        document.getElementById('app').innerHTML = html;
        if (afterHook) setTimeout(() => afterHook(), 50);
        setTimeout(() => { if (typeof updateBottomNavActive === 'function') updateBottomNavActive(); }, 80);
        this.scrollTop();
      } catch (e) {
        console.error('Route handler error:', e);
        UI.hideLoader();
        document.getElementById('app').innerHTML = `
          <div class="d-flex flex-column align-items-center justify-content-center" style="min-height:100vh;padding:2rem">
            <div class="display-1 fw-bold text-danger">!</div>
            <h3 class="mt-3">Something went wrong</h3>
            <p class="text-secondary mt-2">${e.message || e}</p>
            <p class="text-xs text-tertiary mt-1">Route: ${path}</p>
            <div class="d-flex gap-3 mt-4">
              <button class="btn btn-primary" onclick="router.navigate('/')"><i class="bi bi-house"></i> Go Home</button>
              <button class="btn btn-secondary" onclick="history.back()"><i class="bi bi-arrow-left"></i> Go Back</button>
            </div>
          </div>`;
      }
      return;
    }

    this.show404();
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  show404() {
    document.getElementById('app').innerHTML = `
      <div class="d-flex flex-column align-items-center justify-content-center" style="min-height:100vh">
        <div class="display-1 fw-bold text-tertiary">404</div>
        <h3 class="mt-3">Page Not Found</h3>
        <p class="text-secondary mt-2">The page you're looking for doesn't exist.</p>
        <div class="d-flex gap-3 mt-4">
          <button class="btn btn-primary" onclick="router.navigate('/')"><i class="bi bi-house"></i> Go Home</button>
          <button class="btn btn-secondary" onclick="history.back()"><i class="bi bi-arrow-left"></i> Go Back</button>
        </div>
      </div>
    `;
  }
}

// ========== Initialize Application ==========
const router = new Router();
window.router = router; // Make accessible from inline onclick handlers

// ----- Before Hook: Auth Check -----
router.use((path) => {
  // Public paths that don't need auth
  const publicPaths = ['/', '/about', '/projects', '/gallery', '/members', '/contact', '/login', '/register', '/forgot-password'];
  const publicPrefixes = ['/posts/'];

  const isPublic = publicPaths.includes(path) || publicPrefixes.some(p => path.startsWith(p));

  // Auth pages redirect if logged in
  if (['/login', '/register', '/forgot-password'].includes(path) && DB.currentUser) {
    // Don't redirect yet - let it render, user might want to see
  }

  // Protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/member-profile', '/messages', '/settings', '/notifications', '/challenges', '/elections', '/portfolio', '/posts/create', '/courses', '/students', '/assignments', '/lessons', '/grades', '/leaderboard', '/alerts', '/logs', '/iptracking', '/reports', '/timeline', '/soc-users', '/soc-user-detail'];
  const protectedPrefixes = ['/dashboard', '/profile', '/member-profile', '/messages', '/settings', '/notifications', '/alerts', '/logs', '/iptracking', '/reports', '/timeline', '/soc-users', '/soc-user-detail'];

  const needsAuth = protectedRoutes.includes(path) || protectedPrefixes.some(p => path.startsWith(p));

  if (needsAuth && !DB.currentUser) {
    router.navigate('/login');
    return false;
  }
});

// ========== Register Routes ==========

// ----- Public Routes -----
router.register('/', () => PublicPages.home(), () => PublicPages.homeLoaded());
router.register('/about', () => PublicPages.about(), () => PublicPages.aboutLoaded());
router.register('/projects', () => PublicPages.projects(), () => PublicPages.projectsLoaded());
router.register('/gallery', () => PublicPages.gallery(), () => PublicPages.galleryLoaded());
router.register('/members', () => PublicPages.members(), () => PublicPages.membersLoaded());
router.register('/contact', () => PublicPages.contact(), () => PublicPages.contactLoaded());

// ----- Auth Routes -----
router.register('/login', () => AuthPages.login(), () => {
  // Check for Google OAuth error params
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split('?')[1] || '');
  const error = params.get('error');
  if (error) {
    const messages = {
      access_denied: 'Google sign-in was cancelled.',
      invalid_state: 'Invalid sign-in state. Please try again.',
      token_exchange_failed: 'Failed to authenticate with Google.',
      user_info_failed: 'Could not retrieve your Google profile.',
      missing_params: 'Missing authentication parameters.',
      account_suspended: 'Your account has been suspended.',
      account_deleted: 'This account no longer exists.',
    };
    UI.showToast('Sign In Failed', messages[error] || error, 'error');
    // Clean up the URL
    history.replaceState(null, '', window.location.pathname + '#/login');
  }
});
router.register('/register', () => AuthPages.register());
router.register('/forgot-password', () => AuthPages.forgotPassword());
router.register('/terms', () => AuthPages.terms());
router.register('/privacy', () => AuthPages.privacy());

// ----- Google OAuth Callback -----
router.register('/auth/callback', () => {
  // Token is passed as query param: /#/auth/callback?token=xxx
  const hash = window.location.hash;
  const params = new URLSearchParams(hash.split('?')[1] || '');
  const token = params.get('token');

  if (token) {
    API._setToken(token);
    API.restoreSession().then(async user => {
      if (user) {
        if (typeof refreshBottomNav === 'function') refreshBottomNav();
        try {
          const status = await API.getClaimStatus();
          if (status && status.claim === null && status.can_claim) {
            router.navigate('/auth/claim');
            return;
          }
        } catch (e) {}
        router.navigate('/dashboard');
      } else {
        router.navigate('/login');
      }
    }).catch(() => router.navigate('/login'));
  } else {
    router.navigate('/login');
  }

  return '<div class="d-flex align-items-center justify-content-center" style="min-height:80vh"><div class="spinner-border text-primary"></div><span class="ms-3 text-secondary">Signing you in...</span></div>';
});

// ----- Google OAuth: optional student claim step -----
router.register('/auth/claim', () => AuthPages.claim(), () => {
  API.getClaimStatus().then(s => {
    if (!DB.currentUser || (s && s.claim)) router.navigate('/dashboard');
  }).catch(() => {});
});

// ----- Dashboard Route (role-based) -----
router.register('/dashboard', () => {
  const role = DB.currentUser?.role || 'student';
  // Role-specific dashboards
  const roleDashboards = {
    user: () => Dashboards.user(),
    student: () => Dashboards.student(),
    teacher: () => Dashboards.teacher(),
    financial_admin: () => Dashboards.financial_admin(),
    educational_admin: () => Dashboards.educational_admin(),
    general_admin: () => Dashboards.general_admin(),
    monitor_admin: () => Dashboards.monitor_admin(),
    sports_admin: () => Dashboards.sports_admin(),
    super_admin: () => Dashboards.super_admin(),
    soc: () => Dashboards.soc(),
    operations_manager: () => Dashboards.operations_manager(),
  };
  return (roleDashboards[role] || Dashboards.user)();
}, () => {
  const role = DB.currentUser?.role || 'student';
  // Trigger the correct loader
  const loaders = {
    user: () => Dashboards.userLoaded(),
    student: () => Dashboards.studentLoaded(),
    teacher: () => Dashboards.teacherLoaded(),
    financial_admin: () => Dashboards.financialAdminLoaded(),
    educational_admin: () => Dashboards.eduAdminLoaded(),
    general_admin: () => Dashboards.genericLoaded(),
    monitor_admin: () => Dashboards.monitorAdminLoaded(),
    sports_admin: () => Dashboards.sportsAdminLoaded(),
    super_admin: () => Dashboards.superAdminLoaded(),
    soc: () => Dashboards.socLoaded(),
    operations_manager: () => Dashboards.opsManagerLoaded(),
  };
  (loaders[role] || Dashboards.genericLoaded)();
});

router.register('/dashboard/user', () => Dashboards.user(), () => Dashboards.userLoaded());

// ----- App Routes -----
router.register('/profile', () => AppPages.profile(), () => AppPages.profileLoaded());
router.register('/posts', () => AppPages.posts(), () => AppPages.postsLoaded());
router.register('/posts/create', () => AppPages.postCreate());
router.register('/posts/:slug', () => AppPages.postSingle(), () => AppPages.postSingleLoaded());
router.register('/portfolio', () => AppPages.portfolio(), () => AppPages.portfolioLoaded());
router.register('/challenges', () => AppPages.challenges(), () => AppPages.challengesLoaded());
router.register('/messages', () => AppPages.messaging(), () => AppPages.messagingLoaded());
router.register('/elections', () => AppPages.elections(), () => AppPages.electionsLoaded());
router.register('/notifications', () => AppPages.notifications(), () => AppPages.notificationsLoaded());
router.register('/grades', () => AppPages.grades(), () => AppPages.gradesLoaded());
router.register('/leaderboard', () => AppPages.leaderboard(), () => AppPages.leaderboardLoaded());
router.register('/settings', () => AppPages.settings());
router.register('/courses', () => AppPages.courses(), () => AppPages.coursesLoaded());
router.register('/courses/learn/:id', () => AppPages.courseLearn(), () => AppPages.courseLearnLoaded());
router.register('/students', () => AppPages.students(), () => AppPages.studentsLoaded());
router.register('/assignments', () => AppPages.assignments(), () => AppPages.assignmentsLoaded());
router.register('/lessons', () => AppPages.lessons(), () => AppPages.lessonsLoaded());
router.register('/member-profile', () => AppPages.memberProfile(), () => AppPages.memberProfileLoaded());
router.register('/quiz', () => AppPages.quiz(), () => AppPages.quizLoaded());
router.register('/videos', () => AppPages.videos(), () => AppPages.videosLoaded());

// ----- SOC Routes -----
router.register('/alerts', () => Dashboards.socAlerts(), () => Dashboards.socAlertsLoaded());
router.register('/logs', () => Dashboards.socLogs(), () => Dashboards.socLogsLoaded());
router.register('/iptracking', () => Dashboards.socIPTracking(), () => Dashboards.socIPTrackingLoaded());
router.register('/reports', () => Dashboards.socReports(), () => Dashboards.socReportsLoaded());
router.register('/timeline', () => Dashboards.socTimeline(), () => Dashboards.socTimelineLoaded());
router.register('/soc-users', () => Dashboards.socUsers(), () => Dashboards._socLoadUsers());
router.register('/soc-user-detail', () => Dashboards.socUserDetail(), () => Dashboards._socLoadDetail());

// ========== Hash Change Handler ==========
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1) || '/';
  router.resolve(hash).catch(e => {
    console.error('Hash change handler error:', e);
    UI.hideLoader();
    router.show404();
  });
});

// ========== Initialize App ==========
(async function init() {
  try {
    // Restore session
    const user = await API.restoreSession();

    // Start badge polling if logged in
    if (user && typeof Dashboards !== 'undefined') {
      Dashboards.startBadgePolling();
    }

    // Get initial path from hash, or try window location path, or default to /
    let initialPath = window.location.hash.slice(1) || '/';

    // If no hash and user is logged in, try to use URL path as SPA route
    if (!window.location.hash && user) {
      const base = window.BASE_URL || '';
      const path = window.location.pathname;
      // Skip if we're on the base URL itself (e.g. /B15/ or /)
      const baseWithSlash = base ? base + '/' : '/';
      if (path !== baseWithSlash && path !== base && path !== base + '/index.php') {
        let pathname = path;
        if (base) pathname = pathname.replace(base, '');
        pathname = '/' + pathname.replace(/^\/|\/$/g, '').split('/').filter(Boolean).join('/');
        if (pathname !== '/' && pathname !== '/index.php') {
          initialPath = pathname;
          history.replaceState(null, '', '#' + pathname);
        }
      }
    }

    // If user is logged in and on root, go to dashboard
    if (user && initialPath === '/') {
      history.replaceState(null, '', '#/dashboard');
      await router.resolve('/dashboard');
      return;
    }

    // Resolve the initial path
    await router.resolve(initialPath);

    // Refresh bottom nav now that session is restored
    if (typeof refreshBottomNav === 'function') refreshBottomNav();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    router.show404();
  }
})();

// ========== Keyboard Shortcuts ==========
document.addEventListener('keydown', (e) => {
  // Ctrl+K or Cmd+K for search
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.querySelector('.navbar-search input');
    if (searchInput) searchInput.focus();
  }
});

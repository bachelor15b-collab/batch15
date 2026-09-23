/* ============================================
   CS15 Hub - Real API Layer
   All calls go to the PHP backend via fetch()
   ============================================ */

function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/[&<>"']/g, m => (
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]
  ));
}

const API = {
  BASE: (window.BASE_URL || '') + '/api',

  _getToken() { return localStorage.getItem('cs15_auth_token'); },
  _setToken(t) { if (t) localStorage.setItem('cs15_auth_token', t); else localStorage.removeItem('cs15_auth_token'); },

  // ---------- internal helpers ----------
_roleMap: {
    'user': 'user',
    'student': 'student',
    'teacher': 'teacher',
    'admin_financial': 'financial_admin',
    'admin_educational': 'educational_admin',
    'admin_general': 'general_admin',
    'admin_monitor': 'monitor_admin',
    'admin_sports': 'sports_admin',
    'super_admin': 'super_admin',
    'soc_team': 'soc',
    'operations_manager': 'operations_manager',
  },
  _reverseRoleMap: {
    'student': 'student',
    'teacher': 'teacher',
    'financial_admin': 'admin_financial',
    'educational_admin': 'admin_educational',
    'general_admin': 'admin_general',
    'monitor_admin': 'admin_monitor',
    'sports_admin': 'admin_sports',
    'super_admin': 'super_admin',
    'soc': 'soc_team',
    'operations_manager': 'operations_manager',
  },

  _mapRole(backend) { return this._roleMap[backend] || backend; },
  _reverseRole(frontend) { return this._reverseRoleMap[frontend] || frontend; },

  _mapUser(u) {
    if (!u) return null;
    return {
      id: u.id,
      username: u.username,
      name: u.full_name || u.username,
      email: u.email,
      role: this._mapRole(u.role_slug),
      role_slug: u.role_slug,
      avatar: u.avatar_url,
      department: u.department || '',
      title: u.title || '',
      status: u.status,
      joined: u.created_at,
      last_login: u.last_login_at,
    };
  },

  _mapPost(p) {
    if (!p) return null;
    let tags = [];
    if (p.meta) {
      try { const m = typeof p.meta === 'string' ? JSON.parse(p.meta) : p.meta; tags = m.tags || []; } catch(e) {}
    }
    const author = p.author ? {
      ...this._mapUser(p.author),
      avatar_url: p.author.avatar_url,
    } : null;
    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt || '',
      content: p.content || '',
      type: p.post_type,
      author_id: p.author_id,
      status: p.status,
      tags,
      views: 0,
      likes: p.likes_count || 0,
      commentsCount: p.comments_count || 0,
      isLiked: p.is_liked || false,
      publishedAt: p.created_at,
      author,
    };
  },

  async _fetch(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = this._getToken();
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
      headers['X-Auth-Token'] = token;
    }
    const opts = { method, headers };
    if (body !== null) opts.body = JSON.stringify(body);
    const res = await fetch(this.BASE + path, opts);
    let json;
    try { json = await res.json(); } catch(e) { throw new Error('Invalid response from server'); }
    if (!json.success) throw new Error(json.message || 'Request failed');
    if (json.data && json.data.token) this._setToken(json.data.token);
    return json.data;
  },

  // ---------- Auth ----------
  async login(username, password) {
    const data = await this._fetch('POST', '/auth/login', { username, password });
    if (data.token) this._setToken(data.token);
    const user = this._mapUser(data.user);
    DB.currentUser = user;
    return user;
  },

async register(body) {
    return await this._fetch('POST', '/auth/register', {
      username: body.username,
      password: body.password,
      email: body.email || undefined,
      full_name: body.full_name || body.name || body.username,
      is_student: !!body.is_student,
      student_id: body.is_student ? (body.student_id || undefined) : undefined,
    });
  },

  async logout() {
    try { await this._fetch('POST', '/auth/logout'); } catch(e) {}
    this._setToken(null);
    DB.currentUser = null;
  },

  async restoreSession() {
    if (!this._getToken()) { DB.currentUser = null; return null; }
    try {
      const data = await this._fetch('GET', '/auth/me');
      const user = this._mapUser(data.user);
      DB.currentUser = user;
      return user;
    } catch(e) {
      this._setToken(null);
      DB.currentUser = null;
      return null;
    }
  },

  async getCurrentUser() { return DB.currentUser; },

  async _fetchForm(method, path, formData) {
    const headers = {};
    const token = this._getToken();
    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
      headers['X-Auth-Token'] = token;
    }
    const opts = { method, headers, body: formData };
    const res = await fetch(this.BASE + path, opts);
    let json;
    try { json = await res.json(); } catch(e) { throw new Error('Invalid response from server'); }
    if (!json.success) throw new Error(json.message || 'Request failed');
    if (json.data && json.data.token) this._setToken(json.data.token);
    if (json.data && json.data.user) {
      const mapped = this._mapUser(json.data.user);
      if (DB.currentUser && DB.currentUser.id === mapped.id) DB.currentUser = mapped;
    }
    return json.data;
  },

  async uploadAvatar(file) {
    const fd = new FormData();
    fd.append('avatar', file);
    return await this._fetchForm('POST', '/auth/avatar', fd);
  },

  async deleteAvatar() {
    return await this._fetch('DELETE', '/auth/avatar');
  },

  // ---------- Admin ----------
  async getUsers(params = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page);
    if (params.role) q.set('role', this._reverseRole(params.role));
    if (params.status) q.set('status', params.status);
    if (params.search) q.set('search', params.search);
    if (params.per_page) q.set('per_page', params.per_page);
    const data = await this._fetch('GET', '/users?' + q.toString());
    return {
      users: (data.users || data.data || []).map(u => this._mapUser(u)),
      total: data.total || data.users?.length || 0,
      page: data.page || 1,
      totalPages: data.total_pages || 1,
    };
  },

  async getMessagingContacts() {
    const data = await this._fetch('GET', '/users/messaging');
    return (data.users || []).map(u => this._mapUser(u));
  },

  // ─── YouTube / Batch15Tube ─────────────────────
  async getYoutubeSkills(featured = false) {
    const q = featured ? '?featured=1' : '';
    const data = await this._fetch('GET', '/youtube/skills' + q);
    return data.skills || [];
  },

  async getYoutubeSkill(id) {
    const data = await this._fetch('GET', '/youtube/skills/' + id);
    return data.skill || null;
  },

  async getYoutubeVideos(page = 1, perPage = 20, skillId = '') {
    let q = `?page=${page}&per_page=${perPage}`;
    if (skillId) q += `&skill_id=${skillId}`;
    return await this._fetch('GET', '/youtube/videos' + q);
  },

  async getYoutubeVideo(id) {
    const data = await this._fetch('GET', '/youtube/videos/' + id);
    return data.video || null;
  },

  async searchYoutube(query) {
    const data = await this._fetch('GET', '/youtube/search?q=' + encodeURIComponent(query));
    return data;
  },

  async getYoutubeCategories() {
    const data = await this._fetch('GET', '/youtube/categories');
    return data.categories || [];
  },

  async getYoutubeFeatured() {
    const data = await this._fetch('GET', '/youtube/featured');
    return data;
  },

  async updateVideoProgress(videoId, progress, durationWatched = 0) {
    return await this._fetch('POST', '/youtube/progress', {
      video_id: videoId,
      progress: progress,
      duration_watched: durationWatched,
    });
  },

  async getMyVideoProgress() {
    const data = await this._fetch('GET', '/youtube/my-progress');
    return data;
  },

  // ─── YouTube Admin CRUD ─────────────────────
  async createYoutubeSkill(data) {
    return await this._fetch('POST', '/youtube/admin/skills', data);
  },
  async updateYoutubeSkill(id, data) {
    return await this._fetch('PUT', '/youtube/admin/skills/' + id, data);
  },
  async deleteYoutubeSkill(id) {
    return await this._fetch('DELETE', '/youtube/admin/skills/' + id);
  },
  async createYoutubeVideo(data) {
    return await this._fetch('POST', '/youtube/admin/videos', data);
  },
  async updateYoutubeVideo(id, data) {
    return await this._fetch('PUT', '/youtube/admin/videos/' + id, data);
  },
  async deleteYoutubeVideo(id) {
    return await this._fetch('DELETE', '/youtube/admin/videos/' + id);
  },

  async assignRole(userId, roleSlug) {
    return await this._fetch('POST', '/admin/assign-role', {
      user_id: userId,
      role_slug: this._reverseRole(roleSlug),
    });
  },

  async suspendUser(id) {
    return await this._fetch('PUT', '/admin/users/' + id + '/suspend');
  },

  async restoreUser(id) {
    return await this._fetch('PUT', '/admin/users/' + id + '/restore');
  },

  async deleteUser(id) {
    return await this._fetch('DELETE', '/admin/users/' + id);
  },

  async getSystemConfig() {
    return await this._fetch('GET', '/admin/config');
  },

  async updateSystemConfig(config) {
    return await this._fetch('PUT', '/admin/config', config);
  },

  async getAdminAnalytics() {
    return await this._fetch('GET', '/admin/analytics');
  },

  // ---------- SOC ----------
  async getLoginAttempts(params = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page);
    if (params.per_page) q.set('per_page', params.per_page);
    if (params.ip) q.set('ip', params.ip);
    if (params.success !== undefined) q.set('success', params.success);
    if (params.from) q.set('from', params.from);
    if (params.to) q.set('to', params.to);
    return await this._fetch('GET', '/soc/login-attempts?' + q.toString());
  },

  async getActivityLogs(params = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page);
    if (params.per_page) q.set('per_page', params.per_page);
    if (params.user_id) q.set('user_id', params.user_id);
    if (params.action) q.set('action', params.action);
    if (params.ip) q.set('ip', params.ip);
    if (params.from) q.set('from', params.from);
    if (params.to) q.set('to', params.to);
    return await this._fetch('GET', '/soc/activity-logs?' + q.toString());
  },

  async getSuspiciousIPs(threshold) {
    const q = threshold ? '?threshold=' + threshold : '';
    return await this._fetch('GET', '/soc/suspicious-ips' + q);
  },

  async blockIP(ip, reason) {
    return await this._fetch('POST', '/soc/block-ip', { ip_address: ip, reason: reason || '' });
  },

  async unblockIP(ip) {
    return await this._fetch('POST', '/soc/unblock-ip', { ip_address: ip });
  },

  async getBlockedIPs(params = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page);
    return await this._fetch('GET', '/soc/blocked-ips?' + q.toString());
  },

  async getSOCStats() {
    return await this._fetch('GET', '/soc/stats');
  },

  async socSuspendUser(id) {
    return await this._fetch('POST', '/soc/users/' + id + '/suspend');
  },

  async socRestoreUser(id) {
    return await this._fetch('POST', '/soc/users/' + id + '/restore');
  },

  async socGetUsers(params = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page);
    if (params.role) q.set('role', this._reverseRole(params.role));
    if (params.status) q.set('status', params.status);
    if (params.search) q.set('search', params.search);
    if (params.per_page) q.set('per_page', params.per_page);
    return await this._fetch('GET', '/soc/users?' + q.toString());
  },

  async socUpdateUser(id, data) {
    return await this._fetch('PUT', '/soc/users/' + id, data);
  },

  async socGetUserActivity(id, params = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page);
    if (params.per_page) q.set('per_page', params.per_page);
    return await this._fetch('GET', '/soc/users/' + id + '/activity?' + q.toString());
  },

  async socGetUserIps(id) {
    return await this._fetch('GET', '/soc/users/' + id + '/ips');
  },

  async socDeleteUser(id) {
    return await this._fetch('DELETE', '/soc/users/' + id);
  },

  async getSOCData() {
    try {
      const [stats, attempts, logs, suspicious] = await Promise.all([
        this.getSOCStats(),
        this.getLoginAttempts({ per_page: 10 }),
        this.getActivityLogs({ per_page: 10 }),
        this.getSuspiciousIPs(3),
      ]);
      const s = stats || {};
      const susIps = (suspicious?.suspicious_ips || []);
      return {
        activeAlerts: (s.blocked_ips || 0) + susIps.length,
        criticalAlerts: susIps.filter(i => (i.attempt_count || 0) > 10).length,
        ipsBlocked: s.blocked_ips || 0,
        securityScore: 98,
        alerts: (s.recent_logs || []).slice(0, 4).map(l => ({
          severity: l.action?.includes('block') ? 'critical' : l.action?.includes('fail') ? 'high' : 'medium',
          title: l.action?.replace(/_/g, ' ') || 'Unknown',
          source: l.ip_address || 'N/A',
          time: l.created_at,
          details: l.details || '',
          target: l.entity_type || '-',
          status: 'Active',
        })),
        loginLogs: (attempts?.attempts || []).slice(0, 8).map(a => ({
          time: a.created_at,
          status: a.success ? 'success' : 'error',
          user: a.username || 'Unknown',
          ip: a.ip_address,
          location: a.location || 'Unknown',
        })),
        securityTimeline: (logs?.logs || []).slice(0, 8).map(l => ({
          severity: l.action?.includes('block') || l.action?.includes('delete') ? 'critical' : 'high',
          event: l.action?.replace(/_/g, ' ') || 'Event',
          time: l.created_at,
          action: l.details || '',
        })),
        suspiciousActivities: susIps.slice(0, 10).map(ip => ({
          type: 'Login Anomaly',
          source: ip.ip_address || ip,
          time: ip.last_attempt || new Date().toISOString(),
          risk: (ip.attempt_count || 0) > 10 ? 'critical' : (ip.attempt_count || 0) > 5 ? 'high' : 'medium',
          details: `${ip.attempt_count || 0} attempts in ${ip.window_minutes || 30}m`,
        })),
      };
    } catch(e) {
      return { activeAlerts:0, criticalAlerts:0, ipsBlocked:0, securityScore:98, alerts:[], loginLogs:[], securityTimeline:[], suspiciousActivities:[] };
    }
  },

  // ---------- Analytics ----------
  async getDashboardStats(role) {
    try {
      const data = await this._fetch('GET', '/analytics/dashboard');
      return data; // backend returns aggregate stats
    } catch(e) {
      // fallback: return empty stats so UI doesn't crash
      return {};
    }
  },

  async getAnalytics() {
    return await this._fetch('GET', '/analytics/users');
  },

  // ---------- Content ----------
  async getPosts(params = {}) {
    if (!params) params = {};
    const q = new URLSearchParams();
    if (params.type) q.set('type', params.type);
    if (params.status) q.set('status', params.status);
    if (params.search) q.set('search', params.search);
    if (params.page) q.set('page', params.page);
    if (params.per_page) q.set('per_page', params.per_page);
    const data = await this._fetch('GET', '/posts?' + q.toString());
    return {
      items: (data.posts || data.data || []).map(p => this._mapPost(p)),
      total: data.total || 0,
      page: data.page || 1,
      totalPages: data.totalPages || 1,
    };
  },

  async getPost(slug) {
    const data = await this._fetch('GET', '/posts/' + slug);
    return this._mapPost(data.post || data);
  },

  async createPost(data) {
    return await this._fetch('POST', '/posts', data);
  },

  async updatePost(id, data) {
    return await this._fetch('PUT', '/posts/' + id, data);
  },

  async deletePost(id) {
    return await this._fetch('DELETE', '/posts/' + id);
  },

  async getComments(postId) {
    const data = await this._fetch('GET', '/posts/' + postId + '/comments');
    return data.comments || [];
  },

  async createComment(postId, content, parentId = null) {
    const body = { content };
    if (parentId) body.parent_id = parentId;
    return await this._fetch('POST', '/posts/' + postId + '/comments', body);
  },

  async deleteComment(id) {
    return await this._fetch('DELETE', '/comments/' + id);
  },
  async toggleCommentLike(commentId) {
    return await this._fetch('POST', '/comments/' + commentId + '/like');
  },

  async toggleLike(postId) {
    return await this._fetch('POST', '/posts/' + postId + '/like');
  },

  // ---------- Challenges ----------
  async getChallenges(params = {}) {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    if (params.difficulty) q.set('difficulty', params.difficulty);
    return await this._fetch('GET', '/challenges?' + q.toString());
  },

  async getChallenge(id) {
    return await this._fetch('GET', '/challenges/' + id);
  },

  async createChallenge(data) {
    return await this._fetch('POST', '/challenges', data);
  },

  async updateChallenge(id, data) {
    return await this._fetch('PUT', '/challenges/' + id, data);
  },

  async deleteChallenge(id) {
    return await this._fetch('DELETE', '/challenges/' + id);
  },

  async submitChallenge(id, code, language) {
    return await this._fetch('POST', '/challenges/' + id + '/submit', { code, language });
  },

  async gradeChallenge(id, data) {
    return await this._fetch('POST', '/challenges/' + id + '/grade', data);
  },

  async getChallengeSubmissions(id) {
    return await this._fetch('GET', '/challenges/' + id + '/submissions');
  },

  // ---------- Elections ----------
  async getElections(params = {}) {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    return await this._fetch('GET', '/elections?' + q.toString());
  },

  async getElection(id) {
    return await this._fetch('GET', '/elections/' + id);
  },

  async castVote(electionId, candidateId) {
    return await this._fetch('POST', '/elections/' + electionId + '/vote', { candidate_id: candidateId });
  },

  async getResults(electionId) {
    return await this._fetch('GET', '/elections/' + electionId + '/results');
  },

  async createElection(data) {
    return await this._fetch('POST', '/elections', data);
  },

  async updateElection(id, data) {
    return await this._fetch('PUT', '/elections/' + id, data);
  },

  async deleteElection(id) {
    return await this._fetch('DELETE', '/elections/' + id);
  },

  async getCandidates(electionId) {
    return await this._fetch('GET', '/elections/' + electionId + '/candidates');
  },

  async addCandidate(electionId, data) {
    return await this._fetch('POST', '/elections/' + electionId + '/candidates', data);
  },

  // ---------- Messages ----------
  async getConversations() {
    return await this._fetch('GET', '/messages/conversations');
  },

  async getConversationMessages(userId, page = 1) {
    const q = new URLSearchParams();
    q.set('page', page);
    return await this._fetch('GET', '/messages/conversation/' + userId + '?' + q.toString());
  },

  async sendMessage(receiverId, message, subject) {
    return await this._fetch('POST', '/messages', { receiver_id: receiverId, message, subject: subject || '' });
  },

  async getUnreadMessageCount() {
    const resp = await this._fetch('GET', '/messages/unread-count');
    return resp.count || 0;
  },

  async searchMessages(query) {
    return await this._fetch('GET', '/messages/search?q=' + encodeURIComponent(query));
  },

  // ---------- Notifications ----------
  async getNotifications() {
    const data = await this._fetch('GET', '/notifications');
    return data.notifications || data.data || [];
  },

  async markNotificationRead(id) {
    await this._fetch('PUT', '/notifications/' + id + '/read');
    return true;
  },

  async markAllNotificationsRead() {
    await this._fetch('PUT', '/notifications/read-all');
    return true;
  },

  async getUnreadNotificationCount() {
    const resp = await this._fetch('GET', '/notifications/unread-count');
    return resp.count || 0;
  },

  // ---------- Leaderboard ----------
  async getLeaderboard(params = {}) {
    const q = new URLSearchParams();
    if (params.limit) q.set('limit', params.limit);
    return await this._fetch('GET', '/users/leaderboard?' + q.toString());
  },

  async awardXp(data) {
    return await this._fetch('POST', '/users/xp/award', data);
  },

  // ---------- Student Claims ----------
  async claimStudent(studentId) {
    return await this._fetch('POST', '/users/claim-student', { student_id: studentId || undefined });
  },

  async getClaimStatus() {
    return await this._fetch('GET', '/users/claim-status');
  },

// ---------- Members directory ----------
  async getMembers(params = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page);
    if (params.per_page) q.set('per_page', params.per_page);
    if (params.status) q.set('status', params.status);
    if (params.search) q.set('search', params.search);
    if (params.skills) q.set('skills', params.skills);
    if (params.interests) q.set('interests', params.interests);
    if (params.language) q.set('language', params.language);
    if (params.level) q.set('level', params.level);
    if (params.source) q.set('source', params.source);
    if (params.has_account !== undefined && params.has_account !== null) q.set('has_account', params.has_account ? '1' : '0');
    if (params.sort) q.set('sort', params.sort);
    return await this._fetch('GET', '/members?' + q.toString());
  },

  async getMemberFacets() {
    return await this._fetch('GET', '/members/facets');
  },

  async getMember(id) {
    return await this._fetch('GET', '/members/' + id);
  },

  async createMember(data) {
    return await this._fetch('POST', '/members', data);
  },

  async updateMember(id, data) {
    return await this._fetch('PUT', '/members/' + id, data);
  },

  async deleteMember(id) {
    return await this._fetch('DELETE', '/members/' + id);
  },

  async uploadMemberPicture(id, file) {
    const fd = new FormData();
    fd.append('picture', file);
    return await this._fetchForm('POST', '/members/' + id + '/picture', fd);
  },

  async approveMember(id) {
    return await this._fetch('POST', '/members/' + id + '/approve');
  },

  async rejectMember(id, reason) {
    return await this._fetch('POST', '/members/' + id + '/reject', { reason });
  },
async getProjects(params = {}) {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    if (params.search) q.set('search', params.search);
    if (params.page) q.set('page', params.page);
    if (params.per_page) q.set('per_page', params.per_page);
    const query = q.toString();
    const data = await this._fetch('GET', '/projects' + (query ? '?' + query : ''));
    return data.items || [];
  },
  async getProject(id) {
    const data = await this._fetch('GET', '/projects/' + id);
    return data.item || null;
  },
  async createProject(data) {
    return await this._fetch('POST', '/projects', data);
  },
  async updateProject(id, data) {
    return await this._fetch('PUT', '/projects/' + id, data);
  },
  async deleteProject(id) {
    return await this._fetch('DELETE', '/projects/' + id);
  },
  async getGallery(params = {}) {
    const q = new URLSearchParams();
    if (params.category) q.set('category', params.category);
    if (params.status) q.set('status', params.status);
    if (params.page) q.set('page', params.page);
    if (params.per_page) q.set('per_page', params.per_page);
    const query = q.toString();
    return this._fetch('GET', '/gallery' + (query ? '?' + query : ''));
  },
  async getGalleryItem(id) {
    return this._fetch('GET', '/gallery/' + id);
  },
  async createGalleryItem(data) {
    return this._fetch('POST', '/gallery', data);
  },
  async uploadGalleryImage(id, file) {
    const fd = new FormData();
    fd.set('image', file);
    return this._fetchForm('POST', '/gallery/' + id + '/image', fd);
  },
  async updateGalleryItem(id, data) {
    return this._fetch('PUT', '/gallery/' + id, data);
  },
  async deleteGalleryItem(id) {
    return this._fetch('DELETE', '/gallery/' + id);
  },
  async getTestimonials() {
    return DB.testimonials || [];
  },
  async getTimeline() {
    return DB.timeline || [];
  },
  async getAchievements() {
    return DB.achievements || [];
  },
  async search(query) {
    const q = new URLSearchParams();
    q.set('search', query);
    try {
      const data = await this._fetch('GET', '/posts?' + q.toString());
      return (data.posts || data.data || []).slice(0, 10).map(p => ({
        type: 'post', id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt, category: p.post_type,
      }));
    } catch(e) {
      return [];
    }
  },

  // ---------- Finance ----------
  async getFinanceDashboard() {
    return await this._fetch('GET', '/finance/dashboard');
  },

  async getInvoices(params = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page);
    if (params.status) q.set('status', params.status);
    if (params.user_id) q.set('user_id', params.user_id);
    return await this._fetch('GET', '/finance/invoices?' + q.toString());
  },

  async createInvoice(data) {
    return await this._fetch('POST', '/finance/invoices', data);
  },

  async getInvoice(id) {
    return await this._fetch('GET', '/finance/invoices/' + id);
  },

  async updateInvoice(id, data) {
    return await this._fetch('PUT', '/finance/invoices/' + id, data);
  },

  async deleteInvoice(id) {
    return await this._fetch('DELETE', '/finance/invoices/' + id);
  },

  async getPayments(params = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page);
    if (params.method) q.set('method', params.method);
    if (params.user_id) q.set('user_id', params.user_id);
    return await this._fetch('GET', '/finance/payments?' + q.toString());
  },

  async recordPayment(data) {
    return await this._fetch('POST', '/finance/payments', data);
  },

  async getFinanceReports(period) {
    const q = period ? '?period=' + period : '';
    return await this._fetch('GET', '/finance/reports' + q);
  },

  // Financial Management (monthly student payments)
  async getFinancialRecords() {
    return await this._fetch('GET', '/finance/records');
  },

  async createFinancialRecord(data) {
    return await this._fetch('POST', '/finance/records', data);
  },

  async getFinancialRecord(id) {
    return await this._fetch('GET', '/finance/records/' + id);
  },

  async togglePaymentStatus(recordId, studentId) {
    return await this._fetch('PUT', '/finance/records/' + recordId + '/payments/' + studentId);
  },

  async submitFinancialRecord(id) {
    return await this._fetch('POST', '/finance/records/' + id + '/submit');
  },

  downloadFinancialPdf(id) {
    window.open(this.BASE + '/finance/records/' + id + '/pdf', '_blank');
  },

  downloadFinancialCsv(id) {
    window.open(this.BASE + '/finance/records/' + id + '/csv', '_blank');
  },

  // ---------- Education ----------
  async getEducationDashboard() {
    return await this._fetch('GET', '/education/dashboard');
  },

  async getDepartments() {
    return await this._fetch('GET', '/education/departments');
  },

  async createDepartment(data) {
    return await this._fetch('POST', '/education/departments', data);
  },

  async getSemesters() {
    return await this._fetch('GET', '/education/semesters');
  },

  async createSemester(data) {
    return await this._fetch('POST', '/education/semesters', data);
  },

  async getCourses(params = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page);
    if (params.department_id) q.set('department_id', params.department_id);
    if (params.teacher_id) q.set('teacher_id', params.teacher_id);
    return await this._fetch('GET', '/education/courses?' + q.toString());
  },

  async createCourse(data) {
    return await this._fetch('POST', '/education/courses', data);
  },

  async getCourse(id) {
    return await this._fetch('GET', '/education/courses/' + id);
  },
  async getCourseDetail(id) {
    return await this._fetch('GET', '/education/courses/' + id + '/detail');
  },

  async updateCourse(id, data) {
    return await this._fetch('PUT', '/education/courses/' + id, data);
  },

  async deleteCourse(id) {
    return await this._fetch('DELETE', '/education/courses/' + id);
  },

  // ---------- Lessons ----------
  async getLessons(params = {}) {
    const q = new URLSearchParams();
    if (params.course_id) q.set('course_id', params.course_id);
    if (params.folder_id !== undefined) q.set('folder_id', params.folder_id === null ? '' : params.folder_id);
    if (params.page) q.set('page', params.page);
    if (params.per_page) q.set('per_page', params.per_page);
    return await this._fetch('GET', '/education/lessons?' + q.toString());
  },

  async getLesson(id) {
    return await this._fetch('GET', '/education/lessons/' + id);
  },

  async createLesson(formData) {
    return await this._fetchForm('POST', '/education/lessons', formData);
  },

  async updateLesson(id, data) {
    return await this._fetch('PUT', '/education/lessons/' + id, data);
  },

  async deleteLesson(id) {
    return await this._fetch('DELETE', '/education/lessons/' + id);
  },

  async getCourseLessons(courseId) {
    return await this._fetch('GET', '/education/lessons/course/' + courseId);
  },

  async getLessonFolders(params = {}) {
    const q = new URLSearchParams();
    if (params.course_id) q.set('course_id', params.course_id);
    return await this._fetch('GET', '/education/lesson-folders?' + q.toString());
  },

  async getCourseLessonFolders(courseId) {
    return await this._fetch('GET', '/education/lesson-folders/course/' + courseId);
  },

  async createLessonFolder(data) {
    return await this._fetch('POST', '/education/lesson-folders', data);
  },

  async updateLessonFolder(id, data) {
    return await this._fetch('PUT', '/education/lesson-folders/' + id, data);
  },

  async deleteLessonFolder(id) {
    return await this._fetch('DELETE', '/education/lesson-folders/' + id);
  },

  // ---------- Assignments ----------
  async getAssignments(params = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page);
    if (params.course_id) q.set('course_id', params.course_id);
    if (params.status) q.set('status', params.status);
    if (params.created_by) q.set('created_by', params.created_by);
    return await this._fetch('GET', '/assignments?' + q.toString());
  },

  async getAssignment(id) {
    return await this._fetch('GET', '/assignments/' + id);
  },

  async createAssignment(data) {
    return await this._fetch('POST', '/assignments', data);
  },

  async updateAssignment(id, data) {
    return await this._fetch('PUT', '/assignments/' + id, data);
  },

  async deleteAssignment(id) {
    return await this._fetch('DELETE', '/assignments/' + id);
  },

  async getMyAssignments(params = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page);
    if (params.per_page) q.set('per_page', params.per_page);
    return await this._fetch('GET', '/assignments/my?' + q.toString());
  },

  async submitAssignment(assignmentId, data) {
    return await this._fetch('POST', '/assignments/' + assignmentId + '/submit', data);
  },

  async getSubmissions(assignmentId) {
    return await this._fetch('GET', '/assignments/' + assignmentId + '/submissions');
  },

  async gradeSubmission(submissionId, data) {
    return await this._fetch('PUT', '/submissions/' + submissionId + '/grade', data);
  },

  async getUnreadSubmissionsCount() {
    const resp = await this._fetch('GET', '/assignments/submissions/unread');
    return resp.count || 0;
  },

  async getEnrollments(params = {}) {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page);
    if (params.per_page) q.set('per_page', params.per_page);
    if (params.course_id) q.set('course_id', params.course_id);
    if (params.status) q.set('status', params.status);
    if (params.user_id) q.set('user_id', params.user_id);
    return await this._fetch('GET', '/education/enrollments?' + q.toString());
  },

  async createEnrollment(data) {
    return await this._fetch('POST', '/education/enrollments', data);
  },

  async getGrades(params = {}) {
    const q = new URLSearchParams();
    if (params.course_id) q.set('course_id', params.course_id);
    if (params.user_id) q.set('user_id', params.user_id);
    return await this._fetch('GET', '/education/grades?' + q.toString());
  },

  async createGrade(data) {
    return await this._fetch('POST', '/education/grades', data);
  },

  async getStudentGrades(studentId) {
    return await this._fetch('GET', '/education/students/' + studentId + '/grades');
  },

  // ---------- Sports ----------
  async getSportsDashboard() {
    return await this._fetch('GET', '/sports/dashboard');
  },

  async getTeams(params = {}) {
    const q = new URLSearchParams();
    if (params.sport_type) q.set('sport_type', params.sport_type);
    return await this._fetch('GET', '/sports/teams?' + q.toString());
  },

  async createTeam(data) {
    return await this._fetch('POST', '/sports/teams', data);
  },

  async getTeam(id) {
    return await this._fetch('GET', '/sports/teams/' + id);
  },

  async updateTeam(id, data) {
    return await this._fetch('PUT', '/sports/teams/' + id, data);
  },

  async addTeamMember(teamId, userId, role) {
    return await this._fetch('POST', '/sports/teams/' + teamId + '/members', { user_id: userId, role: role || 'player' });
  },

  async removeTeamMember(teamId, userId) {
    return await this._fetch('DELETE', '/sports/teams/' + teamId + '/members/' + userId);
  },

  async getSportsEvents(params = {}) {
    const q = new URLSearchParams();
    if (params.sport_type) q.set('sport_type', params.sport_type);
    if (params.status) q.set('status', params.status);
    return await this._fetch('GET', '/sports/events?' + q.toString());
  },

  async createSportsEvent(data) {
    return await this._fetch('POST', '/sports/events', data);
  },

  async getSportsEvent(id) {
    return await this._fetch('GET', '/sports/events/' + id);
  },

  async updateEventScore(id, team1Score, team2Score) {
    return await this._fetch('PUT', '/sports/events/' + id + '/score', { team1_score: team1Score, team2_score: team2Score });
  },

  async updateEventStatus(id, status) {
    return await this._fetch('PUT', '/sports/events/' + id + '/status', { status });
  },

  // ---------- Operations (Facilities & Bookings) ----------
  async getOperationsDashboard() {
    return await this._fetch('GET', '/operations/dashboard');
  },

  async getFacilities(params = {}) {
    const q = new URLSearchParams();
    if (params.type) q.set('type', params.type);
    if (params.status) q.set('status', params.status);
    return await this._fetch('GET', '/operations/facilities?' + q.toString());
  },

  async createFacility(data) {
    return await this._fetch('POST', '/operations/facilities', data);
  },

  async getFacility(id) {
    return await this._fetch('GET', '/operations/facilities/' + id);
  },

  async updateFacilityStatus(id, status) {
    return await this._fetch('PUT', '/operations/facilities/' + id + '/status', { status });
  },

  async getBookings(params = {}) {
    const q = new URLSearchParams();
    if (params.status) q.set('status', params.status);
    if (params.facility_id) q.set('facility_id', params.facility_id);
    return await this._fetch('GET', '/operations/bookings?' + q.toString());
  },

  async createBooking(data) {
    return await this._fetch('POST', '/operations/bookings', data);
  },

  async getBooking(id) {
    return await this._fetch('GET', '/operations/bookings/' + id);
  },

  async approveBooking(id) {
    return await this._fetch('PUT', '/operations/bookings/' + id + '/approve');
  },

  async rejectBooking(id) {
    return await this._fetch('PUT', '/operations/bookings/' + id + '/reject');
  },

  // ---------- Monitor ----------
  async getMonitorDashboard() {
    return await this._fetch('GET', '/monitor/dashboard');
  },

  async getSystemHealth(service) {
    const q = service ? '?service=' + encodeURIComponent(service) : '';
    return await this._fetch('GET', '/monitor/health' + q);
  },

  async runHealthCheck() {
    return await this._fetch('POST', '/monitor/health/check');
  },

  async getIncidents(params = {}) {
    const q = new URLSearchParams();
    if (params.severity) q.set('severity', params.severity);
    if (params.status) q.set('status', params.status);
    return await this._fetch('GET', '/monitor/incidents?' + q.toString());
  },

  async createIncident(data) {
    return await this._fetch('POST', '/monitor/incidents', data);
  },

  async getIncident(id) {
    return await this._fetch('GET', '/monitor/incidents/' + id);
  },

  async assignIncident(id, assigneeId) {
    return await this._fetch('PUT', '/monitor/incidents/' + id + '/assign', { assignee_id: assigneeId });
  },

  async resolveIncident(id) {
    return await this._fetch('PUT', '/monitor/incidents/' + id + '/resolve');
  },

  async getAlerts(params = {}) {
    const q = new URLSearchParams();
    if (params.severity) q.set('severity', params.severity);
    if (params.acknowledged !== undefined) q.set('acknowledged', params.acknowledged);
    if (params.per_page) q.set('per_page', params.per_page);
    return await this._fetch('GET', '/monitor/alerts?' + q.toString());
  },

  async acknowledgeAlert(alertId) {
    return await this._fetch('POST', '/monitor/alerts/acknowledge', { alert_id: alertId });
  },

  async acknowledgeAllAlerts() {
    return await this._fetch('POST', '/monitor/alerts/acknowledge-all');
  },

  async getAlertRules() {
    return await this._fetch('GET', '/monitor/alert-rules');
  },

  async createAlertRule(data) {
    return await this._fetch('POST', '/monitor/alert-rules', data);
  },

  async updateAlertRule(id, data) {
    return await this._fetch('PUT', '/monitor/alert-rules/' + id, data);
  },

  async deleteAlertRule(id) {
    return await this._fetch('DELETE', '/monitor/alert-rules/' + id);
  },
};


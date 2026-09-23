/* ============================================
   CS15 Hub - App Page Templates (Teacher)
   ============================================ */

const AppPages = {
  wrap(title, content) {
    const role = DB.currentUser?.role || 'student';
    if (typeof Dashboards === 'undefined') {
      return `<div class="app-layout"><main class="main-content"><div class="empty-state"><i class="bi bi-exclamation-circle empty-state-icon"></i><h3>Dashboard not loaded</h3><p class="text-secondary">Please refresh the page.</p></div></main></div>`;
    }
    return Dashboards.renderShell(title, content, role);
  },

  // ===== PROFILE =====
  profile() {
    const user = DB.currentUser;
    if (!user) return this.wrap('Profile', '<div class="empty-state"><i class="bi bi-person-x empty-state-icon"></i><h3>Not Logged In</h3></div>');
    const cfg = Dashboards.roleConfig[user.role] || { label: user.role, icon: 'bi-person' };
    setTimeout(() => UI.initCounters(), 200);
    const avatarHtml = user.avatar
      ? `<div class="avatar avatar-xl mx-auto" style="width:80px;height:80px;overflow:hidden"><img src="${user.avatar}" alt="${user.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></div>`
      : `<div class="avatar avatar-xl mx-auto" style="background:${UI.getAvatarColor(user.name)};width:80px;height:80px;font-size:1.75rem">${UI.getInitials(user.name)}</div>`;
    return this.wrap('My Profile', `
      <div class="row">
        <div class="col-lg-4">
          <div class="card text-center p-6">
            ${avatarHtml}
            <h4 class="mt-4 mb-1">${user.name}</h4>
            <p class="text-secondary text-sm">${cfg.label} &bull; ${user.department || 'Computer Science'}</p>
            <div class="d-flex justify-center gap-2 mt-3">
              <span class="badge badge-success"><i class="bi bi-check-circle"></i> Active</span>
              <span class="badge badge-info"><i class="bi bi-mortarboard"></i> ${user.role.replace('_', ' ')}</span>
            </div>
            <div class="divider"></div>
            <div class="d-flex flex-column gap-2 text-start">
              <div class="d-flex justify-between"><span class="text-sm text-tertiary">Email</span><span class="text-sm">${user.email}</span></div>
              <div class="d-flex justify-between"><span class="text-sm text-tertiary">Joined</span><span class="text-sm">${user.joined || 'N/A'}</span></div>
              <div class="d-flex justify-between"><span class="text-sm text-tertiary">Member ID</span><span class="text-sm text-mono">#CS${String(user.id).padStart(4, '0')}</span></div>
            </div>
            <div class="divider"></div>
            <div class="d-flex flex-column gap-2">
              <label class="btn btn-primary btn-sm w-full" style="cursor:pointer">
                <i class="bi bi-camera"></i> Upload Photo
                <input type="file" id="avatarUploadInput" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none">
              </label>
              ${user.avatar ? '<button class="btn btn-ghost btn-sm w-full" onclick="AppPages.removeAvatar()"><i class="bi bi-trash"></i> Remove Photo</button>' : ''}
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card mb-4">
            <div class="card-header"><h5 class="card-title">Recent Activity</h5></div>
            <div class="activity-feed">
              ${UI.activityItem('Logged in to dashboard', 'Today', 'blue')}
              ${UI.activityItem('Checked pending assignments', 'Yesterday', 'green')}
              ${UI.activityItem('Updated course materials', '2 days ago', 'purple')}
            </div>
          </div>
          <div class="card">
            <div class="card-header"><h5 class="card-title">Teaching Stats</h5></div>
            <div class="grid-3 text-center">
              <div class="p-3"><div class="fs-3 fw-bold text-primary">-</div><div class="text-sm text-tertiary">Courses</div></div>
              <div class="p-3"><div class="fs-3 fw-bold text-success">-</div><div class="text-sm text-tertiary">Students</div></div>
              <div class="p-3"><div class="fs-3 fw-bold text-warning">-</div><div class="text-sm text-tertiary">Assignments</div></div>
            </div>
          </div>
        </div>
      </div>
    `);
  },

  profileLoaded() {
    const input = document.getElementById('avatarUploadInput');
    if (input) {
      input.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          await API.uploadAvatar(file);
          UI.showToast('Success', 'Profile picture updated!', 'success');
          router.navigate('/profile', true);
        } catch (err) {
          UI.showToast('Error', err.message || 'Upload failed', 'error');
        }
      });
    }
  },

  async removeAvatar() {
    if (!confirm('Remove your profile picture?')) return;
    try {
      await API.deleteAvatar();
      UI.showToast('Success', 'Profile picture removed.', 'info');
      router.navigate('/profile', true);
    } catch (err) {
      UI.showToast('Error', err.message || 'Failed to remove', 'error');
    }
  },

  // ===== POSTS LIST =====
  posts() {
    return this.wrap('Posts', `
      <div class="d-flex gap-2 mb-4 flex-wrap">
        <button class="btn btn-sm ${!router.params?.type ? 'btn-primary' : 'btn-secondary'}" onclick="router.navigate('/posts')">All</button>
        <button class="btn btn-sm ${router.params?.type === 'announcement' ? 'btn-primary' : 'btn-secondary'}" onclick="router.navigate('/posts/filter/announcement')">Announcements</button>
        <button class="btn btn-sm ${router.params?.type === 'blog' ? 'btn-primary' : 'btn-secondary'}" onclick="router.navigate('/posts/filter/blog')">Blog</button>
        <button class="btn btn-sm ${router.params?.type === 'resource' ? 'btn-primary' : 'btn-secondary'}" onclick="router.navigate('/posts/filter/resource')">Resources</button>
        <button class="btn btn-sm ${router.params?.type === 'challenge' ? 'btn-primary' : 'btn-secondary'}" onclick="router.navigate('/posts/filter/challenge')">Challenges</button>
        <button class="btn btn-sm ${router.params?.type === 'project' ? 'btn-primary' : 'btn-secondary'}" onclick="router.navigate('/posts/filter/project')">Projects</button>
        <button class="btn btn-sm btn-primary ms-auto" onclick="router.navigate('/posts/create')"><i class="bi bi-plus-lg"></i> New Post</button>
      </div>
      <div class="grid-3 stagger-children" id="postsGrid">
        ${UI.skeleton('card', 6)}
      </div>
      <div class="text-center mt-4">
        <button class="btn btn-outline" id="loadMorePosts" style="display:none" onclick="AppPages.loadMorePosts()">Load More</button>
      </div>
    `);
  },

  async postsLoaded() {
    try {
      const type = router.params?.type || null;
      const res = await API.getPosts({ type: type, page: 1, per_page: 9 });
      const container = document.getElementById('postsGrid');
      if (!container) return;
      window._allPostsData = res;
      window._postsPage = 1;
      this.renderPostList(res.items);
      const loadBtn = document.getElementById('loadMorePosts');
      if (loadBtn) loadBtn.style.display = (res.totalPages || 1) > 1 ? 'inline-flex' : 'none';
    } catch(e) { console.error(e); }
  },

  renderPostList(posts) {
    const container = document.getElementById('postsGrid');
    if (!container) return;
    const icons = { announcement: 'megaphone', blog: 'pencil-square', resource: 'folder', challenge: 'lightning', project: 'journal-code', gallery: 'images' };
    if (!posts || !posts.length) {
      container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="bi bi-journal-text empty-state-icon"></i><h3>No Posts Yet</h3><p class="text-secondary">Create your first post to get started.</p></div>';
      return;
    }
    container.innerHTML = posts.map(p => `
      <div class="post-card stagger-item">
        <div class="post-card-image d-flex align-items-center justify-content-center" style="background:linear-gradient(135deg, var(--bg-tertiary), var(--bg-card))">
          <i class="bi bi-${icons[p.type] || 'file-text'} fs-1 text-tertiary"></i>
        </div>
        <div class="post-card-body">
          <div class="post-card-meta">
            <span class="post-card-category ${p.type}">${p.type}</span>
            <span>${UI.formatDate(p.publishedAt)}</span>
            <span><i class="bi bi-eye"></i> ${p.views}</span>
          </div>
<h3 class="post-card-title">${esc(p.title)}</h3>
    <p class="post-card-excerpt">${esc(p.excerpt)}</p>
          <div class="d-flex flex-wrap gap-1 mb-3">${(p.tags||[]).map(t => UI.badge(t, 'gray')).join('')}</div>
          <div class="post-card-footer">
            <button class="btn btn-sm btn-ghost" onclick="router.navigate('/posts/'+encodeURIComponent('${p.slug}'))">Read More <i class="bi bi-arrow-right"></i></button>
            <div class="d-flex align-items-center gap-3 text-tertiary text-sm"><span><i class="bi bi-heart"></i> ${p.likes}</span><span><i class="bi bi-chat"></i> ${p.commentsCount}</span></div>
          </div>
        </div>
      </div>
    `).join('');
  },

  async loadMorePosts() {
    const page = (window._postsPage || 1) + 1;
    window._postsPage = page;
    const type = router.params?.type || null;
    try {
      const res = await API.getPosts({ type: type, page: page, per_page: 9 });
      const container = document.getElementById('postsGrid');
      if (!container) return;
      const icons = { announcement: 'megaphone', blog: 'pencil-square', resource: 'folder', challenge: 'lightning', project: 'journal-code', gallery: 'images' };
      container.innerHTML += (res.items||[]).map(p => `
        <div class="post-card stagger-item">
          <div class="post-card-image d-flex align-items-center justify-content-center" style="background:linear-gradient(135deg, var(--bg-tertiary), var(--bg-card))">
            <i class="bi bi-${icons[p.type] || 'file-text'} fs-1 text-tertiary"></i>
          </div>
          <div class="post-card-body">
            <div class="post-card-meta"><span class="post-card-category ${p.type}">${p.type}</span><span>${UI.formatDate(p.publishedAt)}</span></div>
            <h3 class="post-card-title">${p.title}</h3>
            <p class="post-card-excerpt">${p.excerpt}</p>
            <div class="post-card-footer">
              <button class="btn btn-sm btn-ghost" onclick="router.navigate('/posts/'+encodeURIComponent('${p.slug}'))">Read More <i class="bi bi-arrow-right"></i></button>
            </div>
          </div>
        </div>
      `).join('');
      const loadBtn = document.getElementById('loadMorePosts');
      if (loadBtn && page >= (res.totalPages || 1)) loadBtn.style.display = 'none';
    } catch(e) { console.error(e); }
  },

  // ===== SINGLE POST WITH COMMENTS & LIKES =====
  postSingle() {
    return this.wrap('', `
      <div id="singlePostContainer">
        <div class="text-center py-6"><div class="spinner-border text-primary" role="status"></div><p class="text-secondary mt-3">Loading post...</p></div>
      </div>
    `);
  },

  async postSingleLoaded() {
    const slug = router.params?.slug;
    if (!slug) { router.navigate('/posts'); return; }
    try {
      const post = await API.getPost(slug);
      const container = document.getElementById('singlePostContainer');
      if (!container) return;
      const icons = { announcement: 'megaphone', blog: 'pencil-square', resource: 'folder', challenge: 'lightning', project: 'journal-code', gallery: 'images' };

      let commentsHtml = '';
      try {
        const comments = await API.getComments(post.id);
        commentsHtml = AppPages._renderComments(comments, post.id);
      } catch(e) { commentsHtml = '<p class="text-secondary text-sm">Could not load comments.</p>'; }

      const isLiked = post.isLiked;
      container.innerHTML = `
        <div class="card p-6 mb-4" style="max-width:800px;margin:0 auto">
          <div class="d-flex align-items-center gap-2 mb-4">
            <span class="post-card-category ${post.type}">${post.type}</span>
            <span class="text-sm text-tertiary">${UI.formatDate(post.publishedAt)}</span>
            <span class="text-sm text-tertiary"><i class="bi bi-eye"></i> ${post.views} views</span>
          </div>
          <h1 class="fs-2 fw-bold mb-3">${esc(post.title)}</h1>
          <div class="d-flex align-items-center gap-3 mb-4">
            ${post.author?.avatar_url ? `<img src="${post.author.avatar_url}" alt="" style="width:34px;height:34px;border-radius:50%;object-fit:cover">` : `<div class="avatar avatar-sm" style="background:${UI.getAvatarColor(post.author?.name || 'U')}">${UI.getInitials(post.author?.name || 'U')}</div>`}
            <div><div class="text-sm fw-medium">${post.author?.name || 'Unknown'}</div><div class="text-xs text-tertiary">${post.author?.role || ''}</div></div>
          </div>
          ${post.featuredImage ? `<img src="${post.featuredImage}" class="w-100 rounded-3 mb-4" style="max-height:400px;object-fit:cover">` : ''}
          <div class="text-secondary lh-lg" style="font-size:0.9375rem;line-height:1.8">${esc(post.content || post.excerpt || '') || '<p>No content available.</p>'}</div>
          <div class="d-flex flex-wrap gap-2 mt-4">${(post.tags||[]).map(t => UI.badge(t, 'gray')).join('')}</div>
          <!-- Like & Comment Stats -->
          <div class="d-flex align-items-center gap-4 mt-4 pt-3" style="border-top:1px solid var(--border-primary)">
            <button class="btn btn-sm ${isLiked ? 'btn-danger' : 'btn-ghost'}" id="likeBtn" onclick="AppPages._toggleLike(${post.id})"><i class="bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}"></i> <span id="likeCount">${post.likes}</span></button>
            <span class="text-sm text-tertiary"><i class="bi bi-chat"></i> <span id="commentCount">${post.commentsCount}</span></span>
            <button class="btn btn-sm btn-ghost ms-auto" onclick="router.navigate('/posts')"><i class="bi bi-arrow-left"></i> Back</button>
          </div>
        </div>
        <!-- Comments Section -->
        <div class="card p-6" style="max-width:800px;margin:0 auto">
          <h5 class="fw-bold mb-4"><i class="bi bi-chat-dots"></i> Comments <span class="text-tertiary fw-normal">(${post.commentsCount})</span></h5>
          <div class="mb-4">
            <textarea class="form-textarea" id="commentInput" rows="2" placeholder="Write a comment..." style="resize:none"></textarea>
            <button class="btn btn-primary btn-sm mt-2" onclick="AppPages._addComment(${post.id})"><i class="bi bi-send"></i> Post Comment</button>
            <button class="btn btn-sm btn-ghost mt-2" id="cancelReplyBtn" style="display:none" onclick="AppPages._cancelReply()"><i class="bi bi-x"></i> Cancel Reply</button>
            <span class="text-sm text-tertiary ms-2" id="replyIndicator" style="display:none"></span>
          </div>
          <div id="commentsList">${commentsHtml}</div>
        </div>
      `;
    } catch(e) {
      console.error('postSingleLoaded error:', e);
      const container = document.getElementById('singlePostContainer');
      if (container) container.innerHTML = `<div class="empty-state"><i class="bi bi-exclamation-circle empty-state-icon"></i><h3>Error</h3><p class="text-secondary">${e.message || e}</p><p class="text-xs text-tertiary mt-2" style="white-space:pre-wrap;max-width:600px;word-break:break-all">${(e.stack || '').replace(/</g,'&lt;')}</p><button class="btn btn-primary mt-3" onclick="router.navigate('/posts')">Back to Posts</button></div>`;
    }
  },

  _renderComments(comments, postId) {
    if (!comments || !comments.length) return '<p class="text-secondary text-sm text-center py-4">No comments yet. Be the first!</p>';
    return comments.map(c => AppPages._renderComment(c, postId)).join('');
  },

  _renderComment(c, postId) {
    const isOwner = DB.currentUser && (DB.currentUser.id === c.user_id);
    const userName = c.user?.full_name || c.user?.name || c.user?.username || 'Unknown';
    const avatar = c.user?.avatar_url
      ? `<img src="${c.user.avatar_url}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover">`
      : `<div class="avatar avatar-xs" style="background:${UI.getAvatarColor(userName)};width:28px;height:28px;font-size:11px">${UI.getInitials(userName)}</div>`;
    const repliesHtml = (c.replies && c.replies.length)
      ? c.replies.map(r => AppPages._renderComment(r, postId)).join('')
      : '';
    const isLiked = c.is_liked || false;
    const likeCount = c.likes_count || 0;
    return `
      <div class="d-flex gap-3 mb-3" id="comment-${c.id}">
        <div class="flex-shrink-0">${avatar}</div>
        <div class="flex-grow-1">
          <div class="d-flex align-items-center gap-2">
            <span class="fw-medium text-sm">${userName}</span>
            <span class="text-xs text-tertiary">${UI.timeAgo(c.created_at)}</span>
            ${isOwner ? `<button class="btn btn-xs btn-ghost text-danger ms-auto" onclick="AppPages._deleteComment(${c.id},${postId})"><i class="bi bi-trash"></i></button>` : ''}
          </div>
          <p class="text-sm mb-1 mt-1" style="line-height:1.5">${esc(c.content)}</p>
          <div class="d-flex gap-3 items-center mt-1">
            <button class="btn btn-xs btn-ghost ${isLiked ? 'text-danger' : 'text-tertiary'}" onclick="AppPages._toggleCommentLike(${c.id}, this)" title="Like">
              <i class="bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}"></i> <span class="comment-like-count">${likeCount}</span>
            </button>
            <button class="btn btn-xs btn-ghost text-accent" onclick="AppPages._replyTo(${c.id},'${userName.replace(/'/g, "\\'")}')"><i class="bi bi-reply"></i> Reply</button>
          </div>
          <div class="ms-4 mt-2 ps-3" style="border-left:2px solid var(--border-primary)">${repliesHtml}</div>
        </div>
      </div>
    `;
  },

  // ----- Like Toggle -----
  async _toggleLike(postId) {
    try {
      const res = await API.toggleLike(postId);
      const btn = document.getElementById('likeBtn');
      const count = document.getElementById('likeCount');
      if (btn && count) {
        btn.classList.toggle('btn-danger', res.liked);
        btn.classList.toggle('btn-ghost', !res.liked);
        btn.querySelector('i').className = res.liked ? 'bi bi-heart-fill' : 'bi bi-heart';
        count.textContent = res.count;
      }
    } catch(e) { UI.showToast('Error', e.message, 'error'); }
  },

  async _toggleCommentLike(commentId, btn) {
    try {
      const res = await API.toggleCommentLike(commentId);
      const icon = btn.querySelector('i');
      const count = btn.querySelector('.comment-like-count');
      if (icon) icon.className = res.liked ? 'bi bi-heart-fill' : 'bi bi-heart';
      if (count) count.textContent = res.count;
      btn.classList.toggle('text-danger', res.liked);
      btn.classList.toggle('text-tertiary', !res.liked);
    } catch(e) { UI.showToast('Error', e.message, 'error'); }
  },

  // ----- Comments -----
  _replyTargetId: null,

  _replyTo(commentId, userName) {
    AppPages._replyTargetId = commentId;
    document.getElementById('replyIndicator').style.display = 'inline';
    document.getElementById('replyIndicator').textContent = 'Replying to ' + userName;
    document.getElementById('cancelReplyBtn').style.display = 'inline-flex';
    document.getElementById('commentInput').focus();
  },

  _cancelReply() {
    AppPages._replyTargetId = null;
    document.getElementById('replyIndicator').style.display = 'none';
    document.getElementById('cancelReplyBtn').style.display = 'none';
  },

  async _addComment(postId) {
    const input = document.getElementById('commentInput');
    if (!input || !input.value.trim()) return;
    const content = input.value.trim();
    const parentId = AppPages._replyTargetId;
    input.value = '';
    AppPages._cancelReply();
    try {
      await API.createComment(postId, content, parentId);
      // Reload comments
      const comments = await API.getComments(postId);
      const list = document.getElementById('commentsList');
      if (list) list.innerHTML = AppPages._renderComments(comments, postId);
      // Update comment count
      const cc = document.getElementById('commentCount');
      if (cc) cc.textContent = comments.reduce((t, c) => t + 1 + (c.replies?.length || 0), 0);
      UI.showToast('Success', 'Comment posted.', 'success');
    } catch(e) { UI.showToast('Error', e.message, 'error'); }
  },

  async _deleteComment(commentId, postId) {
    if (!confirm('Delete this comment?')) return;
    try {
      await API.deleteComment(commentId);
      const el = document.getElementById('comment-' + commentId);
      if (el) el.remove();
      const cc = document.getElementById('commentCount');
      if (cc) cc.textContent = Math.max(0, parseInt(cc.textContent) - 1);
      UI.showToast('Deleted', 'Comment removed.', 'info');
    } catch(e) { UI.showToast('Error', e.message, 'error'); }
  },

  // ===== CREATE POST =====
  postCreate() {
    const role = DB.currentUser?.role || '';
    const canCreate = ['teacher', 'educational_admin', 'super_admin'].includes(role);
    return this.wrap('Create Post', `
      ${canCreate ? '' : '<div class="alert alert-warning mb-4"><i class="bi bi-exclamation-triangle"></i> You need Teacher or Admin role to publish posts.</div>'}
      <div class="card p-6" style="max-width:800px;margin:0 auto">
        <form onsubmit="AppPages.handleCreatePost(event)" novalidate>
          <div class="form-group"><label class="form-label">Post Type</label>
            <select class="form-select" id="postType" required>
              <option value="blog">Blog</option>
              <option value="announcement">Announcement</option>
              <option value="resource">Resource</option>
              <option value="challenge">Challenge</option>
              <option value="project">Project</option>
              <option value="gallery">Gallery</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Title</label><input class="form-input" id="postTitle" placeholder="Enter a compelling title..." required></div>
          <div class="form-group"><label class="form-label">Slug</label><input class="form-input" id="postSlug" placeholder="url-friendly-slug" required></div>
          <div class="form-group"><label class="form-label">Excerpt</label><textarea class="form-textarea" id="postExcerpt" rows="2" placeholder="Brief summary..." required></textarea></div>
          <div class="form-group"><label class="form-label">Content</label><textarea class="form-textarea" id="postContent" rows="10" placeholder="Write your content here..." required></textarea></div>
          <div class="form-group"><label class="form-label">Tags (comma separated)</label><input class="form-input" id="postTags" placeholder="e.g. javascript, tutorial, web-dev"></div>
          <div class="d-flex gap-3">
            <button type="submit" class="btn btn-primary btn-lg"><i class="bi bi-send"></i> Publish Post</button>
            <button type="button" class="btn btn-secondary btn-lg" onclick="router.navigate('/posts')">Cancel</button>
          </div>
        </form>
      </div>
    `);
  },

  async handleCreatePost(e) {
    e.preventDefault();
    const data = {
      post_type: document.getElementById('postType')?.value || 'blog',
      title: document.getElementById('postTitle')?.value?.trim(),
      slug: document.getElementById('postSlug')?.value?.trim(),
      excerpt: document.getElementById('postExcerpt')?.value?.trim(),
      content: document.getElementById('postContent')?.value?.trim(),
      tags: document.getElementById('postTags')?.value?.trim(),
      status: 'published',
    };
    if (!data.title || !data.slug) { UI.showToast('Error', 'Title and slug are required.', 'error'); return; }
    try {
      await API.createPost(data);
      UI.showToast('Published!', 'Your post has been published successfully.', 'success');
      router.navigate('/posts');
    } catch(e) {
      UI.showToast('Error', e.message || 'Failed to publish post.', 'error');
    }
  },

  // ===== PORTFOLIO =====
  portfolio() {
    return this.wrap('My Portfolio', `
      <div class="d-flex justify-between items-center mb-4">
        <p class="text-secondary text-sm">Showcase your projects, skills, and achievements.</p>
        <button class="btn btn-primary btn-sm" onclick="AppPages.showAddProjectForm()"><i class="bi bi-plus-lg"></i> Add Project</button>
      </div>
      <div class="grid-3 stagger-children" id="portfolioGrid">
        ${UI.skeleton('card', 6)}
      </div>
    `);
  },

  showAddProjectForm() {
    const modal = document.getElementById('modal-container');
    modal.innerHTML = `
      <div class="modal-overlay" onclick="AppPages.closeProjectForm()" style="position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center">
        <div class="card" style="width:100%;max-width:480px;margin:20px" onclick="event.stopPropagation()">
          <h4 class="mb-4">Add New Project</h4>
          <div class="form-group mb-3">
            <label class="form-label">Project Title</label>
            <input type="text" id="projectTitle" class="form-input" placeholder="My Awesome Project">
          </div>
          <div class="form-group mb-3">
            <label class="form-label">Description</label>
            <textarea id="projectDesc" class="form-textarea" rows="3" placeholder="What does this project do?"></textarea>
          </div>
          <div class="form-group mb-3">
            <label class="form-label">Tech Stack (comma separated)</label>
            <input type="text" id="projectTech" class="form-input" placeholder="React, Node.js, MongoDB">
          </div>
          <div class="form-group mb-3">
            <label class="form-label">Status</label>
            <select id="projectStatus" class="form-select">
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div class="d-flex gap-2 justify-end">
            <button class="btn btn-ghost btn-sm" onclick="AppPages.closeProjectForm()">Cancel</button>
            <button class="btn btn-primary btn-sm" onclick="AppPages.saveProject()">Save Project</button>
          </div>
        </div>
      </div>`;
  },

  closeProjectForm() {
    const modal = document.getElementById('modal-container');
    if (modal) modal.innerHTML = '';
  },

  async saveProject() {
    const title = document.getElementById('projectTitle')?.value?.trim();
    const desc = document.getElementById('projectDesc')?.value?.trim();
    const tech = document.getElementById('projectTech')?.value?.trim();
    const status = document.getElementById('projectStatus')?.value || 'planning';
    if (!title) { UI.showToast('Error', 'Project title is required', 'error'); return; }
    try {
      await API.createProject({
        title,
        description: desc || '',
        tech: tech ? tech.split(',').map(t => t.trim()).filter(Boolean) : [],
        status
      });
      AppPages.closeProjectForm();
      UI.showToast('Project Added', `"${title}" has been added to your portfolio.`, 'success');
      AppPages.portfolioLoaded();
    } catch(e) {
      UI.showToast('Error', e.message || 'Failed to save project.', 'error');
    }
  },

  async portfolioLoaded() {
    try {
      const projects = await API.getProjects();
      const container = document.getElementById('portfolioGrid');
      if (!container) return;
      const statusColors = { completed: 'success', in_progress: 'warning', planning: 'info' };
      const list = projects && projects.length ? projects : [];
      container.innerHTML = list.slice(0, 6).map(p => `
        <div class="card card-hover stagger-item">
          <div class="d-flex justify-between items-start mb-3">
            <div class="stat-card-icon ${p.status === 'completed' ? 'green' : p.status === 'in_progress' ? 'yellow' : 'info'}" style="width:40px;height:40px;font-size:1rem"><i class="bi bi-${p.id % 2 === 0 ? 'cart' : 'code-square'}"></i></div>
            ${UI.badge(p.status.replace('_', ' '), statusColors[p.status])}
          </div>
<h5 class="mb-2">${esc(p.title)}</h5>
  <p class="text-sm text-secondary mb-3">${esc(p.description)}</p>
          <div class="d-flex flex-wrap gap-1 mb-3">${(p.tech||[]).map(t => UI.badge(t, 'gray')).join('')}</div>
          <div class="d-flex justify-between items-center pt-3" style="border-top:1px solid var(--border-primary)"><span class="text-sm text-tertiary"><i class="bi bi-person"></i> ${p.author_name || 'Me'}</span></div>
        </div>
      `).join('') || '<div class="empty-state" style="grid-column:1/-1"><i class="bi bi-folder empty-state-icon"></i><h3>No Projects</h3></div>';
    } catch(e) { console.error(e); }
  },

  // ===== CHALLENGES =====
  challenges() {
    return this.wrap('Challenges', `
      <div class="d-flex justify-between items-center mb-4">
        <p class="text-secondary text-sm">Coding challenges and competitions.</p>
      </div>
      <div id="challengesView">
        <div class="grid-3 stagger-children" id="challengesGrid">
          ${UI.skeleton('card', 6)}
        </div>
      </div>
    `);
  },

  async challengesLoaded() {
    try {
      const res = await API.getChallenges();
      const challenges = res.challenges || res.data || res || [];
      const container = document.getElementById('challengesGrid');
      if (!container) return;
      window._allChallenges = challenges;
      this.renderChallenges(challenges);
    } catch(e) { console.error(e); }
  },

  renderChallenges(challenges) {
    const container = document.getElementById('challengesGrid');
    if (!container) return;
    if (!challenges || !challenges.length) {
      container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="bi bi-lightning empty-state-icon"></i><h3>No Challenges</h3></div>';
      return;
    }
    container.innerHTML = challenges.map(c => {
      const imgHtml = c.image_url ? `<div style="width:100%;height:140px;overflow:hidden;border-radius:var(--radius-md) 0 0 0;margin-bottom:8px"><img src="${c.image_url}" alt="${c.title}" style="width:100%;height:100%;object-fit:cover"></div>` : '';
      return `
      <div class="challenge-card stagger-item" style="cursor:pointer" onclick="AppPages.showChallengeDetail(${c.id})">
        ${imgHtml}
        <div class="challenge-card-header">
          <span class="challenge-card-difficulty ${c.difficulty}">${c.difficulty}</span>
          ${c.status === 'open' ? UI.badge('Open', 'success') : UI.badge('Ended', 'gray')}
        </div>
        <h5 class="challenge-card-title">${c.title}</h5>
        <p class="challenge-card-desc">${(c.description||'').substring(0, 120)}${(c.description||'').length > 120 ? '...' : ''}</p>
        <div class="challenge-card-stats mb-3">
          <span><i class="bi bi-people"></i> ${c.submission_count||0} participants</span>
          <span><i class="bi bi-star"></i> ${c.xp_reward||0} pts</span>
        </div>
        ${c.link_url ? `<a href="${c.link_url}" target="_blank" class="btn btn-sm btn-primary" onclick="event.stopPropagation()"><i class="bi bi-box-arrow-up-right"></i> Open Challenge</a>` : ''}
      </div>`;
    }).join('');
  },

  async showChallengeDetail(id) {
    try {
      const res = await API.getChallenge(id);
      const c = res.challenge || res;
      if (!c) return;
      document.getElementById('challengesView').innerHTML = `
        <div class="card">
          <div style="display:flex;gap:24px;flex-wrap:wrap">
            ${c.image_url ? `<div style="flex:0 0 300px;max-width:100%"><img src="${c.image_url}" alt="${c.title}" style="width:100%;border-radius:var(--radius-md)"></div>` : ''}
            <div style="flex:1;min-width:280px">
              <div class="d-flex gap-2 items-center mb-2">
                <span class="challenge-card-difficulty ${c.difficulty}">${c.difficulty}</span>
                ${c.status === 'open' ? UI.badge('Open', 'success') : UI.badge('Ended', 'gray')}
              </div>
              <h3>${c.title}</h3>
              <p class="text-secondary mt-2 mb-3" style="white-space:pre-wrap">${esc(c.description)}</p>
              <div class="d-flex flex-wrap gap-3 mb-3">
                <span><i class="bi bi-star text-warning"></i> ${c.xp_reward||0} XP</span>
                ${c.link_url ? `<a href="${c.link_url}" target="_blank" class="btn btn-primary btn-sm"><i class="bi bi-box-arrow-up-right"></i> Open Challenge Site</a>` : ''}
              </div>
            </div>
          </div>
          <div class="mt-4">
            <button class="btn btn-ghost btn-sm" onclick="AppPages.challenges();AppPages.challengesLoaded()"><i class="bi bi-arrow-left"></i> Back to Challenges</button>
          </div>
        </div>`;
    } catch(e) {
      console.error(e);
      UI.showToast('Error', 'Failed to load challenge', 'danger');
    }
  },

  // ===== MESSAGING =====
  messaging() {
    return this.wrap('Messages', `
      <div class="chat-layout" style="height:calc(100vh - var(--navbar-height) - 140px)">
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
    `);
  },
};

// ===== Messaging State & Handlers =====
let _currentPartnerId = null;
let _chatPollInterval = null;
let _convPollInterval = null;

AppPages.messagingLoaded = async function() {
  try {
    const user = DB.currentUser;
    if (!user) return;

    window._conversations = [];

    try {
      window._appUsersCache = await API.getMessagingContacts();
    } catch(e) {
      window._appUsersCache = [];
    }

    await AppPages.refreshConversations();

    const startUserId = window._startChatWithUserId || (router.params?.userId ? parseInt(router.params.userId) : null);
    if (startUserId) {
      window._startChatWithUserId = null;
      AppPages.loadConversation(startUserId);
    }

    AppPages.startPolling();
  } catch(e) { console.error(e); }
};

AppPages.refreshConversations = async function() {
  try {
    const res = await API.getConversations();
    const convs = res.conversations || [];
    window._conversations = convs;
    AppPages.renderConversations(convs);
  } catch(e) { console.error(e); }
};

AppPages.renderConversations = function(convs) {
  const container = document.getElementById('conversationsList');
  if (!container) return;

  if (!convs || !convs.length) {
    container.innerHTML = '<div class="text-center text-tertiary py-4"><i class="bi bi-inbox" style="font-size:2rem"></i><p class="mt-2">No conversations yet</p></div>';
    return;
  }

  container.innerHTML = convs.map(c => {
    const isActive = _currentPartnerId === c.partner_id;
    return `
      <div class="chat-conversation ${isActive ? 'active' : ''}" onclick="AppPages.loadConversation(${c.partner_id})">
        ${c.avatar_url ? `<img src="${c.avatar_url}" alt="" style="width:34px;height:34px;border-radius:50%;object-fit:cover;flex-shrink:0">` : `<div class="avatar avatar-sm" style="background:${UI.getAvatarColor(c.full_name || c.username || 'U')}">${UI.getInitials(c.full_name || c.username || 'U')}</div>`}
        <div class="chat-conversation-info">
          <div class="chat-conversation-name">${c.full_name || c.username || 'User'}</div>
          <div class="chat-conversation-preview">${(c.last_message || '').substring(0, 50)}${(c.last_message || '').length > 50 ? '...' : ''}</div>
        </div>
        <div class="d-flex flex-column align-items-end gap-1" style="flex-shrink:0">
          <div class="chat-conversation-time">${c.last_message_at ? UI.formatDate(c.last_message_at) : ''}</div>
          ${c.unread_count > 0 ? `<div class="chat-conversation-unread">${c.unread_count > 99 ? '99+' : c.unread_count}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
};

AppPages.filterConversations = function(query) {
  const convs = window._conversations || [];
  const q = query.toLowerCase();
  const filtered = convs.filter(c => (c.full_name || c.username || '').toLowerCase().includes(q));
  AppPages.renderConversations(filtered);
};

AppPages.loadConversation = async function(partnerId) {
  const user = DB.currentUser;
  if (!user) return;

  _currentPartnerId = partnerId;
  window._chatLastMessageCount = 0;

  document.getElementById('chatSidebar')?.classList.remove('mobile-show');

  AppPages.renderConversations(window._conversations || []);

  try {
    const res = await API.getConversationMessages(partnerId);
    const messages = res.messages || [];
    const partner = res.partner || {};

    const header = document.getElementById('chatHeader');
    if (header) {
      const name = partner.name || partner.full_name || partner.username || 'User';
      header.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <button class="btn btn-sm btn-ghost d-lg-none" onclick="document.getElementById('chatSidebar').classList.add('mobile-show')">
            <i class="bi bi-arrow-left"></i>
          </button>
          ${partner.avatar_url ? `<img src="${partner.avatar_url}" alt="" style="width:34px;height:34px;border-radius:50%;object-fit:cover">` : `<div class="avatar avatar-sm" style="background:${UI.getAvatarColor(name)}">${UI.getInitials(name)}</div>`}
          <div>
            <div class="text-sm fw-medium">${name}</div>
            <div class="text-xs text-tertiary">Online</div>
          </div>
        </div>
      `;
    }

    const msgsEl = document.getElementById('chatMessages');
    if (msgsEl) {
      window._chatLastMessageCount = messages.length;
      if (!messages.length) {
        msgsEl.innerHTML = '<div class="d-flex align-items-center justify-content-center h-100"><div class="text-center text-tertiary"><p>No messages yet. Say hello!</p></div></div>';
      } else {
        msgsEl.innerHTML = messages.map(m => {
          const isSent = m.sender_id === user.id;
          return `
            <div class="chat-message ${isSent ? 'sent' : 'received'}">
              ${!isSent ? (partner.avatar_url ? `<img src="${partner.avatar_url}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0">` : `<div class="avatar avatar-sm" style="background:${UI.getAvatarColor(partner.name || 'U')};width:28px;height:28px;font-size:0.6rem">${UI.getInitials(partner.name || 'U')}</div>`) : ''}
              <div>
                <div class="chat-bubble">${esc(m.message || '')}</div>
                <div class="chat-time">${m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
              </div>
            </div>
          `;
        }).join('');
      }
      msgsEl.scrollTop = msgsEl.scrollHeight;
    }

    const inputArea = document.getElementById('chatInputArea');
    if (inputArea) inputArea.style.display = 'flex';

    AppPages.startChatPolling();
  } catch(e) { console.error(e); }
};

AppPages.sendChatMessage = async function() {
  const input = document.getElementById('chatInput');
  const text = input?.value.trim();
  if (!text || !_currentPartnerId || !DB.currentUser) return;

  const msgsEl = document.getElementById('chatMessages');
  if (msgsEl) {
    const empty = msgsEl.querySelector('.h-100');
    if (empty) msgsEl.innerHTML = '';
    msgsEl.innerHTML += `
      <div class="chat-message sent">
        <div>
          <div class="chat-bubble">${text}</div>
          <div class="chat-time">Just now</div>
        </div>
      </div>
    `;
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  input.value = '';
  input.focus();

  try {
    await API.sendMessage(_currentPartnerId, text, '');
    AppPages.refreshConversations();
    window._chatLastMessageCount = (window._chatLastMessageCount || 0) + 1;
  } catch(e) {
    UI.showToast('Error', 'Failed to send message.', 'error');
  }
};

AppPages.refreshChatMessages = async function() {
  if (!_currentPartnerId || !DB.currentUser) return;
  try {
    const res = await API.getConversationMessages(_currentPartnerId);
    const messages = res.messages || [];
    const msgsEl = document.getElementById('chatMessages');
    if (!msgsEl) return;
    const prevCount = window._chatLastMessageCount || 0;
    if (messages.length <= prevCount) return;
    const user = DB.currentUser;
    const partner = res.partner || {};
    const newMsgs = messages.slice(prevCount);
    window._chatLastMessageCount = messages.length;
    const wasAtBottom = msgsEl.scrollHeight - msgsEl.scrollTop - msgsEl.clientHeight < 60;
    const empty = msgsEl.querySelector('.h-100');
    if (empty) msgsEl.innerHTML = '';
    newMsgs.forEach(m => {
      const isSent = m.sender_id === user.id;
      msgsEl.insertAdjacentHTML('beforeend', `
        <div class="chat-message ${isSent ? 'sent' : 'received'}">
          ${!isSent ? (partner.avatar_url ? `<img src="${partner.avatar_url}" alt="" style="width:28px;height:28px;border-radius:50%;object-fit:cover;flex-shrink:0">` : `<div class="avatar avatar-sm" style="background:${UI.getAvatarColor(partner.name || 'U')};width:28px;height:28px;font-size:0.6rem">${UI.getInitials(partner.name || 'U')}</div>`) : ''}
          <div>
            <div class="chat-bubble">${esc(m.message || '')}</div>
            <div class="chat-time">${m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
          </div>
        </div>
      `);
    });
    if (wasAtBottom) msgsEl.scrollTop = msgsEl.scrollHeight;
  } catch(e) { console.error(e); }
};

AppPages.showNewChatModal = async function() {
  const modal = document.getElementById('newChatModal');
  if (!modal) return;
  modal.style.display = 'flex';

  const list = document.getElementById('newChatUsersList');
  if (!list) return;

  if (!window._appUsersCache || !window._appUsersCache.length) {
    try {
      window._appUsersCache = await API.getMessagingContacts();
    } catch(e) { window._appUsersCache = []; }
  }

  const users = (window._appUsersCache || []).filter(u => u.id !== DB.currentUser?.id);
  AppPages.renderNewChatUsers(users);
};

AppPages.renderNewChatUsers = function(users) {
  const list = document.getElementById('newChatUsersList');
  if (!list) return;

  if (!users.length) {
    list.innerHTML = '<div class="text-center text-tertiary py-3"><p>No users found</p></div>';
    return;
  }

  list.innerHTML = users.map(u => `
    <div class="chat-conversation" onclick="AppPages.startNewChat(${u.id})">
      ${u.avatar_url || u.avatar ? `<img src="${u.avatar_url || u.avatar}" alt="" style="width:34px;height:34px;border-radius:50%;object-fit:cover;flex-shrink:0">` : `<div class="avatar avatar-sm" style="background:${UI.getAvatarColor(u.name || u.username || 'U')}">${UI.getInitials(u.name || u.username || 'U')}</div>`}
      <div class="chat-conversation-info">
        <div class="chat-conversation-name">${u.name || u.username || 'User'}</div>
      </div>
    </div>
  `).join('');
};

AppPages.filterNewChatUsers = function(query) {
  const users = (window._appUsersCache || []).filter(u => u.id !== DB.currentUser?.id);
  const q = query.toLowerCase();
  const filtered = users.filter(u => (u.name || u.username || '').toLowerCase().includes(q));
  AppPages.renderNewChatUsers(filtered);
};

AppPages.startNewChat = function(userId) {
  document.getElementById('newChatModal').style.display = 'none';
  AppPages.loadConversation(userId);
};

AppPages.startPolling = function() {
  AppPages.stopPolling();
  _convPollInterval = setInterval(() => {
    AppPages.refreshConversations();
  }, 5000);
};

AppPages.startChatPolling = function() {
  if (_chatPollInterval) clearInterval(_chatPollInterval);
  _chatPollInterval = setInterval(() => {
    if (_currentPartnerId) {
      AppPages.refreshChatMessages();
    }
  }, 3000);
};

AppPages.stopPolling = function() {
  if (_convPollInterval) { clearInterval(_convPollInterval); _convPollInterval = null; }
  if (_chatPollInterval) { clearInterval(_chatPollInterval); _chatPollInterval = null; }
};

// ===== ELECTIONS =====
AppPages.elections = function() {
  return this.wrap('Elections', `
    <p class="text-secondary text-sm mb-4">Student Council Elections — Cast your vote.</p>
    <div class="grid-2 stagger-children" id="electionsGrid">
      ${UI.skeleton('card', 3)}
    </div>
  `);
};

AppPages.electionsLoaded = async function() {
  try {
    const elections = await API.getElections();
    const container = document.getElementById('electionsGrid');
    if (!container) return;
    const list = Array.isArray(elections) ? elections : (elections.data || elections.elections || []);
    if (!list.length) {
      container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="bi bi-check2-square empty-state-icon"></i><h3>No Elections</h3></div>';
      return;
    }
    const detailPromises = list.filter(e => e.status === 'active').map(e =>
      API.getElection(e.id).then(r => {
        const det = r.election || r.data || r;
        return det ? { id: e.id, ...det } : null;
      }).catch(() => null)
    );
    const details = (await Promise.all(detailPromises)).filter(Boolean);
    const detailMap = {};
    details.forEach(d => { if (d) detailMap[d.id] = d; });
    container.innerHTML = list.map(e => {
      const det = detailMap[e.id];
      const candidates = Array.isArray(det?.candidates) ? det.candidates : [];
      const hasVoted = det?.has_voted;
      if (e.status === 'active') {
        return `
          <div class="card stagger-item">
            <div class="card-header d-flex justify-between align-items-center flex-wrap gap-2">
              <h5 class="card-title mb-0">${e.title}</h5>
              <span class="badge badge-success"><span class="status-indicator status-online me-1"></span>Active</span>
            </div>
            <div class="p-3">
              <div class="d-flex justify-between align-items-center mb-3">
                <span class="text-xs text-tertiary">${e.start_date||e.startDate||''} — ${e.end_date||e.endDate||''}</span>
                <span class="text-xs text-tertiary">${e.totalVotes||e.total_votes||0} votes</span>
              </div>
              ${hasVoted ? '<div class="alert alert-success p-2 mb-3 text-sm"><i class="bi bi-check-circle me-1"></i> You have voted in this election.</div>' : ''}
              ${candidates.length ? candidates.map(c => {
                const voters = (det?.voters && det.voters[c.id]) || [];
                const voteCount = c.vote_count || 0;
                const totalVotes = det?.total_votes || 1;
                const pct = Math.round(voteCount / totalVotes * 100);
                return `
                <div class="p-3 mb-2" style="background:var(--bg-tertiary);border-radius:var(--radius-md)">
                  <div class="d-flex justify-between align-items-center">
                    <div class="d-flex align-items-center gap-3">
                      ${c.avatar_url ? `<img src="${c.avatar_url}" alt="" style="width:34px;height:34px;border-radius:50%;object-fit:cover">` : `<div class="avatar avatar-sm" style="background:${UI.getAvatarColor(c.full_name||c.username)}">${UI.getInitials(c.full_name||c.username||'U')}</div>`}
                      <div>
                        <span class="fw-medium text-sm">${c.full_name||c.username||'Candidate #'+c.user_id}</span>
                        ${c.position ? '<span class="text-xs text-tertiary ms-2">' + c.position + '</span>' : ''}
                        ${c.manifesto ? '<div class="text-xs text-tertiary mt-1" style="max-width:300px">' + c.manifesto + '</div>' : ''}
                      </div>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                      <div class="text-end">
                        <div class="text-sm fw-medium">${voteCount}</div>
                        <div class="text-xs text-tertiary">${pct}%</div>
                      </div>
                      ${!hasVoted ? `<button class="btn btn-sm btn-primary" onclick="AppPages.handleVote(${e.id}, ${c.id})"><i class="bi bi-check2-square"></i> Vote</button>` : ''}
                    </div>
                  </div>
                  ${hasVoted && voters.length ? `
                    <div class="mt-2 pt-2" style="border-top:1px solid var(--border-primary)">
                      <span class="text-xs text-tertiary">Voters</span>
                      <div class="d-flex flex-wrap gap-1 mt-1">
                        ${voters.map(v => `<span class="badge badge-gray text-xs">${v.full_name||v.username||'User #'+v.id}</span>`).join('')}
                      </div>
                    </div>
                  ` : ''}
                </div>`;
              }).join('') : '<div class="text-center text-secondary py-3 text-sm">No candidates available</div>'}
            </div>
          </div>
        `;
      }
      return `
        <div class="card stagger-item">
          <div class="card-header d-flex justify-between align-items-center">
            <h5 class="card-title mb-0">${e.title}</h5>
            <span class="badge ${e.status==='closed'?'badge-gray':'badge-warning'}">${(e.status||'').charAt(0).toUpperCase()+(e.status||'').slice(1)}</span>
          </div>
          <div class="p-3">
            <div class="d-flex justify-between align-items-center mb-3">
              <span class="text-xs text-tertiary">${e.start_date||e.startDate||''} — ${e.end_date||e.endDate||''}</span>
              <span class="text-xs text-tertiary">${e.totalVotes||e.total_votes||0} votes</span>
            </div>
            <button class="btn btn-sm btn-ghost" onclick="AppPages.showElectionResults(${e.id})"><i class="bi bi-bar-chart"></i> View Results</button>
          </div>
        </div>
      `;
    }).join('');
  } catch(e) { console.error(e); }
};

AppPages.handleVote = async function(electionId, candidateId) {
  if (!confirm('Cast your vote? This cannot be undone.')) return;
  try {
    await API.castVote(electionId, candidateId);
    UI.showToast('Voted!', 'Your vote has been recorded.', 'success');
    AppPages.electionsLoaded();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to cast vote.', 'error');
  }
};

AppPages.showElectionResults = async function(electionId) {
  try {
    const r = await API.getResults(electionId);
    const candidates = Array.isArray(r.results) ? r.results : [];
    const totalVotes = r.total_votes || 0;
    const participation = r.participation || {};
    const participationStr = participation.total_eligible ? `${participation.total_voted}/${participation.total_eligible} (${participation.percentage}%)` : 'N/A';
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.classList.add('show');
    overlay.id = 'electionResultsModal';
    overlay.onclick = function(e) { if (e.target === this) this.remove(); };
    overlay.innerHTML = `
      <div class="modal-content" style="max-width:600px;padding:0">
        <div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-primary)">
          <h5 style="margin:0">${r.election?.title||'Election'} Results</h5>
          <button class="btn btn-sm btn-ghost" onclick="document.getElementById('electionResultsModal').remove()"><i class="bi bi-x-lg"></i></button>
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
    UI.showToast('Error', e.message || 'Failed to load results.', 'error');
  }
};

// ===== NOTIFICATIONS =====
AppPages.notifications = function() {
  return this.wrap('Notifications', `
    <div class="d-flex justify-between items-center mb-4">
      <p class="text-secondary text-sm">Stay updated with the latest activities.</p>
      <button class="btn btn-sm btn-ghost" onclick="AppPages.markAllRead()"><i class="bi bi-check-all"></i> Mark all as read</button>
    </div>
    <div class="card p-0" id="notificationsList">
      ${UI.skeleton('table', 8)}
    </div>
  `);
};

AppPages.notificationsLoaded = async function() {
  try {
    const notifs = await API.getNotifications();
    const container = document.getElementById('notificationsList');
    if (!container) return;
    const iconColors = { announcement: 'blue', grade: 'green', event: 'purple', message: 'yellow', system: 'info', challenge: 'orange', election: 'pink' };
    const list = Array.isArray(notifs) ? notifs : [];
    if (!list.length) {
      container.innerHTML = '<div class="empty-state p-6"><i class="bi bi-bell empty-state-icon"></i><h3>No Notifications</h3></div>';
      return;
    }
    container.innerHTML = list.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}" onclick="AppPages.handleNotifClick(${n.id})">
        <div class="notif-icon" style="background:var(--bg-${iconColors[n.type] || 'info'})"><i class="bi ${n.icon || 'bi-bell'}"></i></div>
        <div class="notif-content">
          <div class="notif-title">${esc(n.title)}</div>
          <div class="notif-text">${esc(n.text)}</div>
          <div class="notif-time" data-time="${n.time}">${UI.formatDate(n.time)}</div>
        </div>
        ${n.read ? '' : `<span class="status-indicator status-online" style="flex-shrink:0;margin-top:6px"></span>`}
      </div>
    `).join('');
    AppPages._startRealTimeTicker();
  } catch(e) { console.error(e); }
};

AppPages._realTimeTick = null;
AppPages._startRealTimeTicker = function() {
  if (AppPages._realTimeTick) clearInterval(AppPages._realTimeTick);
  AppPages._realTimeTick = setInterval(() => {
    document.querySelectorAll('.notif-time[data-time]').forEach(el => {
      el.textContent = UI.formatDate(el.dataset.time);
    });
  }, 30000);
};

AppPages.handleNotifClick = async function(id) {
  try { await API.markNotificationRead(id); } catch(e) {}
  const item = document.querySelector(`.notif-item[data-id="${id}"]`);
  if (item) item.classList.remove('unread');
};

AppPages.markAllRead = async function() {
  try { await API.markAllNotificationsRead(); } catch(e) {}
  document.querySelectorAll('.notif-item.unread').forEach(el => el.classList.remove('unread'));
  UI.showToast('Done', 'All notifications marked as read.', 'success');
};

// ===== GRADES =====
AppPages.grades = function() {
  return this.wrap('My Grades', `
    <p class="text-secondary text-sm mb-4">Your academic performance across all courses.</p>
    <div class="card p-0" id="gradesContent">
      ${UI.skeleton('table', 6)}
    </div>
  `);
};

AppPages.gradesLoaded = async function() {
  try {
    const data = await API.getGrades({ user_id: DB.currentUser?.id });
    const container = document.getElementById('gradesContent');
    if (!container) return;
    const grades = data.grades || data.data || [];
    const arr = Array.isArray(grades) ? grades : [];
    container.innerHTML = arr.length ? `
      <div class="table-container">
        <table class="table">
          <thead><tr><th>Course</th><th>Score</th><th>Grade</th><th>Remarks</th></tr></thead>
          <tbody>
            ${arr.map(g => `
              <tr>
                <td class="fw-semibold">${g.course_name || 'Course #' + g.course_id}</td>
                <td>${g.score ?? '-'}</td>
                <td>${UI.badge(g.letter_grade || '-', g.letter_grade === 'F' ? 'danger' : g.letter_grade === 'A' ? 'success' : 'info')}</td>
                <td class="text-sm text-tertiary">${g.remarks || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : '<div class="p-4 text-center text-tertiary"><i class="bi bi-journal-text" style="font-size:2rem;display:block;margin-bottom:8px"></i>No grades recorded yet.</div>';
  } catch(e) {
    console.error(e);
    const container = document.getElementById('gradesContent');
    if (container) container.innerHTML = '<div class="p-4 text-center text-tertiary"><i class="bi bi-exclamation-circle" style="font-size:2rem;display:block;margin-bottom:8px"></i>Failed to load grades.</div>';
  }
};

// ===== LEADERBOARD =====
AppPages.leaderboard = function() {
  return this.wrap('Leaderboard', `
    <p class="text-secondary text-sm mb-4">Top performers in CS Batch 15.</p>
    <div class="card p-0" id="leaderboardContent">
      ${UI.skeleton('table', 8)}
    </div>
  `);
};

AppPages.leaderboardLoaded = async function() {
  try {
    const data = await API.getLeaderboard();
    const container = document.getElementById('leaderboardContent');
    if (!container) return;
    const medals = ['\u{1F947}', '\u{1F948}', '\u{1F949}'];
    const list = data.leaderboard || data.data || data || [];
    const arr = Array.isArray(list) ? list : [];
    container.innerHTML = arr.length ? `
      <div class="table-container">
        <table class="table">
          <thead><tr><th>Rank</th><th>Name</th><th>Points</th><th>Level</th></tr></thead>
          <tbody>
            ${arr.map((p, i) => `
              <tr>
                <td class="fw-bold fs-5 ${i < 3 ? '' : 'text-tertiary'}">${i < 3 ? medals[i] : '#' + (i+1)}</td>
                <td><div class="d-flex align-items-center gap-2"><div class="avatar avatar-sm" style="background:${UI.getAvatarColor(p.full_name || p.name || p.username)}">${UI.getInitials(p.full_name || p.name || p.username)}</div>${p.full_name || p.name || p.username}</div></td>
                <td class="fw-semibold">${p.total_xp ?? p.points ?? 0}</td>
                <td>${UI.badge(p.level || 'Beginner', 'info')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : '<div class="p-4 text-center text-tertiary"><i class="bi bi-trophy" style="font-size:2rem;display:block;margin-bottom:8px"></i>No leaderboard data yet.</div>';
  } catch(e) {
    console.error(e);
    const container = document.getElementById('leaderboardContent');
    if (container) container.innerHTML = '<div class="p-4 text-center text-tertiary"><i class="bi bi-exclamation-circle" style="font-size:2rem;display:block;margin-bottom:8px"></i>Failed to load leaderboard.</div>';
  }
};

// ===== SETTINGS =====
AppPages.settings = function() {
  return AppPages.wrap('Settings', `
    <div class="card p-6" style="max-width:700px">
      <h5 class="mb-4">Account Settings</h5>
      <div class="form-group"><label class="form-label">Display Name</label><input class="form-input" value="${DB.currentUser?.name || ''}"></div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-input" value="${DB.currentUser?.email || ''}" disabled></div>
      <div class="form-group"><label class="form-label">Bio</label><textarea class="form-textarea" rows="3" placeholder="Tell us about yourself..."></textarea></div>
      <button class="btn btn-primary mt-4"><i class="bi bi-check-lg"></i> Save Changes</button>
    </div>
  `);
};

// ===== COURSES =====
AppPages.courses = function() {
  return AppPages.wrap('My Courses', `
    <div class="grid-3 stagger-children" id="coursesGrid">
      ${UI.skeleton('card', 6)}
    </div>
  `);
};

AppPages.coursesLoaded = async function() {
  const container = document.getElementById('coursesGrid');
  if (!container) return;
  try {
    const userId = DB.currentUser?.id;
    const role = DB.currentUser?.role || 'student';
    const isTeacher = role === 'teacher';
    const isAdmin = role === 'sports_admin' || role === 'monitor_admin' || role === 'educational_admin' || role === 'super_admin' || role === 'general_admin' || role === 'admin_financial' || role === 'operations_manager' || role === 'soc_team';

    let courses = [];
    if (isTeacher) {
      const r = await API.getCourses({ teacher_id: userId, per_page: 100 });
      courses = r.courses || r.data || [];
    } else if (isAdmin) {
      const r = await API.getCourses({ per_page: 100 });
      courses = r.courses || r.data || [];
    } else {
      // Student: get enrollments then fetch course details
      const enrollRes = await API.getEnrollments({ user_id: userId, status: 'active', per_page: 100 });
      const enrollments = enrollRes.enrollments || [];
      const enrolledIds = new Set(enrollments.map(e => e.course_id));
      const courseRes = await API.getCourses({ per_page: 100 });
      const allCourses = courseRes.courses || courseRes.data || [];
      courses = allCourses.map(c => ({ ...c, isEnrolled: enrolledIds.has(c.id) }));
    }

    if (!courses.length) {
      container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="bi bi-book empty-state-icon"></i><h3>No Courses</h3></div>';
      return;
    }
    const isStudent = role !== 'teacher' && !isAdmin;
    container.innerHTML = courses.map(c => `
      <div class="card card-hover stagger-item" role="button" onclick="router.navigate('/courses/learn/${c.id}')">
        <div class="d-flex justify-between items-start mb-3">
          <div class="stat-card-icon blue" style="width:40px;height:40px;font-size:0.875rem">${c.code}</div>
          ${UI.badge((c.credits||'') + ' cr', 'info')}
        </div>
        <h5>${c.name}</h5>
        <div class="text-sm text-secondary mt-2">${c.department_name || ''}</div>
        <div class="d-flex justify-between items-center mt-3 text-sm">
          <span class="text-tertiary">${c.status || 'active'}</span>
          <div class="d-flex gap-2 items-center">
            ${c.isEnrolled !== undefined ? (c.isEnrolled ? `<span class="badge badge-success">Enrolled</span>` : (isStudent ? `<button class="btn btn-sm btn-primary" onclick="event.stopPropagation();AppPages._enrollCourse(${c.id},this)">Enroll</button>` : `<span class="badge badge-secondary">Not Enrolled</span>`)) : ''}
          </div>
        </div>
      </div>
    `).join('');
  } catch(e) {
    console.error('Courses load error:', e);
    container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="bi bi-exclamation-circle empty-state-icon"></i><h3>Could not load courses</h3><p class="text-secondary">' + (e.message || 'An error occurred') + '</p></div>';
  }
};

AppPages._enrollCourse = async function(courseId, btn) {
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
  try {
    await API.createEnrollment({ course_id: courseId });
    UI.showToast('Enrolled', 'Successfully enrolled in course.', 'success');
    btn.outerHTML = '<span class="badge badge-success">Enrolled</span>';
  } catch(e) {
    btn.disabled = false;
    btn.innerHTML = 'Enroll';
    UI.showToast('Error', e.message || 'Enrollment failed.', 'error');
  }
};

// ===== COURSE LEARN (DETAIL) =====
AppPages.courseLearn = function() {
  return AppPages.wrap('', `
    <div id="courseDetailContainer">
      <div class="text-center py-6"><div class="spinner-border text-primary" role="status"></div><p class="text-secondary mt-3">Loading course...</p></div>
    </div>
  `);
};

AppPages.courseLearnLoaded = async function() {
  const container = document.getElementById('courseDetailContainer');
  if (!container) return;
  const courseId = router.params?.id;
  if (!courseId) { router.navigate('/courses'); return; }
  try {
    const res = await API.getCourseDetail(courseId);
    const c = res.course;
    if (!c) throw new Error('Course not found');

    const role = DB.currentUser?.role || 'student';
    const isStudent = role === 'student';

    container.innerHTML = `
      <div class="max-w-4xl mx-auto">
        <button class="btn btn-ghost btn-sm mb-3" onclick="router.navigate('/courses')"><i class="bi bi-arrow-left"></i> Back to Courses</button>
        <div class="card p-6">
          <div class="d-flex justify-between items-start mb-4">
            <div>
              <div class="d-flex gap-2 items-center mb-2">
                <span class="stat-card-icon blue" style="width:40px;height:40px;font-size:0.875rem">${c.code}</span>
                <h3 class="fw-bold mb-0">${c.name}</h3>
              </div>
              <p class="text-secondary text-sm mt-1">${c.department_name || ''} &middot; ${c.credits || 0} Credits</p>
            </div>
            <div>${UI.badge(c.status || 'active', c.status === 'active' ? 'success' : 'gray')}</div>
          </div>
          ${c.teacher_name ? `<p class="text-sm mb-3"><strong>Instructor:</strong> ${c.teacher_name}</p>` : ''}
          <hr class="my-4">
          <h5 class="fw-semibold mb-2">About This Course</h5>
          <p class="text-secondary">${c.description || 'No description available.'}</p>
          <hr class="my-4">
          <h5 class="fw-semibold mb-2">Course Information</h5>
          <div class="grid-3 gap-3 mt-3">
            <div class="card p-3"><small class="text-tertiary">Code</small><div class="fw-bold">${c.code}</div></div>
            <div class="card p-3"><small class="text-tertiary">Credits</small><div class="fw-bold">${c.credits || 0}</div></div>
            <div class="card p-3"><small class="text-tertiary">Department</small><div class="fw-bold">${c.department_name || 'N/A'}</div></div>
          </div>
          <div class="mt-4 d-flex gap-3">
            ${isStudent ? `<button class="btn btn-primary" onclick="AppPages._enrollCourse(${c.id}, this)">Enroll in Course</button>` : ''}
          </div>
        </div>
      </div>
    `;
  } catch(e) {
    container.innerHTML = `
      <div class="text-center py-6">
        <div class="display-1 fw-bold text-tertiary">!</div>
        <h4 class="mt-3">${e.message || 'Could not load course'}</h4>
        <button class="btn btn-primary mt-4" onclick="router.navigate('/courses')"><i class="bi bi-arrow-left"></i> Back to Courses</button>
      </div>`;
  }
};

// ===== ASSIGNMENTS =====
AppPages.assignments = function() {
  const role = DB.currentUser?.role || 'student';
  const isTeacher = role === 'teacher' || role === 'monitor_admin' || role === 'educational_admin';
  const title = isTeacher ? 'Assignments' : 'My Assignments';
  const createBtn = isTeacher ? `<button class="btn btn-primary btn-sm" onclick="AppPages.showCreateAssignmentForm()"><i class="bi bi-plus-lg"></i> Create Assignment</button>` : '';
  return AppPages.wrap(title, `
    <div class="d-flex justify-between items-center mb-4">
      <p class="text-secondary text-sm">${isTeacher ? 'Manage course assignments.' : 'View and submit your assignments.'}</p>
      ${createBtn}
    </div>
    <div class="card p-0" id="assignmentsContent">
      ${UI.skeleton('table', 5)}
    </div>
  `);
};

AppPages.assignmentsLoaded = async function() {
  const container = document.getElementById('assignmentsContent');
  if (!container) return;
  const role = DB.currentUser?.role || 'student';
  const userId = DB.currentUser?.id;
  const isTeacher = role === 'teacher' || role === 'monitor_admin' || role === 'educational_admin';
  try {
    let list = [];
    if (isTeacher) {
      const r = await API.getAssignments({ created_by: userId, per_page: 100 });
      list = r.assignments || r.data || [];
      const withCounts = await Promise.all(list.map(async (a) => {
        try {
          const sr = await API.getSubmissions(a.id);
          const subs = sr.submissions || [];
          a._submissionCount = subs.length;
        } catch(e) { a._submissionCount = 0; }
        return a;
      }));
      list = withCounts;
    } else {
      const r = await API.getMyAssignments();
      list = r.assignments || r.data || r || [];
    }
    AppPages.renderAssignments(list);
  } catch(e) {
    console.error('Assignments load error:', e);
    container.innerHTML = '<div class="empty-state p-6"><i class="bi bi-exclamation-circle empty-state-icon"></i><h3>Could not load assignments</h3><p class="text-secondary">' + (e.message || 'An error occurred') + '</p></div>';
  }
};

AppPages.renderAssignments = function(list) {
  const container = document.getElementById('assignmentsContent');
  const role = DB.currentUser?.role || 'student';
  const isTeacher = role === 'teacher' || role === 'monitor_admin' || role === 'educational_admin';
  if (!container) return;
  if (!list || !list.length) {
    container.innerHTML = '<div class="empty-state p-6"><i class="bi bi-journal-text empty-state-icon"></i><h3>No Assignments Yet</h3><p class="text-secondary">' + (isTeacher ? 'Create your first assignment to get started.' : 'No assignments have been posted yet.') + '</p></div>';
    return;
  }
  const statusMap = { active: 'warning', grading: 'info', completed: 'success' };
  container.innerHTML = `
    <div class="table-container">
      <table class="table">
        <thead><tr>
          <th>Title</th>
          <th>Course</th>
          <th>Due Date</th>
          ${isTeacher ? '<th>Max Score</th><th>Submissions</th><th>Status</th><th>Actions</th>' : '<th>Status</th><th>Score</th><th>Actions</th>'}
        </tr></thead>
        <tbody>
          ${list.map(a => {
            if (isTeacher) {
              return `
                <tr>
                  <td class="fw-medium">${a.title}</td>
                  <td class="text-secondary">${a.course_name || 'Course #' + a.course_id}</td>
                  <td>${a.due_date || 'N/A'}</td>
                  <td>${a.max_score || '-'}</td>
                  <td><button class="btn btn-sm btn-ghost" onclick="AppPages.showGradeModal(${a.id})" title="View Submissions">${a._submissionCount || 0}</button></td>
                  <td>${UI.badge(a.status || 'active', statusMap[a.status] || 'warning')}</td>
                  <td>
                    <button class="btn btn-sm btn-ghost" onclick="AppPages.showEditAssignmentForm(${a.id})" title="Edit"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-info" onclick="AppPages.showGradeModal(${a.id})"><i class="bi bi-eye"></i> View</button>
                    <button class="btn btn-sm btn-danger" onclick="AppPages.deleteAssignment(${a.id})"><i class="bi bi-trash"></i></button>
                  </td>
                </tr>
              `;
            } else {
              const isSubmitted = a.submitted || !!a.submission;
              const score = a.submission?.score;
              return `
                <tr>
                  <td class="fw-medium">${a.title}</td>
                  <td class="text-secondary">${a.course_name || 'Course #' + a.course_id}</td>
                  <td>${a.due_date || 'N/A'}</td>
                  <td>${isSubmitted ? UI.badge('Submitted', 'success') : UI.badge('Pending', 'warning')}</td>
                  <td>${score != null ? score + '/' + (a.max_score || '?') : '-'}</td>
                  <td>
                    ${isSubmitted
                      ? `<button class="btn btn-sm btn-ghost" onclick="AppPages.showSubmitForm(${a.id})"><i class="bi bi-pencil"></i> Resubmit</button>`
                      : `<button class="btn btn-sm btn-primary" onclick="AppPages.showSubmitForm(${a.id})"><i class="bi bi-upload"></i> Submit</button>`
                    }
                  </td>
                </tr>
              `;
            }
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
};

AppPages.deleteAssignment = async function(id) {
  if (!confirm('Delete this assignment?')) return;
  try {
    await API.deleteAssignment(id);
    UI.showToast('Deleted', 'Assignment deleted.', 'success');
    AppPages.assignmentsLoaded();
  } catch(e) {
    UI.showToast('Error', e.message, 'error');
  }
};

AppPages.showCreateAssignmentForm = async function() {
  const existing = document.getElementById('assignmentModal');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'assignmentModal';
  overlay.style.cssText = 'display:flex;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);align-items:center;justify-content:center';
  overlay.onclick = function(e) { if (e.target === this) AppPages.closeAssignmentModal(); };
  overlay.innerHTML = '<div class="modal-content" style="max-width:600px;background:var(--bg-card);border-radius:var(--radius-lg);padding:0"><div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-primary)"><h5 style="margin:0">Create Assignment</h5><button class="btn btn-sm btn-ghost" onclick="AppPages.closeAssignmentModal()"><i class="bi bi-x-lg"></i></button></div><div class="modal-body" style="padding:1.5rem"><div id="assignmentFormContainer"><div class="text-center py-4"><div class="spinner-border text-primary" role="status"></div><p class="text-secondary mt-2">Loading courses...</p></div></div></div></div>';
  document.body.appendChild(overlay);
  const container = document.getElementById('assignmentFormContainer');
  let courses = [];
  try { const r = await API.getCourses({ per_page: 100 }); courses = r.courses || []; } catch(e) {}
  if (container) {
    container.innerHTML = `
      <form onsubmit="AppPages.handleCreateAssignment(event)">
        <div class="form-group"><label class="form-label">Course</label>
          <select class="form-select" id="asmtCourseId" required>
            <option value="">Select course...</option>
            ${courses.map(c => `<option value="${c.id}">${c.code} - ${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Title</label><input class="form-input" id="asmtTitle" placeholder="e.g. Binary Search Tree" required></div>
        <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="asmtDescription" rows="3"></textarea></div>
        <div class="form-group"><label class="form-label">Due Date</label><input class="form-input" id="asmtDueDate" type="date"></div>
        <div class="form-group"><label class="form-label">Max Score</label><input class="form-input" id="asmtMaxScore" type="number" value="100" min="1"></div>
        <div class="d-flex gap-3 mt-4">
          <button type="submit" class="btn btn-primary"><i class="bi bi-check-lg"></i> Create</button>
          <button type="button" class="btn btn-secondary" onclick="AppPages.closeAssignmentModal()">Cancel</button>
        </div>
      </form>
    `;
  }
};

AppPages.handleCreateAssignment = async function(e) {
  e.preventDefault();
  const courseId = document.getElementById('asmtCourseId')?.value;
  const title = document.getElementById('asmtTitle')?.value?.trim();
  if (!courseId || !title) { UI.showToast('Error', 'Course and title are required.', 'error'); return; }
  const data = {
    course_id: parseInt(courseId),
    title,
    description: document.getElementById('asmtDescription')?.value?.trim() || null,
    due_date: document.getElementById('asmtDueDate')?.value || null,
    max_score: parseFloat(document.getElementById('asmtMaxScore')?.value) || 100,
  };
  try {
    await API.createAssignment(data);
    UI.showToast('Created!', 'Assignment created successfully.', 'success');
    AppPages.closeAssignmentModal();
    AppPages.assignmentsLoaded();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to create assignment.', 'error');
  }
};

AppPages.showEditAssignmentForm = async function(id) {
  const existing = document.getElementById('assignmentModal');
  if (existing) existing.remove();
  let assignment;
  try {
    const r = await API.getAssignment(id);
    assignment = r.assignment || r.data || r;
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to load assignment.', 'error');
    return;
  }
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'assignmentModal';
  overlay.style.cssText = 'display:flex;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);align-items:center;justify-content:center';
  overlay.onclick = function(e) { if (e.target === this) AppPages.closeAssignmentModal(); };
  overlay.innerHTML = '<div class="modal-content" style="max-width:600px;background:var(--bg-card);border-radius:var(--radius-lg);padding:0"><div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-primary)"><h5 style="margin:0">Edit Assignment</h5><button class="btn btn-sm btn-ghost" onclick="AppPages.closeAssignmentModal()"><i class="bi bi-x-lg"></i></button></div><div class="modal-body" style="padding:1.5rem"><div id="assignmentFormContainer"><div class="text-center py-4"><div class="spinner-border text-primary" role="status"></div><p class="text-secondary mt-2">Loading courses...</p></div></div></div></div>';
  document.body.appendChild(overlay);
  const container = document.getElementById('assignmentFormContainer');
  let courses = [];
  try { const r = await API.getCourses({ per_page: 100 }); courses = r.courses || []; } catch(e) {}
  if (container) {
    container.innerHTML = `
      <form onsubmit="AppPages.handleEditAssignment(${assignment.id}, event)">
        <div class="form-group"><label class="form-label">Course</label>
          <select class="form-select" id="asmtCourseId" required>
            <option value="">Select course...</option>
            ${courses.map(c => `<option value="${c.id}" ${c.id === assignment.course_id ? 'selected' : ''}>${c.code} - ${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group"><label class="form-label">Title</label><input class="form-input" id="asmtTitle" value="${(assignment.title||'').replace(/"/g,'&quot;')}" required></div>
        <div class="form-group"><label class="form-label">Description</label><textarea class="form-textarea" id="asmtDescription" rows="3">${(assignment.description||'').replace(/"/g,'&quot;')}</textarea></div>
        <div class="form-group"><label class="form-label">Due Date</label><input class="form-input" id="asmtDueDate" type="date" value="${assignment.due_date || ''}"></div>
        <div class="form-group"><label class="form-label">Max Score</label><input class="form-input" id="asmtMaxScore" type="number" value="${assignment.max_score || 100}" min="1"></div>
        <div class="d-flex gap-3 mt-4">
          <button type="submit" class="btn btn-primary"><i class="bi bi-check-lg"></i> Save Changes</button>
          <button type="button" class="btn btn-secondary" onclick="AppPages.closeAssignmentModal()">Cancel</button>
        </div>
      </form>
    `;
  }
};

AppPages.handleEditAssignment = async function(id, e) {
  e.preventDefault();
  const courseId = document.getElementById('asmtCourseId')?.value;
  const title = document.getElementById('asmtTitle')?.value?.trim();
  if (!courseId || !title) { UI.showToast('Error', 'Course and title are required.', 'error'); return; }
  const data = {
    course_id: parseInt(courseId),
    title,
    description: document.getElementById('asmtDescription')?.value?.trim() || null,
    due_date: document.getElementById('asmtDueDate')?.value || null,
    max_score: parseFloat(document.getElementById('asmtMaxScore')?.value) || 100,
  };
  try {
    await API.updateAssignment(id, data);
    UI.showToast('Updated!', 'Assignment updated successfully.', 'success');
    AppPages.closeAssignmentModal();
    AppPages.assignmentsLoaded();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to update assignment.', 'error');
  }
};

AppPages.showGradeModal = async function(assignmentId) {
  const existing = document.getElementById('assignmentModal');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'assignmentModal';
  overlay.style.cssText = 'display:flex;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);align-items:center;justify-content:center';
  overlay.onclick = function(e) { if (e.target === this) AppPages.closeAssignmentModal(); };
  overlay.innerHTML = '<div class="modal-content" style="max-width:800px;background:var(--bg-card);border-radius:var(--radius-lg);padding:0"><div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-primary)"><h5 style="margin:0">Submissions</h5><button class="btn btn-sm btn-ghost" onclick="AppPages.closeAssignmentModal()"><i class="bi bi-x-lg"></i></button></div><div class="modal-body" style="padding:1.5rem;max-height:70vh;overflow-y:auto"><div id="gradeSubmissionsContainer"><div class="text-center py-4"><div class="spinner-border text-primary" role="status"></div><p class="text-secondary mt-2">Loading submissions...</p></div></div></div></div>';
  document.body.appendChild(overlay);
  const container = document.getElementById('gradeSubmissionsContainer');
  try {
    const sr = await API.getSubmissions(assignmentId);
    const subs = sr.submissions || [];
    if (!container) return;
    if (!subs.length) {
      container.innerHTML = '<div class="empty-state py-4"><i class="bi bi-inbox empty-state-icon"></i><h3>No Submissions Yet</h3></div>';
      return;
    }
    container.innerHTML = subs.map(sub => {
      const studentName = sub.student?.name || sub.student_name || 'Unknown';
      const content = sub.content || '';
      const link = sub.link || '';
      const currentScore = sub.score;
      const currentFeedback = sub.feedback || '';
      const currentStatus = sub.status || 'submitted';
      return `
        <div class="card p-4 mb-3" style="border:1px solid var(--border-primary)">
          <div class="d-flex align-items-center gap-2 mb-3">
            <div class="avatar avatar-sm" style="background:${UI.getAvatarColor(studentName)}">${UI.getInitials(studentName)}</div>
            <div><span class="fw-medium">${studentName}</span> ${sub.student?.email ? '<span class="text-xs text-tertiary">' + sub.student.email + '</span>' : ''}</div>
          </div>
          ${content ? `<div class="mb-2 p-3" style="background:var(--bg-secondary);border-radius:var(--radius-md)"><div class="text-sm text-tertiary mb-1">Submission:</div><div class="text-sm">${content}</div></div>` : ''}
          ${link ? `<div class="mb-3"><a href="${link}" target="_blank" class="btn btn-sm btn-outline"><i class="bi bi-link-45deg"></i> View Link</a></div>` : ''}
          <div class="row g-3">
            <div class="col-sm-4">
              <div class="form-group"><label class="form-label text-xs">Score</label><input class="form-input" id="gradeScore_${sub.id}" type="number" value="${currentScore || ''}" min="0" placeholder="Score"></div>
            </div>
            <div class="col-sm-4">
              <div class="form-group"><label class="form-label text-xs">Status</label>
                <select class="form-select" id="gradeStatus_${sub.id}">
                  <option value="submitted" ${currentStatus === 'submitted' ? 'selected' : ''}>Submitted</option>
                  <option value="graded" ${currentStatus === 'graded' ? 'selected' : ''}>Graded</option>
                  <option value="returned" ${currentStatus === 'returned' ? 'selected' : ''}>Returned</option>
                </select>
              </div>
            </div>
            <div class="col-sm-12">
              <div class="form-group"><label class="form-label text-xs">Feedback</label><textarea class="form-textarea" id="gradeFeedback_${sub.id}" rows="2" placeholder="Provide feedback...">${currentFeedback}</textarea></div>
            </div>
          </div>
          <button class="btn btn-sm btn-primary mt-2" onclick="AppPages.handleGradeSubmission(${sub.id})"><i class="bi bi-check-lg"></i> Grade</button>
        </div>
      `;
    }).join('');
  } catch(e) {
    if (container) container.innerHTML = '<div class="empty-state py-4"><i class="bi bi-exclamation-circle empty-state-icon"></i><h3>Error Loading Submissions</h3><p class="text-secondary">' + (e.message || '') + '</p></div>';
  }
};

AppPages.handleGradeSubmission = async function(submissionId) {
  const score = document.getElementById('gradeScore_' + submissionId)?.value;
  const feedback = document.getElementById('gradeFeedback_' + submissionId)?.value?.trim() || '';
  const status = document.getElementById('gradeStatus_' + submissionId)?.value || 'graded';
  if (score === '' || score == null) { UI.showToast('Error', 'Please enter a score.', 'error'); return; }
  try {
    await API.gradeSubmission(submissionId, {
      score: parseFloat(score),
      feedback,
      status
    });
    UI.showToast('Graded!', 'Submission graded successfully.', 'success');
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to grade submission.', 'error');
  }
};

AppPages.showSubmitForm = async function(assignmentId) {
  const existing = document.getElementById('assignmentModal');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'assignmentModal';
  overlay.style.cssText = 'display:flex;position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);align-items:center;justify-content:center';
  overlay.onclick = function(e) { if (e.target === this) AppPages.closeAssignmentModal(); };
  overlay.innerHTML = `<div class="modal-content" style="max-width:600px;background:var(--bg-card);border-radius:var(--radius-lg);padding:0"><div class="modal-header" style="display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border-primary)"><h5 style="margin:0">Submit Assignment</h5><button class="btn btn-sm btn-ghost" onclick="AppPages.closeAssignmentModal()"><i class="bi bi-x-lg"></i></button></div><div class="modal-body" style="padding:1.5rem"><div id="submitFormContainer"><form onsubmit="AppPages.handleSubmitAssignment(event, ${assignmentId})">
    <div class="form-group"><label class="form-label">Your Submission</label><textarea class="form-textarea" id="submitContent" rows="5" placeholder="Write your answer or submission text here..."></textarea></div>
    <div class="form-group"><label class="form-label">Link (optional)</label><input class="form-input" id="submitLink" type="url" placeholder="https://..."></div>
    <div class="d-flex gap-3 mt-4">
      <button type="submit" class="btn btn-primary"><i class="bi bi-upload"></i> Submit</button>
      <button type="button" class="btn btn-secondary" onclick="AppPages.closeAssignmentModal()">Cancel</button>
    </div>
  </form></div></div></div>`;
  document.body.appendChild(overlay);
};

AppPages.handleSubmitAssignment = async function(e, assignmentId) {
  e.preventDefault();
  const content = document.getElementById('submitContent')?.value?.trim();
  const link = document.getElementById('submitLink')?.value?.trim() || '';
  if (!content && !link) { UI.showToast('Error', 'Please provide content or a link.', 'error'); return; }
  try {
    await API.submitAssignment(assignmentId, { content, link });
    UI.showToast('Submitted!', 'Assignment submitted successfully.', 'success');
    AppPages.closeAssignmentModal();
    AppPages.assignmentsLoaded();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to submit assignment.', 'error');
  }
};

AppPages.closeAssignmentModal = function() {
  const modal = document.getElementById('assignmentModal');
  if (modal) modal.remove();
};

// ===== STUDENTS =====
AppPages.students = function() {
  return AppPages.wrap('Students', `
    <div class="d-flex justify-between items-center mb-4">
      <p class="text-secondary text-sm">View and manage your students.</p>
      <input class="form-input" style="width:240px" placeholder="Search students..." oninput="AppPages.filterStudents(this.value)">
    </div>
    <div class="card p-0" id="studentsContent">
      ${UI.skeleton('table', 8)}
    </div>
  `);
};

AppPages.studentsLoaded = async function() {
  const container = document.getElementById('studentsContent');
  if (!container) return;
  try {
    const r = await API.getUsers({ role: 'student', per_page: 200 });
    const students = r.users || [];
    window._allStudents = students;
    AppPages.renderStudents(students);
  } catch(e) {
    console.error('Students load error:', e);
    container.innerHTML = '<div class="empty-state p-6"><i class="bi bi-exclamation-circle empty-state-icon"></i><h3>Could not load students</h3><p class="text-secondary">' + (e.message || 'An error occurred') + '</p></div>';
  }
};

AppPages.renderStudents = function(students) {
  const container = document.getElementById('studentsContent');
  if (!container) return;
  if (!students.length) {
    container.innerHTML = '<div class="empty-state p-6"><i class="bi bi-people empty-state-icon"></i><h3>No Students Found</h3></div>';
    return;
  }
  container.innerHTML = `
    <div class="table-container">
      <table class="table">
        <thead><tr><th>Student</th><th>Email</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${students.map(s => `
            <tr>
              <td><div class="d-flex align-items-center gap-2"><div class="avatar avatar-sm" style="background:${UI.getAvatarColor(s.name)}">${UI.getInitials(s.name)}</div><span class="fw-medium">${s.name}</span></div></td>
              <td class="text-secondary">${s.email}</td>
              <td>${UI.badge(s.status || 'active', s.status === 'active' ? 'success' : 'gray')}</td>
              <td><button class="btn btn-sm btn-ghost" onclick="window._startChatWithUserId=${s.id};router.navigate('/messages')"><i class="bi bi-chat-dots"></i></button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
};

AppPages.filterStudents = function(query) {
  const all = window._allStudents || [];
  const q = query.toLowerCase();
  AppPages.renderStudents(all.filter(s => (s.name||'').toLowerCase().includes(q) || (s.email||'').toLowerCase().includes(q)));
};

// ===== LESSONS =====
AppPages.lessons = function() {
  const role = DB.currentUser?.role || 'student';
  const canUpload = ['teacher', 'super_admin', 'general_admin', 'educational_admin', 'monitor_admin'].includes(role);
  const uploadBtn = canUpload ? '<button class="btn btn-primary btn-sm" onclick="showUploadLessonModal()"><i class="bi bi-cloud-arrow-up"></i> Upload Lesson</button>' : '';
  return AppPages.wrap('Lessons', `
    <div class="d-flex justify-between items-center mb-4">
      <p class="text-secondary text-sm">Download lesson materials and resources.</p>
      ${uploadBtn}
    </div>
    <div class="d-flex gap-3 mb-4 flex-wrap">
      <select class="form-select" id="lessonCourseFilterPage" onchange="AppPages.filterLessons()" style="width:auto;min-width:200px">
        <option value="">All Courses</option>
      </select>
      <div class="search-box" style="width:280px">
        <i class="bi bi-search"></i>
        <input type="text" class="form-control" id="lessonSearchInput" placeholder="Search lessons..." oninput="AppPages.filterLessons()">
      </div>
    </div>
    <div class="grid-2 stagger-children" id="lessonsGrid">
      ${UI.skeleton('card', 4)}
    </div>
  `);
};

AppPages._fmFolderId = null;
AppPages._fmFolderName = null;

AppPages.lessonsLoaded = async function() {
  const container = document.getElementById('lessonsGrid');
  if (!container) return;
  try {
    const [lessonsRes, foldersRes] = await Promise.all([
      API.getLessons({ per_page: 100 }),
      API.getLessonFolders({})
    ]);
    const list = lessonsRes.lessons || [];
    const folders = foldersRes.folders || [];
    // Populate course filter
    const filter = document.getElementById('lessonCourseFilterPage');
    if (filter && !filter.dataset.populated) {
      try {
        const coursesRes = await API.getCourses({ per_page: 100 });
        const courses = coursesRes.courses || [];
        filter.innerHTML = '<option value="">All Courses</option>' + courses.map(c => '<option value="' + c.id + '">' + c.code + ' - ' + c.name + '</option>').join('');
      } catch(e) {}
      filter.dataset.populated = '1';
    }
    window._allLessons = list;
    window._allLessonFolders = folders;
    AppPages.renderLessonCards(list, container);
  } catch(e) {
    console.error('Error loading lessons:', e);
    container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="bi bi-journal-arrow-down empty-state-icon"></i><h3>Could not load lessons</h3><p class="text-secondary">' + (e.message || 'Please try again.') + '</p></div>';
  }
};

AppPages.renderLessonCards = function(list, container) {
  if (!container) container = document.getElementById('lessonsGrid');
  if (!container) return;

  const allFolders = window._allLessonFolders || [];
  const iconMap = { 'PDF': 'bi-file-earmark-pdf', 'DOC': 'bi-file-earmark-word', 'DOCX': 'bi-file-earmark-word', 'PPT': 'bi-file-earmark-slides', 'PPTX': 'bi-file-earmark-slides', 'XLS': 'bi-file-earmark-spreadsheet', 'XLSX': 'bi-file-earmark-spreadsheet', 'TXT': 'bi-file-earmark-text', 'CSV': 'bi-file-earmark-spreadsheet', 'ZIP': 'bi-file-earmark-zip' };
  const colorMap = { 'PDF': '#e74c3c', 'DOC': '#2b5797', 'DOCX': '#2b5797', 'PPT': '#d24726', 'PPTX': '#d24726', 'XLS': '#217346', 'XLSX': '#217346', 'TXT': '#555', 'CSV': '#217346', 'ZIP': '#f39c12' };

  const fid = AppPages._fmFolderId;

  if (fid) {
    // === INSIDE A FOLDER ===
    const files = list.filter(l => l.folder_id === fid);

    let html = '<div class="d-flex justify-between items-center mb-3 flex-wrap gap-2">' +
      '<div class="text-sm text-tertiary">' +
      '<span class="breadcrumb-link text-accent" style="cursor:pointer" onclick="AppPages._fmFolderId=null;AppPages._fmFolderName=null;AppPages.renderLessonCards(window._allLessons)">All Files</span>' +
      ' <span class="text-tertiary mx-1">/</span> <span class="fw-medium">' + AppPages._fmFolderName + '</span>' +
      '</div>' +
      '<div class="text-xs text-tertiary">' + files.length + ' file' + (files.length !== 1 ? 's' : '') + '</div>' +
      '</div>';

    if (files.length) {
      html += '<div class="d-flex flex-wrap gap-3">';
      files.forEach(l => {
        const ext = (l.original_filename || '').split('.').pop().toUpperCase();
        const size = l.file_size > 1048576 ? (l.file_size / 1048576).toFixed(1) + ' MB' : (l.file_size / 1024).toFixed(1) + ' KB';
        const icon = iconMap[ext] || 'bi-file-earmark';
        const color = colorMap[ext] || 'var(--text-tertiary)';
        html += '<div class="text-center" style="width:120px;padding:0.75rem 0.5rem;border-radius:var(--radius-md);transition:background 0.15s" onmouseover="this.style.background=\'var(--bg-tertiary)\'" onmouseout="this.style.background=\'\'" title="' + (l.original_filename || l.title) + '">' +
          '<a href="' + l.file_path + '" target="_blank" style="text-decoration:none;color:inherit;display:block" download="' + (l.original_filename || 'download') + '">' +
          '<i class="' + icon + '" style="font-size:2.8rem;color:' + color + ';display:block;margin-bottom:0.4rem"></i>' +
          '<span class="text-xs fw-medium text-truncate d-block" style="max-width:110px">' + (l.title || l.original_filename || '') + '</span>' +
          '<span class="text-2xs text-tertiary d-block">' + size + '</span>' +
          '</a></div>';
      });
      html += '</div>';
    } else {
      html += '<div class="d-flex flex-column align-items-center justify-content-center p-6" style="min-height:160px;border:2px dashed var(--border-primary);border-radius:var(--radius-lg)">' +
        '<i class="bi bi-folder2-open" style="font-size:2.5rem;color:var(--text-tertiary);margin-bottom:0.75rem"></i>' +
        '<p class="text-sm text-tertiary text-center">This folder is empty</p>' +
        '</div>';
    }

    container.innerHTML = html;
  } else {
    // === ROOT: folders only ===
    const folders = allFolders;

    let html = '<div class="d-flex justify-between items-center mb-3 flex-wrap gap-2">' +
      '<div class="text-sm text-tertiary">All Files</div>' +
      '<div class="text-xs text-tertiary">' + folders.length + ' folder' + (folders.length !== 1 ? 's' : '') + '</div>' +
      '</div>';

    if (folders.length) {
      const fcountMap = {};
      allFolders.forEach(f => { fcountMap[f.id] = list.filter(l => l.folder_id === f.id).length; });

      html += '<div class="d-flex flex-wrap gap-2">';
      folders.forEach(f => {
        const cnt = fcountMap[f.id] || 0;
        html += '<div class="text-center" onclick="AppPages._fmFolderId=' + f.id + ';AppPages._fmFolderName=\'' + f.name.replace(/'/g, "\\'") + '\';AppPages.renderLessonCards(window._allLessons)" style="width:140px;padding:1rem 0.5rem;cursor:pointer;border-radius:var(--radius-md);transition:background 0.15s" onmouseover="this.style.background=\'var(--bg-tertiary)\'" onmouseout="this.style.background=\'\'">' +
          '<i class="bi bi-folder" style="font-size:3rem;color:var(--accent);display:block;margin-bottom:0.4rem"></i>' +
          '<span class="text-xs fw-medium text-truncate d-block" style="max-width:130px">' + (f.name || '') + '</span>' +
          '<span class="text-2xs text-tertiary">' + cnt + ' file' + (cnt !== 1 ? 's' : '') + '</span>' +
          '</div>';
      });
      html += '</div>';
    } else {
      html += '<div class="d-flex flex-column align-items-center justify-content-center p-6" style="min-height:160px;border:2px dashed var(--border-primary);border-radius:var(--radius-lg)">' +
        '<i class="bi bi-folder2-open" style="font-size:2.5rem;color:var(--text-tertiary);margin-bottom:0.75rem"></i>' +
        '<p class="text-sm text-tertiary text-center">No folders yet</p>' +
        '</div>';
    }

    container.innerHTML = html;
  }
};

AppPages.filterLessons = function() {
  const filter = document.getElementById('lessonCourseFilterPage');
  const search = document.getElementById('lessonSearchInput');
  const courseId = filter ? filter.value : '';
  const query = search ? search.value.toLowerCase() : '';
  AppPages._fmFolderId = null;
  AppPages._fmFolderName = null;
  const all = window._allLessons || [];
  const filtered = all.filter(l => {
    if (courseId && String(l.course_id) !== courseId) return false;
    if (query && !(l.title || '').toLowerCase().includes(query)) return false;
    return true;
  });
  AppPages.renderLessonCards(filtered);
};

// ===== MEMBER PROFILE =====
AppPages.memberProfile = function() {
  return AppPages.wrap('My Member Profile', `
    <div id="memberProfileContent">
      <div class="text-center text-tertiary py-4"><div class="spinner-border spinner-border-sm me-2"></div>Loading...</div>
    </div>
  `);
};

AppPages.memberProfileLoaded = async function() {
  const container = document.getElementById('memberProfileContent');
  if (!container) return;
  try {
    const role = DB.currentUser?.role;
    const isAdmin = ['super_admin','general_admin','monitor_admin'].includes(role);

    // Try to load existing profile
    let profile = null;
    try {
      const all = await API.getMembers({ per_page: 200 });
      const members = all.members || [];
      profile = members.find(m => m.user_id === DB.currentUser?.id && m.status !== 'rejected') || null;
    } catch(e) { /* no profile yet */ }

    if (profile) {
      container.innerHTML = AppPages._renderMemberProfileForm(profile, isAdmin);
      AppPages._initMemberForm(profile, isAdmin);
    } else {
      // Check if they have a rejected profile
      let rejectedProfile = null;
      try {
        const all2 = await API.getMembers({ per_page: 200, status: 'rejected' });
        rejectedProfile = (all2.members || []).find(m => m.user_id === DB.currentUser?.id) || null;
      } catch(e) {}

      if (rejectedProfile) {
        container.innerHTML = AppPages._renderMemberRejected(rejectedProfile);
      } else {
        container.innerHTML = AppPages._renderMemberCreateForm();
        AppPages._initMemberForm(null, false);
      }
    }
  } catch(e) {
    console.error('Member profile load error:', e);
    container.innerHTML = '<div class="empty-state"><i class="bi bi-exclamation-circle empty-state-icon"></i><h3>Error</h3><p class="text-secondary">' + (e.message || 'Failed to load') + '</p></div>';
  }
};

AppPages._renderMemberCreateForm = function() {
  return `
    <div class="card p-4" style="max-width:800px;margin:0 auto">
      <h4 class="fw-bold mb-1">Create Your Member Profile</h4>
      <p class="text-sm text-tertiary mb-4">Fill out your details to appear on the Members page. Requires admin approval.</p>
      <form id="memberProfileForm" class="d-flex flex-column gap-3">
        <div class="d-flex align-items-center gap-4 mb-3">
          <div id="profilePicturePreview" style="width:100px;height:100px;border-radius:50%;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0">
            <i class="bi bi-person" style="font-size:2.5rem;color:var(--text-tertiary)"></i>
          </div>
          <div>
            <label class="btn btn-primary btn-sm"><i class="bi bi-camera"></i> Upload Picture (required)
              <input type="file" id="memberPictureInput" accept="image/*" style="display:none" onchange="AppPages._previewMemberPicture(event)">
            </label>
            <p class="text-xs text-tertiary mt-1">JPG, PNG, GIF or WebP. Max 2MB.</p>
          </div>
        </div>

        <div class="grid-3">
          <div><label class="text-sm fw-medium mb-1">First Name *</label><input type="text" class="form-input" id="mfFirstName" required></div>
          <div><label class="text-sm fw-medium mb-1">Middle Name</label><input type="text" class="form-input" id="mfMiddleName"></div>
          <div><label class="text-sm fw-medium mb-1">Last Name *</label><input type="text" class="form-input" id="mfLastName" required></div>
        </div>

        <div class="grid-3">
          <div><label class="text-sm fw-medium mb-1">Level</label>
            <select class="form-input" id="mfLevel">
              <option value="">Select level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div><label class="text-sm fw-medium mb-1">Year</label>
            <select class="form-input" id="mfYear">
              <option value="">Select year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Graduate">Graduate</option>
            </select>
          </div>
          <div><label class="text-sm fw-medium mb-1">Semester</label>
            <select class="form-input" id="mfSemester">
              <option value="">Select semester</option>
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
              <option value="Summer">Summer</option>
            </select>
          </div>
        </div>

        <div><label class="text-sm fw-medium mb-1">Bio / Description</label>
          <textarea class="form-input" id="mfBio" rows="3" placeholder="Tell us about yourself, your interests, and goals..."></textarea>
        </div>

        <div class="grid-2">
          <div>
            <label class="text-sm fw-medium mb-1">Skills (one per line)</label>
            <textarea class="form-input" id="mfSkills" rows="3" placeholder="PHP&#10;JavaScript&#10;Python&#10;React"></textarea>
          </div>
          <div>
            <label class="text-sm fw-medium mb-1">Languages (one per line)</label>
            <textarea class="form-input" id="mfLanguages" rows="3" placeholder="English&#10;Arabic&#10;French"></textarea>
          </div>
        </div>

        <div class="card-header px-0"><h5 class="card-title">Social Media</h5></div>
        <div class="grid-2">
          <div><label class="text-sm fw-medium mb-1">Website</label><input type="url" class="form-input" id="mfWebsite" placeholder="https://example.com"></div>
          <div><label class="text-sm fw-medium mb-1">Contact Email</label><input type="email" class="form-input" id="mfEmailContact" placeholder="contact@example.com"></div>
          <div><label class="text-sm fw-medium mb-1">GitHub</label><input type="url" class="form-input" id="mfGithub" placeholder="https://github.com/username"></div>
          <div><label class="text-sm fw-medium mb-1">LinkedIn</label><input type="url" class="form-input" id="mfLinkedin" placeholder="https://linkedin.com/in/username"></div>
          <div><label class="text-sm fw-medium mb-1">Twitter</label><input type="url" class="form-input" id="mfTwitter" placeholder="https://twitter.com/username"></div>
          <div><label class="text-sm fw-medium mb-1">Facebook</label><input type="url" class="form-input" id="mfFacebook" placeholder="https://facebook.com/username"></div>
          <div><label class="text-sm fw-medium mb-1">Instagram</label><input type="url" class="form-input" id="mfInstagram" placeholder="https://instagram.com/username"></div>
        </div>

        <div class="card-header px-0"><h5 class="card-title">Certificates & Achievements</h5></div>
        <div><label class="text-sm fw-medium mb-1">List your certificates and achievements (one per line)</label>
          <textarea class="form-input" id="mfCertificates" rows="3" placeholder="Full Stack Developer Certificate - 2025&#10;1st Place Hackathon 2025&#10;AWS Certified Cloud Practitioner"></textarea>
        </div>

        <div class="d-flex gap-2 mt-3">
          <button type="submit" class="btn btn-primary" id="mfSubmitBtn"><i class="bi bi-check-lg"></i> Submit for Approval</button>
        </div>
      </form>
    </div>
  `;
};

AppPages._renderMemberProfileForm = function(profile, isAdmin) {
  const s = (v) => v || '';
  const statusBadge = profile.status === 'approved' ? UI.badge('Approved', 'success')
    : profile.status === 'rejected' ? UI.badge('Rejected', 'danger')
    : UI.badge('Pending Approval', 'warning');

  const skills = (profile.skills || '').split('\n').filter(Boolean);
  const languages = (profile.languages || '').split('\n').filter(Boolean);
  const certs = (profile.certificates || '').split('\n').filter(Boolean);

  return `
    <div class="card p-4" style="max-width:800px;margin:0 auto">
      <div class="d-flex justify-between items-center mb-4">
        <div>
          <h4 class="fw-bold mb-1">My Member Profile</h4>
          <p class="text-sm text-tertiary">Status: ${statusBadge}</p>
        </div>
        <div class="d-flex gap-2">
          ${isAdmin ? `
            <button class="btn btn-sm btn-success" onclick="AppPages._approveMember(${profile.id})"><i class="bi bi-check-lg"></i> Approve</button>
            <button class="btn btn-sm btn-danger" onclick="AppPages._rejectMember(${profile.id})"><i class="bi bi-x-lg"></i> Reject</button>
          ` : ''}
          <button class="btn btn-sm btn-danger" onclick="if(confirm('Delete your profile?'))AppPages._deleteMemberProfile(${profile.id})"><i class="bi bi-trash"></i> Delete</button>
        </div>
      </div>

      <form id="memberProfileForm" class="d-flex flex-column gap-3">
        <div class="d-flex align-items-center gap-4 mb-3">
          <div id="profilePicturePreview" style="width:100px;height:100px;border-radius:50%;background:var(--bg-tertiary);display:flex;align-items:center;justify-content:center;overflow:hidden;flex-shrink:0">
            ${profile.picture_url ? `<img src="${s(profile.picture_url)}" alt="" style="width:100%;height:100%;object-fit:cover">` : '<i class="bi bi-person" style="font-size:2.5rem;color:var(--text-tertiary)"></i>'}
          </div>
          <div>
            <label class="btn btn-primary btn-sm"><i class="bi bi-camera"></i> Change Picture
              <input type="file" id="memberPictureInput" accept="image/*" style="display:none" onchange="AppPages._previewMemberPicture(event)">
            </label>
            <p class="text-xs text-tertiary mt-1">JPG, PNG, GIF or WebP. Max 2MB.</p>
          </div>
        </div>

        <div class="grid-3">
          <div><label class="text-sm fw-medium mb-1">First Name *</label><input type="text" class="form-input" id="mfFirstName" value="${s(profile.first_name)}" required></div>
          <div><label class="text-sm fw-medium mb-1">Middle Name</label><input type="text" class="form-input" id="mfMiddleName" value="${s(profile.middle_name)}"></div>
          <div><label class="text-sm fw-medium mb-1">Last Name *</label><input type="text" class="form-input" id="mfLastName" value="${s(profile.last_name)}" required></div>
        </div>

        <div class="grid-3">
          <div><label class="text-sm fw-medium mb-1">Level</label>
            <select class="form-input" id="mfLevel">
              <option value="">Select level</option>
              ${['Beginner','Intermediate','Advanced','Expert'].map(o => `<option value="${o}" ${profile.level === o ? 'selected' : ''}>${o}</option>`).join('')}
            </select>
          </div>
          <div><label class="text-sm fw-medium mb-1">Year</label>
            <select class="form-input" id="mfYear">
              <option value="">Select year</option>
              ${['1st Year','2nd Year','3rd Year','4th Year','Graduate'].map(o => `<option value="${o}" ${profile.year === o ? 'selected' : ''}>${o}</option>`).join('')}
            </select>
          </div>
          <div><label class="text-sm fw-medium mb-1">Semester</label>
            <select class="form-input" id="mfSemester">
              <option value="">Select semester</option>
              ${['Semester 1','Semester 2','Summer'].map(o => `<option value="${o}" ${profile.semester === o ? 'selected' : ''}>${o}</option>`).join('')}
            </select>
          </div>
        </div>

        <div><label class="text-sm fw-medium mb-1">Bio / Description</label>
          <textarea class="form-input" id="mfBio" rows="3">${s(profile.bio)}</textarea>
        </div>

        <div class="grid-2">
          <div>
            <label class="text-sm fw-medium mb-1">Skills (one per line)</label>
            <div class="d-flex flex-wrap gap-1 mb-2">${skills.map(sk => UI.badge(sk, 'info')).join('')}</div>
            <textarea class="form-input" id="mfSkills" rows="3">${profile.skills || ''}</textarea>
          </div>
          <div>
            <label class="text-sm fw-medium mb-1">Languages (one per line)</label>
            <div class="d-flex flex-wrap gap-1 mb-2">${languages.map(l => UI.badge(l, 'success')).join('')}</div>
            <textarea class="form-input" id="mfLanguages" rows="3">${profile.languages || ''}</textarea>
          </div>
        </div>

        <div class="card-header px-0"><h5 class="card-title">Social Media</h5></div>
        <div class="grid-2">
          <div><label class="text-sm fw-medium mb-1">Website</label><input type="url" class="form-input" id="mfWebsite" value="${s(profile.website)}"></div>
          <div><label class="text-sm fw-medium mb-1">Contact Email</label><input type="email" class="form-input" id="mfEmailContact" value="${s(profile.email_contact)}"></div>
          <div><label class="text-sm fw-medium mb-1">GitHub</label><input type="url" class="form-input" id="mfGithub" value="${s(profile.github)}"></div>
          <div><label class="text-sm fw-medium mb-1">LinkedIn</label><input type="url" class="form-input" id="mfLinkedin" value="${s(profile.linkedin)}"></div>
          <div><label class="text-sm fw-medium mb-1">Twitter</label><input type="url" class="form-input" id="mfTwitter" value="${s(profile.twitter)}"></div>
          <div><label class="text-sm fw-medium mb-1">Facebook</label><input type="url" class="form-input" id="mfFacebook" value="${s(profile.facebook)}"></div>
          <div><label class="text-sm fw-medium mb-1">Instagram</label><input type="url" class="form-input" id="mfInstagram" value="${s(profile.instagram)}"></div>
        </div>

        <div class="card-header px-0"><h5 class="card-title">Certificates & Achievements</h5></div>
        <div>
          <div class="d-flex flex-wrap gap-1 mb-2">${certs.map(c => UI.badge(c, 'purple')).join('')}</div>
          <textarea class="form-input" id="mfCertificates" rows="3">${profile.certificates || ''}</textarea>
        </div>

        <div class="d-flex gap-2 mt-3">
          <button type="submit" class="btn btn-primary" id="mfSubmitBtn"><i class="bi bi-save"></i> Save Changes</button>
          ${profile.status === 'approved' ? '<span class="text-sm text-tertiary d-flex align-items-center">Editing will require re-approval</span>' : ''}
        </div>
      </form>
    </div>
  `;
};

AppPages._renderMemberRejected = function(profile) {
  return `
    <div class="card p-4" style="max-width:600px;margin:0 auto;text-align:center">
      <i class="bi bi-x-circle" style="font-size:3rem;color:var(--text-danger)"></i>
      <h4 class="fw-bold mt-3">Profile Rejected</h4>
      <p class="text-secondary mt-2">Your previous member profile was rejected. You can create a new one.</p>
      <button class="btn btn-primary mt-3" onclick="AppPages.memberProfileLoaded()"><i class="bi bi-plus-lg"></i> Create New Profile</button>
    </div>
  `;
};

AppPages._previewMemberPicture = function(event) {
  const file = event.target.files[0];
  if (!file) return;
  const preview = document.getElementById('profilePicturePreview');
  if (preview) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.innerHTML = `<img src="${e.target.result}" alt="" style="width:100%;height:100%;object-fit:cover">`;
    };
    reader.readAsDataURL(file);
  }
  AppPages._pendingPicture = file;
};

AppPages._initMemberForm = function(profile, isAdmin) {
  const form = document.getElementById('memberProfileForm');
  if (!form) return;

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('mfSubmitBtn');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...'; }

    const getVal = (id) => (document.getElementById(id)?.value || '').trim();

    const data = {
      first_name: getVal('mfFirstName'),
      middle_name: getVal('mfMiddleName') || null,
      last_name: getVal('mfLastName'),
      level: getVal('mfLevel') || null,
      year: getVal('mfYear') || null,
      semester: getVal('mfSemester') || null,
      bio: getVal('mfBio') || null,
      skills: getVal('mfSkills') || null,
      languages: getVal('mfLanguages') || null,
      website: getVal('mfWebsite') || null,
      email_contact: getVal('mfEmailContact') || null,
      github: getVal('mfGithub') || null,
      linkedin: getVal('mfLinkedin') || null,
      twitter: getVal('mfTwitter') || null,
      facebook: getVal('mfFacebook') || null,
      instagram: getVal('mfInstagram') || null,
      certificates: getVal('mfCertificates') || null,
    };

    if (!data.first_name || !data.last_name) {
      UI.showToast('Error', 'First name and last name are required.', 'error');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = profile ? '<i class="bi bi-save"></i> Save Changes' : '<i class="bi bi-check-lg"></i> Submit for Approval'; }
      return;
    }

    try {
      const hasPicture = AppPages._pendingPicture || profile?.picture_url;
      if (!profile && !hasPicture) {
        UI.showToast('Error', 'Profile picture is required.', 'error');
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="bi bi-check-lg"></i> Submit for Approval'; }
        return;
      }

      let result;
      if (profile) {
        result = await API.updateMember(profile.id, data);
        UI.showToast('Saved', 'Profile updated.', 'success');
      } else {
        // Need picture URL first - upload if pending, or use existing
        if (AppPages._pendingPicture) {
          // First create with temporary URL, then upload
          data.picture_url = (window.BASE_URL || '') + '/uploads/members/placeholder.jpg';
          result = await API.createMember(data);
          const newProfile = result.member;
          // Upload picture
          await API.uploadMemberPicture(newProfile.id, AppPages._pendingPicture);
          AppPages._pendingPicture = null;
          UI.showToast('Submitted', 'Profile created. Waiting for admin approval.', 'success');
        } else {
          UI.showToast('Error', 'Please upload a profile picture.', 'error');
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<i class="bi bi-check-lg"></i> Submit for Approval'; }
          return;
        }
      }

      // Upload picture if pending (for editing)
      if (profile && AppPages._pendingPicture) {
        await API.uploadMemberPicture(profile.id, AppPages._pendingPicture);
        AppPages._pendingPicture = null;
      }

      // Reload
      AppPages.memberProfileLoaded();
    } catch(e) {
      const msg = e.message || '';
      if (msg.includes('already have a member profile')) {
        AppPages.memberProfileLoaded();
        return;
      }
      UI.showToast('Error', msg || 'Failed to save', 'error');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = profile ? '<i class="bi bi-save"></i> Save Changes' : '<i class="bi bi-check-lg"></i> Submit for Approval'; }
    }
  });
};

AppPages._deleteMemberProfile = async function(id) {
  try {
    await API.deleteMember(id);
    UI.showToast('Deleted', 'Profile deleted.', 'success');
    AppPages.memberProfileLoaded();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to delete', 'error');
  }
};

AppPages._approveMember = async function(id) {
  try {
    await API.approveMember(id);
    UI.showToast('Approved', 'Member profile approved.', 'success');
    AppPages.memberProfileLoaded();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to approve', 'error');
  }
};

AppPages._rejectMember = async function(id) {
  const reason = prompt('Reason for rejection:');
  if (reason === null) return;
  try {
    await API.rejectMember(id, reason || 'Not approved.');
    UI.showToast('Rejected', 'Member profile rejected.', 'warning');
    AppPages.memberProfileLoaded();
  } catch(e) {
    UI.showToast('Error', e.message || 'Failed to reject', 'error');
  }
};

window.AppPages = AppPages;

/* ============================================
   QUIZ INTEGRATION
   ============================================ */
AppPages.quiz = function() {
  return AppPages.wrap('Quiz Arena', `
    <div class="d-flex justify-between items-center mb-4">
      <p class="text-secondary text-sm">Test your skills with timed challenges and earn XP.</p>
      <div class="d-flex gap-2">
        <input type="text" class="form-input form-input-sm" id="quizSearchInput" placeholder="Search skills..." oninput="AppPages.filterQuizSkills()" style="max-width:220px">
      </div>
    </div>
    <div class="grid-3 stagger-children" id="quizSkillsGrid">
      ${UI.skeleton('card', 6)}
    </div>
  `);
};

AppPages._quizSkills = [
  { id:'cyber-security', name:'Cyber Security', icon:'🛡️', desc:'Protect systems from digital attacks', count:30 },
  { id:'mobile-repairing', name:'Mobile Repairing', icon:'📱', desc:'Diagnose and fix mobile devices', count:25 },
  { id:'computer-repairing', name:'Computer Repairing', icon:'🖥️', desc:'Troubleshoot computer hardware/software', count:25 },
  { id:'networking', name:'Networking', icon:'🔌', desc:'Design and manage computer networks', count:35 },
  { id:'programming', name:'Programming', icon:'💻', desc:'Write code in various languages', count:40 },
  { id:'database-admin', name:'Database Admin', icon:'💾', desc:'Manage database systems', count:30 },
  { id:'web-development', name:'Web Development', icon:'🌐', desc:'Build websites and web apps', count:45 },
  { id:'software-eng', name:'Software Engineering', icon:'📝', desc:'Engineering principles for software', count:30 },
  { id:'cloud-computing', name:'Cloud Computing', icon:'☁️', desc:'Cloud services and infrastructure', count:25 },
  { id:'ai', name:'Artificial Intelligence', icon:'🤖', desc:'Intelligent systems and cognition', count:35 },
  { id:'machine-learning', name:'Machine Learning', icon:'📊', desc:'Systems that learn from data', count:30 },
  { id:'data-science', name:'Data Science', icon:'📈', desc:'Extract insights from data', count:25 },
  { id:'ui-ux-design', name:'UI/UX Design', icon:'🎨', desc:'Design intuitive interfaces', count:20 },
  { id:'ethical-hacking', name:'Ethical Hacking', icon:'🕵️', desc:'Legal security testing', count:40 },
  { id:'devops', name:'DevOps', icon:'🔄', desc:'Dev + Ops for faster delivery', count:25 },
  { id:'linux-admin', name:'Linux Admin', icon:'🐧', desc:'Manage Linux systems', count:35 },
  { id:'windows-admin', name:'Windows Admin', icon:'🪟', desc:'Administer Windows environments', count:25 },
  { id:'python', name:'Python', icon:'🐍', desc:'Python programming', count:50 },
  { id:'java', name:'Java', icon:'☕', desc:'Java development', count:35 },
  { id:'javascript', name:'JavaScript', icon:'📖', desc:'Dynamic web content', count:45 },
  { id:'cpp', name:'C++', icon:'📄', desc:'High-performance C++ code', count:30 },
  { id:'git-github', name:'Git & GitHub', icon:'📂', desc:'Version control', count:20 },
  { id:'docker-kubernetes', name:'Docker & K8s', icon:'🐳', desc:'Containerize applications', count:25 },
  { id:'aws', name:'AWS Cloud', icon:'☁️', desc:'Amazon Web Services', count:30 },
  { id:'blockchain', name:'Blockchain', icon:'🏛️', desc:'Decentralized apps', count:20 },
  { id:'game-dev', name:'Game Development', icon:'🎮', desc:'Create interactive games', count:25 },
  { id:'robotics', name:'Robotics', icon:'🤖', desc:'Robotic systems', count:20 },
  { id:'cryptography', name:'Cryptography', icon:'🔒', desc:'Secure communication', count:25 },
  { id:'computer-fund', name:'Computer Fundamentals', icon:'💰', desc:'Basic computer concepts', count:30 },
  { id:'digital-marketing', name:'Digital Marketing', icon:'📱', desc:'Promote brands digitally', count:20 }
];

AppPages.quizLoaded = function() {
  AppPages._renderQuizSkills(AppPages._quizSkills);
};

AppPages._renderQuizSkills = function(skills) {
  const grid = document.getElementById('quizSkillsGrid');
  if (!grid) return;
  if (!skills.length) {
    grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><i class="bi bi-search empty-state-icon"></i><h3>No skills found</h3></div>';
    return;
  }
  grid.innerHTML = skills.map(s => `
    <div class="card card-hover stagger-item" style="cursor:pointer" onclick="AppPages.openQuizSkill('${s.id}')">
      <div class="d-flex items-center gap-3 mb-3">
        <div class="stat-card-icon blue" style="width:44px;height:44px;font-size:1.4rem;display:flex;align-items:center;justify-content:center">${s.icon}</div>
        <div>
          <h5 class="mb-0">${s.name}</h5>
          <span class="text-xs text-tertiary">${s.count} challenges</span>
        </div>
      </div>
      <p class="text-sm text-secondary">${s.desc}</p>
    </div>
  `).join('');
};

AppPages.filterQuizSkills = function() {
  const q = (document.getElementById('quizSearchInput')?.value || '').toLowerCase();
  const filtered = AppPages._quizSkills.filter(s => s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
  AppPages._renderQuizSkills(filtered);
};

AppPages.openQuizSkill = function(skillId) {
  const skill = AppPages._quizSkills.find(s => s.id === skillId);
  if (!skill) return;
  const grid = document.getElementById('quizSkillsGrid');
  if (!grid) return;
  grid.innerHTML = `
    <div style="grid-column:1/-1">
      <button class="btn btn-ghost btn-sm mb-4" onclick="AppPages.quizLoaded()"><i class="bi bi-arrow-left"></i> Back to Skills</button>
      <h3 class="mb-2">${skill.icon} ${skill.name}</h3>
      <p class="text-secondary text-sm mb-4">${skill.desc}</p>
      <div class="grid-3" id="quizChallengesList">
        ${[1,2,3,4,5].map(i => `
          <div class="card card-hover" style="cursor:pointer" onclick="AppPages.startQuiz('${skillId}', ${i})">
            <div class="d-flex justify-between items-start mb-3">
              <div class="stat-card-icon ${i<=2?'green':i<=4?'yellow':'info'}" style="width:40px;height:40px;font-size:1rem"><i class="bi bi-${i<=2?'play-circle':i<=4?'lightning':'trophy'}"></i></div>
              ${UI.badge(i<=2?'Beginner':i<=4?'Intermediate':'Advanced', i<=2?'success':i<=4?'warning':'info')}
            </div>
            <h5>${skill.name} Challenge ${i}</h5>
            <div class="d-flex justify-between items-center mt-2 text-sm">
              <span class="text-tertiary"><i class="bi bi-clock"></i> ${i<=2?'5':i<=4?'10':'15'} min</span>
              <span class="text-tertiary"><i class="bi bi-star"></i> ${i<=2?'50':i<=4?'100':'200'} XP</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
};

AppPages.startQuiz = function(skillId, challengeNum) {
  const skill = AppPages._quizSkills.find(s => s.id === skillId);
  const grid = document.getElementById('quizSkillsGrid');
  if (!grid) return;
  const timeLimit = challengeNum <= 2 ? 5 : challengeNum <= 4 ? 10 : 15;
  const xpReward = challengeNum <= 2 ? 50 : challengeNum <= 4 ? 100 : 200;

  grid.innerHTML = `
    <div style="grid-column:1/-1">
      <div class="card">
        <div class="d-flex justify-between items-center mb-4">
          <h4>${skill?.icon || '❓'} ${skill?.name || skillId} - Challenge ${challengeNum}</h4>
          <div class="d-flex gap-3 items-center">
            <span class="badge badge-warning" id="quizTimer"><i class="bi bi-clock"></i> ${timeLimit}:00</span>
            <span class="badge badge-info" id="quizScore">Score: 0</span>
          </div>
        </div>
        <div id="quizQuestionArea">
          <div class="d-flex justify-center items-center p-6">
            <div class="loader-spinner"></div>
            <span class="text-secondary ml-3">Loading questions...</span>
          </div>
        </div>
        <div class="d-flex justify-between items-center mt-4 pt-3" style="border-top:1px solid var(--border-primary)">
          <span class="text-sm text-tertiary" id="quizProgress">Question 1 of 10</span>
          <div class="d-flex gap-2">
            <button class="btn btn-ghost btn-sm" onclick="AppPages.openQuizSkill('${skillId}')">Quit</button>
            <button class="btn btn-primary btn-sm" id="quizNextBtn" onclick="AppPages.quizNext()" disabled>Next <i class="bi bi-arrow-right"></i></button>
          </div>
        </div>
      </div>
    </div>
  `;

  const bankQuestions = (AppPages._quizBank && AppPages._quizBank[skillId]) ? AppPages._quizBank[skillId] : [];
  const shuffled = bankQuestions.length > 0
    ? [...bankQuestions].sort(() => Math.random() - 0.5)
    : [
        { q: 'What does CPU stand for?', opts: ['Central Processing Unit','Computer Personal Unit','Central Program Utility','Core Processing Unit'], correct: 0 },
        { q: 'Which protocol is used for secure web browsing?', opts: ['HTTP','FTP','HTTPS','SMTP'], correct: 2 },
        { q: 'What is the binary representation of decimal 10?', opts: ['1010','1100','1001','1110'], correct: 0 },
        { q: 'Which data structure uses FIFO?', opts: ['Stack','Queue','Tree','Graph'], correct: 1 },
        { q: 'What does RAM stand for?', opts: ['Random Access Memory','Read Access Memory','Run All Modules','Rapid Access Module'], correct: 0 },
        { q: 'Which language is used for web styling?', opts: ['JavaScript','HTML','CSS','Python'], correct: 2 },
        { q: 'What is an API?', opts: ['Application Programming Interface','Auto Program Integration','Applied Protocol Info','App Process Index'], correct: 0 },
        { q: 'Which OS is open source?', opts: ['Windows','macOS','Linux','iOS'], correct: 2 },
        { q: 'What does HTML stand for?', opts: ['HyperText Markup Language','High Tech Modern Language','Home Tool Markup Language','HyperText Machine Language'], correct: 0 },
        { q: 'What is the purpose of DNS?', opts: ['Domain Name System - resolves domain to IP','Data Network Service','Digital Name Server','Direct Network Socket'], correct: 0 }
      ];
  const questions = shuffled.slice(0, 10);
  let currentQ = 0, score = 0, answered = false, selectedIdx = null;
  let timeLeft = timeLimit * 60;

  AppPages._quizState = { questions, currentQ: 0, score: 0, timeLeft, timer: null };

  function renderQuestion() {
    const q = questions[currentQ];
    const area = document.getElementById('quizQuestionArea');
    const progress = document.getElementById('quizProgress');
    const nextBtn = document.getElementById('quizNextBtn');
    if (!area) return;
    answered = false;
    selectedIdx = null;
    if (nextBtn) nextBtn.disabled = true;

    area.innerHTML = `
      <div class="mb-4">
        <p class="text-sm text-tertiary mb-2">Question ${currentQ + 1} of ${questions.length}</p>
        <h5 class="mb-4">${q.q}</h5>
        <div class="d-flex flex-column gap-2">
          ${q.opts.map((opt, i) => `
            <button class="btn btn-ghost btn-sm text-left" id="quizOpt${i}" onclick="AppPages.quizAnswer(${i})" style="justify-content:flex-start;gap:10px;padding:12px 16px;border:1px solid var(--border-primary);border-radius:var(--radius-md)">
              <span style="width:28px;height:28px;border-radius:50%;border:2px solid var(--border-primary);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:600;flex-shrink:0">${String.fromCharCode(65+i)}</span>
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;
    if (progress) progress.textContent = `Question ${currentQ + 1} of ${questions.length}`;
  }

  AppPages.quizAnswer = function(idx) {
    if (answered) return;
    answered = true;
    selectedIdx = idx;
    const q = questions[currentQ];
    const isCorrect = idx === q.correct;
    if (isCorrect) { score++; document.getElementById('quizScore').textContent = 'Score: ' + score; }

    q.opts.forEach((_, i) => {
      const btn = document.getElementById('quizOpt' + i);
      if (!btn) return;
      if (i === q.correct) { btn.style.borderColor = 'var(--accent-success)'; btn.style.background = 'var(--bg-success)'; }
      else if (i === idx && !isCorrect) { btn.style.borderColor = 'var(--accent-danger)'; btn.style.background = 'var(--bg-danger)'; }
      btn.style.pointerEvents = 'none';
    });
    const nextBtn = document.getElementById('quizNextBtn');
    if (nextBtn) nextBtn.disabled = false;
  };

  AppPages.quizNext = function() {
    currentQ++;
    if (currentQ >= questions.length) {
      AppPages.quizComplete(skillId, challengeNum);
      return;
    }
    renderQuestion();
  };

  AppPages.quizComplete = function(skillId, challengeNum) {
    if (AppPages._quizState?.timer) clearInterval(AppPages._quizState.timer);
    const pct = Math.round((score / questions.length) * 100);
    const grid = document.getElementById('quizSkillsGrid');
    if (!grid) return;
    grid.innerHTML = `
      <div style="grid-column:1/-1">
        <div class="card" style="text-align:center;padding:48px">
          <div style="font-size:4rem;margin-bottom:16px">${pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '📚'}</div>
          <h3 class="mb-2">Challenge Complete!</h3>
          <p class="text-secondary mb-4">${skill?.name || skillId} - Challenge ${challengeNum}</p>
          <div class="d-flex justify-center gap-4 mb-4">
            <div class="text-center"><div class="stat-card-value" style="font-size:2rem;color:var(--accent-primary)">${score}/${questions.length}</div><div class="text-xs text-tertiary">Score</div></div>
            <div class="text-center"><div class="stat-card-value" style="font-size:2rem;color:var(--accent-success)">${pct}%</div><div class="text-xs text-tertiary">Accuracy</div></div>
            <div class="text-center"><div class="stat-card-value" style="font-size:2rem;color:var(--accent-warning)">${pct >= 60 ? xpReward : 0}</div><div class="text-xs text-tertiary">XP Earned</div></div>
          </div>
          <div class="d-flex justify-center gap-2">
            <button class="btn btn-ghost" onclick="AppPages.quizLoaded()"><i class="bi bi-house"></i> Skills</button>
            <button class="btn btn-primary" onclick="AppPages.openQuizSkill('${skillId}')"><i class="bi bi-arrow-left"></i> Back to Skill</button>
          </div>
        </div>
      </div>
    `;
  };

  renderQuestion();

  AppPages._quizState.timer = setInterval(() => {
    timeLeft--;
    const el = document.getElementById('quizTimer');
    if (el) {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      el.innerHTML = `<i class="bi bi-clock"></i> ${m}:${s.toString().padStart(2, '0')}`;
    }
    if (timeLeft <= 0) {
      clearInterval(AppPages._quizState.timer);
      AppPages.quizComplete(skillId, challengeNum);
    }
  }, 1000);
};

/* ============================================
   YOUTUBE / VIDEO COURSES INTEGRATION
   ============================================ */
AppPages.videos = function() {
  return AppPages.wrap('Video Courses', `
    <div class="d-flex justify-between items-center mb-4">
      <p class="text-secondary text-sm">Watch educational videos from Batch15Tube.</p>
      <div class="d-flex gap-2">
        <input type="text" class="form-input form-input-sm" id="videoSearchInput" placeholder="Search videos..." oninput="AppPages.filterVideos()" style="max-width:220px">
      </div>
    </div>
    <div id="videoSkillsGrid" class="grid-3 stagger-children">
      ${UI.skeleton('card', 6)}
    </div>
    <div id="videoListArea" style="display:none"></div>
  `);
};

AppPages._videoSkills = [];
AppPages._videoProgress = {};

AppPages.videosLoaded = async function() {
  try {
    const skills = await API.getYoutubeSkills();
    AppPages._videoSkills = skills;
    AppPages._renderVideoSkills(skills);

    // Load user progress if logged in
    if (DB.currentUser) {
      try {
        const prog = await API.getMyVideoProgress();
        AppPages._videoProgress = {};
        (prog.skills || []).forEach(s => {
          AppPages._videoProgress[s.id] = {
            total: s.total_videos,
            completed: s.completed_videos,
            pct: s.total_videos > 0 ? Math.round((s.completed_videos / s.total_videos) * 100) : 0,
          };
        });
        AppPages._renderVideoSkills(AppPages._videoSkills);
      } catch(e) {}
    }
  } catch(e) {
    const grid = document.getElementById('videoSkillsGrid');
    if (grid) grid.innerHTML = '<div class="card text-center p-4"><p class="text-secondary">Video courses unavailable. The Batch15Tube database may not be set up yet.</p></div>';
  }
};

AppPages._renderVideoSkills = function(skills) {
  const grid = document.getElementById('videoSkillsGrid');
  if (!grid) return;
  grid.innerHTML = skills.map(s => {
    const prog = AppPages._videoProgress[s.id];
    const pct = prog ? prog.pct : 0;
    const vidLabel = prog ? `${prog.completed}/${prog.total} completed` : `${s.video_count || 0} videos`;
    return `
    <div class="card card-hover stagger-item" style="cursor:pointer;border-left:3px solid ${s.color || 'var(--accent-primary)'}" onclick="AppPages.openVideoSkill(${s.id})">
      <div class="d-flex items-center gap-3 mb-3">
        <div style="width:44px;height:44px;border-radius:12px;background:${s.color || 'var(--accent-primary)'}20;display:flex;align-items:center;justify-content:center;font-size:1.4rem;color:${s.color || 'var(--accent-primary)'}"><i class="bi bi-play-circle"></i></div>
        <div style="flex:1;min-width:0">
          <h5 class="mb-0" style="font-size:0.95rem">${s.name}</h5>
          <span class="text-xs text-tertiary">${vidLabel}</span>
        </div>
      </div>
      <div class="progress mt-2" style="height:4px"><div class="progress-bar" style="width:${pct > 0 ? pct : Math.floor(Math.random()*20+10)}%;background:${s.color || 'var(--accent-primary)'}"></div></div>
    </div>`;
  }).join('');
};

AppPages.filterVideos = function() {
  const q = (document.getElementById('videoSearchInput')?.value || '').toLowerCase();
  if (q.length < 1) {
    AppPages._renderVideoSkills(AppPages._videoSkills);
    return;
  }
  const filtered = AppPages._videoSkills.filter(s =>
    s.name.toLowerCase().includes(q) || (s.description || '').toLowerCase().includes(q)
  );
  AppPages._renderVideoSkills(filtered);
};

AppPages.openVideoSkill = async function(skillId) {
  const grid = document.getElementById('videoSkillsGrid');
  const listArea = document.getElementById('videoListArea');
  if (!grid || !listArea) return;

  grid.style.display = 'none';
  listArea.style.display = 'block';
  listArea.innerHTML = '<div class="p-4 text-center"><div class="spinner"></div><p class="text-secondary text-sm mt-2">Loading videos...</p></div>';

  try {
    const skill = await API.getYoutubeSkill(skillId);
    if (!skill) {
      listArea.innerHTML = '<div class="card text-center p-4"><p class="text-secondary">Skill not found.</p></div>';
      grid.style.display = '';
      return;
    }

    const videos = skill.videos || [];
    const subSkills = skill.sub_skills || [];

    listArea.innerHTML = `
      <button class="btn btn-ghost btn-sm mb-4" onclick="document.getElementById('videoSkillsGrid').style.display='';document.getElementById('videoListArea').style.display='none'"><i class="bi bi-arrow-left"></i> Back to Skills</button>
      <div class="d-flex items-center gap-3 mb-4">
        <div style="width:48px;height:48px;border-radius:12px;background:${skill.color || 'var(--accent-primary)'}20;display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:${skill.color || 'var(--accent-primary)'}"><i class="bi bi-play-circle-fill"></i></div>
        <div>
          <h3 class="mb-0">${skill.name}</h3>
          <span class="text-sm text-tertiary">${skill.description || ''}</span>
        </div>
      </div>
      ${subSkills.length > 0 ? `
      <div class="card mb-4">
        <h6 class="mb-2" style="font-size:0.85rem"><i class="bi bi-map"></i> Learning Roadmap</h6>
        <div class="d-flex gap-2 flex-wrap">
          ${subSkills.map((ss, i) => `<span class="badge" style="background:${skill.color || 'var(--accent-primary)'}15;color:${skill.color || 'var(--accent-primary)'};font-size:0.75rem">${i+1}. ${ss.name}</span>`).join('')}
        </div>
      </div>` : ''}
      ${videos.length > 0 ? `
      <div class="grid-3" id="videoListGrid">
        ${videos.map(v => {
          const thumb = v.thumbnail || (v.youtube_id ? `https://img.youtube.com/vi/${v.youtube_id}/mqdefault.jpg` : '');
          const prog = AppPages._videoProgress[skillId];
          return `
          <div class="card card-hover" style="cursor:pointer;border-left:2px solid ${skill.color || 'var(--accent-primary)'}" onclick="AppPages.playVideo(${v.id})">
            <div style="position:relative;margin-bottom:12px;border-radius:var(--radius-md);overflow:hidden;background:var(--bg-tertiary);aspect-ratio:16/9;display:flex;align-items:center;justify-content:center">
              ${thumb ? `<img src="${thumb}" alt="${esc(v.title)}" style="width:100%;height:100%;object-fit:cover" onerror="this.style.display='none'">` : ''}
              <i class="bi bi-play-circle" style="font-size:2.5rem;color:${skill.color || 'var(--accent-primary)'};opacity:0.9;position:absolute;z-index:1"></i>
              <span style="position:absolute;bottom:6px;right:6px;background:rgba(0,0,0,0.8);color:#fff;padding:2px 6px;border-radius:4px;font-size:0.7rem">${v.duration || ''}</span>
            </div>
            <h6 class="mb-1" style="font-size:0.88rem;line-height:1.3">${esc(v.title)}</h6>
            <div class="d-flex justify-between items-center text-xs text-tertiary">
              <span><i class="bi bi-eye"></i> ${v.views || 0} views</span>
              <span>${v.instructor || 'Batch15Tube'}</span>
            </div>
          </div>`;
        }).join('')}
      </div>` : `
      <div class="card text-center p-4">
        <i class="bi bi-camera-video" style="font-size:2rem;color:var(--text-tertiary)"></i>
        <p class="text-secondary text-sm mt-2">No videos yet for this skill. Videos will be added soon.</p>
      </div>`}
    `;
  } catch(e) {
    listArea.innerHTML = '<div class="card text-center p-4"><p class="text-secondary">Failed to load skill details.</p></div>';
  }
};

AppPages.playVideo = async function(videoId) {
  const listArea = document.getElementById('videoListArea');
  if (!listArea) return;

  listArea.innerHTML = '<div class="p-4 text-center"><div class="spinner"></div><p class="text-secondary text-sm mt-2">Loading video...</p></div>';

  try {
    const video = await API.getYoutubeVideo(videoId);
    if (!video) {
      listArea.innerHTML = '<div class="card text-center p-4"><p class="text-secondary">Video not found.</p></div>';
      return;
    }

    const embedUrl = video.embed_url || (video.youtube_id ? `https://www.youtube.com/embed/${video.youtube_id}` : '');
    const skillColor = video.skill_color || 'var(--accent-primary)';

    listArea.innerHTML = `
      <button class="btn btn-ghost btn-sm mb-4" onclick="AppPages.openVideoSkill(${video.skill_id || 0})"><i class="bi bi-arrow-left"></i> Back to ${video.skill_name || 'Videos'}</button>
      <div class="card mb-4" style="border-left:3px solid ${skillColor}">
        <div style="position:relative;border-radius:var(--radius-md);overflow:hidden;background:#000;aspect-ratio:16/9">
          ${embedUrl ? `<iframe src="${embedUrl}?autoplay=1&enablejsapi=1" style="width:100%;height:100%;border:none" allow="autoplay;encrypted-media" allowfullscreen></iframe>` : '<div class="d-flex items-center justify-center" style="height:100%"><i class="bi bi-exclamation-circle" style="font-size:2rem;color:#fff"></i></div>'}
        </div>
        <div class="mt-3">
          <h4 style="font-size:1.1rem">${esc(video.title)}</h4>
          <div class="d-flex items-center gap-3 text-sm text-tertiary mt-2">
            <span><i class="bi bi-eye"></i> ${video.views || 0} views</span>
            <span><i class="bi bi-person"></i> ${video.instructor || 'Batch15Tube'}</span>
            ${video.duration ? `<span><i class="bi bi-clock"></i> ${video.duration}</span>` : ''}
            <span style="color:${skillColor}"><i class="bi bi-tag"></i> ${video.skill_name || ''}</span>
          </div>
          ${video.description ? `<p class="mt-3 text-sm" style="line-height:1.6">${esc(video.description)}</p>` : ''}
        </div>
      </div>
      ${video.playlist && video.playlist.length > 1 ? `
      <div class="card">
        <h6 class="mb-3" style="font-size:0.85rem"><i class="bi bi-list-ol"></i> Playlist (${video.playlist.length} videos)</h6>
        <div style="display:flex;flex-direction:column;gap:8px">
          ${video.playlist.map((pv, i) => `
            <div class="d-flex items-center gap-3 p-2" style="border-radius:var(--radius-sm);cursor:pointer;background:${pv.id == videoId ? skillColor + '15' : 'transparent'}" onclick="AppPages.playVideo(${pv.id})">
              <span class="text-xs text-tertiary" style="min-width:20px">${i + 1}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:0.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;${pv.id == videoId ? 'font-weight:600' : ''}">${pv.title}</div>
                <span class="text-xs text-tertiary">${pv.duration || ''}</span>
              </div>
              ${pv.id == videoId ? '<i class="bi bi-volume-up" style="color:' + skillColor + ';font-size:0.8rem"></i>' : ''}
            </div>
          `).join('')}
        </div>
      </div>` : ''}
    `;
  } catch(e) {
    listArea.innerHTML = '<div class="card text-center p-4"><p class="text-secondary">Failed to load video.</p></div>';
  }
};

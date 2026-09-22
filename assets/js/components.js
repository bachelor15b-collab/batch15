/* ============================================
   CS15 Hub - Reusable UI Components v2
   Includes animated counters & enhanced UI
   ============================================ */
if (typeof window.esc !== 'function') {
  window.esc = function (str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  };
}
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("active");
}
const UI = {
  showLoader(show = true) {
    const app = document.getElementById('app');
    if (show) {
      app.innerHTML = `<div class="app-loader"><div class="loader-spinner"></div><span class="loader-text typing-cursor">Loading <span id="loaderMsg">CS15 Hub</span>...</span></div>`;
      this._rotateLoaderMessages();
    }
  },

  hideLoader() {
    if (window._loaderInterval) {
      clearInterval(window._loaderInterval);
      window._loaderInterval = null;
    }
  },

  _rotateLoaderMessages() {
    const msgs = ['CS15 Hub', 'Dashboard', 'Content', 'Analytics', 'Messages'];
    let i = 0;
    if (window._loaderInterval) clearInterval(window._loaderInterval);
    window._loaderInterval = setInterval(() => {
      const el = document.getElementById('loaderMsg');
      if (el) el.textContent = msgs[++i % msgs.length];
      else clearInterval(window._loaderInterval);
    }, 800);
  },

  showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    const icons = { success: 'bi-check-circle-fill', error: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="bi ${icons[type] || icons.info} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${esc(title)}</div>
        <div class="toast-message">${esc(message)}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;
    container.appendChild(toast);
    setTimeout(() => { if (toast.parentElement) { toast.style.opacity = '0'; toast.style.transform = 'translateX(100px)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); } }, 4000);
  },

  showModal(title, bodyHtml, footerHtml = '') {
    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="modal-overlay show" onclick="if(event.target===this) document.getElementById('modal-container').innerHTML=''">
        <div class="modal-content animate-scaleIn">
          <div class="modal-header">
            <h3 class="modal-title">${esc(title)}</h3>
            <button class="modal-close" onclick="document.getElementById('modal-container').innerHTML=''">&times;</button>
          </div>
          <div class="modal-body">${bodyHtml}</div>
          ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
        </div>
      </div>
    `;
  },

  closeModal() {
    document.getElementById('modal-container').innerHTML = '';
  },

  // ----- ANIMATED COUNTER -----
  // Animate a number from 0 to target.
  // element: DOM element, target: final number, duration: ms, suffix: optional string like '%' or 'k'
  countUp(element, target, duration = 1000, suffix = '') {
    if (!element) return;
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      if (isFloat) {
        element.textContent = current.toFixed(1) + suffix;
      } else {
        element.textContent = Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Final value
        if (isFloat) {
          element.textContent = target.toFixed(1) + suffix;
        } else {
          element.textContent = target.toLocaleString() + suffix;
        }
        element.classList.add('count-animate');
      }
    };

    requestAnimationFrame(animate);
  },

  // Find all elements with data-count attribute and animate them
  initCounters(container = document) {
    const elements = container.querySelectorAll('[data-count]');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.getAttribute('data-count'));
          const duration = parseInt(el.getAttribute('data-duration')) || 1200;
          const suffix = el.getAttribute('data-suffix') || '';
          const delay = parseInt(el.getAttribute('data-delay')) || 0;
          if (!isNaN(target)) {
            setTimeout(() => {
              this.countUp(el, target, duration, suffix);
            }, delay);
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    elements.forEach(el => observer.observe(el));
  },

  skeleton(type = 'card', count = 3) {
    let html = '';
    for (let i = 0; i < count; i++) {
      if (type === 'card') {
        html += `<div class="card"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text"></div><div class="skeleton skeleton-text" style="width:60%"></div></div>`;
      } else if (type === 'table') {
        html += `<div class="skeleton skeleton-text" style="height:44px;margin-bottom:6px;border-radius:8px"></div>`;
      } else if (type === 'stat') {
        html += `<div class="stat-card"><div class="skeleton skeleton-avatar" style="margin-bottom:14px"></div><div class="skeleton skeleton-title" style="width:50%;height:28px"></div><div class="skeleton skeleton-text" style="width:40%"></div></div>`;
      }
    }
    return html;
  },

  avatar(name, size = 'md', url = null) {
    if (url) {
      const sizes = { sm: '34px', md: '42px', lg: '60px', xl: '80px' };
      return `<div class="avatar avatar-${size}" style="width:${sizes[size]||sizes.md};height:${sizes[size]||sizes.md};overflow:hidden"><img src="${url}" alt="${name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%"></div>`;
    }
    const colors = ['#2563EB', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#f97316'];
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const color = colors[name.length % colors.length];
    const sizes = { sm: '34px', md: '42px', lg: '60px', xl: '80px' };
    const fonts = { sm: '0.78rem', md: '0.9rem', lg: '1.2rem', xl: '1.75rem' };
    return `<div class="avatar avatar-${size}" style="background:${color};width:${sizes[size]||sizes.md};height:${sizes[size]||sizes.md};font-size:${fonts[size]||fonts.md}">${initials}</div>`;
  },

  badge(text, type = 'gray') {
    return `<span class="badge badge-${type}">${esc(text)}</span>`;
  },

  // statCard with data-count attribute for animated counting
  statCard(icon, value, label, change = null, iconColor = 'blue', dataCount = null) {
    const changeHtml = change ? `<span class="stat-card-change ${change.direction}"><i class="bi bi-arrow-${change.direction === 'up' ? 'up' : 'down'}-short"></i> ${change.value}</span>` : '';
    // Determine if value is numeric for counting
    const parsed = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, ''));
    const numericVal = dataCount !== null ? dataCount : ((typeof value === 'number' || (!isNaN(parsed) && parsed > 0)) ? parsed : null);
    const suffix = typeof value === 'string' ? value.replace(/[0-9.,]/g, '') : '';
    const countAttr = numericVal !== null && numericVal > 0 ? `data-count="${numericVal}" data-suffix="${suffix}"` : '';

    return `
      <div class="stat-card stagger-item">
        <div class="stat-card-icon ${iconColor}"><i class="bi ${icon}"></i></div>
        <div class="stat-card-value" ${countAttr}>${numericVal !== null ? '0' : value}</div>
        <div class="stat-card-label">${label}</div>
        ${changeHtml}
      </div>
    `;
  },

  activityItem(text, time, color = 'blue', icon = null) {
    const iconHtml = icon ? `<i class="bi ${icon}"></i>` : '';
    return `
      <div class="activity-item">
        <div class="activity-dot ${color}">${iconHtml}</div>
        <div class="activity-content">
          <div class="activity-text">${text}</div>
          <div class="activity-time">${time}</div>
        </div>
      </div>
    `;
  },

  section(title, subtitle = '') {
    return `
      <div class="page-header flex items-center justify-between">
        <div>
          <h1 class="page-header-title">${title}</h1>
          ${subtitle ? `<p class="page-header-subtitle">${subtitle}</p>` : ''}
        </div>
      </div>
    `;
  },

  formatDate(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },

  timeAgo(dateStr) {
    return this.formatDate(dateStr);
  },

  getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  },

  getAvatarColor(name) {
    const colors = ['#2563EB', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#3b82f6', '#f97316'];
    return colors[name.length % colors.length];
  },

  initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  },

  formatNumber(n) {
    if (n === null || n === undefined) return '0';
    if (typeof n === 'string') return n;
    return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n.toLocaleString();
  },

  escape(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  },
};

/**
 * Batch15Tube - Main JavaScript
 */

(function() {
    'use strict';

    const SITE_URL = window.location.origin + '/cs15b';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        initSidebar();
        initTheme();
        initLanguage();
        initUserMenu();
        initNotifications();
        initCategories();
        initSearch();
        initVideos();
        initLangPopup();
        initComments();
        initLazyLoading();
        initInfiniteScroll();
        createToastContainer();
    });

    // ============ SIDEBAR ============
    function initSidebar() {
        const toggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');

        if (!toggle || !sidebar) return;

        toggle.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('open');
                toggleOverlay();
            } else {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
            }
        });

        function toggleOverlay() {
            let overlay = document.querySelector('.sidebar-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                overlay.addEventListener('click', function() {
                    sidebar.classList.remove('open');
                    overlay.classList.remove('show');
                });
                document.body.appendChild(overlay);
            }
            overlay.classList.toggle('show');
        }
    }

    // ============ THEME ============
    function initTheme() {
        const toggle = document.getElementById('themeToggle');
        if (!toggle) return;

        const html = document.documentElement;
        const icon = toggle.querySelector('i');

        toggle.addEventListener('click', function() {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            icon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

            fetch(SITE_URL + '/api/theme.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'theme=' + next
            }).catch(function() {});
        });
    }

    // ============ LANGUAGE ============
    function initLanguage() {
        const langBtn = document.getElementById('langBtn');
        const langDropdown = document.getElementById('langDropdown');

        if (langBtn && langDropdown) {
            langBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                langDropdown.classList.toggle('show');
            });

            document.addEventListener('click', function() {
                langDropdown.classList.remove('show');
            });

            langDropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }

        document.querySelectorAll('.lang-option').forEach(function(el) {
            el.addEventListener('click', function(e) {
                e.preventDefault();
                const lang = this.getAttribute('data-lang');
                fetch(SITE_URL + '/api/language.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'language=' + lang
                }).then(function() {
                    location.reload();
                });
            });
        });
    }

    // ============ USER MENU ============
    function initUserMenu() {
        const userBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');

        if (!userBtn || !userDropdown) return;

        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        document.addEventListener('click', function() {
            userDropdown.classList.remove('show');
        });

        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // ============ NOTIFICATIONS ============
    function initNotifications() {
        const notifBtn = document.getElementById('notificationsBtn');
        if (!notifBtn) return;

        notifBtn.addEventListener('click', function() {
            fetch(SITE_URL + '/api/notifications.php')
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    showToast('Notifications loaded', 'info');
                })
                .catch(function() {});
        });
    }

    // ============ CATEGORIES ============
    function initCategories() {
        const btn = document.getElementById('categoriesBtn');
        const overlay = document.getElementById('categoriesOverlay');
        const close = document.getElementById('closeCategories');

        if (!btn || !overlay) return;

        btn.addEventListener('click', function() {
            overlay.classList.add('show');
        });

        function closeCategories() {
            overlay.classList.remove('show');
        }

        if (close) close.addEventListener('click', closeCategories);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeCategories();
        });
    }

    // ============ SEARCH ============
    function initSearch() {
        const input = document.getElementById('searchInput');
        if (!input) return;

        let timeout;
        input.addEventListener('input', function() {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                const q = input.value.trim();
                if (q.length >= 2) {
                    fetch(SITE_URL + '/api/search.php?q=' + encodeURIComponent(q))
                        .then(function(r) { return r.json(); })
                        .then(function(data) {
                            // Handle search results
                        });
                }
            }, 300);
        });
    }

    // ============ VIDEOS ============
    function initVideos() {
        // Video card click handler
        document.addEventListener('click', function(e) {
            const card = e.target.closest('.video-card');
            if (card) {
                const url = card.getAttribute('data-url');
                if (url) {
                    const langPopup = document.getElementById('langPopupOverlay');
                    if (langPopup) {
                        langPopup.classList.add('show');
                        langPopup.setAttribute('data-redirect', url);
                    }
                }
            }
        });

        // Language choice handler
        document.querySelectorAll('.lang-choice').forEach(function(el) {
            el.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                const popup = document.getElementById('langPopupOverlay');
                const redirect = popup ? popup.getAttribute('data-redirect') : '';

                fetch(SITE_URL + '/api/language.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'language=' + lang
                }).then(function() {
                    if (redirect) {
                        window.location.href = redirect;
                    }
                    if (popup) popup.classList.remove('show');
                });
            });
        });
    }

    // ============ LANGUAGE POPUP ============
    function initLangPopup() {
        const overlay = document.getElementById('langPopupOverlay');
        if (!overlay) return;

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.classList.remove('show');
            }
        });
    }

    // ============ COMMENTS ============
    function initComments() {
        document.addEventListener('click', function(e) {
            const btn = e.target.closest('.comment-submit');
            if (!btn) return;

            const form = btn.closest('.comment-form');
            const input = form ? form.querySelector('input') : null;
            const videoId = form ? form.getAttribute('data-video-id') : null;

            if (input && videoId && input.value.trim()) {
                fetch(SITE_URL + '/api/comments.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'video_id=' + videoId + '&content=' + encodeURIComponent(input.value.trim())
                }).then(function(r) { return r.json(); })
                  .then(function(data) {
                      if (data.success) {
                          input.value = '';
                          showToast('Comment added!', 'success');
                      } else {
                          showToast(data.message || 'Error adding comment', 'error');
                      }
                  });
            }
        });
    }

    // ============ LAZY LOADING ============
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const images = document.querySelectorAll('img[data-src]');
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            images.forEach(function(img) { observer.observe(img); });
        }
    }

    // ============ INFINITE SCROLL ============
    function initInfiniteScroll() {
        const sentinel = document.getElementById('scroll-sentinel');
        if (!sentinel) return;

        const grid = document.getElementById('video-grid');
        if (!grid) return;

        let page = 1;
        const loading = false;

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(function(entries) {
                if (entries[0].isIntersecting && !loading) {
                    page++;
                    loadMoreVideos(page);
                }
            });
            observer.observe(sentinel);
        }

        function loadMoreVideos(page) {
            fetch(SITE_URL + '/api/videos.php?page=' + page)
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    if (data.videos && data.videos.length > 0) {
                        data.videos.forEach(function(video) {
                            grid.insertAdjacentHTML('beforeend', createVideoCard(video));
                        });
                    } else {
                        if (sentinel) sentinel.style.display = 'none';
                    }
                });
        }

        function createVideoCard(video) {
            return '<div class="video-card" data-url="' + SITE_URL + '/public/video.php?id=' + video.id + '">' +
                '<div class="video-thumbnail">' +
                '<img src="' + (video.thumbnail || SITE_URL + '/assets/images/placeholder.jpg') + '" alt="' + escapeHtml(video.title) + '" loading="lazy">' +
                '<span class="video-duration">' + (video.duration || '0:00') + '</span>' +
                '</div>' +
                '<div class="video-info">' +
                '<h3 class="video-title">' + escapeHtml(video.title) + '</h3>' +
                '<div class="video-meta">' +
                '<span>' + escapeHtml(video.instructor || 'Batch15Tube') + '</span>' +
                '<span>&middot;</span>' +
                '<span>' + (video.views || 0) + ' views</span>' +
                '</div>' +
                (video.skill_name ? '<span class="video-skill-tag" style="background:' + video.skill_color + '">' + escapeHtml(video.skill_name) + '</span>' : '') +
                '</div>' +
                '</div>';
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.appendChild(document.createTextNode(text));
            return div.innerHTML;
        }
    }

    // ============ TOAST ============
    function createToastContainer() {
        if (!document.querySelector('.toast-container')) {
            const container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
    }

    window.showToast = function(message, type) {
        type = type || 'info';
        const container = document.querySelector('.toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.innerHTML = '<i class="fas fa-' + (type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle') + '"></i> ' + message;

        container.appendChild(toast);

        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(function() {
                toast.remove();
            }, 300);
        }, 3000);
    };

    // ============ PLAYER AUTOPLAY ============
    window.loadNextVideo = function(videoId) {
        if (videoId) {
            window.location.href = SITE_URL + '/public/video.php?id=' + videoId;
        }
    };

    // ============ SAVE/UNSAVE VIDEO ============
    window.toggleSaveVideo = function(videoId, btn) {
        fetch(SITE_URL + '/api/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'video_id=' + videoId
        }).then(function(r) { return r.json(); })
          .then(function(data) {
              if (data.saved) {
                  btn.classList.add('active');
                  showToast('Video saved!', 'success');
              } else {
                  btn.classList.remove('active');
                  showToast('Video removed from saved', 'info');
              }
          });
    };

    // ============ LIKE/UNLIKE VIDEO ============
    window.toggleLikeVideo = function(videoId, btn) {
        fetch(SITE_URL + '/api/like.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'video_id=' + videoId
        }).then(function(r) { return r.json(); })
          .then(function(data) {
              if (data.liked) {
                  btn.classList.add('active');
              } else {
                  btn.classList.remove('active');
              }
              const count = btn.querySelector('.like-count');
              if (count) count.textContent = data.count;
          });
    };

    // ============ UPDATE PROGRESS ============
    window.updateProgress = function(videoId, progress) {
        fetch(SITE_URL + '/api/progress.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'video_id=' + videoId + '&progress=' + progress
        }).catch(function() {});
    };

})();

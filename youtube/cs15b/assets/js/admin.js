/**
 * Batch15Tube - Admin JavaScript
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initAdminSidebar();
        initAdminModals();
        initAdminTables();
        initAdminForms();
        initLiveActivity();
        initCharts();
        initDeleteConfirm();
    });

    function initAdminSidebar() {
        const toggle = document.getElementById('adminSidebarToggle');
        const sidebar = document.getElementById('adminSidebar');

        if (toggle && sidebar) {
            toggle.addEventListener('click', function() {
                sidebar.classList.toggle('open');
            });
        }

        // Highlight active nav
        const currentPath = window.location.pathname;
        document.querySelectorAll('.admin-nav-item').forEach(function(item) {
            if (item.getAttribute('href') && currentPath.includes(item.getAttribute('href'))) {
                item.classList.add('active');
            }
        });
    }

    function initAdminModals() {
        document.querySelectorAll('[data-modal]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                const modalId = this.getAttribute('data-modal');
                const modal = document.getElementById(modalId);
                if (modal) modal.classList.add('show');
            });
        });

        document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
            overlay.addEventListener('click', function(e) {
                if (e.target === overlay) {
                    overlay.classList.remove('show');
                }
            });
        });

        document.querySelectorAll('.modal-close').forEach(function(btn) {
            btn.addEventListener('click', function() {
                this.closest('.modal-overlay').classList.remove('show');
            });
        });
    }

    function initAdminTables() {
        // Select all / deselect all
        document.querySelectorAll('.select-all').forEach(function(checkbox) {
            checkbox.addEventListener('change', function() {
                const checked = this.checked;
                const table = this.closest('.admin-table-container');
                if (table) {
                    table.querySelectorAll('.row-select').forEach(function(cb) {
                        cb.checked = checked;
                    });
                }
            });
        });
    }

    function initAdminForms() {
        // Preview YouTube thumbnail when URL is entered
        const youtubeInput = document.getElementById('youtubeUrl');
        const thumbnailPreview = document.getElementById('thumbnailPreview');

        if (youtubeInput && thumbnailPreview) {
            youtubeInput.addEventListener('input', function() {
                const url = this.value.trim();
                const videoId = getYouTubeId(url);
                if (videoId) {
                    thumbnailPreview.innerHTML = '<img src="https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg" alt="Preview" style="max-width:200px;border-radius:8px;">';
                    document.getElementById('youtubeId').value = videoId;
                } else {
                    thumbnailPreview.innerHTML = '';
                }
            });
        }
    }

    function initLiveActivity() {
        const container = document.getElementById('liveActivity');
        if (!container) return;

        function fetchLiveActivity() {
            fetch(window.location.origin + '/cs15b/api/admin/live.php')
                .then(function(r) { return r.json(); })
                .then(function(data) {
                    if (data.activities) {
                        container.innerHTML = '';
                        data.activities.forEach(function(item) {
                            container.insertAdjacentHTML('beforeend', createLiveItem(item));
                        });
                    }
                })
                .catch(function() {});
        }

        fetchLiveActivity();
        setInterval(fetchLiveActivity, 15000);
    }

    function createLiveItem(item) {
        return '<div class="live-item">' +
            '<img src="' + (item.avatar || '/cs15b/uploads/avatars/default.png') + '" class="live-user-avatar" alt="">' +
            '<div class="live-info">' +
            '<div class="live-username">' + escapeHtml(item.username) + '</div>' +
            '<div class="live-watching">Watching: ' + escapeHtml(item.video_title) + '</div>' +
            '</div>' +
            '<div class="live-stats">' +
            '<span>' + item.duration + ' min</span>' +
            '<span>' + item.progress + '%</span>' +
            '<span>' + item.language + '</span>' +
            '</div>' +
            '</div>';
    }

    function initCharts() {
        // Chart.js would be integrated here
        // For now, this is a placeholder
        document.querySelectorAll('.chart-container canvas').forEach(function(canvas) {
            const ctx = canvas.getContext('2d');
            // Integration point for Chart.js
        });
    }

    function initDeleteConfirm() {
        document.querySelectorAll('[data-confirm]').forEach(function(el) {
            el.addEventListener('click', function(e) {
                const message = this.getAttribute('data-confirm') || 'Are you sure?';
                if (!confirm(message)) {
                    e.preventDefault();
                }
            });
        });
    }

    function getYouTubeId(url) {
        var match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        return match ? match[1] : null;
    }

    function escapeHtml(text) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(text));
        return div.innerHTML;
    }

    window.exportTable = function(tableId, filename) {
        var table = document.getElementById(tableId);
        if (!table) return;

        var csv = [];
        table.querySelectorAll('tr').forEach(function(row) {
            var cols = [];
            row.querySelectorAll('td, th').forEach(function(cell) {
                cols.push('"' + cell.textContent.trim().replace(/"/g, '""') + '"');
            });
            csv.push(cols.join(','));
        });

        var blob = new Blob([csv.join('\n')], { type: 'text/csv' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = (filename || 'export') + '.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

})();

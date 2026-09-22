/**
 * Batch15Tube - Dashboard JavaScript
 */

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        initStudyChart();
        initMonthlyChart();
        initContinueLearning();
        initCertificateDownload();
    });

    function initStudyChart() {
        var canvas = document.getElementById('weeklyChart');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');

        var days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        var data = canvas.getAttribute('data-hours');

        var hours = data ? data.split(',').map(Number) : [0, 0, 0, 0, 0, 0, 0];

        var max = Math.max.apply(null, hours) || 1;
        var barWidth = (canvas.width - 80) / days.length - 12;
        var chartHeight = canvas.height - 60;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        hours.forEach(function(h, i) {
            var x = 40 + i * (barWidth + 12);
            var barH = (h / max) * chartHeight;
            var y = canvas.height - 30 - barH;

            // Bar gradient
            var gradient = ctx.createLinearGradient(x, y, x, canvas.height - 30);
            gradient.addColorStop(0, '#6C63FF');
            gradient.addColorStop(1, '#8B85FF');
            ctx.fillStyle = gradient;

            ctx.beginPath();
            ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
            ctx.fill();

            // Value on top
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim() || '#0f0f0f';
            ctx.font = '11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(h + 'h', x + barWidth / 2, y - 6);

            // Day label
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim() || '#606060';
            ctx.fillText(days[i], x + barWidth / 2, canvas.height - 10);
        });
    }

    function initMonthlyChart() {
        var canvas = document.getElementById('monthlyChart');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var data = canvas.getAttribute('data-monthly');

        var values = data ? data.split(',').map(Number) : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        var max = Math.max.apply(null, values) || 1;
        var pointSpacing = (canvas.width - 80) / (values.length - 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Grid lines
        for (var i = 0; i <= 4; i++) {
            var gy = 20 + i * ((canvas.height - 60) / 4);
            ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim() || '#e5e5e5';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(40, gy);
            ctx.lineTo(canvas.width - 20, gy);
            ctx.stroke();

            var label = Math.round((max / 4) * (4 - i));
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim() || '#909090';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(label, 35, gy + 4);
        }

        // Line path
        ctx.beginPath();
        ctx.strokeStyle = '#6C63FF';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';

        values.forEach(function(v, i) {
            var x = 40 + i * pointSpacing;
            var y = canvas.height - 30 - (v / max) * (canvas.height - 60);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Area fill
        var lastX = 40 + (values.length - 1) * pointSpacing;
        var lastY = canvas.height - 30;
        ctx.lineTo(lastX, lastY);
        ctx.lineTo(40, lastY);
        ctx.closePath();
        var gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(108, 99, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(108, 99, 255, 0.02)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Points
        values.forEach(function(v, i) {
            var x = 40 + i * pointSpacing;
            var y = canvas.height - 30 - (v / max) * (canvas.height - 60);
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#6C63FF';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Month labels
        var step = Math.max(1, Math.floor(values.length / 6));
        values.forEach(function(v, i) {
            if (i % step === 0 || i === values.length - 1) {
                var x = 40 + i * pointSpacing;
                ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-tertiary').trim() || '#909090';
                ctx.font = '10px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(months[i], x, canvas.height - 10);
            }
        });
    }

    function initContinueLearning() {
        document.querySelectorAll('.continue-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var url = this.getAttribute('data-url');
                if (url) window.location.href = url;
            });
        });
    }

    function initCertificateDownload() {
        document.querySelectorAll('.download-certificate').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                var certId = this.getAttribute('data-cert-id');
                if (certId) {
                    var url = this.getAttribute('data-url') || ('/cs15b/certificates/download.php?id=' + certId);
                    window.open(url, '_blank');
                }
            });
        });
    }

    // Canvas roundRect polyfill
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
            var r = Array.isArray(radii) ? radii : [radii, radii, radii, radii];
            this.moveTo(x + r[0], y);
            this.lineTo(x + w - r[1], y);
            this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
            this.lineTo(x + w, y + h - r[2]);
            this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
            this.lineTo(x + r[3], y + h);
            this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
            this.lineTo(x, y + r[0]);
            this.quadraticCurveTo(x, y, x + r[0], y);
            this.closePath();
        };
    }

})();

/* ============================================
   Batch15 Challenges - Challenge Page Logic
   Timer, Anti-Cheat, Questions, Results, Certificate
   ============================================ */

(function() {
  'use strict';

  /* ====== State ====== */
  const params = new URLSearchParams(window.location.search);
  const skillId = params.get('skill');
  const challengeId = params.get('challenge');
  let skill, challenge, questions;
  let currentQ = 0;
  let answers = {};
  let timerInterval;
  let timeRemaining = 90 * 60; /* 1h 30m in seconds */
  let isSubmitted = false;
  let isPaused = false;

  /* Anti-cheat state */
  let warningCount = 0;
  const MAX_WARNINGS = 3;
  let isSpeedBlocked = false;
  let lastAnswerTime = Date.now();
  let fastAnswerCount = 0;
  const MIN_ANSWER_INTERVAL = 2000; /* 2 seconds */
  const MAX_FAST_ANSWERS = 5;
  let inactivityTimer;
  const INACTIVITY_LIMIT = 5 * 60; /* 5 minutes in seconds */
  let lastActivityTime = Date.now();

  /* DOM refs */
  const sidebarContent = document.getElementById('sidebarContent');
  const challengeContent = document.getElementById('challengeContent');
  const toastContainer = document.getElementById('toastContainer');
  const warningOverlay = document.getElementById('warningOverlay');
  const warningNum = document.getElementById('warningNum');
  const warningMax = document.getElementById('warningMax');
  const warningTitle = document.getElementById('warningTitle');
  const warningMessage = document.getElementById('warningMessage');
  const warningDismiss = document.getElementById('warningDismiss');
  const speedBlockOverlay = document.getElementById('speedBlockOverlay');
  const speedBlockTimer = document.getElementById('speedBlockTimer');
  const resultsOverlay = document.getElementById('resultsModalOverlay');
  const resultsBody = document.getElementById('resultsBody');
  const resultsClose = document.getElementById('resultsClose');
  const resultsCloseBtn = document.getElementById('resultsCloseBtn');
  const certificateBtn = document.getElementById('certificateBtn');
  const certOverlay = document.getElementById('certModalOverlay');
  const certBody = document.getElementById('certBody');
  const certFormSection = document.getElementById('certFormSection');
  const certDisplaySection = document.getElementById('certDisplaySection');
  const certForm = document.getElementById('certForm');
  const certClose = document.getElementById('certClose');
  const certFooter = document.getElementById('certFooter');
  const certPrint = document.getElementById('certPrint');
  const certDownloadPng = document.getElementById('certDownloadPng');
  const certDownloadPdf = document.getElementById('certDownloadPdf');
  const certShare = document.getElementById('certShare');
  const certModalTitle = document.getElementById('certModalTitle');
  const backBtn = document.getElementById('backBtn');

  /* ====== Init ====== */
  function init() {
    if (!skillId || !challengeId) {
      challengeContent.innerHTML = '<div class="empty-state"><div class="icon">&#x26A0;&#xFE0F;</div><h3>Invalid Challenge</h3><p>No challenge specified. Please select a challenge from the skill page.</p><button class="btn btn-primary" onclick="window.location.href=\'index.html\'" style="margin-top:16px;">Go Home</button></div>';
      sidebarContent.innerHTML = '';
      return;
    }

    skill = getSkill(skillId);
    if (!skill || skill.noQuestions) {
      challengeContent.innerHTML = '<div class="empty-state"><div class="icon">&#x26A0;&#xFE0F;</div><h3>Skill Not Available</h3><p>This skill has no questions available.</p><button class="btn btn-primary" onclick="window.location.href=\'index.html\'" style="margin-top:16px;">Go Home</button></div>';
      return;
    }

    const challenges = getChallenges(skillId);
    challenge = challenges.find(function(c) { return c.id === challengeId; });
    if (!challenge) {
      challengeContent.innerHTML = '<div class="empty-state"><div class="icon">&#x26A0;&#xFE0F;</div><h3>Challenge Not Found</h3><p>The requested challenge does not exist.</p><button class="btn btn-primary" onclick="window.location.href=\'skill.html?skill=' + encodeURIComponent(skillId) + '\'" style="margin-top:16px;">Back to Skill</button></div>';
      return;
    }

    /* Generate and shuffle questions */
    questions = generateQuestions(skillId, challengeId);
    if (questions.length < 50) {
      /* Pad with generated questions to ensure 50+ */
      const filler = generateMoreQuestions(skillId, challengeId, 52 - questions.length);
      questions = questions.concat(filler);
    }
    questions = shuffleArray(questions);

    document.title = challenge.name + ' - Batch15 Challenges';
    renderSidebar();
    renderQuestion(0);
    startTimer();
    startInactivityDetection();
    setupAntiCheat();
  }

  /* Generate more questions if needed */
  function generateMoreQuestions(skillId, challengeId, count) {
    const skill = getSkill(skillId);
    const skillChallenges = CHALLENGES[skillId] || [];
    const challenge = skillChallenges.find(function(c) { return c.id === challengeId; });
    if (!challenge) return [];
    const topics = challenge.topics;
    const extra = [];
    for (var i = 0; i < count; i++) {
      var t = topics[i % topics.length];
      if (i % 2 === 0) {
        extra.push({
          type: 'mcq',
          question: 'Regarding ' + t + ' in ' + skill.name + ', which statement is correct?',
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          answer: i % 4
        });
      } else {
        extra.push({
          type: 'truefalse',
          question: t.charAt(0).toUpperCase() + t.slice(1) + ' is an important concept in ' + skill.name + '.',
          options: ['True', 'False'],
          answer: i % 2
        });
      }
    }
    return extra;
  }

  /* ====== Sidebar ====== */
  function renderSidebar() {
    var qCount = questions.length;
    var navHtml = '';
    for (var i = 0; i < qCount; i++) {
      var cls = 'q-nav-btn';
      if (answers[i] !== undefined) cls += ' answered';
      if (i === currentQ) cls += ' current';
      navHtml += '<button class="' + cls + '" data-q="' + i + '">' + (i + 1) + '</button>';
    }

    sidebarContent.innerHTML =
      '<div class="challenge-title">' + escapeHtml(challenge.name) + '</div>' +
      '<div class="challenge-skill">' + escapeHtml(skill.name) + '</div>' +
      '<div class="timer-container">' +
        '<div class="timer-label">Time Remaining</div>' +
        '<div class="timer-display" id="timerDisplay">01:30:00</div>' +
      '</div>' +
      '<div style="font-size:0.85rem;color:var(--text-light);margin-bottom:8px;">Progress: <span id="progressText">0/' + qCount + '</span></div>' +
      '<div class="progress-bar-container">' +
        '<div class="progress-bar-fill" id="progressBarFill"></div>' +
      '</div>' +
      '<div style="font-size:0.8rem;color:var(--text-light);margin-bottom:12px;">Question Navigator</div>' +
      '<div class="question-nav" id="questionNav">' + navHtml + '</div>';

    /* Attach nav click listeners */
    setTimeout(function() {
      var btns = document.querySelectorAll('.q-nav-btn');
      for (var j = 0; j < btns.length; j++) {
        (function(idx) {
          btns[j].addEventListener('click', function() {
            if (!isSubmitted) goToQuestion(parseInt(this.dataset.q));
          });
        })(j);
      }
    }, 0);

    updateProgress();
  }

  /* ====== Render Question ====== */
  function renderQuestion(index) {
    if (isSubmitted || index < 0 || index >= questions.length) return;
    currentQ = index;
    var q = questions[index];
    var answered = answers[index] !== undefined;
    var selectedOpt = answers[index];
    var letters = ['A', 'B', 'C', 'D'];

    var html = '';
    html += '<div class="question-container">';
    html += '<div class="question-number">Question ' + (index + 1) + ' of ' + questions.length + '</div>';
    html += '<span class="question-type ' + (q.type === 'mcq' ? 'mcq' : 'truefalse') + '">' + (q.type === 'mcq' ? 'Multiple Choice' : 'True / False') + '</span>';
    html += '<div class="question-text">' + escapeHtml(q.question) + '</div>';
    html += '<div class="options-list">';

    for (var i = 0; i < q.options.length; i++) {
      var isSelected = (selectedOpt === i);
      html += '<label class="option-item' + (isSelected ? ' selected' : '') + '">';
      html += '<input type="radio" name="q' + index + '" value="' + i + '"' + (isSelected ? ' checked' : '') + '>';
      html += '<span class="option-letter">' + (letters[i] || i) + '</span>';
      html += '<span>' + escapeHtml(q.options[i]) + '</span>';
      html += '</label>';
    }

    html += '</div></div>';

    /* Navigation buttons */
    html += '<div class="challenge-actions">';
    html += '<div class="left">';
    if (index > 0) html += '<button class="btn btn-secondary" id="prevQ">&larr; Previous</button>';
    html += '</div>';
    html += '<div class="right">';
    if (index < questions.length - 1) html += '<button class="btn btn-primary" id="nextQ">Next &rarr;</button>';
    else html += '<button class="btn btn-success" id="submitBtn">&#x2713; Submit Challenge</button>';
    html += '</div>';
    html += '</div>';

    challengeContent.innerHTML = html;

    /* Attach change listeners to radio buttons */
    var radios = document.querySelectorAll('.option-item input[type="radio"]');
    for (var r = 0; r < radios.length; r++) {
      radios[r].addEventListener('change', function() {
        var val = parseInt(this.value);
        var qIdx = currentQ;
        /* Anti-cheat: fast answer detection */
        var now = Date.now();
        var elapsed = now - lastAnswerTime;
        if (elapsed < MIN_ANSWER_INTERVAL) {
          fastAnswerCount++;
          if (fastAnswerCount >= MAX_FAST_ANSWERS) {
            triggerSpeedBlock();
            this.checked = false;
            return;
          }
        } else {
          fastAnswerCount = 0;
        }
        lastAnswerTime = now;
        answers[qIdx] = val;
        updateProgress();
        renderSidebar();
        /* Auto-highlight selected */
        var labels = document.querySelectorAll('.option-item');
        for (var l = 0; l < labels.length; l++) {
          labels[l].classList.remove('selected');
        }
        this.closest('.option-item').classList.add('selected');
        recordActivity();
      });
    }

    /* Attach nav button listeners */
    var prevBtn = document.getElementById('prevQ');
    var nextBtn = document.getElementById('nextQ');
    var submitBtn = document.getElementById('submitBtn');
    if (prevBtn) prevBtn.addEventListener('click', function() { goToQuestion(currentQ - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function() { goToQuestion(currentQ + 1); });
    if (submitBtn) submitBtn.addEventListener('click', confirmSubmit);

    updateProgress();
  }

  function goToQuestion(index) {
    if (isSubmitted) return;
    if (index >= 0 && index < questions.length) {
      renderQuestion(index);
      /* Update nav highlight */
      var btns = document.querySelectorAll('.q-nav-btn');
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('current');
        if (parseInt(btns[i].dataset.q) === index) btns[i].classList.add('current');
      }
    }
  }

  function updateProgress() {
    var answered = 0;
    for (var key in answers) {
      if (answers.hasOwnProperty(key)) answered++;
    }
    var pct = questions.length ? (answered / questions.length) * 100 : 0;
    var fill = document.getElementById('progressBarFill');
    var text = document.getElementById('progressText');
    if (fill) fill.style.width = pct + '%';
    if (text) text.textContent = answered + '/' + questions.length;
  }

  /* ====== Timer ====== */
  function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(function() {
      if (!isPaused && !isSubmitted) {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) {
          clearInterval(timerInterval);
          autoSubmit();
        }
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    var el = document.getElementById('timerDisplay');
    if (!el) return;
    var h = Math.floor(timeRemaining / 3600);
    var m = Math.floor((timeRemaining % 3600) / 60);
    var s = timeRemaining % 60;
    el.textContent = pad(h) + ':' + pad(m) + ':' + pad(s);
    el.className = 'timer-display';
    if (timeRemaining < 300) el.classList.add('danger');
    else if (timeRemaining < 600) el.classList.add('warning');
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ====== Anti-Cheat: Tab Switch Detection ====== */
  function setupAntiCheat() {
    /* Page Visibility API */
    document.addEventListener('visibilitychange', function() {
      if (document.hidden && !isSubmitted) {
        handleTabSwitch();
      }
    });

    /* Window focus/blur */
    window.addEventListener('blur', function() {
      if (!isSubmitted) handleTabSwitch();
    });

    /* Activity monitoring */
    var events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    for (var i = 0; i < events.length; i++) {
      document.addEventListener(events[i], recordActivity);
    }
  }

  function handleTabSwitch() {
    if (isSubmitted) return;
    warningCount++;
    if (warningCount <= MAX_WARNINGS) {
      warningNum.textContent = warningCount;
      warningMax.textContent = MAX_WARNINGS;
      warningTitle.textContent = 'Tab Switching Detected!';
      warningMessage.textContent = 'You have left the challenge page. This is a violation of exam rules. Further violations may result in automatic submission.';
      warningOverlay.style.display = 'flex';
      isPaused = true;
      showToast('Warning ' + warningCount + '/' + MAX_WARNINGS + ': Tab switch detected!', 'error');
    }
    if (warningCount >= MAX_WARNINGS) {
      showToast('Maximum warnings reached. Auto-submitting...', 'error');
      setTimeout(function() { autoSubmit(); }, 1000);
    }
  }

  warningDismiss.addEventListener('click', function() {
    warningOverlay.style.display = 'none';
    isPaused = false;
    recordActivity();
  });

  /* ====== Anti-Cheat: Fast Answer ====== */
  function triggerSpeedBlock() {
    if (isSpeedBlocked) return;
    isSpeedBlocked = true;
    isPaused = true;
    speedBlockOverlay.style.display = 'flex';
    var count = 5;
    speedBlockTimer.textContent = count;
    var interval = setInterval(function() {
      count--;
      speedBlockTimer.textContent = count;
      if (count <= 0) {
        clearInterval(interval);
        speedBlockOverlay.style.display = 'none';
        isSpeedBlocked = false;
        isPaused = false;
        fastAnswerCount = 0;
        showToast('You can continue now. Please answer at a normal pace.', 'info');
      }
    }, 1000);
    showToast('Answering too fast! Blocked for 5 seconds.', 'warning');
  }

  /* ====== Anti-Cheat: Inactivity ====== */
  function startInactivityDetection() {
    lastActivityTime = Date.now();
    inactivityTimer = setInterval(function() {
      if (isSubmitted || isPaused) return;
      var inactive = Math.floor((Date.now() - lastActivityTime) / 1000);
      if (inactive >= INACTIVITY_LIMIT) {
        showToast('You were inactive for too long. Challenge has been reset.', 'error');
        resetChallenge();
      }
    }, 10000);
  }

  function recordActivity() {
    lastActivityTime = Date.now();
  }

  function resetChallenge() {
    isSubmitted = true;
    clearInterval(timerInterval);
    clearInterval(inactivityTimer);
    answers = {};
    currentQ = 0;
    timeRemaining = 90 * 60;
    isSubmitted = false;
    questions = shuffleArray(questions);
    renderSidebar();
    renderQuestion(0);
    updateTimerDisplay();
    startTimer();
    showToast('Challenge has been reset. Starting from question 1.', 'warning');
  }

  /* ====== Submit ====== */
  function confirmSubmit() {
    var answered = 0;
    for (var key in answers) {
      if (answers.hasOwnProperty(key)) answered++;
    }
    var total = questions.length;
    if (answered < total) {
      if (!confirm('You have answered ' + answered + '/' + total + ' questions. Unanswered questions will be marked as wrong. Are you sure you want to submit?')) return;
    } else {
      if (!confirm('Are you sure you want to submit your challenge?')) return;
    }
    submitChallenge();
  }

  function submitChallenge() {
    isSubmitted = true;
    clearInterval(timerInterval);
    clearInterval(inactivityTimer);
    isPaused = true;

    var correct = 0;
    var wrong = 0;
    for (var i = 0; i < questions.length; i++) {
      if (answers[i] === undefined) {
        wrong++;
      } else if (answers[i] === questions[i].answer) {
        correct++;
      } else {
        wrong++;
      }
    }

    var total = questions.length;
    var pct = total ? Math.round((correct / total) * 100) : 0;
    var grade = getGrade(pct);
    var passed = pct >= 50;

    /* Store results */
    var results = {
      skillName: skill.name,
      skillId: skillId,
      challengeName: challenge.name,
      challengeId: challengeId,
      total: total,
      correct: correct,
      wrong: wrong,
      percentage: pct,
      grade: grade,
      passed: passed,
      date: new Date().toISOString(),
      verification: generateVerification()
    };

    showResults(results);
  }

  function autoSubmit() {
    showToast('Time is up! Auto-submitting your challenge.', 'warning');
    submitChallenge();
  }

  function getGrade(pct) {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  }

  function generateVerification() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var v = 'B15-';
    for (var i = 0; i < 10; i++) {
      v += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return v;
  }

  /* ====== Results Display ====== */
  var currentResults = null;

  function showResults(r) {
    currentResults = r;
    resultsBody.innerHTML =
      '<div class="results-grid">' +
        '<div class="result-item correct"><div class="value">' + r.correct + '</div><div class="label">Correct</div></div>' +
        '<div class="result-item wrong"><div class="value">' + r.wrong + '</div><div class="label">Wrong</div></div>' +
        '<div class="result-item percentage"><div class="value">' + r.percentage + '%</div><div class="label">Percentage</div></div>' +
        '<div class="result-item grade"><div class="value">' + r.grade + '</div><div class="label">Grade</div></div>' +
      '</div>' +
      '<div class="result-status ' + (r.passed ? 'pass' : 'fail') + '">' +
        (r.passed ? '&#x2705; PASSED' : '&#x274C; FAILED') +
      '</div>' +
      '<div style="margin-top:16px;font-size:0.8rem;color:var(--text-light);text-align:center;">Total Questions: ' + r.total + ' | Score: ' + r.correct + '/' + r.total + '</div>';

    resultsOverlay.style.display = 'flex';
  }

  resultsClose.addEventListener('click', function() { resultsOverlay.style.display = 'none'; });
  resultsCloseBtn.addEventListener('click', function() { resultsOverlay.style.display = 'none'; });

  certificateBtn.addEventListener('click', function() {
    resultsOverlay.style.display = 'none';
    openCertificateForm();
  });

  /* ====== Certificate ====== */
  function openCertificateForm() {
    certFormSection.style.display = 'block';
    certDisplaySection.style.display = 'none';
    certFooter.style.display = 'none';
    certModalTitle.textContent = 'Generate Your Certificate';
    certForm.reset();
    certOverlay.style.display = 'flex';
  }

  certForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var firstName = document.getElementById('firstName').value.trim();
    var secondName = document.getElementById('secondName').value.trim();
    var thirdName = document.getElementById('thirdName').value.trim();
    if (!firstName || !secondName || !thirdName) {
      showToast('Please fill in all name fields.', 'warning');
      return;
    }
    var fullName = firstName + ' ' + secondName + ' ' + thirdName;

    var picFile = document.getElementById('studentPic').files[0];
    if (picFile) {
      if (picFile.size > 2 * 1024 * 1024) {
        showToast('Image must be less than 2MB.', 'warning');
        return;
      }
      var reader = new FileReader();
      reader.onload = function(event) {
        generateCertificate(fullName, event.target.result);
      };
      reader.readAsDataURL(picFile);
    } else {
      generateCertificate(fullName, null);
    }
  });

  function generateCertificate(fullName, picDataUrl) {
    certFormSection.style.display = 'none';
    certDisplaySection.style.display = 'block';
    certFooter.style.display = 'flex';
    certModalTitle.textContent = 'Certificate of Completion';

    var r = currentResults;
    var dateStr = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

    certDisplaySection.innerHTML =
      '<div class="certificate-container" id="certificateDisplay">' +
        '<div class="certificate-badge">&#x1F3C6;</div>' +
        '<div class="certificate-title">BATCH15 CHALLENGES</div>' +
        '<div class="certificate-subtitle">Certificate of Completion</div>' +
        (picDataUrl ? '<img src="' + picDataUrl + '" class="certificate-student-img" alt="Student">' : '<div class="certificate-student-img" style="background:var(--border);display:flex;align-items:center;justify-content:center;font-size:2rem;">&#x1F464;</div>') +
        '<div class="certificate-student-name">' + escapeHtml(fullName) + '</div>' +
        '<div class="certificate-detail">has successfully completed the challenge</div>' +
        '<div class="certificate-detail" style="font-size:1.1rem;font-weight:600;color:var(--primary);margin:8px 0;">' + escapeHtml(r.challengeName) + '</div>' +
        '<div class="certificate-detail">in <strong>' + escapeHtml(r.skillName) + '</strong></div>' +
        '<div style="margin:16px 0;display:flex;justify-content:center;gap:24px;flex-wrap:wrap;">' +
          '<div class="certificate-detail"><strong>Score:</strong> ' + r.correct + '/' + r.total + '</div>' +
          '<div class="certificate-detail"><strong>Percentage:</strong> ' + r.percentage + '%</div>' +
          '<div class="certificate-detail"><strong>Grade:</strong> ' + r.grade + '</div>' +
        '</div>' +
        '<div class="certificate-detail"><strong>Date:</strong> ' + dateStr + '</div>' +
        '<div class="certificate-verification">' +
          'Verification Number: <code>' + r.verification + '</code><br>' +
          'Batch15 Challenges &mdash; IT &amp; Computer Science Skills Platform' +
        '</div>' +
      '</div>';

    /* Now generate canvas for export */
    setTimeout(function() {
      renderCertificateCanvas(fullName, picDataUrl, r);
    }, 100);
  }

  var certCanvas = null;

  function renderCertificateCanvas(fullName, picDataUrl, r) {
    var canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 560;
    var ctx = canvas.getContext('2d');

    /* Background */
    var grad = ctx.createLinearGradient(0, 0, 0, 560);
    grad.addColorStop(0, '#f8fafc');
    grad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 560);

    /* Border */
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 4;
    ctx.strokeRect(15, 15, 770, 530);

    /* Inner border */
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.strokeRect(25, 25, 750, 510);

    /* Title */
    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('BATCH15 CHALLENGES', 400, 80);

    ctx.fillStyle = '#64748b';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('Certificate of Completion', 400, 110);

    /* Student image */
    if (picDataUrl) {
      var img = new Image();
      img.onload = function() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(400, 175, 40, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 360, 135, 80, 80);
        ctx.restore();
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(400, 175, 40, 0, Math.PI * 2);
        ctx.stroke();
        drawTextOverImage(ctx, fullName, r);
      };
      img.src = picDataUrl;
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.arc(400, 175, 40, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#64748b';
      ctx.font = '32px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('\u{1F464}', 400, 195);
      drawTextOverImage(ctx, fullName, r);
    }
  }

  function drawTextOverImage(ctx, fullName, r) {
    var dateStr = new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' });

    /* Student name */
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(fullName, 400, 245);

    /* Text */
    ctx.fillStyle = '#64748b';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('has successfully completed the challenge', 400, 275);

    /* Challenge name */
    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 20px Arial, sans-serif';
    ctx.fillText(r.challengeName, 400, 310);

    /* Skill */
    ctx.fillStyle = '#1e293b';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText('in ' + r.skillName, 400, 340);

    /* Stats */
    ctx.fillStyle = '#1e293b';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText('Score: ' + r.correct + '/' + r.total + '    Percentage: ' + r.percentage + '%    Grade: ' + r.grade, 400, 380);

    /* Date */
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Arial, sans-serif';
    ctx.fillText('Date: ' + dateStr, 400, 415);

    /* Verification */
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px Arial, sans-serif';
    ctx.fillText('Verification: ' + r.verification, 400, 445);
    ctx.fillText('Batch15 Challenges - IT & Computer Science Skills Platform', 400, 465);

    certCanvas = canvas;
  }

  /* ====== Certificate Export ====== */
  certDownloadPng.addEventListener('click', function() {
    if (!certCanvas) {
      showToast('Certificate is still rendering. Please wait...', 'info');
      return;
    }
    var link = document.createElement('a');
    link.download = 'Batch15_Certificate.png';
    link.href = certCanvas.toDataURL('image/png');
    link.click();
    showToast('Certificate downloaded as PNG.', 'success');
  });

  certDownloadPdf.addEventListener('click', function() {
    if (!certCanvas) {
      showToast('Certificate is still rendering. Please wait...', 'info');
      return;
    }
    /* Generate a simple PDF-like page and trigger print with PDF option */
    var win = window.open('', '_blank');
    win.document.write('<html><head><title>Certificate - Batch15 Challenges</title>');
    win.document.write('<style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;flex-direction:column;}img{max-width:100%;margin-bottom:20px;}@media print{body{margin:0;}}h2{font-family:sans-serif;color:#64748b;font-size:14px;}</style>');
    win.document.write('</head><body>');
    win.document.write('<img src="' + certCanvas.toDataURL('image/png') + '" style="max-width:95%;">');
    win.document.write('<h2>Batch15 Challenges - Certificate of Completion</h2>');
    win.document.write('<script>window.onload=function(){setTimeout(function(){window.print();window.close();},500)};<\/script>');
    win.document.write('</body></html>');
    win.document.close();
    showToast('PDF dialog opened. Choose "Save as PDF" in the print dialog.', 'info');
  });

  certPrint.addEventListener('click', function() {
    if (!certCanvas) {
      showToast('Certificate is still rendering. Please wait...', 'info');
      return;
    }
    var win = window.open('', '_blank');
    win.document.write('<html><head><title>Certificate - Batch15 Challenges</title>');
    win.document.write('<style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;}img{max-width:100%;}</style>');
    win.document.write('</head><body>');
    win.document.write('<img src="' + certCanvas.toDataURL('image/png') + '" onload="window.print();window.close();">');
    win.document.write('</body></html>');
    win.document.close();
  });

  certShare.addEventListener('click', function() {
    if (!certCanvas) {
      showToast('Certificate is still rendering. Please wait...', 'info');
      return;
    }
    if (navigator.share) {
      certCanvas.toBlob(function(blob) {
        var file = new File([blob], 'Batch15_Certificate.png', { type: 'image/png' });
        navigator.share({
          title: 'Batch15 Challenges Certificate',
          text: 'I earned a certificate in ' + currentResults.challengeName + '!',
          files: [file]
        }).catch(function(err) {
          showToast('Share cancelled or failed.', 'info');
        });
      });
    } else {
      /* Fallback: copy download link */
      var link = document.createElement('a');
      link.download = 'Batch15_Certificate.png';
      link.href = certCanvas.toDataURL('image/png');
      link.click();
      showToast('Sharing not supported. Certificate downloaded instead.', 'info');
    }
  });

  certClose.addEventListener('click', function() { certOverlay.style.display = 'none'; });

  /* ====== Back Button ====== */
  backBtn.addEventListener('click', function(e) {
    if (!isSubmitted && Object.keys(answers).length > 0) {
      if (!confirm('Are you sure you want to exit? Your progress will be lost.')) {
        e.preventDefault();
        return;
      }
    }
    window.location.href = 'skill.html?skill=' + encodeURIComponent(skillId);
  });

  /* ====== Toast Notifications ====== */
  function showToast(message, type) {
    type = type || 'info';
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
  }

  /* ====== Helpers ====== */
  function escapeHtml(str) {
    if (!str) return '';
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /* ====== Global event listeners for modals ====== */
  window.addEventListener('click', function(e) {
    if (e.target === resultsOverlay) resultsOverlay.style.display = 'none';
    if (e.target === certOverlay) certOverlay.style.display = 'none';
  });

  /* Keyboard shortcuts */
  document.addEventListener('keydown', function(e) {
    if (isSubmitted) return;
    if (e.key === 'ArrowLeft') { goToQuestion(currentQ - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { goToQuestion(currentQ + 1); e.preventDefault(); }
  });

  /* ====== Boot ====== */
  init();

})();

/* ============================================
   Batch15 Challenges - Homepage Logic
   ============================================ */

try {
  var grid = document.getElementById('skillsGrid');
  if (!grid) {
    alert('Batch15 Error: #skillsGrid not found!');
    return;
  }

  /* Check data loaded */
  if (typeof SKILLS === 'undefined' || !SKILLS || SKILLS.length === 0) {
    grid.innerHTML = '<div class="empty-state"><div class="icon">&#x26A0;&#xFE0F;</div><h3>Data not loaded</h3><p>SKILLS data is not available. Check browser console (F12) for errors.</p></div>';
    return;
  }

  /* Count stats */
  var skillCount = SKILLS.length;
  var challengeCount = 0;
  try {
    Object.keys(CHALLENGES || {}).forEach(function(sid) {
      challengeCount += (CHALLENGES[sid] || []).length;
    });
  } catch(e) {
    console.warn('Batch15: Error counting challenges:', e);
  }

  document.getElementById('statSkills').textContent = skillCount + '+';
  document.getElementById('statChallenges').textContent = challengeCount + '+';
  document.getElementById('statQuestions').textContent = (challengeCount * 52) + '+';

  /* Render skill cards */
  SKILLS.forEach(function(skill) {
    var card = document.createElement('div');
    card.className = 'skill-card' + (skill.noQuestions ? ' skill-card-locked' : '');
    card.innerHTML = '<div class="skill-card-icon">' + skill.icon + '</div><div class="skill-card-name">' + skill.name + '</div>';
    card.addEventListener('click', function() {
      if (skill.noQuestions) {
        showToast('This skill is under development. No questions available yet.', 'info');
        return;
      }
      window.location.href = 'skill.html?skill=' + encodeURIComponent(skill.id);
    });
    grid.appendChild(card);
  });

  console.log('Batch15: Rendered ' + SKILLS.length + ' skills');

  /* Search/filter functionality */
  var searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search skills...';
  searchInput.style.cssText = 'width:100%;max-width:400px;padding:10px 16px;border:1px solid #e2e8f0;border-radius:8px;font-size:0.9rem;margin:0 auto 20px;display:block;outline:none;box-sizing:border-box;';
  searchInput.addEventListener('focus', function() { this.style.borderColor = '#2563eb'; });
  searchInput.addEventListener('blur', function() { this.style.borderColor = '#e2e8f0'; });

  var sectionHeader = document.querySelector('.section-header');
  if (sectionHeader) {
    sectionHeader.after(searchInput);
  }

  searchInput.addEventListener('input', function() {
    var query = this.value.toLowerCase().trim();
    var cards = grid.querySelectorAll('.skill-card');
    for (var i = 0; i < cards.length; i++) {
      var name = cards[i].querySelector('.skill-card-name').textContent.toLowerCase();
      cards[i].style.display = name.indexOf(query) !== -1 ? '' : 'none';
    }
  });

  /* Toast */
  function showToast(message, type) {
    type = type || 'info';
    var container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = 'position:fixed;top:80px;right:24px;z-index:1000;display:flex;flex-direction:column;gap:8px;';
      document.body.appendChild(container);
    }
    var toast = document.createElement('div');
    toast.style.cssText = 'padding:14px 20px;border-radius:8px;color:white;font-size:0.9rem;font-weight:500;box-shadow:0 4px 12px rgba(0,0,0,0.1);max-width:380px;animation:slideInRight 0.3s ease;';
    var colors = { warning:'#f59e0b', error:'#ef4444', success:'#10b981', info:'#2563eb' };
    toast.style.background = colors[type] || colors.info;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function() {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
  }

} catch(e) {
  console.error('Batch15 Error:', e);
  var el = document.getElementById('skillsGrid');
  if (el) {
    el.innerHTML = '<div class="empty-state"><div class="icon">&#x26A0;&#xFE0F;</div><h3>Something went wrong</h3><p>Error: ' + e.message + '</p></div>';
  }
}

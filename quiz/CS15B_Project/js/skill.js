/* ============================================
   Batch15 Challenges - Skill Detail Page Logic
   ============================================ */

(function() {
  const params = new URLSearchParams(window.location.search);
  const skillId = params.get('skill');
  const container = document.getElementById('skillContent');

  if (!skillId) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">&#x1F50D;</div>
        <h3>No Skill Selected</h3>
        <p>Please select a skill from the homepage.</p>
        <button class="btn btn-primary" onclick="window.location.href='index.html'" style="margin-top:16px;">Go to Homepage</button>
      </div>
    `;
    return;
  }

  const skill = getSkill(skillId);
  if (!skill) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">&#x26A0;&#xFE0F;</div>
        <h3>Skill Not Found</h3>
        <p>The skill you are looking for does not exist.</p>
        <button class="btn btn-primary" onclick="window.location.href='index.html'" style="margin-top:16px;">Go to Homepage</button>
      </div>
    `;
    return;
  }

  const challenges = getChallenges(skillId);

  if (skill.noQuestions) {
    container.innerHTML = `
      <div class="challenges-header">
        <span class="skill-badge">${skill.icon} ${skill.name}</span>
        <h2 style="margin-left:auto;">Challenges</h2>
      </div>
      <div class="empty-state">
        <div class="icon">&#x1F6E1;&#xFE0F;</div>
        <h3>Coming Soon</h3>
        <p>This skill is currently under development. Check back later for challenges and questions.</p>
        <button class="btn btn-primary" onclick="window.location.href='index.html'" style="margin-top:16px;">Browse Other Skills</button>
      </div>
    `;
    return;
  }

  if (!challenges.length) {
    container.innerHTML = `
      <div class="challenges-header">
        <span class="skill-badge">${skill.icon} ${skill.name}</span>
        <h2 style="margin-left:auto;">Challenges</h2>
      </div>
      <div class="empty-state">
        <div class="icon">&#x1F4DA;</div>
        <h3>No Challenges Yet</h3>
        <p>No challenges have been created for this skill yet.</p>
        <button class="btn btn-primary" onclick="window.location.href='index.html'" style="margin-top:16px;">Browse Other Skills</button>
      </div>
    `;
    return;
  }

  /* Render skill info and challenges grid */
  container.innerHTML = `
    <div class="challenges-header">
      <span class="skill-badge">${skill.icon} ${skill.name}</span>
      <h2 style="margin-left:auto;">${challenges.length} Challenges</h2>
    </div>
    <p style="margin-bottom:24px;color:var(--text-light);">${skill.description}</p>
    <div class="challenges-grid" id="challengesGrid"></div>
  `;

  const grid = document.getElementById('challengesGrid');

  challenges.forEach(function(ch, idx) {
    const card = document.createElement('div');
    card.className = 'challenge-card';
    card.innerHTML = `
      <h3>${ch.name}</h3>
      <p>Test your knowledge in ${skill.name} with this comprehensive challenge.</p>
      <div class="meta">
        <span>&#x1F4DD; 50+ Questions</span>
        <span>&#x23F1; 1h 30m</span>
        <span>&#x1F3AF; ${ch.topics.slice(0,2).join(', ')}</span>
      </div>
    `;
    card.addEventListener('click', function() {
      window.location.href = 'challenge.html?skill=' + encodeURIComponent(skillId) + '&challenge=' + encodeURIComponent(ch.id);
    });
    grid.appendChild(card);
  });

  /* Update page title */
  document.title = skill.name + ' Challenges - Batch15 Challenges';

})();

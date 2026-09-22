/* ============================================
   CS15 Hub - Authentication Page Templates
   ============================================ */

const AuthPages = {
  login() {
    return `
      <div class="auth-page">
        <div class="auth-card animate-scaleIn">
          <div class="auth-logo">
            <div class="auth-logo-icon" style="background:none;box-shadow:none"><img src="logo.png" alt="CS15 Hub — Batch 15 logo" style="width:100%;height:100%;object-fit:contain"></div>
            <div><div class="fw-bold fs-5">CS15 Hub</div><div class="text-xs text-tertiary">Jazeera University</div></div>
          </div>
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Sign in to access your academic portal</p>
          <form id="loginForm" onsubmit="handleLogin(event)">
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" class="form-input" id="loginUsername" placeholder="Enter your username" required>
            </div>
            <div class="form-group">
              <div class="d-flex align-items-center justify-content-between">
                <label class="form-label">Password</label>
                <a href="#/forgot-password" class="text-xs text-accent" onclick="router.navigate('/forgot-password')">Forgot password?</a>
              </div>
              <input type="password" class="form-input" id="loginPassword" placeholder="Enter your password" required>
            </div>
            <div class="form-check mb-4">
              <input type="checkbox" id="rememberMe" checked>
              <label for="rememberMe" class="text-sm text-secondary">Remember me</label>
            </div>
            <button type="submit" class="btn btn-primary btn-lg w-100" id="loginBtn"><i class="bi bi-box-arrow-in-right"></i> Sign In</button>
          </form>
          <div class="auth-divider">or continue with</div>
          <button class="social-btn w-100" onclick="window.location.href=(window.BASE_URL||'')+'/api/auth/google'"><i class="bi bi-google"></i> Google</button>
          <div class="auth-footer">Don't have an account? <a href="#/register" onclick="router.navigate('/register')">Create Account</a></div>
        </div>
      </div>
    `;
  },

  register() {
    return `
      <div class="auth-page">
        <div class="auth-card animate-scaleIn">
          <div class="auth-logo">
            <div class="auth-logo-icon" style="background:none;box-shadow:none"><img src="logo.png" alt="CS15 Hub — Batch 15 logo" style="width:100%;height:100%;object-fit:contain"></div>
            <div><div class="fw-bold fs-5">CS15 Hub</div><div class="text-xs text-tertiary">Jazeera University</div></div>
          </div>
          <h2 class="auth-title">Create Account</h2>
          <p class="auth-subtitle">Join CS Batch 15 academic portal</p>
          <form id="registerForm" onsubmit="handleRegister(event)">
            <div class="form-group"><label class="form-label">Username</label><input type="text" class="form-input" id="regUsername" placeholder="Choose a username" required></div>
            <div class="grid-2">
              <div class="form-group"><label class="form-label">First Name</label><input class="form-input" id="regFirstName" placeholder="Ahmed" required></div>
              <div class="form-group"><label class="form-label">Last Name</label><input class="form-input" id="regLastName" placeholder="Hassan" required></div>
            </div>
            <div class="form-group"><label class="form-label">Email <span class="text-tertiary">(optional)</span></label><input type="email" class="form-input" id="regEmail" placeholder="your@jazeera.edu"></div>
            <div class="form-group">
              <label class="form-label" for="regStudentToggle"><input type="checkbox" class="form-check-input me-2" id="regStudentToggle" onchange="toggleStudentField()"> I am a CS Batch 15 student</label>
              <div class="text-xs text-tertiary mt-1">If you are a student, check the box and fill in your roll number below — an admin will verify it against the class roster.</div>
            </div>
            <div class="form-group" id="studentIdGroup" style="display:none">
              <label class="form-label">Roll Number (Student ID)</label>
              <input class="form-input" id="regStudentId" placeholder="e.g. CS2025XXXX">
            </div>
            <div class="grid-2">
              <div class="form-group"><label class="form-label">Password</label><input type="password" class="form-input" id="regPassword" placeholder="Min. 8 characters" required minlength="8"></div>
              <div class="form-group"><label class="form-label">Confirm Password</label><input type="password" class="form-input" id="regConfirm" placeholder="Confirm password" required></div>
            </div>
            <div class="form-check mb-4">
              <input type="checkbox" id="agreeTerms" required>
               <label for="agreeTerms" class="text-sm text-secondary">I agree to the <a href="#/terms" onclick="router.navigate('/terms')" class="text-accent">Terms of Service</a> and <a href="#/privacy" onclick="router.navigate('/privacy')" class="text-accent">Privacy Policy</a></label>
            </div>
            <button type="submit" class="btn btn-primary btn-lg w-100" id="registerBtn"><i class="bi bi-person-plus"></i> Create Account</button>
          </form>
          <div class="auth-divider">or continue with</div>
          <button class="social-btn w-100" onclick="window.location.href=(window.BASE_URL||'')+'/api/auth/google'"><i class="bi bi-google"></i> Google</button>
          <div class="auth-footer">Already have an account? <a href="#/login" onclick="router.navigate('/login')">Sign In</a></div>
        </div>
      </div>
    `;
  },

  forgotPassword() {
    return `
      <div class="auth-page">
        <div class="auth-card animate-scaleIn" style="max-width:420px">
          <div class="auth-logo">
            <div class="auth-logo-icon" style="background:none;box-shadow:none"><img src="logo.png" alt="CS15 Hub — Batch 15 logo" style="width:100%;height:100%;object-fit:contain"></div>
            <div><div class="fw-bold fs-5">CS15 Hub</div><div class="text-xs text-tertiary">Jazeera University</div></div>
          </div>
          <h2 class="auth-title">Reset Password</h2>
          <p class="auth-subtitle">Enter your email and we'll send you a reset link</p>
          <form id="forgotForm" onsubmit="handleForgotPassword(event)">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-input" id="forgotEmail" placeholder="your@jazeera.edu" required>
            </div>
            <button type="submit" class="btn btn-primary btn-lg w-100" id="forgotBtn"><i class="bi bi-envelope"></i> Send Reset Link</button>
          </form>
          <div class="auth-footer mt-4"><a href="#/login" onclick="router.navigate('/login')"><i class="bi bi-arrow-left"></i> Back to Sign In</a></div>
        </div>
      </div>
    `;
  },

  terms() {
    return `
      <div class="auth-page">
        <div class="auth-card animate-scaleIn" style="max-width:720px">
          <div class="auth-logo mb-3">
            <div class="auth-logo-icon" style="background:none;box-shadow:none"><img src="logo.png" alt="CS15 Hub — Batch 15 logo" style="width:100%;height:100%;object-fit:contain"></div>
            <div><div class="fw-bold fs-5">CS15 Hub</div><div class="text-xs text-tertiary">Jazeera University</div></div>
          </div>
          <h2 class="auth-title">Terms of Service</h2>
          <p class="auth-subtitle text-secondary" style="text-align:left;max-height:60vh;overflow-y:auto;line-height:1.7">
            <strong>1. Acceptance of Terms</strong><br>
            By accessing and using CS15 Hub ("the Portal"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Portal.<br><br>

            <strong>2. User Accounts</strong><br>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must notify us immediately of any unauthorized use.<br><br>

            <strong>3. Acceptable Use</strong><br>
            You agree not to misuse the Portal for any unlawful purpose, to impersonate others, to distribute malware, or to disrupt the Portal's operations. Academic integrity is expected of all users.<br><br>

            <strong>4. Content</strong><br>
            Users retain ownership of content they submit. By submitting content, you grant CS15 Hub a non-exclusive license to display and distribute it within the Portal. We reserve the right to remove content that violates these terms.<br><br>

            <strong>5. Privacy</strong><br>
            Your use of the Portal is governed by our Privacy Policy, which explains how we collect, use, and protect your personal data.<br><br>

            <strong>6. Termination</strong><br>
            We reserve the right to suspend or terminate accounts for violations of these terms, at our sole discretion.<br><br>

            <strong>7. Disclaimer</strong><br>
            The Portal is provided "as is" without warranties of any kind, express or implied. We are not liable for any damages arising from your use of the Portal.<br><br>

            <strong>8. Changes</strong><br>
            We may update these terms at any time. Continued use after changes constitutes acceptance of the new terms.<br><br>

            <em>Last updated: July 2026</em>
          </p>
          <div class="auth-footer mt-3"><a href="#/register" onclick="router.navigate('/register')"><i class="bi bi-arrow-left"></i> Back to Registration</a></div>
        </div>
      </div>
    `;
  },

  privacy() {
    return `
      <div class="auth-page">
        <div class="auth-card animate-scaleIn" style="max-width:720px">
          <div class="auth-logo mb-3">
            <div class="auth-logo-icon" style="background:none;box-shadow:none"><img src="logo.png" alt="CS15 Hub — Batch 15 logo" style="width:100%;height:100%;object-fit:contain"></div>
            <div><div class="fw-bold fs-5">CS15 Hub</div><div class="text-xs text-tertiary">Jazeera University</div></div>
          </div>
          <h2 class="auth-title">Privacy Policy</h2>
          <p class="auth-subtitle text-secondary" style="text-align:left;max-height:60vh;overflow-y:auto;line-height:1.7">
            <strong>1. Information We Collect</strong><br>
            We collect personal information you provide, such as your name, email address, and student ID. We also collect usage data including IP addresses, browser type, and pages visited.<br><br>

            <strong>2. How We Use Your Information</strong><br>
            We use your information to operate and improve the Portal, communicate with you, enforce academic integrity, and comply with legal obligations.<br><br>

            <strong>3. Data Sharing</strong><br>
            We do not sell your personal information. We may share data with authorized university staff for academic purposes, or when required by law.<br><br>

            <strong>4. Data Security</strong><br>
            We implement reasonable security measures including encryption (HTTPS), secure token-based authentication, and regular backups. No system is completely secure, and we cannot guarantee absolute security.<br><br>

            <strong>5. Your Rights</strong><br>
            You may request access to, correction of, or deletion of your personal data. Contact the portal administrator to exercise these rights.<br><br>

            <strong>6. Cookies</strong><br>
            We use local storage for authentication tokens. We do not use third-party tracking cookies.<br><br>

            <strong>7. Google Sign-In</strong><br>
            If you choose to sign in with Google, we receive your name, email address, and profile picture from Google. This data is used only for account creation and authentication.<br><br>

            <strong>8. Changes</strong><br>
            We may update this policy at any time. Material changes will be notified to users.<br><br>

            <em>Last updated: July 2026</em>
          </p>
          <div class="auth-footer mt-3"><a href="#/register" onclick="router.navigate('/register')"><i class="bi bi-arrow-left"></i> Back to Registration</a></div>
        </div>
      </div>
    `;
  },

  claim() {
    return `
      <div class="auth-page">
        <div class="auth-card animate-scaleIn">
          <div class="auth-logo">
            <div class="auth-logo-icon" style="background:none;box-shadow:none"><img src="logo.png" alt="CS15 Hub — Batch 15 logo" style="width:100%;height:100%;object-fit:contain"></div>
            <div><div class="fw-bold fs-5">CS15 Hub</div><div class="text-xs text-tertiary">Jazeera University</div></div>
          </div>
          <h2 class="auth-title">Almost done, ${esc(DB.currentUser ? (DB.currentUser.name || DB.currentUser.username || '') : '')}</h2>
          <p class="auth-subtitle">Tell us a little more about yourself</p>
          <form id="claimForm" onsubmit="handleGoogleClaim(event)">
            <div class="form-group">
              <label class="form-label" for="claimStudentToggle"><input type="checkbox" class="form-check-input me-2" id="claimStudentToggle" onchange="toggleClaimStudentField()"> I am a CS Batch 15 student</label>
              <div class="text-xs text-tertiary mt-1">If you are a student, check the box and fill in your roll number — an admin will verify it against the class roster.</div>
            </div>
            <div class="form-group" id="claimStudentIdGroup" style="display:none">
              <label class="form-label">Roll Number (Student ID)</label>
              <input class="form-input" id="claimStudentId" placeholder="e.g. CS2025XXXX">
            </div>
            <button type="submit" class="btn btn-primary btn-lg w-100" id="claimBtn"><i class="bi bi-arrow-right"></i> Continue</button>
          </form>
          <div class="auth-footer">Just exploring? <a href="#/dashboard" onclick="router.navigate('/dashboard')">Skip for now</a></div>
        </div>
      </div>
    `;
  },
};

// ----- Auth Handlers -----
function toggleClaimStudentField() {
  const checked = document.getElementById('claimStudentToggle').checked;
  const group = document.getElementById('claimStudentIdGroup');
  const input = document.getElementById('claimStudentId');
  if (group) group.style.display = checked ? 'block' : 'none';
  if (input) input.required = checked;
}

async function handleGoogleClaim(e) {
  e.preventDefault();
  const isStudent = document.getElementById('claimStudentToggle').checked;
  const studentId = isStudent ? document.getElementById('claimStudentId').value.trim() : '';
  if (isStudent && !studentId) { UI.showToast('Error', 'Please enter your roll number.', 'error'); return; }
  const btn = document.getElementById('claimBtn');
  btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Continuing...';
  try {
    if (isStudent) await API.claimStudent(studentId);
    UI.showToast('Welcome!', isStudent ? 'Your student claim is pending admin review.' : 'Account set up.', 'success');
    router.navigate('/dashboard');
  } catch (err) {
    UI.showToast('Failed', err.message, 'error');
    btn.disabled = false; btn.innerHTML = '<i class="bi bi-arrow-right"></i> Continue';
  }
}

function toggleStudentField() {
  const checked = document.getElementById('regStudentToggle').checked;
  const group = document.getElementById('studentIdGroup');
  const input = document.getElementById('regStudentId');
  if (group) group.style.display = checked ? 'block' : 'none';
  if (input) input.required = checked;
}

async function handleLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  if (!username || !password) { UI.showToast('Error', 'Please fill in all fields.', 'error'); return; }
  btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Signing in...';
  try {
    const user = await API.login(username, password);
    UI.showToast('Welcome back!', `Signed in as ${user.name}`, 'success');
    if (typeof refreshBottomNav === 'function') refreshBottomNav();
    router.navigate('/dashboard');
  } catch (err) {
    UI.showToast('Login Failed', err.message, 'error');
    btn.disabled = false; btn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Sign In';
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const btn = document.getElementById('registerBtn');
  const username = document.getElementById('regUsername').value;
  const firstName = document.getElementById('regFirstName').value;
  const lastName = document.getElementById('regLastName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirm').value;
  const isStudent = document.getElementById('regStudentToggle').checked;
  const studentId = isStudent ? document.getElementById('regStudentId').value.trim() : '';
  if (!username) { UI.showToast('Error', 'Username is required.', 'error'); return; }
  if (isStudent && !studentId) { UI.showToast('Error', 'Please enter your roll number.', 'error'); return; }
  if (password !== confirm) { UI.showToast('Error', 'Passwords do not match.', 'error'); return; }
  btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Creating account...';
  try {
    const result = await API.register({ username, name: `${firstName} ${lastName}`, email: email || undefined, password, is_student: isStudent, student_id: studentId });
    if (isStudent) {
      UI.showToast('Account created', 'Your student claim is pending admin review — signing you in.', 'success');
    } else {
      UI.showToast('Account created', result.message || 'Welcome!', 'success');
    }
    await API.login(username, password);
    if (typeof refreshBottomNav === 'function') refreshBottomNav();
    router.navigate('/dashboard');
  } catch (err) {
    UI.showToast('Registration Failed', err.message, 'error');
    btn.disabled = false; btn.innerHTML = '<i class="bi bi-person-plus"></i> Create Account';
  }
}

async function handleForgotPassword(e) {
  e.preventDefault();
  const btn = document.getElementById('forgotBtn');
  const email = document.getElementById('forgotEmail').value;
  btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Sending...';
  try {
    const res = await API.resetPassword(email);
    UI.showToast('Email Sent', res.message, 'success');
    btn.innerHTML = '<i class="bi bi-check-lg"></i> Link Sent';
  } catch (err) {
    UI.showToast('Error', err.message, 'error');
    btn.disabled = false; btn.innerHTML = '<i class="bi bi-envelope"></i> Send Reset Link';
  }
}

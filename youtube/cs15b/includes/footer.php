        </main>
    </div>

    <!-- Language Selection Popup -->
    <div class="lang-popup-overlay" id="langPopupOverlay">
        <div class="lang-popup">
            <div class="lang-popup-icon">
                <i class="fas fa-language"></i>
            </div>
            <h2>Choose Language</h2>
            <p>Select your preferred language for this lesson</p>
            <div class="lang-choices">
                <button class="lang-choice" data-lang="so">
                    <span class="lang-flag">🇸🇴</span>
                    <span class="lang-name">Somali</span>
                </button>
                <button class="lang-choice" data-lang="en">
                    <span class="lang-flag">🇬🇧</span>
                    <span class="lang-name">English</span>
                </button>
                <button class="lang-choice" data-lang="ar">
                    <span class="lang-flag">🇸🇦</span>
                    <span class="lang-name">Arabic</span>
                </button>
            </div>
        </div>
    </div>

    <!-- Guest Restriction Popup -->
    <div class="restriction-overlay" id="restrictionOverlay">
        <div class="restriction-popup">
            <div class="restriction-icon">
                <i class="fas fa-lock"></i>
            </div>
            <h2>Create Free Account to Continue Learning</h2>
            <p>You have reached your free viewing limit.</p>
            <p>Register now to unlock unlimited lessons.</p>
            <a href="<?= SITE_URL ?>/auth/register.php" class="btn btn-primary btn-lg">Register Now</a>
            <a href="<?= SITE_URL ?>/auth/login.php" class="btn btn-outline">Already have an account? Login</a>
        </div>
    </div>

    <script src="<?= SITE_URL ?>/assets/js/main.js"></script>
    <?php if (isset($pageScript)): ?>
    <script src="<?= SITE_URL ?>/assets/js/<?= $pageScript ?>"></script>
    <?php endif; ?>
</body>
</html>

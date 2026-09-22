<?php
namespace App\Controllers;

use App\Helpers\Response;
use App\Helpers\Validator;
use App\Helpers\Security;
use App\Helpers\AuthToken;
use App\Middleware\AuthMiddleware;
use App\Middleware\RateLimitMiddleware;
use App\Models\User;
use App\Models\LoginAttempt;
use App\Models\ActivityLog;
use App\Models\StudentClaim;

use App\Helpers\GoogleOAuth;
use App\Config\Database;

class AuthController
{
    public static function register(): never
    {
        AuthToken::cleanupExpired();
        GoogleOAuth::cleanupStates();

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('username')->min('username', 3)->max('username', 60);
        $v->required('password')->min('password', 8)->max('password', 128);

        if (!$v->passes()) {
            Response::validationError('Registration failed.', $v->errors());
        }

        $isStudent = !empty($data['is_student']);
        $studentId = $isStudent ? trim((string) ($data['student_id'] ?? '')) : '';
        if ($isStudent && preg_match('/^[A-Za-z0-9_.-]{3,64}$/', $studentId) !== 1) {
            Response::validationError('Student ID must be 3–64 characters using letters, numbers, dots, dashes or underscores.');
        }

        $username = trim((string) $data['username']);
        if (User::findByUsername($username)) {
            Response::validationError('Registration failed. Please choose different details and try again.');
        }

        $email = $data['email'] ?? $username . '@cs15hub.local';
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Response::validationError('Registration failed.', ['email' => ['Please provide a valid email address.']]);
        }
        if (User::findByEmail($email)) {
            $email = $username . '_' . bin2hex(random_bytes(3)) . '@cs15hub.local';
        }

        $user = User::create([
            'username'  => $username,
            'email'     => $email,
            'password'  => $data['password'],
            'full_name' => $data['full_name'] ?? null,
        ]);

        ActivityLog::log('user.register', $user->id, 'user', $user->id);

        $message = 'Registration successful. Please sign in.';
        $claim = null;
        if ($isStudent) {
            $conflict = StudentClaim::findPendingByStudentId($studentId, $user->id);
            if ($conflict) {
                $message = 'Account created, but this student ID was already claimed by another account. You can submit a different Student ID from your dashboard after signing in.';
            } else {
                $claim = StudentClaim::create($user->id, $studentId);
                StudentClaim::notifyReviewers($user, $studentId, $claim->id);
                $message = 'Registration successful. Your student claim is pending admin review — you can sign in now.';
            }
        }

        Response::success(
            ['user' => $user->toArray(), 'claim' => $claim?->toArray()],
            $message,
            201
        );
    }

    public static function login(): never
    {
        RateLimitMiddleware::perIp(10, 60);
        AuthToken::cleanupExpired();

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $v = Validator::make($data);
        $v->required('username');
        $v->required('password');

        if (!$v->passes()) {
            Response::validationError('Login failed.', $v->errors());
        }

        $username = trim($data['username']);
        $password = $data['password'];
        $ip       = Security::getClientIp();

        $user = User::findByUsername($username);
        if (!$user) {
            LoginAttempt::record(null, $username, $ip, false, 'user_not_found');
            Response::unauthorized('Invalid username or password.');
        }

        if ($user->status === 'suspended') {
            LoginAttempt::record($user->id, $username, $ip, false, 'account_suspended');
            Response::forbidden('Your account has been suspended. Contact an administrator.');
        }

        if ($user->status === 'deleted') {
            LoginAttempt::record($user->id, $username, $ip, false, 'account_deleted');
            Response::forbidden('This account no longer exists.');
        }

        if (!Security::verifyPassword($password, $user->password_hash)) {
            LoginAttempt::record($user->id, $username, $ip, false, 'invalid_password');
            Response::unauthorized('Invalid username or password.');
        }

        if (Security::needsRehash($user->password_hash)) {
            $user->update(['password' => $password]);
        }

        $failures = LoginAttempt::getRecentFailures($user->id, 15);
        if ($failures >= 5) {
            $blockedFor = LoginAttempt::getBlockSecondsRemaining($user->id, 15);
            $wait = $blockedFor > 60 ? (int) ceil($blockedFor / 60) . ' minute(s)' : $blockedFor . ' second(s)';
            Response::tooManyRequests("Too many failed attempts. Please try again in about {$wait}.");
        }

        // Generate auth token
        $token = AuthToken::generate($user->id);

        $user->updateLastLogin($ip);

        LoginAttempt::record($user->id, $username, $ip, true);
        ActivityLog::log('user.login', $user->id, 'user', $user->id, ['ip' => $ip]);

        $redirect = self::getDashboardRoute($user->role_slug);

        Response::success([
            'user'     => $user->toArray(),
            'token'    => $token,
            'redirect' => $redirect,
            'role'     => $user->role_slug,
        ], 'Login successful.');
    }

    public static function googleLogin(): never
    {
        $config = Database::getGoogleConfig();
        if (empty($config['client_id']) || empty($config['client_secret'])) {
            Response::serverError('Google login is not configured. Please set Google Client ID and Secret.');
        }

        $url = GoogleOAuth::getAuthorizationUrl();
        header('Location: ' . $url);
        exit;
    }

    public static function googleCallback(): never
    {
        // Ensure clean output buffer for redirect
        while (ob_get_level()) { ob_end_clean(); }

        $code  = $_GET['code'] ?? null;
        $state = $_GET['state'] ?? null;
        $error = $_GET['error'] ?? null;

        // Determine the frontend base URL (include base path for subdirectory installs e.g. /B15)
        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host   = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $basePath = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
        $baseUrl = $scheme . '://' . $host . $basePath;

        if ($error) {
            header('Location: ' . $baseUrl . '/#/login?error=' . urlencode($error));
            exit;
        }

        if (!$code || !$state) {
            header('Location: ' . $baseUrl . '/#/login?error=missing_params');
            exit;
        }

        // Validate state token
        if (!GoogleOAuth::validateState($state)) {
            header('Location: ' . $baseUrl . '/#/login?error=invalid_state');
            exit;
        }

        // Exchange code for access token
        $tokenData = GoogleOAuth::exchangeCode($code);
        if (!$tokenData || empty($tokenData['access_token'])) {
            header('Location: ' . $baseUrl . '/#/login?error=token_exchange_failed');
            exit;
        }

        // Fetch user info from Google
        $googleUser = GoogleOAuth::getUserInfo($tokenData['access_token']);
        if (!$googleUser || empty($googleUser['id'])) {
            header('Location: ' . $baseUrl . '/#/login?error=user_info_failed');
            exit;
        }

        $googleId    = $googleUser['id'];
        $email       = $googleUser['email'] ?? '';
        $fullName    = $googleUser['name'] ?? '';
        $avatarUrl   = $googleUser['picture'] ?? null;

        // Find or create user
        $db = Database::getInstance();

        // Check if user exists by google_id
        $stmt = $db->prepare('SELECT * FROM users WHERE google_id = ? LIMIT 1');
        $stmt->execute([$googleId]);
        $existingByGoogle = $stmt->fetch();

        if ($existingByGoogle) {
            $user = \App\Models\User::findById((int)$existingByGoogle['id']);
        } elseif ($email) {
            // Check if user exists by email
            $user = \App\Models\User::findByEmail($email);
            if ($user) {
                // Link Google account to existing user
                $user->update([
                    'google_id' => $googleId,
                    'provider'  => 'google',
                    'avatar_url' => $user->avatar_url ?: $avatarUrl,
                ]);
            }
        }

        if (!isset($user) || !$user) {
            // Create new user
            // Generate username from email or name
            $baseUsername = $email ? explode('@', $email)[0] : 'google_' . $googleId;
            $baseUsername = preg_replace('/[^a-zA-Z0-9_]/', '_', $baseUsername);
            $baseUsername = strtolower(substr($baseUsername, 0, 50));

            // Ensure unique username
            $username = $baseUsername;
            $suffix = 1;
            while (\App\Models\User::findByUsername($username)) {
                $username = $baseUsername . '_' . $suffix++;
            }

            // Ensure unique email
            $finalEmail = $email ?: ($username . '@google.cs15hub.local');
            if (\App\Models\User::findByEmail($finalEmail)) {
                $finalEmail = $username . '_' . bin2hex(random_bytes(3)) . '@google.cs15hub.local';
            }

            $user = \App\Models\User::create([
                'username'  => $username,
                'email'     => $finalEmail,
                'password'  => bin2hex(random_bytes(32)), // random password (user won't use it)
                'full_name' => $fullName,
            ]);

            // Update with Google info
            $user->update([
                'google_id'  => $googleId,
                'provider'   => 'google',
                'avatar_url' => $avatarUrl,
            ]);
        }

        // Check account status
        if ($user->status === 'suspended') {
            header('Location: ' . $baseUrl . '/#/login?error=account_suspended');
            exit;
        }
        if ($user->status === 'deleted') {
            header('Location: ' . $baseUrl . '/#/login?error=account_deleted');
            exit;
        }

        // Generate auth token
        $token = AuthToken::generate($user->id);
        $ip = Security::getClientIp();

        $user->updateLastLogin($ip);
        ActivityLog::log('user.login_google', $user->id, 'user', $user->id, ['ip' => $ip]);

        $redirect = self::getDashboardRoute($user->role_slug);

        // Redirect to frontend with token in URL fragment
        header('Location: ' . $baseUrl . '/#/auth/callback?token=' . urlencode($token) . '&redirect=' . urlencode($redirect));
        exit;
    }

    public static function logout(): never
    {
        $token = self::getRequestToken();
        if ($token) {
            $row = AuthToken::validate($token);
            if ($row) {
                ActivityLog::log('user.logout', (int)$row['uid']);
            }
            AuthToken::revoke($token);
        }

        Response::success(null, 'Logged out successfully.');
    }

    public static function me(): never
    {
        $token = self::getRequestToken();
        if (!$token) {
            Response::unauthorized('Not authenticated.');
        }

        $row = AuthToken::validate($token);
        if (!$row) {
            Response::unauthorized('Invalid or expired token.');
        }

        $user = User::findById((int)$row['uid']);
        if (!$user || $user->status !== 'active') {
            AuthToken::revokeAllForUser((int)$row['uid']);
            Response::unauthorized('Account not found or suspended.');
        }

        // Extend token
        self::extendRequestToken($token);

        Response::success([
            'user'       => $user->toArray(),
            'token'      => $token,
            'redirect'   => self::getDashboardRoute($user->role_slug),
        ]);
    }

    public static function uploadAvatar(): never
    {
        $authUser = AuthMiddleware::authenticate();

        if (!isset($_FILES['avatar']) || $_FILES['avatar']['error'] !== UPLOAD_ERR_OK) {
            Response::validationError('Upload failed.', ['avatar' => ['No file uploaded or upload error.']]);
        }

        $file = $_FILES['avatar'];
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $maxSize = 2 * 1024 * 1024;

        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, $allowedTypes, true)) {
            Response::validationError('Invalid file type.', ['avatar' => ['Only JPG, PNG, GIF, and WebP images are allowed.']]);
        }

        if ($file['size'] > $maxSize) {
            Response::validationError('File too large.', ['avatar' => ['Maximum file size is 2MB.']]);
        }

        if ($authUser->avatar_url) {
            $oldPath = __DIR__ . '/../../' . ltrim($authUser->avatar_url, '/');
            if (file_exists($oldPath)) {
                unlink($oldPath);
            }
        }

        $ext = match ($mime) {
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/gif'  => 'gif',
            'image/webp' => 'webp',
            default      => 'jpg',
        };
        $filename = $authUser->id . '_' . time() . '.' . $ext;
        $uploadDir = __DIR__ . '/../../uploads/avatars/';
        $destPath = $uploadDir . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            Response::serverError('Failed to save file.');
        }

        $webPath = \App\Config\App::baseUrl() . '/uploads/avatars/' . $filename;

        $authUser->update(['avatar_url' => $webPath]);

        ActivityLog::log('user.avatar_upload', $authUser->id, 'user', $authUser->id);

        $fresh = User::findById($authUser->id);
        Response::success(['user' => $fresh->toArray()], 'Profile picture updated.');
    }

    public static function deleteAvatar(): never
    {
        $authUser = AuthMiddleware::authenticate();

        if ($authUser->avatar_url) {
            $filePath = __DIR__ . '/../../' . ltrim($authUser->avatar_url, '/');
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            $authUser->update(['avatar_url' => null]);
            ActivityLog::log('user.avatar_delete', $authUser->id, 'user', $authUser->id);
        }

        $fresh = User::findById($authUser->id);
        Response::success(['user' => $fresh->toArray()], 'Profile picture removed.');
    }

    private static function getDashboardRoute(string $role): string
    {
        return match ($role) {
            'user'                => '/dashboard/user',
            'student'             => '/dashboard/student',
            'teacher'             => '/dashboard/teacher',
            'admin_financial'     => '/dashboard/financial',
            'admin_educational'   => '/dashboard/educational',
            'admin_general'       => '/dashboard/general',
            'admin_monitor'       => '/dashboard/monitor',
            'admin_sports'        => '/dashboard/sports',
            'super_admin'         => '/dashboard/super-admin',
            'soc_team'            => '/dashboard/soc',
            'operations_manager'  => '/dashboard/operations',
            default               => '/dashboard/user',
        };
    }

    private static function getRequestToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION']
               ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
               ?? '';
        if (preg_match('/^Bearer\s+(.+)$/i', $header, $m)) {
            return $m[1];
        }
        return $_SERVER['HTTP_X_AUTH_TOKEN'] ?? null;
    }

    private static function extendRequestToken(string $token): void
    {
        $hash = hash('sha256', $token);
        $expires = date('Y-m-d H:i:s', time() + \App\Helpers\AuthToken::EXPIRY_SECONDS);
        $db = \App\Config\Database::getInstance();
        $stmt = $db->prepare('UPDATE auth_tokens SET expires_at = ? WHERE token_hash = ?');
        $stmt->execute([$expires, $hash]);
    }
}

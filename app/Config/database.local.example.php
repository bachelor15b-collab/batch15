<?php
/**
 * Example configuration template.
 *
 * Copy this file to `database.local.php` (which is git-ignored) and fill in
 * your values, or set the same keys as environment variables:
 *
 *   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
 *
 * Environment variables always take priority over values in this file.
 * Leave google_* commented out (or unset) to disable Google sign-in.
 */
return [
    // MySQL (required)
    'host'     => 'localhost',
    'port'     => '3306',
    'dbname'   => 'cs15_hub',
    'username' => 'root',
    'password' => '',

    // Google OAuth (optional — only needed for Google login)
    // 'google_client_id'     => 'your-client-id.apps.googleusercontent.com',
    // 'google_client_secret' => 'your-client-secret',
    // 'google_redirect_uri'  => 'https://your-domain.com/api/auth/google/callback',
];
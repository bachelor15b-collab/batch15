-- Migration v9: Google OAuth support
-- Adds google_id, provider columns to users; creates oauth_states table

-- Add OAuth columns to users
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS google_id VARCHAR(64) DEFAULT NULL AFTER avatar_url,
    ADD COLUMN IF NOT EXISTS provider VARCHAR(32) DEFAULT 'local' AFTER google_id;

CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);

-- OAuth state tokens (short-lived, for CSRF protection during OAuth flow)
CREATE TABLE IF NOT EXISTS oauth_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    state_token VARCHAR(128) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_oauth_states_token (state_token),
    INDEX idx_oauth_states_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

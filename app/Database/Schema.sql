-- CS15 Hub — Full Database Schema
-- Engine: MySQL 8+
-- Encoding: utf8mb4

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP DATABASE IF EXISTS cs15_hub;
CREATE DATABASE cs15_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cs15_hub;

-- ============================================================
-- ROLES
-- ============================================================
CREATE TABLE roles (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(60) NOT NULL UNIQUE,
    slug        VARCHAR(60) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username        VARCHAR(60)  NOT NULL UNIQUE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    role_slug       VARCHAR(60)  NOT NULL DEFAULT 'student',
    full_name       VARCHAR(120) NULL,
    avatar_url      VARCHAR(500) NULL,
    status          ENUM('active','suspended','deleted') NOT NULL DEFAULT 'active',
    last_login_ip   VARCHAR(45)  NULL,
    last_login_at   TIMESTAMP    NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_role (role_slug),
    INDEX idx_users_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- SESSIONS
-- ============================================================
CREATE TABLE sessions (
    id            VARCHAR(128) PRIMARY KEY,
    user_id       INT UNSIGNED NULL,
    ip_address    VARCHAR(45)  NOT NULL,
    user_agent    TEXT         NULL,
    payload       TEXT         NULL,
    last_activity TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_sessions_user (user_id),
    INDEX idx_sessions_last (last_activity)
) ENGINE=InnoDB;

-- ============================================================
-- LOGIN ATTEMPTS (for rate-limiting & SOC)
-- ============================================================
CREATE TABLE login_attempts (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    INT UNSIGNED NULL,
    email      VARCHAR(255) NULL,
    ip_address VARCHAR(45)  NOT NULL,
    user_agent TEXT         NULL,
    success    TINYINT(1)   NOT NULL DEFAULT 0,
    fail_reason VARCHAR(100) NULL,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_la_ip (ip_address),
    INDEX idx_la_user (user_id),
    INDEX idx_la_created (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- ACTIVITY LOGS (audit trail)
-- ============================================================
CREATE TABLE activity_logs (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    INT UNSIGNED NULL,
    action     VARCHAR(120) NOT NULL,
    entity_type VARCHAR(60) NULL,
    entity_id  INT UNSIGNED NULL,
    details    JSON         NULL,
    ip_address VARCHAR(45)  NOT NULL,
    user_agent TEXT         NULL,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_al_user (user_id),
    INDEX idx_al_action (action),
    INDEX idx_al_created (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- CONTENT POSTS (unified content engine)
-- ============================================================
CREATE TABLE content_posts (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    excerpt     TEXT         NULL,
    content     LONGTEXT     NULL,
    post_type   ENUM('blog','announcement','resource','challenge','project','gallery','page') NOT NULL DEFAULT 'blog',
    author_id   INT UNSIGNED NOT NULL,
    status      ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
    meta        JSON         NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_cp_type (post_type),
    INDEX idx_cp_author (author_id),
    INDEX idx_cp_status (status),
    INDEX idx_cp_slug (slug),
    FULLTEXT idx_cp_search (title, content)
) ENGINE=InnoDB;

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE messages (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    sender_id   INT UNSIGNED NOT NULL,
    receiver_id INT UNSIGNED NOT NULL,
    subject     VARCHAR(255) NULL,
    message     TEXT         NOT NULL,
    attachment  VARCHAR(500) NULL,
    read_status TINYINT(1)   NOT NULL DEFAULT 0,
    parent_id   INT UNSIGNED NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_msg_sender (sender_id),
    INDEX idx_msg_receiver (receiver_id),
    INDEX idx_msg_read (receiver_id, read_status)
) ENGINE=InnoDB;

-- ============================================================
-- CHALLENGES
-- ============================================================
CREATE TABLE challenges (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    description   TEXT         NOT NULL,
    difficulty    ENUM('easy','medium','hard','expert') NOT NULL DEFAULT 'medium',
    xp_reward     INT UNSIGNED NOT NULL DEFAULT 100,
    starter_code  TEXT         NULL,
    test_cases    JSON         NULL,
    due_at        TIMESTAMP    NULL,
    status        ENUM('draft','open','closed') NOT NULL DEFAULT 'draft',
    author_id     INT UNSIGNED NOT NULL,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_ch_status (status),
    INDEX idx_ch_author (author_id)
) ENGINE=InnoDB;

-- ============================================================
-- SUBMISSIONS (challenge solutions)
-- ============================================================
CREATE TABLE submissions (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    challenge_id  INT UNSIGNED NOT NULL,
    user_id       INT UNSIGNED NOT NULL,
    code          TEXT         NOT NULL,
    language      VARCHAR(30)  NOT NULL DEFAULT 'php',
    score         DECIMAL(5,2) NULL,
    passed        TINYINT(1)   NULL,
    feedback      TEXT         NULL,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_sub_challenge (challenge_id),
    INDEX idx_sub_user (user_id),
    UNIQUE KEY uk_submission (challenge_id, user_id)
) ENGINE=InnoDB;

-- ============================================================
-- XP / LEADERBOARD
-- ============================================================
CREATE TABLE user_xp (
    user_id     INT UNSIGNED PRIMARY KEY,
    total_xp    INT UNSIGNED NOT NULL DEFAULT 0,
    level       INT UNSIGNED NOT NULL DEFAULT 1,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- ELECTIONS
-- ============================================================
CREATE TABLE elections (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT         NULL,
    status      ENUM('pending','active','closed') NOT NULL DEFAULT 'pending',
    start_date  DATETIME     NOT NULL,
    end_date    DATETIME     NOT NULL,
    created_by  INT UNSIGNED NOT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_el_status (status),
    INDEX idx_el_dates (start_date, end_date)
) ENGINE=InnoDB;

-- ============================================================
-- CANDIDATES
-- ============================================================
CREATE TABLE candidates (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    election_id INT UNSIGNED NOT NULL,
    user_id     INT UNSIGNED NOT NULL,
    manifesto   TEXT         NULL,
    position    VARCHAR(120) NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_candidate (election_id, user_id),
    INDEX idx_cand_election (election_id)
) ENGINE=InnoDB;

-- ============================================================
-- VOTES
-- ============================================================
CREATE TABLE votes (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    election_id INT UNSIGNED NOT NULL,
    user_id     INT UNSIGNED NOT NULL,
    candidate_id INT UNSIGNED NOT NULL,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_vote (election_id, user_id),
    INDEX idx_vote_election (election_id),
    INDEX idx_vote_candidate (candidate_id)
) ENGINE=InnoDB;

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL,
    title       VARCHAR(255) NOT NULL,
    message     TEXT         NOT NULL,
    type        ENUM('info','message','challenge','election','role','post') NOT NULL DEFAULT 'info',
    reference_type VARCHAR(60) NULL,
    reference_id   INT UNSIGNED NULL,
    read_status TINYINT(1)   NOT NULL DEFAULT 0,
    created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_notif_user (user_id, read_status),
    INDEX idx_notif_created (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- BLOCKED IPS (SOC feature)
-- ============================================================
CREATE TABLE blocked_ips (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    ip_address  VARCHAR(45) NOT NULL,
    reason      TEXT        NULL,
    blocked_by  INT UNSIGNED NOT NULL,
    created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_blocked_ip (ip_address)
) ENGINE=InnoDB;

-- ============================================================
-- SYSTEM CONFIG (Super Admin settings)
-- ============================================================
CREATE TABLE system_config (
    `key`       VARCHAR(120) PRIMARY KEY,
    value       TEXT         NOT NULL,
    updated_by  INT UNSIGNED NULL,
    updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
-- ASSIGNMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS assignments (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    course_id     INT UNSIGNED NOT NULL,
    title         VARCHAR(255) NOT NULL,
    description   TEXT NULL,
    due_date      DATE NULL,
    max_score     DECIMAL(5,2) NOT NULL DEFAULT 100.00,
    status        ENUM('active','grading','completed') NOT NULL DEFAULT 'active',
    created_by    INT UNSIGNED NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_asmt_course (course_id),
    INDEX idx_asmt_created_by (created_by),
    INDEX idx_asmt_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS assignment_submissions (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    assignment_id INT UNSIGNED NOT NULL,
    user_id       INT UNSIGNED NOT NULL,
    content       TEXT NULL,
    file_url      VARCHAR(500) NULL,
    score         DECIMAL(5,2) NULL,
    feedback      TEXT NULL,
    submitted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_asmt_sub (assignment_id, user_id),
    INDEX idx_asmt_sub_assignment (assignment_id),
    INDEX idx_asmt_sub_user (user_id)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;

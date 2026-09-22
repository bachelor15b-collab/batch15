-- CS15 Hub — Schema Migration: Missing Enterprise Modules
-- Adds tables for Finance, Academics, Sports, Facilities, Monitoring, Achievements
-- Run AFTER Schema.sql (i.e. on existing cs15_hub database)

USE cs15_hub;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- 1. FINANCE / PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_no    VARCHAR(60) NOT NULL UNIQUE,
    user_id       INT UNSIGNED NOT NULL,
    amount        DECIMAL(12,2) NOT NULL,
    description   TEXT NULL,
    status        ENUM('pending','paid','overdue','cancelled') NOT NULL DEFAULT 'pending',
    due_date      DATE NOT NULL,
    paid_at       TIMESTAMP NULL,
    created_by    INT UNSIGNED NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_inv_user (user_id),
    INDEX idx_inv_status (status),
    INDEX idx_inv_due (due_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    invoice_id    INT UNSIGNED NULL,
    user_id       INT UNSIGNED NOT NULL,
    amount        DECIMAL(12,2) NOT NULL,
    method        ENUM('cash','bank_transfer','card','mobile_money','other') NOT NULL DEFAULT 'cash',
    reference     VARCHAR(120) NULL,
    notes         TEXT NULL,
    received_by   INT UNSIGNED NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_pay_invoice (invoice_id),
    INDEX idx_pay_user (user_id),
    INDEX idx_pay_method (method),
    INDEX idx_pay_date (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- 2. ACADEMICS / COURSES
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(120) NOT NULL UNIQUE,
    code          VARCHAR(20) NOT NULL UNIQUE,
    description   TEXT NULL,
    head_user_id  INT UNSIGNED NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS semesters (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    code          VARCHAR(20) NOT NULL UNIQUE,
    start_date    DATE NOT NULL,
    end_date      DATE NOT NULL,
    is_current    TINYINT(1) NOT NULL DEFAULT 0,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS courses (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code          VARCHAR(20) NOT NULL UNIQUE,
    name          VARCHAR(255) NOT NULL,
    description   TEXT NULL,
    department_id INT UNSIGNED NULL,
    credits       TINYINT UNSIGNED NOT NULL DEFAULT 3,
    teacher_id    INT UNSIGNED NULL,
    semester_id   INT UNSIGNED NULL,
    max_students  INT UNSIGNED NULL DEFAULT 0,
    status        ENUM('active','inactive','archived') NOT NULL DEFAULT 'active',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_crs_dept (department_id),
    INDEX idx_crs_teacher (teacher_id),
    INDEX idx_crs_semester (semester_id),
    INDEX idx_crs_code (code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS enrollments (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id       INT UNSIGNED NOT NULL,
    course_id     INT UNSIGNED NOT NULL,
    status        ENUM('active','completed','dropped','pending') NOT NULL DEFAULT 'active',
    enrolled_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at  TIMESTAMP NULL,
    UNIQUE KEY uk_enrollment (user_id, course_id),
    INDEX idx_enr_course (course_id),
    INDEX idx_enr_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS grades (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id       INT UNSIGNED NOT NULL,
    course_id     INT UNSIGNED NOT NULL,
    score         DECIMAL(5,2) NULL,
    letter_grade  VARCHAR(2) NULL,
    remarks       TEXT NULL,
    graded_by     INT UNSIGNED NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_grade (user_id, course_id),
    INDEX idx_grd_course (course_id)
) ENGINE=InnoDB;

-- ============================================================
-- 3. SPORTS / EVENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS sports_teams (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(120) NOT NULL,
    sport_type    VARCHAR(60) NOT NULL,
    description   TEXT NULL,
    captain_id    INT UNSIGNED NULL,
    coach_id      INT UNSIGNED NULL,
    status        ENUM('active','inactive') NOT NULL DEFAULT 'active',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_team_sport (sport_type)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS team_members (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    team_id       INT UNSIGNED NOT NULL,
    user_id       INT UNSIGNED NOT NULL,
    role          VARCHAR(60) NOT NULL DEFAULT 'player',
    joined_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_team_member (team_id, user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sports_events (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    description   TEXT NULL,
    sport_type    VARCHAR(60) NOT NULL,
    event_date    DATETIME NOT NULL,
    location      VARCHAR(255) NULL,
    team1_id      INT UNSIGNED NULL,
    team2_id      INT UNSIGNED NULL,
    team1_score   INT NULL DEFAULT 0,
    team2_score   INT NULL DEFAULT 0,
    status        ENUM('scheduled','ongoing','completed','cancelled') NOT NULL DEFAULT 'scheduled',
    created_by    INT UNSIGNED NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_se_date (event_date),
    INDEX idx_se_sport (sport_type),
    INDEX idx_se_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- 4. FACILITIES / BOOKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS facilities (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    type          VARCHAR(60) NOT NULL,
    capacity      INT UNSIGNED NULL,
    location      VARCHAR(255) NULL,
    description   TEXT NULL,
    status        ENUM('available','maintenance','closed') NOT NULL DEFAULT 'available',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    facility_id   INT UNSIGNED NOT NULL,
    user_id       INT UNSIGNED NOT NULL,
    title         VARCHAR(255) NOT NULL,
    start_time    DATETIME NOT NULL,
    end_time      DATETIME NOT NULL,
    status        ENUM('pending','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
    approved_by   INT UNSIGNED NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_bk_facility (facility_id),
    INDEX idx_bk_user (user_id),
    INDEX idx_bk_dates (start_time, end_time),
    INDEX idx_bk_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- 5. MONITORING / INCIDENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS system_health (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    service_name  VARCHAR(120) NOT NULL,
    status        ENUM('up','degraded','down') NOT NULL DEFAULT 'up',
    response_time_ms INT UNSIGNED NULL,
    checked_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sh_service (service_name),
    INDEX idx_sh_checked (checked_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS incidents (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(255) NOT NULL,
    description   TEXT NOT NULL,
    severity      ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium',
    status        ENUM('open','investigating','resolved','closed') NOT NULL DEFAULT 'open',
    assignee_id   INT UNSIGNED NULL,
    reported_by   INT UNSIGNED NOT NULL,
    resolved_at   TIMESTAMP NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_inc_severity (severity),
    INDEX idx_inc_status (status),
    INDEX idx_inc_assignee (assignee_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS alert_rules (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    metric        VARCHAR(120) NOT NULL,
    condition     ENUM('gt','lt','eq','neq') NOT NULL DEFAULT 'gt',
    threshold     DECIMAL(12,2) NOT NULL,
    severity      ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium',
    enabled       TINYINT(1) NOT NULL DEFAULT 1,
    created_by    INT UNSIGNED NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS alerts (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    rule_id       INT UNSIGNED NULL,
    title         VARCHAR(255) NOT NULL,
    message       TEXT NOT NULL,
    severity      ENUM('low','medium','high','critical') NOT NULL DEFAULT 'medium',
    acknowledged  TINYINT(1) NOT NULL DEFAULT 0,
    acknowledged_by INT UNSIGNED NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_alert_severity (severity),
    INDEX idx_alert_ack (acknowledged),
    INDEX idx_alert_created (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- 6. ACHIEVEMENTS / BADGES
-- ============================================================
CREATE TABLE IF NOT EXISTS achievements (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(120) NOT NULL UNIQUE,
    description   TEXT NULL,
    icon          VARCHAR(120) NULL,
    xp_reward     INT UNSIGNED NOT NULL DEFAULT 0,
    criteria      JSON NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_achievements (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED NOT NULL,
    achievement_id  INT UNSIGNED NOT NULL,
    earned_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_achievement (user_id, achievement_id),
    INDEX idx_ua_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- 7. ASSIGNMENTS
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

-- Migration: Add lessons table
-- The Lesson model references this table but it was never created in Schema.sql.

CREATE TABLE IF NOT EXISTS lessons (
    id                INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    course_id         INT UNSIGNED NOT NULL,
    title             VARCHAR(255) NOT NULL,
    description       TEXT NULL,
    file_path         VARCHAR(500) NOT NULL,
    file_type         VARCHAR(30) NOT NULL,
    file_size         INT UNSIGNED NOT NULL DEFAULT 0,
    original_filename VARCHAR(255) NOT NULL,
    uploaded_by       INT UNSIGNED NOT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_lesson_course (course_id),
    INDEX idx_lesson_uploaded_by (uploaded_by)
) ENGINE=InnoDB;

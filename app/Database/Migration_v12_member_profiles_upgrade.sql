-- Member profiles upgrade: roster directory + social links
-- 1) Allow unclaimed roster entries (no linked user account yet)
ALTER TABLE member_profiles MODIFY user_id INT UNSIGNED NULL;

-- 2) New identity / social columns
ALTER TABLE member_profiles
    ADD COLUMN student_id   VARCHAR(64)  DEFAULT NULL AFTER user_id,
    ADD COLUMN source       ENUM('roster','self','admin') NOT NULL DEFAULT 'self' AFTER semester,
    ADD COLUMN roster_key   VARCHAR(64)  DEFAULT NULL AFTER source,
    ADD COLUMN interests    TEXT         DEFAULT NULL AFTER languages,
    ADD COLUMN facebook     VARCHAR(500) DEFAULT NULL AFTER twitter,
    ADD COLUMN instagram    VARCHAR(500) DEFAULT NULL AFTER facebook;

CREATE INDEX idx_mp_roster_key ON member_profiles (roster_key);
CREATE INDEX idx_mp_student_id ON member_profiles (student_id);
CREATE INDEX idx_mp_status      ON member_profiles (status);
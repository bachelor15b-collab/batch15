-- Migration v7: Device fingerprinting for SOC monitoring
-- Adds os, browser, device_type columns to login_attempts and activity_logs
-- Adds user_known_ips table for tracking known IPs per user

USE cs15_hub;

-- Add device columns to login_attempts
ALTER TABLE login_attempts
    ADD COLUMN os VARCHAR(100) NULL AFTER user_agent,
    ADD COLUMN browser VARCHAR(100) NULL AFTER os,
    ADD COLUMN device_type ENUM('desktop','mobile','tablet','bot','unknown') NOT NULL DEFAULT 'unknown' AFTER browser;

-- Add device columns to activity_logs
ALTER TABLE activity_logs
    ADD COLUMN os VARCHAR(100) NULL AFTER user_agent,
    ADD COLUMN browser VARCHAR(100) NULL AFTER os,
    ADD COLUMN device_type ENUM('desktop','mobile','tablet','bot','unknown') NOT NULL DEFAULT 'unknown' AFTER browser;

-- Add index for device queries
ALTER TABLE login_attempts ADD INDEX idx_la_device (device_type);
ALTER TABLE login_attempts ADD INDEX idx_la_os (os);

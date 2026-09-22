-- CS15 Hub — Seed Data
-- Includes super admin + SOC admin accounts (passwords use Argon2id)

USE cs15_hub;

-- ============================================================
-- ROLES
-- ============================================================
INSERT INTO roles (name, slug, description) VALUES
('Student',              'student',               'Default role — access to student dashboard only'),
('Teacher',              'teacher',               'Faculty member — can create content and grade'),
('Financial Admin',      'admin_financial',        'Manages financial records and transactions'),
('Educational Admin',    'admin_educational',      'Oversees academic programs and curriculum'),
('General Admin',        'admin_general',          'General administrative duties'),
('Monitor Admin',        'admin_monitor',          'Security monitoring and log review'),
('Sports Admin',         'admin_sports',           'Manages sports activities and events'),
('Super Admin',          'super_admin',            'Full system access — can manage all roles and settings'),
('SOC Team',             'soc_team',               'Security Operations Center — monitoring and threat response'),
('Operations Manager',   'operations_manager',     'Manages day-to-day operations');

-- ============================================================
-- SUPER ADMIN ACCOUNT
-- username: thedealer
-- password: B-out13@  (Argon2id hash)
-- ============================================================
-- NOTE: Generate fresh hash with: php -r "echo password_hash('B-out13@', PASSWORD_ARGON2ID, ['memory_cost' => 65536, 'time_cost' => 4, 'threads' => 1]);"
INSERT INTO users (username, email, password_hash, role_slug, full_name, status)
VALUES (
    'thedealer',
    'thedealer@cs15hub.local',
    '$argon2id$v=19$m=65536,t=4,p=1$Ym92VDZMYS5DdmVOWkF2Vg$ff/f4qInPVkpntuvW8LNzV0bL7g5CfyrDtSZXX5A5a8',
    'super_admin',
    'Super Admin',
    'active'
);

-- ============================================================
-- SOC ADMIN ACCOUNT
-- username: siemteam
-- password: A-in/out13@  (Argon2id hash)
-- ============================================================
-- NOTE: The password_hash below must be regenerated for the actual environment or use the same as thedealer pattern
INSERT INTO users (username, email, password_hash, role_slug, full_name, status)
VALUES (
    'siemteam',
    'siemteam@cs15hub.local',
    '$argon2id$v=19$m=65536,t=4,p=1$RTNHcUNha05yQ21Fc0c3OQ$SAdI0nAIpsIvD+x/6ZIhbYcbdj6RPr2kAwZLDdqTudk',
    'soc_team',
    'SOC Team',
    'active'
);

-- ============================================================
-- SAMPLE USERS (one per role for testing)
-- ============================================================
-- All sample users use password: password123
INSERT INTO users (username, email, password_hash, role_slug, full_name, status) VALUES
('john_doe',      'john@cs15hub.local',      '$argon2id$v=19$m=65536,t=4,p=1$Llp2Nk5jS2tMVW00VUpScg$xy8FBQTrphWykRK5ZcaWFkXs3mPdbo+624SemYovC5I', 'student',            'John Doe',            'active'),
('jane_teacher',  'jane@cs15hub.local',      '$argon2id$v=19$m=65536,t=4,p=1$Llp2Nk5jS2tMVW00VUpScg$xy8FBQTrphWykRK5ZcaWFkXs3mPdbo+624SemYovC5I', 'teacher',            'Jane Smith',          'active'),
('bob_finance',   'bob@cs15hub.local',       '$argon2id$v=19$m=65536,t=4,p=1$Llp2Nk5jS2tMVW00VUpScg$xy8FBQTrphWykRK5ZcaWFkXs3mPdbo+624SemYovC5I', 'admin_financial',     'Bob Williams',        'active'),
('alice_edu',     'alice@cs15hub.local',     '$argon2id$v=19$m=65536,t=4,p=1$Llp2Nk5jS2tMVW00VUpScg$xy8FBQTrphWykRK5ZcaWFkXs3mPdbo+624SemYovC5I', 'admin_educational',   'Alice Johnson',       'active'),
('mike_general',  'mike@cs15hub.local',      '$argon2id$v=19$m=65536,t=4,p=1$Llp2Nk5jS2tMVW00VUpScg$xy8FBQTrphWykRK5ZcaWFkXs3mPdbo+624SemYovC5I', 'admin_general',       'Mike Brown',          'active'),
('sara_monitor',  'sara@cs15hub.local',      '$argon2id$v=19$m=65536,t=4,p=1$Llp2Nk5jS2tMVW00VUpScg$xy8FBQTrphWykRK5ZcaWFkXs3mPdbo+624SemYovC5I', 'admin_monitor',       'Sara Davis',          'active'),
('tom_sports',    'tom@cs15hub.local',       '$argon2id$v=19$m=65536,t=4,p=1$Llp2Nk5jS2tMVW00VUpScg$xy8FBQTrphWykRK5ZcaWFkXs3mPdbo+624SemYovC5I', 'admin_sports',        'Tom Wilson',          'active'),
('ops_manager',   'ops@cs15hub.local',       '$argon2id$v=19$m=65536,t=4,p=1$Llp2Nk5jS2tMVW00VUpScg$xy8FBQTrphWykRK5ZcaWFkXs3mPdbo+624SemYovC5I', 'operations_manager',  'Ops Manager',         'active');

-- ============================================================
-- SAMPLE CONTENT POSTS
-- ============================================================
INSERT INTO content_posts (title, slug, excerpt, content, post_type, author_id, status) VALUES
('Welcome to CS15 Hub',              'welcome-cs15-hub',          'Welcome message for Batch 15',           '<h1>Welcome!</h1><p>This is your central hub.</p>',      'announcement', 1, 'published'),
('PHP Basics Challenge',             'php-basics-challenge',      'Test your PHP fundamentals',              'Write a function that reverses a string without strrev().', 'challenge',    2, 'published'),
('Final Year Project Guidelines',    'final-year-project-guide',  'Everything you need to know',             '<p>Full guidelines here...</p>',                          'resource',     1, 'published'),
('Gallery: Tech Fest 2026',          'tech-fest-2026',            'Highlights from Tech Fest',               '<p>Photos and videos from the event.</p>',                'gallery',      2, 'published'),
('Student Council Elections 2026',   'elections-2026',            'Vote for your representatives',           '<p>Election details here...</p>',                         'page',         1, 'published');

-- ============================================================
-- SAMPLE MESSAGES
-- ============================================================
INSERT INTO messages (sender_id, receiver_id, subject, message, read_status) VALUES
(1, 3, 'Welcome to the platform', 'Hello! Your account is now active.', 0),
(3, 1, 'Re: Welcome', 'Thank you! Looking forward to it.', 1);

-- ============================================================
-- SAMPLE CHALLENGE
-- ============================================================
INSERT INTO challenges (title, description, difficulty, xp_reward, starter_code, test_cases, status, author_id) VALUES
('Reverse a String', 'Write a function that reverses a string without using strrev().', 'easy', 100, 'function reverseString($str) {\n  // Your code here\n}', '[{"input": "hello", "expected": "olleh"}, {"input": "PHP", "expected": "PHP"}]', 'open', 2);

-- ============================================================
-- SAMPLE ELECTION
-- ============================================================
INSERT INTO elections (title, description, status, start_date, end_date, created_by) VALUES
('Student Council 2026', 'Elect your batch representatives', 'pending', '2026-09-01 00:00:00', '2026-09-07 23:59:59', 1);

-- ============================================================
-- SYSTEM CONFIG
-- ============================================================
INSERT INTO system_config (`key`, value) VALUES
('site_name', 'CS15 Hub'),
('max_login_attempts', '5'),
('lockout_duration_minutes', '15'),
('session_lifetime_minutes', '120');

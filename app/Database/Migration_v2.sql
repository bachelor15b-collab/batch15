-- CS15 Hub — Migration v2: Assignment submissions & notifications

ALTER TABLE assignment_submissions
  ADD COLUMN link VARCHAR(500) NULL AFTER file_url,
  ADD COLUMN status ENUM('pending','approved','rejected','revision') NOT NULL DEFAULT 'pending' AFTER link,
  ADD COLUMN graded_by INT UNSIGNED NULL AFTER feedback,
  ADD COLUMN graded_at TIMESTAMP NULL AFTER graded_by,
  ADD INDEX idx_asmt_sub_status (status);

ALTER TABLE notifications
  MODIFY COLUMN type ENUM('info','message','challenge','election','role','post','assignment') NOT NULL DEFAULT 'info';

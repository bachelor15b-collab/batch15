-- Migration v11: Gallery items (photos & videos)
CREATE TABLE IF NOT EXISTS gallery_items (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,
    image_url   VARCHAR(500) DEFAULT NULL,
    video_url   VARCHAR(500) DEFAULT NULL,
    category    ENUM('events','academic','social') NOT NULL DEFAULT 'events',
    author_id   INT UNSIGNED DEFAULT NULL,
    author_name VARCHAR(120) DEFAULT NULL,
    status      ENUM('published','draft') NOT NULL DEFAULT 'published',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_gallery_category (category),
    INDEX idx_gallery_status (status),
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

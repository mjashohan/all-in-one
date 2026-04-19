-- =============================================================================
-- all-in-one — Database Schema
-- MySQL 8.0+ / compatible with Spring Boot 4 + Hibernate (ddl-auto=update)
--
-- Aligned with:
--   • Current JPA entities in com.shohan.allinone.entity
--   • WEBSITE DEVELOPMENT BRIEF (auth, productivity app, services,
--     blog/SEO, contact/lead system, admin dashboard)
-- =============================================================================

DROP DATABASE IF EXISTS all_in_one;
CREATE DATABASE all_in_one
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
USE all_in_one;


-- =============================================================================
-- 1. USERS  (auth + profile)
-- =============================================================================
CREATE TABLE users (
                       id          BIGINT        AUTO_INCREMENT PRIMARY KEY,
                       username    VARCHAR(50)   NOT NULL UNIQUE,
                       email       VARCHAR(100)  NOT NULL UNIQUE,
                       password    VARCHAR(255)  NOT NULL,
                       role        VARCHAR(20)   NOT NULL DEFAULT 'USER',   -- USER | ADMIN
                       full_name   VARCHAR(100)  NULL,
                       bio         TEXT          NULL,
                       avatar_url  VARCHAR(255)  NULL,
                       enabled     BOOLEAN       NOT NULL DEFAULT TRUE,
                       created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,

                       INDEX idx_users_username (username),
                       INDEX idx_users_email    (email),
                       INDEX idx_users_role     (role)
) ENGINE=InnoDB;


-- =============================================================================
-- 2. PASSWORD RESET TOKENS  (brief: "Password reset")
-- =============================================================================
CREATE TABLE password_reset_tokens (
                                       id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
                                       user_id    BIGINT       NOT NULL,
                                       token      VARCHAR(255) NOT NULL UNIQUE,
                                       expires_at TIMESTAMP    NOT NULL,
                                       used       BOOLEAN      NOT NULL DEFAULT FALSE,
                                       created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                       CONSTRAINT fk_prt_user
                                           FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

                                       INDEX idx_prt_token  (token),
                                       INDEX idx_prt_user   (user_id),
                                       INDEX idx_prt_expiry (expires_at)
) ENGINE=InnoDB;


-- =============================================================================
-- 3. SERVICES  (catalog — brief: "2 main paid services", expandable)
-- =============================================================================
CREATE TABLE services (
                          id                BIGINT         AUTO_INCREMENT PRIMARY KEY,
                          title             VARCHAR(150)   NOT NULL,
                          slug              VARCHAR(150)   NOT NULL UNIQUE,
                          short_description VARCHAR(500)   NULL,
                          description       TEXT           NULL,
                          benefits          TEXT           NULL,           -- bullet list / markdown
                          price             DECIMAL(10, 2) NULL,
                          currency          VARCHAR(3)     NOT NULL DEFAULT 'USD',
                          image_url         VARCHAR(255)   NULL,
                          active            BOOLEAN        NOT NULL DEFAULT TRUE,
                          display_order     INT            NOT NULL DEFAULT 0,
                          created_at        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at        TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

                          INDEX idx_services_slug   (slug),
                          INDEX idx_services_active (active)
) ENGINE=InnoDB;


-- =============================================================================
-- 4. SERVICE REQUESTS  (brief: "Users submit a request form")
-- =============================================================================
CREATE TABLE service_requests (
                                  id            BIGINT       AUTO_INCREMENT PRIMARY KEY,
                                  user_id       BIGINT       NULL,                    -- null if guest submits
                                  service_id    BIGINT       NULL,                    -- link to catalog entry
                                  service_type  VARCHAR(100) NULL,                    -- legacy / free-text
                                  contact_name  VARCHAR(100) NULL,
                                  contact_email VARCHAR(100) NULL,
                                  contact_phone VARCHAR(30)  NULL,
                                  description   TEXT         NULL,
                                  status        VARCHAR(50)  NOT NULL DEFAULT 'PENDING',
    -- PENDING | IN_PROGRESS | COMPLETED | CANCELLED
                                  admin_notes   TEXT         NULL,
                                  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP,

                                  CONSTRAINT fk_sr_user
                                      FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE SET NULL,
                                  CONSTRAINT fk_sr_service
                                      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,

                                  INDEX idx_sr_user    (user_id),
                                  INDEX idx_sr_service (service_id),
                                  INDEX idx_sr_status  (status),
                                  INDEX idx_sr_created (created_at)
) ENGINE=InnoDB;


-- =============================================================================
-- 5. TASKS  (productivity app — brief: category = study | work | personal)
-- =============================================================================
CREATE TABLE tasks (
                       id           BIGINT       AUTO_INCREMENT PRIMARY KEY,
                       user_id      BIGINT       NOT NULL,
                       title        VARCHAR(255) NOT NULL,
                       description  TEXT         NULL,
                       category     VARCHAR(20)  NOT NULL,                 -- STUDY | WORK | PERSONAL
                       status       VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    -- PENDING | IN_PROGRESS | COMPLETED
                       priority     VARCHAR(20)  NOT NULL DEFAULT 'MEDIUM', -- LOW | MEDIUM | HIGH
                       due_date     TIMESTAMP    NULL,
                       completed_at TIMESTAMP    NULL,
                       created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,

                       CONSTRAINT fk_tasks_user
                           FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

                       INDEX idx_tasks_user     (user_id),
                       INDEX idx_tasks_category (category),
                       INDEX idx_tasks_status   (status),
                       INDEX idx_tasks_due      (due_date)
) ENGINE=InnoDB;


-- =============================================================================
-- 6. APP USAGE LOGS  (brief: "Number of times the app is used")
-- =============================================================================
CREATE TABLE app_usage_logs (
                                id         BIGINT       AUTO_INCREMENT PRIMARY KEY,
                                user_id    BIGINT       NOT NULL,
                                action     VARCHAR(50)  NOT NULL,
    -- APP_OPENED | TASK_CREATED | TASK_COMPLETED | SESSION_START | ...
                                category   VARCHAR(20)  NULL,        -- STUDY | WORK | PERSONAL (if applicable)
                                metadata   JSON         NULL,        -- freeform context
                                session_id VARCHAR(100) NULL,
                                ip_address VARCHAR(45)  NULL,
                                user_agent VARCHAR(500) NULL,
                                created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                CONSTRAINT fk_aul_user
                                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

                                INDEX idx_aul_user     (user_id),
                                INDEX idx_aul_action   (action),
                                INDEX idx_aul_category (category),
                                INDEX idx_aul_created  (created_at)
) ENGINE=InnoDB;


-- =============================================================================
-- 7. PROJECTS  (portfolio items on the personal brand page)
-- =============================================================================
CREATE TABLE projects (
                          id            BIGINT       AUTO_INCREMENT PRIMARY KEY,
                          title         VARCHAR(150) NOT NULL,
                          description   TEXT         NULL,
                          image_url     VARCHAR(255) NULL,
                          link          VARCHAR(255) NULL,
                          display_order INT          NOT NULL DEFAULT 0,
                          featured      BOOLEAN      NOT NULL DEFAULT FALSE,
                          created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,

                          INDEX idx_projects_featured (featured)
) ENGINE=InnoDB;


-- =============================================================================
-- 8. MESSAGES  (contact form — brief: "Store inquiries for admin access")
-- =============================================================================
CREATE TABLE messages (
                          id           BIGINT       AUTO_INCREMENT PRIMARY KEY,
                          sender_name  VARCHAR(100) NOT NULL,
                          sender_email VARCHAR(100) NOT NULL,
                          subject      VARCHAR(200) NULL,
                          content      TEXT         NOT NULL,
                          is_read      BOOLEAN      NOT NULL DEFAULT FALSE,
                          replied      BOOLEAN      NOT NULL DEFAULT FALSE,
                          ip_address   VARCHAR(45)  NULL,
                          sent_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,

                          INDEX idx_msg_email   (sender_email),
                          INDEX idx_msg_is_read (is_read),
                          INDEX idx_msg_sent_at (sent_at)
) ENGINE=InnoDB;


-- =============================================================================
-- 9. BLOGS  (brief: "Categorization + SEO-friendly structure")
-- =============================================================================
CREATE TABLE blogs (
                       id               BIGINT        AUTO_INCREMENT PRIMARY KEY,
                       title            VARCHAR(200)  NOT NULL,
                       slug             VARCHAR(200)  NOT NULL UNIQUE,       -- SEO URL
                       content          LONGTEXT      NOT NULL,
                       excerpt          VARCHAR(500)  NULL,
                       category         VARCHAR(100)  NULL,                  -- marketing | productivity | personal
                       tags             VARCHAR(500)  NULL,                  -- comma-separated
                       cover_image_url  VARCHAR(255)  NULL,
                       author_id        BIGINT        NULL,
                       meta_title       VARCHAR(200)  NULL,                  -- SEO
                       meta_description VARCHAR(500)  NULL,                  -- SEO
                       meta_keywords    VARCHAR(500)  NULL,                  -- SEO
                       status           VARCHAR(20)   NOT NULL DEFAULT 'DRAFT',
    -- DRAFT | PUBLISHED | ARCHIVED
                       view_count       BIGINT        NOT NULL DEFAULT 0,
                       published_date   TIMESTAMP     NULL DEFAULT CURRENT_TIMESTAMP,
                       created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,

                       CONSTRAINT fk_blogs_author
                           FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,

                       INDEX idx_blogs_slug      (slug),
                       INDEX idx_blogs_category  (category),
                       INDEX idx_blogs_status    (status),
                       INDEX idx_blogs_published (published_date)
) ENGINE=InnoDB;


-- =============================================================================
-- 10. YOUTUBE VIDEOS  (brief: "Embed videos + show latest uploads")
-- =============================================================================
CREATE TABLE youtube_videos (
                                id            BIGINT       AUTO_INCREMENT PRIMARY KEY,
                                video_id      VARCHAR(50)  NOT NULL UNIQUE,    -- YouTube's own ID
                                title         VARCHAR(255) NULL,
                                description   TEXT         NULL,
                                thumbnail_url VARCHAR(500) NULL,
                                published_at  TIMESTAMP    NULL,
                                view_count    BIGINT       NULL,
                                featured      BOOLEAN      NOT NULL DEFAULT FALSE,
                                display_order INT          NOT NULL DEFAULT 0,
                                created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
                                    ON UPDATE CURRENT_TIMESTAMP,

                                INDEX idx_yt_published (published_at),
                                INDEX idx_yt_featured  (featured)
) ENGINE=InnoDB;

-- Sample services (brief: "2 main paid services")
INSERT INTO services (title, slug, short_description, description, benefits, price, currency, display_order)
VALUES
    ('Service One', 'service-one',
     'Short tagline for the first paid service.',
     'Full description of the first service goes here.',
     '- Benefit 1\n- Benefit 2\n- Benefit 3',
     99.00, 'USD', 1),
    ('Service Two', 'service-two',
     'Short tagline for the second paid service.',
     'Full description of the second service goes here.',
     '- Benefit 1\n- Benefit 2\n- Benefit 3',
     149.00, 'USD', 2);
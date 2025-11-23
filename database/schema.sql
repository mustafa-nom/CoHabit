-- CoHabit Database Schema
-- MySQL Database Creation Script
-- Created for MySQL Workbench

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS cohabit_db;
-- USE cohabit_db;

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS user_stats;
DROP TABLE IF EXISTS task_completions;
DROP TABLE IF EXISTS task_assignments;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS households;
DROP TABLE IF EXISTS verification_codes;
DROP TABLE IF EXISTS password_reset;
DROP TABLE IF EXISTS auth_log;
DROP TABLE IF EXISTS users;

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    fname VARCHAR(100),
    lname VARCHAR(100),
    total_xp INT DEFAULT 0,
    level INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. AUTH_LOG TABLE
-- ============================================
CREATE TABLE auth_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    attempt_type VARCHAR(50) NOT NULL, -- 'LOGIN', 'LOGOUT', 'FAILED_LOGIN', etc.
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    username_attempted VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_timestamp (timestamp)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. PASSWORD_RESET TABLE
-- ============================================
CREATE TABLE password_reset (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. VERIFICATION_CODES TABLE
-- ============================================
CREATE TABLE verification_codes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    code VARCHAR(10) NOT NULL,
    contact_info VARCHAR(255) NOT NULL, -- email or phone
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_code (code),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. HOUSEHOLDS TABLE
-- ============================================
CREATE TABLE households (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(500),
    description TEXT,
    invite_code VARCHAR(50) NOT NULL UNIQUE,
    creator_id BIGINT NOT NULL,
    time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_invite_code (invite_code),
    INDEX idx_creator_id (creator_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. MEMBERS TABLE
-- ============================================
CREATE TABLE members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    household_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role ENUM('MEMBER', 'ADMIN', 'OWNER') DEFAULT 'MEMBER',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_membership (household_id, user_id),
    INDEX idx_household_id (household_id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. REQUESTS TABLE
-- ============================================
CREATE TABLE requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    household_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    status INT DEFAULT 0, -- 0: pending, 1: accepted, -1: rejected
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    joined_at TIMESTAMP NULL,
    responded_by_userID BIGINT,
    FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (responded_by_userID) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_request (household_id, user_id),
    INDEX idx_household_id (household_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. TASKS TABLE
-- ============================================
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    household_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    difficulty VARCHAR(20) DEFAULT 'MEDIUM', -- 'EASY', 'MEDIUM', 'HARD'
    xp_points INT NOT NULL DEFAULT 20, -- 10, 20, 30 based on difficulty but editable
    status VARCHAR(20) DEFAULT 'OPEN', -- 'OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED'
    due_date TIMESTAMP NULL,
    recurrence_rule VARCHAR(50) DEFAULT 'NONE', -- 'NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM'
    is_free_for_all BOOLEAN DEFAULT FALSE,
    rotate_assignments BOOLEAN DEFAULT FALSE,
    estimated_time VARCHAR(50),
    created_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_household_status (household_id, status),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status),
    INDEX idx_created_by (created_by_user_id)
    -- Constraint: due_date and recurrence_rule should not both be NULL (at least one should be set)
    -- This is handled at application level
    -- Note: CHECK constraints require MySQL 8.0.16+. If you have an older version, comment out the next 3 lines
    -- CONSTRAINT chk_task_schedule CHECK (
    --     (due_date IS NOT NULL) OR (recurrence_rule IS NOT NULL AND recurrence_rule != 'NONE')
    -- )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. TASK_ASSIGNMENTS TABLE
-- ============================================
CREATE TABLE task_assignments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT NOT NULL,
    assignee_user_id BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- 'ACTIVE', 'SWAP_REQUESTED', 'SWAPPED', 'CANCELED'
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_assignment (task_id, assignee_user_id),
    INDEX idx_task_id (task_id),
    INDEX idx_assignee (assignee_user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. TASK_COMPLETIONS TABLE
-- ============================================
CREATE TABLE task_completions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    task_id BIGINT NOT NULL,
    completed_by_user_id BIGINT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo_url VARCHAR(500),
    notes TEXT,
    verification_status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'VERIFIED', 'REJECTED', 'AUTO_APPROVED'
    verified_by_user_id BIGINT,
    verified_at TIMESTAMP NULL,
    xp_awarded INT DEFAULT 0,
    bonus_xp INT DEFAULT 0, -- bonus for photo verification
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (completed_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (verified_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_task_id (task_id),
    INDEX idx_completed_by (completed_by_user_id),
    INDEX idx_verification_status (verification_status),
    INDEX idx_completed_at (completed_at)
    -- Constraint: verifier should not be the same as completer (enforced at app level)
    -- Note: CHECK constraints require MySQL 8.0.16+. If you have an older version, comment out the next 3 lines
    -- CONSTRAINT chk_verifier_different CHECK (
    --     verified_by_user_id IS NULL OR verified_by_user_id != completed_by_user_id
    -- )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 11. USER_STATS TABLE
-- ============================================
CREATE TABLE user_stats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    household_id BIGINT NOT NULL,
    tasks_completed_total INT DEFAULT 0,
    tasks_completed_this_week INT DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage
    total_xp INT DEFAULT 0,
    weekly_xp INT DEFAULT 0,
    week_start_date DATE,
    is_top_performer BOOLEAN DEFAULT FALSE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_household (user_id, household_id),
    INDEX idx_user_id (user_id),
    INDEX idx_household_id (household_id),
    INDEX idx_week_start (week_start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 12. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    household_id BIGINT,
    type VARCHAR(50) NOT NULL, -- 'TASK_ASSIGNED', 'TASK_DUE', 'TASK_COMPLETED', 'REQUEST_APPROVED', etc.
    title VARCHAR(200),
    message TEXT,
    related_task_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    scheduled_for TIMESTAMP NULL, -- custom alert times
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
    FOREIGN KEY (related_task_id) REFERENCES tasks(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_household_id (household_id),
    INDEX idx_is_read (is_read),
    INDEX idx_scheduled_for (scheduled_for),
    INDEX idx_sent_at (sent_at),
    -- Partial index for unsent notifications (MySQL doesn't support partial indexes directly,
    -- but we can create a regular index and filter in queries)
    INDEX idx_unsent_notifications (scheduled_for, sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- ============================================

-- Indexes for task queries
-- Note: idx_tasks_household_status already created in table definition
-- Note: idx_tasks_due_date already created in table definition
-- MySQL doesn't support partial indexes with WHERE clauses, so we use regular indexes

-- Indexes for completions
-- Note: These indexes are already created in the table definitions above
-- CREATE INDEX idx_completions_task_verdict ON task_completions(task_id, verification_status);
-- CREATE INDEX idx_completions_user_date ON task_completions(completed_by_user_id, completed_at);

-- Indexes for chat (if you add chat_message table later)
-- CREATE INDEX idx_chat_household_date ON chat_message(household_id, created_at DESC);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment to add sample data for testing

/*
-- Sample User
INSERT INTO users (email, username, password_hash, display_name, fname, lname, total_xp, level)
VALUES ('test@example.com', 'testuser', '$2y$10$example_hash', 'Test User', 'Test', 'User', 0, 1);

-- Sample Household
INSERT INTO households (name, address, description, invite_code, creator_id)
VALUES ('Test Household', '123 Test St', 'A test household', 'TEST123', 1);
*/


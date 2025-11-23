-- Quick Setup Script for CoHabit Database
-- Run this script first to create the database, then run schema.sql

-- Create database
CREATE DATABASE IF NOT EXISTS cohabit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE cohabit_db;

-- Show current database
SELECT DATABASE() AS 'Current Database';

-- Note: After running this, execute the schema.sql file to create all tables


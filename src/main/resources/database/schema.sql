CREATE DATABASE IF NOT EXISTS all_in_one;
USE all_in_one;

-- Create Users Table
CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Service Requests Table
CREATE TABLE service_requests (
                                  id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                  user_id BIGINT,
                                  service_type VARCHAR(100),
                                  status VARCHAR(50) DEFAULT 'PENDING',
                                  description TEXT,
                                  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create Projects (Portfolio) Table
CREATE TABLE projects (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          title VARCHAR(150),
                          description TEXT,
                          image_url VARCHAR(255),
                          link VARCHAR(255)
);

-- Create Messages Table
CREATE TABLE messages (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          sender_name VARCHAR(100),
                          sender_email VARCHAR(100),
                          content TEXT,
                          sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Blogs Table
CREATE TABLE blogs (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       title VARCHAR(200),
                       content TEXT,
                       category VARCHAR(100),
                       published_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);  
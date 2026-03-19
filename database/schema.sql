DROP DATABASE IF EXISTS mindalert_db;
CREATE DATABASE mindalert_db;
USE mindalert_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

CREATE TABLE user_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    sleep_hours FLOAT NOT NULL,
    study_hours FLOAT NOT NULL,
    screen_time FLOAT NOT NULL,
    stress_level INT NOT NULL,
    fatigue_result VARCHAR(50) NOT NULL,
    recommendation TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

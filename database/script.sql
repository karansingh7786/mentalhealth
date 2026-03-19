CREATE DATABASE mindalert_db;

USE mindalert_db;

CREATE TABLE user_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sleep_hours FLOAT,
    study_hours FLOAT,
    screen_time FLOAT,
    stress_level INT,
    fatigue_result VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
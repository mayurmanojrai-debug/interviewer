-- INTERVIEWIQ MySQL schema (schema.sql)
-- Create database first: CREATE DATABASE IF NOT EXISTS interviewiq;
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
  target_role VARCHAR(80) DEFAULT 'Full Stack Developer',
  experience_level VARCHAR(30) DEFAULT 'Intermediate',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_email (email)
);
CREATE TABLE IF NOT EXISTS questions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  question_text TEXT NOT NULL,
  category VARCHAR(60) NOT NULL,
  job_role VARCHAR(80) NOT NULL,
  difficulty VARCHAR(20) NOT NULL DEFAULT 'Medium',
  expected_keywords TEXT,
  ideal_answer TEXT,
  active BOOLEAN DEFAULT TRUE,
  INDEX idx_q_role (job_role), INDEX idx_q_diff (difficulty)
);
CREATE TABLE IF NOT EXISTS interviews (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  job_role VARCHAR(80) NOT NULL,
  experience_level VARCHAR(30) DEFAULT 'Intermediate',
  difficulty VARCHAR(20) DEFAULT 'Adaptive AI',
  interview_type VARCHAR(30) DEFAULT 'Mixed',
  total_questions INT DEFAULT 5,
  overall_score DOUBLE DEFAULT 0,
  technical_score DOUBLE DEFAULT 0,
  communication_score DOUBLE DEFAULT 0,
  problem_solving_score DOUBLE DEFAULT 0,
  confidence_score DOUBLE DEFAULT 0,
  duration_seconds INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'IN_PROGRESS',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_int_user (user_id), INDEX idx_int_created (created_at)
);
CREATE TABLE IF NOT EXISTS answers (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  interview_id BIGINT NOT NULL,
  question_id BIGINT,
  question_text TEXT,
  answer_text MEDIUMTEXT,
  score DOUBLE DEFAULT 0,
  technical_score DOUBLE DEFAULT 0,
  relevance_score DOUBLE DEFAULT 0,
  completeness_score DOUBLE DEFAULT 0,
  clarity_score DOUBLE DEFAULT 0,
  feedback TEXT,
  strengths TEXT,
  weaknesses TEXT,
  difficulty_at_time VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (interview_id) REFERENCES interviews(id) ON DELETE CASCADE,
  INDEX idx_ans_int (interview_id)
);
CREATE TABLE IF NOT EXISTS skills (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  category VARCHAR(60),
  description VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS user_skills (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  skill_id BIGINT NOT NULL,
  current_score DOUBLE DEFAULT 0,
  target_score DOUBLE DEFAULT 90,
  gap_score DOUBLE DEFAULT 0,
  UNIQUE KEY uq_user_skill (user_id, skill_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS roadmaps (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  skill_id BIGINT,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  priority INT DEFAULT 1,
  progress INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'PENDING',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS resumes (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  file_name VARCHAR(200),
  extracted_text MEDIUMTEXT,
  resume_score INT DEFAULT 0,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS achievements (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  achievement_name VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

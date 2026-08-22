-- PostgreSQL Schema for Islamic Studies Family LMS
-- Run this script to provision tables when deploying to AWS RDS, Supabase, Neon, or Railway PostgreSQL.

CREATE TABLE IF NOT EXISTS users (
  uid VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(120) NOT NULL,
  role VARCHAR(32) DEFAULT 'parent' NOT NULL,
  provider VARCHAR(32) DEFAULT 'password' NOT NULL,
  photo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE NOT NULL,
  verification_token VARCHAR(128),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS children (
  id VARCHAR(64) PRIMARY KEY,
  parent_uid VARCHAR(64) REFERENCES users(uid) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  avatar VARCHAR(32) DEFAULT '🌟',
  assigned_track VARCHAR(32) DEFAULT 'level1' NOT NULL,
  pin_hash VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_children_parent ON children(parent_uid);

CREATE TABLE IF NOT EXISTS quiz_results (
  id VARCHAR(64) PRIMARY KEY,
  user_uid VARCHAR(64) REFERENCES users(uid) ON DELETE SET NULL,
  child_id VARCHAR(64) REFERENCES children(id) ON DELETE SET NULL,
  module_id INT NOT NULL,
  track VARCHAR(32) NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  percentage INT NOT NULL,
  passed BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quiz_results_user ON quiz_results(user_uid);
CREATE INDEX IF NOT EXISTS idx_quiz_results_child ON quiz_results(child_id);

CREATE TABLE IF NOT EXISTS module_progress (
  id SERIAL PRIMARY KEY,
  target_key VARCHAR(64) NOT NULL, -- 'user_<uid>' or 'child_<childId>'
  module_id INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (target_key, module_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_target ON module_progress(target_key);

CREATE TABLE IF NOT EXISTS certificates (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  module_id INT NOT NULL,
  score INT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_id);

CREATE TABLE IF NOT EXISTS reflections (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  module_id INT NOT NULL,
  question_id VARCHAR(64) NOT NULL,
  response_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reflections_student ON reflections(student_id);

CREATE TABLE IF NOT EXISTS reset_tokens (
  token VARCHAR(128) PRIMARY KEY,
  uid VARCHAR(64) NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  expires_at BIGINT NOT NULL,
  used INT DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reset_token ON reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_reset_expires ON reset_tokens(expires_at, used);

CREATE TABLE IF NOT EXISTS telemetry_logs (
  id SERIAL PRIMARY KEY,
  message TEXT,
  source VARCHAR(128),
  stack TEXT,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_telemetry_created ON telemetry_logs(created_at);

CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  actor_uid VARCHAR(64) NOT NULL,
  action VARCHAR(64) NOT NULL,
  target_uid VARCHAR(64),
  metadata TEXT,
  ip_address VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_log(actor_uid);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);

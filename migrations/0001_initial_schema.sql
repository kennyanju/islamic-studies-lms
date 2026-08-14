-- Cloudflare D1 Initial Database Migration for Islamic Studies LMS
-- Run with: npx wrangler d1 migrations apply islamic-studies-db --remote

CREATE TABLE IF NOT EXISTS users (
  uid TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'parent',
  is_verified INTEGER DEFAULT 1,
  provider TEXT DEFAULT 'local',
  password_hash TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS children (
  id TEXT PRIMARY KEY,
  parent_uid TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT DEFAULT '🌟',
  assigned_track TEXT DEFAULT 'level1',
  pin_hash TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_uid) REFERENCES users(uid) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS module_progress (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  level TEXT NOT NULL,
  completed INTEGER DEFAULT 1,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_results (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  level TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  percentage REAL NOT NULL,
  passed INTEGER DEFAULT 0,
  answers_json TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS telemetry_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message TEXT,
  source TEXT,
  stack TEXT,
  url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Initial Indexes for high-speed edge lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_children_parent ON children(parent_uid);
CREATE INDEX IF NOT EXISTS idx_progress_student ON module_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_quiz_student ON quiz_results(student_id);

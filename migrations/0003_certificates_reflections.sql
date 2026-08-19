-- Migration 0003: Certificates and Reflections tables
-- Run this script to update existing D1/SQLite databases

CREATE TABLE IF NOT EXISTS certificates (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_certificates_student ON certificates(student_id);

CREATE TABLE IF NOT EXISTS reflections (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  module_id INTEGER NOT NULL,
  question_id TEXT NOT NULL,
  response_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reflections_student ON reflections(student_id);

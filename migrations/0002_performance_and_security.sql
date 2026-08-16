-- Cloudflare D1 Migration 0002: Performance, Security & Audit Logging
-- Adds indexes on high-frequency query fields, soft-delete columns, and audit log table

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_reset_expires ON reset_tokens(expires_at, used);
CREATE INDEX IF NOT EXISTS idx_quiz_module ON quiz_results(module_id, level);
CREATE INDEX IF NOT EXISTS idx_telemetry_created ON telemetry_logs(created_at);

-- Audit Log Table for Administrative & Security Events
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_uid TEXT NOT NULL,
  action TEXT NOT NULL,
  target_uid TEXT,
  metadata TEXT,
  ip_address TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_log(actor_uid);
CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);

-- Migration 0006: High-Performance Compound & Foreign Key Indexes
-- Eliminates full table scans on parent-child, student-progress, and quiz history lookups

CREATE INDEX IF NOT EXISTS idx_children_parent ON children(parent_uid);
CREATE INDEX IF NOT EXISTS idx_progress_student_mod ON module_progress(student_id, module_id);
CREATE INDEX IF NOT EXISTS idx_quiz_student_passed ON quiz_results(student_id, module_id, passed);
CREATE INDEX IF NOT EXISTS idx_quiz_student ON quiz_results(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_student ON module_progress(student_id);

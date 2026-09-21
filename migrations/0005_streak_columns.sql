-- Migration 0005: Streak tracking columns on children table
-- Adds last_study_date (ISO 8601 date string) and current_streak (integer day count)

ALTER TABLE children ADD COLUMN last_study_date TEXT;
ALTER TABLE children ADD COLUMN current_streak INTEGER DEFAULT 0;

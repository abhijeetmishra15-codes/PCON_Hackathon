-- Opportunities Module Migration
-- Adds missing fields and enum values safely without breaking existing RLS or records.

-- 1. Add 'part_time' to opportunity_type enum
ALTER TYPE opportunity_type ADD VALUE IF NOT EXISTS 'part_time';

-- 2. Add missing columns to opportunities table
ALTER TABLE opportunities 
  ADD COLUMN IF NOT EXISTS experience_level VARCHAR,
  ADD COLUMN IF NOT EXISTS application_deadline TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS salary_range VARCHAR,
  ADD COLUMN IF NOT EXISTS company_logo_url TEXT;

-- 3. Ensure RLS policies are intact (no change needed as they were already defined)
-- The existing policies on `opportunities` and `opportunity_skills` naturally extend to the new columns.

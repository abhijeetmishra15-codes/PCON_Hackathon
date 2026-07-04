-- Supabase Admin Setup Script
-- Run this in your Supabase SQL Editor

-- 1. Create the admins table
CREATE TABLE IF NOT EXISTS admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow admins to read their own record (to verify their admin status on the frontend)
CREATE POLICY "Admins can view their own record" 
ON admins 
FOR SELECT 
USING (auth.uid() = user_id);

-- Optional: If you want admins to be able to view the full list of other admins
-- CREATE POLICY "Admins can view all admins" 
-- ON admins 
-- FOR SELECT 
-- USING (
--     EXISTS (
--         SELECT 1 FROM admins a WHERE a.user_id = auth.uid()
--     )
-- );

-- 4. Utility Function to promote a user to admin (Optional, but helpful)
-- Usage: SELECT promote_to_admin('user-uuid-here');
CREATE OR REPLACE FUNCTION promote_to_admin(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges
AS $$
BEGIN
    INSERT INTO admins (user_id) 
    VALUES (target_user_id)
    ON CONFLICT (user_id) DO NOTHING;
END;
$$;

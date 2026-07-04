-- chat_rls_fix.sql
-- Fixes the infinite recursion error in the chat_participants RLS policy.

-- 1. Create a SECURITY DEFINER function to bypass RLS when checking room membership
CREATE OR REPLACE FUNCTION get_my_chat_rooms()
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT room_id FROM chat_participants WHERE user_id = auth.uid();
$$;

-- 2. Drop the recursive policy
DROP POLICY IF EXISTS "Users can view participants of their rooms" ON chat_participants;

-- 3. Recreate the policy using the safe function
CREATE POLICY "Users can view participants of their rooms" ON chat_participants 
FOR SELECT USING (
    room_id IN (SELECT get_my_chat_rooms())
);

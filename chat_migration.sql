-- chat_migration.sql
-- Adds an RPC to atomically create or fetch a direct chat room between two connected users.

-- 1. Create the RPC
CREATE OR REPLACE FUNCTION create_or_get_chat_room(other_user_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_room_id UUID;
    v_is_connected BOOLEAN;
BEGIN
    -- Safeguard 1: Reject unauthenticated users
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: You must be logged in to start a chat.' USING ERRCODE = 'P0001';
    END IF;

    -- Safeguard 2: Reject self-chat
    IF auth.uid() = other_user_id THEN
        RAISE EXCEPTION 'Invalid: You cannot start a chat with yourself.' USING ERRCODE = 'P0002';
    END IF;

    -- Safeguard 3: Verify the users are explicitly connected
    SELECT EXISTS (
        SELECT 1 FROM connections
        WHERE status = 'accepted'
        AND (
            (requester_id = auth.uid() AND addressee_id = other_user_id) OR
            (addressee_id = auth.uid() AND requester_id = other_user_id)
        )
    ) INTO v_is_connected;

    IF NOT v_is_connected THEN
        RAISE EXCEPTION 'Forbidden: You can only chat with accepted connections.' USING ERRCODE = 'P0003';
    END IF;

    -- Safeguard 4: Check if a direct room already exists
    SELECT cr.id INTO v_room_id
    FROM chat_rooms cr
    JOIN chat_participants cp1 ON cr.id = cp1.room_id
    JOIN chat_participants cp2 ON cr.id = cp2.room_id
    WHERE cr.type = 'direct'
      AND cp1.user_id = auth.uid()
      AND cp2.user_id = other_user_id
    LIMIT 1;

    -- Reuse existing room
    IF v_room_id IS NOT NULL THEN
        RETURN v_room_id;
    END IF;

    -- Safeguard 5: Atomically create room and participants
    INSERT INTO chat_rooms (type) VALUES ('direct') RETURNING id INTO v_room_id;
    
    INSERT INTO chat_participants (room_id, user_id) 
    VALUES 
        (v_room_id, auth.uid()),
        (v_room_id, other_user_id);

    RETURN v_room_id;
END;
$$;

-- 2. Restrict Execution
REVOKE EXECUTE ON FUNCTION create_or_get_chat_room(UUID) FROM public;
GRANT EXECUTE ON FUNCTION create_or_get_chat_room(UUID) TO authenticated;

import { supabase } from '../supabase';

export const ChatService = {
  /**
   * Fetch all conversations for a user.
   */
  async getConversations(userId) {
    if (!userId) return [];

    const { data, error } = await supabase
      .from('chat_rooms')
      .select(`
        id,
        type,
        created_at,
        participants:chat_participants!inner (
          user_id,
          profile:profiles (
            id,
            full_name,
            avatar_url,
            role
          )
        ),
        latest_message:chat_messages (
          id,
          content,
          created_at,
          sender_id
        )
      `)
      .order('created_at', { foreignTable: 'chat_messages', ascending: false })
      .limit(1, { foreignTable: 'chat_messages' });

    if (error) throw error;

    // We only want rooms where the current user is a participant.
    // The query above fetches all rooms where the user is a participant IF we filter it,
    // but we can't filter 'participants.user_id = userId' because then we wouldn't get the OTHER participant.
    // Instead, we fetch rooms, and we ensure the RLS handles filtering the rooms to only those the user is in.
    // RLS: "Users can view rooms they are in" guarantees this.

    // Post-process the data to make it easier for the UI
    const processed = (data || []).map(room => {
      // Find the *other* participant
      const otherParticipant = room.participants.find(p => p.user_id !== userId);
      const latestMsg = room.latest_message && room.latest_message.length > 0 ? room.latest_message[0] : null;

      return {
        id: room.id,
        type: room.type,
        created_at: room.created_at,
        other_user: otherParticipant?.profile || null,
        latest_message: latestMsg,
        updated_at: latestMsg ? latestMsg.created_at : room.created_at
      };
    });

    // Sort by updated_at descending
    return processed.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  },

  /**
   * Fetch paginated messages for a room.
   */
  async getMessages(roomId, limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        id,
        room_id,
        sender_id,
        content,
        created_at,
        sender:profiles!chat_messages_sender_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Return in chronological order (oldest first for chat view)
    return (data || []).reverse();
  },

  /**
   * Send a new message.
   */
  async sendMessage(roomId, senderId, content) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([
        {
          room_id: roomId,
          sender_id: senderId,
          content: content.trim()
        }
      ])
      .select(`
        id,
        room_id,
        sender_id,
        content,
        created_at,
        sender:profiles!chat_messages_sender_id_fkey (
          id,
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create or get a direct chat room with another user.
   * This uses the custom RPC added via chat_migration.sql.
   */
  async createOrGetRoom(otherUserId) {
    const { data, error } = await supabase
      .rpc('create_or_get_chat_room', {
        other_user_id: otherUserId
      });

    if (error) throw error;
    return data; // Returns the UUID of the room
  }
};

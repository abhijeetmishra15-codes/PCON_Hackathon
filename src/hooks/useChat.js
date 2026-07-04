import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChatService } from '../lib/services/chat.service';
import { supabase } from '../lib/supabase';

export function useChat() {
  const { user } = useAuth();
  
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({}); // Indexed by roomId
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all conversations for the current user.
   */
  const fetchConversations = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoadingConversations(true);
      const data = await ChatService.getConversations(user.id);
      setConversations(data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError(err.message);
    } finally {
      setLoadingConversations(false);
    }
  }, [user]);

  /**
   * Fetch messages for a specific room.
   */
  const fetchMessages = useCallback(async (roomId) => {
    if (!roomId) return;
    try {
      setLoadingMessages(true);
      const data = await ChatService.getMessages(roomId);
      setMessages(prev => ({ ...prev, [roomId]: data }));
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err.message);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  /**
   * Send a message to the active room.
   */
  const sendMessage = async (roomId, content) => {
    if (!user?.id || !content.trim()) return;
    
    // Optimistic UI update
    const tempMessage = {
      id: `temp-${Date.now()}`,
      room_id: roomId,
      sender_id: user.id,
      content: content.trim(),
      created_at: new Date().toISOString(),
      sender: {
        id: user.id,
        // UI fallback, actual avatar not strictly needed for optimistic sender
        full_name: 'Sending...' 
      }
    };
    
    setMessages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), tempMessage]
    }));

    try {
      const data = await ChatService.sendMessage(roomId, user.id, content);
      
      // Replace optimistic message with actual data
      setMessages(prev => ({
        ...prev,
        [roomId]: (prev[roomId] || []).map(msg => msg.id === tempMessage.id ? data : msg)
      }));
      
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      // Remove optimistic message on error
      setMessages(prev => ({
        ...prev,
        [roomId]: (prev[roomId] || []).filter(msg => msg.id !== tempMessage.id)
      }));
      throw err;
    }
  };

  /**
   * Start a chat with a specific user
   */
  const startChat = async (otherUserId) => {
    if (!user?.id) return null;
    try {
      setError(null);
      const roomId = await ChatService.createOrGetRoom(otherUserId);
      await fetchConversations(); // Refresh conversation list
      return roomId;
    } catch (err) {
      console.error('Error starting chat:', err);
      setError(err.message);
      throw err;
    }
  };

  /**
   * Realtime Subscriptions
   */
  useEffect(() => {
    if (!user?.id) return;

    // We subscribe to all new chat messages globally to update the conversation list dynamically
    // And to update the active chat window if we are in it.
    const channel = supabase.channel('chat-global')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'chat_messages' 
      }, async (payload) => {
        const newMessage = payload.new;
        
        // Only process if it belongs to one of our conversations
        setConversations(prevConvos => {
          const convoExists = prevConvos.some(c => c.id === newMessage.room_id);
          
          if (!convoExists) {
            // A brand new conversation was started by someone else. Re-fetch conversations.
            fetchConversations();
            return prevConvos;
          }

          // Update the latest_message in the conversation list
          return prevConvos.map(c => {
            if (c.id === newMessage.room_id) {
              return {
                ...c,
                latest_message: newMessage,
                updated_at: newMessage.created_at
              };
            }
            return c;
          }).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        });

        // If this message belongs to any room we have loaded in state, append it
        // (but check we didn't already append it via optimistic update)
        setMessages(prevMessages => {
          const roomMsgs = prevMessages[newMessage.room_id];
          if (!roomMsgs) return prevMessages;

          // Check if it's already there (optimistic update replacement handles our own sends, 
          // but just in case, verify by ID)
          if (roomMsgs.some(m => m.id === newMessage.id)) return prevMessages;

          // We need the sender profile to render it properly. 
          // For realtime inserts, profile data is missing. We should ideally fetch it, 
          // but as a fallback we can just fetch the single message or reload the room messages.
          // To keep it simple and robust, we fetch the newly inserted message with its joins.
          
          supabase
            .from('chat_messages')
            .select(`
              id, room_id, sender_id, content, created_at,
              sender:profiles!chat_messages_sender_id_fkey (id, full_name, avatar_url)
            `)
            .eq('id', newMessage.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setMessages(curr => ({
                  ...curr,
                  [data.room_id]: [...(curr[data.room_id] || []), data]
                }));
              }
            });

          return prevMessages;
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchConversations]);

  return {
    conversations,
    messages,
    activeRoomId,
    setActiveRoomId,
    loadingConversations,
    loadingMessages,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    startChat
  };
}

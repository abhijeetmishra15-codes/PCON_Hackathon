import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';
import { Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedRoomId = searchParams.get('room');

  const {
    conversations,
    messages,
    activeRoomId,
    setActiveRoomId,
    loadingConversations,
    loadingMessages,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage
  } = useChat();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    if (requestedRoomId && conversations.length > 0) {
      // Verify requested room is in our list
      const roomExists = conversations.some(c => c.id === requestedRoomId);
      if (roomExists) {
        setActiveRoomId(requestedRoomId);
      }
      // Remove query param to clean up URL
      setSearchParams({}, { replace: true });
    }
  }, [requestedRoomId, conversations, setActiveRoomId, setSearchParams]);

  useEffect(() => {
    if (activeRoomId && !messages[activeRoomId]) {
      fetchMessages(activeRoomId);
    }
  }, [activeRoomId, fetchMessages, messages]);

  const handleSelectRoom = (roomId) => {
    setActiveRoomId(roomId);
  };

  const activeRoom = activeRoomId ? conversations.find(c => c.id === activeRoomId) : null;

  return (
    <div className="h-[calc(100vh-6rem)] -mt-2 -mx-2 sm:-mx-0 sm:-mt-0 flex flex-col sm:flex-row gap-4">
      {/* Sidebar / Conversation list */}
      <div className={cn(
        "flex-shrink-0 w-full sm:w-[320px] lg:w-[360px] flex flex-col rounded-[22px] overflow-hidden",
        "bg-gradient-to-b from-white to-[#FAFAF8]",
        "border border-[rgba(0,0,0,0.052)]",
        "shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_20px_rgba(0,0,0,0.04)]",
        activeRoomId ? "hidden sm:flex" : "flex"
      )}>
        <div className="p-5 flex-shrink-0" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
          <h2 className="text-[20px] font-bold text-text-main" style={{ letterSpacing: '-0.025em' }}>Messages</h2>
        </div>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          {error && !loadingConversations ? (
            <div className="p-4 m-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-sm">
              {error}
            </div>
          ) : (
            <ConversationList 
              conversations={conversations} 
              activeRoomId={activeRoomId}
              onSelectRoom={handleSelectRoom}
              loading={loadingConversations}
            />
          )}
        </div>
      </div>

      {/* Chat Window */}
      <div className={cn(
        "flex-1 flex flex-col rounded-[22px] overflow-hidden",
        "bg-gradient-to-b from-white to-[#FAFAF8]",
        "border border-[rgba(0,0,0,0.052)]",
        "shadow-[0_1px_2px_rgba(0,0,0,0.03),0_4px_20px_rgba(0,0,0,0.04)]",
        !activeRoomId ? "hidden sm:flex" : "flex"
      )}>
        {activeRoomId && (
          <div className="sm:hidden p-3 border-b border-white/5 bg-secondary/50">
            <button 
              onClick={() => setActiveRoomId(null)}
              className="text-primary text-sm font-medium hover:underline"
            >
              &larr; Back to Messages
            </button>
          </div>
        )}
        <ChatWindow 
          room={activeRoom} 
          messages={messages[activeRoomId]}
          loading={loadingMessages}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
}

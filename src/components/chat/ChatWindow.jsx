import React, { useEffect, useRef } from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { EmptyState, Avatar } from '../ui';

export default function ChatWindow({ 
  room, 
  messages, 
  loading, 
  onSendMessage 
}) {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <EmptyState
          icon={MessageCircle}
          title="Select a conversation"
          message="Choose a connection from the list to start chatting."
        />
      </div>
    );
  }

  const otherUser = room.other_user;

  return (
    <div className="flex-1 flex flex-col h-full relative" style={{ background: 'linear-gradient(to bottom, #ffffff, #FAFAF8)' }}>
      {/* Header */}
      <div className="flex items-center gap-3.5 px-5 py-4 flex-shrink-0"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(250,250,248,0.90)' }}>
        <Avatar
          src={otherUser?.avatar_url}
          alt={otherUser?.full_name}
          size="md"
        />
        <div>
          <h3 className="font-bold text-text-main text-[14.5px]" style={{ letterSpacing: '-0.02em' }}>{otherUser?.full_name}</h3>
          <p className="text-[11.5px] text-text-secondary/60 capitalize font-medium mt-0.5">{otherUser?.role}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-1 relative">
        {loading && (!messages || messages.length === 0) ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : messages?.length > 0 ? (
          messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              isOwn={msg.sender_id === user.id} 
            />
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <MessageCircle className="w-12 h-12 text-primary/40 mb-3" />
            <h4 className="text-text-main font-medium mb-1">No messages yet</h4>
            <p className="text-sm text-text-muted">Say hello to {otherUser?.full_name}!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <MessageInput 
        onSend={(content) => onSendMessage(room.id, content)} 
        disabled={loading && (!messages || messages.length === 0)}
      />
    </div>
  );
}

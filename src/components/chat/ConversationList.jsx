import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Avatar, EmptyState, LoadingSkeleton } from '../ui';
import { cn } from '../../utils/cn';

function formatDistanceToNow(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return Math.floor(seconds) + ' seconds ago';
}

export default function ConversationList({ 
  conversations, 
  activeRoomId, 
  onSelectRoom, 
  loading 
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <LoadingSkeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <LoadingSkeleton className="h-4 w-24 mb-2" />
              <LoadingSkeleton className="h-3 w-40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!conversations?.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <EmptyState
          icon={MessageCircle}
          title="No messages yet"
          message="When you start a chat with your connections, it will appear here."
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden">
      {conversations.map((room, index) => {
        const otherUser = room.other_user;
        if (!otherUser) return null;

        const isActive = activeRoomId === room.id;
        const lastMsg = room.latest_message;

        return (
          <motion.button
            key={room.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            onClick={() => onSelectRoom(room.id)}
            className={cn(
              "w-full text-left p-4 flex items-center gap-3 transition-colors duration-200 border-b border-white/5",
              "hover:bg-white/5",
              isActive && "bg-white/10"
            )}
          >
            <Avatar 
              src={otherUser.avatar_url} 
              alt={otherUser.full_name} 
              size="lg" 
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-semibold text-text-main truncate pr-2">
                  {otherUser.full_name}
                </h4>
                {lastMsg && (
                  <span className="text-xs text-text-muted whitespace-nowrap">
                    {formatDistanceToNow(new Date(lastMsg.created_at))}
                  </span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-text-secondary truncate">
                  {lastMsg ? lastMsg.content : "Start the conversation"}
                </p>
                {/* Unread badge would go here if supported */}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

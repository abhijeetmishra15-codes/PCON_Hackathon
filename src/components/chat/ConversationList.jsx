import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { Avatar, EmptyState, LoadingSkeleton } from '../ui';
import { cn } from '../../utils/cn';

function formatDistanceToNow(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm';
  return 'now';
}

export default function ConversationList({ conversations, activeRoomId, onSelectRoom, loading }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-1.5 p-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-[14px]">
            <LoadingSkeleton className="w-11 h-11 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <LoadingSkeleton className="h-3.5 w-28" />
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
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-2">
      {conversations.map((room, index) => {
        const otherUser = room.other_user;
        if (!otherUser) return null;

        const isActive = activeRoomId === room.id;
        const lastMsg = room.latest_message;

        return (
          <motion.button
            key={room.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18, delay: index * 0.04 }}
            onClick={() => onSelectRoom(room.id)}
            className={cn(
              'w-full text-left px-3.5 py-3 flex items-center gap-3 rounded-[14px] transition-all duration-[160ms] mb-0.5',
              isActive
                ? 'bg-primary/[0.09] border border-primary/[0.12]'
                : 'hover:bg-[rgba(0,0,0,0.04)] border border-transparent'
            )}
          >
            <Avatar
              src={otherUser.avatar_url}
              alt={otherUser.full_name}
              size="md"
              className="shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <h4 className={cn(
                  'text-[13.5px] truncate pr-2 leading-tight',
                  isActive ? 'font-bold text-primary' : 'font-semibold text-text-main'
                )}>
                  {otherUser.full_name}
                </h4>
                {lastMsg && (
                  <span className="text-[11px] text-text-secondary/50 whitespace-nowrap font-medium">
                    {formatDistanceToNow(new Date(lastMsg.created_at))}
                  </span>
                )}
              </div>

              <p className={cn(
                'text-[12px] truncate leading-relaxed',
                isActive ? 'text-primary/70' : 'text-text-secondary/70'
              )}>
                {lastMsg ? lastMsg.content : 'Start the conversation'}
              </p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

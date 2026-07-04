import React from 'react';
import { Avatar } from '../ui';
import { cn } from '../../utils/cn';

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={cn(
      "flex w-full mb-4",
      isOwn ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "flex max-w-[75%] md:max-w-[60%] gap-2",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}>
        {!isOwn && message.sender && (
          <div className="flex-shrink-0 mt-auto">
            <Avatar 
              src={message.sender.avatar_url} 
              alt={message.sender.full_name} 
              size="sm" 
            />
          </div>
        )}
        
        <div className={cn(
          "flex flex-col",
          isOwn ? "items-end" : "items-start"
        )}>
          <div className={cn(
            "px-4 py-2.5 rounded-2xl relative",
            isOwn 
              ? "bg-primary text-primary-content rounded-br-sm" 
              : "bg-white/10 backdrop-blur-md border border-white/10 text-text-main rounded-bl-sm"
          )}>
            <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
              {message.content}
            </p>
          </div>
          <span className="text-[11px] text-text-muted mt-1 px-1">
            {new Date(message.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </span>
        </div>
      </div>
    </div>
  );
}

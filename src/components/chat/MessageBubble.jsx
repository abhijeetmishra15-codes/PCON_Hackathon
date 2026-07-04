import React from 'react';
import { Avatar } from '../ui';
import { cn } from '../../utils/cn';

export default function MessageBubble({ message, isOwn }) {
  return (
    <div className={cn('flex w-full mb-5', isOwn ? 'justify-end' : 'justify-start')}>
      <div className={cn(
        'flex max-w-[75%] md:max-w-[58%] gap-2.5',
        isOwn ? 'flex-row-reverse' : 'flex-row'
      )}>
        {!isOwn && message.sender && (
          <div className="flex-shrink-0 mt-auto mb-5">
            <Avatar
              src={message.sender.avatar_url}
              alt={message.sender.full_name}
              size="sm"
              className="w-7 h-7"
            />
          </div>
        )}

        <div className={cn('flex flex-col', isOwn ? 'items-end' : 'items-start')}>
          <div className={cn(
            'px-4 py-3 relative leading-relaxed',
            isOwn
              ? [
                'text-white rounded-[18px] rounded-br-[5px]',
                'shadow-[0_2px_12px_rgba(245,158,11,0.28)]',
              ].join(' ')
              : [
                'bg-white border border-[rgba(0,0,0,0.07)] text-text-main rounded-[18px] rounded-bl-[5px]',
                'shadow-[0_1px_4px_rgba(0,0,0,0.04),0_2px_12px_rgba(0,0,0,0.03)]',
              ].join(' ')
          )}
            style={isOwn ? {
              background: 'linear-gradient(145deg, #FBBF24, #F59E0B)',
            } : {}}>
            <p className="whitespace-pre-wrap break-words text-[14px] leading-[1.55]">
              {message.content}
            </p>
          </div>
          <span className="text-[10.5px] text-text-secondary/45 mt-1.5 px-1 font-medium">
            {new Date(message.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          </span>
        </div>
      </div>
    </div>
  );
}

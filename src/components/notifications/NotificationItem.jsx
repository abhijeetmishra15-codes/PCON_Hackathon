import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, CheckCircle, XCircle, Briefcase, Calendar, MessageSquare, Trash2, Bell } from 'lucide-react';
import { Avatar } from '../ui';
import { formatRelativeTime } from '../../utils/date';
import { cn } from '../../utils/cn';

export default function NotificationItem({ notification, onMarkAsRead, onDelete, onClosePopover }) {
  const navigate = useNavigate();
  
  const {
    id,
    action_type,
    entity_type,
    entity_id,
    content,
    is_read,
    created_at,
    actor
  } = notification;

  // Determine icon and colors based on action type
  const getIconConfig = () => {
    switch (action_type) {
      case 'connection_request':
        return { Icon: UserPlus, color: 'text-blue-500', bg: 'bg-blue-500/10' };
      case 'connection_accepted':
        return { Icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' };
      case 'referral_request':
        return { Icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' };
      case 'referral_approved':
        return { Icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' };
      case 'referral_rejected':
        return { Icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' };
      case 'referral_completed':
        return { Icon: Briefcase, color: 'text-green-500', bg: 'bg-green-500/10' };
      case 'event_registration':
        return { Icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-500/10' };
      default:
        return { Icon: Bell, color: 'text-gray-500', bg: 'bg-gray-500/10' };
    }
  };

  const { Icon, color, bg } = getIconConfig();

  // Determine destination URL
  const getDestinationUrl = () => {
    switch (entity_type) {
      case 'connection':
        return '/network';
      case 'referral':
        return '/referrals';
      case 'event':
        return '/events';
      default:
        return '#';
    }
  };

  const handleClick = (e) => {
    if (!is_read) {
      onMarkAsRead(id);
    }
    const url = getDestinationUrl();
    if (url !== '#') {
      navigate(url);
      if (onClosePopover) onClosePopover();
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative flex items-start gap-3 p-4 cursor-pointer transition-colors duration-200 border-b border-border/50 last:border-0",
        is_read ? "bg-transparent hover:bg-secondary/50" : "bg-primary/5 hover:bg-primary/10"
      )}
    >
      {/* Unread indicator */}
      {!is_read && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
      )}

      {/* Avatar or Icon */}
      <div className="relative shrink-0 mt-1">
        {actor ? (
          <Avatar src={actor.avatar_url} alt={actor.full_name} size="md" />
        ) : (
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", bg)}>
            <Icon size={18} className={color} />
          </div>
        )}
        
        {/* Overlay Icon for Actor Avatar */}
        {actor && (
          <div className={cn(
            "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white",
            bg
          )}>
            <Icon size={10} className={color} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="text-[13px] text-text-main leading-snug">
          {actor && <span className="font-semibold text-text-main">{actor.full_name} </span>}
          <span className="text-text-secondary">{content}</span>
        </div>
        <div className="text-[11px] text-text-secondary/70 mt-1.5 font-medium">
          {formatRelativeTime(created_at)}
        </div>
      </div>

      {/* Actions */}
      <button
        onClick={handleDelete}
        className="absolute right-3 top-4 p-1.5 text-text-secondary/50 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
        aria-label="Delete notification"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

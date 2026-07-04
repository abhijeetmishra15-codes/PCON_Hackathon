import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Bell } from 'lucide-react';
import NotificationItem from './NotificationItem';
import { useNotifications } from '../../hooks/useNotifications';
import { cn } from '../../utils/cn';

export default function NotificationDropdown({ onClose }) {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  // Show only up to 5 notifications in the dropdown
  const displayNotifications = notifications.slice(0, 5);

  return (
    <div className="w-[380px] bg-white rounded-2xl shadow-xl border border-border overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-text-main text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-[12px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            <Check size={14} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Content */}
      <div className="max-h-[360px] overflow-y-auto scrollbar-hide flex-1">
        {loading && notifications.length === 0 ? (
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-secondary shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
              <Bell size={24} className="text-text-secondary/50" />
            </div>
            <p className="text-sm font-medium text-text-main">No notifications yet</p>
            <p className="text-xs text-text-secondary mt-1">
              When you get notifications, they'll show up here
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {displayNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
                onClosePopover={onClose}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-2 border-t border-border bg-secondary/10">
          <Link
            to="/notifications"
            onClick={onClose}
            className="block w-full py-2 text-center text-[13px] font-medium text-text-main hover:text-primary transition-colors rounded-xl hover:bg-secondary/50"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}

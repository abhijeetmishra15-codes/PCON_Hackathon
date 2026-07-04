import React from 'react';
import { motion } from 'framer-motion';
import { Check, Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from '../components/notifications/NotificationItem';

export default function Notifications() {
  const {
    notifications,
    loading,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  // Group notifications by date
  const groupNotifications = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups = {
      Today: [],
      Yesterday: [],
      Earlier: []
    };

    notifications.forEach(notif => {
      const notifDate = new Date(notif.created_at);
      notifDate.setHours(0, 0, 0, 0);

      if (notifDate.getTime() === today.getTime()) {
        groups.Today.push(notif);
      } else if (notifDate.getTime() === yesterday.getTime()) {
        groups.Yesterday.push(notif);
      } else {
        groups.Earlier.push(notif);
      }
    });

    return groups;
  };

  const groupedNotifications = groupNotifications();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Notifications</h1>
          <p className="text-text-secondary mt-1 text-sm">Stay updated with your latest network activities.</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-sm font-medium text-text-secondary hover:text-primary hover:border-primary/30 transition-all duration-200 shadow-sm"
          >
            <Check size={16} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-border">
        {loading && notifications.length === 0 ? (
          <div className="p-8 space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-secondary shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-4 bg-secondary rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
              <Bell size={32} className="text-text-secondary/50" />
            </div>
            <h3 className="text-lg font-semibold text-text-main mb-2">You're all caught up!</h3>
            <p className="text-text-secondary max-w-md">
              When you get connection requests, event updates, or referrals, they will show up here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {Object.entries(groupedNotifications).map(([groupName, items]) => {
              if (items.length === 0) return null;
              
              return (
                <div key={groupName}>
                  <div className="px-6 py-3 bg-secondary/30 border-b border-border/50">
                    <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      {groupName}
                    </h4>
                  </div>
                  <div className="divide-y divide-border/50">
                    {items.map((notif, index) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <NotificationItem
                          notification={notif}
                          onMarkAsRead={markAsRead}
                          onDelete={deleteNotification}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More */}
        {hasMore && !loading && notifications.length > 0 && (
          <div className="p-4 border-t border-border flex justify-center">
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-secondary text-text-main font-medium rounded-xl hover:bg-secondary/80 transition-colors text-sm"
            >
              Load More
            </button>
          </div>
        )}
        
        {loading && notifications.length > 0 && (
          <div className="p-4 border-t border-border flex justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { notificationsService } from '../lib/services/notifications.service';

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  const limit = 20;

  const fetchInitialData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const [fetchedNotifications, count] = await Promise.all([
        notificationsService.getNotifications(user.id, limit, 0),
        notificationsService.getUnreadCount(user.id)
      ]);
      setNotifications(fetchedNotifications);
      setUnreadCount(count);
      setHasMore(fetchedNotifications.length === limit);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const loadMore = useCallback(async () => {
    if (!user || loading || !hasMore) return;
    try {
      setLoading(true);
      const offset = notifications.length;
      const nextBatch = await notificationsService.getNotifications(user.id, limit, offset);
      setNotifications(prev => [...prev, ...nextBatch]);
      setHasMore(nextBatch.length === limit);
    } catch (err) {
      console.error('Error loading more notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [user, loading, hasMore, notifications.length]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (!user) return;

    // We only need to fetch new data or update counts when real-time updates happen.
    // For simplicity, we refetch to ensure data consistency, especially with relations (actor profile).
    const subscription = notificationsService.subscribeToNotifications(user.id, () => {
      fetchInitialData();
    });

    return () => {
      notificationsService.unsubscribe(subscription);
    };
  }, [user, fetchInitialData]);

  const markAsRead = async (notificationId) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, is_read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await notificationsService.markAsRead(notificationId);
    } catch (err) {
      console.error('Error marking as read:', err);
      // Revert on error
      fetchInitialData();
    }
  };

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      await notificationsService.markAllAsRead(user.id);
    } catch (err) {
      console.error('Error marking all as read:', err);
      fetchInitialData();
    }
  };

  const deleteNotification = async (notificationId) => {
    // Optimistic update
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    // We should also decrement unreadCount if the deleted one was unread, but we don't have that info easily here
    // unless we check the notification state. Let's find it first.
    const notif = notifications.find(n => n.id === notificationId);
    if (notif && !notif.is_read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    try {
      await notificationsService.deleteNotification(notificationId);
    } catch (err) {
      console.error('Error deleting notification:', err);
      fetchInitialData();
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    hasMore,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh: fetchInitialData
  };
}

import { supabase } from '../supabase';

export const notificationsService = {
  /**
   * Fetch notifications for a user with pagination
   */
  async getNotifications(userId, limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:actor_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .neq('action_type', 'deleted')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  },

  /**
   * Fetch unread notification count
   */
  async getUnreadCount(userId) {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .neq('action_type', 'deleted');

    if (error) throw error;
    return count || 0;
  },

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) throw error;
  },

  /**
   * Delete a notification
   */
  async deleteNotification(notificationId) {
    // Soft delete since the database RLS policy does not explicitly permit DELETE operations
    const { error } = await supabase
      .from('notifications')
      .update({ action_type: 'deleted' })
      .eq('id', notificationId);

    if (error) throw error;
  },

  /**
   * Create a notification manually (used when DB triggers don't cover the event)
   */
  async createNotification(userId, actorId, actionType, entityType, entityId, content) {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        actor_id: actorId,
        action_type: actionType,
        entity_type: entityType,
        entity_id: entityId,
        content: content
      });

    if (error) throw error;
  },

  /**
   * Subscribe to real-time notification changes for a user
   */
  subscribeToNotifications(userId, callback) {
    const channelName = `notifications-${userId}-${Math.random().toString(36).substring(7)}`;
    return supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();
  },

  /**
   * Unsubscribe and remove the real-time channel
   */
  unsubscribe(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
};

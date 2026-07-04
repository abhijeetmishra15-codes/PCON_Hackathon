import { supabase } from '../supabase';
import { notificationsService } from './notifications.service';

export const EventsService = {
  /**
   * Get all events with optional filters and pagination
   */
  async getEvents(options = {}) {
    const {
      search = '',
      mode = '',
      status = 'upcoming',
      limit = 20,
      offset = 0
    } = options;

    let query = supabase
      .from('events')
      .select(`
        *,
        organizer:profiles!events_organizer_id_fkey (
          id,
          full_name,
          avatar_url
        ),
        event_registrations (count)
      `, { count: 'exact' });

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (mode) {
      query = query.eq('mode', mode);
    }

    if (status) {
      query = query.eq('status', status);
    }

    query = query
      .order('event_date', { ascending: true })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    if (error) throw error;
    
    // Process registrations count
    const processedData = data.map(event => ({
      ...event,
      registered_count: event.event_registrations?.[0]?.count || 0
    }));

    return { data: processedData, count };
  },

  /**
   * Get event details by ID
   */
  async getEventDetails(eventId) {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        organizer:profiles!events_organizer_id_fkey (
          id,
          full_name,
          avatar_url,
          role
        ),
        event_registrations (count)
      `)
      .eq('id', eventId)
      .single();

    if (error) throw error;
    
    return {
      ...data,
      registered_count: data.event_registrations?.[0]?.count || 0
    };
  },

  /**
   * Create a new event
   */
  async createEvent(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing event
   */
  async updateEvent(eventId, eventData) {
    const { data, error } = await supabase
      .from('events')
      .update(eventData)
      .eq('id', eventId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete an event
   */
  async deleteEvent(eventId) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    return true;
  },

  /**
   * Get events the user has registered for or organized
   */
  async getMyEvents(userId) {
    // Get events organized by user
    const { data: organizedEvents, error: organizedError } = await supabase
      .from('events')
      .select(`
        *,
        event_registrations (count)
      `)
      .eq('organizer_id', userId)
      .order('event_date', { ascending: false });

    // Handle zero rows / 406 errors gracefully
    if (organizedError && organizedError.code !== 'PGRST116' && !organizedError.message?.includes('406')) {
      throw organizedError;
    }

    // Get events user registered for
    const { data: registeredEvents, error: registeredError } = await supabase
      .from('event_registrations')
      .select(`
        event_id,
        status,
        created_at,
        event:events (
          *,
          organizer:profiles!events_organizer_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          event_registrations (count)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Handle zero rows / 406 errors gracefully
    if (registeredError && registeredError.code !== 'PGRST116' && !registeredError.message?.includes('406')) {
      throw registeredError;
    }

    const processedOrganized = (organizedEvents || []).map(event => ({
      ...event,
      registered_count: event.event_registrations?.[0]?.count || 0,
      isOrganizer: true
    }));

    const processedRegistered = (registeredEvents || []).map(reg => ({
      ...reg.event,
      registration_status: reg.status,
      registered_at: reg.created_at,
      registered_count: reg.event.event_registrations?.[0]?.count || 0,
      isOrganizer: false
    }));

    return {
      organized: processedOrganized,
      registered: processedRegistered
    };
  },

  /**
   * Register for an event
   */
  async registerForEvent(eventId, userId) {
    const { data, error } = await supabase
      .from('event_registrations')
      .insert([{ event_id: eventId, user_id: userId }])
      .select()
      .single();

    if (error) throw error;

    try {
      const { data: eventData } = await supabase
        .from('events')
        .select('organizer_id, title')
        .eq('id', eventId)
        .single();

      if (eventData && eventData.organizer_id !== userId) {
        await notificationsService.createNotification(
          eventData.organizer_id,
          userId,
          'event_registration',
          'event',
          eventId,
          `registered for your event: ${eventData.title}`
        );
      }
    } catch (err) {
      console.error('Error creating notification:', err);
    }

    return data;
  },

  /**
   * Cancel registration for an event
   */
  async cancelRegistration(eventId, userId) {
    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  },

  /**
   * Check if a user is registered for a specific event
   */
  async checkRegistration(eventId, userId) {
    if (!userId) return false;
    
    const { data, error } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('event_id', eventId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }
};

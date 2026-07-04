import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EventsService } from '../lib/services/events.service';
import { supabase } from '../lib/supabase';

export function useEvents(options = {}) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState({ organized: [], registered: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchEvents = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const { data, count } = await EventsService.getEvents(filters);
      setEvents(data);
      if (count !== undefined) setTotalCount(count);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyEvents = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await EventsService.getMyEvents(user.id);
      setMyEvents(data);
    } catch (err) {
      console.error('Error fetching my events:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const registerForEvent = async (eventId) => {
    if (!user?.id) throw new Error("Must be logged in to register");
    try {
      await EventsService.registerForEvent(eventId, user.id);
      
      // Optimistic update
      setEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, registered_count: (e.registered_count || 0) + 1 } : e
      ));
      
      return true;
    } catch (err) {
      console.error('Error registering:', err);
      throw err;
    }
  };

  const cancelRegistration = async (eventId) => {
    if (!user?.id) throw new Error("Must be logged in to cancel");
    try {
      await EventsService.cancelRegistration(eventId, user.id);
      
      // Optimistic update
      setEvents(prev => prev.map(e => 
        e.id === eventId ? { ...e, registered_count: Math.max(0, (e.registered_count || 1) - 1) } : e
      ));
      
      setMyEvents(prev => ({
        ...prev,
        registered: prev.registered.filter(e => e.id !== eventId)
      }));
      
      return true;
    } catch (err) {
      console.error('Error canceling registration:', err);
      throw err;
    }
  };

  const createEvent = async (eventData) => {
    try {
      const data = await EventsService.createEvent({
        ...eventData,
        organizer_id: user.id
      });
      // Optionally re-fetch
      return data;
    } catch (err) {
      console.error('Error creating event:', err);
      throw err;
    }
  };

  const updateEvent = async (eventId, eventData) => {
    try {
      const data = await EventsService.updateEvent(eventId, eventData);
      return data;
    } catch (err) {
      console.error('Error updating event:', err);
      throw err;
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await EventsService.deleteEvent(eventId);
      setEvents(prev => prev.filter(e => e.id !== eventId));
      setMyEvents(prev => ({
        ...prev,
        organized: prev.organized.filter(e => e.id !== eventId)
      }));
      return true;
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    }
  };

  // Setup realtime subscription
  useEffect(() => {
    if (options.disableRealtime) return;

    const channel = supabase.channel('events-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, (payload) => {
        // Trigger refetch when events change
        fetchEvents();
        if (user) fetchMyEvents();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'event_registrations' }, (payload) => {
        // Trigger refetch when registrations change (seat count updates)
        fetchEvents();
        if (user) fetchMyEvents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchEvents, fetchMyEvents, options.disableRealtime]);

  return {
    events,
    myEvents,
    loading,
    error,
    totalCount,
    fetchEvents,
    fetchMyEvents,
    registerForEvent,
    cancelRegistration,
    createEvent,
    updateEvent,
    deleteEvent
  };
}

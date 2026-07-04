import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useEvents } from '../hooks/useEvents';
import { Button, LoadingSkeleton, EmptyState, Toast } from '../components/ui';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import EventDetailsModal from '../components/events/EventDetailsModal';
import EventFormModal from '../components/events/EventFormModal';

export default function Events() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { 
    events, myEvents, loading, error, 
    fetchEvents, fetchMyEvents, registerForEvent, cancelRegistration, createEvent 
  } = useEvents();

  const [filters, setFilters] = useState({ search: '', mode: '', status: 'upcoming' });
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    fetchEvents(filters);
  }, [filters, fetchEvents]);

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user, fetchMyEvents]);

  const handleRegister = async (eventId) => {
    try {
      setLoadingAction(eventId);
      await registerForEvent(eventId);
      setToast({ type: 'success', message: 'Successfully registered for event!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to register' });
    } finally {
      setLoadingAction(null);
      if (selectedEvent?.id === eventId) setSelectedEvent(null);
    }
  };

  const handleCancel = async (eventId) => {
    try {
      setLoadingAction(eventId);
      await cancelRegistration(eventId);
      setToast({ type: 'success', message: 'Registration cancelled successfully.' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to cancel registration' });
    } finally {
      setLoadingAction(null);
      if (selectedEvent?.id === eventId) setSelectedEvent(null);
    }
  };

  const handleCreate = async (eventData) => {
    try {
      await createEvent(eventData);
      setToast({ type: 'success', message: 'Event created successfully!' });
      setIsFormOpen(false);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to create event' });
    }
  };

  const getIsRegistered = (eventId) => {
    return myEvents.registered.some(e => e.id === eventId);
  };

  const getIsOrganizer = (eventId) => {
    return myEvents.organized.some(e => e.id === eventId);
  };

  const isAlumni = profile?.role === 'alumni';

  return (
    <div className="pb-14 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <h1 className="text-[30px] font-extrabold tracking-tight text-text-main mb-1">
            Events Directory
          </h1>
          <p className="text-[14px] text-text-secondary">
            Discover and join networking sessions, webinars, and meetups.
          </p>
        </div>

        {isAlumni && (
          <Button 
            variant="primary" 
            leftIcon={<Plus size={16} />}
            onClick={() => setIsFormOpen(true)}
          >
            Create Event
          </Button>
        )}
      </div>

      <EventFilters filters={filters} onFilterChange={setFilters} />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 text-[13px]">
          {error}
        </div>
      )}

      {loading && events.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-[400px]">
              <LoadingSkeleton className="h-full rounded-2xl" />
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="We couldn't find any events matching your current filters."
          actionText="Clear Filters"
          onAction={() => setFilters({ search: '', mode: '', status: 'upcoming' })}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <EventCard
                event={event}
                isRegistered={getIsRegistered(event.id)}
                isOrganizer={getIsOrganizer(event.id)}
                userRole={profile?.role || 'visitor'}
                onRegister={handleRegister}
                onCancel={handleCancel}
                onViewDetails={setSelectedEvent}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <EventDetailsModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        userRole={profile?.role || 'visitor'}
        isRegistered={selectedEvent ? getIsRegistered(selectedEvent.id) : false}
        isOrganizer={selectedEvent ? getIsOrganizer(selectedEvent.id) : false}
        onRegister={handleRegister}
        onCancel={handleCancel}
        loadingAction={loadingAction}
      />

      {isAlumni && (
        <EventFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreate}
        />
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

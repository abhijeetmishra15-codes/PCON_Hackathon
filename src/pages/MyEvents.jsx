import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Trash2, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useEvents } from '../hooks/useEvents';
import { Button, LoadingSkeleton, EmptyState, Toast, Badge } from '../components/ui';
import EventDetailsModal from '../components/events/EventDetailsModal';
import EventFormModal from '../components/events/EventFormModal';
import { cn } from '../utils/cn';

export default function MyEvents() {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { myEvents, fetchMyEvents, loading, error, cancelRegistration, deleteEvent, updateEvent } = useEvents();
  
  const [activeTab, setActiveTab] = useState('registered');
  
  useEffect(() => {
    if (profile?.role === 'alumni') {
      setActiveTab('organized');
    }
  }, [profile?.role]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) fetchMyEvents();
  }, [user, fetchMyEvents]);

  const handleCancelRegistration = async (eventId) => {
    try {
      await cancelRegistration(eventId);
      setToast({ type: 'success', message: 'Registration cancelled.' });
      if (selectedEvent?.id === eventId) setSelectedEvent(null);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to cancel.' });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      await deleteEvent(eventId);
      setToast({ type: 'success', message: 'Event deleted successfully.' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete event.' });
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      await updateEvent(eventToEdit.id, eventData);
      setToast({ type: 'success', message: 'Event updated successfully.' });
      setEventToEdit(null);
      fetchMyEvents();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to update event.' });
    }
  };

  const isAlumni = profile?.role === 'alumni';
  const displayEvents = activeTab === 'organized' ? myEvents.organized : myEvents.registered;

  return (
    <div className="pb-14 animate-fade-in max-w-5xl mx-auto">
      <div className="mb-7">
        <h1 className="text-[30px] font-extrabold tracking-tight text-text-main mb-1">
          {isAlumni ? 'My Events & Registrations' : 'My Registrations'}
        </h1>
        <p className="text-[14px] text-text-secondary">
          Manage the events you're attending {isAlumni && 'or organizing'}.
        </p>
      </div>

      {isAlumni && (
        <div className="flex bg-secondary p-1 rounded-xl w-max mb-8">
          <button
            onClick={() => setActiveTab('organized')}
            className={cn(
              "px-5 py-2 text-[13px] font-bold rounded-lg transition-all",
              activeTab === 'organized' ? 'bg-white shadow-soft text-text-main' : 'text-text-secondary hover:text-text-main'
            )}
          >
            Organized Events ({myEvents.organized.length})
          </button>
          <button
            onClick={() => setActiveTab('registered')}
            className={cn(
              "px-5 py-2 text-[13px] font-bold rounded-lg transition-all",
              activeTab === 'registered' ? 'bg-white shadow-soft text-text-main' : 'text-text-secondary hover:text-text-main'
            )}
          >
            Registered ({myEvents.registered.length})
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 text-[13px]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <LoadingSkeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
      ) : displayEvents.length === 0 ? (
        <EmptyState
          title={activeTab === 'organized' ? "No Organized Events" : "No Registrations"}
          description={
            activeTab === 'organized' 
              ? "You haven't created any events yet." 
              : "You haven't registered for any upcoming events."
          }
          icon={Calendar}
        />
      ) : (
        <div className="space-y-4">
          {displayEvents.map((event, idx) => {
            const dateObj = new Date(event.event_date);
            const isOrganizedTab = activeTab === 'organized';
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-border p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-soft transition-shadow cursor-pointer"
                onClick={() => !isOrganizedTab ? setSelectedEvent(event) : null}
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold uppercase">{dateObj.toLocaleString('en-US', { month: 'short' })}</span>
                  <span className="text-[20px] font-black leading-none">{dateObj.getDate()}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[16px] font-bold text-text-main truncate">{event.title}</h3>
                    <Badge variant={event.status === 'upcoming' ? 'primary' : 'secondary'} className="text-[10px] py-0">{event.status}</Badge>
                  </div>
                  <p className="text-[13px] text-text-secondary line-clamp-1 mb-2">
                    {event.description}
                  </p>
                  <div className="flex gap-4 text-[12px] text-text-secondary font-medium">
                    <span>{event.mode.toUpperCase()}</span>
                    <span>•</span>
                    <span>{event.registered_count} Registered</span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  {isOrganizedTab ? (
                    <>
                      <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setEventToEdit(event); }} leftIcon={<Edit2 size={14} />}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }} leftIcon={<Trash2 size={14} />}>
                        Delete
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}>
                      View Details
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Details Modal for Registrations */}
      <EventDetailsModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
        userRole={profile?.role}
        isRegistered={true}
        isOrganizer={false}
        onCancel={handleCancelRegistration}
      />

      {/* Form Modal for Edits */}
      {isAlumni && (
        <EventFormModal
          isOpen={!!eventToEdit}
          onClose={() => setEventToEdit(null)}
          onSubmit={handleUpdateEvent}
          initialData={eventToEdit}
        />
      )}

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

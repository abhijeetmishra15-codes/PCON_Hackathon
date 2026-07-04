import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Button, Input } from '../ui';

export default function EventFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    mode: 'online',
    location_or_link: '',
    max_attendees: '',
    registration_deadline: '',
    banner_url: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        event_date: initialData.event_date ? new Date(initialData.event_date).toISOString().slice(0, 16) : '',
        mode: initialData.mode || 'online',
        location_or_link: initialData.location_or_link || '',
        max_attendees: initialData.max_attendees ?? '',
        registration_deadline: initialData.registration_deadline ? new Date(initialData.registration_deadline).toISOString().slice(0, 16) : '',
        banner_url: initialData.banner_url ?? ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        event_date: '',
        mode: 'online',
        location_or_link: '',
        max_attendees: '',
        registration_deadline: '',
        banner_url: ''
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Clean up data for submission
    const submitData = {
      ...formData,
      max_attendees: formData.max_attendees ? parseInt(formData.max_attendees, 10) : null,
      event_date: new Date(formData.event_date).toISOString(),
      registration_deadline: formData.registration_deadline ? new Date(formData.registration_deadline).toISOString() : null
    };

    try {
      await onSubmit(submitData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/30">
            <h2 className="text-xl font-bold text-text-main">
              {initialData ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors">
              <X size={20} className="text-text-secondary" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <form id="event-form" onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Event Title *"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Alumni Networking Meetup 2026"
              />
              
              <div>
                <label className="block text-[13px] font-bold text-text-main mb-1.5">Description *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-border rounded-xl text-[14px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What is this event about?"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Event Date & Time *"
                  type="datetime-local"
                  required
                  value={formData.event_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, event_date: e.target.value }))}
                />
                
                <div>
                  <label className="block text-[13px] font-bold text-text-main mb-1.5">Event Mode *</label>
                  <select
                    className="w-full h-[46px] px-4 bg-white border border-border rounded-xl text-[14px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                    value={formData.mode}
                    onChange={(e) => setFormData(prev => ({ ...prev, mode: e.target.value }))}
                  >
                    <option value="online">Online</option>
                    <option value="offline">Offline / In-Person</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <Input
                label={formData.mode === 'online' ? "Meeting Link *" : "Location / Venue *"}
                required
                value={formData.location_or_link}
                onChange={(e) => setFormData(prev => ({ ...prev, location_or_link: e.target.value }))}
                placeholder={formData.mode === 'online' ? "https://zoom.us/j/..." : "123 Campus Drive, Auditorium A"}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Max Attendees (Optional)"
                  type="number"
                  min="1"
                  value={formData.max_attendees}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_attendees: e.target.value }))}
                  placeholder="Leave blank for unlimited"
                />
                
                <Input
                  label="Registration Deadline (Optional)"
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, registration_deadline: e.target.value }))}
                />
              </div>

              <Input
                label="Banner Image URL (Optional)"
                type="url"
                value={formData.banner_url}
                onChange={(e) => setFormData(prev => ({ ...prev, banner_url: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </form>
          </div>

          <div className="p-5 border-t border-border flex justify-end gap-3 bg-secondary/20 shrink-0">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="event-form" 
              variant="primary" 
              isLoading={loading}
              leftIcon={<Save size={16} />}
            >
              {initialData ? 'Save Changes' : 'Create Event'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

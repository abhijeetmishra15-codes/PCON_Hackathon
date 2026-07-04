import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, Clock, Video, FileText, ChevronRight } from 'lucide-react';
import { Button, Badge, Avatar } from '../ui';
import { cn } from '../../utils/cn';

export default function EventDetailsModal({ isOpen, onClose, event, onRegister, onCancel, isRegistered, isOrganizer, userRole, loadingAction }) {
  if (!isOpen || !event) return null;

  const { 
    id, title, description, event_date, mode, location_or_link, 
    status, max_attendees, registered_count, banner_url, organizer,
    registration_deadline, created_at
  } = event;

  const dateObj = new Date(event_date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  const deadlinePassed = registration_deadline ? new Date(registration_deadline) < new Date() : false;
  const remainingSeats = max_attendees ? max_attendees - (registered_count || 0) : null;
  const isFull = remainingSeats !== null && remainingSeats <= 0;

  const canRegister = !isRegistered && !isOrganizer && !isFull && !deadlinePassed && status === 'upcoming' && userRole !== 'visitor';
  const canCancel = isRegistered && status === 'upcoming';

  const modeColors = {
    online: 'bg-blue-100 text-blue-700 border-blue-200',
    offline: 'bg-green-100 text-green-700 border-green-200',
    hybrid: 'bg-purple-100 text-purple-700 border-purple-200'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Image */}
          <div className="h-48 sm:h-64 bg-secondary/50 relative shrink-0">
            {banner_url ? (
              <img src={banner_url} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Calendar size={60} className="text-primary/40" />
              </div>
            )}
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
            {/* Title & Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge className={cn("text-[11px] font-bold border", modeColors[mode] || 'bg-secondary')}>{mode.toUpperCase()}</Badge>
              <Badge variant={status === 'upcoming' ? 'primary' : 'secondary'} className="text-[11px] font-bold border">{status.toUpperCase()}</Badge>
              {isOrganizer && <Badge variant="warning" className="text-[11px] font-bold">Your Event</Badge>}
            </div>
            
            <h2 className="text-[24px] sm:text-[28px] font-extrabold text-text-main leading-tight mb-6">
              {title}
            </h2>

            {/* Grid Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider mb-0.5">Date & Time</p>
                  <p className="text-[14px] font-bold text-text-main">{formattedDate}</p>
                  <p className="text-[13px] text-text-secondary">{formattedTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  {mode === 'online' ? <Video size={20} /> : <MapPin size={20} />}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-[14px] font-bold text-text-main">
                    {mode === 'online' ? 'Virtual Meeting' : 'In Person'}
                  </p>
                  {mode === 'online' ? (
                     <a href={location_or_link} target="_blank" rel="noopener noreferrer" className="text-[13px] text-primary hover:underline line-clamp-1">
                       Join Link
                     </a>
                  ) : (
                    <p className="text-[13px] text-text-secondary line-clamp-1">{location_or_link}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider mb-0.5">Attendance</p>
                  <p className="text-[14px] font-bold text-text-main">
                    {registered_count || 0} Registered
                  </p>
                  <p className="text-[13px] text-text-secondary">
                    {max_attendees ? `${remainingSeats} seats remaining of ${max_attendees}` : 'Unlimited capacity'}
                  </p>
                </div>
              </div>
              
              {registration_deadline && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center text-danger shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider mb-0.5">Deadline</p>
                    <p className="text-[14px] font-bold text-text-main">
                      {new Date(registration_deadline).toLocaleDateString()}
                    </p>
                    <p className="text-[13px] text-text-secondary">
                      {deadlinePassed ? 'Registration closed' : 'Open for registration'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Organizer */}
            <div className="bg-secondary/30 rounded-xl p-4 flex items-center gap-4 mb-8">
              <Avatar src={organizer?.avatar_url} size="md" />
              <div>
                <p className="text-[12px] font-semibold text-text-secondary uppercase tracking-wider mb-0.5">Organized By</p>
                <p className="text-[15px] font-bold text-text-main">{organizer?.full_name}</p>
                {organizer?.role === 'alumni' && <Badge variant="primary" className="text-[10px] mt-1 py-0.5">Alumni</Badge>}
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-[16px] font-bold text-text-main mb-3 flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                About Event
              </h3>
              <div className="text-[14px] text-text-secondary leading-relaxed whitespace-pre-wrap">
                {description}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-border bg-secondary/10 flex flex-col sm:flex-row items-center justify-end gap-3 shrink-0">
            <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto h-11">
              Close
            </Button>
            
            {userRole === 'visitor' && (
              <Button disabled variant="outline" className="w-full sm:w-auto h-11">
                Log in to register
              </Button>
            )}

            {isOrganizer && (
               <Button disabled variant="secondary" className="w-full sm:w-auto h-11">
                 You are the organizer
               </Button>
            )}
            
            {canRegister && (
              <Button 
                variant="primary" 
                onClick={() => onRegister(id)} 
                isLoading={loadingAction === id}
                className="w-full sm:w-auto h-11 px-8"
              >
                Confirm Registration
              </Button>
            )}

            {canCancel && (
              <Button 
                variant="danger" 
                onClick={() => onCancel(id)}
                isLoading={loadingAction === id}
                className="w-full sm:w-auto h-11 px-8"
              >
                Cancel Registration
              </Button>
            )}

            {isFull && !isRegistered && !isOrganizer && status === 'upcoming' && (
               <Button disabled variant="secondary" className="w-full sm:w-auto h-11 px-8">
                 Registration Full
               </Button>
            )}

            {deadlinePassed && !isFull && !isRegistered && !isOrganizer && status === 'upcoming' && (
               <Button disabled variant="secondary" className="w-full sm:w-auto h-11 px-8">
                 Registration Closed
               </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

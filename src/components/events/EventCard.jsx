import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Clock, Video } from 'lucide-react';
import { Card, Badge, Button, Avatar } from '../ui';
import { cn } from '../../utils/cn';

export default function EventCard({ event, onRegister, onCancel, onViewDetails, isRegistered, isOrganizer, userRole }) {
  const { 
    id, title, description, event_date, mode, location_or_link, 
    status, max_attendees, registered_count, banner_url, organizer,
    registration_deadline 
  } = event;

  const dateObj = new Date(event_date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  const remainingSeats = max_attendees ? max_attendees - (registered_count || 0) : null;
  const isFull = remainingSeats !== null && remainingSeats <= 0;
  
  const deadlinePassed = registration_deadline ? new Date(registration_deadline) < new Date() : false;
  const canRegister = !isRegistered && !isOrganizer && !isFull && !deadlinePassed && status === 'upcoming' && userRole !== 'visitor';
  const canCancel = isRegistered && status === 'upcoming';

  const modeColors = {
    online: 'bg-blue-100 text-blue-700 border-blue-200',
    offline: 'bg-green-100 text-green-700 border-green-200',
    hybrid: 'bg-purple-100 text-purple-700 border-purple-200'
  };

  const statusColors = {
    upcoming: 'bg-amber-100 text-amber-700 border-amber-200',
    ongoing: 'bg-green-100 text-green-700 border-green-200',
    completed: 'bg-slate-100 text-slate-700 border-slate-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-soft transition-all duration-300">
      {/* Banner */}
      <div className="h-32 bg-secondary/50 relative overflow-hidden">
        {banner_url ? (
          <img src={banner_url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <Calendar size={40} className="text-primary/40" />
          </div>
        )}
        <div className="absolute top-3 right-3 flex gap-2">
          <Badge className={cn("text-[10px] font-bold border backdrop-blur-md", modeColors[mode] || 'bg-white')}>
            {mode.toUpperCase()}
          </Badge>
          <Badge className={cn("text-[10px] font-bold border backdrop-blur-md", statusColors[status] || 'bg-white')}>
            {status.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Organizer */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar src={organizer?.avatar_url} size="sm" />
          <div className="text-[12px] font-medium text-text-secondary truncate">
            {organizer?.full_name} <span className="opacity-60">· Organizer</span>
          </div>
        </div>

        {/* Title & Desc */}
        <h3 className="text-[18px] font-bold text-text-main leading-tight mb-2 line-clamp-2" title={title}>
          {title}
        </h3>
        <p className="text-[13px] text-text-secondary line-clamp-2 mb-4 flex-1">
          {description}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-2 mb-5 text-[12px] text-text-secondary">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-primary" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-primary" />
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 truncate">
            {mode === 'online' ? (
              <Video size={14} className="text-primary shrink-0" />
            ) : (
              <MapPin size={14} className="text-primary shrink-0" />
            )}
            <span className="truncate" title={location_or_link}>
              {mode === 'online' ? 'Online Meeting' : location_or_link}
            </span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <Users size={14} className="text-primary" />
            <span>
              <strong className="text-text-main">{registered_count || 0}</strong> registered
              {max_attendees ? ` / ${max_attendees} limit` : ''}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border">
          <Button variant="outline" className="flex-1 text-[13px] h-9" onClick={() => onViewDetails(event)}>
            View Details
          </Button>
          
          {isRegistered && (
            <Badge variant="success" className="h-9 px-4 flex items-center justify-center font-bold text-[12px]">
              Registered
            </Badge>
          )}

          {canRegister && (
            <Button variant="primary" className="flex-1 text-[13px] h-9" onClick={() => onRegister(id)}>
              Register
            </Button>
          )}
          
          {canCancel && (
            <Button variant="danger" className="flex-1 text-[13px] h-9 bg-red-50 text-red-600 border-red-200 hover:bg-red-100" onClick={() => onCancel(id)}>
              Cancel
            </Button>
          )}
          
          {isFull && !isRegistered && !isOrganizer && status === 'upcoming' && (
             <Button variant="secondary" disabled className="flex-1 text-[13px] h-9">
               Full
             </Button>
          )}

          {deadlinePassed && !isFull && !isRegistered && !isOrganizer && status === 'upcoming' && (
             <Button variant="secondary" disabled className="flex-1 text-[13px] h-9">
               Closed
             </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

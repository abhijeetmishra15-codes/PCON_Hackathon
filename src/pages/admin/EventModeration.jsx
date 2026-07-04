import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function EventModeration() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select(`
            id,
            title,
            event_date,
            location_or_link,
            status,
            profiles (full_name)
          `)
          .order('event_date', { ascending: true });

        if (error) throw error;

        if (data) {
          const mapped = data.map(item => {
            const evDate = new Date(item.event_date);
            return {
              id: item.id,
              title: item.title || 'Untitled',
              organizer: item.profiles?.full_name || 'Unknown',
              date: evDate.toLocaleDateString(),
              time: evDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              location: item.location_or_link || 'TBD',
              status: item.status === 'upcoming' ? 'Approved' : 'Pending' // mapping upcoming to approved for UI consistency
            };
          });
          setEvents(mapped);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchEvents();
  }, []);

  const handleApprove = (id) => {
    setEvents(prev => prev.map(evt => 
      evt.id === id ? { ...evt, status: 'Approved' } : evt
    ));
  };

  const handleReject = (id) => {
    setEvents(prev => prev.filter(evt => evt.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Event Moderation</h1>
        <p className="text-text-secondary mt-1">Review, manage, or delete upcoming events.</p>
      </div>
      <Card className="p-0 bg-white overflow-hidden border border-border">
        {loading ? (
          <div className="p-12 text-center text-text-secondary">Loading...</div>
        ) : events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-secondary/50 text-text-secondary font-semibold">
                <tr>
                  <th className="px-6 py-3 border-b border-border">Event Info</th>
                  <th className="px-6 py-3 border-b border-border">Organizer</th>
                  <th className="px-6 py-3 border-b border-border">Date & Time</th>
                  <th className="px-6 py-3 border-b border-border">Status</th>
                  <th className="px-6 py-3 border-b border-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-text-main flex items-center gap-1.5">
                          <Calendar size={14} className="text-primary/70" />
                          {evt.title}
                        </p>
                        <p className="text-[12px] text-text-secondary flex items-center gap-1.5 mt-0.5">
                          <MapPin size={12} /> {evt.location}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-text-main">{evt.organizer}</td>
                    <td className="px-6 py-4">
                      <p className="text-text-main font-medium">{evt.date}</p>
                      <p className="text-[12px] text-text-secondary flex items-center gap-1"><Clock size={10} /> {evt.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={evt.status === 'Approved' ? 'success' : 'warning'} 
                             className={evt.status === 'Approved' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}>
                        {evt.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {evt.status === 'Pending' && (
                          <Button 
                            onClick={() => handleApprove(evt.id)}
                            variant="outline" 
                            className="h-8 px-3 text-xs border-success/30 text-success hover:bg-success/5 hover:border-success">
                            Approve
                          </Button>
                        )}
                        <Button 
                          onClick={() => handleReject(evt.id)}
                          variant="ghost" 
                          className="h-8 px-3 text-xs text-error hover:bg-error/5">
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-text-secondary">
            <p>No events found.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

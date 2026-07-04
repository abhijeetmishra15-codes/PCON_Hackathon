import React from 'react';
import { Radio } from 'lucide-react';

export default function BroadcastNotifications() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Broadcast Notifications</h1>
        <p className="text-text-secondary mt-1">Send system-wide notifications to specific audiences.</p>
      </div>
      
      <div className="relative overflow-hidden rounded-3xl bg-white/40 border border-white/50 p-10 md:p-14 shadow-soft text-center backdrop-blur-xl">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-inner">
            <Radio size={48} className="text-primary" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-text-main mb-4 tracking-tight">
            Broadcast System
            <span className="inline-block ml-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold align-middle">
              Coming Soon
            </span>
          </h2>
          
          <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            We're building a comprehensive broadcast system to allow administrators to send rich, targeted announcements and alerts across the entire platform.
          </p>
        </div>
      </div>
    </div>
  );
}

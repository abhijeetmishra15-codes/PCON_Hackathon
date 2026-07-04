import React from 'react';
import { ShieldCheck, BarChart, FileText, Lock, Clock } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Reports & Moderation</h1>
        <p className="text-text-secondary mt-1">Advanced reporting and compliance tools.</p>
      </div>
      
      <div className="relative overflow-hidden rounded-3xl bg-white/40 border border-white/50 p-10 md:p-14 shadow-soft text-center backdrop-blur-xl">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-inner">
            <ShieldCheck size={48} className="text-primary" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-text-main mb-4 tracking-tight">
            Moderation Dashboard
            <span className="inline-block ml-3 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold align-middle">
              Coming Soon
            </span>
          </h2>
          
          <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            We're building a comprehensive suite of moderation and reporting tools to help you maintain a safe, high-quality community environment.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl text-left">
            <FeatureCard 
              icon={<FileText size={20} />} 
              title="Content Reports" 
              desc="Review user-flagged posts, messages, and comments." 
            />
            <FeatureCard 
              icon={<Lock size={20} />} 
              title="Audit Logs" 
              desc="Track all administrative actions and security events." 
            />
            <FeatureCard 
              icon={<BarChart size={20} />} 
              title="Compliance" 
              desc="Generate data compliance and export reports." 
            />
            <FeatureCard 
              icon={<Clock size={20} />} 
              title="Auto-Mod" 
              desc="Set up automated rules for spam and abuse." 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white/60 border border-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-[15px] font-bold text-text-main mb-1.5">{title}</h3>
      <p className="text-[13px] text-text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}

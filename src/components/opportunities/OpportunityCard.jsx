import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Briefcase, Calendar, ChevronRight, DollarSign } from 'lucide-react';
import { Card, Badge, Avatar } from '../ui';

export default function OpportunityCard({ opportunity, onClick }) {
  const formatType = (type) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const typeColors = {
    internship: { bg: 'rgba(129,140,248,0.09)', text: '#6366f1', border: 'rgba(129,140,248,0.18)' },
    full_time: { bg: 'rgba(34,197,94,0.09)', text: '#22C55E', border: 'rgba(34,197,94,0.18)' },
    part_time: { bg: 'rgba(245,158,11,0.09)', text: '#F59E0B', border: 'rgba(245,158,11,0.18)' },
    referral_only: { bg: 'rgba(251,146,60,0.09)', text: '#FB923C', border: 'rgba(251,146,60,0.18)' },
  };
  const tc = typeColors[opportunity.type] || { bg: 'rgba(245,158,11,0.09)', text: '#F59E0B', border: 'rgba(245,158,11,0.18)' };

  return (
    <div
      className="group relative rounded-[22px] p-6 bg-gradient-to-br from-white to-[#FAFAF8] border border-[rgba(0,0,0,0.052)] cursor-pointer transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-[3px] flex flex-col h-full"
      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 20px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.030)' }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(245,158,11,0.10), 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px rgba(245,158,11,0.09)';
        e.currentTarget.style.borderColor = 'rgba(245,158,11,0.10)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03), 0 4px 20px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.030)';
        e.currentTarget.style.borderColor = 'rgba(0,0,0,0.052)';
      }}
      onClick={onClick}
    >
      {/* Header: Company Info */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-[48px] h-[48px] rounded-[14px] bg-[#F5F0E8] border border-[rgba(0,0,0,0.06)] flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {opportunity.company_logo_url ? (
              <img src={opportunity.company_logo_url} alt={opportunity.company} className="w-full h-full object-cover" />
            ) : (
              <Building2 size={20} className="text-text-secondary/60" />
            )}
          </div>
          <div>
            <h3 className="text-[16px] font-bold text-text-main group-hover:text-primary transition-colors line-clamp-1" style={{ letterSpacing: '-0.02em' }}>
              {opportunity.title}
            </h3>
            <p className="text-[13px] text-text-secondary font-medium mt-0.5 line-clamp-1">
              {opportunity.company}
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold px-3 py-[5px] rounded-full shrink-0 ml-3 leading-none"
          style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.border}` }}>
          {formatType(opportunity.type)}
        </span>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[12.5px] text-text-secondary mb-5">
        <span className="flex items-center gap-1.5">
          <MapPin size={13} className="text-primary/50" />
          {opportunity.location}
        </span>
        <span className="flex items-center gap-1.5 capitalize">
          <Briefcase size={13} className="text-primary/50" />
          {opportunity.work_mode}
        </span>
        {opportunity.salary_range && (
          <span className="flex items-center gap-1.5 font-bold text-text-main" style={{ letterSpacing: '-0.01em' }}>
            {opportunity.salary_range}
          </span>
        )}
      </div>

      {/* Skills / Tech tags */}
      {opportunity.skills && opportunity.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
          {opportunity.skills.slice(0, 4).map(skill => (
            <span key={skill.id}
              className="text-[11px] font-semibold px-3 py-[4px] rounded-full leading-none"
              style={{ background: 'rgba(0,0,0,0.04)', color: '#374151', border: '1px solid rgba(0,0,0,0.07)' }}>
              {skill.name}
            </span>
          ))}
          {opportunity.skills.length > 4 && (
            <span className="text-[11px] font-semibold px-2.5 py-[4px] text-text-secondary">
              +{opportunity.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 mt-auto flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-2">
          <Avatar
            src={opportunity.author?.avatar_url}
            alt={opportunity.author?.full_name || 'Posted by'}
            size="sm"
            className="w-6 h-6"
          />
          <span className="text-[11.5px] text-text-secondary/70 font-medium">
            {getRelativeTime(opportunity.created_at)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[12.5px] font-semibold text-primary group-hover:translate-x-0.5 transition-transform duration-150">
          View Details
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}

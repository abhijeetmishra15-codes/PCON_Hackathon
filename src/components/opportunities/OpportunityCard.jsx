import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Briefcase, Calendar, ChevronRight } from 'lucide-react';
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

  return (
    <Card 
      className="p-5 flex flex-col h-full hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group bg-white"
      onClick={onClick}
    >
      {/* Header: Company Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-secondary/50 border border-border/50 flex items-center justify-center overflow-hidden shrink-0">
            {opportunity.company_logo_url ? (
              <img src={opportunity.company_logo_url} alt={opportunity.company} className="w-full h-full object-cover" />
            ) : (
              <Building2 size={20} className="text-text-secondary/70" />
            )}
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-text-main group-hover:text-primary transition-colors line-clamp-1">
              {opportunity.title}
            </h3>
            <p className="text-[14px] text-text-secondary font-medium mt-0.5 line-clamp-1">
              {opportunity.company}
            </p>
          </div>
        </div>
        <Badge variant="primary" className="text-xs bg-primary/10 text-primary border-primary/20 shrink-0">
          {formatType(opportunity.type)}
        </Badge>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[13px] text-text-secondary mb-4">
        <span className="flex items-center gap-1.5">
          <MapPin size={15} />
          {opportunity.location}
        </span>
        <span className="flex items-center gap-1.5 capitalize">
          <Briefcase size={15} />
          {opportunity.work_mode}
        </span>
        {opportunity.salary_range && (
          <span className="flex items-center gap-1.5 font-medium text-text-main/80">
            {opportunity.salary_range}
          </span>
        )}
      </div>

      {/* Skills */}
      {opportunity.skills && opportunity.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
          {opportunity.skills.slice(0, 4).map(skill => (
            <span key={skill.id} className="text-[11px] font-medium px-2 py-0.5 bg-secondary/70 text-text-main rounded-md border border-border/50">
              {skill.name}
            </span>
          ))}
          {opportunity.skills.length > 4 && (
            <span className="text-[11px] font-medium px-2 py-0.5 text-text-secondary">
              +{opportunity.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-border mt-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar 
            src={opportunity.author?.avatar_url} 
            alt={opportunity.author?.full_name || 'Posted by'} 
            size="sm"
            className="w-6 h-6 border-border"
          />
          <span className="text-[12px] text-text-secondary">
            {getRelativeTime(opportunity.created_at)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[13px] font-medium text-primary group-hover:translate-x-1 transition-transform">
          View Details
          <ChevronRight size={14} />
        </div>
      </div>
    </Card>
  );
}

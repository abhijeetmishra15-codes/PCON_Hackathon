import React from 'react';
import { Building2, MapPin, Briefcase, Calendar, Link as LinkIcon, DollarSign, Clock, Send } from 'lucide-react';
import { Modal, Button, Badge, Avatar } from '../ui';
import { useAuth } from '../../contexts/AuthContext';

export default function OpportunityModal({ 
  isOpen, 
  onClose, 
  opportunity,
  onRequestReferral 
}) {
  const { user } = useAuth();

  if (!opportunity) return null;

  const formatType = (type) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const handleRequestReferral = () => {
    onClose();
    if (onRequestReferral) {
      onRequestReferral(opportunity);
    }
  };

  const isStudent = user?.user_metadata?.role === 'student';
  const isAuthor = user?.id === opportunity.author_id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Opportunity Details"
      size="2xl"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start gap-4 pb-6 border-b border-border/50">
          <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-border/50 flex items-center justify-center overflow-hidden shrink-0 mt-1">
            {opportunity.company_logo_url ? (
              <img src={opportunity.company_logo_url} alt={opportunity.company} className="w-full h-full object-cover" />
            ) : (
              <Building2 size={24} className="text-text-secondary/70" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-text-main leading-tight mb-1">
              {opportunity.title}
            </h2>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-[14px] text-text-secondary mt-2">
              <span className="flex items-center gap-1.5 font-medium text-text-main/80">
                <Building2 size={16} />
                {opportunity.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin size={16} />
                {opportunity.location}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="primary" className="bg-primary/10 text-primary border-primary/20">
                {formatType(opportunity.type)}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {opportunity.work_mode}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-border/50">
          {opportunity.salary_range && (
            <div>
              <div className="text-[12px] text-text-secondary mb-1 flex items-center gap-1">
                <DollarSign size={14} /> Salary
              </div>
              <div className="font-medium text-[14px]">{opportunity.salary_range}</div>
            </div>
          )}
          
          {opportunity.experience_level && (
            <div>
              <div className="text-[12px] text-text-secondary mb-1 flex items-center gap-1">
                <Briefcase size={14} /> Experience
              </div>
              <div className="font-medium text-[14px]">{opportunity.experience_level}</div>
            </div>
          )}
          
          <div>
            <div className="text-[12px] text-text-secondary mb-1 flex items-center gap-1">
              <Calendar size={14} /> Posted
            </div>
            <div className="font-medium text-[14px]">
              {new Date(opportunity.created_at).toLocaleDateString()}
            </div>
          </div>

          {opportunity.application_deadline && (
            <div>
              <div className="text-[12px] text-text-secondary mb-1 flex items-center gap-1">
                <Clock size={14} /> Deadline
              </div>
              <div className="font-medium text-[14px]">
                {new Date(opportunity.application_deadline).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-[15px] font-semibold text-text-main mb-3">About the Role</h3>
          <div className="text-[14px] text-text-secondary leading-relaxed whitespace-pre-wrap">
            {opportunity.description}
          </div>
        </div>

        {/* Skills */}
        {opportunity.skills && opportunity.skills.length > 0 && (
          <div>
            <h3 className="text-[15px] font-semibold text-text-main mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {opportunity.skills.map(skill => (
                <span key={skill.id} className="text-[13px] font-medium px-3 py-1.5 bg-secondary/70 text-text-main rounded-lg border border-border/50">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Posted By (Alumni info) */}
        {opportunity.author && (
          <div className="bg-secondary/30 rounded-xl p-4 border border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar 
                src={opportunity.author.avatar_url} 
                alt={opportunity.author.full_name} 
                className="w-10 h-10"
              />
              <div>
                <div className="text-[13px] text-text-secondary mb-0.5">Posted by</div>
                <div className="font-medium text-[14px] text-text-main">
                  {opportunity.author.full_name}
                </div>
                <div className="text-[12px] text-text-secondary">
                  {opportunity.author.job_role} at {opportunity.author.company}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-border">
          {opportunity.application_url && (
            <Button 
              variant="outline" 
              onClick={() => window.open(opportunity.application_url, '_blank')}
              leftIcon={<LinkIcon size={18} />}
              className="w-full sm:w-auto"
            >
              Apply Externally
            </Button>
          )}
          
          {isStudent && !isAuthor && (
            <Button 
              onClick={handleRequestReferral}
              leftIcon={<Send size={18} />}
              className="w-full sm:w-auto"
            >
              Request Referral
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Building2, Briefcase, GraduationCap, 
  MessageSquare, UserPlus, FileText, CheckCircle 
} from 'lucide-react';
import { Button, Badge, Avatar } from './ui';

export default function AlumniProfileModal({ 
  isOpen, 
  onClose, 
  alumni,
  connectionRecord,
  currentUserId,
  onSendRequest,
  onCancelRequest,
  onAcceptRequest
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!alumni) return null;
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-text-main/20 backdrop-blur-sm z-[100]"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-xl z-[101] overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header / Banner */}
            <div className="h-32 bg-primary/10 relative shrink-0">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors backdrop-blur-md"
              >
                <X size={20} className="text-text-secondary" />
              </button>
            </div>

            {/* Content Scrollable Area */}
            <div className="px-6 sm:px-8 pb-8 pt-0 overflow-y-auto flex-1">
              {/* Profile Meta */}
              <div className="flex flex-col sm:flex-row gap-6 relative -mt-12 sm:-mt-16 items-start">
                <Avatar 
                  src={alumni.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(alumni.full_name)}&background=random`} 
                  size="xl" 
                  className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-soft shrink-0 bg-white"
                />
                
                <div className="pt-2 sm:pt-20 flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-text-main flex items-center gap-2">
                        <span className="truncate">{alumni.full_name}</span>
                        {alumni.is_verified && (
                          <CheckCircle size={20} className="text-success fill-success/10 shrink-0" />
                        )}
                      </h2>
                      <p className="text-[15px] text-text-secondary mt-1 truncate">{alumni.job_role} at <span className="font-semibold text-text-main">{alumni.company}</span></p>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 shrink-0">
                      {(() => {
                        if (alumni.id === currentUserId) {
                          return (
                            <Button disabled className="h-10 px-5 rounded-full flex items-center gap-2 bg-gray-100 text-gray-400 border-none">
                              You
                            </Button>
                          );
                        }

                        if (!connectionRecord) {
                          return (
                            <Button 
                              onClick={() => onSendRequest?.(alumni.id)}
                              className="h-10 px-5 rounded-full flex items-center gap-2 shadow-btn-primary"
                            >
                              <UserPlus size={16} /> Connect
                            </Button>
                          );
                        }

                        if (connectionRecord.status === 'accepted') {
                          return (
                            <Button disabled className="h-10 px-5 rounded-full flex items-center gap-2 bg-success/10 text-success border-success/20">
                              <CheckCircle size={16} /> Connected
                            </Button>
                          );
                        }

                        if (connectionRecord.status === 'pending') {
                          if (connectionRecord.requester_id === currentUserId) {
                            return (
                              <Button 
                                variant="outline"
                                onClick={() => onCancelRequest?.(connectionRecord.id, alumni.id)}
                                className="h-10 px-5 rounded-full flex items-center gap-2 text-text-secondary"
                              >
                                <X size={16} /> Cancel Request
                              </Button>
                            );
                          } else {
                            return (
                              <Button 
                                onClick={() => onAcceptRequest?.(connectionRecord.id, alumni.id)}
                                className="h-10 px-5 rounded-full flex items-center gap-2 bg-secondary text-text-main border-border hover:bg-secondary/80"
                              >
                                <CheckCircle size={16} /> Accept Request
                              </Button>
                            );
                          }
                        }

                        return (
                          <Button 
                            onClick={() => onSendRequest?.(alumni.id)}
                            className="h-10 px-5 rounded-full flex items-center gap-2 shadow-btn-primary"
                          >
                            <UserPlus size={16} /> Connect
                          </Button>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                {/* Left Column (Main details) */}
                <div className="md:col-span-2 space-y-8">
                  {/* Bio */}
                  {alumni.bio ? (
                    <section>
                      <h3 className="text-lg font-bold text-text-main mb-3">About</h3>
                      <p className="text-[14.5px] leading-relaxed text-text-secondary">
                        {alumni.bio}
                      </p>
                    </section>
                  ) : (
                    <section>
                       <p className="text-[14.5px] italic text-text-secondary">No bio provided.</p>
                    </section>
                  )}

                  {/* Skills */}
                  {alumni.skills && alumni.skills.length > 0 && (
                    <section>
                      <h3 className="text-lg font-bold text-text-main mb-3">Skills & Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {alumni.skills.map((skill) => (
                          <Badge key={skill} variant="primary" className="bg-primary/10 text-primary border border-primary/20 px-3 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* Right Column (Sidebar details) */}
                <div className="space-y-6">
                  {/* Quick Info Card */}
                  <div className="bg-secondary/50 rounded-xl p-5 border border-border space-y-4">
                    <h4 className="text-[13px] font-bold uppercase tracking-wider text-text-secondary mb-2">Professional Info</h4>
                    
                    <div className="flex items-start gap-3">
                      <Building2 size={18} className="text-primary mt-0.5" />
                      <div>
                        <p className="text-[12px] text-text-secondary">Industry</p>
                        <p className="text-[14px] font-medium text-text-main">{alumni.industry || 'Not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Briefcase size={18} className="text-primary mt-0.5" />
                      <div>
                        <p className="text-[12px] text-text-secondary">Experience</p>
                        <p className="text-[14px] font-medium text-text-main">{alumni.years_of_experience} years</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <GraduationCap size={18} className="text-primary mt-0.5" />
                      <div>
                        <p className="text-[12px] text-text-secondary">Class of {alumni.graduation_year}</p>
                        <p className="text-[14px] font-medium text-text-main">{alumni.department || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Actions */}
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start h-11" leftIcon={<FileText size={16} />}>
                      Request Referral
                    </Button>
                    <Button variant="ghost" className="w-full justify-start h-11 text-text-secondary hover:text-text-main" leftIcon={<MessageSquare size={16} />}>
                      Message (Coming Soon)
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

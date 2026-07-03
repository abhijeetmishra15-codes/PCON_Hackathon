import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Building2, Briefcase, Link as LinkIcon, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Input } from '../ui';
import { useResume } from '../../hooks/useResume';
import { useNavigate } from 'react-router-dom';

export default function RequestReferralModal({ isOpen, onClose, alumni, initialData, onSubmit, isSubmitting }) {
  const navigate = useNavigate();
  const { resume, isLoading: isLoadingResume } = useResume();
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobUrl: '',
    message: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset form when opened with a new alumni
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        companyName: initialData?.companyName || alumni?.company || '',
        jobTitle: initialData?.jobTitle || '',
        jobUrl: initialData?.jobUrl || ''
      }));
      setError('');
    }
  }, [isOpen, alumni, initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName.trim()) return setError('Company name is required');
    if (!formData.jobTitle.trim()) return setError('Job title is required');
    if (!formData.message.trim()) return setError('Message is required');
    if (!resume) return setError('You must upload a resume before requesting a referral');

    try {
      await onSubmit({
        alumni_id: alumni.id,
        company_name: formData.companyName,
        job_title: formData.jobTitle,
        job_url: formData.jobUrl,
        pitch_message: formData.message,
        resume_url: resume.file_url
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit request');
    }
  };

  if (!alumni) return null;
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-text-main/20 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 w-full max-w-lg bg-white rounded-2xl shadow-xl z-[101] overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-border/60 flex items-center justify-between shrink-0 bg-secondary/30">
              <div>
                <h2 className="text-xl font-extrabold text-text-main">Request Referral</h2>
                <p className="text-[13px] text-text-secondary mt-1">
                  Ask <span className="font-semibold text-text-main">{alumni.full_name}</span> for a referral
                </p>
              </div>
              <button onClick={onClose} className="p-2 bg-white hover:bg-secondary rounded-full transition-colors border border-border">
                <X size={18} className="text-text-secondary" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {error && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 text-red-600 text-[13px] font-medium flex items-center gap-2 border border-red-100">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <form id="referral-form" onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-text-main">Company *</label>
                    <Input
                      name="companyName"
                      placeholder="e.g. Google"
                      value={formData.companyName}
                      onChange={handleChange}
                      leftIcon={<Building2 size={15} />}
                      required
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-text-main">Job Title *</label>
                    <Input
                      name="jobTitle"
                      placeholder="e.g. Software Engineer"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      leftIcon={<Briefcase size={15} />}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-text-main">Job URL <span className="text-text-secondary font-normal">(Optional)</span></label>
                  <Input
                    name="jobUrl"
                    placeholder="https://careers.google.com/..."
                    value={formData.jobUrl}
                    onChange={handleChange}
                    leftIcon={<LinkIcon size={15} />}
                  />
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[13px] font-bold text-text-main">Pitch Message *</label>
                    <span className={`text-[11px] font-medium ${formData.message.length > 500 ? 'text-red-500' : 'text-text-secondary'}`}>
                      {formData.message.length}/500
                    </span>
                  </div>
                  <textarea
                    name="message"
                    placeholder="Briefly explain why you are a good fit for this role..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full h-28 rounded-xl border border-border/80 bg-secondary/30 px-3.5 py-3 text-[14px] text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all resize-none"
                    required
                    maxLength={500}
                  />
                </div>

                <div className="pt-3 border-t border-border">
                  <label className="text-[13px] font-bold text-text-main block mb-2">Resume Attached</label>
                  {isLoadingResume ? (
                    <div className="h-12 bg-secondary animate-pulse rounded-xl" />
                  ) : resume ? (
                    <div className="flex items-center justify-between p-3 rounded-xl border border-primary/20 bg-primary/5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <FileText size={18} />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-text-main truncate max-w-[200px]">
                            {resume.file_url.split('/').pop()}
                          </p>
                          <p className="text-[11px] text-success font-medium flex items-center gap-1">
                            <CheckCircle size={12} /> Ready to send
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" type="button" onClick={() => navigate('/profile')} className="text-text-secondary">
                        Change
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/50">
                      <div className="text-[13px] text-text-secondary font-medium">
                        No resume uploaded yet.
                      </div>
                      <Button variant="outline" size="sm" type="button" onClick={() => navigate('/profile')} className="bg-white">
                        Upload Resume
                      </Button>
                    </div>
                  )}
                </div>

              </form>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-border/60 bg-secondary/30 flex justify-end gap-3 shrink-0">
              <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                form="referral-form" 
                disabled={isSubmitting || !resume}
                leftIcon={<Send size={15} />}
                className="shadow-btn-primary"
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

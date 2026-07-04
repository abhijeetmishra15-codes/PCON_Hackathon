import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, RefreshCcw, CheckCircle } from 'lucide-react';
import { Modal, Button, Toast } from '../ui';
import { useProfile } from '../../hooks/useProfile';
import { useSkills } from '../../hooks/useSkills';
import { supabase } from '../../lib/supabase';

export default function GenerateReferralModal({ 
  isOpen, 
  onClose, 
  alumni,
  targetOpportunity = '',
  targetCompany = ''
}) {
  const { profile } = useProfile();
  const { skills } = useSkills();
  const [isGenerating, setIsGenerating] = useState(false);
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const generateMessage = async () => {
    if (!profile || !alumni) return;
    
    setIsGenerating(true);
    setMessage('');
    
    try {
      const referralData = {
        studentName: profile.full_name,
        studentDepartment: profile.department,
        studentSkills: skills.map(s => s.name).join(', '),
        targetOpportunity: targetOpportunity || 'a role',
        company: targetCompany || alumni.company,
        alumniName: alumni.full_name,
        alumniCompany: alumni.company,
        alumniRole: alumni.job_role
      };

      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { 
          action: 'generate_referral',
          referralData
        }
      });

      if (error) throw new Error(error.message || 'Failed to generate message');
      if (data.error) throw new Error(data.error);

      setMessage(data.message);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Generation failed' });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen && alumni && !message && !isGenerating) {
      generateMessage();
    }
  }, [isOpen, alumni]);

  const handleCopy = () => {
    if (!message) return;
    navigator.clipboard.writeText(message);
    setIsCopied(true);
    setToast({ type: 'success', message: 'Message copied to clipboard!' });
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (!isOpen || !alumni) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="AI Referral Generator"
        size="lg"
      >
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-primary/5 p-2 min-h-[250px]">
          {/* Ambient background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="relative z-10 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-btn-primary shrink-0">
                 <Sparkles size={20} />
              </div>
              <div>
                <h5 className="text-[16px] font-extrabold text-text-main tracking-tight">AI Generated Pitch</h5>
                <p className="text-[13px] text-text-secondary font-medium">For {alumni.full_name}</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div 
                  key="generating"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="py-12 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary"
                      animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                    <Sparkles size={16} className="text-primary animate-pulse" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-text-main">Generating Referral Request...</p>
                    <p className="text-[12px] text-text-secondary">Crafting a professional and concise message.</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-border shadow-sm mb-6 relative group">
                     <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                     <p className="text-[14px] text-text-main leading-relaxed whitespace-pre-wrap relative z-10">
                       {message}
                     </p>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-border/50 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={generateMessage}
                      leftIcon={<RefreshCcw size={16} />}
                      className="text-text-secondary hover:text-text-main"
                    >
                      Regenerate
                    </Button>
                    <Button 
                      onClick={handleCopy}
                      leftIcon={isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
                      className={isCopied ? "bg-success hover:bg-success border-success text-white shadow-none" : "shadow-btn-primary"}
                    >
                      {isCopied ? 'Copied!' : 'Copy Message'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Modal>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </>
  );
}

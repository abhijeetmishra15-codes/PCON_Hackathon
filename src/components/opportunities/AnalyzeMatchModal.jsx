import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, AlertCircle, Zap, Target } from 'lucide-react';
import { Modal, Button } from '../ui';
import { useResume } from '../../hooks/useResume';

export default function AnalyzeMatchModal({ 
  isOpen, 
  onClose, 
  opportunity
}) {
  const { resume, analyzeJobMatch } = useResume();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && opportunity) {
      // Reset state when opened
      setAnalysis(null);
      setError(null);
    }
  }, [isOpen, opportunity]);

  const handleAnalyze = async () => {
    if (!resume) {
      setError('Please upload a resume first in your profile.');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeJobMatch(opportunity.title, opportunity.description);
      setAnalysis(result);
    } catch (err) {
      setError(err.message || 'Failed to analyze job match.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen || !opportunity) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Job Match Analyzer"
      size="2xl"
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-primary/5 p-2 min-h-[300px]">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 p-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-text-main mb-1">
              {opportunity.title} at {opportunity.company}
            </h3>
            <p className="text-[14px] text-text-secondary">
              Find out how well your resume matches this opportunity.
            </p>
          </div>

          {!analysis && !isAnalyzing && (
             <div className="flex flex-col items-center justify-center py-8 space-y-4">
               {error && (
                 <div className="w-full max-w-md p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-start gap-2 text-sm">
                   <AlertCircle size={16} className="mt-0.5 shrink-0" />
                   <p>{error}</p>
                 </div>
               )}
               <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 shadow-inner">
                 <Brain size={32} />
               </div>
               <Button 
                 onClick={handleAnalyze} 
                 className="shadow-btn-primary px-8 py-2.5 text-base"
                 leftIcon={<Brain size={18} />}
               >
                 ✨ Analyze Match
               </Button>
               {!resume && (
                 <p className="text-[13px] text-text-secondary mt-2">
                   You need to upload a resume in your profile first.
                 </p>
               )}
             </div>
          )}

          <AnimatePresence mode="wait">
            {isAnalyzing && (
              <motion.div 
                key="analyzing"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <motion.div 
                    className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary"
                    animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  />
                  <Brain size={24} className="text-primary animate-pulse" />
                </div>
                <div>
                  <p className="text-[15px] font-bold text-text-main">Analyzing Job Match...</p>
                  <p className="text-[13px] text-text-secondary max-w-sm">Comparing your skills and experience against the job requirements.</p>
                </div>
              </motion.div>
            )}

            {analysis && !isAnalyzing && (
              <motion.div 
                key="analysis"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {/* Left Column: Match Score */}
                <div className="space-y-6">
                  <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-border shadow-sm text-center relative overflow-hidden group h-full flex flex-col justify-center">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <h6 className="text-[13px] font-bold text-text-secondary uppercase tracking-wider mb-4">Overall Match</h6>
                    <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="8" />
                        <motion.circle 
                          cx="50" cy="50" r="40" fill="none" 
                          stroke={analysis.matchScore >= 90 ? '#22C55E' : analysis.matchScore >= 70 ? '#F59E0B' : '#EF4444'} 
                          strokeWidth="8" strokeLinecap="round"
                          strokeDasharray="251.2"
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{ strokeDashoffset: 251.2 - (251.2 * analysis.matchScore) / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-extrabold text-text-main leading-none">{analysis.matchScore}</span>
                        <span className="text-[11px] font-bold text-text-secondary mt-1">/ 100</span>
                      </div>
                    </div>
                    <p className="mt-4 text-[13px] font-medium text-text-secondary">
                       {analysis.matchScore >= 90 ? 'Excellent Match!' : analysis.matchScore >= 70 ? 'Good Match' : 'Needs Improvement'}
                    </p>
                  </div>
                </div>

                {/* Right Column: Details */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-border shadow-sm">
                      <h6 className="text-[13px] font-bold text-success flex items-center gap-1.5 mb-3">
                        <CheckCircle size={14} /> Matched Skills
                      </h6>
                      <ul className="space-y-2">
                        {analysis.matchedSkills?.length > 0 ? analysis.matchedSkills.map((item, i) => (
                          <li key={i} className="text-[12px] text-text-secondary flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-success/60 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        )) : (
                          <li className="text-[12px] text-text-secondary italic">None detected.</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-border shadow-sm">
                      <h6 className="text-[13px] font-bold text-red-500 flex items-center gap-1.5 mb-3">
                        <AlertCircle size={14} /> Missing Skills
                      </h6>
                      <ul className="space-y-2">
                        {analysis.missingSkills?.length > 0 ? analysis.missingSkills.map((item, i) => (
                          <li key={i} className="text-[12px] text-text-secondary flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 mt-1.5 shrink-0" />
                            {item}
                          </li>
                        )) : (
                           <li className="text-[12px] text-text-secondary italic">None detected.</li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-border shadow-sm">
                    <h6 className="text-[13px] font-bold text-primary flex items-center gap-1.5 mb-3">
                      <Zap size={14} /> Recommendations
                    </h6>
                    <ul className="space-y-2.5">
                      {analysis.recommendations?.length > 0 ? analysis.recommendations.map((item, i) => (
                        <li key={i} className="text-[13px] text-text-main flex items-start gap-2.5 bg-primary/5 p-2.5 rounded-lg border border-primary/10">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          {item}
                        </li>
                      )) : (
                         <li className="text-[13px] text-text-secondary italic">No recommendations available.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Modal>
  );
}

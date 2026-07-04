import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Building2, Map, BookOpen, Briefcase, Award, ArrowRight, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Input, Toast } from '../components/ui';
import { useProfile } from '../hooks/useProfile';
import { useSkills } from '../hooks/useSkills';
import { useResume } from '../hooks/useResume';
import { supabase } from '../lib/supabase';

export default function CareerRoadmap() {
  const { profile } = useProfile();
  const { skills } = useSkills();
  const { resume, isLoading: isResumeLoading } = useResume();
  
  const [formData, setFormData] = useState({
    targetRole: '',
    targetCompany: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.targetRole.trim()) {
      setToast({ type: 'error', message: 'Target Role is required' });
      return;
    }
    if (!resume) {
      setToast({ type: 'error', message: 'Please upload a resume in your profile first.' });
      return;
    }
    if (!profile) {
      setToast({ type: 'error', message: 'Incomplete profile. Please complete your profile first.' });
      return;
    }

    setIsGenerating(true);
    setRoadmap(null);
    setToast(null);

    try {
      const roadmapData = {
        targetRole: formData.targetRole,
        targetCompany: formData.targetCompany,
        department: profile.department,
        skills: skills.map(s => s.name).join(', ')
      };

      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { 
          action: 'generate_roadmap',
          resumeId: resume.id,
          fileUrl: resume.file_url,
          roadmapData
        }
      });

      if (error) throw new Error(error.message || 'Failed to generate roadmap');
      if (data.error) throw new Error(data.error);

      setRoadmap(data);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Generation failed. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-border shadow-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-btn-primary">
              <Map size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">AI Career Roadmap</h1>
              <p className="text-[15px] text-text-secondary font-medium mt-1">Get a personalized path to your dream role</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="mt-8 flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-[13px] font-bold text-text-main">Target Role *</label>
              <Input
                name="targetRole"
                placeholder="e.g. Senior Product Designer"
                value={formData.targetRole}
                onChange={handleChange}
                leftIcon={<Target size={16} />}
                required
              />
            </div>
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-[13px] font-bold text-text-main">Target Company (Optional)</label>
              <Input
                name="targetCompany"
                placeholder="e.g. Apple"
                value={formData.targetCompany}
                onChange={handleChange}
                leftIcon={<Building2 size={16} />}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full sm:w-auto h-11 px-8 shadow-btn-primary shrink-0"
              disabled={isGenerating || isResumeLoading}
              leftIcon={<Zap size={16} />}
            >
              Generate
            </Button>
          </form>
          
          {!resume && !isResumeLoading && (
            <div className="mt-4 p-3 rounded-xl bg-red-50/50 border border-red-100 text-[13px] text-red-600 font-medium flex items-center gap-2">
              <AlertCircle size={16} />
              You need to upload a resume in your profile before generating a roadmap.
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div 
            key="generating"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white/60 backdrop-blur-md rounded-2xl p-12 border border-border shadow-soft flex flex-col items-center justify-center text-center min-h-[400px]"
          >
            <div className="relative w-20 h-20 flex items-center justify-center mb-6">
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
                animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <Map size={32} className="text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-text-main">Generating Career Roadmap...</h3>
            <p className="text-[14px] text-text-secondary mt-2 max-w-sm">
              Analyzing your skills, resume, and target role to create a personalized step-by-step path.
            </p>
          </motion.div>
        ) : roadmap ? (
          <motion.div 
            key="roadmap"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-8 relative"
          >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-border shadow-sm flex flex-col items-center justify-center text-center">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-3">
                   <Award size={20} />
                 </div>
                 <p className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-1">Current Level</p>
                 <p className="text-[14px] font-semibold text-text-main">{roadmap.currentLevel}</p>
               </div>
               <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-border shadow-sm flex flex-col items-center justify-center text-center">
                 <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success mb-3">
                   <Target size={20} />
                 </div>
                 <p className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-1">Target Role</p>
                 <p className="text-[14px] font-semibold text-text-main">{roadmap.targetRole}</p>
               </div>
               <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-border shadow-sm flex flex-col items-center justify-center text-center">
                 <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-3">
                   <Zap size={20} />
                 </div>
                 <p className="text-[12px] font-bold text-text-secondary uppercase tracking-wider mb-1">Est. Duration</p>
                 <p className="text-[14px] font-semibold text-text-main">{roadmap.estimatedDuration}</p>
               </div>
            </div>

            {/* Vertical Timeline */}
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 sm:p-10 border border-border shadow-soft">
               <div className="relative pl-8 sm:pl-12 border-l-2 border-primary/20 space-y-12">
                 
                 {/* Step 1: Skills */}
                 <div className="relative">
                   <div className="absolute -left-[41px] sm:-left-[57px] w-10 h-10 rounded-full bg-white border-4 border-primary/20 flex items-center justify-center shadow-sm">
                     <BookOpen size={16} className="text-primary" />
                   </div>
                   <h4 className="text-[16px] font-bold text-text-main mb-4 flex items-center gap-2">
                     1. Skills to Learn
                   </h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {roadmap.skillsToLearn?.map((skill, i) => (
                       <div key={i} className="bg-primary/5 rounded-lg p-3 border border-primary/10 flex items-start gap-3">
                         <CheckCircle size={16} className="text-primary mt-0.5 shrink-0" />
                         <span className="text-[14px] font-medium text-text-main">{skill}</span>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Step 2: Projects */}
                 <div className="relative">
                   <div className="absolute -left-[41px] sm:-left-[57px] w-10 h-10 rounded-full bg-white border-4 border-accent/20 flex items-center justify-center shadow-sm">
                     <Briefcase size={16} className="text-accent" />
                   </div>
                   <h4 className="text-[16px] font-bold text-text-main mb-4 flex items-center gap-2">
                     2. Recommended Projects
                   </h4>
                   <div className="space-y-3">
                     {roadmap.projects?.map((project, i) => (
                       <div key={i} className="bg-accent/5 rounded-lg p-4 border border-accent/10 flex items-start gap-3">
                         <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-[12px] font-bold shrink-0 mt-0.5">{i+1}</div>
                         <span className="text-[14.5px] font-medium text-text-main leading-relaxed">{project}</span>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Step 3: Certifications */}
                 <div className="relative">
                   <div className="absolute -left-[41px] sm:-left-[57px] w-10 h-10 rounded-full bg-white border-4 border-success/20 flex items-center justify-center shadow-sm">
                     <Award size={16} className="text-success" />
                   </div>
                   <h4 className="text-[16px] font-bold text-text-main mb-4 flex items-center gap-2">
                     3. Certifications & Credentials
                   </h4>
                   <div className="space-y-3">
                     {roadmap.certifications?.map((cert, i) => (
                       <div key={i} className="bg-success/5 rounded-lg p-3 border border-success/10 flex items-center gap-3">
                         <Award size={18} className="text-success shrink-0" />
                         <span className="text-[14px] font-medium text-text-main">{cert}</span>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* Final Step */}
                 <div className="relative">
                   <div className="absolute -left-[41px] sm:-left-[57px] w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent border-4 border-white flex items-center justify-center shadow-md">
                     <Target size={16} className="text-white" />
                   </div>
                   <h4 className="text-[16px] font-bold text-text-main mb-4">
                     4. Next Best Step
                   </h4>
                   <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-5 border border-primary/20 flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                       <ArrowRight size={20} className="text-primary" />
                     </div>
                     <div>
                       <p className="text-[15px] font-bold text-text-main leading-relaxed">
                         {roadmap.nextStep}
                       </p>
                     </div>
                   </div>
                 </div>

               </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

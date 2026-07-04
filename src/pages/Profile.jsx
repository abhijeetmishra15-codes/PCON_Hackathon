import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Building2, Briefcase, GraduationCap, 
  MapPin, Link as LinkIcon, Camera, Plus, FileText, Loader2, AlertCircle, CheckCircle,
  X, Upload, Download, Eye, Trash2, ShieldCheck, FileSearch, Sparkles, Brain, Zap, Target
} from 'lucide-react';
import { Card, Button, Input, Badge, Avatar, Toast } from '../components/ui';
import { useProfile } from '../hooks/useProfile';
import { useSkills } from '../hooks/useSkills';
import { useResume } from '../hooks/useResume';

export default function Profile() {
  const { profile, subProfile, isLoading: isFetchingProfile, error: fetchProfileError, updateProfile, uploadAvatar } = useProfile();
  const { 
    skills, isLoading: isFetchingSkills, addSkill, removeSkill, 
    searchSkills, searchResults, isSearching 
  } = useSkills();
  const { 
    resume, analysis, isLoading: isFetchingResume, isUploading: isUploadingResume, isAnalyzing,
    uploadResume, deleteResume, getDownloadUrl, analyzeResume
  } = useResume();
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  
  const avatarInputRef = useRef(null);
  const resumeInputRef = useRef(null);
  
  // Local state for edits
  const [formData, setFormData] = useState({});

  // Skill input state
  const [skillInput, setSkillInput] = useState('');
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  const [skillError, setSkillError] = useState(null);

  // Resume state
  const [resumeActionError, setResumeActionError] = useState(null);
  const [resumeActionSuccess, setResumeActionSuccess] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        department: profile.department || '',
        graduation_year: profile.graduation_year || '',
        // Student specific
        portfolio_url: subProfile?.portfolio_url || '',
        github_url: subProfile?.github_url || '',
        // Alumni specific
        company: subProfile?.company || '',
        job_role: subProfile?.job_role || '',
        industry: subProfile?.industry || '',
        years_of_experience: subProfile?.years_of_experience || ''
      });
    }
  }, [profile, subProfile]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSaveMessage(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const baseData = {};
      if (profile.role !== 'visitor') {
        baseData.department = formData.department;
        baseData.graduation_year = parseInt(formData.graduation_year, 10) || null;
      }

      let subData = null;
      if (profile.role === 'student') {
        subData = {
          portfolio_url: formData.portfolio_url,
          github_url: formData.github_url
        };
      } else if (profile.role === 'alumni') {
        subData = {
          company: formData.company,
          job_role: formData.job_role,
          industry: formData.industry,
          years_of_experience: parseInt(formData.years_of_experience, 10) || 0
        };
      }

      await updateProfile(baseData, subData);
      setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setSaveMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setAvatarError(null);
    try {
      await uploadAvatar(file);
    } catch (err) {
      setAvatarError(err.message || 'Failed to upload avatar.');
    } finally {
      setIsUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  // --- Skills Logic ---
  const handleSkillInputChange = (e) => {
    const val = e.target.value;
    setSkillInput(val);
    setSkillError(null);
    if (val.trim()) {
      searchSkills(val);
      setShowSkillDropdown(true);
    } else {
      setShowSkillDropdown(false);
    }
  };

  const handleAddSkill = async (skillName) => {
    try {
      await addSkill(skillName);
      setSkillInput('');
      setShowSkillDropdown(false);
      setSkillError(null);
    } catch (err) {
      setSkillError(err.message);
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      handleAddSkill(skillInput.trim());
    }
  };

  // --- Resume Logic ---
  const handleResumeClick = () => {
    resumeInputRef.current?.click();
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setResumeActionError(null);
    setResumeActionSuccess(null);
    try {
      await uploadResume(file);
      setResumeActionSuccess('Resume uploaded successfully!');
    } catch (err) {
      setResumeActionError(err.message || 'Failed to upload resume.');
    } finally {
      if (resumeInputRef.current) resumeInputRef.current.value = '';
    }
  };

  const handleResumeDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) return;
    setResumeActionError(null);
    setResumeActionSuccess(null);
    try {
      await deleteResume();
      setResumeActionSuccess('Resume deleted successfully.');
    } catch (err) {
      setResumeActionError(err.message || 'Failed to delete resume.');
    }
  };

  const handleResumeView = async () => {
    try {
      const url = await getDownloadUrl();
      window.open(url, '_blank');
    } catch (err) {
      setResumeActionError('Could not open resume.');
    }
  };

  const handleResumeDownload = async () => {
    try {
      const url = await getDownloadUrl();
      const a = document.createElement('a');
      a.href = url;
      a.download = `Resume_${profile.full_name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      setResumeActionError('Could not download resume.');
    }
  };

  const handleAnalyzeResume = async () => {
    try {
      await analyzeResume();
      setToast({ type: 'success', message: 'Resume analysis complete!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Analysis failed' });
    }
  };


  if (isFetchingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (fetchProfileError || !profile) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-text-main">Failed to load profile</h2>
        <p className="text-text-secondary mt-2">{fetchProfileError}</p>
      </div>
    );
  }

  const role = profile.role;

  return (
    <div className="pb-14 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-[32px] font-extrabold text-text-main mb-1.5" style={{ letterSpacing: '-0.03em' }}>
            My Profile
          </h1>
          <p className="text-[14px] text-text-secondary leading-relaxed">
            Manage your personal information and settings.
          </p>
        </div>
        <Badge variant={role === 'student' ? 'primary' : role === 'alumni' ? 'success' : 'secondary'} className="px-4 py-2 text-[12px] uppercase tracking-widest font-bold rounded-full">
          {role} Account
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Basic Info Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="overflow-hidden relative" style={{ boxShadow: '0 4px 28px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)' }}>
            {/* Cover */}
            <div className="h-[140px] relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #1a1230 0%, #0f2444 50%, #1a1230 100%)' }}>
              <div className="absolute inset-0 opacity-30"
                style={{ background: 'radial-gradient(ellipse at 30% 50%, #F59E0B 0%, transparent 60%)' }} />
              <div className="absolute inset-0 opacity-20"
                style={{ background: 'radial-gradient(ellipse at 80% 30%, #818cf8 0%, transparent 55%)' }} />
            </div>
            {/* Body */}
            <div className="px-7 pb-7">
              <div className="relative -mt-14 flex flex-col sm:flex-row gap-5 items-start sm:items-end">
                <div className="relative shrink-0">
                  <Avatar
                    src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=random`}
                    size="xl"
                    className="w-[110px] h-[110px] border-[4px] border-white shadow-[0_4px_16px_rgba(0,0,0,0.14)]" 
                  />
                  <button
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar}
                    className="absolute bottom-1.5 right-1.5 p-1.5 bg-white rounded-full shadow-md border border-[rgba(0,0,0,0.08)] text-text-secondary hover:text-primary hover:scale-110 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploadingAvatar ? <Loader2 size={15} className="animate-spin" /> : <Camera size={15} />}
                  </button>
                  <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleAvatarChange}
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                  />
                </div>
                <div className="flex-1 pb-1">
                  <h2 className="text-[22px] font-extrabold text-text-main" style={{ letterSpacing: '-0.025em' }}>{profile.full_name}</h2>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[13px] text-text-secondary">
                    <div className="flex items-center gap-1.5">
                      <Mail size={13} className="text-primary/60" /> {profile.email}
                    </div>
                    {profile.department && (
                      <div className="flex items-center gap-1.5">
                        <GraduationCap size={13} className="text-primary/60" /> {profile.department}
                      </div>
                    )}
                  </div>
                  {avatarError && (
                    <p className="text-red-500 text-[12px] mt-2 font-semibold">{avatarError}</p>
                  )}
                </div>
                <Button
                  onClick={handleSave}
                  isLoading={isSaving}
                  className="shrink-0 mb-1"
                >
                  Save Changes
                </Button>
              </div>

              {saveMessage && (
                <div className={`mt-5 p-3.5 rounded-[14px] flex items-center gap-2.5 text-[13px] font-semibold ${
                  saveMessage.type === 'success'
                    ? 'bg-success/[0.09] text-success border border-success/[0.18]'
                    : 'bg-red-50 text-red-600 border border-red-200/60'
                }`}>
                  {saveMessage.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                  {saveMessage.text}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Detailed Info Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-bold text-text-main mb-5">
              {role === 'visitor' ? 'Basic Details' : role === 'student' ? 'Academic & Resume Details' : 'Professional Details'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {role !== 'visitor' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Department</label>
                    <Input name="department" value={formData.department} onChange={handleChange} leftIcon={<GraduationCap size={16} />} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Graduation Year</label>
                    <Input name="graduation_year" value={formData.graduation_year} onChange={handleChange} leftIcon={<User size={16} />} type="number" />
                  </div>
                </>
              )}

              {role === 'student' && (
                <>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Github / Portfolio URL</label>
                    <Input name="portfolio_url" value={formData.portfolio_url} onChange={handleChange} leftIcon={<LinkIcon size={16} />} placeholder="https://github.com/..." />
                  </div>
                </>
              )}

              {role === 'alumni' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Current Company</label>
                    <Input name="company" value={formData.company} onChange={handleChange} leftIcon={<Building2 size={16} />} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Job Role</label>
                    <Input name="job_role" value={formData.job_role} onChange={handleChange} leftIcon={<Briefcase size={16} />} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Industry</label>
                    <Input name="industry" value={formData.industry} onChange={handleChange} leftIcon={<Building2 size={16} />} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Years of Experience</label>
                    <Input name="years_of_experience" value={formData.years_of_experience} onChange={handleChange} leftIcon={<User size={16} />} type="number" />
                  </div>
                </>
              )}

              {role === 'visitor' && (
                <div className="md:col-span-2 text-sm text-text-secondary">
                  Your visitor account does not require academic or professional details. You can explore public events and profiles.
                </div>
              )}
            </div>

            {/* SKILLS SECTION */}
            {role !== 'visitor' && (
              <div className="space-y-4">
                <h4 className="text-[15px] font-bold text-text-main">Skills</h4>
                
                {isFetchingSkills ? (
                  <div className="flex items-center gap-2 text-text-secondary text-sm">
                    <Loader2 size={16} className="animate-spin" /> Loading skills...
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 items-center">
                    {skills.map((skill) => (
                      <Badge key={skill.id} variant="primary" className="px-3 py-1 text-sm bg-primary/10 text-primary border border-primary/20 flex items-center gap-1.5 group">
                        {skill.name}
                        <button 
                          onClick={() => removeSkill(skill.id)}
                          className="hover:bg-primary/20 rounded-full p-0.5 transition-colors text-primary/70 hover:text-primary"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                    
                    <div className="relative">
                      <div className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-text-secondary border border-dashed border-border hover:border-primary focus-within:border-primary focus-within:text-primary transition-colors bg-white relative z-20">
                        <Plus size={14} /> 
                        <input
                          type="text"
                          value={skillInput}
                          onChange={handleSkillInputChange}
                          onKeyDown={handleSkillKeyDown}
                          onFocus={() => { if(skillInput.trim()) setShowSkillDropdown(true) }}
                          onBlur={() => setTimeout(() => setShowSkillDropdown(false), 200)}
                          placeholder="Add Skill..."
                          className="bg-transparent border-none outline-none w-24 focus:w-32 transition-all placeholder:text-text-secondary/70 text-text-main"
                        />
                      </div>

                      {/* Autocomplete Dropdown */}
                      <AnimatePresence>
                        {showSkillDropdown && (
                          <motion.div 
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute top-full left-0 mt-1 w-48 bg-white border border-border rounded-xl shadow-lg z-30 overflow-hidden"
                          >
                            {isSearching ? (
                              <div className="p-3 text-xs text-text-secondary flex items-center gap-2">
                                <Loader2 size={12} className="animate-spin" /> Searching...
                              </div>
                            ) : searchResults.length > 0 ? (
                              <div className="max-h-48 overflow-y-auto">
                                {searchResults.map(s => (
                                  <button
                                    key={s.id}
                                    onClick={() => handleAddSkill(s.name)}
                                    className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-secondary transition-colors"
                                  >
                                    {s.name}
                                  </button>
                                ))}
                                <button
                                    onClick={() => handleAddSkill(skillInput)}
                                    className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary/5 transition-colors border-t border-border font-medium"
                                  >
                                    Add "{skillInput}"
                                  </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddSkill(skillInput)}
                                className="w-full text-left px-4 py-3 text-sm text-primary hover:bg-primary/5 transition-colors font-medium flex items-center gap-2"
                              >
                                <Plus size={14} /> Create "{skillInput}"
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
                {skillError && <p className="text-xs text-red-500 font-medium mt-1">{skillError}</p>}
              </div>
            )}

            {/* RESUME SECTION */}
            {role === 'student' && (
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[15px] font-bold text-text-main">Resume</h4>
                  <input 
                    type="file" 
                    ref={resumeInputRef}
                    onChange={handleResumeChange}
                    accept="application/pdf"
                    className="hidden"
                  />
                  {!resume && !isFetchingResume && (
                     <Button 
                        onClick={handleResumeClick} 
                        isLoading={isUploadingResume}
                        variant="outline" 
                        className="h-8 px-3 text-xs"
                        leftIcon={<Upload size={14} />}
                      >
                        Upload Resume
                      </Button>
                  )}
                </div>

                {isFetchingResume ? (
                  <div className="flex items-center justify-center p-6 rounded-xl border border-dashed border-border bg-secondary/30">
                    <Loader2 className="w-6 h-6 animate-spin text-text-secondary" />
                  </div>
                ) : resume ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-secondary/50 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                          <FileText size={20} />
                        </div>
                        <div>
                          <p className="text-[14px] font-semibold text-text-main truncate max-w-[200px] sm:max-w-xs" title={resume.file_url.split('/').pop()}>
                            {resume.file_url.split('/').pop()}
                          </p>
                          <p className="text-[12px] text-text-secondary flex items-center gap-1.5 mt-0.5">
                            Uploaded {new Date(resume.created_at).toLocaleDateString()} 
                            <span className="w-1 h-1 rounded-full bg-border" /> 
                            PDF
                            {resume.is_primary && (
                               <>
                                <span className="w-1 h-1 rounded-full bg-border" /> 
                                <span className="text-primary font-medium">Primary</span>
                               </>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 shrink-0">
                        <Button onClick={handleResumeView} variant="ghost" className="h-8 w-8 p-0" title="View"><Eye size={16} /></Button>
                        <Button onClick={handleResumeDownload} variant="ghost" className="h-8 w-8 p-0" title="Download"><Download size={16} /></Button>
                        <Button onClick={handleResumeClick} isLoading={isUploadingResume} variant="outline" className="h-8 px-3 text-xs">Replace</Button>
                        <Button onClick={handleResumeDelete} variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 size={16} /></Button>
                      </div>
                    </div>
                    
                    {/* Premium AI Resume Analysis Widget */}
                    <div className="mt-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-white to-primary/5 overflow-hidden shadow-soft relative">
                      {/* Ambient background glow */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
                      
                      <div className="p-6 relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-btn-primary">
                               <Sparkles size={20} />
                            </div>
                            <div>
                              <h5 className="text-[18px] font-extrabold text-text-main tracking-tight">AI Resume Analyzer</h5>
                              <p className="text-[13px] text-text-secondary font-medium mt-0.5">Get instant feedback to beat the ATS</p>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={handleAnalyzeResume} 
                            isLoading={isAnalyzing}
                            className="shrink-0 shadow-btn-primary"
                            leftIcon={<Brain size={16} />}
                          >
                            Analyze Resume
                          </Button>
                        </div>

                        <AnimatePresence mode="wait">
                          {isAnalyzing ? (
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
                                <p className="text-[15px] font-bold text-text-main">Analyzing your resume...</p>
                                <p className="text-[13px] text-text-secondary">Extracting skills, evaluating ATS score, and generating feedback.</p>
                              </div>
                            </motion.div>
                          ) : analysis?.feedback_json ? (
                            <motion.div 
                              key="analysis"
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                              className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                              {/* Left Column: ATS Score & Summary */}
                              <div className="space-y-6">
                                <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-border shadow-sm text-center relative overflow-hidden group">
                                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                  <h6 className="text-[13px] font-bold text-text-secondary uppercase tracking-wider mb-4">ATS Match Score</h6>
                                  <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                      <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="8" />
                                      <motion.circle 
                                        cx="50" cy="50" r="40" fill="none" 
                                        stroke={analysis.overall_score >= 80 ? '#22C55E' : analysis.overall_score >= 60 ? '#F59E0B' : '#EF4444'} 
                                        strokeWidth="8" strokeLinecap="round"
                                        strokeDasharray="251.2"
                                        initial={{ strokeDashoffset: 251.2 }}
                                        animate={{ strokeDashoffset: 251.2 - (251.2 * analysis.overall_score) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                      />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                      <span className="text-3xl font-extrabold text-text-main leading-none">{analysis.overall_score}</span>
                                      <span className="text-[10px] font-bold text-text-secondary">/ 100</span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-border shadow-sm">
                                  <h6 className="text-[13px] font-bold text-text-main flex items-center gap-1.5 mb-2">
                                    <Target size={14} className="text-primary" /> Professional Summary
                                  </h6>
                                  <p className="text-[13px] text-text-secondary leading-relaxed">
                                    {analysis.feedback_json.summary}
                                  </p>
                                </div>
                              </div>

                              {/* Right Column: Strengths & Weaknesses */}
                              <div className="md:col-span-2 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-border shadow-sm">
                                    <h6 className="text-[13px] font-bold text-success flex items-center gap-1.5 mb-3">
                                      <CheckCircle size={14} /> Key Strengths
                                    </h6>
                                    <ul className="space-y-2">
                                      {analysis.feedback_json.strengths?.map((item, i) => (
                                        <li key={i} className="text-[12px] text-text-secondary flex items-start gap-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-success/60 mt-1.5 shrink-0" />
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                  
                                  <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-border shadow-sm">
                                    <h6 className="text-[13px] font-bold text-red-500 flex items-center gap-1.5 mb-3">
                                      <AlertCircle size={14} /> Missing Skills
                                    </h6>
                                    <ul className="space-y-2">
                                      {analysis.feedback_json.missingSkills?.map((item, i) => (
                                        <li key={i} className="text-[12px] text-text-secondary flex items-start gap-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 mt-1.5 shrink-0" />
                                          {item}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                <div className="bg-white/60 backdrop-blur-md rounded-xl p-5 border border-border shadow-sm">
                                  <h6 className="text-[13px] font-bold text-primary flex items-center gap-1.5 mb-3">
                                    <Zap size={14} /> Improvement Suggestions
                                  </h6>
                                  <ul className="space-y-2.5">
                                    {analysis.feedback_json.suggestions?.map((item, i) => (
                                      <li key={i} className="text-[13px] text-text-main flex items-start gap-2.5 bg-primary/5 p-2.5 rounded-lg border border-primary/10">
                                        <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                          {i + 1}
                                        </span>
                                        {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="empty"
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              className="py-10 text-center bg-white/40 rounded-xl border border-dashed border-primary/20"
                            >
                              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                                <Brain size={24} />
                              </div>
                              <p className="text-[14px] font-bold text-text-main mb-1">Unlock AI Insights</p>
                              <p className="text-[13px] text-text-secondary max-w-sm mx-auto">
                                Click analyze to get a comprehensive breakdown of your resume's ATS score, strengths, and areas for improvement.
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border bg-secondary/30 text-center">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                      <FileSearch size={24} className="text-text-secondary/60" />
                    </div>
                    <p className="text-[14px] font-medium text-text-main mb-1">No resume uploaded</p>
                    <p className="text-[13px] text-text-secondary mb-4 max-w-sm">
                      Upload your resume in PDF format (max 5MB) to share with alumni and get AI feedback.
                    </p>
                    <Button 
                      onClick={handleResumeClick} 
                      isLoading={isUploadingResume}
                      variant="outline" 
                      leftIcon={<Upload size={16} />}
                    >
                      Browse Files
                    </Button>
                  </div>
                )}
                
                {resumeActionError && (
                  <p className="text-red-500 text-xs mt-3 font-medium flex items-center gap-1.5"><AlertCircle size={14} /> {resumeActionError}</p>
                )}
                {resumeActionSuccess && (
                  <p className="text-success text-xs mt-3 font-medium flex items-center gap-1.5"><CheckCircle size={14} /> {resumeActionSuccess}</p>
                )}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

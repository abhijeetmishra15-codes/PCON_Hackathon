import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Building2, Briefcase, GraduationCap, 
  MapPin, Link as LinkIcon, Camera, Plus, FileText, Loader2, AlertCircle, CheckCircle,
  X, Upload, Download, Eye, Trash2, ShieldCheck, FileSearch
} from 'lucide-react';
import { Card, Button, Input, Badge, Avatar } from '../components/ui';
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
    resume, analysis, isLoading: isFetchingResume, isUploading: isUploadingResume, 
    uploadResume, deleteResume, getDownloadUrl 
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-7 gap-4">
        <div>
          <h1 className="text-[30px] font-extrabold tracking-tight text-text-main mb-1">
            My Profile
          </h1>
          <p className="text-[14px] text-text-secondary">
            Manage your personal information and settings.
          </p>
        </div>
        <Badge variant={role === 'student' ? 'primary' : role === 'alumni' ? 'success' : 'secondary'} className="px-3 py-1.5 text-sm uppercase tracking-wider font-bold">
          {role} Account
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Basic Info Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="p-6 bg-white overflow-hidden relative">
            <div className="h-32 bg-primary/10 absolute top-0 left-0 right-0" />
            <div className="relative mt-12 flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              <div className="relative">
                <Avatar 
                  src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=random`} 
                  size="xl" 
                  className="w-28 h-28 border-4 border-white shadow-soft"
                />
                <button 
                  onClick={handleAvatarClick}
                  disabled={isUploadingAvatar}
                  className="absolute bottom-1 right-1 p-1.5 bg-white rounded-full shadow-sm border border-border text-text-secondary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingAvatar ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                </button>
                <input 
                  type="file" 
                  ref={avatarInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/jpeg,image/png,image/webp" 
                  className="hidden" 
                />
              </div>
              <div className="flex-1 pb-2">
                <h2 className="text-2xl font-bold text-text-main">{profile.full_name}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <Mail size={15} /> {profile.email}
                  </div>
                  {profile.department && (
                    <div className="flex items-center gap-1.5">
                      <GraduationCap size={15} /> {profile.department}
                    </div>
                  )}
                </div>
                {avatarError && (
                  <p className="text-red-500 text-xs mt-2 font-medium">{avatarError}</p>
                )}
              </div>
              <Button 
                onClick={handleSave} 
                isLoading={isSaving}
                className="shrink-0 mb-2"
              >
                Save Changes
              </Button>
            </div>
            
            {saveMessage && (
              <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${
                saveMessage.type === 'success' ? 'bg-success/10 text-success border border-success/20' : 'bg-red-50 text-red-600 border border-red-200'
              }`}>
                {saveMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {saveMessage.text}
              </div>
            )}
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
                    
                    {/* Resume Analysis Widget */}
                    <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                           <ShieldCheck size={16} />
                        </div>
                        <div>
                          <h5 className="text-[14px] font-bold text-primary mb-1">AI Resume Analysis</h5>
                          {analysis ? (
                             <>
                               <div className="flex items-baseline gap-2 mb-2">
                                  <span className="text-2xl font-extrabold text-text-main">{analysis.overall_score}</span>
                                  <span className="text-xs text-text-secondary font-medium">/ 100 ATS Score</span>
                               </div>
                               <p className="text-[13px] text-text-secondary leading-relaxed">
                                 {analysis.feedback_json?.summary || 'Analysis complete. Great profile!'}
                               </p>
                             </>
                          ) : (
                             <p className="text-[13px] text-text-secondary leading-relaxed">
                               Resume analysis will be available after using the <span className="font-semibold text-primary">AI Resume Analyzer</span> tool.
                             </p>
                          )}
                        </div>
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
    </div>
  );
}

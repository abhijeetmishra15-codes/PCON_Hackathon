import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Building2, Briefcase, GraduationCap, 
  MapPin, Link as LinkIcon, Camera, Plus, FileText, Loader2, AlertCircle, CheckCircle
} from 'lucide-react';
import { Card, Button, Input, Badge, Avatar } from '../components/ui';
import { useProfile } from '../hooks/useProfile';

export default function Profile() {
  const { profile, subProfile, isLoading: isFetching, error: fetchError, updateProfile, uploadAvatar } = useProfile();
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  
  const fileInputRef = useRef(null);
  
  // Local state for edits
  const [formData, setFormData] = useState({});

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
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      await uploadAvatar(file);
    } catch (err) {
      setUploadError(err.message || 'Failed to upload avatar.');
    } finally {
      setIsUploading(false);
      // Reset input so they can upload same file again if it failed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (fetchError || !profile) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-text-main">Failed to load profile</h2>
        <p className="text-text-secondary mt-2">{fetchError}</p>
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
                  disabled={isUploading}
                  className="absolute bottom-1 right-1 p-1.5 bg-white rounded-full shadow-sm border border-border text-text-secondary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
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
                {uploadError && (
                  <p className="text-red-500 text-xs mt-2 font-medium">{uploadError}</p>
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

            {role !== 'visitor' && (
              <div className="space-y-4">
                <h4 className="text-[15px] font-bold text-text-main">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Node.js', 'Python'].map((skill) => (
                    <Badge key={skill} variant="primary" className="px-3 py-1 text-sm bg-primary/10 text-primary border border-primary/20">
                      {skill}
                    </Badge>
                  ))}
                  <button className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-text-secondary border border-dashed border-border hover:border-primary hover:text-primary transition-colors">
                    <Plus size={14} /> Add Skill
                  </button>
                </div>
              </div>
            )}

            {role === 'student' && (
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-[15px] font-bold text-text-main mb-4">Resume</h4>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-text-main">{profile.full_name.replace(/\s+/g, '_')}_Resume.pdf</p>
                      <p className="text-[12px] text-text-secondary">Updated 2 days ago • 2.4 MB</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="h-8 px-3 text-xs">Update</Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

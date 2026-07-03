import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProfileService, ProfileData, StudentProfileData, AlumniProfileData } from '../lib/services/profile.service';

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [subProfile, setSubProfile] = useState<StudentProfileData | AlumniProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      const { profile: p, subProfile: sp } = await ProfileService.getProfile(user.id);
      setProfile(p as ProfileData);
      setSubProfile(sp);
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (baseData: Partial<ProfileData>, subData?: any) => {
    if (!user || !profile) return;
    try {
      setError(null);
      await ProfileService.updateBaseProfile(user.id, baseData);
      
      if (subData) {
        if (profile.role === 'student') {
          await ProfileService.updateStudentProfile(user.id, subData);
        } else if (profile.role === 'alumni') {
          await ProfileService.updateAlumniProfile(user.id, subData);
        }
      }

      // Optimistic update
      setProfile(prev => prev ? { ...prev, ...baseData } : null);
      if (subData) {
        setSubProfile(prev => prev ? { ...prev, ...subData } : null);
      }
      
    } catch (err: any) {
      throw new Error(err.message || 'Failed to update profile');
    }
  };

  const validateAndUploadAvatar = async (file: File) => {
    if (!user || !profile) return;
    
    // Validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.');
    }

    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      throw new Error('File size exceeds 2MB limit.');
    }

    try {
      const newAvatarUrl = await ProfileService.uploadAvatar(user.id, file, profile.avatar_url);
      setProfile(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : null);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to upload avatar');
    }
  };

  return {
    profile,
    subProfile,
    isLoading,
    error,
    updateProfile,
    uploadAvatar: validateAndUploadAvatar,
    refreshProfile: fetchProfile
  };
}

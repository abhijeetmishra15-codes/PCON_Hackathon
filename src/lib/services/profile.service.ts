import { supabase } from '../supabase';

export interface ProfileData {
  id: string;
  email: string;
  full_name: string;
  role: 'student' | 'alumni' | 'admin' | 'visitor';
  avatar_url?: string;
  bio?: string;
  department?: string;
  graduation_year?: number;
  linkedin_url?: string;
}

export interface StudentProfileData {
  github_url?: string;
  portfolio_url?: string;
}

export interface AlumniProfileData {
  company: string;
  job_role: string;
  industry: string;
  years_of_experience: number;
  is_verified?: boolean;
}

export const ProfileService = {
  async getProfile(userId: string) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    let subProfile = null;

    if (profile.role === 'student') {
      const { data } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      subProfile = data;
    } else if (profile.role === 'alumni') {
      const { data } = await supabase
        .from('alumni_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      subProfile = data;
    }

    return { profile, subProfile };
  },

  async updateBaseProfile(userId: string, data: Partial<ProfileData>) {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', userId);
    
    if (error) throw error;
  },

  async updateStudentProfile(userId: string, data: Partial<StudentProfileData>) {
    const { error } = await supabase
      .from('student_profiles')
      .update(data)
      .eq('id', userId);
    
    if (error) throw error;
  },

  async updateAlumniProfile(userId: string, data: Partial<AlumniProfileData>) {
    const { error } = await supabase
      .from('alumni_profiles')
      .update(data)
      .eq('id', userId);
    
    if (error) throw error;
  },

  async uploadAvatar(userId: string, file: File, currentAvatarUrl?: string | null) {
    // 1. Delete old avatar if it exists to prevent orphaned files
    if (currentAvatarUrl) {
      try {
        // Extract the file path from the public URL
        const urlParts = currentAvatarUrl.split('/avatars/');
        if (urlParts.length === 2) {
          const oldPath = urlParts[1];
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      } catch (err) {
        console.warn('Failed to delete old avatar:', err);
      }
    }

    // 2. Upload new avatar
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { 
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) throw uploadError;

    // 3. Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // 4. Update profile record
    await this.updateBaseProfile(userId, { avatar_url: publicUrl });

    return publicUrl;
  }
};

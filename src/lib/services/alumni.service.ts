import { supabase } from '../supabase';

export interface AlumniProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  department: string | null;
  graduation_year: number | null;
  company: string;
  job_role: string;
  industry: string;
  years_of_experience: number;
  is_verified: boolean;
  skills: string[];
}

export const AlumniService = {
  async getVerifiedAlumni(): Promise<AlumniProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        avatar_url,
        bio,
        department,
        graduation_year,
        alumni_profiles!inner (
          company,
          job_role,
          industry,
          years_of_experience,
          is_verified
        ),
        user_skills (
          skills (
            name
          )
        )
      `)
      .eq('role', 'alumni')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []).map((row: any) => {
      // Handle array vs single object for alumni_profiles depending on PostgREST configuration
      const alumniProfile = Array.isArray(row.alumni_profiles) ? row.alumni_profiles[0] : row.alumni_profiles;
      
      return {
        id: row.id,
        full_name: row.full_name,
        avatar_url: row.avatar_url,
        bio: row.bio,
        department: row.department,
        graduation_year: row.graduation_year,
        company: alumniProfile?.company || '',
        job_role: alumniProfile?.job_role || '',
        industry: alumniProfile?.industry || '',
        years_of_experience: alumniProfile?.years_of_experience || 0,
        is_verified: alumniProfile?.is_verified || false,
        skills: (row.user_skills || [])
          .map((us: any) => us.skills?.name)
          .filter(Boolean)
      };
    });
  }
};

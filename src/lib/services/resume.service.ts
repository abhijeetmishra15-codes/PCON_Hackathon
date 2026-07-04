import { supabase } from '../supabase';

export interface ResumeData {
  id: string;
  file_url: string; // Storing the storage path here
  is_primary: boolean;
  created_at: string;
}

export interface ResumeAnalysisData {
  overall_score: number;
  feedback_json: any;
}

export const ResumeService = {
  // Fetch user's primary resume
  async getResume(studentId: string): Promise<{ resume: ResumeData | null, analysis: ResumeAnalysisData | null }> {
    const { data: resume, error } = await supabase
      .from('resumes')
      .select('id, file_url, is_primary, created_at')
      .eq('student_id', studentId)
      .eq('is_primary', true)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!resume) {
      return { resume: null, analysis: null };
    }

    // Fetch analysis if exists
    const { data: analysis } = await supabase
      .from('resume_analysis')
      .select('overall_score, feedback_json')
      .eq('resume_id', resume.id)
      .maybeSingle();

    return { resume, analysis: analysis || null };
  },

  // Upload or replace resume
  async uploadResume(studentId: string, file: File, currentResume?: ResumeData | null): Promise<ResumeData> {
    // 1. Validate file
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds 5MB limit');
    }

    // 2. Delete old resume from storage if exists
    if (currentResume && currentResume.file_url) {
      try {
        await supabase.storage.from('resumes').remove([currentResume.file_url]);
        // Delete the old record
        await supabase.from('resumes').delete().eq('id', currentResume.id);
      } catch (err) {
        console.warn('Failed to clean up old resume:', err);
      }
    }

    // 3. Upload new file
    const fileExt = file.name.split('.').pop();
    const fileName = `${studentId}/resume-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, { 
        upsert: true,
        contentType: 'application/pdf'
      });

    if (uploadError) throw uploadError;

    // 4. Insert new record
    const { data: newResume, error: dbError } = await supabase
      .from('resumes')
      .insert([{ 
        student_id: studentId, 
        file_url: fileName,
        is_primary: true
      }])
      .select('id, file_url, is_primary, created_at')
      .single();

    if (dbError) throw dbError;

    return newResume;
  },

  // Get a signed URL for viewing/downloading since the bucket is private
  async getResumeDownloadUrl(filePath: string): Promise<string> {
     const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry
      
     if (error) throw error;
     return data.signedUrl;
  },

  async deleteResume(resume: ResumeData): Promise<void> {
    // 1. Delete from storage
    try {
      await supabase.storage.from('resumes').remove([resume.file_url]);
    } catch (err) {
      console.warn('Failed to delete resume from storage:', err);
    }

    // 2. Delete from DB
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resume.id);

    if (error) throw error;
  },

  async analyzeResume(resumeId: string, fileUrl: string): Promise<ResumeAnalysisData> {
    const { data, error } = await supabase.functions.invoke('analyze-resume', {
      body: { resumeId, fileUrl }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to analyze resume');
    }
    
    if (data.error) {
       throw new Error(data.error);
    }

    return data;
  },

  async analyzeJobMatch(resumeId: string, fileUrl: string, jobTitle: string, jobDescription: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('analyze-resume', {
      body: { resumeId, fileUrl, jobTitle, jobDescription }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Failed to analyze job match');
    }
    
    if (data.error) {
       throw new Error(data.error);
    }

    return data;
  }
};

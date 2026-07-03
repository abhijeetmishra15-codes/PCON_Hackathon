import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ResumeService, ResumeData, ResumeAnalysisData } from '../lib/services/resume.service';

export function useResume() {
  const { user } = useAuth();
  
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysisData | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResume = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      setError(null);
      const { resume: fetchedResume, analysis: fetchedAnalysis } = await ResumeService.getResume(user.id);
      setResume(fetchedResume);
      setAnalysis(fetchedAnalysis);
    } catch (err: any) {
      setError(err.message || 'Failed to load resume');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const uploadResume = async (file: File) => {
    if (!user) return;
    
    setIsUploading(true);
    setError(null);
    try {
      const newResume = await ResumeService.uploadResume(user.id, file, resume);
      setResume(newResume);
      setAnalysis(null); // Reset analysis as it's a new resume
    } catch (err: any) {
      throw new Error(err.message || 'Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteResume = async () => {
    if (!user || !resume) return;
    
    try {
      await ResumeService.deleteResume(resume);
      setResume(null);
      setAnalysis(null);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete resume');
    }
  };

  const getDownloadUrl = async () => {
    if (!resume) throw new Error('No resume found');
    try {
      return await ResumeService.getResumeDownloadUrl(resume.file_url);
    } catch (err: any) {
      throw new Error(err.message || 'Failed to generate download link');
    }
  };

  return {
    resume,
    analysis,
    isLoading,
    isUploading,
    error,
    uploadResume,
    deleteResume,
    getDownloadUrl,
    refreshResume: fetchResume
  };
}

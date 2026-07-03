import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { SkillsService, Skill } from '../lib/services/skills.service';

export function useSkills() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchResults, setSearchResults] = useState<Skill[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const fetchSkills = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const data = await SkillsService.getUserSkills(user.id);
      setSkills(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load skills');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const searchSkills = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const results = await SkillsService.searchSkills(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Failed to search skills', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const addSkill = async (skillName: string) => {
    if (!user) return;
    const trimmed = skillName.trim();
    if (!trimmed) return;
    
    // Optimistically check if already added (case insensitive)
    if (skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error('Skill already added');
    }

    try {
      const newSkill = await SkillsService.addSkillToUser(user.id, trimmed);
      
      // Update local state if it's really new to us
      setSkills(prev => {
        if (prev.some(s => s.id === newSkill.id)) return prev;
        return [...prev, newSkill];
      });
      
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add skill');
    }
  };

  const removeSkill = async (skillId: string) => {
    if (!user) return;
    
    // Optimistic update
    const previousSkills = [...skills];
    setSkills(prev => prev.filter(s => s.id !== skillId));
    
    try {
      await SkillsService.removeSkillFromUser(user.id, skillId);
    } catch (err: any) {
      // Revert on error
      setSkills(previousSkills);
      throw new Error(err.message || 'Failed to remove skill');
    }
  };

  return {
    skills,
    isLoading,
    error,
    searchResults,
    isSearching,
    searchSkills,
    addSkill,
    removeSkill
  };
}

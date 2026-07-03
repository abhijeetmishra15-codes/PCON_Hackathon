import { useState, useEffect, useCallback, useMemo } from 'react';
import { AlumniService, AlumniProfile } from '../lib/services/alumni.service';

export function useAlumni() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndustryFilter, setActiveIndustryFilter] = useState('All');
  
  // You can extend these to support multiple filter types later if needed
  // For the MVP, we use the industry filter as a primary category

  const fetchAlumni = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await AlumniService.getVerifiedAlumni();
      setAlumni(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch alumni directory');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  // Derived state for filtered alumni
  const filteredAlumni = useMemo(() => {
    return alumni.filter((person) => {
      // 1. Search Query (Name, Company, Job Role)
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        person.full_name.toLowerCase().includes(query) ||
        person.company.toLowerCase().includes(query) ||
        person.job_role.toLowerCase().includes(query) ||
        person.skills.some(skill => skill.toLowerCase().includes(query));

      // 2. Industry Filter
      // The predefined filters in Discover.jsx could map to industry
      // Note: 'All' bypasses this filter
      let matchesIndustry = true;
      if (activeIndustryFilter !== 'All') {
        // Simple case-insensitive matching for hackathon MVP
        // You could map specific industries to tags like "FAANG", "Startups" etc.
        // For simplicity, we assume the active filter name matches the industry string in DB somewhat closely.
        matchesIndustry = person.industry.toLowerCase().includes(activeIndustryFilter.toLowerCase());
      }

      return matchesSearch && matchesIndustry;
    });
  }, [alumni, searchQuery, activeIndustryFilter]);

  // Derive available industries from the fetched data dynamically
  const availableIndustries = useMemo(() => {
    const industries = new Set(alumni.map(a => a.industry).filter(Boolean));
    return ['All', ...Array.from(industries)].slice(0, 6); // Limit to top for UI
  }, [alumni]);

  return {
    alumni: filteredAlumni,
    totalAlumniCount: alumni.length,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    activeIndustryFilter,
    setActiveIndustryFilter,
    availableIndustries,
    refreshData: fetchAlumni
  };
}

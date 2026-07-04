import { useState, useEffect, useCallback, useMemo } from 'react';
import { AlumniService, AlumniProfile } from '../lib/services/alumni.service';

export function useAlumni() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndustryFilter, setActiveIndustryFilter] = useState('All');
  
  const [companyFilter, setCompanyFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');

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
        person.full_name?.toLowerCase().includes(query) ||
        person.company?.toLowerCase().includes(query) ||
        person.job_role?.toLowerCase().includes(query) ||
        person.skills?.some(skill => skill.toLowerCase().includes(query));

      // 2. Industry Filter
      let matchesIndustry = true;
      if (activeIndustryFilter !== 'All') {
        matchesIndustry = person.industry?.toLowerCase().includes(activeIndustryFilter.toLowerCase());
      }

      // 3. Exact Match Filters
      const matchesCompany = companyFilter === 'All' || person.company === companyFilter;
      const matchesRole = roleFilter === 'All' || person.job_role === roleFilter;
      const matchesDept = departmentFilter === 'All' || person.department === departmentFilter;
      const matchesBatch = batchFilter === 'All' || person.graduation_year?.toString() === batchFilter?.toString();

      return matchesSearch && matchesIndustry && matchesCompany && matchesRole && matchesDept && matchesBatch;
    });
  }, [alumni, searchQuery, activeIndustryFilter, companyFilter, roleFilter, departmentFilter, batchFilter]);

  // Derive available filter options dynamically
  const availableIndustries = useMemo(() => {
    const industries = new Set(alumni.map(a => a.industry).filter(Boolean));
    return ['All', ...Array.from(industries)].slice(0, 6); // Limit top industries
  }, [alumni]);

  const availableCompanies = useMemo(() => {
    const companies = new Set(alumni.map(a => a.company).filter(Boolean));
    return ['All', ...Array.from(companies)].sort();
  }, [alumni]);

  const availableRoles = useMemo(() => {
    const roles = new Set(alumni.map(a => a.job_role).filter(Boolean));
    return ['All', ...Array.from(roles)].sort();
  }, [alumni]);

  const availableDepartments = useMemo(() => {
    const deps = new Set(alumni.map(a => a.department).filter(Boolean));
    return ['All', ...Array.from(deps)].sort();
  }, [alumni]);

  const availableBatches = useMemo(() => {
    const batches = new Set(alumni.map(a => a.graduation_year).filter(Boolean));
    return ['All', ...Array.from(batches)].sort((a, b) => Number(b) - Number(a)); // Descending
  }, [alumni]);

  const clearFilters = () => {
    setSearchQuery('');
    setActiveIndustryFilter('All');
    setCompanyFilter('All');
    setRoleFilter('All');
    setDepartmentFilter('All');
    setBatchFilter('All');
  };

  return {
    alumni: filteredAlumni,
    totalAlumniCount: alumni.length,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    
    activeIndustryFilter,
    setActiveIndustryFilter,
    companyFilter,
    setCompanyFilter,
    roleFilter,
    setRoleFilter,
    departmentFilter,
    setDepartmentFilter,
    batchFilter,
    setBatchFilter,

    availableIndustries,
    availableCompanies,
    availableRoles,
    availableDepartments,
    availableBatches,
    
    clearFilters,
    refreshData: fetchAlumni
  };
}

import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input, Button } from '../ui';

const JOB_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'internship', label: 'Internship' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'full_time', label: 'Full Time' },
  { value: 'referral_only', label: 'Referral Only' }
];

const WORK_MODES = [
  { value: '', label: 'All Modes' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'Onsite' }
];

export default function OpportunityFilters({ filters, onFilterChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  const handleClear = () => {
    onFilterChange({
      search: '',
      location: '',
      workMode: '',
      jobType: ''
    });
  };

  const hasActiveFilters = filters.search || filters.location || filters.workMode || filters.jobType;

  return (
    <div className="bg-white rounded-2xl p-5 border border-border/60 shadow-sm sticky top-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-text-main flex items-center gap-2">
          <Filter size={18} className="text-primary" />
          Filters
        </h3>
        {hasActiveFilters && (
          <button 
            onClick={handleClear}
            className="text-[12px] text-text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Search */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-text-secondary pl-1">
            Search
          </label>
          <Input
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Role or company..."
            icon={<Search size={16} />}
          />
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-text-secondary pl-1">
            Location
          </label>
          <Input
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="City or remote..."
          />
        </div>

        {/* Job Type */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-text-secondary pl-1">
            Job Type
          </label>
          <div className="flex flex-col gap-2 mt-2">
            {JOB_TYPES.map(type => (
              <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <input
                    type="radio"
                    name="jobType"
                    value={type.value}
                    checked={filters.jobType === type.value}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 rounded-full border border-border peer-checked:border-primary peer-checked:bg-primary transition-colors" />
                  <div className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-[14px] text-text-secondary group-hover:text-text-main transition-colors">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Work Mode */}
        <div className="space-y-1.5 pt-2 border-t border-border/50">
          <label className="text-[13px] font-medium text-text-secondary pl-1">
            Work Mode
          </label>
          <div className="flex flex-col gap-2 mt-2">
            {WORK_MODES.map(mode => (
              <label key={mode.value} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <input
                    type="radio"
                    name="workMode"
                    value={mode.value}
                    checked={filters.workMode === mode.value}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 rounded-full border border-border peer-checked:border-primary peer-checked:bg-primary transition-colors" />
                  <div className="absolute w-1.5 h-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-[14px] text-text-secondary group-hover:text-text-main transition-colors">
                  {mode.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

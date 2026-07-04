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
    onFilterChange({ search: '', location: '', workMode: '', jobType: '' });
  };

  const hasActiveFilters = filters.search || filters.location || filters.workMode || filters.jobType;

  return (
    <div className="rounded-[22px] p-6 sticky top-6"
      style={{
        background: 'linear-gradient(145deg, #ffffff 0%, #FAFAF8 100%)',
        border: '1px solid rgba(0,0,0,0.052)',
        boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 20px rgba(0,0,0,0.04)',
      }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-text-main text-[15px] flex items-center gap-2.5" style={{ letterSpacing: '-0.02em' }}>
          <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Filter size={14} className="text-primary" />
          </div>
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="text-[12px] font-semibold text-text-secondary hover:text-primary transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-primary/[0.06]"
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-[0.07em] text-text-secondary/60 pl-0.5">
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
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-[0.07em] text-text-secondary/60 pl-0.5">
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
        <div className="space-y-2 pt-1">
          <label className="text-[11px] font-bold uppercase tracking-[0.07em] text-text-secondary/60 pl-0.5">
            Job Type
          </label>
          <div className="flex flex-col gap-[10px] mt-1">
            {JOB_TYPES.map(type => (
              <label key={type.value} className="flex items-center gap-3 cursor-pointer group py-0.5">
                <div className="relative flex items-center justify-center w-[18px] h-[18px] shrink-0">
                  <input
                    type="radio"
                    name="jobType"
                    value={type.value}
                    checked={filters.jobType === type.value}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-[rgba(0,0,0,0.14)] peer-checked:border-primary peer-checked:bg-primary transition-all duration-150 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]" />
                  <div className="absolute w-[7px] h-[7px] bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-150 shadow-sm" />
                </div>
                <span className="text-[13.5px] font-medium text-text-secondary group-hover:text-text-main transition-colors">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Work Mode */}
        <div className="space-y-2 pt-1" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1.25rem' }}>
          <label className="text-[11px] font-bold uppercase tracking-[0.07em] text-text-secondary/60 pl-0.5">
            Work Mode
          </label>
          <div className="flex flex-col gap-[10px] mt-1">
            {WORK_MODES.map(mode => (
              <label key={mode.value} className="flex items-center gap-3 cursor-pointer group py-0.5">
                <div className="relative flex items-center justify-center w-[18px] h-[18px] shrink-0">
                  <input
                    type="radio"
                    name="workMode"
                    value={mode.value}
                    checked={filters.workMode === mode.value}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="w-[18px] h-[18px] rounded-full border-[1.5px] border-[rgba(0,0,0,0.14)] peer-checked:border-primary peer-checked:bg-primary transition-all duration-150 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]" />
                  <div className="absolute w-[7px] h-[7px] bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-150 shadow-sm" />
                </div>
                <span className="text-[13.5px] font-medium text-text-secondary group-hover:text-text-main transition-colors">
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

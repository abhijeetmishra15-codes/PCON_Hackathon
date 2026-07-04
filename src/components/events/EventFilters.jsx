import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input, Button } from '../ui';

export default function EventFilters({ filters, onFilterChange }) {
  const handleReset = () => {
    onFilterChange({
      search: '',
      mode: '',
      status: 'upcoming'
    });
  };

  const hasActiveFilters = filters.search || filters.mode || filters.status !== 'upcoming';

  return (
    <div className="bg-white p-4 rounded-xl shadow-soft border border-border flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search events by title..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          icon={<Search size={16} />}
          className="w-full"
        />
      </div>
      
      <div className="flex gap-3">
        <select
          className="h-10 px-3 py-2 bg-white border border-border rounded-lg text-[13px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer min-w-[120px]"
          value={filters.mode}
          onChange={(e) => onFilterChange({ ...filters, mode: e.target.value })}
        >
          <option value="">All Modes</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <select
          className="h-10 px-3 py-2 bg-white border border-border rounded-lg text-[13px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer min-w-[120px]"
          value={filters.status}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-[13px] px-3 h-10 flex items-center gap-1.5 text-text-secondary hover:text-danger"
          >
            <X size={14} />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}

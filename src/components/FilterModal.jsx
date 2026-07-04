import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { Button, Modal } from './ui';

export default function FilterModal({
  isOpen,
  onClose,
  companyFilter,
  setCompanyFilter,
  roleFilter,
  setRoleFilter,
  departmentFilter,
  setDepartmentFilter,
  batchFilter,
  setBatchFilter,
  availableCompanies,
  availableRoles,
  availableDepartments,
  availableBatches,
  clearFilters
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Advanced Filters">
      <div className="space-y-6">
        <div>
          <label className="block text-[13px] font-bold text-text-main mb-2">Company</label>
          <select 
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-[14px] text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            {availableCompanies.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'Any Company' : c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-text-main mb-2">Job Role</label>
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-[14px] text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            {availableRoles.map(r => (
              <option key={r} value={r}>{r === 'All' ? 'Any Role' : r}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-text-main mb-2">Department</label>
          <select 
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-[14px] text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            {availableDepartments.map(d => (
              <option key={d} value={d}>{d === 'All' ? 'Any Department' : d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[13px] font-bold text-text-main mb-2">Graduation Batch</label>
          <select 
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="w-full bg-white border border-border rounded-xl px-4 py-2.5 text-[14px] text-text-main focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          >
            {availableBatches.map(b => (
              <option key={b} value={b}>{b === 'All' ? 'Any Batch' : `Class of ${b}`}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-8 border-t border-border pt-5">
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="flex-1"
          leftIcon={<RefreshCcw size={16} />}
        >
          Clear
        </Button>
        <Button onClick={onClose} className="flex-1 shadow-btn-primary">
          Apply Filters
        </Button>
      </div>
    </Modal>
  );
}

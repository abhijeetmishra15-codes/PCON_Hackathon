import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Card, Button, Avatar, Badge, Input } from '../components/ui';
import { useAlumni } from '../hooks/useAlumni';
import { useConnections } from '../hooks/useConnections';
import { useAuth } from '../contexts/AuthContext';
import AlumniProfileModal from '../components/AlumniProfileModal';
import RequestReferralModal from '../components/referrals/RequestReferralModal';
import FilterModal from '../components/FilterModal';
import { useReferrals } from '../hooks/useReferrals';

export default function Discover() {
  const { user } = useAuth();
  const { 
    connectionsMap,
    handleSendRequest,
    handleAcceptRequest,
    handleCancelRequest,
  } = useConnections();

  const { 
    alumni, isLoading, error, 
    searchQuery, setSearchQuery,
    activeIndustryFilter, setActiveIndustryFilter,
    companyFilter, setCompanyFilter,
    roleFilter, setRoleFilter,
    departmentFilter, setDepartmentFilter,
    batchFilter, setBatchFilter,
    availableIndustries, availableCompanies,
    availableRoles, availableDepartments, availableBatches,
    clearFilters
  } = useAlumni();

  const { referralsMap, createReferral } = useReferrals();

  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [referralModalAlumni, setReferralModalAlumni] = useState(null);
  const [isSubmittingReferral, setIsSubmittingReferral] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const handleReferralSubmit = async (data) => {
    setIsSubmittingReferral(true);
    try {
      await createReferral(data);
    } finally {
      setIsSubmittingReferral(false);
    }
  };

  return (
    <div className="pb-14">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-extrabold text-text-main mb-2" style={{ letterSpacing: '-0.03em' }}>
          Discover Alumni
        </h1>
        <p className="text-[14px] text-text-secondary leading-relaxed">
          Find and connect with verified alumni in your desired industry.
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <Input
            placeholder="Search by name, company, or role..."
            leftIcon={<Search size={16} />}
            className="bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          leftIcon={<SlidersHorizontal size={16} />} 
          className="bg-white shrink-0"
          onClick={() => setIsFilterModalOpen(true)}
        >
          Filters
          {(companyFilter !== 'All' || roleFilter !== 'All' || departmentFilter !== 'All' || batchFilter !== 'All') && (
            <span className="ml-2 w-2 h-2 rounded-full bg-primary" style={{ boxShadow: '0 0 6px rgba(245,158,11,0.6)' }} />
          )}
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-7 scrollbar-hide">
        {availableIndustries.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveIndustryFilter(filter)}
            className={[
              'px-4 py-[7px] rounded-full text-[12.5px] font-semibold transition-all duration-[180ms] whitespace-nowrap shrink-0 will-change-transform',
              activeIndustryFilter === filter
                ? 'text-white border border-transparent'
                : 'bg-white text-text-secondary border border-[rgba(0,0,0,0.08)] hover:border-[rgba(245,158,11,0.28)] hover:text-primary hover:bg-[rgba(245,158,11,0.04)] hover:-translate-y-px',
            ].join(' ')}
            style={activeIndustryFilter === filter ? {
              background: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
              boxShadow: '0 2px 10px rgba(245,158,11,0.38), 0 1px 3px rgba(0,0,0,0.08)'
            } : {}}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="p-5 h-[280px] bg-white animate-pulse">
              <div className="flex gap-3.5 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary shrink-0" />
                <div className="flex-1 space-y-2 py-2">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2 mt-8">
                <div className="h-3 bg-secondary rounded w-full" />
                <div className="h-3 bg-secondary rounded w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="text-center py-12 bg-white rounded-2xl border border-red-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-main">Failed to load directory</h2>
          <p className="text-text-secondary mt-2">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && alumni.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-border">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-text-secondary w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-text-main mb-2">No alumni found</h2>
          <p className="text-text-secondary">Try adjusting your search or filters to find more people.</p>
          <Button variant="outline" className="mt-6" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Alumni grid */}
      {!isLoading && !error && alumni.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {alumni.map((person, idx) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.5), type: 'spring', stiffness: 100 }}
            >
              <Card hover className="p-6 flex flex-col h-full group">
                {/* Header */}
                <div className="flex items-start gap-4 mb-5">
                  <div className="relative shrink-0">
                    <Avatar
                      src={person.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.full_name)}&background=random`}
                      size="lg"
                      className="w-[58px] h-[58px] border-[2.5px] border-white ring-2 ring-[rgba(0,0,0,0.06)] group-hover:ring-primary/25 transition-all duration-300"
                    />
                    {person.is_verified && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-[0_1px_4px_rgba(0,0,0,0.12)]">
                        <CheckCircle size={14} className="text-success" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-text-main group-hover:text-primary transition-colors leading-tight truncate" style={{ letterSpacing: '-0.015em' }}>
                      {person.full_name}
                    </h3>
                    <p className="text-[12.5px] text-text-secondary mt-1 truncate">{person.job_role}</p>
                    <Badge
                      variant="primary"
                      className="mt-2.5 bg-primary/[0.09] text-primary border border-primary/[0.18] text-[11px] font-bold px-3"
                    >
                      Class of {person.graduation_year || 'N/A'}
                    </Badge>
                  </div>
                </div>

                {/* Meta */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center gap-2.5 text-[12.5px]">
                    <Building2 size={13} className="text-primary/50 shrink-0" />
                    <span className="font-semibold text-text-main truncate">{person.company || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-[12.5px] text-text-secondary">
                    <MapPin size={13} className="text-primary/50 shrink-0" />
                    <span className="truncate">{person.industry || 'General'}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-auto pt-5 border-t border-[rgba(0,0,0,0.05)]">
                  <div className="flex flex-wrap gap-1.5 mb-4 max-h-[52px] overflow-hidden">
                    {person.skills.length > 0 ? person.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-[4px] rounded-full text-[11px] font-semibold bg-[rgba(245,158,11,0.07)] text-primary border border-[rgba(245,158,11,0.14)] leading-none"
                      >
                        {skill}
                      </span>
                    )) : (
                      <span className="text-[11px] text-text-secondary italic">No skills listed</span>
                    )}
                    {person.skills.length > 4 && (
                      <span className="px-3 py-[4px] rounded-full text-[11px] font-semibold bg-[#F5F0E8] text-text-secondary border border-[rgba(0,0,0,0.06)]">
                        +{person.skills.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {(() => {
                      if (person.id === user?.id) {
                        return <Button disabled className="flex-1 h-9 text-[13px] bg-gray-100 text-gray-400 border-none">You</Button>;
                      }
                      const conn = connectionsMap[person.id];
                      if (!conn) {
                        return (
                          <Button className="flex-1 h-[36px] text-[13px]" onClick={() => handleSendRequest(person.id)}>
                            Connect
                          </Button>
                        );
                      }
                      if (conn.status === 'accepted') {
                        return (
                          <Button disabled className="flex-1 h-[36px] text-[13px] bg-success/[0.09] text-success border-success/20 hover:bg-success/[0.09]">
                            Connected
                          </Button>
                        );
                      }
                      if (conn.status === 'pending') {
                        if (conn.requester_id === user?.id) {
                          return (
                            <Button variant="outline" className="flex-1 h-[36px] text-[13px] text-text-secondary"
                              onClick={() => handleCancelRequest(conn.id, person.id)}>
                              Cancel Request
                            </Button>
                          );
                        } else {
                          return (
                            <Button className="flex-1 h-[36px] text-[13px] bg-[#F5F0E8] text-text-main border-[rgba(0,0,0,0.08)] hover:bg-[#EDE8DF]"
                              onClick={() => handleAcceptRequest(conn.id, person.id)}>
                              Accept Request
                            </Button>
                          );
                        }
                      }
                      return (
                        <Button className="flex-1 h-[36px] text-[13px]" onClick={() => handleSendRequest(person.id)}>
                          Connect
                        </Button>
                      );
                    })()}
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedAlumni(person)}
                      className="flex-1 h-[36px] text-[13px] hover:bg-[#F5F0E8]"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Alumni Details Modal */}
      <AlumniProfileModal 
        isOpen={!!selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
        alumni={selectedAlumni}
        connectionRecord={selectedAlumni ? connectionsMap[selectedAlumni.id] : null}
        referralRecord={selectedAlumni ? referralsMap[selectedAlumni.id] : null}
        currentUserId={user?.id}
        onSendRequest={(id) => handleSendRequest(id)}
        onCancelRequest={(connId, otherId) => handleCancelRequest(connId, otherId)}
        onAcceptRequest={(connId, otherId) => handleAcceptRequest(connId, otherId)}
        onRequestReferral={(alumni) => {
          setSelectedAlumni(null);
          setReferralModalAlumni(alumni);
        }}
      />

      <RequestReferralModal
        isOpen={!!referralModalAlumni}
        onClose={() => setReferralModalAlumni(null)}
        alumni={referralModalAlumni}
        onSubmit={handleReferralSubmit}
        isSubmitting={isSubmittingReferral}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        companyFilter={companyFilter} setCompanyFilter={setCompanyFilter}
        roleFilter={roleFilter} setRoleFilter={setRoleFilter}
        departmentFilter={departmentFilter} setDepartmentFilter={setDepartmentFilter}
        batchFilter={batchFilter} setBatchFilter={setBatchFilter}
        availableCompanies={availableCompanies}
        availableRoles={availableRoles}
        availableDepartments={availableDepartments}
        availableBatches={availableBatches}
        clearFilters={clearFilters}
      />
    </div>
  );
}

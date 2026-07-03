import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOpportunities } from '../hooks/useOpportunities';
import { useReferrals } from '../hooks/useReferrals';
import OpportunityCard from '../components/opportunities/OpportunityCard';
import OpportunityFilters from '../components/opportunities/OpportunityFilters';
import OpportunityModal from '../components/opportunities/OpportunityModal';
import RequestReferralModal from '../components/referrals/RequestReferralModal';
import { LoadingSkeleton, EmptyState, Toast, Button } from '../components/ui';
import { Briefcase } from 'lucide-react';

export default function Opportunities() {
  const { 
    opportunities, 
    loading, 
    error,
    filters,
    applyFilters
  } = useOpportunities();

  const { createReferral, loading: referralLoading } = useReferrals();

  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  
  // Referral flow state
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [referralTarget, setReferralTarget] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Handle clicking an opportunity card
  const handleOpportunityClick = (opp) => {
    setSelectedOpportunity(opp);
  };

  // Close opportunity modal
  const handleCloseModal = () => {
    setSelectedOpportunity(null);
  };

  // Trigger referral flow from opportunity modal
  const handleRequestReferral = (opp) => {
    setReferralTarget(opp);
    setIsReferralModalOpen(true);
  };

  // Submit referral
  const handleReferralSubmit = async (submissionData) => {
    try {
      await createReferral({
        ...submissionData,
        opportunity_id: referralTarget.id
      });
      
      setIsReferralModalOpen(false);
      setToast({
        show: true,
        message: 'Referral request sent successfully!',
        type: 'success'
      });
    } catch (err) {
      console.error(err);
      setToast({
        show: true,
        message: err.message || 'Failed to send referral request',
        type: 'error'
      });
    }
  };

  return (
    <div className="pb-14 flex flex-col md:flex-row gap-6">
      
      {/* Sidebar Filters */}
      <div className="w-full md:w-64 shrink-0">
        <OpportunityFilters 
          filters={filters} 
          onFilterChange={applyFilters} 
        />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-text-main mb-1">Opportunities</h1>
          <p className="text-[14px] text-text-secondary">
            Discover jobs, internships, and referral opportunities posted by alumni.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-[14px]">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-border/60">
                <div className="flex gap-3 mb-4">
                  <LoadingSkeleton className="h-12 w-12 rounded-xl" />
                  <div>
                    <LoadingSkeleton className="h-5 w-40 mb-2" />
                    <LoadingSkeleton className="h-4 w-24" />
                  </div>
                </div>
                <LoadingSkeleton className="h-4 w-full mb-2" />
                <LoadingSkeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : opportunities.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No opportunities found"
            description="Try adjusting your filters or search terms."
            action={
              <Button onClick={() => applyFilters({ search: '', location: '', workMode: '', jobType: '' })}>
                Clear Filters
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {opportunities.map((opp, index) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <OpportunityCard 
                  opportunity={opp} 
                  onClick={() => handleOpportunityClick(opp)} 
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <OpportunityModal
        isOpen={!!selectedOpportunity}
        onClose={handleCloseModal}
        opportunity={selectedOpportunity}
        onRequestReferral={handleRequestReferral}
      />

      <RequestReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => {
          setIsReferralModalOpen(false);
          setReferralTarget(null);
        }}
        alumni={referralTarget?.author}
        initialData={{
          companyName: referralTarget?.company,
          jobTitle: referralTarget?.title,
          jobUrl: referralTarget?.application_url
        }}
        onSubmit={handleReferralSubmit}
        isSubmitting={referralLoading}
      />

      <Toast 
        show={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </div>
  );
}

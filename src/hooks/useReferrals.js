import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ReferralsService } from '../lib/services/referrals.service';

export function useReferrals() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [incomingReferrals, setIncomingReferrals] = useState([]);
  const [outgoingReferrals, setOutgoingReferrals] = useState([]);
  const [referralsMap, setReferralsMap] = useState({}); // { [alumniId]: referralRecord } for quick lookups

  const fetchReferrals = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError(null);

      // We determine the role based on what comes back, or just fetch both
      // For a student, outgoing will have data. For alumni, incoming will have data.
      // Fetching both is safe and handles edge cases where a user might be both (if ever).
      const incoming = await ReferralsService.getIncomingReferrals(user.id);
      const outgoing = await ReferralsService.getOutgoingReferrals(user.id);

      setIncomingReferrals(incoming);
      setOutgoingReferrals(outgoing);

      const newMap = {};
      outgoing.forEach(r => {
        // Keep the most recent request per alumni in the map
        if (!newMap[r.alumni_id] || new Date(r.created_at) > new Date(newMap[r.alumni_id].created_at)) {
          newMap[r.alumni_id] = r;
        }
      });
      setReferralsMap(newMap);
      
    } catch (err) {
      console.error("Failed to fetch referrals:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchReferrals();

    if (!user?.id) return;

    const subscription = ReferralsService.subscribeToReferrals(user.id, (payload) => {
      fetchReferrals();
    });

    return () => {
      ReferralsService.unsubscribe(subscription);
    };
  }, [user?.id, fetchReferrals]);

  // Actions
  const createReferral = async (data) => {
    try {
      // Optimistic update
      setReferralsMap(prev => ({
        ...prev,
        [data.alumni_id]: { ...data, status: 'pending', created_at: new Date().toISOString() }
      }));

      const newRequest = await ReferralsService.createReferralRequest({
        ...data,
        student_id: user.id
      });
      return newRequest;
    } catch (err) {
      console.error("Error creating referral:", err);
      fetchReferrals(); // Revert
      throw err;
    }
  };

  const approveReferral = async (id) => {
    try {
      setIncomingReferrals(prev => prev.map(r => r.id === id ? { ...r, status: 'reviewing' } : r));
      await ReferralsService.approveReferral(id);
    } catch (err) {
      console.error("Error approving referral:", err);
      fetchReferrals();
      throw err;
    }
  };

  const rejectReferral = async (id) => {
    try {
      setIncomingReferrals(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' } : r));
      await ReferralsService.rejectReferral(id);
    } catch (err) {
      console.error("Error rejecting referral:", err);
      fetchReferrals();
      throw err;
    }
  };

  const completeReferral = async (id) => {
    try {
      setIncomingReferrals(prev => prev.map(r => r.id === id ? { ...r, status: 'referred' } : r));
      await ReferralsService.completeReferral(id);
    } catch (err) {
      console.error("Error completing referral:", err);
      fetchReferrals();
      throw err;
    }
  };

  const cancelReferral = async (id) => {
    try {
      setOutgoingReferrals(prev => prev.filter(r => r.id !== id));
      // Map update is handled by fetchReferrals after realtime, but we can optimistically delete it
      // if it's the only one, or just let realtime handle it.
      await ReferralsService.cancelReferral(id);
    } catch (err) {
      console.error("Error canceling referral:", err);
      fetchReferrals();
      throw err;
    }
  };

  return {
    incomingReferrals,
    outgoingReferrals,
    referralsMap,
    loading,
    error,
    createReferral,
    approveReferral,
    rejectReferral,
    completeReferral,
    cancelReferral,
    refreshReferrals: fetchReferrals
  };
}

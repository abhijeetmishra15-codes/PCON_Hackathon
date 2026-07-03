import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { OpportunitiesService } from '../lib/services/opportunities.service';
import { supabase } from '../lib/supabase';

export function useOpportunities() {
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [opportunities, setOpportunities] = useState([]);
  const [myOpportunities, setMyOpportunities] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    workMode: '',
    jobType: '',
    limit: 50,
    offset: 0
  });

  const fetchOpportunities = useCallback(async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      const { data, count } = await OpportunitiesService.getOpportunities(currentFilters);
      
      setOpportunities(data);
      if (count !== null) setTotalCount(count);

    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchMyOpportunities = useCallback(async () => {
    if (!user?.id) return;
    try {
      const data = await OpportunitiesService.getMyOpportunities(user.id);
      setMyOpportunities(data);
    } catch (err) {
      console.error("Failed to fetch my opportunities:", err);
    }
  }, [user?.id]);

  // Initial fetch and Realtime setup
  useEffect(() => {
    fetchOpportunities();
    fetchMyOpportunities();

    const handleRealtimeEvent = (payload) => {
      // Re-fetch to ensure nested relations (skills, author) are correctly populated
      fetchOpportunities();
      fetchMyOpportunities();
    };

    const channel = supabase.channel('opportunities-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'opportunities'
      }, handleRealtimeEvent)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOpportunities, fetchMyOpportunities]);

  const applyFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, offset: 0 }));
  };

  const loadMore = () => {
    setFilters(prev => ({ ...prev, offset: prev.offset + prev.limit }));
  };

  const createOpportunity = async (data, skills) => {
    const newOpp = await OpportunitiesService.createOpportunity({
      ...data,
      author_id: user.id
    }, skills);
    // Optimistic refresh not strictly needed due to realtime, but good for immediate feedback
    await fetchMyOpportunities();
    return newOpp;
  };

  const updateOpportunity = async (id, data, skills = null) => {
    const updated = await OpportunitiesService.updateOpportunity(id, data, skills);
    await fetchMyOpportunities();
    return updated;
  };

  const deleteOpportunity = async (id) => {
    setMyOpportunities(prev => prev.filter(o => o.id !== id));
    await OpportunitiesService.deleteOpportunity(id);
  };

  return {
    opportunities,
    myOpportunities,
    totalCount,
    loading,
    error,
    filters,
    applyFilters,
    loadMore,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity,
    refetch: fetchOpportunities
  };
}

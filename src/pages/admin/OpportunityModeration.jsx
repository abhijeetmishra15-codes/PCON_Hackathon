import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { Briefcase, Building } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function OpportunityModeration() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const { data, error } = await supabase
          .from('opportunities')
          .select(`
            id,
            title,
            company,
            type,
            created_at,
            status,
            alumni_profiles (
              profiles (full_name)
            )
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const mapped = data.map(item => ({
            id: item.id,
            title: item.title || 'Untitled',
            company: item.company || 'Unknown',
            type: item.type ? item.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Job',
            poster: item.alumni_profiles?.profiles?.full_name || 'Unknown',
            date: new Date(item.created_at).toLocaleDateString(),
            status: item.status === 'open' ? 'Approved' : 'Pending' // Map open -> Approved, otherwise Pending (fallback UI state)
          }));
          setOpportunities(mapped);
        }
      } catch (err) {
        console.error('Error fetching opportunities:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchOpportunities();
  }, []);

  const handleApprove = (id) => {
    setOpportunities(prev => prev.map(opp => 
      opp.id === id ? { ...opp, status: 'Approved' } : opp
    ));
  };

  const handleReject = (id) => {
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">Opportunity Moderation</h1>
        <p className="text-text-secondary mt-1">Review, hide, or delete posted opportunities.</p>
      </div>
      <Card className="p-0 bg-white overflow-hidden border border-border">
        {loading ? (
          <div className="p-12 text-center text-text-secondary">Loading...</div>
        ) : opportunities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-secondary/50 text-text-secondary font-semibold">
                <tr>
                  <th className="px-6 py-3 border-b border-border">Opportunity</th>
                  <th className="px-6 py-3 border-b border-border">Poster</th>
                  <th className="px-6 py-3 border-b border-border">Date</th>
                  <th className="px-6 py-3 border-b border-border">Status</th>
                  <th className="px-6 py-3 border-b border-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-text-main flex items-center gap-1.5">
                          <Briefcase size={14} className="text-primary/70" />
                          {opp.title}
                        </p>
                        <p className="text-[12px] text-text-secondary flex items-center gap-1.5 mt-0.5">
                          <Building size={12} /> {opp.company} • {opp.type}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-text-main">{opp.poster}</td>
                    <td className="px-6 py-4 text-text-secondary">{opp.date}</td>
                    <td className="px-6 py-4">
                      <Badge variant={opp.status === 'Approved' ? 'success' : 'warning'} 
                             className={opp.status === 'Approved' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'}>
                        {opp.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {opp.status === 'Pending' && (
                          <Button 
                            onClick={() => handleApprove(opp.id)}
                            variant="outline" 
                            className="h-8 px-3 text-xs border-success/30 text-success hover:bg-success/5 hover:border-success">
                            Approve
                          </Button>
                        )}
                        <Button 
                          onClick={() => handleReject(opp.id)}
                          variant="ghost" 
                          className="h-8 px-3 text-xs text-error hover:bg-error/5">
                          Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-text-secondary">
            <p>No opportunities found.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

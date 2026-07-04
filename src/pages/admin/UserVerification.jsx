import React, { useState, useEffect } from 'react';
import { Card, Button, Avatar, Badge } from '../../components/ui';
import { supabase } from '../../lib/supabase';

export default function UserVerification() {
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPending() {
      try {
        const { data, error } = await supabase
          .from('alumni_profiles')
          .select(`
            id,
            company,
            job_role,
            profiles (email, full_name, created_at)
          `)
          .eq('is_verified', false);

        if (error) throw error;

        if (data) {
          const mapped = data.map(item => ({
            id: item.id,
            name: item.profiles?.full_name || 'Unknown',
            role: 'Alumni',
            email: item.profiles?.email || 'No email',
            date: new Date(item.profiles?.created_at).toLocaleDateString(),
            status: 'Pending'
          }));
          setPendingVerifications(mapped);
        }
      } catch (err) {
        console.error('Error fetching pending verifications:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchPending();
  }, []);

  const handleApprove = (id) => {
    setPendingVerifications(prev => prev.filter(user => user.id !== id));
  };

  const handleReject = (id) => {
    setPendingVerifications(prev => prev.filter(user => user.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">User Verification</h1>
        <p className="text-text-secondary mt-1">Approve or reject new alumni registrations.</p>
      </div>
      <Card className="p-0 bg-white overflow-hidden border border-border">
        {loading ? (
          <div className="p-12 text-center text-text-secondary">Loading...</div>
        ) : pendingVerifications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-secondary/50 text-text-secondary font-semibold">
                <tr>
                  <th className="px-6 py-3 border-b border-border">User</th>
                  <th className="px-6 py-3 border-b border-border">Role</th>
                  <th className="px-6 py-3 border-b border-border">Registered</th>
                  <th className="px-6 py-3 border-b border-border">Status</th>
                  <th className="px-6 py-3 border-b border-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingVerifications.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar src="" size="sm" className="bg-primary/10 text-primary" />
                        <div>
                          <p className="font-semibold text-text-main">{user.name}</p>
                          <p className="text-[12px] text-text-secondary">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-text-main">{user.role}</td>
                    <td className="px-6 py-4 text-text-secondary">{user.date}</td>
                    <td className="px-6 py-4">
                      <Badge variant="warning" className="bg-warning/10 text-warning border-warning/20">
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleApprove(user.id)}
                          variant="outline" 
                          className="h-8 px-3 text-xs border-success/30 text-success hover:bg-success/5 hover:border-success">
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleReject(user.id)}
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
            <p>No pending verifications at this time.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Card, Button, Avatar, Badge } from '../../components/ui';
import { supabase } from '../../lib/supabase';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, full_name, role, created_at')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const mapped = data.map(item => ({
            id: item.id,
            name: item.full_name || 'Unknown',
            role: item.role ? item.role.charAt(0).toUpperCase() + item.role.slice(1) : 'Unknown',
            email: item.email || 'No email',
            joined: new Date(item.created_at).toLocaleDateString(),
            status: 'Active' // Status hardcoded to active as per schema constraints
          }));
          setUsers(mapped);
        }
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchUsers();
  }, []);

  const handleToggleStatus = (id) => {
    setUsers(prev => prev.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'Active' ? 'Suspended' : 'Active' } 
        : user
    ));
  };

  const handleDelete = (id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-main tracking-tight">User Management</h1>
        <p className="text-text-secondary mt-1">Manage existing student and alumni accounts.</p>
      </div>
      <Card className="p-0 bg-white overflow-hidden border border-border">
        {loading ? (
          <div className="p-12 text-center text-text-secondary">Loading...</div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-secondary/50 text-text-secondary font-semibold">
                <tr>
                  <th className="px-6 py-3 border-b border-border">User</th>
                  <th className="px-6 py-3 border-b border-border">Role</th>
                  <th className="px-6 py-3 border-b border-border">Joined</th>
                  <th className="px-6 py-3 border-b border-border">Status</th>
                  <th className="px-6 py-3 border-b border-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((user) => (
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
                    <td className="px-6 py-4 text-text-secondary">{user.joined}</td>
                    <td className="px-6 py-4">
                      <Badge variant={user.status === 'Active' ? 'success' : 'error'} 
                             className={user.status === 'Active' ? 'bg-success/10 text-success border-success/20' : 'bg-error/10 text-error border-error/20'}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          onClick={() => handleToggleStatus(user.id)}
                          variant="outline" 
                          className="h-8 px-3 text-xs">
                          {user.status === 'Active' ? 'Suspend' : 'Activate'}
                        </Button>
                        <Button 
                          onClick={() => handleDelete(user.id)}
                          variant="ghost" 
                          className="h-8 px-3 text-xs text-error hover:bg-error/5">
                          Delete
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
            <p>No users found.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

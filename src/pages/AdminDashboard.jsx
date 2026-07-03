import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, Activity, Search, ShieldCheck, MoreVertical } from 'lucide-react';
import { Card, Badge, Input, Button, Avatar } from '../components/ui';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, users, activity

  const stats = [
    { title: 'Total Users', value: '2,451', change: '+12%', icon: <Users size={20} /> },
    { title: 'Active Postings', value: '342', change: '+5%', icon: <FileText size={20} /> },
    { title: 'Successful Referrals', value: '189', change: '+24%', icon: <CheckCircle size={20} /> },
    { title: 'Platform Activity', value: '92%', change: '+2%', icon: <Activity size={20} /> },
  ];

  const pendingVerifications = [
    { id: 1, name: 'David Smith', role: 'Alumni', email: 'd.smith@alumni.edu', date: '2 hours ago', status: 'Pending' },
    { id: 2, name: 'Emma Wilson', role: 'Student', email: 'e.wilson@student.edu', date: '5 hours ago', status: 'Pending' },
  ];

  return (
    <div className="pb-14">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[30px] font-extrabold tracking-tight text-text-main mb-1">
          Admin Dashboard
        </h1>
        <p className="text-[14px] text-text-secondary">
          Monitor platform activity and manage users.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-secondary p-1 rounded-xl w-max mb-8">
        {['Overview', 'Users', 'Activity'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`px-5 py-2 text-[13px] font-bold rounded-lg transition-all ${
              activeTab === tab.toLowerCase() ? 'bg-white shadow-soft text-text-main' : 'text-text-secondary hover:text-text-main'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, idx) => (
              <Card key={idx} className="p-5 bg-white flex flex-col hover:shadow-soft transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {stat.icon}
                  </div>
                  <Badge variant="success" className="bg-success/10 text-success border border-success/20 text-[11px]">
                    {stat.change}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-[28px] font-bold text-text-main leading-none mb-1">{stat.value}</h3>
                  <p className="text-[13px] font-medium text-text-secondary">{stat.title}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Pending Verifications */}
          <Card className="p-0 bg-white overflow-hidden border border-border">
            <div className="px-6 py-5 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-[16px] font-bold text-text-main">Pending Verifications</h3>
                <p className="text-[13px] text-text-secondary mt-0.5">Approve new user registrations.</p>
              </div>
              <Button variant="outline" className="h-9 px-4 text-xs">View All</Button>
            </div>
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
                          <Button variant="outline" className="h-8 px-3 text-xs border-success/30 text-success hover:bg-success/5 hover:border-success">Approve</Button>
                          <Button variant="ghost" className="h-8 px-3 text-xs text-error hover:bg-error/5">Reject</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab !== 'overview' && (
        <div className="py-12 text-center text-text-secondary bg-white rounded-xl border border-border">
          <ShieldCheck size={40} className="mx-auto mb-3 text-primary/40" />
          <h3 className="text-lg font-bold text-text-main mb-1">Coming Soon</h3>
          <p className="text-sm">This section is currently under development.</p>
        </div>
      )}
    </div>
  );
}

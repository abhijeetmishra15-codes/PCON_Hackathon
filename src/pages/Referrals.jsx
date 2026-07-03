import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Building2, ExternalLink,
  CheckCircle2, XCircle, Clock, Search, FileText
} from 'lucide-react';
import { Card, Button, Badge, Avatar, Input } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useReferrals } from '../hooks/useReferrals';
import { cn } from '../utils/cn';

export default function Referrals() {
  const { user } = useAuth();
  const {
    incomingReferrals,
    outgoingReferrals,
    loading,
    approveReferral,
    rejectReferral,
    completeReferral,
    cancelReferral
  } = useReferrals();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const isStudent = user?.role === 'student';
  const referrals = isStudent ? outgoingReferrals : incomingReferrals;

  const filteredReferrals = referrals.filter(r => {
    const searchLower = searchQuery.toLowerCase();
    const matchCompany = r.company_name?.toLowerCase().includes(searchLower);
    const matchRole = r.job_title?.toLowerCase().includes(searchLower);
    const matchPerson = isStudent 
      ? r.alumni?.full_name?.toLowerCase().includes(searchLower)
      : r.student?.full_name?.toLowerCase().includes(searchLower);
    return matchCompany || matchRole || matchPerson;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning" className="bg-orange-500/10 text-orange-600 border border-orange-500/20">Pending</Badge>;
      case 'reviewing':
        return <Badge variant="primary" className="bg-blue-500/10 text-blue-600 border border-blue-500/20">Reviewing</Badge>;
      case 'referred':
        return <Badge variant="success" className="bg-green-500/10 text-green-600 border border-green-500/20">Referred</Badge>;
      case 'rejected':
        return <Badge variant="danger" className="bg-red-500/10 text-red-600 border border-red-500/20">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pending = filteredReferrals.filter(r => r.status === 'pending');
  const active = filteredReferrals.filter(r => r.status === 'reviewing');
  const completed = filteredReferrals.filter(r => r.status === 'referred' || r.status === 'rejected');

  const displayList = activeTab === 'pending' ? pending : activeTab === 'active' ? active : completed;

  return (
    <div className="pb-14">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[30px] font-extrabold tracking-tight text-text-main mb-1">
          {isStudent ? 'My Referral Requests' : 'Incoming Referrals'}
        </h1>
        <p className="text-[14px] text-text-secondary">
          {isStudent 
            ? 'Track your referral requests to alumni.' 
            : 'Manage referral requests from students.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-start sm:items-center">
        {/* Segmented tabs */}
        <div className="flex p-1 bg-secondary rounded-xl w-max border border-border/60">
          {[
            { key: 'pending', label: `Pending (${pending.length})` },
            { key: 'active', label: `Active (${active.length})` },
            { key: 'completed', label: `History (${completed.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-5 py-2 text-[13px] font-semibold rounded-lg transition-all duration-150',
                activeTab === tab.key
                  ? 'bg-white shadow-soft text-text-main'
                  : 'text-text-secondary hover:text-text-main'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search company, role, name..."
            leftIcon={<Search size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1,2,3,4].map(i => (
            <Card key={i} className="h-48 animate-pulse bg-white p-5 border-border" />
          ))}
        </div>
      ) : displayList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-border">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="text-text-secondary w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-text-main mb-2">No {activeTab} requests</h2>
          <p className="text-text-secondary">You don't have any {activeTab} referral requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {displayList.map((req, i) => {
              const person = isStudent ? req.alumni : req.student;
              const dateObj = new Date(req.created_at);
              const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

              return (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 flex flex-col h-full bg-white">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          src={person?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(person?.full_name || 'U')}&background=random`}
                          size="md"
                          className="border border-border/50 shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="text-[15px] font-bold text-text-main truncate">
                            {person?.full_name || 'Unknown User'}
                          </h3>
                          <p className="text-[12.5px] text-text-secondary truncate">
                            {isStudent 
                              ? `${person?.alumni_profile?.job_role || 'Alumni'} @ ${person?.alumni_profile?.company || 'Company'}` 
                              : `${person?.department || 'Student'} · Class of ${person?.graduation_year || 'N/A'}`
                            }
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 pl-3">
                        {getStatusBadge(req.status)}
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="bg-secondary/40 rounded-xl p-4 mb-4 border border-border/50">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-1.5 text-text-main font-semibold text-[14px]">
                              <Building2 size={14} className="text-primary/70" />
                              {req.company_name}
                            </div>
                            <div className="flex items-center gap-1.5 text-text-secondary text-[13px] mt-0.5">
                              <Briefcase size={14} className="text-primary/70" />
                              {req.job_title}
                            </div>
                          </div>
                          {req.job_url && (
                            <a href={req.job_url} target="_blank" rel="noreferrer" className="shrink-0 p-2 bg-white rounded-lg border border-border hover:border-primary/50 text-text-secondary hover:text-primary transition-colors">
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pitch Message */}
                    <div className="mb-5 flex-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-text-secondary mb-1.5">Pitch Message</div>
                      <p className="text-[13.5px] leading-relaxed text-text-main line-clamp-3">
                        "{req.pitch_message}"
                      </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4 text-[12px] text-text-secondary w-full sm:w-auto">
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} /> {dateStr}
                        </span>
                        <a href={req.resume_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-primary hover:underline font-medium">
                          <FileText size={14} /> View Resume
                        </a>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        {isStudent ? (
                          req.status === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                              onClick={() => cancelReferral(req.id)}
                            >
                              Cancel Request
                            </Button>
                          )
                        ) : (
                          <>
                            {req.status === 'pending' && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                  onClick={() => rejectReferral(req.id)}
                                >
                                  Reject
                                </Button>
                                <Button 
                                  size="sm" 
                                  className="w-full sm:w-auto bg-primary text-white"
                                  onClick={() => approveReferral(req.id)}
                                >
                                  Approve
                                </Button>
                              </>
                            )}
                            {req.status === 'reviewing' && (
                              <Button 
                                size="sm" 
                                className="w-full sm:w-auto bg-success hover:bg-success/90 text-white"
                                leftIcon={<CheckCircle2 size={15} />}
                                onClick={() => completeReferral(req.id)}
                              >
                                Mark as Referred
                              </Button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

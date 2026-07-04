import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Briefcase,
  Trophy,
  ArrowRight,
  Zap,
  Star,
  ChevronRight,
  TrendingUp,
  Clock,
  Flame,
} from 'lucide-react';
import { Button, Avatar, Badge } from '../components/ui';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils/cn';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } },
};

export default function Dashboard() {
  const { user, userProfile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({ opportunities: 0, referrals: 0, events: 0 });
  const [recentReferrals, setRecentReferrals] = useState([]);
  const [referralProgress, setReferralProgress] = useState({ sent: 0, accepted: 0, pending: 0, rejected: 0, max: 0 });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [recommendedAlumni, setRecommendedAlumni] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      try {
        setLoading(true);

        const [
          { count: oppsCount }, 
          { count: refsCount },
          { count: eventsCount }
        ] = await Promise.all([
          supabase.from('opportunities').select('*', { count: 'exact', head: true }).eq('status', 'open'),
          supabase.from('referral_requests').select('*', { count: 'exact', head: true }).or(`student_id.eq.${user.id},alumni_id.eq.${user.id}`),
          supabase.from('events').select('*', { count: 'exact', head: true }).gte('event_date', new Date().toISOString())
        ]);
        
        setStats({ opportunities: oppsCount || 0, referrals: refsCount || 0, events: eventsCount || 0 });

        const { data: refsData } = await supabase
          .from('referral_requests')
          .select(`id, status, created_at, opportunities(title, company)`)
          .or(`student_id.eq.${user.id},alumni_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(4);

        if (refsData) {
          setRecentReferrals(refsData.map(r => ({
            id: r.id,
            company: r.opportunities?.company || 'Unknown',
            role: r.opportunities?.title || 'Unknown Role',
            status: r.status,
            date: new Date(r.created_at).toLocaleDateString()
          })));
          const sent = refsData.length;
          const accepted = refsData.filter(r => r.status === 'referred').length;
          const pending = refsData.filter(r => r.status === 'pending').length;
          const rejected = refsData.filter(r => r.status === 'rejected').length;
          setReferralProgress({ sent, accepted, pending, rejected, max: Math.max(sent, 5) });
        }

        const { data: evts } = await supabase
          .from('events')
          .select('id, title, event_date')
          .gte('event_date', new Date().toISOString())
          .order('event_date', { ascending: true })
          .limit(2);
        if (evts) setUpcomingEvents(evts);

        const { data: alumniData } = await supabase
          .from('alumni_profiles')
          .select(`id, company, job_role, profiles(full_name, avatar_url)`)
          .eq('is_verified', true)
          .limit(6);
        
        if (alumniData) {
          const sorted = alumniData.sort((a, b) => (a.profiles?.full_name || '').localeCompare(b.profiles?.full_name || ''));
          const mapped = sorted.map((item, index) => ({
            rank: index + 1,
            name: item.profiles?.full_name || 'Unknown',
            role: item.job_role && item.company ? `${item.job_role} @ ${item.company}` : item.job_role || 'Alumni',
            score: Math.max(2500 - index * 120, 100).toLocaleString(),
            avatar: item.profiles?.avatar_url,
            initial: item.profiles?.full_name?.[0] || 'A'
          }));
          setLeaderboard(mapped.slice(0, 3));
          setRecommendedAlumni(mapped.slice(3, 6));
        }

        const { data: opps } = await supabase.from('opportunities').select('company').eq('status', 'open');
        if (opps) {
          const companyCounts = opps.reduce((acc, curr) => {
            if (curr.company) acc[curr.company] = (acc[curr.company] || 0) + 1;
            return acc;
          }, {});
          const sortedCompanies = Object.entries(companyCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([name, count]) => ({ name, roles: count }));
          setTopCompanies(sortedCompanies);
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [user]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'referred': return { bg: 'rgba(34,197,94,0.10)', text: '#22C55E', label: 'Referred' };
      case 'rejected': return { bg: 'rgba(239,68,68,0.10)', text: '#EF4444', label: 'Rejected' };
      default: return { bg: 'rgba(245,158,11,0.10)', text: '#F59E0B', label: 'Pending' };
    }
  };

  return (
    <div className="pb-16 space-y-7 max-w-[1280px] mx-auto">

      {/* ── HERO HEADER ─────────────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="relative overflow-hidden rounded-[28px] p-8 sm:p-10"
          style={{
            background: 'linear-gradient(135deg, #0f0c1a 0%, #1a1230 40%, #0f2444 80%, #0a1628 100%)',
            boxShadow: '0 16px 60px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.20)',
          }}>
          {/* Layered radial glows */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-25"
            style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 65%)', filter: 'blur(52px)' }} />
          <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-18"
            style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 65%)', filter: 'blur(44px)' }} />
          <div className="pointer-events-none absolute top-1/2 left-1/3 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #FB923C 0%, transparent 65%)', filter: 'blur(36px)' }} />
          {/* Subtle grid overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-amber-400/90 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">Dashboard</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] text-white/40 font-medium">Live</span>
                </div>
              </div>
              <h1 className="text-[32px] sm:text-[40px] font-extrabold text-white leading-[1.1]"
                style={{ letterSpacing: '-0.03em', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
                {greeting()}, {userProfile?.full_name?.split(' ')[0] || 'User'}! <span style={{ display: 'inline-block' }}>👋</span>
              </h1>
              <p className="text-[14px] text-white/45 mt-2.5 leading-relaxed">
                Here's your daily career snapshot —{' '}
                <span className="text-white/80 font-semibold">{stats.opportunities} active opportunities</span> available.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button variant="outline" leftIcon={<CalendarIcon size={15} />}
                className="shrink-0 border-white/15 text-white/75 hover:bg-white/10 bg-white/[0.06] backdrop-blur-sm"
                style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}>
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── STATS ROW ──────────────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Active Opportunities', value: stats.opportunities, icon: Briefcase, color: '#F59E0B', bg: 'rgba(245,158,11,0.10)' },
          { label: 'My Referrals', value: stats.referrals, icon: Trophy, color: '#22C55E', bg: 'rgba(34,197,94,0.10)' },
          { label: 'Upcoming Events', value: stats.events, icon: CalendarIcon, color: '#818cf8', bg: 'rgba(129,140,248,0.10)' },
        ].map((stat, i) => (
          <motion.div variants={item} key={i}>
            <div className="group relative overflow-hidden rounded-[22px] p-6 bg-gradient-to-br from-white to-[#FAFAF8] border border-[rgba(0,0,0,0.052)] transition-all duration-[220ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:-translate-y-[3px]"
              style={{
                boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 20px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.030)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 28px ${stat.color}18, 0 2px 8px rgba(0,0,0,0.04), 0 0 0 1px ${stat.color}14`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03), 0 4px 20px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.030)'}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at 85% 15%, ${stat.color}0A 0%, transparent 55%)` }} />
              <div className="relative flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: stat.bg }}>
                  <stat.icon size={19} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-[30px] font-extrabold text-text-main leading-none mb-1.5" style={{ letterSpacing: '-0.04em' }}>
                {loading ? <span className="animate-pulse text-text-secondary/40">—</span> : stat.value}
              </div>
              <div className="text-[12px] font-semibold text-text-secondary/70 uppercase tracking-wide">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── MAIN EDITORIAL GRID ────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT — 2 col wide */}
        <div className="lg:col-span-2 space-y-6">

          {/* My Referrals */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-6 bg-gradient-to-br from-white to-[#FAFAF8] border border-[rgba(0,0,0,0.052)] min-h-[250px]"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 20px rgba(0,0,0,0.04)' }}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-bold text-text-main flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(99,102,241,0.10)' }}>
                    <Briefcase size={14} style={{ color: '#6366f1' }} />
                  </div>
                  My Referrals
                </h3>
                <Link to="/referrals">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={13} />}>View All</Button>
                </Link>
              </div>
              <div className="space-y-1.5">
                {loading ? (
                  <div className="py-6 text-center text-text-secondary text-sm">Loading...</div>
                ) : recentReferrals.length > 0 ? (
                  recentReferrals.map((app, i) => {
                    const statusColor = getStatusColor(app.status);
                    return (
                      <div key={i} className="flex items-center gap-4 px-4 py-3.5 rounded-[14px] hover:bg-[#F5F0E8]/60 transition-all duration-150 group cursor-pointer border border-transparent hover:border-[rgba(0,0,0,0.05)]">
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-text-main truncate leading-tight">{app.role}</p>
                          <p className="text-[11.5px] text-text-secondary mt-0.5">{app.company}</p>
                        </div>
                        <span className="text-[11px] text-text-secondary/60 shrink-0 font-medium">{app.date}</span>
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full shrink-0"
                          style={{ background: statusColor.bg, color: statusColor.text }}>
                          {statusColor.label}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-10 text-center text-text-secondary text-sm">No recent referrals.</div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Top Companies */}
            <motion.div variants={item}>
              <div className="rounded-[22px] p-6 bg-gradient-to-br from-white to-[#FAFAF8] border border-[rgba(0,0,0,0.052)] h-full"
                style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 20px rgba(0,0,0,0.04)' }}>
                <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 bg-purple-50">
                    <Star size={13} className="text-purple-500" />
                  </div>
                  Top Companies Hiring
                </h3>
                <div className="space-y-3.5">
                  {topCompanies.length > 0 ? topCompanies.map((co, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer px-1 py-1 rounded-xl hover:bg-[#F5F0E8]/60 transition-colors -mx-1">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white border border-[rgba(0,0,0,0.06)] shadow-sm text-[14px] font-extrabold text-text-main">
                          {co.name[0]}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-text-main">{co.name}</p>
                          <p className="text-[11px] text-text-secondary">{co.roles} open roles</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {i === 0 && (
                          <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-red-50 text-red-500 border border-red-100">
                            <Flame size={9} /> Hot
                          </span>
                        )}
                        <ChevronRight size={14} className="text-text-secondary/30 group-hover:text-text-secondary/70 transition-colors" />
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-4 text-sm text-text-secondary">No active companies</div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Recommended Alumni */}
            <motion.div variants={item}>
              <div className="rounded-[22px] p-6 bg-gradient-to-br from-white to-[#FAFAF8] border border-[rgba(0,0,0,0.052)] h-full flex flex-col"
                style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 20px rgba(0,0,0,0.04)' }}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 bg-primary/10">
                      <TrendingUp size={13} className="text-primary" />
                    </div>
                    Recommended Alumni
                  </h3>
                </div>
                <div className="space-y-1 flex-1">
                  {recommendedAlumni.length > 0 ? recommendedAlumni.map((alumni, i) => {
                    const colors = ['#F59E0B', '#6366f1', '#22C55E'];
                    const color = colors[i % colors.length];
                    return (
                      <div key={i} className="flex items-center justify-between group hover:bg-[#F5F0E8]/70 px-3 py-2.5 -mx-1 rounded-[13px] transition-all duration-150 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-extrabold text-white shrink-0"
                            style={{ background: `linear-gradient(135deg, ${color}, ${color}88)`, boxShadow: `0 2px 8px ${color}30` }}>
                            {alumni.initial}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-text-main group-hover:text-primary transition-colors leading-tight truncate">
                              {alumni.name}
                            </div>
                            <div className="text-[11px] text-text-secondary truncate mt-0.5">{alumni.role}</div>
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-4 text-sm text-text-secondary">No recommendations yet</div>
                  )}
                </div>
                <Link to="/network" className="block mt-5">
                  <Button variant="outline" className="w-full h-9 text-[13px]">Discover More</Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Leaderboard Preview */}
          <motion.div variants={item}>
            <div className="rounded-[22px] overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #0f0c1a 0%, #1a1230 60%, #0f2444 100%)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.14)',
              }}>
              {/* Subtle top glow */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/[0.06]">
                <h3 className="text-[14px] font-bold text-white flex items-center gap-2.5">
                  <Trophy size={15} className="text-amber-400" />
                  Leaderboard
                </h3>
                <Link to="/leaderboard">
                  <Button variant="ghost" size="sm" className="text-white/50 hover:text-white hover:bg-white/8" rightIcon={<ChevronRight size={13} />}>
                    Full List
                  </Button>
                </Link>
              </div>
              <div className="p-4">
                {leaderboard.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {leaderboard.map((user, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-4 rounded-[16px] transition-all duration-200 cursor-pointer"
                        style={{
                          background: i === 0 ? 'rgba(245,158,11,0.10)' : 'rgba(255,255,255,0.05)',
                          border: i === 0 ? '1px solid rgba(245,158,11,0.18)' : '1px solid rgba(255,255,255,0.04)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = i === 0 ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = i === 0 ? 'rgba(245,158,11,0.10)' : 'rgba(255,255,255,0.05)'}>
                        <span className="text-2xl shrink-0">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13.5px] font-bold truncate text-white">{user.name}</p>
                          <p className="text-[11px] text-white/45 truncate mt-0.5">{user.role}</p>
                        </div>
                        <span className="text-[14px] font-bold text-amber-400/80">{user.score}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 text-white/40 text-sm">No data available</div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT column */}
        <div className="space-y-6">
          {/* Referral Progress */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-6"
              style={{ background: 'linear-gradient(145deg, #fffdf5 0%, #fffbeb 100%)', border: '1px solid rgba(245,158,11,0.18)', boxShadow: '0 4px 20px rgba(245,158,11,0.08)' }}>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.15)' }}>
                  <TrendingUp size={14} className="text-amber-600" />
                </div>
                <h3 className="text-[14px] font-bold text-amber-900">Referral Progress</h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Total Sent', count: referralProgress.sent, max: referralProgress.max, color: '#F59E0B' },
                  { label: 'Accepted', count: referralProgress.accepted, max: referralProgress.max, color: '#22C55E' },
                  { label: 'Pending', count: referralProgress.pending, max: referralProgress.max, color: '#FB923C' },
                ].map(({ label, count, max, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[12px] mb-2">
                      <span className="font-semibold text-amber-800">{label}</span>
                      <span className="font-extrabold text-amber-900" style={{ letterSpacing: '-0.02em' }}>{count}</span>
                    </div>
                    <div className="h-[6px] rounded-full overflow-hidden" style={{ background: 'rgba(245,158,11,0.12)' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: max > 0 ? `${(count / max) * 100}%` : '0%' }}
                        transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-6 bg-gradient-to-br from-white to-[#FAFAF8] border border-[rgba(0,0,0,0.052)]"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03), 0 4px 20px rgba(0,0,0,0.04)' }}>
              <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 bg-red-50">
                  <Clock size={13} className="text-red-500" />
                </div>
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {upcomingEvents.length > 0 ? upcomingEvents.map((evt, i) => (
                  <div key={i} className={`p-4 rounded-[16px] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
                    i === 0
                      ? 'bg-red-50/70 border-l-[3px] border-l-red-400 border border-red-100/80'
                      : 'bg-[#F5F0E8]/50 border-l-[3px] border-l-[rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.05)]'
                  }`}>
                    <h4 className="text-[13px] font-bold text-text-main mb-1.5 truncate">{evt.title}</h4>
                    <span className="text-[11px] font-medium text-text-secondary">
                      {new Date(evt.event_date).toLocaleDateString()}
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-5 text-sm text-text-secondary">No upcoming events.</div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-6 text-white overflow-hidden relative"
              style={{
                background: 'linear-gradient(145deg, #F59E0B 0%, #FB923C 60%, #F97316 100%)',
                boxShadow: '0 8px 36px rgba(245,158,11,0.38), 0 2px 8px rgba(0,0,0,0.14)',
              }}>
              {/* Lighting effects */}
              <div className="pointer-events-none absolute inset-0 opacity-25"
                style={{ background: 'radial-gradient(ellipse at 20% 20%, rgba(255,255,255,0.6) 0%, transparent 50%)' }} />
              <div className="pointer-events-none absolute -right-6 -bottom-6 opacity-15">
                <Zap size={90} className="text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center">
                    <Zap size={14} className="text-white" />
                  </div>
                  <h3 className="text-[14px] font-bold" style={{ letterSpacing: '-0.01em' }}>Quick Actions</h3>
                </div>
                <div className="space-y-1.5">
                  {[
                    { label: 'Update Resume', to: '/settings' },
                    { label: 'Find Alumni', to: '/network' },
                    { label: 'Browse Referrals', to: '/referrals' },
                  ].map(({ label, to }) => (
                    <Link key={to} to={to}
                      className="flex items-center justify-between w-full px-4 py-[10px] rounded-[13px] text-[13px] font-semibold text-white/90 hover:text-white hover:bg-white/20 transition-all duration-150 group">
                      {label}
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

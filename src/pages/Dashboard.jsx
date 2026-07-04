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
  
  // States
  const [stats, setStats] = useState({
    opportunities: 0,
    referrals: 0,
    events: 0
  });
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

        // 1. Stats
        const [
          { count: oppsCount }, 
          { count: refsCount },
          { count: eventsCount }
        ] = await Promise.all([
          supabase.from('opportunities').select('*', { count: 'exact', head: true }).eq('status', 'open'),
          supabase.from('referral_requests').select('*', { count: 'exact', head: true }).or(`student_id.eq.${user.id},alumni_id.eq.${user.id}`),
          supabase.from('events').select('*', { count: 'exact', head: true }).gte('event_date', new Date().toISOString())
        ]);
        
        setStats({
          opportunities: oppsCount || 0,
          referrals: refsCount || 0,
          events: eventsCount || 0
        });

        // 2. Recent Referrals
        const { data: refsData } = await supabase
          .from('referral_requests')
          .select(`
            id, 
            status, 
            created_at,
            opportunities(title, company)
          `)
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

          // Referral Progress
          const sent = refsData.length;
          const accepted = refsData.filter(r => r.status === 'referred').length;
          const pending = refsData.filter(r => r.status === 'pending').length;
          const rejected = refsData.filter(r => r.status === 'rejected').length;
          setReferralProgress({ sent, accepted, pending, rejected, max: Math.max(sent, 5) });
        }

        // 3. Upcoming Events
        const { data: evts } = await supabase
          .from('events')
          .select('id, title, event_date')
          .gte('event_date', new Date().toISOString())
          .order('event_date', { ascending: true })
          .limit(2);
        
        if (evts) setUpcomingEvents(evts);

        // 4. Leaderboard & Recommended Alumni
        const { data: alumniData } = await supabase
          .from('alumni_profiles')
          .select(`
            id,
            company,
            job_role,
            profiles(full_name, avatar_url)
          `)
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

        // 5. Top Companies
        const { data: opps } = await supabase
          .from('opportunities')
          .select('company')
          .eq('status', 'open');
        
        if (opps) {
          const companyCounts = opps.reduce((acc, curr) => {
            if (curr.company) {
              acc[curr.company] = (acc[curr.company] || 0) + 1;
            }
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
      case 'referred': return { bg: '#22C55E15', text: '#22C55E', label: 'Referred' };
      case 'rejected': return { bg: '#EF444415', text: '#EF4444', label: 'Rejected' };
      default: return { bg: '#F59E0B15', text: '#F59E0B', label: 'Pending' };
    }
  };

  return (
    <div className="pb-16 space-y-8 max-w-[1280px] mx-auto">
      {/* ── HERO HEADER ─────────────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="relative overflow-hidden rounded-[28px] p-7 sm:p-9"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
          <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)', filter: 'blur(48px)' }} />
          <div className="pointer-events-none absolute -bottom-12 -left-12 w-56 h-56 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #FB923C 0%, transparent 70%)', filter: 'blur(40px)' }} />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[12px] font-bold uppercase tracking-widest text-yellow-400/80">Dashboard</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[12px] text-white/40">Live</span>
              </div>
              <h1 className="text-[30px] sm:text-[36px] font-extrabold tracking-tight text-white leading-tight">
                {greeting()}, {userProfile?.full_name?.split(' ')[0] || 'User'}! <span className="wave" style={{ display: 'inline-block' }}>👋</span>
              </h1>
              <p className="text-[14px] text-white/50 mt-1.5">
                Here's your daily career snapshot — <span className="text-white/80 font-medium">{stats.opportunities} active opportunities</span> available.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Button variant="outline" leftIcon={<CalendarIcon size={15} />} className="shrink-0 border-white/20 text-white/80 hover:bg-white/10 bg-white/5">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── STATS ROW ──────────────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Active Opportunities', value: stats.opportunities, icon: Briefcase, color: '#F59E0B' },
          { label: 'My Referrals', value: stats.referrals, icon: Trophy, color: '#22C55E' },
          { label: 'Upcoming Events', value: stats.events, icon: CalendarIcon, color: '#818cf8' },
        ].map((stat, i) => (
          <motion.div variants={item} key={i}>
            <div className="group relative overflow-hidden rounded-[22px] p-5 bg-white border border-black/[0.05] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at 80% 20%, ${stat.color}0D 0%, transparent 60%)` }} />
              <div className="relative flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: `${stat.color}1A` }}>
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-[26px] font-extrabold text-text-main tracking-tight leading-none mb-1">
                {loading ? '...' : stat.value}
              </div>
              <div className="text-[11px] font-medium text-text-secondary">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── MAIN EDITORIAL GRID ────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT — 2 col wide */}
        <div className="lg:col-span-2 space-y-5">
          {/* Application Timeline (My Referrals) */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-6 bg-white border border-black/[0.05] shadow-sm min-h-[250px]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-bold text-text-main flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <Briefcase size={14} style={{ color: '#6366f1' }} />
                  </div>
                  My Referrals
                </h3>
                <Link to="/referrals">
                  <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={13} />}>View All</Button>
                </Link>
              </div>
              <div className="space-y-1">
                {loading ? (
                   <div className="p-4 text-center text-text-secondary text-sm">Loading...</div>
                ) : recentReferrals.length > 0 ? (
                  recentReferrals.map((app, i) => {
                    const statusColor = getStatusColor(app.status);
                    return (
                      <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50/80 transition-colors group cursor-pointer border border-transparent hover:border-gray-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-text-main truncate">{app.role}</p>
                          <p className="text-[11px] text-text-secondary">{app.company}</p>
                        </div>
                        <span className="text-[10px] text-text-secondary shrink-0">{app.date}</span>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                          style={{ background: statusColor.bg, color: statusColor.text }}>
                          {statusColor.label}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-text-secondary text-sm">No recent referrals.</div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Top Companies */}
            <motion.div variants={item}>
              <div className="rounded-[22px] p-5 bg-white border border-black/[0.05] shadow-sm h-full">
                <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-purple-50">
                    <Star size={13} className="text-purple-500" />
                  </div>
                  Top Companies Hiring
                </h3>
                <div className="space-y-3">
                  {topCompanies.length > 0 ? topCompanies.map((co, i) => (
                    <div key={i} className="flex items-center justify-between group cursor-pointer hover:opacity-80 transition-opacity">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white border border-gray-100 shadow-sm overflow-hidden text-[14px] font-bold text-text-main">
                          {co.name[0]}
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-text-main">{co.name}</p>
                          <p className="text-[11px] text-text-secondary">{co.roles} open roles</p>
                        </div>
                      </div>
                      {i === 0 && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500">
                          <Flame size={10} /> Hot
                        </span>
                      )}
                      <ChevronRight size={14} className="text-text-secondary/40 group-hover:text-text-secondary transition-colors ml-auto" />
                    </div>
                  )) : (
                    <div className="text-center py-4 text-sm text-text-secondary">No active companies</div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Recommended Alumni */}
            <motion.div variants={item}>
              <div className="rounded-[22px] p-5 bg-white border border-black/[0.05] shadow-sm h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-primary/10">
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
                      <div key={i} className="flex items-center justify-between group hover:bg-secondary/60 px-3 py-2.5 -mx-1 rounded-xl transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-extrabold text-white shrink-0"
                            style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>
                            {alumni.initial}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-text-main group-hover:text-primary transition-colors leading-tight truncate">
                              {alumni.name}
                            </div>
                            <div className="text-[11px] text-text-secondary truncate">{alumni.role}</div>
                          </div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-center py-4 text-sm text-text-secondary">No recommendations yet</div>
                  )}
                </div>
                <Link to="/network" className="block mt-4">
                  <Button variant="outline" className="w-full h-9 text-[13px]">Discover More</Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Leaderboard Preview (Now full width inside Left Column) */}
          <motion.div variants={item}>
            <div className="rounded-[22px] overflow-hidden" style={{ background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)' }}>
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5">
                <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
                  <Trophy size={14} className="text-yellow-400" />
                  Leaderboard
                </h3>
                <Link to="/leaderboard">
                  <Button variant="ghost" size="sm" className="text-white/50 hover:text-white" rightIcon={<ChevronRight size={13} />}>
                    Full List
                  </Button>
                </Link>
              </div>
              <div className="p-3">
                {leaderboard.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {leaderboard.map((user, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors bg-white/5 hover:bg-white/10">
                        <span className="text-xl shrink-0">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-bold truncate text-white">{user.name}</p>
                          <p className="text-[11px] text-white/50 truncate">{user.role}</p>
                        </div>
                        <span className="text-[14px] font-bold text-white/80">{user.score}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-white/50 text-sm">No data available</div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT column (Now only 3 items) */}
        <div className="space-y-5">
          {/* Referral Progress */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-5"
              style={{ background: 'linear-gradient(145deg, #fff7ed 0%, #fffbeb 100%)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
                  <TrendingUp size={13} className="text-amber-600" />
                </div>
                <h3 className="text-[14px] font-bold text-amber-900">Referral Progress</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Total Sent', count: referralProgress.sent, max: referralProgress.max, color: '#F59E0B' },
                  { label: 'Accepted', count: referralProgress.accepted, max: referralProgress.max, color: '#22C55E' },
                  { label: 'Pending', count: referralProgress.pending, max: referralProgress.max, color: '#FB923C' },
                ].map(({ label, count, max, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="font-semibold text-amber-800">{label}</span>
                      <span className="font-bold text-amber-900">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-amber-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: max > 0 ? `${(count / max) * 100}%` : '0%' }}
                        transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Upcoming Deadlines (Events) */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-5 bg-white border border-black/[0.05] shadow-sm">
              <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-red-50">
                  <Clock size={13} className="text-red-500" />
                </div>
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {upcomingEvents.length > 0 ? upcomingEvents.map((evt, i) => (
                  <div key={i} className={`p-4 rounded-2xl border-l-[3px] transition-all hover:-translate-y-0.5 cursor-pointer ${
                    i === 0
                      ? 'bg-red-50/60 border-l-red-400 border border-red-100'
                      : 'bg-gray-50/60 border-l-gray-300 border border-gray-100'
                  }`}>
                    <h4 className="text-[13px] font-bold text-text-main mb-1 truncate">{evt.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-text-secondary">
                        {new Date(evt.event_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-sm text-text-secondary">No upcoming events.</div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-5 text-white overflow-hidden relative"
              style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FB923C 100%)', boxShadow: '0 8px 32px rgba(245,158,11,0.35)' }}>
              <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-20">
                <Zap size={80} className="text-white" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={16} className="text-white" />
                  <h3 className="text-[14px] font-bold">Quick Actions</h3>
                </div>
                <div className="space-y-1.5">
                  <Link to="/settings" className="block w-full text-left text-[13px] font-semibold text-white/90 hover:text-white px-3.5 py-2.5 rounded-xl hover:bg-white/20 transition-all flex items-center justify-between group">
                    Update Resume
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link to="/network" className="block w-full text-left text-[13px] font-semibold text-white/90 hover:text-white px-3.5 py-2.5 rounded-xl hover:bg-white/20 transition-all flex items-center justify-between group">
                    Find Alumni
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link to="/referrals" className="block w-full text-left text-[13px] font-semibold text-white/90 hover:text-white px-3.5 py-2.5 rounded-xl hover:bg-white/20 transition-all flex items-center justify-between group">
                    Browse Referrals
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

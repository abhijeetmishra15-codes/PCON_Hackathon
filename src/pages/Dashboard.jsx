import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Calendar as CalendarIcon,
  FileText,
  ArrowRight,
  Briefcase,
  Trophy,
  Users,
  Zap,
  Target,
  Star,
  Bell,
  Activity,
  BarChart2,
  CheckCircle2,
  Clock,
  Flame,
  ChevronRight,
  Award,
  Rocket,
} from 'lucide-react';
import { Card, Button, Avatar, Badge } from '../components/ui';

/* ─── Animation variants ─────────────────────────────────────────────────── */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } },
};

/* ─── Animated counter ───────────────────────────────────────────────────── */
function AnimatedNumber({ value, suffix = '' }) {
  const numValue = parseFloat(value.toString().replace(/[^0-9.]/g, ''));
  const prefix = value.toString().replace(/[0-9.%+]/g, '').replace(/\s.*/g, '');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 80, damping: 18 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) motionVal.set(numValue);
  }, [inView, numValue, motionVal]);

  useEffect(() => {
    const unsub = spring.on('change', v => setDisplay(Math.round(v)));
    return unsub;
  }, [spring]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
}

/* ─── Mini ring chart ────────────────────────────────────────────────────── */
function RingChart({ pct, color, size = 64, stroke = 7 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
      />
    </svg>
  );
}

/* ─── Sparkline ──────────────────────────────────────────────────────────── */
function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 80, h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Bar chart ──────────────────────────────────────────────────────────── */
function MiniBarChart({ data, color }) {
  const max = Math.max(...data);
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.5, ease: 'easeOut' }}
            style={{ originY: 1, height: `${(v / max) * 40}px`, background: color, opacity: i === 5 ? 1 : 0.4, borderRadius: 4 }}
            className="w-full"
          />
          <span className="text-[9px] text-text-secondary/60">{days[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Goal item ──────────────────────────────────────────────────────────── */
function GoalItem({ label, done }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl transition-all ${done ? 'opacity-60' : ''}`}>
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
        ${done ? 'bg-success border-success' : 'border-border'}`}>
        {done && <CheckCircle2 size={12} className="text-white" />}
      </div>
      <span className={`text-[13px] font-medium ${done ? 'line-through text-text-secondary' : 'text-text-main'}`}>{label}</span>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────────────── */
export default function Dashboard() {

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    { label: 'Profile Views', value: '142', rawNum: 142, suffix: '', trend: '+12%', trendUp: true, icon: Users, color: '#F59E0B', sparkData: [40, 55, 48, 70, 90, 110, 142] },
    { label: 'ATS Score', value: '78%', rawNum: 78, suffix: '%', trend: '+5%', trendUp: true, icon: FileText, color: '#22C55E', sparkData: [60, 65, 62, 70, 73, 75, 78] },
    { label: 'Referrals', value: '3', rawNum: 3, suffix: '', trend: 'Pending', trendUp: null, icon: Briefcase, color: '#FB923C', sparkData: [1, 1, 2, 2, 3, 3, 3] },
    { label: 'Global Rank', value: 'Top 5%', rawNum: 5, suffix: '%', trend: '▲ Rising', trendUp: true, icon: Trophy, color: '#EAB308', sparkData: [12, 10, 9, 8, 7, 6, 5] },
  ];

  const activities = [
    { title: 'Referral requested for Frontend Engineer', subtitle: 'Linear · 2h ago', avatar: 'https://logo.clearbit.com/linear.app', status: 'Pending', statusVariant: 'warning' },
    { title: 'Resume ATS scan completed', subtitle: 'System · 5h ago', icon: <FileText size={15} />, status: 'Done', statusVariant: 'success' },
    { title: 'Sarah Jenkins viewed your profile', subtitle: 'Product Manager @ Stripe · 1d ago', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=64&h=64', status: 'View', statusVariant: 'secondary' },
  ];

  const goals = [
    { label: 'Update resume with new project', done: true },
    { label: 'Connect with 2 alumni from Stripe', done: false },
    { label: 'Apply to Frontend Engineer @ Linear', done: false },
    { label: 'Complete AI career assessment', done: true },
  ];

  const weeklyData = [3, 5, 4, 7, 6, 9, 8];

  const leaderboard = [
    { name: 'Priya S.', score: 9820, rank: 1, medal: '🥇' },
    { name: 'Alex M.', score: 9410, rank: 2, medal: '🥈' },
    { name: 'John D.', score: 8990, rank: 3, medal: '🥉' },
  ];

  return (
    <div className="pb-16 space-y-8 max-w-[1280px] mx-auto">

      {/* ── HERO HEADER ─────────────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="relative overflow-hidden rounded-[28px] p-7 sm:p-9"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
          {/* Blobs */}
          <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)', filter: 'blur(48px)' }} />
          <div className="pointer-events-none absolute -bottom-12 -left-12 w-56 h-56 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #FB923C 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="pointer-events-none absolute top-1/2 right-1/4 w-32 h-32 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)', filter: 'blur(30px)' }} />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[12px] font-bold uppercase tracking-widest text-yellow-400/80">Dashboard</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[12px] text-white/40">Live</span>
              </div>
              <h1 className="text-[30px] sm:text-[36px] font-extrabold tracking-tight text-white leading-tight">
                {greeting()}, Alex! <span className="wave" style={{ display: 'inline-block' }}>👋</span>
              </h1>
              <p className="text-[14px] text-white/50 mt-1.5">
                Here's your daily career snapshot — <span className="text-white/80 font-medium">3 new opportunities</span> since yesterday.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex -space-x-2">
                {['M', 'E', 'D'].map((l, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-[#16213e] flex items-center justify-center text-[12px] font-bold text-white"
                    style={{ background: ['#F59E0B', '#22C55E', '#818cf8'][i] }}>
                    {l}
                  </div>
                ))}
              </div>
              <span className="text-[13px] text-white/50">+12 alumni online</span>
              <Button variant="outline" leftIcon={<CalendarIcon size={15} />} className="shrink-0 border-white/20 text-white/80 hover:bg-white/10 bg-white/5">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── AI INSIGHT BANNER ──────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <div className="relative overflow-hidden rounded-[22px] border border-amber-200/60"
            style={{ background: 'linear-gradient(135deg, rgba(254,243,199,0.9) 0%, rgba(255,237,213,0.9) 100%)', backdropFilter: 'blur(20px)' }}>
            <div className="pointer-events-none absolute -right-8 -top-8 opacity-[0.07]">
              <Sparkles size={160} className="text-amber-500" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row gap-4 p-5 sm:p-6">
              <div className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-md"
                style={{ background: 'linear-gradient(135deg, #F59E0B, #FB923C)' }}>
                <Sparkles size={22} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-bold text-amber-900 flex items-center gap-2 mb-1">
                  AI Career Insight
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">New</span>
                </h3>
                <p className="text-[13.5px] text-amber-800/80 leading-relaxed">
                  Based on your recent activity, your profile matches{' '}
                  <span className="font-bold text-amber-900">3 new Product Management roles</span>{' '}
                  at Stripe and Linear. Update your "Leadership" section to boost your ATS score from 78% → 92%.
                </p>
                <div className="mt-4 flex gap-2.5">
                  <Button size="sm">View Matches</Button>
                  <Button size="sm" variant="ghost">Update Resume</Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── STATS ROW ──────────────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div variants={item} key={i}>
            <div className="group relative overflow-hidden rounded-[22px] p-5 bg-white border border-black/[0.05] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at 80% 20%, ${stat.color}0D 0%, transparent 60%)` }} />
              <div className="relative flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center"
                  style={{ background: `${stat.color}1A` }}>
                  <stat.icon size={18} style={{ color: stat.color }} />
                </div>
                <Sparkline data={stat.sparkData} color={stat.color} />
              </div>
              <div className="text-[26px] font-extrabold text-text-main tracking-tight leading-none mb-1">
                {stat.label === 'Global Rank' || stat.label === 'Referrals'
                  ? stat.value
                  : <AnimatedNumber value={stat.rawNum} suffix={stat.label === 'ATS Score' ? '%' : ''} />}
              </div>
              <div className="text-[11px] font-medium text-text-secondary mb-2">{stat.label}</div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                stat.trendUp === true
                  ? 'bg-green-50 text-green-700'
                  : stat.trendUp === false
                  ? 'bg-red-50 text-red-600'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {stat.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── MAIN EDITORIAL GRID ────────────────────────────────────────── */}
      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* LEFT — 2 col wide */}
        <div className="lg:col-span-2 space-y-5">

          {/* Career + Resume health — horizontal pair */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Career Score */}
            <motion.div variants={item}>
              <div className="relative overflow-hidden rounded-[22px] p-6 h-full"
                style={{ background: 'linear-gradient(145deg, #1a1a2e 0%, #0f3460 100%)' }}>
                <div className="pointer-events-none absolute -bottom-8 -right-8 w-40 h-40 rounded-full opacity-20"
                  style={{ background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)', filter: 'blur(24px)' }} />
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-4">Career Score</p>
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <RingChart pct={74} color="#F59E0B" size={72} stroke={8} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[16px] font-extrabold text-white">74</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[28px] font-extrabold text-white leading-none mb-1">Good</div>
                    <div className="text-[12px] text-white/50">Top 26% of users</div>
                    <div className="mt-3 flex gap-1.5">
                      {['Profile', 'Skills', 'Network'].map((tag, i) => (
                        <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(245,158,11,0.2)', color: '#FCD34D' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Resume Health */}
            <motion.div variants={item}>
              <div className="rounded-[22px] p-6 h-full bg-white border border-black/[0.05] shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary/60 mb-4">Resume Health</p>
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <RingChart pct={78} color="#22C55E" size={72} stroke={8} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[16px] font-extrabold text-green-600">78%</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[['Keywords', 92], ['Formatting', 84], ['Clarity', 71]].map(([label, pct]) => (
                      <div key={label}>
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="text-text-secondary font-medium">{label}</span>
                          <span className="font-bold text-text-main">{pct}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: 'linear-gradient(90deg, #22C55E, #86EFAC)' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Application Timeline */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-6 bg-white border border-black/[0.05] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[15px] font-bold text-text-main flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.1)' }}>
                    <Activity size={14} style={{ color: '#6366f1' }} />
                  </div>
                  Application Timeline
                </h3>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={13} />}>View All</Button>
              </div>
              <div className="space-y-1">
                {[
                  { company: 'Linear', role: 'Frontend Engineer', stage: 'Referral Sent', color: '#6366f1', dot: '#6366f1', date: 'Oct 22', logo: 'https://logo.clearbit.com/linear.app' },
                  { company: 'Stripe', role: 'Product Manager', stage: 'Application Review', color: '#F59E0B', dot: '#F59E0B', date: 'Oct 20', logo: 'https://logo.clearbit.com/stripe.com' },
                  { company: 'Apple', role: 'iOS Developer', stage: 'Applied', color: '#6B7280', dot: '#9CA3AF', date: 'Oct 18', logo: 'https://logo.clearbit.com/apple.com' },
                  { company: 'Vercel', role: 'DX Engineer', stage: 'Offer Received', color: '#22C55E', dot: '#22C55E', date: 'Oct 15', logo: 'https://logo.clearbit.com/vercel.com' },
                ].map((app, i) => (
                  <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-gray-50/80 transition-colors group cursor-pointer">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white border border-gray-100 shadow-sm overflow-hidden">
                      <img src={app.logo} alt={app.company} className="w-6 h-6 object-contain" onError={e => { e.target.style.display='none'; e.target.parentNode.style.background=app.color; e.target.parentNode.innerHTML=`<span style='color:#fff;font-size:13px;font-weight:700'>${app.company[0]}</span>`; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-text-main truncate">{app.role}</p>
                      <p className="text-[11px] text-text-secondary">{app.company}</p>
                    </div>
                    <span className="text-[10px] text-text-secondary shrink-0">{app.date}</span>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                      style={{ background: `${app.color}15`, color: app.color }}>
                      {app.stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Activity Feed */}
          <motion.div variants={item}>
            <div className="rounded-[22px] overflow-hidden bg-white border border-black/[0.05] shadow-sm">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-50">
                <h3 className="text-[15px] font-bold text-text-main flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-orange-50">
                    <Bell size={14} className="text-orange-500" />
                  </div>
                  Recent Activity
                </h3>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>View All</Button>
              </div>
              <div>
                {activities.map((act, i) => (
                  <div key={i}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors border-b border-gray-50/80 last:border-0 cursor-pointer group">
                    {act.avatar ? (
                      <Avatar src={act.avatar} size="sm" className="rounded-xl shrink-0 ring-2 ring-white shadow-sm" />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 shadow-sm">
                        {act.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-text-main truncate group-hover:text-primary transition-colors">{act.title}</p>
                      <p className="text-[11.5px] text-text-secondary truncate mt-0.5">{act.subtitle}</p>
                    </div>
                    <Badge variant={act.statusVariant} className="shrink-0">{act.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Weekly Growth Chart */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-6 bg-white border border-black/[0.05] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-[15px] font-bold text-text-main">Weekly Growth</h3>
                  <p className="text-[12px] text-text-secondary mt-0.5">Connections made this week</p>
                </div>
                <div className="flex items-center gap-1.5 text-green-600 text-[13px] font-bold">
                  <TrendingUp size={14} /> +34% vs last week
                </div>
              </div>
              <MiniBarChart data={weeklyData} color="#F59E0B" />
            </div>
          </motion.div>

        </div>

        {/* RIGHT column */}
        <div className="space-y-5">

          {/* Today's Goals */}
          <motion.div variants={item}>
            <div className="rounded-[22px] overflow-hidden bg-white border border-black/[0.05] shadow-sm">
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-50">
                <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-orange-50">
                    <Target size={13} className="text-orange-500" />
                  </div>
                  Today's Goals
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                  2 / 4 done
                </span>
              </div>
              <div className="p-2">
                {goals.map((g, i) => <GoalItem key={i} label={g.label} done={g.done} />)}
              </div>
            </div>
          </motion.div>

          {/* Referral Progress */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-5"
              style={{ background: 'linear-gradient(145deg, #fff7ed 0%, #fffbeb 100%)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.15)' }}>
                  <Rocket size={13} className="text-amber-600" />
                </div>
                <h3 className="text-[14px] font-bold text-amber-900">Referral Progress</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Sent', count: 3, max: 5, color: '#F59E0B' },
                  { label: 'Accepted', count: 1, max: 3, color: '#22C55E' },
                  { label: 'Pending', count: 2, max: 3, color: '#FB923C' },
                ].map(({ label, count, max, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="font-semibold text-amber-800">{label}</span>
                      <span className="font-bold text-amber-900">{count} / {max}</span>
                    </div>
                    <div className="h-2 rounded-full bg-amber-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / max) * 100}%` }}
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

          {/* Upcoming Deadlines */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-5 bg-white border border-black/[0.05] shadow-sm">
              <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-red-50">
                  <Clock size={13} className="text-red-500" />
                </div>
                Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Apple Internship App', date: 'Tomorrow, 11:59 PM', priority: 'danger', priorityLabel: 'High Priority' },
                  { title: 'Mock Interview with Alumni', date: 'Oct 26, 2:00 PM', priority: 'secondary', priorityLabel: 'Meeting' },
                ].map((dl, i) => (
                  <div key={i} className={`p-4 rounded-2xl border-l-[3px] transition-all hover:-translate-y-0.5 cursor-pointer ${
                    i === 0
                      ? 'bg-red-50/60 border-l-red-400 border border-red-100'
                      : 'bg-gray-50/60 border-l-gray-300 border border-gray-100'
                  }`}>
                    <h4 className="text-[13px] font-bold text-text-main mb-1">{dl.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-text-secondary">{dl.date}</span>
                      <Badge variant={dl.priority}>{dl.priorityLabel}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Preview */}
          <motion.div variants={item}>
            <div className="rounded-[22px] overflow-hidden" style={{ background: 'linear-gradient(145deg, #1a1a2e 0%, #16213e 100%)' }}>
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/5">
                <h3 className="text-[14px] font-bold text-white flex items-center gap-2">
                  <Trophy size={14} className="text-yellow-400" />
                  Leaderboard
                </h3>
                <Button variant="ghost" size="sm" className="text-white/50 hover:text-white" rightIcon={<ChevronRight size={13} />}>
                  Full List
                </Button>
              </div>
              <div className="p-3 space-y-1">
                {leaderboard.map((user, i) => (
                  <div key={i} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                    user.name === 'Alex M.' ? 'bg-yellow-400/10 border border-yellow-400/20' : 'hover:bg-white/5'
                  }`}>
                    <span className="text-lg shrink-0">{user.medal}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-bold truncate ${user.name === 'Alex M.' ? 'text-yellow-300' : 'text-white'}`}>
                        {user.name} {user.name === 'Alex M.' && <span className="text-[10px] text-yellow-400/60 font-normal">You</span>}
                      </p>
                    </div>
                    <span className="text-[12px] font-bold text-white/50">{user.score.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recommended Alumni */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-5 bg-white border border-black/[0.05] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-primary/10">
                    <TrendingUp size={13} className="text-primary" />
                  </div>
                  Recommended Alumni
                </h3>
              </div>
              <div className="space-y-1">
                {[
                  { name: 'Michael Chen', role: 'SWE @ Apple', match: '98%', initial: 'M', color: '#F59E0B' },
                  { name: 'Emma Watson', role: 'Designer @ Linear', match: '94%', initial: 'E', color: '#6366f1' },
                  { name: 'David Kim', role: 'Founder @ YC', match: '89%', initial: 'D', color: '#22C55E' },
                ].map((alumni, i) => (
                  <div key={i}
                    className="flex items-center justify-between group hover:bg-secondary/60 px-3 py-2.5 -mx-1 rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-extrabold text-white shrink-0"
                        style={{ background: `linear-gradient(135deg, ${alumni.color}, ${alumni.color}99)` }}>
                        {alumni.initial}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-text-main group-hover:text-primary transition-colors leading-tight">
                          {alumni.name}
                        </div>
                        <div className="text-[11px] text-text-secondary">{alumni.role}</div>
                      </div>
                    </div>
                    <Badge variant="success">{alumni.match}</Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 h-9 text-[13px]">Discover More</Button>
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
                  {['Update Resume', 'Find Alumni', 'Browse Referrals'].map((action) => (
                    <button
                      key={action}
                      className="w-full text-left text-[13px] font-semibold text-white/90 hover:text-white px-3.5 py-2.5 rounded-xl hover:bg-white/20 transition-all flex items-center justify-between group"
                    >
                      {action}
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top Companies */}
          <motion.div variants={item}>
            <div className="rounded-[22px] p-5 bg-white border border-black/[0.05] shadow-sm">
              <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-purple-50">
                  <Star size={13} className="text-purple-500" />
                </div>
                Top Companies Hiring
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Apple', roles: 24, color: '#1d1d1f', hot: true, logo: 'https://logo.clearbit.com/apple.com' },
                  { name: 'Stripe', roles: 18, color: '#635bff', logo: 'https://logo.clearbit.com/stripe.com' },
                  { name: 'Linear', roles: 11, color: '#5e6ad2', logo: 'https://logo.clearbit.com/linear.app' },
                  { name: 'Vercel', roles: 9, color: '#000000', logo: 'https://logo.clearbit.com/vercel.com' },
                ].map((co, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-white border border-gray-100 shadow-sm overflow-hidden">
                        <img src={co.logo} alt={co.name} className="w-6 h-6 object-contain" onError={e => { e.target.style.display='none'; e.target.parentNode.style.background=co.color; e.target.parentNode.innerHTML=`<span style='color:#fff;font-size:13px;font-weight:700'>${co.name[0]}</span>`; }} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-text-main">{co.name}</p>
                        <p className="text-[11px] text-text-secondary">{co.roles} open roles</p>
                      </div>
                    </div>
                    {co.hot && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-500">
                        <Flame size={10} /> Hot
                      </span>
                    )}
                    <ChevronRight size={14} className="text-text-secondary/40 group-hover:text-text-secondary transition-colors ml-auto" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Card, Button, Avatar, Badge } from '../components/ui';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 110, damping: 18 } }
};

export default function Dashboard() {
  const stats = [
    { label: 'Profile Views', value: '142', trend: '+12%', trendUp: true, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'ATS Score', value: '78%', trend: '+5%', trendUp: true, icon: FileText, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Referrals', value: '3', trend: 'Pending', trendUp: null, icon: Briefcase, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Rank', value: 'Top 5%', trend: 'Global', trendUp: null, icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ];

  const activities = [
    {
      title: 'Referral requested for Frontend Engineer',
      subtitle: 'Linear · 2h ago',
      avatar: 'https://logo.clearbit.com/linear.app',
      status: 'Pending',
      statusVariant: 'warning',
    },
    {
      title: 'Resume ATS scan completed',
      subtitle: 'System · 5h ago',
      icon: <FileText size={15} />,
      status: 'Done',
      statusVariant: 'success',
    },
    {
      title: 'Sarah Jenkins viewed your profile',
      subtitle: 'Product Manager @ Stripe · 1d ago',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=64&h=64',
      status: 'View',
      statusVariant: 'secondary',
    },
  ];

  return (
    <div className="pb-14">

      {/* ── Header ── */}
      <motion.div variants={container} initial="hidden" animate="show" className="mb-8">
        <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[32px] font-extrabold tracking-tight text-text-main leading-tight">
              Good morning, Alex! 👋
            </h1>
            <p className="text-[14px] text-text-secondary/80 mt-1">
              Here's your daily career snapshot and progress.
            </p>
          </div>
          <Button variant="outline" leftIcon={<CalendarIcon size={16} />} className="shrink-0 self-start sm:self-auto">
            Oct 24, 2026
          </Button>
        </motion.div>

        {/* AI Insight Banner */}
        <motion.div variants={item}>
          <div className="relative overflow-hidden rounded-card border-l-4 border-l-primary bg-gradient-to-r from-secondary to-background border border-border shadow-soft p-5">
            <div className="pointer-events-none absolute -right-4 -top-4 text-primary/8">
              <Sparkles size={120} />
            </div>
            <div className="relative z-10 flex gap-4">
              <div className="shrink-0 w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-soft text-primary border border-border">
                <Sparkles size={22} />
              </div>
              <div className="min-w-0">
                <h3 className="text-[15px] font-bold text-text-main flex items-center gap-2 mb-1">
                  AI Career Insight
                  <Badge variant="primary" className="text-[10px] px-1.5 py-[2px]">New</Badge>
                </h3>
                <p className="text-[13.5px] text-text-secondary leading-relaxed max-w-2xl">
                  Based on your recent activity, your profile matches{' '}
                  <span className="font-semibold text-text-main">3 new Product Management roles</span>{' '}
                  at Stripe and Linear. Update your "Leadership" section to boost your ATS score from 78% → 92%.
                </p>
                <div className="mt-3.5 flex gap-2.5">
                  <Button size="sm">View Matches</Button>
                  <Button size="sm" variant="ghost">Update Resume</Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Main Grid ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div variants={item} key={i}>
                <Card hover className="p-5 flex flex-col items-center text-center">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${stat.bg} ${stat.color}`}>
                    <stat.icon size={19} />
                  </div>
                  <div className="text-[22px] font-extrabold text-text-main tracking-tight mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-medium text-text-secondary mb-2.5">{stat.label}</div>
                  <Badge
                    variant={stat.trendUp === true ? 'success' : stat.trendUp === false ? 'danger' : 'secondary'}
                    className="text-[10px]"
                  >
                    {stat.trend}
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Activity Feed */}
          <motion.div variants={item}>
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
                <h3 className="text-[15px] font-bold text-text-main">Recent Activity</h3>
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>
                  View All
                </Button>
              </div>
              <div className="divide-y divide-border">
                {activities.map((act, i) => (
                  <div key={i} className="flex items-center gap-3.5 px-6 py-4 hover:bg-secondary/40 transition-colors">
                    {act.avatar ? (
                      <Avatar src={act.avatar} size="sm" className="rounded-xl shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-secondary text-primary flex items-center justify-center shrink-0">
                        {act.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-text-main truncate">{act.title}</p>
                      <p className="text-[12px] text-text-secondary truncate mt-0.5">{act.subtitle}</p>
                    </div>
                    <Badge variant={act.statusVariant} className="shrink-0">{act.status}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-5">

          {/* Deadlines */}
          <motion.div variants={item}>
            <Card className="p-5">
              <h3 className="text-[14px] font-bold text-text-main mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-danger/10 flex items-center justify-center">
                  <CalendarIcon size={13} className="text-danger" />
                </div>
                Upcoming Deadlines
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Apple Internship App', date: 'Tomorrow, 11:59 PM', priority: 'danger' },
                  { title: 'Mock Interview with Alumni', date: 'Oct 26, 2:00 PM', priority: 'secondary' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`bg-white p-3.5 rounded-xl border shadow-sm border-l-[3px] ${
                      i === 0 ? 'border-l-danger' : 'border-l-primary/40'
                    } border-border`}
                  >
                    <h4 className="text-[13px] font-semibold text-text-main mb-1.5">{item.title}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium text-text-secondary">{item.date}</span>
                      <Badge variant={item.priority}>
                        {i === 0 ? 'High Priority' : 'Meeting'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recommended Alumni */}
          <motion.div variants={item}>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-text-main flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp size={13} className="text-primary" />
                  </div>
                  Recommended Alumni
                </h3>
              </div>
              <div className="space-y-1">
                {[
                  { name: 'Michael Chen', role: 'SWE @ Apple', match: '98%', initial: 'M' },
                  { name: 'Emma Watson', role: 'Designer @ Linear', match: '94%', initial: 'E' },
                  { name: 'David Kim', role: 'Founder @ YC', match: '89%', initial: 'D' },
                ].map((alumni, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between group hover:bg-secondary/60 px-3 py-2.5 -mx-1 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-background border border-border flex items-center justify-center text-[13px] font-bold text-primary shrink-0">
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
              <Button variant="outline" className="w-full mt-4 h-9 text-[13px]">
                Discover More
              </Button>
            </Card>
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={item}>
            <Card className="p-5 bg-gradient-to-br from-primary to-accent border-none text-white shadow-glow">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} className="text-white/90" />
                <h3 className="text-[14px] font-bold">Quick Actions</h3>
              </div>
              <div className="space-y-2">
                {['Update Resume', 'Find Alumni', 'Browse Referrals'].map((action) => (
                  <button
                    key={action}
                    className="w-full text-left text-[13px] font-medium text-white/90 hover:text-white px-3 py-2 rounded-lg hover:bg-white/15 transition-colors flex items-center justify-between group"
                  >
                    {action}
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, TrendingUp, Medal, Flame } from 'lucide-react';
import { Card, Avatar, Badge } from '../components/ui';
import { cn } from '../utils/cn';

const rankColors = {
  1: { border: 'border-yellow-400', shadow: 'shadow-gold', badge: 'bg-yellow-400', ring: '0_0_0_4px_rgba(250,204,21,0.25)' },
  2: { border: 'border-slate-300', shadow: '', badge: 'bg-slate-400', ring: '' },
  3: { border: 'border-amber-600', shadow: '', badge: 'bg-amber-600', ring: '' },
};

export default function Leaderboard() {
  const topContributors = [
    { rank: 1, name: 'Sarah Jenkins', role: 'PM @ Stripe', score: '2,450', change: '+12%', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&h=128' },
    { rank: 2, name: 'Michael Chen', role: 'SWE @ Apple', score: '2,120', change: '+5%', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128' },
    { rank: 3, name: 'David Kim', role: 'Founder @ YC', score: '1,980', change: '-2%', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&h=128' },
  ];

  const others = Array.from({ length: 7 }).map((_, i) => ({
    rank: i + 4,
    name: `Alumni Member ${i + 4}`,
    role: 'Software Engineer',
    score: `${1500 - i * 100}`,
  }));

  // Render order: 2nd, 1st, 3rd for podium visual
  const podiumOrder = [topContributors[1], topContributors[0], topContributors[2]];

  return (
    <div className="pb-14 max-w-4xl mx-auto">

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-yellow-400 to-amber-500 shadow-[0_4px_20px_rgba(245,158,11,0.40)] mb-5">
          <Trophy size={30} className="text-white" />
        </div>
        <h1 className="text-[32px] font-extrabold tracking-tight text-text-main mb-2">
          Hall of Fame
        </h1>
        <p className="text-[14px] text-text-secondary max-w-sm mx-auto">
          Recognizing our most helpful alumni and top referrers this month.
        </p>
      </div>

      {/* Podium — 2nd, 1st, 3rd */}
      <div className="grid grid-cols-3 gap-4 mb-10 items-end">
        {podiumOrder.map((person, i) => {
          const isFirst = person.rank === 1;
          const rc = rankColors[person.rank];
          return (
            <motion.div
              key={person.rank}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12, type: 'spring', stiffness: 90, damping: 18 }}
              className="flex flex-col items-center"
            >
              {/* Crown for #1 */}
              {isFirst && (
                <div className="text-yellow-400 mb-2">
                  <Flame size={24} className="fill-yellow-400" />
                </div>
              )}

              {/* Avatar */}
              <div className="relative mb-3">
                <Avatar
                  src={person.avatar}
                  size={isFirst ? 'xl' : 'lg'}
                  className={cn('border-[3px]', rc.border, rc.shadow)}
                  style={isFirst ? { boxShadow: `0 0 0 4px rgba(250,204,21,0.25), 0 8px 30px rgba(245,158,11,0.25)` } : {}}
                />
                <div className={cn(
                  'absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-black shadow-md',
                  rc.badge
                )}>
                  {person.rank}
                </div>
              </div>

              {/* Card */}
              <Card
                className={cn(
                  'w-full p-4 text-center mt-1',
                  isFirst && 'shadow-gold border-yellow-200/60 bg-gradient-to-b from-yellow-50/60 to-white scale-105'
                )}
              >
                <h3 className="text-[14px] font-bold text-text-main truncate">{person.name}</h3>
                <p className="text-[11px] text-text-secondary mb-2 truncate">{person.role}</p>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                  <Award size={16} className={person.rank === 1 ? 'text-yellow-500' : 'text-primary'} />
                  <span className="text-[18px] font-extrabold tracking-tight text-text-main">{person.score}</span>
                </div>
                <Badge
                  variant={person.change.startsWith('+') ? 'success' : 'danger'}
                  className="text-[10px]"
                >
                  {person.change} this month
                </Badge>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Rankings list */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-secondary/40">
          <h3 className="text-[15px] font-bold text-text-main flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" />
            Global Rankings
          </h3>
          <div className="relative">
            <select className={[
              'appearance-none bg-white border border-[rgba(0,0,0,0.10)] text-[13px] font-semibold text-text-main',
              'rounded-lg pl-3 pr-8 py-1.5',
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40',
              'transition-all cursor-pointer',
            ].join(' ')}>
              <option>This Month</option>
              <option>All Time</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {others.map((person, i) => (
            <motion.div
              key={person.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.04 }}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-secondary/40 transition-colors cursor-pointer group"
            >
              <div className="w-8 text-[15px] font-black text-text-secondary/30 tabular-nums text-center shrink-0">
                {person.rank}
              </div>
              <Avatar fallback={person.name.charAt(0)} size="md" className="bg-secondary border border-border text-primary font-bold shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-[13.5px] font-semibold text-text-main truncate group-hover:text-primary transition-colors">
                  {person.name}
                </h4>
                <p className="text-[12px] text-text-secondary truncate">{person.role}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Medal size={14} className="text-text-secondary/50" />
                <span className="text-[14px] font-bold text-text-main tabular-nums">{person.score}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}

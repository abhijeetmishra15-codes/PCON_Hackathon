import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, Star, Briefcase } from 'lucide-react';
import { Button } from '../components/ui';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.11 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 18 } }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">
      {/* Background ambient blobs — warmer and more visible */}
      <div className="pointer-events-none absolute -top-[15%] -left-[10%] w-[55%] h-[55%] rounded-full bg-primary/[0.13] blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-[15%] -right-[10%] w-[55%] h-[55%] rounded-full bg-accent/[0.12] blur-[140px]" />
      <div className="pointer-events-none absolute top-[40%] left-[50%] w-[30%] h-[30%] rounded-full bg-primary/[0.06] blur-[100px]" />

      {/* Navbar */}
      <nav className="relative z-10 glass-panel border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-btn-primary">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-bold text-[18px] tracking-tight text-text-main">
              AlumniConnect
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-[14px] font-semibold text-text-secondary hover:text-text-main transition-colors px-3 py-2 rounded-xl hover:bg-secondary"
            >
              Log in
            </Link>
            <Link to="/signup">
              <Button size="md">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 sm:pt-28 pb-32">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Hero Content */}
          <div className="max-w-2xl">
            {/* Eyebrow badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/8 border border-primary/20 text-[13px] font-semibold text-primary mb-7"
            >
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              The #1 Networking Platform for Students
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-[52px] sm:text-[64px] lg:text-[72px] font-extrabold text-text-main mb-6 tracking-tighter"
              style={{ lineHeight: '1.05' }}
            >
              Bridge the gap between{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Campus
              </span>{' '}
              and{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Career.
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-[17px] text-text-secondary leading-relaxed mb-9 max-w-lg"
            >
              AI-powered networking, mentorship, and automated referrals.
              Connect with alumni who have walked your path.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
              <Link to="/signup">
                <Button
                  size="lg"
                  rightIcon={<ArrowRight size={18} />}
                  className="shadow-glow"
                >
                  Join the Network
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="bg-white/80">
                  View Demo
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mt-9 pt-7 border-t border-border"
            >
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=40&h=40',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=40&h=40',
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=40&h=40',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover border-2 border-white ring-0"
                  />
                ))}
              </div>
              <p className="text-[13px] text-text-secondary">
                <span className="font-bold text-text-main">2,400+</span> students connected this month
              </p>
            </motion.div>
          </div>

          {/* Hero Visuals */}
          <motion.div variants={itemVariants} className="relative h-[580px] hidden lg:block">
            {/* Floating referral card */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-8 right-8 glass-panel p-4 rounded-card w-64 shadow-floating z-20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-success/10 flex items-center justify-center text-success shrink-0">
                  <Briefcase size={18} />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-text-main">Referral Accepted</div>
                  <div className="text-[11px] text-text-secondary">Google • Software Eng</div>
                </div>
              </div>
              <div className="h-1.5 bg-success/15 rounded-full w-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                />
              </div>
            </motion.div>

            {/* Floating alumni card */}
            <motion.div
              animate={{ y: [0, 18, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
              className="absolute bottom-28 -left-6 bg-white p-5 rounded-modal w-72 shadow-floating z-20 border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-bold text-text-main">AI Career Match</h3>
                <span className="text-[11px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                  98% Match
                </span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=64&h=64"
                  alt="Alumni"
                  className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <div className="text-[13px] font-bold text-text-main">Sarah Jenkins</div>
                  <div className="text-[12px] text-text-secondary">Product Manager @ Stripe</div>
                </div>
              </div>
              <Button variant="secondary" className="w-full mt-4 h-9 text-[13px]">
                Request Intro
              </Button>
            </motion.div>

            {/* Central abstract shape */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-full h-[500px] rounded-[56px] transform rotate-2 overflow-hidden border border-white/50 shadow-[0_20px_80px_rgba(245,158,11,0.15)]"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,243,230,0.8) 0%, rgba(245,158,11,0.15) 40%, rgba(251,146,60,0.12) 100%)',
                  backdropFilter: 'blur(2px)',
                }}
              >
                <div className="grid grid-cols-2 gap-5 p-10 w-full h-full">
                  <div className="rounded-3xl bg-white/60 shadow-sm" />
                  <div className="rounded-3xl bg-white/40 shadow-sm translate-y-8" />
                  <div className="rounded-3xl bg-white/50 shadow-sm -translate-y-4" />
                  <div className="rounded-3xl bg-white/70 shadow-sm translate-y-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

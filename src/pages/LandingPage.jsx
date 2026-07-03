import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap, ArrowRight, Star, Briefcase, Sparkles, Users,
  Search, MessageSquare, Trophy, Shield, Zap, ChevronRight,
  Brain, Target, BookOpen, TrendingUp, CheckCircle, ArrowUpRight,
  Quote, Play, Globe, Award
} from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';

/* ─── Floating Particle ─── */
function FloatingParticle({ delay, x, y, size }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/20"
      style={{ width: size, height: size, left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.6, 0.2],
        scale: [1, 1.2, 1],
      }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

/* ─── Counter Animation ─── */
function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    const el = document.getElementById(`counter-${target}-${suffix}`);
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [target, hasAnimated, duration, suffix]);

  return <span id={`counter-${target}-${suffix}`}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Company Logo ─── */
function CompanyLogo({ name }) {
  return (
    <div className="flex items-center justify-center px-6 lg:px-8">
      <span className="text-[15px] sm:text-[17px] font-bold tracking-tight text-text-secondary/30 select-none whitespace-nowrap">{name}</span>
    </div>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const navBg = useTransform(scrollYProgress, [0, 0.05], [0, 1]);
  const [navOpaque, setNavOpaque] = useState(false);

  useEffect(() => {
    const unsub = navBg.on('change', (v) => setNavOpaque(v > 0.5));
    return unsub;
  }, [navBg]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 20 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] } },
  };

  const features = [
    { icon: <Search size={22} />, title: 'Alumni Discovery', desc: 'Search and filter alumni by company, role, industry, and graduation batch with intelligent ranking.' },
    { icon: <Briefcase size={22} />, title: 'Referral Portal', desc: 'Access curated internship and full-time opportunities posted directly by verified alumni.' },
    { icon: <Brain size={22} />, title: 'AI Career Assistant', desc: 'Get ATS score analysis, resume optimization, personalized roadmaps and smart career guidance.' },
    { icon: <Trophy size={22} />, title: 'Contribution Rewards', desc: 'Alumni earn points for referrals and mentorship. Top contributors are featured on leaderboards.' },
    { icon: <Shield size={22} />, title: 'Verified Network', desc: 'Every user is verified through official college email IDs ensuring a trusted, institutional network.' },
    { icon: <Target size={22} />, title: 'Smart Matching', desc: 'AI matches students with alumni based on skills, interests, and career goals for personalized connections.' },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'SDE Intern at Google',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128',
      text: 'AlumniConnect helped me land my dream internship. The AI resume optimizer improved my ATS score from 45% to 92%, and I got a direct referral from a senior engineer.',
      rating: 5,
    },
    {
      name: 'Rahul Mehta',
      role: 'Alumni — PM at Microsoft',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128',
      text: 'As an alumni, giving back is so seamless. I have referred 12 students this year and tracking their progress on the platform makes it incredibly rewarding.',
      rating: 5,
    },
    {
      name: 'Ananya Gupta',
      role: 'Final Year, CS Department',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&h=128',
      text: 'The career roadmap feature is a game-changer. It suggested certifications and projects that perfectly aligned with my target companies. Got 3 interview calls in a month!',
      rating: 5,
    },
  ];

  const stats = [
    { value: 2400, suffix: '+', label: 'Active Members' },
    { value: 500, suffix: '+', label: 'Companies Represented' },
    { value: 1200, suffix: '+', label: 'Referrals Given' },
    { value: 94, suffix: '%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden relative">

      {/* ═══════════════════════ MESH BACKGROUND ═══════════════════════ */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Main radial gradients */}
        <div className="absolute -top-[20%] -left-[15%] w-[70%] h-[70%] rounded-full bg-primary/[0.08] blur-[160px]" />
        <div className="absolute -bottom-[20%] -right-[15%] w-[60%] h-[60%] rounded-full bg-accent/[0.07] blur-[160px]" />
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-primary/[0.04] blur-[120px]" />
        <div className="absolute top-[60%] left-[20%] w-[30%] h-[30%] rounded-full bg-accent/[0.05] blur-[100px]" />
        {/* Subtle noise texture via CSS */}
        <div className="absolute inset-0 opacity-[0.015]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '128px 128px',
        }} />
        {/* Floating particles */}
        <FloatingParticle delay={0} x={10} y={20} size={6} />
        <FloatingParticle delay={1.2} x={85} y={15} size={4} />
        <FloatingParticle delay={0.5} x={70} y={60} size={5} />
        <FloatingParticle delay={2} x={25} y={70} size={4} />
        <FloatingParticle delay={1.5} x={50} y={40} size={3} />
        <FloatingParticle delay={0.8} x={90} y={80} size={5} />
      </div>

      {/* ═══════════════════════ NAVIGATION ═══════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navOpaque ? 'glass-panel border-b border-border shadow-soft' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-[72px] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-btn-primary group-hover:shadow-glow transition-shadow duration-300">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-extrabold text-[19px] tracking-tight text-text-main">
              Alumni<span className="text-primary">Connect</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {['Features', 'Testimonials', 'Stats'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-4 py-2 text-[14px] font-medium text-text-secondary hover:text-text-main transition-colors rounded-xl hover:bg-secondary/60"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="text-[14px] font-semibold text-text-secondary hover:text-text-main transition-colors px-4 py-2.5 rounded-xl hover:bg-secondary/60"
            >
              Log in
            </Link>
            <Link to="/signup">
              <Button size="md" className="shadow-btn-primary hover:shadow-glow transition-shadow duration-300">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════ HERO SECTION ═══════════════════════ */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 sm:px-8 pt-32 sm:pt-40 pb-24 sm:pb-32">
          <motion.div
            className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* ── Hero Left ── */}
            <div className="max-w-2xl">
              {/* Eyebrow */}
              <motion.div variants={itemVariants}>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-primary/15 shadow-soft text-[13px] font-semibold text-primary mb-8 group cursor-default">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10">
                    <Sparkles className="w-3 h-3 text-primary" />
                  </span>
                  Powered by Generative AI
                  <ChevronRight size={14} className="text-primary/50 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-[44px] sm:text-[56px] lg:text-[68px] font-extrabold text-text-main mb-7 leading-[1.05] tracking-[-0.03em]"
              >
                Your alumni network,{' '}
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[gradient-shift_4s_ease-in-out_infinite]">
                    reimagined
                  </span>
                  <motion.span
                    className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-primary to-accent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                    style={{ transformOrigin: 'left' }}
                  />
                </span>{' '}
                with AI.
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={itemVariants}
                className="text-[17px] sm:text-[19px] text-text-secondary leading-[1.7] mb-10 max-w-lg font-medium"
              >
                Verified alumni connections, AI-powered career coaching, automated referrals, 
                and smart opportunity matching — all in one platform.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
                <Link to="/signup">
                  <Button
                    size="lg"
                    rightIcon={<ArrowRight size={18} />}
                    className="h-[52px] px-8 text-[15px] shadow-glow hover:shadow-[0_12px_40px_rgba(245,158,11,0.25)] transition-all duration-300 hover:-translate-y-0.5"
                  >
                    Start Free Today
                  </Button>
                </Link>
                <Link to="/login">
                  <button className="group flex items-center gap-2.5 h-[52px] px-6 text-[15px] font-semibold text-text-main rounded-btn hover:bg-secondary/60 transition-all duration-200">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-border shadow-soft group-hover:shadow-glow group-hover:border-primary/20 transition-all duration-300">
                      <Play size={14} className="text-primary ml-0.5" />
                    </span>
                    Watch Demo
                  </button>
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4 mt-12 pt-8 border-t border-border/60"
              >
                <div className="flex -space-x-2.5">
                  {[
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=64&h=64',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64',
                  ].map((src, i) => (
                    <motion.img
                      key={i}
                      src={src}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover border-[2.5px] border-background ring-0"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1 + i * 0.1, type: 'spring', stiffness: 200 }}
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-primary text-primary" />
                    ))}
                    <span className="text-[13px] font-bold text-text-main ml-1">4.9</span>
                  </div>
                  <p className="text-[13px] text-text-secondary">
                    <span className="font-bold text-text-main">2,400+</span> students connected this month
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ── Hero Right — Floating Cards ── */}
            <motion.div variants={itemVariants} className="relative h-[620px] hidden lg:block">
              {/* Ambient orbs behind cards */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full bg-primary/[0.07] blur-[80px]" />
              <div className="absolute top-[20%] right-[10%] w-[200px] h-[200px] rounded-full bg-accent/[0.08] blur-[60px]" />

              {/* Main glass panel */}
              <motion.div
                className="absolute inset-6 rounded-[32px] border border-white/40 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,248,242,0.6) 0%, rgba(245,158,11,0.06) 50%, rgba(251,146,60,0.04) 100%)',
                  backdropFilter: 'blur(40px)',
                  boxShadow: '0 20px 80px rgba(245,158,11,0.1), 0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                {/* Inner grid pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                  backgroundSize: '32px 32px',
                }} />
              </motion.div>

              {/* Floating Referral Card */}
              <motion.div
                animate={{ y: [0, -16, 0], rotate: [0, 0.5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-8 right-4 z-20"
              >
                <div className="bg-white/90 backdrop-blur-xl p-5 rounded-2xl w-[260px] shadow-floating border border-white/60">
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center text-success shrink-0">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-text-main">Referral Accepted!</div>
                      <div className="text-[11px] text-text-secondary font-medium">Google • Software Engineer</div>
                    </div>
                  </div>
                  <div className="h-2 bg-success/10 rounded-full w-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-[11px] text-success font-semibold mt-2">Application submitted successfully</p>
                </div>
              </motion.div>

              {/* Floating AI Match Card */}
              <motion.div
                animate={{ y: [0, 18, 0], rotate: [0, -0.5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-20 -left-4 z-20"
              >
                <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl w-[280px] shadow-floating border border-white/60">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-primary" />
                      <h3 className="text-[14px] font-bold text-text-main">AI Career Match</h3>
                    </div>
                    <span className="text-[11px] font-bold text-success bg-success/10 px-2.5 py-1 rounded-full border border-success/20">
                      98% Match
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=64&h=64"
                      alt="Alumni"
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div>
                      <div className="text-[14px] font-bold text-text-main">Sarah Jenkins</div>
                      <div className="text-[12px] text-text-secondary font-medium">Product Manager @ Stripe</div>
                    </div>
                  </div>
                  <div className="flex gap-1.5 mb-4 flex-wrap">
                    {['Product Strategy', 'Fintech', 'Mentoring'].map((s) => (
                      <span key={s} className="px-2 py-[3px] rounded-full text-[10px] font-semibold bg-primary/8 text-primary border border-primary/12">
                        {s}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-2.5 text-[13px] font-semibold text-primary bg-primary/8 rounded-xl border border-primary/15 hover:bg-primary/12 transition-colors">
                    Request Introduction
                  </button>
                </div>
              </motion.div>

              {/* Floating Stats Mini-Card */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute top-[38%] -left-2 z-20"
              >
                <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-floating border border-white/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TrendingUp size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-[18px] font-extrabold text-text-main leading-none">+340%</div>
                      <div className="text-[11px] text-text-secondary font-medium mt-0.5">Placement increase</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating ATS Score Card */}
              <motion.div
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                className="absolute bottom-[35%] right-2 z-20"
              >
                <div className="bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-floating border border-white/60 w-[170px]">
                  <div className="text-[11px] font-semibold text-text-secondary mb-2">ATS Score</div>
                  <div className="flex items-end gap-1.5">
                    <span className="text-[28px] font-extrabold text-success leading-none">92</span>
                    <span className="text-[13px] font-bold text-success mb-0.5">/ 100</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-success rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: '92%' }}
                      transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </motion.div>
        </section>

        {/* ═══════════════════════ COMPANY LOGOS ═══════════════════════ */}
        <section className="relative z-10 border-y border-border/50 bg-white/30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-8">
            <p className="text-center text-[12px] font-semibold uppercase tracking-[0.15em] text-text-secondary/50 mb-7">
              Alumni working at top companies worldwide
            </p>
            <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-4 sm:gap-x-10 lg:gap-x-14 opacity-60">
              {['Google', 'Microsoft', 'Apple', 'Amazon', 'Meta', 'Netflix', 'Stripe', 'Adobe'].map((name) => (
                <CompanyLogo key={name} name={name} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════ STATISTICS ═══════════════════════ */}
        <section id="stats" className="relative z-10 py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={containerVariants}
            >
              {stats.map((stat, idx) => (
                <motion.div key={idx} variants={fadeUp}>
                  <div className="text-center p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:shadow-glow transition-all duration-300 group">
                    <div className="text-[38px] sm:text-[48px] font-extrabold tracking-tight text-text-main leading-none mb-2 group-hover:text-primary transition-colors duration-300">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className="text-[14px] font-semibold text-text-secondary">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════ FEATURES ═══════════════════════ */}
        <section id="features" className="relative z-10 py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={containerVariants}
            >
              <motion.div variants={fadeUp}>
                <Badge variant="primary" className="px-4 py-1.5 text-[12px] font-bold bg-primary/8 text-primary border border-primary/15 mb-6">
                  <Zap size={12} className="mr-1" /> Platform Features
                </Badge>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-[36px] sm:text-[44px] font-extrabold text-text-main tracking-[-0.03em] mb-5 leading-[1.1]"
              >
                Everything you need to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  accelerate
                </span>{' '}
                your career
              </motion.h2>
              <motion.p variants={fadeUp} className="text-[17px] text-text-secondary leading-relaxed font-medium">
                From discovering alumni to landing referrals — our AI-powered platform handles it all.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={containerVariants}
            >
              {features.map((feature, idx) => (
                <motion.div key={idx} variants={fadeUp}>
                  <div className="group relative p-7 rounded-2xl bg-white/70 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 h-full">
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/[0.03] to-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center text-primary mb-5 group-hover:bg-primary/12 group-hover:scale-110 transition-all duration-300">
                        {feature.icon}
                      </div>
                      <h3 className="text-[17px] font-bold text-text-main mb-2.5 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-[14px] text-text-secondary leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════ TESTIMONIALS ═══════════════════════ */}
        <section id="testimonials" className="relative z-10 py-24 sm:py-32 bg-white/30">
          {/* Section ambient */}
          <div className="pointer-events-none absolute top-0 left-[30%] w-[40%] h-[40%] rounded-full bg-primary/[0.04] blur-[120px]" />

          <div className="max-w-7xl mx-auto px-6 sm:px-8 relative">
            <motion.div
              className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={containerVariants}
            >
              <motion.div variants={fadeUp}>
                <Badge variant="primary" className="px-4 py-1.5 text-[12px] font-bold bg-primary/8 text-primary border border-primary/15 mb-6">
                  <Star size={12} className="fill-primary mr-1" /> Testimonials
                </Badge>
              </motion.div>
              <motion.h2
                variants={fadeUp}
                className="text-[36px] sm:text-[44px] font-extrabold text-text-main tracking-[-0.03em] mb-5 leading-[1.1]"
              >
                Loved by students{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                  & alumni
                </span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-[17px] text-text-secondary leading-relaxed font-medium">
                Hear from members who transformed their career journey with AlumniConnect.
              </motion.p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={containerVariants}
            >
              {testimonials.map((t, idx) => (
                <motion.div key={idx} variants={fadeUp}>
                  <div className="group relative p-7 rounded-2xl bg-white/80 backdrop-blur-sm border border-border/50 hover:border-primary/20 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {/* Quote icon */}
                    <Quote size={28} className="text-primary/15 mb-4 shrink-0" />
                    {/* Stars */}
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-primary text-primary" />
                      ))}
                    </div>
                    {/* Text */}
                    <p className="text-[14px] text-text-secondary leading-[1.7] flex-1 mb-6">
                      "{t.text}"
                    </p>
                    {/* Author */}
                    <div className="flex items-center gap-3 pt-5 border-t border-border/50">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <p className="text-[14px] font-bold text-text-main">{t.name}</p>
                        <p className="text-[12px] text-text-secondary font-medium">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════ CTA SECTION ═══════════════════════ */}
        <section className="relative z-10 py-24 sm:py-32">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <motion.div
              className="relative rounded-[28px] overflow-hidden"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-80px' }}
              variants={fadeUp}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-text-main via-[#374151] to-text-main" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/15" />
              <div className="absolute top-0 right-0 w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px]" />

              <div className="relative px-8 sm:px-16 py-16 sm:py-20 text-center">
                <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[12px] font-semibold text-white/70 mb-7">
                  <Globe size={14} /> Join 2,400+ members
                </motion.div>
                <motion.h2
                  variants={fadeUp}
                  className="text-[32px] sm:text-[44px] font-extrabold text-white tracking-[-0.03em] mb-5 leading-[1.1] max-w-2xl mx-auto"
                >
                  Ready to unlock your career potential?
                </motion.h2>
                <motion.p variants={fadeUp} className="text-[17px] text-white/60 max-w-lg mx-auto mb-10 leading-relaxed font-medium">
                  Join the most powerful alumni network built for your institution. Start connecting, learning, and growing today.
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
                  <Link to="/signup">
                    <Button
                      size="lg"
                      rightIcon={<ArrowRight size={18} />}
                      className="h-[52px] px-8 text-[15px] shadow-glow hover:shadow-[0_12px_40px_rgba(245,158,11,0.3)] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      Get Started — It's Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="h-[52px] px-8 text-[15px] bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300">
                      Sign In
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════ FOOTER ═══════════════════════ */}
        <footer className="relative z-10 border-t border-border/50 bg-white/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 sm:py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 mb-16">
              {/* Brand */}
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-btn-primary">
                    <GraduationCap size={20} className="text-white" />
                  </div>
                  <span className="font-extrabold text-[18px] tracking-tight text-text-main">
                    Alumni<span className="text-primary">Connect</span>
                  </span>
                </div>
                <p className="text-[14px] text-text-secondary leading-relaxed max-w-xs">
                  AI-powered alumni networking platform that bridges the gap between campus and career.
                </p>
              </div>

              {/* Links */}
              {[
                { title: 'Platform', links: ['Features', 'AI Assistant', 'Referrals', 'Leaderboard'] },
                { title: 'Resources', links: ['Documentation', 'Career Blog', 'Help Center', 'Privacy Policy'] },
                { title: 'Connect', links: ['About Us', 'Contact', 'Twitter', 'LinkedIn'] },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="text-[13px] font-bold text-text-main uppercase tracking-[0.08em] mb-4">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-[14px] text-text-secondary hover:text-primary font-medium transition-colors">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom */}
            <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[13px] text-text-secondary/60 font-medium">
                © {new Date().getFullYear()} AlumniConnect. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                {['Terms', 'Privacy', 'Cookies'].map((item) => (
                  <a key={item} href="#" className="text-[13px] text-text-secondary/60 hover:text-text-main font-medium transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ═══════════════════════ GLOBAL KEYFRAMES ═══════════════════════ */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}

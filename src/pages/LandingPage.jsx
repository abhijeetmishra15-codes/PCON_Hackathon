import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  motion, useScroll, useTransform, AnimatePresence,
  useMotionValue, useSpring, useInView,
} from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap, ArrowRight, Star, Briefcase, Sparkles, Users,
  Search, MessageSquare, Trophy, Shield, Zap, ChevronRight,
  Brain, Target, TrendingUp, CheckCircle, ArrowUpRight,
  Quote, Play, Globe, Award, UserPlus, Compass, Handshake,
} from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';

/* ══════════════════════════════════════════════════════════
   UTILITY HOOKS
══════════════════════════════════════════════════════════ */
function useMouse() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);
  return { x, y };
}

/* ══════════════════════════════════════════════════════════
   SHARED ANIMATION VARIANTS
══════════════════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
};

const itemUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 20 } },
};

// Alternating card entrance factory
function getCardVariant(idx) {
  if (idx % 3 === 0) return { hidden: { opacity: 0, x: -60, rotate: -1.5 }, show: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.75, ease: [0.25, 0.4, 0.25, 1] } } };
  if (idx % 3 === 1) return { hidden: { opacity: 0, x: 60, rotate: 1.5 }, show: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.75, ease: [0.25, 0.4, 0.25, 1] } } };
  return { hidden: { opacity: 0, y: 60, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: [0.25, 0.4, 0.25, 1] } } };
}

/* ══════════════════════════════════════════════════════════
   FLOATING 3D CUBE
══════════════════════════════════════════════════════════ */
function GlassCube({ size, top, left, right, bottom, duration, delay, zIndex = 10, blur = false, opacity = 0.55 }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top, left, right, bottom,
        width: size, height: size,
        zIndex,
        perspective: '400px',
      }}
      animate={{ y: [0, -20, 0], rotate: [0, 360] }}
      transition={{
        y:      { duration, repeat: Infinity, ease: 'easeInOut', delay },
        rotate: { duration: duration * 2.5, repeat: Infinity, ease: 'linear', delay },
      }}
    >
      <div
        style={{
          width: '100%', height: '100%',
          background: `linear-gradient(135deg, rgba(245,158,11,${opacity}) 0%, rgba(251,146,60,${opacity * 0.7}) 60%, rgba(255,248,242,${opacity * 0.3}) 100%)`,
          borderRadius: '18%',
          border: '1px solid rgba(255,255,255,0.45)',
          backdropFilter: blur ? 'blur(6px)' : 'none',
          boxShadow: `0 8px 32px rgba(245,158,11,0.18), inset 0 1px 0 rgba(255,255,255,0.5)`,
          transform: 'rotateX(20deg) rotateY(20deg)',
        }}
      />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   FLOATING PARTICLE
══════════════════════════════════════════════════════════ */
function FloatingParticle({ delay, x, y, size }) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size, height: size, left: `${x}%`, top: `${y}%`,
        background: 'radial-gradient(circle, rgba(245,158,11,0.5) 0%, rgba(245,158,11,0) 70%)',
      }}
      animate={{ y: [0, -30, 0], opacity: [0.2, 0.7, 0.2], scale: [1, 1.3, 1] }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, delay, ease: 'easeInOut' }}
    />
  );
}

/* ══════════════════════════════════════════════════════════
   COUNT-UP COUNTER
══════════════════════════════════════════════════════════ */
function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2200 }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
      const steps = 70;
      const increment = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) { setCount(target); clearInterval(interval); }
        else setCount(Math.floor(current));
      }, duration / steps);
    }
  }, [inView, target, hasAnimated, duration]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ══════════════════════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════════════════════ */
const TYPEWRITER_PHRASES = [
  'Connecting students with mentors.',
  'Creating careers through referrals.',
  'Building futures with AI guidance.',
  'Opening doors to top companies.',
];

function TypewriterText() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const phrase = TYPEWRITER_PHRASES[phraseIdx];
    let timeout;

    if (!isDeleting && charIdx < phrase.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), 55);
    } else if (!isDeleting && charIdx === phrase.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), 30);
    } else if (isDeleting && charIdx === 0) {
      setIsDeleting(false);
      setPhraseIdx((p) => (p + 1) % TYPEWRITER_PHRASES.length);
    }

    setDisplayed(phrase.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, phraseIdx]);

  return (
    <span className="text-text-secondary">
      {displayed}
      <span
        className="inline-block w-[2px] h-[1em] bg-primary ml-0.5 align-middle"
        style={{ animation: 'typewriter-blink 1s step-end infinite' }}
      />
    </span>
  );
}

/* ══════════════════════════════════════════════════════════
   TILT CARD WRAPPER
══════════════════════════════════════════════════════════ */
function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 200, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rotateX.set(((e.clientY - cy) / (rect.height / 2)) * -2);
    rotateY.set(((e.clientX - cx) / (rect.width / 2)) * 2);
  }, [rotateX, rotateY]);

  const handleMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <motion.div
      ref={ref}
      className={`perspective-1000 ${className}`}
      style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03 }}
      transition={{ scale: { duration: 0.25 } }}
    >
      {children}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   SECTION HEADER
══════════════════════════════════════════════════════════ */
function SectionHeader({ badge, badgeIcon, title, highlight, subtitle }) {
  return (
    <motion.div
      className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
      initial="hidden" whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={stagger}
    >
      <motion.div variants={fadeUp} className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/8 text-primary border border-primary/15 text-[12px] font-bold uppercase tracking-[0.08em]">
          {badgeIcon}
          {badge}
        </span>
      </motion.div>
      <motion.h2
        variants={fadeUp}
        className="text-[36px] sm:text-[46px] font-editorial font-normal text-text-main tracking-[-0.02em] mb-5 leading-[1.1]"
      >
        {title}{' '}
        <span className="gradient-text italic">{highlight}</span>
      </motion.h2>
      {subtitle && (
        <motion.p variants={fadeUp} className="text-[17px] text-text-secondary leading-relaxed font-medium">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════════════ */
function StatCard({ value, suffix, prefix, label, icon, idx }) {
  return (
    <motion.div
      variants={getCardVariant(idx)}
      whileHover={{
        y: -8,
        boxShadow: '0 16px 48px rgba(245,158,11,0.22), 0 4px 16px rgba(0,0,0,0.06)',
        transition: { duration: 0.25 },
      }}
    >
      <TiltCard className="h-full">
        <div className="relative p-8 rounded-[28px] bg-white/70 backdrop-blur-sm border border-white/80 h-full overflow-hidden group"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.04), 0 8px 32px rgba(245,158,11,0.06)' }}>
          {/* Ambient gradient */}
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-primary/[0.04] to-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all duration-500" />

          <div className="relative z-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/8 flex items-center justify-center text-primary mx-auto mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
              {icon}
            </div>
            <div className="text-[44px] sm:text-[52px] font-extrabold tracking-tight text-text-main leading-none mb-2 group-hover:text-primary transition-colors duration-400 font-editorial">
              <AnimatedCounter target={value} suffix={suffix} prefix={prefix} />
            </div>
            <p className="text-[14px] font-semibold text-text-secondary">{label}</p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   FEATURE CARD
══════════════════════════════════════════════════════════ */
function FeatureCard({ icon, title, desc, idx }) {
  return (
    <motion.div variants={getCardVariant(idx)}>
      <TiltCard className="h-full">
        <div className="group relative p-8 rounded-[28px] bg-white/70 backdrop-blur-sm border border-white/80 h-full overflow-hidden"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.04), 0 8px 32px rgba(245,158,11,0.05)' }}>
          {/* Hover overlay */}
          <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-primary/[0.05] to-accent/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
          {/* Glow spot */}
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-primary/[0.08] blur-2xl group-hover:bg-primary/[0.18] group-hover:scale-150 transition-all duration-500" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-primary/8 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/15 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              {icon}
            </div>
            <h3 className="text-[18px] font-bold text-text-main mb-3 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-5">
              {desc}
            </p>
            <div className="flex items-center gap-1.5 text-[13px] font-semibold text-primary opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              Learn more
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   PROCESS STEP
══════════════════════════════════════════════════════════ */
function ProcessStep({ icon, num, title, desc, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <motion.div
        className="relative w-16 h-16 rounded-2xl bg-white border border-primary/15 flex items-center justify-center text-primary mb-4"
        style={{ boxShadow: '0 4px 20px rgba(245,158,11,0.14)' }}
        animate={inView ? { y: [0, -8, 0] } : {}}
        transition={{ duration: 2.5, delay: delay + 0.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {icon}
        <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent text-white text-[11px] font-extrabold flex items-center justify-center shadow-btn-primary">
          {num}
        </span>
      </motion.div>
      <h3 className="text-[16px] font-bold text-text-main mb-2">{title}</h3>
      <p className="text-[13px] text-text-secondary leading-relaxed max-w-[160px]">{desc}</p>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN LANDING PAGE
══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const { scrollY, scrollYProgress } = useScroll();
  const [navScrolled, setNavScrolled] = useState(false);
  const [navCompact, setNavCompact] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    const unsub = scrollY.on('change', (v) => {
      setNavScrolled(v > 20);
      setNavCompact(v > 80);
    });
    return unsub;
  }, [scrollY]);

  /* ── Data ── */
  const features = [
    { icon: <Search size={24} />, title: 'Alumni Discovery', desc: 'Search and filter alumni by company, role, industry, and graduation batch with intelligent AI ranking.' },
    { icon: <Briefcase size={24} />, title: 'Referral Portal', desc: 'Access curated internship and full-time opportunities posted directly by verified alumni.' },
    { icon: <Trophy size={24} />, title: 'Contribution Rewards', desc: 'Alumni earn points for referrals and mentorship. Top contributors are featured on leaderboards.' },
    { icon: <Shield size={24} />, title: 'Verified Network', desc: 'Every user is verified through official college email IDs ensuring a trusted, institutional network.' },
    { icon: <Target size={24} />, title: 'Smart Matching', desc: 'AI matches students with alumni based on skills, interests, and career goals for personalized connections.' },
  ];

  const stats = [
    { value: 2400, suffix: '+',  prefix: '', label: 'Active Members',        icon: <Users size={22} /> },
    { value: 500,  suffix: '+',  prefix: '', label: 'Companies Represented',  icon: <Globe size={22} /> },
    { value: 1200, suffix: '+',  prefix: '', label: 'Referrals Given',         icon: <Handshake size={22} /> },
    { value: 94,   suffix: '%',  prefix: '', label: 'Placement Success Rate',  icon: <Award size={22} /> },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma', role: 'SDE Intern at Google',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128',
      text: 'AlumniConnect helped me land my dream internship. The AI resume optimizer improved my ATS score from 45% to 92%, and I got a direct referral from a senior engineer.',
      rating: 5,
    },
    {
      name: 'Rahul Mehta', role: 'Alumni — PM at Microsoft',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128',
      text: 'As an alumni, giving back is seamless. I\'ve referred 12 students this year and tracking their progress on the platform is incredibly rewarding.',
      rating: 5,
    },
    {
      name: 'Ananya Gupta', role: 'Final Year, CS Department',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&h=128',
      text: 'The career roadmap feature is a game-changer. It suggested certifications that aligned perfectly with my target companies. Got 3 interview calls in a month!',
      rating: 5,
    },
  ];

  const LOGOS = ['Google', 'Microsoft', 'Apple', 'Meta', 'Amazon', 'Adobe', 'Netflix', 'Stripe', 'Oracle', 'IBM', 'NVIDIA'];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative">

      {/* ════════════════ MESH BACKGROUND ════════════════ */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Animated blobs */}
        <motion.div
          className="absolute -top-[25%] -left-[10%] w-[65%] h-[65%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)' }}
          animate={{ x: [0, 30, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-[20%] -right-[10%] w-[55%] h-[55%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.09) 0%, transparent 70%)' }}
          animate={{ x: [0, -25, 0], y: [0, -15, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
        <motion.div
          className="absolute top-[35%] right-[5%] w-[40%] h-[40%] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }}
          animate={{ x: [0, -20, 0], y: [0, 25, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        />
        {/* Subtle light beams */}
        <div className="absolute top-0 left-[30%] w-[1px] h-[40%] opacity-[0.04]"
          style={{ background: 'linear-gradient(to bottom, rgba(245,158,11,0.8), transparent)' }} />
        <div className="absolute top-0 left-[60%] w-[1px] h-[30%] opacity-[0.03]"
          style={{ background: 'linear-gradient(to bottom, rgba(251,146,60,0.8), transparent)' }} />
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.018] noise-overlay" />
        {/* Particles */}
        {[
          [0,   10, 18,  8], [1.2, 88, 12,  5], [0.5, 72, 58,  6],
          [2,   22, 72,  4], [1.5, 52, 38,  3], [0.8, 92, 82,  7],
          [3,   40, 25,  4], [2.5, 18, 85,  5],
        ].map(([delay, x, y, size], i) => (
          <FloatingParticle key={i} delay={delay} x={x} y={y} size={size} />
        ))}
      </div>

      {/* ════════════════ NAVBAR ════════════════ */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navScrolled
            ? 'glass-panel border-b border-border shadow-soft'
            : 'bg-transparent border-b border-transparent'
        }`}
        animate={{ height: navCompact ? 60 : 72 }}
        transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              style={{ boxShadow: '0 2px 8px rgba(245,158,11,0.38)' }}
              whileHover={{ scale: 1.08, rotate: 4 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <GraduationCap size={19} className="text-white" />
            </motion.div>
            <span className="font-extrabold text-[19px] tracking-tight text-text-main">
              Alumni<span className="text-primary">Connect</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {['Features', 'Testimonials', 'Stats', 'About', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`}
                className="relative px-4 py-2 text-[14px] font-medium text-text-secondary hover:text-text-main transition-colors group">
                {item}
                <span className="absolute bottom-1 left-4 right-4 h-[2px] rounded-full bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <Link to="/login"
              className="text-[14px] font-semibold text-text-secondary hover:text-text-main transition-colors px-4 py-2.5 rounded-xl hover:bg-secondary/60">
              Log in
            </Link>
            <Link to="/signup">
              <motion.button
                className="h-[40px] px-5 rounded-btn bg-gradient-to-r from-primary to-accent text-white text-[14px] font-bold"
                style={{ boxShadow: '0 2px 8px rgba(245,158,11,0.38)' }}
                whileHover={{ scale: 1.04, boxShadow: '0 6px 24px rgba(245,158,11,0.35)' }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started Free
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ════════════════ HERO SECTION ════════════════ */}
      <main className="relative z-10">
        <section ref={heroRef} className="max-w-[1280px] mx-auto px-6 sm:px-8 pt-36 sm:pt-44 pb-28 sm:pb-36">
          <motion.div
            className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center"
            initial="hidden" animate="show" variants={stagger}
          >
            {/* ── Left ── */}
            <div className="max-w-2xl">
              {/* Eyebrow badge */}
              <motion.div variants={itemUp} className="mb-8">
                <motion.div
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-primary/15 text-[13px] font-semibold text-primary cursor-default"
                  style={{ boxShadow: '0 2px 12px rgba(245,158,11,0.10)' }}
                  whileHover={{ scale: 1.03 }}
                >
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-primary" />
                  </span>
                  Powered by Generative AI
                  <ChevronRight size={14} className="text-primary/50" />
                </motion.div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={itemUp}
                className="text-[48px] sm:text-[60px] lg:text-[70px] font-editorial font-normal text-text-main mb-7 leading-[1.05] tracking-[-0.02em]"
              >
                Your alumni network,{' '}
                <motion.span
                  className="relative inline-block"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                >
                  <span className="italic gradient-text">reimagined</span>
                  <motion.span
                    className="absolute -bottom-1.5 left-0 right-0 h-[3px] rounded-full"
                    style={{ background: 'linear-gradient(90deg, #F59E0B, #FB923C)' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1.1, duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
                  />
                </motion.span>{' '}
                with AI.
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={itemUp}
                className="text-[17px] sm:text-[19px] text-text-secondary leading-[1.75] mb-5 max-w-xl font-medium"
              >
                Verified connections, AI-powered career coaching, automated referrals,
                and smart opportunity matching — all in one platform.
              </motion.p>

              {/* Typewriter */}
              <motion.div variants={itemUp} className="mb-10 h-7 text-[15px] font-medium">
                <TypewriterText />
              </motion.div>

              {/* CTAs */}
              <motion.div variants={itemUp} className="flex flex-wrap items-center gap-4 mb-12">
                <Link to="/signup">
                  <motion.button
                    className="group flex items-center gap-2.5 h-[52px] px-8 rounded-btn bg-gradient-to-r from-primary to-accent text-white text-[15px] font-bold"
                    style={{ boxShadow: '0 4px 20px rgba(245,158,11,0.38)' }}
                    whileHover={{ scale: 1.04, y: -2, boxShadow: '0 10px 36px rgba(245,158,11,0.38)' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Start Free Today
                    <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    className="group flex items-center gap-3 h-[52px] px-6 text-[15px] font-semibold text-text-main rounded-btn border border-border/60 bg-white/60 backdrop-blur-sm hover:border-primary/25 hover:bg-white/80 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/8 group-hover:bg-primary/14 transition-colors duration-300">
                      <Play size={12} className="text-primary ml-0.5" />
                    </span>
                    Watch Demo
                  </motion.button>
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                variants={itemUp}
                className="flex items-center gap-4 pt-8 border-t border-border/50"
              >
                <div className="flex -space-x-2.5">
                  {[
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=64&h=64',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=64&h=64',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&h=64',
                  ].map((src, i) => (
                    <motion.img key={i} src={src} alt="" className="w-9 h-9 rounded-full object-cover border-[2.5px] border-background"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1.2 + i * 0.1, type: 'spring', stiffness: 200 }} />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-primary text-primary" />)}
                    <span className="text-[13px] font-bold text-text-main ml-1">4.9</span>
                  </div>
                  <p className="text-[13px] text-text-secondary">
                    <span className="font-bold text-text-main">2,400+</span> students connected this month
                  </p>
                </div>
              </motion.div>
            </div>

            {/* ── Right — Floating Hero Showcase ── */}
            <motion.div variants={itemUp} className="relative h-[640px] hidden lg:block">
              {/* 3D Floating Glass Cubes */}
              <GlassCube size={52} top="5%"  left="8%"  duration={7}  delay={0}   zIndex={8}  opacity={0.5} />
              <GlassCube size={36} top="12%" right="4%" duration={9}  delay={1}   zIndex={25} opacity={0.45} blur />
              <GlassCube size={68} top="55%" left="2%"  duration={8}  delay={1.5} zIndex={6}  opacity={0.4} />
              <GlassCube size={28} top="78%" right="8%" duration={6}  delay={0.5} zIndex={25} opacity={0.55} blur />
              <GlassCube size={44} top="30%" left="48%" duration={10} delay={2}   zIndex={5}  opacity={0.35} />
              <GlassCube size={32} top="88%" left="35%" duration={7}  delay={2.5} zIndex={8}  opacity={0.45} blur />
              <GlassCube size={20} top="22%" right="18%" duration={5} delay={3}   zIndex={28} opacity={0.6} />
              <GlassCube size={56} top="68%" right="2%" duration={11} delay={1}   zIndex={4}  opacity={0.3} />

              {/* Ambient glow orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full"
                style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 70%)' }} />

              {/* Glass backdrop panel */}
              <motion.div
                className="absolute inset-8 rounded-[32px] border border-white/50 overflow-hidden"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,248,242,0.55) 0%, rgba(245,158,11,0.06) 50%, rgba(251,146,60,0.04) 100%)',
                  backdropFilter: 'blur(40px)',
                  boxShadow: '0 20px 80px rgba(245,158,11,0.10), 0 1px 3px rgba(0,0,0,0.04)',
                  zIndex: 10,
                }}
              >
                {/* Grid lines */}
                <div className="absolute inset-0 opacity-[0.04]" style={{
                  backgroundImage: 'linear-gradient(rgba(0,0,0,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.15) 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                }} />
              </motion.div>

              {/* Referral Accepted Card */}
              <motion.div
                className="absolute top-8 right-6 z-20"
                initial={{ opacity: 0, y: -20, x: 20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <motion.div
                  animate={{ y: [0, -14, 0], rotate: [0, 0.5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl w-[260px] border border-white/80"
                    style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(245,158,11,0.08)' }}>
                    <div className="flex items-center gap-3 mb-3.5">
                      <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] shrink-0">
                        <CheckCircle size={19} />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-text-main">Referral Accepted!</div>
                        <div className="text-[11px] text-text-secondary font-medium">Google • Software Engineer</div>
                      </div>
                    </div>
                    <div className="h-2 bg-[#22C55E]/10 rounded-full w-full overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #22C55E, #86EFAC)' }}
                        initial={{ width: '0%' }} animate={{ width: '100%' }}
                        transition={{ duration: 2, delay: 1, ease: 'easeOut' }} />
                    </div>
                    <p className="text-[11px] text-[#22C55E] font-semibold mt-2">Application submitted successfully</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* AI Career Match Card */}
              <motion.div
                className="absolute bottom-24 -left-2 z-20"
                initial={{ opacity: 0, y: 20, x: -20 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <motion.div
                  animate={{ y: [0, 18, 0], rotate: [0, -0.4, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <div className="bg-white/95 backdrop-blur-xl p-5 rounded-2xl w-[280px] border border-white/80"
                    style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(245,158,11,0.08)' }}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Sparkles size={15} className="text-primary" />
                        <h3 className="text-[14px] font-bold text-text-main">AI Career Match</h3>
                      </div>
                      <span className="text-[11px] font-bold text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-1 rounded-full border border-[#22C55E]/20">
                        98% Match
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=64&h=64"
                        alt="Alumni" className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm" />
                      <div>
                        <div className="text-[14px] font-bold text-text-main">Sarah Jenkins</div>
                        <div className="text-[12px] text-text-secondary font-medium">Product Manager @ Stripe</div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-wrap mb-4">
                      {['Product Strategy', 'Fintech', 'Mentoring'].map((s) => (
                        <span key={s} className="px-2 py-[3px] rounded-full text-[10px] font-semibold text-primary border border-primary/15"
                          style={{ background: 'rgba(245,158,11,0.07)' }}>
                          {s}
                        </span>
                      ))}
                    </div>
                    <button className="w-full py-2.5 text-[13px] font-semibold text-primary rounded-xl border border-primary/15 transition-colors hover:bg-primary/12"
                      style={{ background: 'rgba(245,158,11,0.07)' }}>
                      Request Introduction
                    </button>
                  </div>
                </motion.div>
              </motion.div>

              {/* Placement Increase Mini Card */}
              <motion.div
                className="absolute top-[38%] -left-4 z-20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                  <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-white/80"
                    style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(245,158,11,0.08)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <TrendingUp size={17} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-[20px] font-extrabold text-text-main leading-none">+340%</div>
                        <div className="text-[11px] text-text-secondary font-medium mt-0.5">Placement increase</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* ATS Score Card */}
              <motion.div
                className="absolute bottom-[32%] right-4 z-20"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <motion.div
                  animate={{ y: [0, 14, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                >
                  <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-white/80 w-[164px]"
                    style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(245,158,11,0.08)' }}>
                    <div className="text-[11px] font-semibold text-text-secondary mb-2">ATS Score</div>
                    <div className="flex items-end gap-1">
                      <span className="text-[30px] font-extrabold text-[#22C55E] leading-none">92</span>
                      <span className="text-[13px] font-bold text-[#22C55E] mb-0.5">/ 100</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
                      <motion.div className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #F59E0B, #22C55E)' }}
                        initial={{ width: '0%' }} animate={{ width: '92%' }}
                        transition={{ duration: 1.5, delay: 1.2, ease: 'easeOut' }} />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* ════════════════ LOGO MARQUEE ════════════════ */}
        <section className="relative z-10 border-y border-border/40 bg-white/35 backdrop-blur-sm py-7 overflow-hidden">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary/40 mb-6">
            Alumni working at top companies worldwide
          </p>
          <div className="marquee-mask overflow-hidden">
            <div className="marquee-track">
              {[...LOGOS, ...LOGOS].map((name, i) => (
                <div key={i} className="flex items-center justify-center px-10 shrink-0">
                  <span className="text-[18px] font-extrabold tracking-tight text-text-secondary/22 select-none whitespace-nowrap hover:text-text-secondary/50 transition-colors duration-300 cursor-default">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════ STATISTICS ════════════════ */}
        <section id="stats" className="relative z-10 py-28 sm:py-36">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
            <SectionHeader
              badge="Platform Impact"
              badgeIcon={<TrendingUp size={12} className="mr-1" />}
              title="Numbers that speak"
              highlight="for themselves."
              subtitle="Real outcomes from students and alumni who transformed their careers using AlumniConnect."
            />
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
              initial="hidden" whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
            >
              {stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} idx={idx} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════════════════ FEATURES ════════════════ */}
        <section id="features" className="relative z-10 py-28 sm:py-36">
          {/* Section background blob */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-[10%] left-[5%] w-[40%] h-[50%] rounded-full opacity-40"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)' }} />
          </div>
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative">
            <SectionHeader
              badge="Powerful Features"
              badgeIcon={<Zap size={12} className="mr-1" />}
              title="Everything you need to"
              highlight="accelerate your career."
              subtitle="From discovering alumni to landing referrals — our AI-powered platform handles it all."
            />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
              initial="hidden" whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              variants={stagger}
            >
              {features.map((feat, idx) => (
                <FeatureCard key={idx} {...feat} idx={idx} />
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════════════════ PROCESS SECTION ════════════════ */}
        <section id="about" className="relative z-10 py-28 sm:py-36 overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-[20%] right-[10%] w-[35%] h-[50%] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(251,146,60,0.06) 0%, transparent 70%)' }} />
          </div>
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative">
            <SectionHeader
              badge="Simple Process"
              badgeIcon={<Compass size={12} className="mr-1" />}
              title="How AlumniConnect"
              highlight="works?"
              subtitle="Four simple steps from sign-up to career breakthrough. It's that straightforward."
            />

            {/* Process steps with connecting path */}
            <div className="relative mt-16">
              {/* SVG connecting path (desktop only) */}
              <div className="hidden lg:block absolute top-8 left-0 right-0 h-0 z-0 px-24">
                <svg className="w-full" height="60" viewBox="0 0 900 60" fill="none" preserveAspectRatio="none">
                  <motion.path
                    d="M 60 30 C 180 5, 270 55, 390 30 S 570 5, 690 30 S 810 55, 900 30"
                    stroke="url(#pathGrad)"
                    strokeWidth="2"
                    strokeDasharray="8 6"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.8, ease: 'easeInOut', delay: 0.3 }}
                  />
                  <defs>
                    <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#FB923C" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 relative z-10">
                <ProcessStep
                  icon={<UserPlus size={22} />} num="01"
                  title="Create Account" delay={0.1}
                  desc="Sign up and build your profile in minutes."
                />
                <ProcessStep
                  icon={<Search size={22} />} num="02"
                  title="Explore & Connect" delay={0.3}
                  desc="Find alumni, peers, and opportunities."
                />
                <ProcessStep
                  icon={<Handshake size={22} />} num="03"
                  title="Collaborate & Grow" delay={0.5}
                  desc="Share knowledge, get referrals, and advance your career."
                />
                <ProcessStep
                  icon={<Trophy size={22} />} num="04"
                  title="Achieve Together" delay={0.7}
                  desc="Build a stronger network and create real impact."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════ TESTIMONIALS ════════════════ */}
        <section id="testimonials" className="relative z-10 py-28 sm:py-36">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-[25%] w-[50%] h-[40%] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)' }} />
          </div>
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 relative">
            <SectionHeader
              badge="Testimonials"
              badgeIcon={<Star size={12} className="fill-primary mr-1" />}
              title="Loved by students"
              highlight="& alumni alike."
              subtitle="Hear from members who transformed their career journey with AlumniConnect."
            />
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6"
              initial="hidden" whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={stagger}
            >
              {testimonials.map((t, idx) => (
                <motion.div key={idx} variants={getCardVariant(idx)}>
                  <TiltCard className="h-full">
                    <div className="group relative p-8 rounded-[28px] bg-white/70 backdrop-blur-sm border border-white/80 h-full flex flex-col overflow-hidden"
                      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.04), 0 8px 32px rgba(245,158,11,0.05)' }}>
                      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-primary/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                      <div className="relative z-10 flex flex-col h-full">
                        <Quote size={32} className="mb-4 shrink-0" style={{ color: 'rgba(245,158,11,0.18)' }} />
                        <div className="flex gap-0.5 mb-4">
                          {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="fill-primary text-primary" />)}
                        </div>
                        <p className="text-[14px] text-text-secondary leading-[1.75] flex-1 mb-6">
                          "{t.text}"
                        </p>
                        <div className="flex items-center gap-3 pt-5 border-t border-border/50">
                          <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                          <div>
                            <p className="text-[14px] font-bold text-text-main">{t.name}</p>
                            <p className="text-[12px] text-text-secondary font-medium">{t.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ════════════════ CTA SECTION ════════════════ */}
        <section id="contact" className="relative z-10 py-28 sm:py-36">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8">
            <motion.div
              className="relative rounded-[32px] overflow-hidden"
              initial="hidden" whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
            >
              {/* Warm cream gradient background — NOT dark */}
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, #FFF3E6 0%, #FFE8C8 40%, #FFF0DA 70%, #FFF8F2 100%)' }} />
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 60% 80% at 85% 20%, rgba(245,158,11,0.18) 0%, transparent 60%)' }} />
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse 40% 60% at 15% 90%, rgba(251,146,60,0.12) 0%, transparent 60%)' }} />
              {/* Border */}
              <div className="absolute inset-0 rounded-[32px] border border-primary/15" />
              {/* Decorative cubes */}
              <GlassCube size={60} top="10%"  right="8%"  duration={8}  delay={0}   zIndex={1}  opacity={0.35} />
              <GlassCube size={40} bottom="15%" left="5%"  duration={10} delay={1.5} zIndex={1}  opacity={0.3} />

              <div className="relative z-10 px-8 sm:px-16 py-20 sm:py-24 text-center">
                <motion.div variants={fadeUp}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[12px] font-bold text-primary mb-7 uppercase tracking-[0.08em]">
                  <Globe size={13} /> Join 2,400+ members
                </motion.div>
                <motion.h2 variants={fadeUp}
                  className="text-[34px] sm:text-[48px] font-editorial font-normal text-text-main tracking-[-0.02em] mb-5 leading-[1.1] max-w-2xl mx-auto">
                  Ready to unlock your future with the{' '}
                  <span className="italic gradient-text">power of AI?</span>
                </motion.h2>
                <motion.p variants={fadeUp} className="text-[17px] text-text-secondary max-w-lg mx-auto mb-10 leading-relaxed font-medium">
                  Join thousands of students and alumni already growing together on AlumniConnect.
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
                  <Link to="/signup">
                    <motion.button
                      className="group flex items-center gap-2.5 h-[52px] px-8 rounded-btn bg-gradient-to-r from-primary to-accent text-white text-[15px] font-bold"
                      style={{ boxShadow: '0 4px 20px rgba(245,158,11,0.38)' }}
                      whileHover={{ scale: 1.04, y: -2, boxShadow: '0 10px 36px rgba(245,158,11,0.40)' }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Get Started Free
                      <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </Link>
                  <Link to="/login">
                    <motion.button
                      className="h-[52px] px-8 rounded-btn bg-white/80 border border-primary/20 text-text-main text-[15px] font-bold hover:bg-white hover:border-primary/35 transition-all duration-300 backdrop-blur-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Sign In
                    </motion.button>
                  </Link>
                </motion.div>
                <p className="text-[12px] text-text-secondary/50 mt-5 font-medium">No credit card required</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════ FOOTER ════════════════ */}
        <footer className="relative z-10 border-t border-border/40 bg-white/25 backdrop-blur-sm">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-8 py-16 sm:py-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 mb-16">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
                    style={{ boxShadow: '0 2px 8px rgba(245,158,11,0.38)' }}>
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
              {[
                { title: 'Platform', links: ['Features', 'AI Assistant', 'Referrals', 'Leaderboard'] },
                { title: 'Resources', links: ['Documentation', 'Career Blog', 'Help Center', 'Privacy Policy'] },
                { title: 'Connect', links: ['About Us', 'Contact', 'Twitter', 'LinkedIn'] },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="text-[12px] font-bold text-text-main uppercase tracking-[0.10em] mb-5">{section.title}</h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-[14px] text-text-secondary hover:text-primary font-medium transition-colors group relative inline-block">
                          {link}
                          <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-primary group-hover:w-full transition-all duration-300 rounded-full" />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-[13px] text-text-secondary/55 font-medium">
                © {new Date().getFullYear()} AlumniConnect. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                {['Terms', 'Privacy', 'Cookies'].map((item) => (
                  <a key={item} href="#" className="text-[13px] text-text-secondary/55 hover:text-text-main font-medium transition-colors">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ════════════════ INLINE KEYFRAMES ════════════════ */}
      <style>{`
        @keyframes typewriter-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
}

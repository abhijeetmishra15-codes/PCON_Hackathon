import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, Calendar, BookOpen, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';

// --- Password Strength Meter ---
function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 14) score++;
  const levels = [
    { label: '', color: '' },
    { label: 'Very Weak', color: '#EF4444' },
    { label: 'Weak', color: '#F97316' },
    { label: 'Fair', color: '#EAB308' },
    { label: 'Strong', color: '#22C55E' },
    { label: 'Very Strong', color: '#10B981' },
  ];
  return { score, ...levels[score] };
}

function PasswordStrengthMeter({ password }) {
  const { score, label, color } = getPasswordStrength(password);
  if (!password) return null;
  const pct = (score / 5) * 100;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-2 space-y-1.5"
    >
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="strength-bar-bg">
            <div
              className="strength-bar-fill"
              style={{
                width: score >= i ? '100%' : '0%',
                background: color,
              }}
            />
          </div>
        ))}
      </div>
      {label && (
        <p className="text-[11px] font-semibold" style={{ color }}>
          {label} password
        </p>
      )}
    </motion.div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [accountCategory, setAccountCategory] = useState('university');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    department: '',
    graduationYear: new Date().getFullYear() + 1
  });

  const [derivedRole, setDerivedRole] = useState('student');

  // Auto-calculate role based on graduation year — UNCHANGED LOGIC
  useEffect(() => {
    if (accountCategory === 'visitor') {
      setDerivedRole('visitor');
      return;
    }
    const currentYear = new Date().getFullYear();
    const gradYear = parseInt(formData.graduationYear, 10);
    if (!isNaN(gradYear)) {
      setDerivedRole(gradYear > currentYear ? 'student' : 'alumni');
    }
  }, [formData.graduationYear, accountCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  // UNCHANGED SIGNUP LOGIC
  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: derivedRole,
            department: accountCategory === 'university' ? formData.department : null,
            graduation_year: accountCategory === 'university' ? parseInt(formData.graduationYear, 10) : null
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.session) {
        navigate('/dashboard');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during sign up.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleColors = {
    student: '#F59E0B',
    alumni: '#22C55E',
    visitor: '#6B7280',
  };
  const roleColor = roleColors[derivedRole];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl auth-icon-wrapper mb-5"
        >
          <GraduationCap size={30} className="text-yellow-400" />
        </motion.div>
        <h1 className="text-[30px] font-bold tracking-tight text-white mb-1.5">
          Create an account
        </h1>
        <p className="text-[14px] auth-text-secondary">
          Join your university's exclusive alumni network
        </p>
      </div>

      <div className="auth-glass-card p-7">

        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="auth-success-box p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1.5px solid rgba(34,197,94,0.35)' }}>
                <CheckCircle size={32} className="text-green-400" />
              </div>
              <h3 className="text-[18px] font-bold text-white mb-2">Verify your email</h3>
              <p className="text-[13px] auth-text-secondary mb-5 leading-relaxed">
                We've sent a verification link to{' '}
                <strong className="text-white/80">{formData.email}</strong>.
                Please check your inbox and click the link to activate your account.
              </p>
              <Link to="/login">
                <button className="auth-btn-outline w-full h-11 text-sm flex items-center justify-center">
                  Return to Login
                </button>
              </Link>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSignup}
              className="space-y-5"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="auth-error-box p-3.5 flex items-start gap-2.5"
                >
                  <AlertCircle size={17} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}

              {/* Account Type Tabs */}
              <div className="flex p-1 rounded-xl gap-1" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                  type="button"
                  onClick={() => setAccountCategory('university')}
                  className={cn(
                    'flex-1 py-2.5 text-[13px] font-semibold rounded-lg transition-all',
                    accountCategory === 'university' ? 'auth-tab-active' : 'auth-tab-inactive'
                  )}
                >
                  University Member
                </button>
                <button
                  type="button"
                  onClick={() => setAccountCategory('visitor')}
                  className={cn(
                    'flex-1 py-2.5 text-[13px] font-semibold rounded-lg transition-all',
                    accountCategory === 'visitor' ? 'auth-tab-active' : 'auth-tab-inactive'
                  )}
                >
                  Visitor
                </button>
              </div>

              {/* Dynamic Role Indicator */}
              <motion.div
                layout
                className="auth-role-indicator flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest auth-text-secondary mb-0.5">Account Type</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-white capitalize">
                      {derivedRole}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${roleColor}22`, color: roleColor, border: `1px solid ${roleColor}44` }}
                    >
                      {accountCategory === 'university' ? 'Auto-detected' : 'Selected'}
                    </span>
                  </div>
                </div>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: `${roleColor}1A`, border: `1.5px solid ${roleColor}44` }}
                >
                  {derivedRole === 'visitor'
                    ? <Eye size={18} style={{ color: roleColor }} />
                    : <GraduationCap size={18} style={{ color: roleColor }} />
                  }
                </div>
              </motion.div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="auth-label block">Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="auth-input-field w-full h-11 pl-11 pr-4 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="auth-label block">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={accountCategory === 'university' ? 'name@university.edu' : 'name@example.com'}
                      required
                      className="auth-input-field w-full h-11 pl-11 pr-4 text-sm"
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {accountCategory === 'university' && (
                    <>
                      <motion.div
                        key="dept"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5"
                      >
                        <label className="auth-label block">Department</label>
                        <div className="relative">
                          <BookOpen size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
                          <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="e.g. Computer Science"
                            required
                            className="auth-input-field w-full h-11 pl-11 pr-4 text-sm"
                          />
                        </div>
                      </motion.div>

                      <motion.div
                        key="year"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-1.5"
                      >
                        <label className="auth-label block">Graduation Year</label>
                        <div className="relative">
                          <Calendar size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
                          <input
                            type="number"
                            name="graduationYear"
                            value={formData.graduationYear}
                            onChange={handleChange}
                            placeholder="YYYY"
                            min="1950"
                            max="2030"
                            required
                            className="auth-input-field w-full h-11 pl-11 pr-4 text-sm"
                          />
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="auth-label block">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    required
                    className="auth-input-field w-full h-11 pl-11 pr-12 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrengthMeter password={formData.password} />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="auth-btn-primary w-full h-12 text-[14px] mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed capitalize"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  `Create ${derivedRole} Account`
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="mt-6 pt-5 border-t auth-divider text-center text-[12px] auth-text-secondary">
          By signing up, you agree to our{' '}
          <a href="#" className="auth-text-primary-link">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="auth-text-primary-link">Privacy Policy</a>.
        </div>

        <div className="mt-3 text-center">
          <p className="text-[13px] auth-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="auth-text-primary-link">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// --- Password Strength Meter (same as Signup) ---
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
              style={{ width: score >= i ? '100%' : '0%', background: color }}
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

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // UNCHANGED LOGIC
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('No active session found. Your password reset link may have expired or is invalid.');
      }
    };
    checkSession();
  }, []);

  // UNCHANGED LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <ShieldCheck size={28} className="text-yellow-400" />
        </motion.div>
        <h1 className="text-[28px] font-bold tracking-tight text-white mb-1.5">
          Create new password
        </h1>
        <p className="text-[14px] auth-text-secondary">
          Please enter your new password below.
        </p>
      </div>

      <div className="auth-glass-card p-8">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 220 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1.5px solid rgba(34,197,94,0.35)' }}
              >
                <CheckCircle size={32} className="text-green-400" />
              </motion.div>
              <h3 className="text-[18px] font-bold text-white mb-2">Password Updated!</h3>
              <p className="auth-text-secondary text-[13px] mb-6 leading-relaxed">
                Your password has been successfully reset. Redirecting to dashboard...
              </p>
              <div className="flex justify-center">
                <svg className="animate-spin h-5 w-5 text-yellow-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="auth-error-box p-3.5 flex items-start gap-2.5"
                >
                  <AlertCircle size={17} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium text-left">{error}</p>
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="auth-label block">New Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError(null);
                    }}
                    placeholder="Enter your new password"
                    required
                    className="auth-input-field w-full h-12 pl-11 pr-12 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <PasswordStrengthMeter password={password} />
              </div>

              <button
                type="submit"
                disabled={isLoading || (!!error && error.includes('expired'))}
                className="auth-btn-primary w-full h-12 text-[14px] mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  'Reset Password'
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

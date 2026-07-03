import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // UNCHANGED LOGIC
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) throw resetError;

      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
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
          <Mail size={28} className="text-yellow-400" />
        </motion.div>
        <h1 className="text-[28px] font-bold tracking-tight text-white mb-1.5">
          Reset password
        </h1>
        <p className="text-[14px] auth-text-secondary">
          We'll send you instructions to reset your password.
        </p>
      </div>

      <div className="auth-glass-card p-8">
        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
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
                  <p className="text-sm font-medium">{error}</p>
                </motion.div>
              )}

              <div className="space-y-2">
                <label className="auth-label block">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    placeholder="name@university.edu"
                    required
                    className="auth-input-field w-full h-12 pl-11 pr-4 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="auth-btn-primary w-full h-12 text-[14px] mt-2 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <>
                    <Send size={16} />
                    Send Reset Link
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 220 }}
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(34,197,94,0.15)', border: '1.5px solid rgba(34,197,94,0.35)' }}
              >
                <Mail size={30} className="text-green-400" />
              </motion.div>
              <h3 className="text-[18px] font-bold text-white mb-2">Check your email</h3>
              <p className="auth-text-secondary text-[13px] mb-6 leading-relaxed">
                We sent a password reset link to{' '}
                <strong className="text-white/80">{email}</strong>.
              </p>
              <button
                type="button"
                className="auth-btn-outline w-full h-11 text-[13px] flex items-center justify-center"
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
              >
                Try another email
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium auth-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            Back to login
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

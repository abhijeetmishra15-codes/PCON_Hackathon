import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;

      // Navigate back to where they were trying to go, or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Logo + Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_4px_16px_rgba(245,158,11,0.35)] mb-5">
          <GraduationCap size={28} className="text-white" />
        </div>
        <h1 className="text-[28px] font-bold tracking-tight text-text-main mb-1.5">
          Welcome back
        </h1>
        <p className="text-[14px] text-text-secondary">
          Sign in to your AlumniConnect account
        </p>
      </div>

      <Card className="p-7 shadow-floating border border-[rgba(0,0,0,0.07)]">
        <form onSubmit={handleLogin} className="space-y-4">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 mb-4">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-text-main">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@university.edu"
              leftIcon={<Mail size={16} className="text-text-secondary/70" />}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-text-main">Password</label>
              <Link
                to="/forgot-password"
                className="text-[12px] font-semibold text-primary hover:text-primary-hover transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              leftIcon={<Lock size={16} className="text-text-secondary/70" />}
              required
            />
          </div>

          <div className="pt-1">
            <Button
              type="submit"
              className="w-full h-11 text-[14px]"
              isLoading={isLoading}
              rightIcon={<ArrowRight size={16} />}
            >
              Sign in to AlumniConnect
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-border text-center">
          <p className="text-[13px] text-text-secondary">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-primary hover:text-primary-hover transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

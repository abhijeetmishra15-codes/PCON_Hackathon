import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
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
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-text-main">Email</label>
            <Input
              type="email"
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

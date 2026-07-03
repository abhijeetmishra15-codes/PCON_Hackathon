import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { cn } from '../../utils/cn';

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState('student'); // 'student' | 'alumni'

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-2">Create an account</h1>
        <p className="text-text-secondary">Join your university's exclusive network</p>
      </div>

      <Card variant="glass" className="p-8 shadow-floating">
        <form onSubmit={handleSignup} className="space-y-5">
          
          <div className="flex p-1 bg-secondary rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                role === 'student' ? "bg-white shadow-soft text-text-main" : "text-text-secondary hover:text-text-main"
              )}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('alumni')}
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                role === 'alumni' ? "bg-white shadow-soft text-text-main" : "text-text-secondary hover:text-text-main"
              )}
            >
              Alumni
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-text-main ml-1">Full Name</label>
            <Input 
              type="text" 
              placeholder="John Doe" 
              leftIcon={<User size={18} />}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-text-main ml-1">University Email</label>
            <Input 
              type="email" 
              placeholder="name@university.edu" 
              leftIcon={<Mail size={18} />}
              required
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-text-main ml-1">Password</label>
            <Input 
              type="password" 
              placeholder="Create a strong password" 
              leftIcon={<Lock size={18} />}
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base mt-4"
            isLoading={isLoading}
          >
            Create {role === 'alumni' ? 'Alumni' : 'Student'} Account
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-text-secondary">
          By signing up, you agree to our{' '}
          <a href="#" className="text-primary hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-text-secondary">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-primary-hover">
              Log in
            </Link>
          </p>
        </div>
      </Card>
    </motion.div>
  );
}

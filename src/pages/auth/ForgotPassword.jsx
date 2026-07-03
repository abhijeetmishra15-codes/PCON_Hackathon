import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { supabase } from '../../lib/supabase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-2">Reset password</h1>
        <p className="text-text-secondary">We'll send you instructions to reset your password.</p>
      </div>

      <Card variant="glass" className="p-8 shadow-floating">
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 mb-4">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-main ml-1">Email</label>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="name@university.edu" 
                leftIcon={<Mail size={18} />}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base mt-2"
              isLoading={isLoading}
            >
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Check your email</h3>
            <p className="text-text-secondary text-sm mb-6">
              We sent a password reset link to <strong>{email}</strong>.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
            >
              Try another email
            </Button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-text-main transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to login
          </Link>
        </div>
      </Card>
    </motion.div>
  );
}

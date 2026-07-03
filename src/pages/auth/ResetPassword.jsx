import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { supabase } from '../../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if we actually have a session (the token from the URL should have established one)
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('No active session found. Your password reset link may have expired or is invalid.');
      }
    };
    checkSession();
  }, []);

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-2">Create new password</h1>
        <p className="text-text-secondary">Please enter your new password below.</p>
      </div>

      <Card variant="glass" className="p-8 shadow-floating">
        {success ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-text-main">Password Updated!</h3>
            <p className="text-text-secondary text-sm mb-6">
              Your password has been successfully reset. Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 mb-4">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-left">{error}</p>
              </div>
            )}
            
            <div className="space-y-1 text-left">
              <label className="text-sm font-medium text-text-main ml-1">New Password</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your new password" 
                leftIcon={<Lock size={18} />}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base mt-2"
              isLoading={isLoading}
              disabled={!!error && error.includes('expired')}
            >
              Reset Password
            </Button>
          </form>
        )}
      </Card>
    </motion.div>
  );
}

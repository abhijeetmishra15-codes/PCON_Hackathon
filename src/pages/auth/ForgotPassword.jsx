import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
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
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-main ml-1">Email</label>
              <Input 
                type="email" 
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
              We sent a password reset link to your email.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setIsSubmitted(false)}
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

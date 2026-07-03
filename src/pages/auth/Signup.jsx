import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, Calendar, BookOpen, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import { Button, Input, Card, Badge } from '../../components/ui';
import { cn } from '../../utils/cn';
import { supabase } from '../../lib/supabase';

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [accountCategory, setAccountCategory] = useState('university'); // 'university' or 'visitor'
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    department: '',
    graduationYear: new Date().getFullYear() + 1 // Default to next year (Student)
  });

  const [derivedRole, setDerivedRole] = useState('student');

  // Auto-calculate role based on graduation year if university member
  useEffect(() => {
    if (accountCategory === 'visitor') {
      setDerivedRole('visitor');
      return;
    }

    const currentYear = new Date().getFullYear();
    const gradYear = parseInt(formData.graduationYear, 10);
    
    if (!isNaN(gradYear)) {
      if (gradYear > currentYear) {
        setDerivedRole('student');
      } else {
        setDerivedRole('alumni');
      }
    }
  }, [formData.graduationYear, accountCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

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
      
      // If we got here, sign up was successful. 
      // Supabase may require email confirmation depending on project settings.
      if (data.session) {
        navigate('/dashboard');
      } else {
        // No session means they likely need to confirm their email
        setSuccess(true);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during sign up.');
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
        <h1 className="text-3xl font-bold text-text-main mb-2">Create an account</h1>
        <p className="text-text-secondary">Join your university's exclusive network</p>
      </div>

      <Card variant="glass" className="p-8 shadow-floating">
        
        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-text-main">Verify your email</h3>
            <p className="text-text-secondary text-sm mb-6">
              We've sent a verification link to <strong>{formData.email}</strong>. Please check your inbox and click the link to activate your account.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full">
                Return to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600 mb-4">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="flex p-1 bg-secondary rounded-xl mb-4">
              <button
                type="button"
                onClick={() => setAccountCategory('university')}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                  accountCategory === 'university' ? "bg-white shadow-soft text-text-main" : "text-text-secondary hover:text-text-main"
                )}
              >
                University Member
              </button>
              <button
                type="button"
                onClick={() => setAccountCategory('visitor')}
                className={cn(
                  "flex-1 py-2 text-sm font-medium rounded-lg transition-all",
                  accountCategory === 'visitor' ? "bg-white shadow-soft text-text-main" : "text-text-secondary hover:text-text-main"
                )}
              >
                Visitor
              </button>
            </div>

            {/* Dynamic Role Indicator */}
            <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border mb-4">
              <div>
                <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">Account Type</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-text-main capitalize">
                    {derivedRole} Account
                  </span>
                  <Badge variant={derivedRole === 'visitor' ? 'secondary' : derivedRole === 'student' ? 'primary' : 'success'}>
                    {accountCategory === 'university' ? 'Auto-assigned' : 'Selected'}
                  </Badge>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${derivedRole === 'visitor' ? 'bg-secondary/20 text-text-secondary' : derivedRole === 'student' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>
                {derivedRole === 'visitor' ? <Eye size={20} /> : <GraduationCap size={20} />}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-main ml-1">Full Name</label>
                <Input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe" 
                  leftIcon={<User size={18} />}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-text-main ml-1">Email Address</label>
                <Input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={accountCategory === 'university' ? "name@university.edu" : "name@example.com"} 
                  leftIcon={<Mail size={18} />}
                  required
                />
              </div>

              {accountCategory === 'university' && (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-main ml-1">Department</label>
                    <Input 
                      type="text" 
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="e.g. Computer Science" 
                      leftIcon={<BookOpen size={18} />}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-text-main ml-1">Graduation Year</label>
                    <Input 
                      type="number" 
                      name="graduationYear"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      placeholder="YYYY" 
                      min="1950"
                      max="2030"
                      leftIcon={<Calendar size={18} />}
                      required
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="space-y-1 pt-1">
              <label className="text-sm font-medium text-text-main ml-1">Password</label>
              <Input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password" 
                leftIcon={<Lock size={18} />}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base mt-6 capitalize"
              isLoading={isLoading}
            >
              Create {derivedRole} Account
            </Button>
          </form>
        )}

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

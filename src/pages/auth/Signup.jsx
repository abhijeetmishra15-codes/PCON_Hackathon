import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Lock, User, Calendar, BookOpen } from 'lucide-react';
import { Button, Input, Card, Badge } from '../../components/ui';
import { cn } from '../../utils/cn';

export default function Signup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    department: '',
    graduationYear: new Date().getFullYear() + 1 // Default to next year (Student)
  });

  const [derivedRole, setDerivedRole] = useState('student');

  // Auto-calculate role based on graduation year
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const gradYear = parseInt(formData.graduationYear, 10);
    
    if (!isNaN(gradYear)) {
      if (gradYear > currentYear) {
        setDerivedRole('student');
      } else {
        setDerivedRole('alumni');
      }
    }
  }, [formData.graduationYear]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call and save to local storage for other pages to use
    setTimeout(() => {
      localStorage.setItem('alumni_user_data', JSON.stringify({
        ...formData,
        role: derivedRole
      }));
      
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
        <form onSubmit={handleSignup} className="space-y-4">
          
          {/* Dynamic Role Indicator */}
          <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl border border-border mb-4">
            <div>
              <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">Account Type</p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-text-main">
                  {derivedRole === 'student' ? 'Student Account' : 'Alumni Account'}
                </span>
                <Badge variant={derivedRole === 'student' ? 'primary' : 'success'}>
                  Auto-assigned
                </Badge>
              </div>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${derivedRole === 'student' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>
              <GraduationCap size={20} />
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
              <label className="text-sm font-medium text-text-main ml-1">University Email</label>
              <Input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@university.edu" 
                leftIcon={<Mail size={18} />}
                required
              />
            </div>

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
            className="w-full h-12 text-base mt-6"
            isLoading={isLoading}
          >
            Create {derivedRole === 'alumni' ? 'Alumni' : 'Student'} Account
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

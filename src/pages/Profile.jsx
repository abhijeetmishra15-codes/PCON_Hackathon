import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Building2, Briefcase, GraduationCap, 
  MapPin, Link as LinkIcon, Camera, Plus, FileText 
} from 'lucide-react';
import { Card, Button, Input, Badge, Avatar } from '../components/ui';

export default function Profile() {
  const [role, setRole] = useState('student'); // 'student' or 'alumni'

  return (
    <div className="pb-14 max-w-4xl mx-auto">
      {/* Header & Role Toggle (Demo only) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-7 gap-4">
        <div>
          <h1 className="text-[30px] font-extrabold tracking-tight text-text-main mb-1">
            My Profile
          </h1>
          <p className="text-[14px] text-text-secondary">
            Manage your personal information and resume.
          </p>
        </div>
        
        {/* Demo Toggle */}
        <div className="flex bg-secondary p-1 rounded-xl">
          <button
            onClick={() => setRole('student')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              role === 'student' ? 'bg-white shadow-soft text-text-main' : 'text-text-secondary hover:text-text-main'
            }`}
          >
            Student View
          </button>
          <button
            onClick={() => setRole('alumni')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              role === 'alumni' ? 'bg-white shadow-soft text-text-main' : 'text-text-secondary hover:text-text-main'
            }`}
          >
            Alumni View
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic Info Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="p-6 bg-white overflow-hidden relative">
            <div className="h-32 bg-primary/10 absolute top-0 left-0 right-0" />
            <div className="relative mt-12 flex flex-col sm:flex-row gap-6 items-start sm:items-end">
              <div className="relative">
                <Avatar 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=128&h=128" 
                  size="xl" 
                  className="w-28 h-28 border-4 border-white shadow-soft"
                />
                <button className="absolute bottom-1 right-1 p-1.5 bg-white rounded-full shadow-sm border border-border text-text-secondary hover:text-primary transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <div className="flex-1 pb-2">
                <h2 className="text-2xl font-bold text-text-main">Alex Johnson</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <Mail size={15} /> alex.j@university.edu
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={15} /> San Francisco, CA
                  </div>
                </div>
              </div>
              <Button className="shrink-0 mb-2">Save Changes</Button>
            </div>
          </Card>
        </motion.div>

        {/* Detailed Info Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-bold text-text-main mb-5">
              {role === 'student' ? 'Academic & Resume Details' : 'Professional Details'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {role === 'student' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Department</label>
                    <Input leftIcon={<GraduationCap size={16} />} defaultValue="Computer Science" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Expected Graduation Year</label>
                    <Input leftIcon={<User size={16} />} defaultValue="2027" type="number" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Github / Portfolio</label>
                    <Input leftIcon={<LinkIcon size={16} />} placeholder="https://github.com/alexj" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Current Company</label>
                    <Input leftIcon={<Building2 size={16} />} defaultValue="Google" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Job Role</label>
                    <Input leftIcon={<Briefcase size={16} />} defaultValue="Software Engineer" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Industry</label>
                    <Input leftIcon={<Building2 size={16} />} defaultValue="Technology" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-text-secondary ml-1">Years of Experience</label>
                    <Input leftIcon={<User size={16} />} defaultValue="3" type="number" />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-[15px] font-bold text-text-main">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {['React', 'Node.js', 'Python', 'AWS', 'System Design'].map((skill) => (
                  <Badge key={skill} variant="primary" className="px-3 py-1 text-sm bg-primary/10 text-primary border border-primary/20">
                    {skill}
                  </Badge>
                ))}
                <button className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium text-text-secondary border border-dashed border-border hover:border-primary hover:text-primary transition-colors">
                  <Plus size={14} /> Add Skill
                </button>
              </div>
            </div>

            {role === 'student' && (
              <div className="mt-8 pt-6 border-t border-border">
                <h4 className="text-[15px] font-bold text-text-main mb-4">Resume</h4>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-text-main">Alex_Johnson_Resume.pdf</p>
                      <p className="text-[12px] text-text-secondary">Updated 2 days ago • 2.4 MB</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="h-8 px-3 text-xs">Update</Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

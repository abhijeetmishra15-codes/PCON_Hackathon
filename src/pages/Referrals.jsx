import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  ChevronRight,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import { Card, Button, Badge, Avatar } from '../components/ui';
import { cn } from '../utils/cn';

export default function Referrals() {
  const [activeTab, setActiveTab] = useState('opportunities');

  const opportunities = [
    {
      id: 1,
      role: 'Frontend Engineer Intern',
      company: 'Linear',
      location: 'San Francisco, CA',
      type: 'Internship',
      salary: '$8k – $10k / mo',
      posted: '2d ago',
      match: '95%',
      alumniCount: 4,
      logo: 'https://logo.clearbit.com/linear.app',
    },
    {
      id: 2,
      role: 'Product Designer',
      company: 'Stripe',
      location: 'Remote',
      type: 'Full-time',
      salary: '$130k – $180k',
      posted: '5d ago',
      match: '88%',
      alumniCount: 12,
      logo: 'https://logo.clearbit.com/stripe.com',
    },
  ];

  const applications = [
    {
      id: 1,
      role: 'Software Engineer New Grad',
      company: 'Apple',
      status: 'Interview Scheduled',
      date: 'Oct 26, 2026',
      referrer: 'Michael Chen',
      logo: 'https://logo.clearbit.com/apple.com',
    },
  ];

  const timelineSteps = ['Requested', 'Referred', 'Applied', 'Interview', 'Offer'];

  return (
    <div className="pb-14">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[30px] font-extrabold tracking-tight text-text-main mb-1">
          Referral Portal
        </h1>
        <p className="text-[14px] text-text-secondary">
          Get referred by alumni to top companies.
        </p>
      </div>

      {/* Segmented tabs */}
      <div className="flex p-1 bg-secondary rounded-xl mb-7 w-max border border-border/60">
        {[
          { key: 'opportunities', label: 'Opportunities' },
          { key: 'tracking', label: 'My Applications' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-5 py-2 text-[13px] font-semibold rounded-lg transition-all duration-150',
              activeTab === tab.key
                ? 'bg-white shadow-soft text-text-main'
                : 'text-text-secondary hover:text-text-main'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'opportunities' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {opportunities.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card hover className="p-5">
                  <div className="flex gap-4">
                    {/* Logo */}
                    <div className="w-14 h-14 rounded-2xl border border-border shadow-soft flex items-center justify-center bg-white shrink-0 p-3">
                      <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div>
                          <h3 className="text-[15px] font-bold text-text-main leading-tight">{job.role}</h3>
                          <p className="text-[13px] font-semibold text-text-secondary mt-0.5">{job.company}</p>
                        </div>
                        <Badge variant="success" className="shrink-0 bg-success/10 text-success border border-success/20">
                          {job.match} Match
                        </Badge>
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-text-secondary mt-3 mb-4">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-primary/60" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Briefcase size={13} className="text-primary/60" /> {job.type}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign size={13} className="text-primary/60" /> {job.salary}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-primary/60" /> {job.posted}
                        </span>
                      </div>

                      {/* Footer */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3.5 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1.5">
                            <Avatar size="sm" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=32&h=32" className="border-2 border-white" />
                            <Avatar size="sm" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=32&h=32" className="border-2 border-white" />
                          </div>
                          <span className="text-[12px] text-text-secondary">
                            <span className="font-semibold text-text-main">{job.alumniCount} alumni</span> work here
                          </span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button className="p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/8 transition-colors border border-border">
                            <Bookmark size={16} />
                          </button>
                          <Button
                            className="flex-1 sm:flex-none h-9 text-[13px] bg-accent hover:bg-accent-hover focus:ring-accent shadow-[0_2px_8px_rgba(251,146,60,0.30)]"
                            rightIcon={<ChevronRight size={15} />}
                          >
                            Request Referral
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Right sidebar */}
          <div>
            <Card
              className="p-6 border-none text-white"
              style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FB923C 100%)' }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <Briefcase size={20} className="text-white" />
              </div>
              <h3 className="text-[17px] font-bold mb-2 leading-tight">Want to stand out?</h3>
              <p className="text-[13px] text-white/85 mb-5 leading-relaxed">
                Use our AI Assistant to tailor your resume and craft a personalized referral message.
              </p>
              <Button variant="secondary" className="w-full text-primary bg-white hover:bg-white/90 font-semibold">
                Open AI Assistant
              </Button>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {applications.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <Card className="p-6">
                {/* App header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl border border-border shadow-soft flex items-center justify-center p-2 bg-white">
                      <img src={app.logo} alt={app.company} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-text-main">{app.role}</h3>
                      <p className="text-[13px] font-medium text-text-secondary">{app.company}</p>
                    </div>
                  </div>
                  <Badge variant="primary" className="bg-primary/10 text-primary border border-primary/20">
                    {app.status}
                  </Badge>
                </div>

                {/* Timeline */}
                <div className="relative px-2 pt-6">
                  {/* Track line */}
                  <div className="absolute top-[38px] left-[32px] right-[32px] h-0.5 bg-secondary" />
                  <div
                    className="absolute top-[38px] left-[32px] h-0.5 bg-gradient-to-r from-primary to-accent transition-all"
                    style={{ width: `${(3 / (timelineSteps.length - 1)) * 100}%` }}
                  />

                  <div className="relative flex justify-between z-10">
                    {timelineSteps.map((step, idx) => {
                      const done = idx <= 3;
                      return (
                        <div key={idx} className="flex flex-col items-center gap-2">
                          <div className={cn(
                            'w-9 h-9 rounded-full flex items-center justify-center shadow-sm border-2 transition-colors',
                            done
                              ? 'bg-primary border-primary text-white'
                              : 'bg-white border-border text-text-secondary/40'
                          )}>
                            {done
                              ? <CheckCircle2 size={16} />
                              : <div className="w-2 h-2 rounded-full bg-border" />
                            }
                          </div>
                          <span className={cn(
                            'text-[11px] font-semibold whitespace-nowrap',
                            done ? 'text-text-main' : 'text-text-secondary/50'
                          )}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Referrer info */}
                <div className="mt-7 p-4 bg-secondary/50 rounded-xl flex items-center justify-between border border-border/60">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size="sm"
                      fallback={app.referrer.charAt(0)}
                      className="bg-primary/10 text-primary font-bold"
                    />
                    <div>
                      <div className="text-[13px] font-semibold text-text-main">Referred by {app.referrer}</div>
                      <div className="text-[11px] text-text-secondary">Next: Interview on {app.date}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="bg-white">View Details</Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

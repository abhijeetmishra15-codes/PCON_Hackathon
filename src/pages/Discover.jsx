import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Card, Button, Avatar, Badge, Input } from '../components/ui';

export default function Discover() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'FAANG', 'Startups', 'Finance', 'Healthcare', 'Design'];

  const alumni = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Senior Product Manager',
      company: 'Stripe',
      location: 'San Francisco, CA',
      match: '98%',
      skills: ['Product Strategy', 'Fintech', 'Agile'],
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&h=128',
      available: true,
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Software Engineer II',
      company: 'Apple',
      location: 'Cupertino, CA',
      match: '94%',
      skills: ['Swift', 'System Design', 'iOS'],
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128',
      available: true,
    },
    {
      id: 3,
      name: 'Emily Davis',
      role: 'UX Designer',
      company: 'Linear',
      location: 'Remote',
      match: '89%',
      skills: ['Figma', 'Prototyping', 'User Research'],
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128',
      available: false,
    },
    {
      id: 4,
      name: 'James Wilson',
      role: 'Data Scientist',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      match: '85%',
      skills: ['Python', 'Machine Learning', 'A/B Testing'],
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&h=128',
      available: true,
    },
  ];

  return (
    <div className="pb-14">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[30px] font-extrabold tracking-tight text-text-main mb-1">
          Discover Alumni
        </h1>
        <p className="text-[14px] text-text-secondary">
          Find and connect with alumni in your desired industry.
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <Input
            placeholder="Search by name, company, or role..."
            leftIcon={<Search size={16} />}
            className="bg-white"
          />
        </div>
        <Button variant="outline" leftIcon={<SlidersHorizontal size={16} />} className="bg-white shrink-0">
          Filters
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={[
              'px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 whitespace-nowrap border shrink-0',
              activeFilter === filter
                ? 'bg-primary text-white border-primary shadow-btn-primary'
                : 'bg-white text-text-secondary border-[rgba(0,0,0,0.10)] hover:border-primary/30 hover:text-primary hover:bg-primary/5',
            ].join(' ')}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Alumni grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {alumni.map((person, idx) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07, type: 'spring', stiffness: 100 }}
          >
            <Card hover className="p-5 flex flex-col h-full bg-white group">
              {/* Header */}
              <div className="flex items-start gap-3.5 mb-4">
                <div className="relative shrink-0">
                  <Avatar
                    src={person.avatar}
                    size="lg"
                    className="border-2 border-white ring-2 ring-border/60 group-hover:ring-primary/30 transition-all duration-300"
                  />
                  {person.available && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-[15px] font-bold text-text-main group-hover:text-primary transition-colors leading-tight truncate">
                    {person.name}
                  </h3>
                  <p className="text-[12.5px] text-text-secondary mt-0.5 truncate">{person.role}</p>
                  <Badge
                    variant="success"
                    className="mt-2 bg-success/10 text-success border border-success/20"
                  >
                    {person.match} Match
                  </Badge>
                </div>
              </div>

              {/* Meta */}
              <div className="space-y-1.5 mb-5">
                <div className="flex items-center gap-2 text-[12.5px] text-text-secondary">
                  <Building2 size={13} className="text-primary/60 shrink-0" />
                  <span className="font-medium text-text-main">{person.company}</span>
                </div>
                <div className="flex items-center gap-2 text-[12.5px] text-text-secondary">
                  <MapPin size={13} className="text-primary/60 shrink-0" />
                  {person.location}
                </div>
              </div>

              {/* Skills */}
              <div className="mt-auto pt-4 border-t border-border">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {person.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-[3px] rounded-full text-[11px] font-semibold bg-primary/8 text-primary border border-primary/15"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1 h-9 text-[13px]">Connect</Button>
                  <Button variant="ghost" className="flex-1 h-9 text-[13px] hover:bg-secondary">
                    View Profile
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Load more */}
      <div className="mt-10 text-center">
        <Button variant="outline" rightIcon={<ArrowRight size={16} />} className="bg-white">
          Load More Alumni
        </Button>
      </div>
    </div>
  );
}

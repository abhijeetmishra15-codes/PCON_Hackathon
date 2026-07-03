import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Building2,
  ArrowRight,
  SlidersHorizontal,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { Card, Button, Avatar, Badge, Input } from '../components/ui';
import { useAlumni } from '../hooks/useAlumni';
import AlumniProfileModal from '../components/AlumniProfileModal';

export default function Discover() {
  const { 
    alumni, 
    isLoading, 
    error, 
    searchQuery, 
    setSearchQuery,
    activeIndustryFilter,
    setActiveIndustryFilter,
    availableIndustries
  } = useAlumni();

  const [selectedAlumni, setSelectedAlumni] = useState(null);

  return (
    <div className="pb-14">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[30px] font-extrabold tracking-tight text-text-main mb-1">
          Discover Alumni
        </h1>
        <p className="text-[14px] text-text-secondary">
          Find and connect with verified alumni in your desired industry.
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1">
          <Input
            placeholder="Search by name, company, or role..."
            leftIcon={<Search size={16} />}
            className="bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" leftIcon={<SlidersHorizontal size={16} />} className="bg-white shrink-0">
          Filters
        </Button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {availableIndustries.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveIndustryFilter(filter)}
            className={[
              'px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 whitespace-nowrap border shrink-0',
              activeIndustryFilter === filter
                ? 'bg-primary text-white border-primary shadow-btn-primary'
                : 'bg-white text-text-secondary border-[rgba(0,0,0,0.10)] hover:border-primary/30 hover:text-primary hover:bg-primary/5',
            ].join(' ')}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="p-5 h-[280px] bg-white animate-pulse">
              <div className="flex gap-3.5 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary shrink-0" />
                <div className="flex-1 space-y-2 py-2">
                  <div className="h-4 bg-secondary rounded w-3/4" />
                  <div className="h-3 bg-secondary rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2 mt-8">
                <div className="h-3 bg-secondary rounded w-full" />
                <div className="h-3 bg-secondary rounded w-2/3" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="text-center py-12 bg-white rounded-2xl border border-red-100">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-text-main">Failed to load directory</h2>
          <p className="text-text-secondary mt-2">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && alumni.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-border">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-text-secondary w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-text-main mb-2">No alumni found</h2>
          <p className="text-text-secondary">Try adjusting your search or filters to find more people.</p>
          <Button variant="outline" className="mt-6" onClick={() => { setSearchQuery(''); setActiveIndustryFilter('All'); }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Alumni grid */}
      {!isLoading && !error && alumni.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {alumni.map((person, idx) => (
            <motion.div
              key={person.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.5), type: 'spring', stiffness: 100 }}
            >
              <Card hover className="p-5 flex flex-col h-full bg-white group">
                {/* Header */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="relative shrink-0">
                    <Avatar
                      src={person.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.full_name)}&background=random`}
                      size="lg"
                      className="border-2 border-white ring-2 ring-border/60 group-hover:ring-primary/30 transition-all duration-300"
                    />
                    {person.is_verified && (
                      <span className="absolute bottom-0 right-0 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <CheckCircle size={14} className="text-success fill-success/10" />
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="text-[15px] font-bold text-text-main group-hover:text-primary transition-colors leading-tight truncate">
                      {person.full_name}
                    </h3>
                    <p className="text-[12.5px] text-text-secondary mt-0.5 truncate">{person.job_role}</p>
                    <Badge
                      variant="primary"
                      className="mt-2 bg-primary/10 text-primary border border-primary/20"
                    >
                      Class of {person.graduation_year || 'N/A'}
                    </Badge>
                  </div>
                </div>

                {/* Meta */}
                <div className="space-y-1.5 mb-5">
                  <div className="flex items-center gap-2 text-[12.5px] text-text-secondary">
                    <Building2 size={13} className="text-primary/60 shrink-0" />
                    <span className="font-medium text-text-main truncate">{person.company || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[12.5px] text-text-secondary">
                    <MapPin size={13} className="text-primary/60 shrink-0" />
                    <span className="truncate">{person.industry || 'General'}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mt-auto pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-1.5 mb-4 max-h-14 overflow-hidden relative">
                    {person.skills.length > 0 ? person.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-[3px] rounded-full text-[11px] font-semibold bg-primary/8 text-primary border border-primary/15"
                      >
                        {skill}
                      </span>
                    )) : (
                      <span className="text-[11px] text-text-secondary italic">No skills listed</span>
                    )}
                    {person.skills.length > 4 && (
                      <span className="px-2.5 py-[3px] rounded-full text-[11px] font-semibold bg-secondary text-text-secondary border border-border">
                        +{person.skills.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 h-9 text-[13px]">Connect</Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedAlumni(person)}
                      className="flex-1 h-9 text-[13px] hover:bg-secondary"
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Alumni Details Modal */}
      <AlumniProfileModal 
        isOpen={!!selectedAlumni}
        onClose={() => setSelectedAlumni(null)}
        alumni={selectedAlumni}
      />
    </div>
  );
}

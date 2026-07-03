import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Briefcase, Building2, MapPin, Link as LinkIcon, 
  Calendar, DollarSign, Image as ImageIcon, Loader2, Plus
} from 'lucide-react';
import { Modal, Button, Input, Badge } from '../ui';
import { SkillsService } from '../../lib/services/skills.service';

const JOB_TYPES = [
  { value: 'internship', label: 'Internship' },
  { value: 'part_time', label: 'Part Time' },
  { value: 'full_time', label: 'Full Time' },
  { value: 'referral_only', label: 'Referral Only' }
];

const WORK_MODES = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'Onsite' }
];

export default function OpportunityForm({ 
  isOpen, 
  onClose, 
  opportunity = null, 
  onSubmit 
}) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full_time',
    work_mode: 'remote',
    description: '',
    application_url: '',
    experience_level: '',
    salary_range: '',
    application_deadline: '',
    company_logo_url: ''
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSkillDropdown, setShowSkillDropdown] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (opportunity) {
      setFormData({
        title: opportunity.title || '',
        company: opportunity.company || '',
        location: opportunity.location || '',
        type: opportunity.type || 'full_time',
        work_mode: opportunity.work_mode || 'remote',
        description: opportunity.description || '',
        application_url: opportunity.application_url || '',
        experience_level: opportunity.experience_level || '',
        salary_range: opportunity.salary_range || '',
        application_deadline: opportunity.application_deadline ? new Date(opportunity.application_deadline).toISOString().split('T')[0] : '',
        company_logo_url: opportunity.company_logo_url || ''
      });
      setSkills(opportunity.skills || []);
    } else {
      setFormData({
        title: '',
        company: '',
        location: '',
        type: 'full_time',
        work_mode: 'remote',
        description: '',
        application_url: '',
        experience_level: '',
        salary_range: '',
        application_deadline: '',
        company_logo_url: ''
      });
      setSkills([]);
    }
  }, [opportunity, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Skill Handling
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (skillInput.trim()) {
        setIsSearching(true);
        try {
          const results = await SkillsService.searchSkills(skillInput);
          setSearchResults(results);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(searchTimer);
  }, [skillInput]);

  const handleAddSkill = async (skillName) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    
    if (skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkillInput('');
      setShowSkillDropdown(false);
      return;
    }

    try {
      const newSkill = await SkillsService.getOrCreateSkill(trimmed);
      setSkills(prev => [...prev, newSkill]);
      setSkillInput('');
      setShowSkillDropdown(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const removeSkill = (skillId) => {
    setSkills(prev => prev.filter(s => s.id !== skillId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate
      if (!formData.title || !formData.company || !formData.location || !formData.description) {
        throw new Error('Please fill in all required fields.');
      }
      
      const skillIds = skills.map(s => s.id);
      
      const submissionData = { ...formData };
      if (!submissionData.application_deadline) {
        submissionData.application_deadline = null;
      } else {
        submissionData.application_deadline = new Date(submissionData.application_deadline).toISOString();
      }

      await onSubmit(submissionData, skillIds);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={opportunity ? 'Edit Opportunity' : 'Post New Opportunity'}
      size="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Job Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Software Engineer"
            icon={<Briefcase size={18} />}
            required
          />
          <Input
            label="Company Name *"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. Google"
            icon={<Building2 size={18} />}
            required
          />
          <Input
            label="Location *"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. New York, NY or Remote"
            icon={<MapPin size={18} />}
            required
          />
          
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-text-secondary pl-1">
              Job Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-white border border-border rounded-xl text-[14px] text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            >
              {JOB_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-text-secondary pl-1">
              Work Mode *
            </label>
            <select
              name="work_mode"
              value={formData.work_mode}
              onChange={handleChange}
              className="w-full h-11 px-4 bg-white border border-border rounded-xl text-[14px] text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            >
              {WORK_MODES.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>

          <Input
            label="Experience Level"
            name="experience_level"
            value={formData.experience_level}
            onChange={handleChange}
            placeholder="e.g. 3-5 years, Mid-Level"
          />

          <Input
            label="Salary Range"
            name="salary_range"
            value={formData.salary_range}
            onChange={handleChange}
            placeholder="e.g. $100k - $120k"
            icon={<DollarSign size={18} />}
          />

          <Input
            label="Application Deadline"
            name="application_deadline"
            type="date"
            value={formData.application_deadline}
            onChange={handleChange}
            icon={<Calendar size={18} />}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <Input
          label="Application URL"
          name="application_url"
          value={formData.application_url}
          onChange={handleChange}
          placeholder="https://..."
          icon={<LinkIcon size={18} />}
        />

        <Input
          label="Company Logo URL (Optional)"
          name="company_logo_url"
          value={formData.company_logo_url}
          onChange={handleChange}
          placeholder="https://..."
          icon={<ImageIcon size={18} />}
        />

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-text-secondary pl-1">
            Required Skills
          </label>
          <div className="p-4 bg-secondary/30 rounded-xl border border-border">
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map(skill => (
                <Badge key={skill.id} variant="secondary" className="flex items-center gap-1.5 px-3 py-1.5">
                  {skill.name}
                  <button 
                    type="button"
                    onClick={() => removeSkill(skill.id)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors text-primary/70 hover:text-primary"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
              
              <div className="relative">
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium text-text-secondary border border-dashed border-border hover:border-primary focus-within:border-primary focus-within:text-primary transition-colors bg-white relative z-20">
                  <Plus size={14} /> 
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    onFocus={() => { if(skillInput.trim()) setShowSkillDropdown(true) }}
                    onBlur={() => setTimeout(() => setShowSkillDropdown(false), 200)}
                    placeholder="Add Skill..."
                    className="bg-transparent border-none outline-none w-24 focus:w-32 transition-all placeholder:text-text-secondary/70 text-text-main"
                  />
                </div>

                <AnimatePresence>
                  {showSkillDropdown && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 mt-1 w-48 bg-white border border-border rounded-xl shadow-lg z-30 overflow-hidden"
                    >
                      {isSearching ? (
                        <div className="p-3 text-xs text-text-secondary flex items-center gap-2">
                          <Loader2 size={12} className="animate-spin" /> Searching...
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="max-h-48 overflow-y-auto">
                          {searchResults.map(s => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleAddSkill(s.name)}
                              className="w-full text-left px-4 py-2 text-sm text-text-main hover:bg-secondary transition-colors"
                            >
                              {s.name}
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => handleAddSkill(skillInput)}
                            className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary/5 transition-colors border-t border-border font-medium"
                          >
                            Add "{skillInput}"
                          </button>
                        </div>
                      ) : skillInput.trim() ? (
                        <button
                          type="button"
                          onClick={() => handleAddSkill(skillInput)}
                          className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-primary/5 transition-colors font-medium"
                        >
                          Add "{skillInput}"
                        </button>
                      ) : null}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-text-secondary pl-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            className="w-full p-4 bg-white border border-border rounded-xl text-[14px] text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y"
            placeholder="Describe the opportunity, responsibilities, requirements, etc."
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} leftIcon={isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}>
            {isSubmitting ? 'Saving...' : (opportunity ? 'Save Changes' : 'Post Opportunity')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

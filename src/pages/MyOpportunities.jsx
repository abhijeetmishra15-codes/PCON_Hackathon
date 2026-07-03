import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Briefcase, MapPin, Building2, Calendar, MoreVertical, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { Card, Button, Badge, LoadingSkeleton, EmptyState } from '../components/ui';
import { useOpportunities } from '../hooks/useOpportunities';
import OpportunityForm from '../components/opportunities/OpportunityForm';

export default function MyOpportunities() {
  const { 
    myOpportunities, 
    loading, 
    error,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity
  } = useOpportunities();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  const handleOpenCreate = () => {
    setEditingOpportunity(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (opp) => {
    setEditingOpportunity(opp);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      await deleteOpportunity(id);
    }
  };

  const handleFormSubmit = async (data, skillIds) => {
    if (editingOpportunity) {
      await updateOpportunity(editingOpportunity.id, data, skillIds);
    } else {
      await createOpportunity(data, skillIds);
    }
  };

  const formatType = (type) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="pb-14">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main mb-1">My Opportunities</h1>
          <p className="text-[14px] text-text-secondary">
            Manage the job and internship opportunities you've posted for students.
          </p>
        </div>
        
        <Button onClick={handleOpenCreate} leftIcon={<Plus size={18} />}>
          Post Opportunity
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-[14px]">
          {error}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-5">
              <LoadingSkeleton className="h-6 w-3/4 mb-3" />
              <LoadingSkeleton className="h-4 w-1/2 mb-4" />
              <div className="flex gap-2">
                <LoadingSkeleton className="h-6 w-20 rounded-full" />
                <LoadingSkeleton className="h-6 w-20 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : myOpportunities.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No opportunities posted yet"
          description="Share job openings or internships at your company to help students in their career journey."
          action={
            <Button onClick={handleOpenCreate}>
              Post Your First Opportunity
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {myOpportunities.map((opp, index) => (
            <motion.div
              key={opp.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-5 flex flex-col h-full hover:border-primary/30 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-[17px] font-semibold text-text-main group-hover:text-primary transition-colors line-clamp-1">
                      {opp.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[14px] text-text-secondary mt-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Building2 size={15} />
                        {opp.company}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={15} />
                        {opp.location}
                      </span>
                    </div>
                  </div>
                  
                  {/* Actions Dropdown / Icons */}
                  <div className="flex items-center gap-1">
                    {opp.application_url && (
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 rounded-full text-text-secondary hover:text-primary"
                        onClick={() => window.open(opp.application_url, '_blank')}
                        title="View Application"
                      >
                        <ExternalLink size={16} />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      className="h-8 w-8 p-0 rounded-full text-text-secondary hover:text-primary"
                      onClick={() => handleOpenEdit(opp)}
                      title="Edit Opportunity"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="h-8 w-8 p-0 rounded-full text-text-secondary hover:text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(opp.id)}
                      title="Delete Opportunity"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="primary" className="text-xs">
                    {formatType(opp.type)}
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {opp.work_mode}
                  </Badge>
                  {opp.salary_range && (
                    <Badge variant="outline" className="text-xs">
                      {opp.salary_range}
                    </Badge>
                  )}
                </div>

                {opp.skills && opp.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[12px] font-medium text-text-secondary mb-1.5">Skills Required</p>
                    <div className="flex flex-wrap gap-1.5">
                      {opp.skills.map(skill => (
                        <span key={skill.id} className="text-[11px] font-medium px-2 py-0.5 bg-secondary text-text-main rounded-md border border-border/50">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-[12px] text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    Posted {new Date(opp.created_at).toLocaleDateString()}
                  </span>
                  <span className={`px-2 py-1 rounded-md font-medium ${opp.status === 'open' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {opp.status.toUpperCase()}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <OpportunityForm 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        opportunity={editingOpportunity}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

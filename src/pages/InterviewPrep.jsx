import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Target, Briefcase, Zap, CheckCircle, AlertCircle, Play, Sparkles, MessageSquare, Award } from 'lucide-react';
import { Button, Input, Toast } from '../components/ui';
import { useProfile } from '../hooks/useProfile';
import { useSkills } from '../hooks/useSkills';
import { useResume } from '../hooks/useResume';
import { supabase } from '../lib/supabase';

export default function InterviewPrep() {
  const { profile } = useProfile();
  const { skills } = useSkills();
  const { resume, isLoading: isResumeLoading } = useResume();
  
  const [formData, setFormData] = useState({
    targetRole: '',
    experienceLevel: 'Fresher'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  const [answer, setAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateQuestions = async (e) => {
    e.preventDefault();
    if (!formData.targetRole.trim()) {
      setToast({ type: 'error', message: 'Target Role is required' });
      return;
    }
    if (!resume) {
      setToast({ type: 'error', message: 'Please upload a resume in your profile first.' });
      return;
    }
    if (!profile) {
      setToast({ type: 'error', message: 'Incomplete profile. Please complete your profile first.' });
      return;
    }

    setIsGenerating(true);
    setQuestions([]);
    setSelectedQuestion(null);
    setAnswer('');
    setEvaluation(null);
    setToast(null);

    try {
      const interviewData = {
        targetRole: formData.targetRole,
        experienceLevel: formData.experienceLevel,
        department: profile.department,
        skills: skills.map(s => s.name).join(', ')
      };

      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { 
          action: 'generate_interview_questions',
          resumeId: resume.id,
          fileUrl: resume.file_url,
          interviewData
        }
      });

      if (error) throw new Error(error.message || 'Failed to generate questions');
      if (data.error) throw new Error(data.error);

      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        throw new Error('No questions returned');
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Generation failed. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!selectedQuestion) {
      setToast({ type: 'error', message: 'Please select a question to answer.' });
      return;
    }
    if (!answer.trim()) {
      setToast({ type: 'error', message: 'Please provide an answer.' });
      return;
    }

    setIsEvaluating(true);
    setEvaluation(null);
    setToast(null);

    try {
      const interviewData = {
        targetRole: formData.targetRole,
        experienceLevel: formData.experienceLevel,
        question: selectedQuestion,
        answer: answer.trim()
      };

      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { 
          action: 'evaluate_interview_answer',
          interviewData
        }
      });

      if (error) throw new Error(error.message || 'Failed to evaluate answer');
      if (data.error) throw new Error(data.error);

      setEvaluation(data);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Evaluation failed. Please try again.' });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Form */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-border shadow-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-btn-primary">
              <Mic size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-main tracking-tight">AI Interview Prep</h1>
              <p className="text-[15px] text-text-secondary font-medium mt-1">Practice tailored questions and get instant feedback.</p>
            </div>
          </div>

          <form onSubmit={handleGenerateQuestions} className="mt-8 flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full space-y-1.5">
              <label className="text-[13px] font-bold text-text-main">Target Role *</label>
              <Input
                name="targetRole"
                placeholder="e.g. Frontend Developer"
                value={formData.targetRole}
                onChange={handleChange}
                leftIcon={<Target size={16} />}
                required
              />
            </div>
            <div className="w-full sm:w-48 space-y-1.5">
              <label className="text-[13px] font-bold text-text-main">Experience Level *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase size={16} className="text-text-secondary/60" />
                </div>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-border/80 rounded-xl text-[14px] text-text-main focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all appearance-none"
                  required
                >
                  <option value="Intern">Intern</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Junior">Junior (1-3 yrs)</option>
                  <option value="Mid-Level">Mid-Level (3-5 yrs)</option>
                </select>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full sm:w-auto h-[42px] px-6 shadow-btn-primary shrink-0"
              disabled={isGenerating || isResumeLoading}
              leftIcon={<Sparkles size={16} />}
            >
              Generate Questions
            </Button>
          </form>
          
          {!resume && !isResumeLoading && (
            <div className="mt-4 p-3 rounded-xl bg-red-50/50 border border-red-100 text-[13px] text-red-600 font-medium flex items-center gap-2">
              <AlertCircle size={16} />
              You need to upload a resume in your profile before generating questions.
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {isGenerating && (
          <motion.div 
            key="generating"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-white/60 backdrop-blur-md rounded-2xl p-12 border border-border shadow-soft flex flex-col items-center justify-center text-center min-h-[300px]"
          >
            <div className="relative w-16 h-16 flex items-center justify-center mb-4">
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary"
                animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
              <Sparkles size={24} className="text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-text-main">Analyzing Resume & Generating Questions...</h3>
            <p className="text-[14px] text-text-secondary mt-1 max-w-sm">
              Creating custom interview questions based on your background and target role.
            </p>
          </motion.div>
        )}

        {!isGenerating && questions.length > 0 && (
          <motion.div 
            key="questions"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Question Selection */}
            <div className="space-y-3">
              <h3 className="text-[15px] font-bold text-text-main flex items-center gap-2">
                <Play size={16} className="text-primary" /> Select a question to answer:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {questions.map((q, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setSelectedQuestion(q);
                      setAnswer('');
                      setEvaluation(null);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                      selectedQuestion === q 
                        ? 'bg-primary/5 border-primary/40 shadow-sm ring-1 ring-primary/20' 
                        : 'bg-white/60 backdrop-blur-md border-border hover:border-primary/30 hover:bg-white/80'
                    }`}
                  >
                    <p className="text-[14px] font-medium text-text-main leading-snug">"{q}"</p>
                    <div className="mt-3 flex justify-end">
                      {selectedQuestion === q ? (
                        <span className="text-[11px] font-bold text-primary flex items-center gap-1"><CheckCircle size={12} /> Selected</span>
                      ) : (
                        <span className="text-[11px] font-semibold text-text-secondary">Select</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Answer Area */}
            {selectedQuestion && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-border shadow-soft space-y-4"
              >
                <div>
                  <label className="text-[13px] font-bold text-text-main flex items-center gap-2 mb-2">
                    <MessageSquare size={16} className="text-primary" /> Your Answer
                  </label>
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here as if you are speaking to the interviewer..."
                    className="w-full h-32 rounded-xl border border-border/80 bg-secondary/30 px-4 py-3 text-[14px] text-text-main placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all resize-none"
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleEvaluateAnswer}
                    disabled={isEvaluating || !answer.trim()}
                    leftIcon={<Zap size={16} />}
                    className="shadow-btn-primary"
                  >
                    {isEvaluating ? 'Evaluating...' : '✨ Evaluate Answer'}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Evaluation Result */}
            <AnimatePresence>
              {isEvaluating && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-border shadow-soft flex items-center justify-center gap-3"
                >
                   <div className="w-5 h-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                   <span className="text-[14px] font-semibold text-text-main">Evaluating Answer...</span>
                </motion.div>
              )}

              {evaluation && !isEvaluating && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white to-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/20 shadow-soft relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-success/10 rounded-full blur-[60px] pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row gap-8">
                    {/* Score */}
                    <div className="flex flex-col items-center justify-center shrink-0">
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="8" />
                          <motion.circle 
                            cx="50" cy="50" r="40" fill="none" 
                            stroke={evaluation.score >= 8 ? '#22C55E' : evaluation.score >= 6 ? '#F59E0B' : '#EF4444'} 
                            strokeWidth="8" strokeLinecap="round"
                            strokeDasharray="251.2"
                            initial={{ strokeDashoffset: 251.2 }}
                            animate={{ strokeDashoffset: 251.2 - (251.2 * (evaluation.score * 10)) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-extrabold text-text-main leading-none">{evaluation.score}</span>
                          <span className="text-[10px] font-bold text-text-secondary mt-1">/ 10</span>
                        </div>
                      </div>
                      <span className="text-[13px] font-bold text-text-secondary uppercase tracking-wider mt-3">Score</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-5">
                      <div>
                        <h4 className="text-[13px] font-bold text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Award size={16} className="text-accent" /> Feedback
                        </h4>
                        <p className="text-[14.5px] text-text-secondary leading-relaxed bg-white/50 p-4 rounded-xl border border-border">
                          {evaluation.feedback}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-bold text-text-main uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Sparkles size={16} className="text-primary" /> Improved Answer
                        </h4>
                        <p className="text-[14.5px] text-primary/90 font-medium leading-relaxed bg-primary/5 p-4 rounded-xl border border-primary/20">
                          {evaluation.improvedAnswer}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}
    </div>
  );
}

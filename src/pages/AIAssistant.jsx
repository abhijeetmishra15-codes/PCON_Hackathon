import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  MessageSquare,
  Briefcase,
  ChevronRight,
  History,
  Plus,
} from 'lucide-react';
import { Button, Input, Card, Avatar, Badge } from '../components/ui';

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('');

  const templates = [
    { icon: <FileText size={15} />, title: 'Analyze Resume', desc: 'ATS score & skill gap analysis' },
    { icon: <MessageSquare size={15} />, title: 'Draft Referral', desc: 'Write a message to an alumni' },
    { icon: <Briefcase size={15} />, title: 'Mock Interview', desc: 'Practice behavioral questions' },
  ];

  const historyItems = [
    { title: 'Mock Interview: Google SWE', time: '2h ago' },
    { title: 'Draft message to Sarah Jenkins', time: '5h ago' },
    { title: 'Analyze PM resume', time: '1d ago' },
    { title: "How to answer 'Tell me about yourself'", time: '2d ago' },
  ];

  return (
    <div className="flex gap-5" style={{ height: 'calc(100vh - 5rem)' }}>

      {/* Main chat */}
      <Card className="flex-1 flex flex-col overflow-hidden min-w-0 shadow-soft">

        {/* Chat header */}
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-white/60 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-btn-primary shrink-0">
              <Bot size={20} />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-text-main leading-tight">AlumniAI Career Assistant</h2>
              <p className="text-[12px] text-success flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Online · Ready to help
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" leftIcon={<Plus size={15} />}>
              New Chat
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <History size={18} className="text-text-secondary" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">

          {/* AI greeting */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 max-w-3xl"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={15} />
            </div>
            <div>
              <div className="bg-[rgba(255,243,230,0.7)] border border-[rgba(245,158,11,0.12)] rounded-2xl rounded-tl-sm p-4 text-[13.5px] text-text-main leading-relaxed">
                <p>Hi Alex! I'm your AI Career Assistant. I can help you analyze your resume, practice for interviews, or draft referral messages to alumni.</p>
                <p className="mt-3 text-[13px] font-semibold text-text-secondary">Try one of these suggestions:</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3">
                  {templates.map((t, i) => (
                    <button
                      key={i}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-border hover:border-primary/30 hover:shadow-soft transition-all text-left group"
                    >
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/15 transition-colors">
                        {t.icon}
                      </div>
                      <div>
                        <div className="text-[12.5px] font-semibold text-text-main group-hover:text-primary transition-colors leading-tight">
                          {t.title}
                        </div>
                        <div className="text-[11px] text-text-secondary mt-0.5">{t.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11px] text-text-secondary/60 mt-1.5 ml-1">AlumniAI · Just now</p>
            </div>
          </motion.div>

          {/* User message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3 max-w-3xl ml-auto flex-row-reverse"
          >
            <Avatar
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64"
              size="sm"
              className="shrink-0 mt-0.5"
            />
            <div>
              <div
                className="rounded-2xl rounded-tr-sm p-4 text-[13.5px] text-white leading-relaxed"
                style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FB923C 100%)' }}
              >
                Could you analyze my current resume for Product Management roles at Stripe?
              </div>
              <p className="text-[11px] text-text-secondary/60 mt-1.5 mr-1 text-right">You · 2m ago</p>
            </div>
          </motion.div>

          {/* AI response with card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 max-w-3xl"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={15} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-[rgba(255,243,230,0.7)] border border-[rgba(245,158,11,0.12)] rounded-2xl rounded-tl-sm p-4 text-[13.5px] text-text-main leading-relaxed">
                <p className="mb-4">I've analyzed your resume against top Product Management roles. Here's your breakdown:</p>

                {/* ATS Card */}
                <div className="bg-white rounded-xl border border-border p-4 shadow-soft">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[13px] font-bold text-text-main flex items-center gap-2">
                      <FileText size={16} className="text-accent" />
                      ATS Compatibility Score
                    </span>
                    <Badge variant="primary" className="text-[12px] font-black">78 / 100</Badge>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Keywords Match', val: 85, color: 'bg-success' },
                      { label: 'ATS Formatting', val: 100, color: 'bg-success' },
                      { label: 'Impact Metrics', val: 45, color: 'bg-danger' },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="flex justify-between text-[12px] mb-1.5">
                          <span className="text-text-secondary font-medium">{bar.label}</span>
                          <span className="font-bold text-text-main">{bar.val}%</span>
                        </div>
                        <div className="h-[6px] bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${bar.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${bar.val}%` }}
                            transition={{ duration: 0.8, delay: 0.6 + Math.random() * 0.3, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-border">
                    <h4 className="text-[11px] font-bold text-text-secondary uppercase tracking-wider mb-2">
                      Missing keywords for Stripe
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['API Design', 'SQL', 'A/B Testing', 'Go-to-market'].map((kw) => (
                        <span key={kw} className="px-2.5 py-[3px] rounded-full text-[11px] font-semibold border border-[rgba(0,0,0,0.10)] text-text-secondary bg-transparent">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Button size="sm" variant="outline" rightIcon={<ChevronRight size={14} />} className="mt-4 bg-white">
                  Open Resume Builder
                </Button>
              </div>
              <p className="text-[11px] text-text-secondary/60 mt-1.5 ml-1">AlumniAI · 1m ago</p>
            </div>
          </motion.div>
        </div>

        {/* Input area */}
        <div className="px-5 py-4 bg-background/80 backdrop-blur-xl border-t border-border shrink-0">
          <div className="relative flex items-center max-w-4xl mx-auto">
            <Input
              placeholder="Ask anything about your career journey..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="pr-14 bg-white"
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && setPrompt('')}
            />
            <Button
              size="icon"
              className={[
                'absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl',
                !prompt.trim() && 'opacity-40',
              ].join(' ')}
              disabled={!prompt.trim()}
            >
              <Send size={16} />
            </Button>
          </div>
          <p className="text-center text-[11px] text-text-secondary/50 mt-2">
            AI can make mistakes · Verify important information
          </p>
        </div>
      </Card>

      {/* Right sidebar: history */}
      <div className="hidden xl:flex flex-col gap-4 w-[260px] shrink-0">
        <Card className="flex-1 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-border flex items-center justify-between bg-secondary/30">
            <h3 className="text-[13px] font-bold text-text-main flex items-center gap-2">
              <History size={15} className="text-primary" />
              Recent Chats
            </h3>
            <Button variant="ghost" size="sm" leftIcon={<Plus size={13} />} className="text-[12px] h-7 px-2">
              New
            </Button>
          </div>
          <div className="overflow-y-auto p-2 space-y-0.5">
            {historyItems.map((h, i) => (
              <button
                key={i}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors group"
              >
                <div className="text-[12.5px] font-medium text-text-secondary group-hover:text-text-main transition-colors truncate">
                  {h.title}
                </div>
                <div className="text-[11px] text-text-secondary/50 mt-0.5">{h.time}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

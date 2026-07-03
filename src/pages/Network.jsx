import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, MessageSquare, Search, MoreHorizontal } from 'lucide-react';
import { Card, Button, Avatar, Input, Badge } from '../components/ui';

export default function Network() {
  const [activeTab, setActiveTab] = useState('connections'); // connections, requests

  const connections = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Senior Product Manager',
      company: 'Stripe',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=128&h=128',
      connectedOn: '2 days ago'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Software Engineer II',
      company: 'Apple',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128',
      connectedOn: '1 week ago'
    }
  ];

  const requests = [
    {
      id: 3,
      name: 'Emily Davis',
      role: 'UX Designer',
      company: 'Linear',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128',
      mutual: 3,
      message: "Hi! I saw your recent project on React and would love to connect."
    }
  ];

  return (
    <div className="pb-14">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[30px] font-extrabold tracking-tight text-text-main mb-1">
          My Network
        </h1>
        <p className="text-[14px] text-text-secondary">
          Manage your professional connections and messages.
        </p>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex bg-secondary p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('connections')}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'connections' ? 'bg-white shadow-soft text-text-main' : 'text-text-secondary hover:text-text-main'
            }`}
          >
            <Users size={16} /> Connections ({connections.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'requests' ? 'bg-white shadow-soft text-text-main' : 'text-text-secondary hover:text-text-main'
            }`}
          >
            <UserPlus size={16} /> Pending Requests
            {requests.length > 0 && (
              <span className="bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full ml-1">
                {requests.length}
              </span>
            )}
          </button>
        </div>

        <div className="w-full sm:w-64">
          <Input
            placeholder="Search network..."
            leftIcon={<Search size={16} />}
            className="bg-white"
          />
        </div>
      </div>

      {/* Content */}
      {activeTab === 'connections' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {connections.map((person, idx) => (
            <motion.div key={person.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className="p-4 bg-white hover:shadow-soft transition-shadow flex items-center gap-4">
                <Avatar src={person.avatar} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-text-main truncate">{person.name}</h3>
                  <p className="text-[13px] text-text-secondary truncate">{person.role} at {person.company}</p>
                  <p className="text-[11px] text-text-secondary/70 mt-0.5">Connected {person.connectedOn}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-9 h-9 p-0 flex items-center justify-center rounded-full hover:bg-primary/5 hover:text-primary hover:border-primary/30">
                    <MessageSquare size={16} />
                  </Button>
                  <Button variant="ghost" className="w-9 h-9 p-0 flex items-center justify-center rounded-full">
                    <MoreHorizontal size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {requests.map((req, idx) => (
            <motion.div key={req.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card className="p-5 bg-white flex flex-col sm:flex-row gap-5 items-start">
                <Avatar src={req.avatar} size="xl" />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <h3 className="text-[16px] font-bold text-text-main">{req.name}</h3>
                      <p className="text-[13px] text-text-secondary mb-1">{req.role} at {req.company}</p>
                      <Badge variant="secondary" className="text-[11px] font-medium bg-secondary">
                        {req.mutual} mutual connections
                      </Badge>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button variant="outline" className="h-9 px-4">Ignore</Button>
                      <Button className="h-9 px-4">Accept</Button>
                    </div>
                  </div>
                  {req.message && (
                    <div className="mt-4 p-3 bg-secondary/50 rounded-xl border border-border">
                      <p className="text-[13px] text-text-secondary italic">"{req.message}"</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
          {requests.length === 0 && (
            <div className="text-center py-12 text-text-secondary">
              No pending requests.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

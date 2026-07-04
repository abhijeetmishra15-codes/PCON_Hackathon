import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, UserPlus, MessageSquare, Search, MoreHorizontal, X, Check, Loader2, UserMinus } from 'lucide-react';
import { Card, Button, Avatar, Input, Badge } from '../components/ui';
import { useConnections } from '../hooks/useConnections';
import { useChat } from '../hooks/useChat';
import { useNavigate } from 'react-router-dom';

export default function Network() {
  const [activeTab, setActiveTab] = useState('connections'); // connections, requests
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { startChat } = useChat();
  const [startingChatId, setStartingChatId] = useState(null);

  const {
    isLoading,
    acceptedConnections,
    pendingIncoming,
    pendingOutgoing,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleRemoveConnection
  } = useConnections();

  const filteredConnections = acceptedConnections.filter(c => 
    c.person?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.person?.alumni?.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.person?.alumni?.job_role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleText = (person) => {
    if (person?.role === 'alumni' && person.alumni) {
      return `${person.alumni.job_role || 'Alumni'} at ${person.alumni.company || 'Unknown'}`;
    }
    return 'Student';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleMessageClick = async (otherUserId) => {
    try {
      setStartingChatId(otherUserId);
      const roomId = await startChat(otherUserId);
      navigate(`/chat?room=${roomId}`);
    } catch (error) {
      console.error(error);
      alert(error.message || 'Failed to start chat');
    } finally {
      setStartingChatId(null);
    }
  };

  return (
    <div className="pb-14">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[30px] font-extrabold tracking-tight text-text-main mb-1">
          My Network
        </h1>
        <p className="text-[14px] text-text-secondary">
          Manage your professional connections and requests.
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
            <Users size={16} /> Connections ({acceptedConnections.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === 'requests' ? 'bg-white shadow-soft text-text-main' : 'text-text-secondary hover:text-text-main'
            }`}
          >
            <UserPlus size={16} /> Requests
            {(pendingIncoming.length + pendingOutgoing.length) > 0 && (
              <span className="bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full ml-1">
                {pendingIncoming.length + pendingOutgoing.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'connections' && (
          <div className="w-full sm:w-64">
            <Input
              placeholder="Search connections..."
              leftIcon={<Search size={16} />}
              className="bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-4 bg-white animate-pulse flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-secondary shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-secondary rounded w-1/2" />
                <div className="h-3 bg-secondary rounded w-3/4" />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Content */
        <AnimatePresence mode="wait">
          {activeTab === 'connections' ? (
            <motion.div 
              key="connections"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredConnections.length > 0 ? (
                filteredConnections.map((conn, idx) => (
                  <motion.div key={conn.connection_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.05 }}>
                    <Card className="p-4 bg-white hover:shadow-soft transition-shadow flex items-center gap-4 group">
                      <Avatar src={conn.person?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(conn.person?.full_name)}&background=random`} size="lg" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-bold text-text-main truncate">{conn.person?.full_name}</h3>
                        <p className="text-[13px] text-text-secondary truncate">{getRoleText(conn.person)}</p>
                        <p className="text-[11px] text-text-secondary/70 mt-0.5">Connected on {formatDate(conn.connected_on)}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => handleMessageClick(conn.person?.id)}
                          disabled={startingChatId === conn.person?.id}
                          className="w-9 h-9 p-0 flex items-center justify-center rounded-full hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                        >
                          {startingChatId === conn.person?.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <MessageSquare size={16} />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={() => {
                            if(window.confirm('Remove connection?')) {
                              handleRemoveConnection(conn.connection_id, conn.person?.id);
                            }
                          }}
                          className="w-9 h-9 p-0 flex items-center justify-center rounded-full text-text-secondary hover:text-red-500 hover:bg-red-50"
                          title="Remove Connection"
                        >
                          <UserMinus size={16} />
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-1 md:col-span-2 text-center py-16 bg-white rounded-2xl border border-border">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="text-text-secondary w-8 h-8" />
                  </div>
                  <h2 className="text-lg font-bold text-text-main mb-1">No connections found</h2>
                  <p className="text-text-secondary text-sm">
                    {searchQuery ? "Try a different search term." : "Start discovering alumni to build your network."}
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="requests"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8 max-w-3xl"
            >
              {/* Incoming Requests */}
              <section>
                <h3 className="text-[15px] font-bold text-text-main flex items-center gap-2 mb-4">
                  Incoming Requests
                  <Badge variant="secondary" className="bg-secondary">{pendingIncoming.length}</Badge>
                </h3>
                
                {pendingIncoming.length > 0 ? (
                  <div className="space-y-4">
                    {pendingIncoming.map((req) => (
                      <Card key={req.id} className="p-5 bg-white flex flex-col sm:flex-row gap-5 items-start">
                        <Avatar src={req.requester?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.requester?.full_name)}&background=random`} size="xl" />
                        <div className="flex-1 w-full">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                            <div>
                              <h3 className="text-[16px] font-bold text-text-main">{req.requester?.full_name}</h3>
                              <p className="text-[13px] text-text-secondary mb-1">{getRoleText(req.requester)}</p>
                              <p className="text-[11px] text-text-secondary/70">Sent {formatDate(req.created_at)}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button 
                                variant="outline" 
                                onClick={() => handleRejectRequest(req.id, req.requester?.id)}
                                className="h-9 px-4 text-text-secondary hover:text-text-main hover:bg-secondary"
                              >
                                Ignore
                              </Button>
                              <Button 
                                onClick={() => handleAcceptRequest(req.id, req.requester?.id)}
                                className="h-9 px-4 shadow-btn-primary"
                              >
                                Accept
                              </Button>
                            </div>
                          </div>
                          {req.message && (
                            <div className="mt-4 p-3 bg-secondary/50 rounded-xl border border-border relative">
                              <p className="text-[13px] text-text-secondary italic">"{req.message}"</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-white rounded-2xl border border-border text-center text-text-secondary text-sm">
                    No incoming requests.
                  </div>
                )}
              </section>

              {/* Outgoing Requests */}
              <section>
                <h3 className="text-[15px] font-bold text-text-main flex items-center gap-2 mb-4">
                  Outgoing Requests
                  <Badge variant="secondary" className="bg-secondary">{pendingOutgoing.length}</Badge>
                </h3>
                
                {pendingOutgoing.length > 0 ? (
                  <div className="space-y-4">
                    {pendingOutgoing.map((req) => (
                      <Card key={req.id} className="p-5 bg-white flex flex-col sm:flex-row gap-5 items-center">
                        <Avatar src={req.addressee?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(req.addressee?.full_name)}&background=random`} size="lg" />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[15px] font-bold text-text-main truncate">{req.addressee?.full_name}</h3>
                          <p className="text-[13px] text-text-secondary truncate">{getRoleText(req.addressee)}</p>
                          <p className="text-[11px] text-text-secondary/70 mt-0.5">Sent {formatDate(req.created_at)}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => handleCancelRequest(req.id, req.addressee?.id)}
                          className="h-9 px-4 text-text-secondary hover:text-red-500 hover:border-red-200 hover:bg-red-50 shrink-0"
                        >
                          Cancel
                        </Button>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-white rounded-2xl border border-border text-center text-text-secondary text-sm">
                    No outgoing requests.
                  </div>
                )}
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

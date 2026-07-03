import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ConnectionsService } from '../lib/services/connections.service';
import { supabase } from '../lib/supabase';

export function useConnections() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // States
  const [connectionsMap, setConnectionsMap] = useState({}); // { [otherUserId]: connectionRecord }
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [pendingIncoming, setPendingIncoming] = useState([]);
  const [pendingOutgoing, setPendingOutgoing] = useState([]);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all basic connection records for the map
      const allConns = await ConnectionsService.getAllUserConnections(user.id);
      
      const newMap = {};
      allConns.forEach(c => {
        const otherId = c.requester_id === user.id ? c.addressee_id : c.requester_id;
        
        // If there are multiple connections (e.g. an old rejected one and a new accepted one),
        // we must prioritize 'accepted'. Otherwise, we just keep the first one we see.
        // We should ideally order by created_at DESC in the service, but this safely prioritizes accepted.
        if (!newMap[otherId] || c.status === 'accepted') {
          newMap[otherId] = c;
        }
      });
      setConnectionsMap(newMap);

      // Fetch detailed lists for the Network page
      const accepted = await ConnectionsService.getMyConnections(user.id);
      setAcceptedConnections(accepted);

      const pending = await ConnectionsService.getPendingRequests(user.id);
      setPendingIncoming(pending.incoming);
      setPendingOutgoing(pending.outgoing);

    } catch (err) {
      console.error("Failed to fetch connections:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();

    if (!user?.id) return;

    // Realtime Subscriptions
    // Supabase realtime filters don't support OR natively, so we create two channels:
    // One where the user is the requester, one where they are the addressee.
    
    const handleRealtimeEvent = (payload) => {
      // Rather than manually patching complex nested arrays (which requires fetching profile data for new connections),
      // the safest and cleanest approach for MVP is to simply refetch the data when a change occurs.
      fetchData();
    };

    const requesterChannel = supabase.channel('connections-requester')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'connections',
        filter: `requester_id=eq.${user.id}`
      }, handleRealtimeEvent)
      .subscribe();

    const addresseeChannel = supabase.channel('connections-addressee')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'connections',
        filter: `addressee_id=eq.${user.id}`
      }, handleRealtimeEvent)
      .subscribe();

    return () => {
      supabase.removeChannel(requesterChannel);
      supabase.removeChannel(addresseeChannel);
    };
  }, [user?.id, fetchData]);


  // Action handlers with Optimistic UI updates
  const handleSendRequest = async (addresseeId, message = null) => {
    if (!user?.id) return;
    try {
      // Optimistic update map
      setConnectionsMap(prev => ({
        ...prev,
        [addresseeId]: { id: 'temp', requester_id: user.id, addressee_id: addresseeId, status: 'pending' }
      }));

      await ConnectionsService.sendRequest(user.id, addresseeId, message);
      // Realtime will trigger a full refetch to get the actual ID
    } catch (err) {
      console.error("Error sending request:", err);
      // Revert optimism by refetching
      fetchData();
      throw err;
    }
  };

  const handleAcceptRequest = async (connectionId, otherUserId) => {
    try {
      // Optimistic update
      setConnectionsMap(prev => ({
        ...prev,
        [otherUserId]: { ...prev[otherUserId], status: 'accepted' }
      }));
      setPendingIncoming(prev => prev.filter(req => req.id !== connectionId));
      
      await ConnectionsService.acceptRequest(connectionId);
    } catch (err) {
      console.error("Error accepting request:", err);
      fetchData();
      throw err;
    }
  };

  const handleRejectRequest = async (connectionId, otherUserId) => {
    try {
      // Optimistic update
      setConnectionsMap(prev => ({
        ...prev,
        [otherUserId]: { ...prev[otherUserId], status: 'rejected' }
      }));
      setPendingIncoming(prev => prev.filter(req => req.id !== connectionId));

      await ConnectionsService.rejectRequest(connectionId);
    } catch (err) {
      console.error("Error rejecting request:", err);
      fetchData();
      throw err;
    }
  };

  const handleCancelRequest = async (connectionId, otherUserId) => {
    try {
      // Optimistic update
      setConnectionsMap(prev => {
        const newMap = { ...prev };
        delete newMap[otherUserId];
        return newMap;
      });
      setPendingOutgoing(prev => prev.filter(req => req.id !== connectionId));

      await ConnectionsService.cancelRequest(connectionId);
    } catch (err) {
      console.error("Error canceling request:", err);
      fetchData();
      throw err;
    }
  };

  const handleRemoveConnection = async (connectionId, otherUserId) => {
    try {
      // Optimistic update
      setConnectionsMap(prev => {
        const newMap = { ...prev };
        delete newMap[otherUserId];
        return newMap;
      });
      setAcceptedConnections(prev => prev.filter(conn => conn.connection_id !== connectionId));

      await ConnectionsService.removeConnection(connectionId);
    } catch (err) {
      console.error("Error removing connection:", err);
      fetchData();
      throw err;
    }
  };

  return {
    isLoading,
    error,
    connectionsMap,
    acceptedConnections,
    pendingIncoming,
    pendingOutgoing,
    handleSendRequest,
    handleAcceptRequest,
    handleRejectRequest,
    handleCancelRequest,
    handleRemoveConnection,
    refetch: fetchData
  };
}

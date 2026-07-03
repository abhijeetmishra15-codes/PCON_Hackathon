import { supabase } from '../supabase';

export const ConnectionsService = {
  /**
   * Fetch all connections for a user to build a fast local state map.
   * This includes pending, accepted, and rejected connections where the user is either the requester or addressee.
   */
  async getAllUserConnections(userId) {
    if (!userId) return [];
    
    const { data, error } = await supabase
      .from('connections')
      .select(`
        id,
        requester_id,
        addressee_id,
        status,
        message,
        created_at,
        updated_at
      `)
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`);

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetch accepted connections for a user, joining with profile data.
   */
  async getMyConnections(userId) {
    if (!userId) return [];
    
    // We need to fetch both sides since the user could be requester or addressee
    // Using two queries is often easier with Supabase to get the joined profiles correctly
    
    const { data: requesterData, error: requesterError } = await supabase
      .from('connections')
      .select(`
        id,
        status,
        created_at,
        addressee:profiles!connections_addressee_id_fkey(
          id,
          full_name,
          role,
          avatar_url,
          alumni:alumni_profiles(job_role, company),
          student:student_profiles(id)
        )
      `)
      .eq('requester_id', userId)
      .eq('status', 'accepted');

    if (requesterError) throw requesterError;

    const { data: addresseeData, error: addresseeError } = await supabase
      .from('connections')
      .select(`
        id,
        status,
        created_at,
        requester:profiles!connections_requester_id_fkey(
          id,
          full_name,
          role,
          avatar_url,
          alumni:alumni_profiles(job_role, company),
          student:student_profiles(id)
        )
      `)
      .eq('addressee_id', userId)
      .eq('status', 'accepted');

    if (addresseeError) throw addresseeError;

    // Normalize the data so the 'person' field is the other user
    const normalizedRequester = requesterData.map(c => ({
      connection_id: c.id,
      connected_on: c.created_at,
      person: c.addressee
    }));

    const normalizedAddressee = addresseeData.map(c => ({
      connection_id: c.id,
      connected_on: c.created_at,
      person: c.requester
    }));

    return [...normalizedRequester, ...normalizedAddressee];
  },

  /**
   * Fetch pending requests for a user (Incoming and Outgoing)
   */
  async getPendingRequests(userId) {
    if (!userId) return { incoming: [], outgoing: [] };

    // Incoming requests (user is addressee)
    const { data: incomingData, error: incomingError } = await supabase
      .from('connections')
      .select(`
        id,
        status,
        message,
        created_at,
        requester:profiles!connections_requester_id_fkey(
          id,
          full_name,
          role,
          avatar_url,
          alumni:alumni_profiles(job_role, company)
        )
      `)
      .eq('addressee_id', userId)
      .eq('status', 'pending');

    if (incomingError) throw incomingError;

    // Outgoing requests (user is requester)
    const { data: outgoingData, error: outgoingError } = await supabase
      .from('connections')
      .select(`
        id,
        status,
        message,
        created_at,
        addressee:profiles!connections_addressee_id_fkey(
          id,
          full_name,
          role,
          avatar_url,
          alumni:alumni_profiles(job_role, company)
        )
      `)
      .eq('requester_id', userId)
      .eq('status', 'pending');

    if (outgoingError) throw outgoingError;

    return {
      incoming: incomingData || [],
      outgoing: outgoingData || []
    };
  },

  /**
   * Send a new connection request
   */
  async sendRequest(requesterId, addresseeId, message = null) {
    const { data, error } = await supabase
      .from('connections')
      .insert({
        requester_id: requesterId,
        addressee_id: addresseeId,
        message: message,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Accept an incoming connection request
   */
  async acceptRequest(connectionId) {
    const { data, error } = await supabase
      .from('connections')
      .update({ status: 'accepted' })
      .eq('id', connectionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Reject an incoming connection request
   */
  async rejectRequest(connectionId) {
    const { data, error } = await supabase
      .from('connections')
      .update({ status: 'rejected' })
      .eq('id', connectionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Cancel an outgoing connection request
   */
  async cancelRequest(connectionId) {
    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('id', connectionId);

    if (error) throw error;
    return true;
  },

  /**
   * Remove an accepted connection
   */
  async removeConnection(connectionId) {
    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('id', connectionId);

    if (error) throw error;
    return true;
  }
};

import { supabase } from '../supabase';
import { notificationsService } from './notifications.service';

export const ReferralsService = {
  /**
   * Create a new referral request from a student to an alumni.
   */
  async createReferralRequest(data) {
    const { student_id, alumni_id, company_name, job_title, job_url, pitch_message, resume_url } = data;
    
    const { data: request, error } = await supabase
      .from('referral_requests')
      .insert({
        student_id,
        alumni_id,
        company_name,
        job_title,
        job_url,
        pitch_message,
        resume_url,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return request;
  },

  /**
   * Get all incoming referral requests for an alumni.
   */
  async getIncomingReferrals(alumniId) {
    if (!alumniId) return [];

    const { data, error } = await supabase
      .from('referral_requests')
      .select(`
        *,
        student:student_profiles(
          id,
          profiles(
            id,
            full_name,
            avatar_url,
            department,
            graduation_year
          )
        )
      `)
      .eq('alumni_id', alumniId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform to match UI expectations (flatten the profiles nested object)
    const formattedData = (data || []).map(req => ({
      ...req,
      student: req.student?.profiles ? { ...req.student.profiles } : null
    }));

    return formattedData;
  },

  /**
   * Get all outgoing referral requests made by a student.
   */
  async getOutgoingReferrals(studentId) {
    if (!studentId) return [];

    const { data, error } = await supabase
      .from('referral_requests')
      .select(`
        *,
        alumni:alumni_profiles(
          company,
          job_role,
          profiles(
            id,
            full_name,
            avatar_url
          )
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform to match UI expectations (flatten profiles, nest company/job_role)
    const formattedData = (data || []).map(req => {
      const alumniData = req.alumni;
      return {
        ...req,
        alumni: alumniData?.profiles ? {
          ...alumniData.profiles,
          alumni_profile: {
            company: alumniData.company,
            job_role: alumniData.job_role
          }
        } : null
      };
    });

    return formattedData;
  },

  /**
   * Get a specific referral request by ID.
   */
  async getReferralById(id) {
    const { data, error } = await supabase
      .from('referral_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get the status of a referral between a student and an alumni.
   * Returns the most recent request if multiple exist.
   */
  async getReferralStatus(studentId, alumniId) {
    if (!studentId || !alumniId) return null;

    const { data, error } = await supabase
      .from('referral_requests')
      .select('status, created_at')
      .eq('student_id', studentId)
      .eq('alumni_id', alumniId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  /**
   * Approve a referral request.
   */
  async approveReferral(id) {
    const { data, error } = await supabase
      .from('referral_requests')
      .update({ status: 'reviewing' }) // 'reviewing' means they accepted it and are looking at it/working on it
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    try {
      await notificationsService.createNotification(
        data.student_id,
        data.alumni_id,
        'referral_approved',
        'referral',
        data.id,
        'approved your referral request and is reviewing it'
      );
    } catch (err) {
      console.error('Error creating notification:', err);
    }

    return data;
  },

  /**
   * Reject a referral request.
   */
  async rejectReferral(id) {
    const { data, error } = await supabase
      .from('referral_requests')
      .update({ status: 'rejected' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    try {
      await notificationsService.createNotification(
        data.student_id,
        data.alumni_id,
        'referral_rejected',
        'referral',
        data.id,
        'declined your referral request'
      );
    } catch (err) {
      console.error('Error creating notification:', err);
    }

    return data;
  },

  /**
   * Complete a referral request (e.g. marked as actually referred).
   */
  async completeReferral(id) {
    const { data, error } = await supabase
      .from('referral_requests')
      .update({ status: 'referred' }) // 'referred' means they successfully submitted the referral
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    try {
      await notificationsService.createNotification(
        data.student_id,
        data.alumni_id,
        'referral_completed',
        'referral',
        data.id,
        'has successfully submitted your referral'
      );
    } catch (err) {
      console.error('Error creating notification:', err);
    }

    return data;
  },

  /**
   * Cancel a pending referral request.
   */
  async cancelReferral(id) {
    const { error } = await supabase
      .from('referral_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  /**
   * Subscribe to referral changes for a given user (either as student or alumni).
   */
  subscribeToReferrals(userId, callback) {
    if (!userId) return null;

    const subscription = supabase
      .channel(`referrals_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'referral_requests',
          filter: `student_id=eq.${userId}`
        },
        (payload) => callback(payload)
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'referral_requests',
          filter: `alumni_id=eq.${userId}`
        },
        (payload) => callback(payload)
      )
      .subscribe();

    return subscription;
  },

  /**
   * Unsubscribe from realtime changes.
   */
  unsubscribe(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }
};

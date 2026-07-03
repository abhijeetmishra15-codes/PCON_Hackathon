import { supabase } from '../supabase';

export const OpportunitiesService = {
  /**
   * Fetch all open opportunities with pagination and optional filters
   */
  async getOpportunities(options = {}) {
    const {
      search = '',
      location = '',
      workMode = '',
      jobType = '',
      limit = 20,
      offset = 0
    } = options;

    let query = supabase
      .from('opportunities')
      .select(`
        *,
        author:alumni_profiles!inner(
          id,
          company,
          job_role,
          profiles!inner(
            id,
            full_name,
            avatar_url
          )
        ),
        opportunity_skills(
          skills(
            id,
            name
          )
        )
      `, { count: 'exact' })
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    // Apply filters safely
    if (search) {
      query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%`);
    }
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }
    if (workMode) {
      query = query.eq('work_mode', workMode);
    }
    if (jobType) {
      query = query.eq('type', jobType);
    }

    if (limit) {
      query = query.range(offset, offset + limit - 1);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    
    // Normalize skills and author data
    const formattedData = (data || []).map(opp => ({
      ...opp,
      author: {
        id: opp.author.id,
        company: opp.author.company,
        job_role: opp.author.job_role,
        full_name: Array.isArray(opp.author.profiles) ? opp.author.profiles[0]?.full_name : opp.author.profiles?.full_name,
        avatar_url: Array.isArray(opp.author.profiles) ? opp.author.profiles[0]?.avatar_url : opp.author.profiles?.avatar_url,
      },
      skills: opp.opportunity_skills
        ?.map(os => os.skills)
        .filter(Boolean) || []
    }));

    return { data: formattedData, count };
  },

  /**
   * Fetch opportunities created by a specific alumni
   */
  async getMyOpportunities(authorId) {
    if (!authorId) return [];

    const { data, error } = await supabase
      .from('opportunities')
      .select(`
        *,
        opportunity_skills(
          skills(
            id,
            name
          )
        )
      `)
      .eq('author_id', authorId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(opp => ({
      ...opp,
      skills: opp.opportunity_skills
        ?.map(os => os.skills)
        .filter(Boolean) || []
    }));
  },

  /**
   * Fetch a single opportunity by ID
   */
  async getOpportunityById(id) {
    const { data, error } = await supabase
      .from('opportunities')
      .select(`
        *,
        author:alumni_profiles!inner(
          id,
          company,
          job_role,
          profiles!inner(
            id,
            full_name,
            avatar_url
          )
        ),
        opportunity_skills(
          skills(
            id,
            name
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      ...data,
      author: {
        id: data.author.id,
        company: data.author.company,
        job_role: data.author.job_role,
        full_name: Array.isArray(data.author.profiles) ? data.author.profiles[0]?.full_name : data.author.profiles?.full_name,
        avatar_url: Array.isArray(data.author.profiles) ? data.author.profiles[0]?.avatar_url : data.author.profiles?.avatar_url,
      },
      skills: data.opportunity_skills
        ?.map(os => os.skills)
        .filter(Boolean) || []
    };
  },

  /**
   * Create a new opportunity
   */
  async createOpportunity(opportunityData, skillIds = []) {
    // 1. Insert opportunity
    const { data: opp, error: oppError } = await supabase
      .from('opportunities')
      .insert(opportunityData)
      .select()
      .single();

    if (oppError) throw oppError;

    // 2. Insert skills if any
    if (skillIds.length > 0) {
      const skillsToInsert = skillIds.map(skillId => ({
        opportunity_id: opp.id,
        skill_id: skillId
      }));
      const { error: skillsError } = await supabase
        .from('opportunity_skills')
        .insert(skillsToInsert);
        
      if (skillsError) {
        console.error("Failed to insert skills for opportunity:", skillsError);
        // Soft fail on skills, opportunity is already created
      }
    }

    return opp;
  },

  /**
   * Update an existing opportunity
   */
  async updateOpportunity(id, opportunityData, skillIds = null) {
    // 1. Update opportunity core data
    const { data: opp, error: oppError } = await supabase
      .from('opportunities')
      .update(opportunityData)
      .eq('id', id)
      .select()
      .single();

    if (oppError) throw oppError;

    // 2. Sync skills if skillIds provided
    if (skillIds !== null) {
      // Delete old skills
      const { error: delError } = await supabase
        .from('opportunity_skills')
        .delete()
        .eq('opportunity_id', id);

      if (delError) throw delError;

      // Insert new skills
      if (skillIds.length > 0) {
        const skillsToInsert = skillIds.map(skillId => ({
          opportunity_id: id,
          skill_id: skillId
        }));
        
        const { error: insertError } = await supabase
          .from('opportunity_skills')
          .insert(skillsToInsert);

        if (insertError) throw insertError;
      }
    }

    return opp;
  },

  /**
   * Delete an opportunity
   */
  async deleteOpportunity(id) {
    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

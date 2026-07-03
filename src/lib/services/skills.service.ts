import { supabase } from '../supabase';

export interface Skill {
  id: string;
  name: string;
}

export const SkillsService = {
  // Search existing skills for autocomplete
  async searchSkills(query: string): Promise<Skill[]> {
    if (!query.trim()) return [];
    
    const { data, error } = await supabase
      .from('skills')
      .select('id, name')
      .ilike('name', `%${query}%`)
      .limit(10);
      
    if (error) throw error;
    return data || [];
  },

  // Fetch user's skills
  async getUserSkills(userId: string): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('user_skills')
      .select('skills(id, name)')
      .eq('user_id', userId);
      
    if (error) throw error;
    
    // Map the nested result to a flat array of skills
    return (data || []).map((row: any) => row.skills).filter(Boolean);
  },

  // Add a skill to user
  async addSkillToUser(userId: string, skillName: string): Promise<Skill> {
    const name = skillName.trim();
    if (!name) throw new Error('Skill name cannot be empty');

    // 1. Try to find the skill by name (case-insensitive)
    let { data: existingSkills, error: searchError } = await supabase
      .from('skills')
      .select('id, name')
      .ilike('name', name)
      .limit(1);
      
    if (searchError) throw searchError;

    let skillId;
    let finalSkillName = name;

    if (existingSkills && existingSkills.length > 0) {
      skillId = existingSkills[0].id;
      finalSkillName = existingSkills[0].name;
    } else {
      // 2. Create the skill if it doesn't exist
      const { data: newSkill, error: createError } = await supabase
        .from('skills')
        .insert([{ name }])
        .select('id, name')
        .single();
        
      if (createError) throw createError;
      skillId = newSkill.id;
      finalSkillName = newSkill.name;
    }

    // 3. Link the skill to the user
    const { error: linkError } = await supabase
      .from('user_skills')
      .insert([{ user_id: userId, skill_id: skillId }]);
      
    // If linkError is a unique violation, it means they already have the skill, which is fine to ignore
    if (linkError && linkError.code !== '23505') { 
      throw linkError;
    }

    return { id: skillId, name: finalSkillName };
  },

  // Remove a skill from user
  async removeSkillFromUser(userId: string, skillId: string): Promise<void> {
    const { error } = await supabase
      .from('user_skills')
      .delete()
      .eq('user_id', userId)
      .eq('skill_id', skillId);
      
    if (error) throw error;
  }
};

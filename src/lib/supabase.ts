import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables from Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Verify environment variables are present before initializing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

/**
 * The production-ready Supabase client.
 * This singleton instance should be imported wherever database or auth interactions are needed.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

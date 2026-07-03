import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const envVars = {};
env.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) envVars[key.trim()] = value.join('=').trim().replace(/['"]/g, '');
});

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

async function check() {
  console.log("Checking profiles...");
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, role');
  console.log("Profiles:", profiles);

  console.log("Checking alumni_profiles...");
  const { data: alumni } = await supabase.from('alumni_profiles').select('*');
  console.log("Alumni Profiles:", alumni);

  console.log("Checking query...");
  const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        role,
        alumni_profiles!inner (
          is_verified
        )
      `)
      .eq('role', 'alumni');
  console.log("Query with role=alumni and inner join:", data, error);
  
  const { data: data2, error: error2 } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        role,
        alumni_profiles!inner (
          is_verified
        )
      `)
      .eq('role', 'alumni')
      .eq('alumni_profiles.is_verified', true);
  console.log("Query with is_verified=true:", data2, error2);
}

check();

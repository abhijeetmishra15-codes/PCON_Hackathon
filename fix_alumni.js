import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const envVars = {};
env.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value) envVars[key.trim()] = value.join('=').trim().replace(/['"]/g, '');
});

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

async function fix() {
  console.log("Fixing unverified alumni...");
  const { data, error } = await supabase
    .from('alumni_profiles')
    .update({ is_verified: true })
    .eq('is_verified', false)
    .select();
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Fixed accounts:", data);
  }
}

fix();

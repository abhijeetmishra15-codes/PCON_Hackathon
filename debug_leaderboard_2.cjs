const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const [k, v] = line.split('=');
  if(k && v) acc[k.trim()] = v.trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function main() {
  const { data, error } = await supabase
    .from('alumni_profiles')
    .select(`
      id,
      company,
      job_role,
      is_verified,
      profiles(full_name, avatar_url)
    `);

  console.log('Error:', error);
  console.log('Data:', JSON.stringify(data, null, 2));
}

main();

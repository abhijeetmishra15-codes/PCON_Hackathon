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
    .update({ is_verified: true })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Dummy condition to update all rows

  console.log('Error:', error);
  console.log('Data updated.');
}

main();

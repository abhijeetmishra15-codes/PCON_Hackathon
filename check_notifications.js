import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const supabaseUrl = env.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseKey = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

async function check() {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    const json = await res.json();
    const notificationsDef = json.definitions ? json.definitions.notifications : null;
    console.log("Notifications Schema:");
    console.log(JSON.stringify(notificationsDef, null, 2));
  } catch (err) {
    console.error(err);
  }
}
check();

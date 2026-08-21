import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || 'https://qkcbuawgidhkchwhxtbk.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrY2J1YXdnaWRoa2Nod2h4dGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1NzQyMDMsImV4cCI6MjEwMTE1MDIwM30._5Egi6JE3EAv3ztYCs2Ntr9PXSgWMyli5SL3vSGHTSs';

const supabase = createClient(url, key);

async function test() {
  console.log("Fetching doctors_directory...");
  const { data, error } = await supabase.from('doctors_directory').select('*');
  if (error) {
    console.error("Error:", error);
  } else {
    console.log(`Success! Found ${data.length} records.`);
    if (data.length > 0) {
      console.log(data.slice(0, 2));
    }
  }
}
test();

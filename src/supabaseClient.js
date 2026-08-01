import { createClient } from '@supabase/supabase-js';

// Since Vite's cache was not picking up the .env file, we are directly adding the keys here.
// These are safe to be public as they are Anon keys and you will set up Row Level Security.
const supabaseUrl = 'https://qkcbuawgidhkchwhxtbk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrY2J1YXdnaWRoa2Nod2h4dGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1NzQyMDMsImV4cCI6MjEwMTE1MDIwM30._5Egi6JE3EAv3ztYCs2Ntr9PXSgWMyli5SL3vSGHTSs';

export const supabase = createClient(supabaseUrl, supabaseKey);

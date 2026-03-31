import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const VITE_SUPABASE_URL = envFile.split('\n').find(l => l.startsWith('VITE_SUPABASE_URL')).split('=')[1].trim();
const VITE_SUPABASE_ANON_KEY = envFile.split('\n').find(l => l.startsWith('VITE_SUPABASE_ANON_KEY')).split('=')[1].trim();

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function checkAdmin() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@school.com',
    password: 'Password123!'
  });
  if (authError) {
    console.error("Auth Error:", authError.message);
    return;
  }
  console.log("Logged in successfully. User ID:", authData.user.id);
  
  // Force inserting the admin profile into public.users
  const { error: insertError } = await supabase.from('users').upsert({
    id: authData.user.id,
    email: 'admin@school.com',
    name: 'Super Admin',
    role: 'admin'
  });

  if (insertError) {
    console.error("Failed to insert into public.users:", insertError.message);
  } else {
    console.log("Successfully forced admin user into public.users!");
    
    // Check it again
    const { data: finalAdmin, error: finalError } = await supabase.from('users').select('*').eq('id', authData.user.id);
    console.log("Verified Admin row:", finalAdmin);
  }
}

checkAdmin();

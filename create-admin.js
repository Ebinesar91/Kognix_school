import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envFile = fs.readFileSync('.env', 'utf-8');
const VITE_SUPABASE_URL = envFile.split('\n').find(l => l.startsWith('VITE_SUPABASE_URL')).split('=')[1].trim();
const VITE_SUPABASE_ANON_KEY = envFile.split('\n').find(l => l.startsWith('VITE_SUPABASE_ANON_KEY')).split('=')[1].trim();

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);


async function createAdmin() {
  console.log("Creating Admin Account...");
  const adminEmail = "admin@school.com";
  const adminPassword = "Password123!";

  const { data, error } = await supabase.auth.signUp({
    email: adminEmail,
    password: adminPassword,
    options: {
      data: {
        name: "Super Admin",
        role: "admin",
      }
    }
  });

  if (error) {
    console.error("Error creating admin:", error.message);
  } else {
    console.log("Admin account successfully created!");
    console.log("-----------------------------------------");
    console.log("Email:    " + adminEmail);
    console.log("Password: " + adminPassword);
    console.log("-----------------------------------------");
  }
}

createAdmin();

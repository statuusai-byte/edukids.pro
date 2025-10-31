import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://eylmcfxdbwqbmfubojty.supabase.co";
const DEFAULT_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bG1jZnhkYndxYm1mdWJvanR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODIxMjAsImV4cCI6MjA3NzE1ODEyMH0.Anf1eXa7FFSYoW-Y1Lj4_9VpmKmxmSDuLBUMZxE3JGw";

const supabaseUrl = `${import.meta.env?.VITE_SUPABASE_URL ?? DEFAULT_URL}`.trim();
const supabaseAnonKey = `${import.meta.env?.VITE_SUPABASE_ANON_KEY ?? DEFAULT_ANON_KEY}`.trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
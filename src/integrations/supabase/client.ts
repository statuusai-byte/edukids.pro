import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client factory
 *
 * Behavior:
 * - In production (import.meta.env.DEV === false): require VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 * - In development only: if those env vars are missing we fall back to the project's dev values
 *   (publishable anon key + project ref). THIS FALLBACK IS ONLY FOR LOCAL DEV / PREVIEW and must
 *   NOT be used in production.
 *
 * NOTE: The anon key is publishable and not a secret; never include service-role keys here.
 */

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const isDev = import.meta.env.DEV === true;

let supabaseUrl = envUrl;
let supabaseAnonKey = envAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  if (isDev) {
    // Development fallback (safe for local dev only)
    // Project ref and anon key come from the configured Supabase project used by this codebase.
    // Keep this branch strictly for DEV so production builds fail loudly when envs are missing.
    console.warn(
      "VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not set — using development fallback values. " +
        "Ensure you set real environment variables for production."
    );

    supabaseUrl = "https://eylmcfxdbwqbmfubojty.supabase.co";
    supabaseAnonKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bG1jZnhkYndxYm1mdWJvanR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODIxMjAsImV4cCI6MjA3NzE1ODEyMH0.Anf1eXa7FFSYoW-Y1Lj4_9VpmKmxmSDuLBUMZxE3JGw";
  } else {
    // Production: fail fast so deployment/platform must supply correct values
    throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in the environment.");
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
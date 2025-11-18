import { createClient } from "@supabase/supabase-js";

/**
 * Safer Supabase client initializer.
 *
 * Behavior:
 * - Prefer VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY when provided.
 * - If missing, warn loudly and fall back to development defaults so the app can still render
 *   (prevents runtime white screen caused by throwing during module import).
 *
 * IMPORTANT: Do not rely on the fallback values in production — set VITE_SUPABASE_URL and
 * VITE_SUPABASE_ANON_KEY in your environment for real deployments.
 */

const env = (import.meta as any).env ?? {};
const envUrl: string | undefined = env.VITE_SUPABASE_URL;
const envAnon: string | undefined = env.VITE_SUPABASE_ANON_KEY;

// Development fallback values (intended for local preview only)
const DEV_FALLBACK_URL = "https://eylmcfxdbwqbmfubojty.supabase.co";
const DEV_FALLBACK_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bG1jZnhkYndxYm1mdWJvanR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODIxMjAsImV4cCI6MjA3NzE1ODEyMH0.Anf1eXa7FFSYoW-Y1Lj4_9VpmKmxmSDuLBUMZxE3JGw";

// Prefer env values; otherwise use fallback (so import-time never throws)
const SUPABASE_URL = envUrl ?? DEV_FALLBACK_URL;
const SUPABASE_ANON_KEY = envAnon ?? DEV_FALLBACK_ANON;

if (!envUrl || !envAnon) {
  // Provide a clear runtime warning (so the developer sees why the app is using fallbacks)
  // eslint-disable-next-line no-console
  console.error(
    "[Supabase] VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY not set. " +
      "The app will use development fallbacks so it can render, but you MUST set these variables in production."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (input, init) => {
      // Aumenta o tempo limite para 20 segundos para evitar timeouts em redes lentas
      const signal = AbortSignal.timeout(20000);
      return fetch(input, { ...init, signal });
    },
  },
});
import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client initializer with safer behavior when VITE env vars are missing.
 *
 * - In production (import.meta.env.PROD) we require VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY and throw a clear error if absent.
 * - In development (import.meta.env.DEV) we provide a fallback URL + anon key to avoid failing the preview/build on systems
 *   where env vars weren't configured. This makes local dev and the preview environment more forgiving.
 *
 * IMPORTANT: Do NOT rely on these fallbacks for production — set the VITE_SUPABASE_* env vars in your environment.
 */

// Read from Vite environment
const env = (import.meta as any).env ?? {};
const envUrl: string | undefined = env.VITE_SUPABASE_URL;
const envAnon: string | undefined = env.VITE_SUPABASE_ANON_KEY;

// Development fallback values (only used when import.meta.env.DEV is true)
const DEV_FALLBACK_URL = "https://eylmcfxdbwqbmfubojty.supabase.co";
const DEV_FALLBACK_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5bG1jZnhkYndxYm1mdWJvanR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1ODIxMjAsImV4cCI6MjA3NzE1ODEyMH0.Anf1eXa7FFSYoW-Y1Lj4_9VpmKmxmSDuLBUMZxE3JGw";

// Decide final values, allowing fallbacks in DEV only
const SUPABASE_URL = envUrl ?? ((import.meta as any).env?.DEV ? DEV_FALLBACK_URL : undefined);
const SUPABASE_ANON_KEY = envAnon ?? ((import.meta as any).env?.DEV ? DEV_FALLBACK_ANON : undefined);

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Provide a clear, actionable error for production environments
  throw new Error(
    "VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY is not defined. " +
      "Set them in your environment before running the app. " +
      "For local development you can define them in a .env file or set them in your environment."
  );
}

if ((import.meta as any).env?.DEV && (!envUrl || !envAnon)) {
  // Warn when using development fallbacks so the developer knows to set proper env vars later
  // eslint-disable-next-line no-console
  console.warn(
    "[Supabase] Using development fallback for SUPABASE URL/ANON KEY because VITE env vars are not set. " +
      "Do not use these fallbacks in production."
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
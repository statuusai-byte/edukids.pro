import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

/**
 * get-avatar-url
 *
 * - Accepts POST requests and optionally an Authorization Bearer token.
 * - If no valid token is provided, the endpoint returns { signedUrl: null } (200).
 * - If token is valid and avatar exists in storage, returns { signedUrl }.
 * - Defensive and tolerant to avoid leaking HTML/404 responses that break image processors.
 */

const DEFAULT_ALLOWED_ORIGIN = "https://edukids-pro.vercel.app";
const ALLOWED_ORIGINS = new Set([
  "https://edukids-pro.vercel.app",
  "https://edukidspro.vercel.app", // permissive fallback for older references
  "http://localhost:5173",
  "http://localhost:3000",
]);

function buildCorsHeaders(origin: string | null) {
  const chosen = origin && ALLOWED_ORIGINS.has(origin) ? origin : DEFAULT_ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": chosen,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = buildCorsHeaders(origin);

  // Preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");

    // If there's no Authorization header, gracefully return { signedUrl: null } (avoid 401).
    // This prevents client-side UI or tooling (PWABuilder / image processors) from receiving HTML/404 or 401 responses.
    if (!authHeader) {
      return new Response(JSON.stringify({ signedUrl: null }), {
        status: 200,
        headers,
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return new Response(JSON.stringify({ signedUrl: null }), {
        status: 200,
        headers,
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Supabase service credentials are not configured.");
      // Return a safe response instead of failing with HTML/stack
      return new Response(JSON.stringify({ signedUrl: null }), { status: 200, headers });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Attempt to verify user by token. If verification fails, we do NOT throw — we return signedUrl: null
    let callerUser: any = null;
    try {
      const { data, error } = await supabaseAdmin.auth.getUser(token);
      if (error || !data?.user) {
        console.warn("get-avatar-url: token verification failed or no user", error);
        return new Response(JSON.stringify({ signedUrl: null }), { status: 200, headers });
      }
      callerUser = data.user;
    } catch (e) {
      console.error("get-avatar-url: unexpected error verifying token", e);
      return new Response(JSON.stringify({ signedUrl: null }), { status: 200, headers });
    }

    // Fetch profile row safely
    let profile: any = null;
    try {
      const { data: profData, error: profileError } = await supabaseAdmin
        .from("profiles")
        .select("avatar_url")
        .eq("id", callerUser.id)
        .single();

      if (profileError) {
        // If no row found, return signedUrl: null (not an error)
        if (profileError?.code === "PGRST116") {
          return new Response(JSON.stringify({ signedUrl: null }), { status: 200, headers });
        }
        console.error("get-avatar-url: failed to fetch profile row", profileError);
        return new Response(JSON.stringify({ signedUrl: null }), { status: 200, headers });
      }

      profile = profData;
    } catch (e) {
      console.error("get-avatar-url: unexpected error fetching profile", e);
      return new Response(JSON.stringify({ signedUrl: null }), { status: 200, headers });
    }

    const avatarPath = profile?.avatar_url;
    if (!avatarPath) {
      return new Response(JSON.stringify({ signedUrl: null }), { status: 200, headers });
    }

    // Create signed URL (defensive)
    try {
      const { data: signedData, error: signedError } = await supabaseAdmin
        .storage
        .from("avatars")
        .createSignedUrl(avatarPath, 3600);

      if (signedError || !signedData?.signedUrl) {
        console.error("get-avatar-url: failed to create signed URL", signedError);
        return new Response(JSON.stringify({ signedUrl: null }), { status: 200, headers });
      }

      return new Response(JSON.stringify({ signedUrl: signedData.signedUrl }), { status: 200, headers });
    } catch (e) {
      console.error("get-avatar-url: unexpected error creating signed URL", e);
      return new Response(JSON.stringify({ signedUrl: null }), { status: 200, headers });
    }
  } catch (error) {
    console.error("get-avatar-url unexpected error:", error);
    // Always return a safe JSON payload so callers/tools won't receive HTML or other unexpected content
    const headersFallback = buildCorsHeaders(null);
    return new Response(JSON.stringify({ signedUrl: null }), { status: 200, headers: headersFallback });
  }
});
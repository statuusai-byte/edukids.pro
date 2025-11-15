import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const allowedOrigin = "https://edukids-pro.vercel.app";
const corsHeaders = {
  "Access-Control-Allow-Origin": allowedOrigin,
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: corsHeaders },
    );
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing Authorization header" }),
        { status: 401, headers: corsHeaders },
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Supabase service credentials are not configured.");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { status: 500, headers: corsHeaders },
      );
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const {
      data: { user: callerUser },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !callerUser) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid token" }),
        { status: 401, headers: corsHeaders },
      );
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("avatar_url")
      .eq("id", callerUser.id)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Failed to fetch profile row:", profileError);
      return new Response(
        JSON.stringify({ error: "Failed to load profile" }),
        { status: 500, headers: corsHeaders },
      );
    }

    const avatarPath = profile?.avatar_url;
    if (!avatarPath) {
      return new Response(
        JSON.stringify({ signedUrl: null }),
        { status: 200, headers: corsHeaders },
      );
    }

    const { data: signedData, error: signedError } = await supabaseAdmin
      .storage
      .from("avatars")
      .createSignedUrl(avatarPath, 3600);

    if (signedError) {
      console.error("Failed to create signed avatar URL:", signedError);
      return new Response(
        JSON.stringify({ error: "Failed to generate signed URL" }),
        { status: 500, headers: corsHeaders },
      );
    }

    return new Response(
      JSON.stringify({ signedUrl: signedData?.signedUrl ?? null }),
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("get-avatar-url unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An internal error occurred." }),
      { status: 500, headers: corsHeaders },
    );
  }
});
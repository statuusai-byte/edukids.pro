import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const allowedOrigin = 'https://edukids-pro.vercel.app';
const corsHeaders = {
  'Access-Control-Allow-Origin': allowedOrigin,
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders })
    }

    // Require Authorization header: caller must be authenticated (the user who completed checkout)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), { 
        status: 401, 
        headers: corsHeaders 
      });
    }
    const callerJwt = authHeader.replace('Bearer ', '');

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500, headers: corsHeaders })
    }

    // Use admin client (service role) for DB updates and to verify the caller identity via the token
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Verify the caller identity using their JWT
    const { data: { user: callerUser }, error: userError } = await supabaseAdmin.auth.getUser(callerJwt);
    if (userError || !callerUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    const body = await req.json().catch(() => ({}));
    const user_id = (body.user_id || '').toString().trim();
    const token = (body.token || '').toString().trim();

    if (!user_id || !token) {
      return new Response(JSON.stringify({ error: 'Missing user_id or token' }), { status: 400, headers: corsHeaders })
    }

    // Ensure the authenticated caller matches the user_id being upgraded (prevents one user from activating someone else)
    if (callerUser.id !== user_id) {
      console.warn(`Caller user id (${callerUser.id}) does not match requested user_id (${user_id})`);
      return new Response(JSON.stringify({ error: 'Forbidden: caller does not match target user' }), { status: 403, headers: corsHeaders });
    }

    // Lookup the persisted token and ensure it belongs to the user and is not expired/used
    const { data: tokenRow, error: tokenErr } = await supabaseAdmin
      .from('premium_tokens')
      .select('*')
      .eq('token', token)
      .single();

    if (tokenErr) {
      console.error("Error fetching token row:", tokenErr);
      return new Response(JSON.stringify({ error: 'Invalid or unknown token' }), { status: 403, headers: corsHeaders });
    }

    if (!tokenRow) {
      return new Response(JSON.stringify({ error: 'Token not found' }), { status: 404, headers: corsHeaders });
    }

    if (tokenRow.user_id !== user_id) {
      console.warn(`Token user mismatch: token.user_id=${tokenRow.user_id} requested user_id=${user_id}`);
      return new Response(JSON.stringify({ error: 'Token does not belong to the specified user' }), { status: 403, headers: corsHeaders });
    }

    if (tokenRow.used) {
      return new Response(JSON.stringify({ error: 'Token has already been used' }), { status: 403, headers: corsHeaders });
    }

    if (tokenRow.expires_at && new Date(tokenRow.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'Token expired' }), { status: 403, headers: corsHeaders });
    }

    // All checks passed: activate premium for the user (service role)
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ is_premium: true, trial_ends_at: null })
      .eq('id', user_id);

    if (updateError) {
      throw updateError;
    }

    // Mark token as used (delete or update). We'll delete to prevent reuse.
    const { error: deleteError } = await supabaseAdmin
      .from('premium_tokens')
      .delete()
      .eq('token', token);

    if (deleteError) {
      console.error('Failed to delete used token:', deleteError);
      // non-fatal: token may be left but profile is upgraded; log and continue
    }

    return new Response(JSON.stringify({ message: 'Premium activated successfully' }), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('activate-premium error:', error);
    return new Response(JSON.stringify({ error: 'An internal error occurred.' }), { status: 500, headers: corsHeaders });
  }
});
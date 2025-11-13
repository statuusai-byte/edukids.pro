import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const allowedOrigin = 'https://edukidspro.vercel.app';
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

    // --- START SECURITY CHECK: Verify caller identity and admin status ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), { 
        status: 401, 
        headers: corsHeaders 
      });
    }
    const token = authHeader.replace('Bearer ', '');

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500, headers: corsHeaders })
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Verify caller identity using the token
    const { data: { user: callerUser }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !callerUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { 
        status: 401, 
        headers: corsHeaders 
      });
    }
    
    // 2. Check if caller is an admin by querying the profiles table
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('is_admin')
      .eq('id', callerUser.id)
      .single();

    if (profileError || !profileData || !profileData.is_admin) {
      console.warn(`Unauthorized attempt to grant premium by user ID: ${callerUser.id}`);
      return new Response(JSON.stringify({ error: 'Forbidden: Caller is not authorized' }), { 
        status: 403, 
        headers: corsHeaders 
      });
    }
    // --- END SECURITY CHECK ---

    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').toString().trim().toLowerCase();
    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email in request body' }), { status: 400, headers: corsHeaders })
    }

    // Use getUserByEmail instead of listUsers
    const { data: userData, error: userLookupError } = await supabaseAdmin.auth.admin.getUserByEmail(email);

    if (userLookupError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: corsHeaders })
    }
    
    const user = userData.user;

    // Upsert into public.profiles to set is_premium = true
    const upsertRes = await supabaseAdmin
      .from('profiles')
      .upsert({ id: user.id, is_premium: true }, { onConflict: 'id', returning: 'minimal' });

    if (upsertRes.error) {
      throw upsertRes.error;
    }

    return new Response(JSON.stringify({ message: 'Premium granted', user_id: user.id }), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('grant-premium error:', error);
    return new Response(JSON.stringify({ error: 'An internal error occurred.' }), { status: 500, headers: corsHeaders });
  }
});
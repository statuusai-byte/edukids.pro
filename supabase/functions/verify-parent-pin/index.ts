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
    // 1. Authenticate the user via JWT
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

    // Use Service Role Key to verify the token and get user ID
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { 
        status: 401, 
        headers: corsHeaders 
      });
    }
    
    const userId = user.id;

    // 2. Get the hash from the request body
    const body = await req.json().catch(() => ({}));
    const { pin_hash } = body;

    if (!pin_hash) {
      return new Response(JSON.stringify({ error: 'Missing pin_hash' }), { status: 400, headers: corsHeaders })
    }

    // 3. Query the database using the Service Role Key (bypassing RLS)
    const { data, error } = await supabaseAdmin
      .from('parents')
      .select('pin_hash')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw error;
    }

    const verified = data?.pin_hash === pin_hash;

    return new Response(JSON.stringify({ verified }), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('verify-parent-pin error:', error);
    return new Response(JSON.stringify({ error: 'An internal error occurred.' }), { status: 500, headers: corsHeaders });
  }
});
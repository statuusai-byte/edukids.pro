import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import bcrypt from "https://esm.sh/bcryptjs@2.4.3"

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

    // Require Authorization header: caller must be authenticated (the parent)
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

    // Use admin client (service role) to verify the caller's identity and read the stored hash
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
    const pin = (body.pin || '').toString();

    if (!pin) {
      return new Response(JSON.stringify({ error: 'Missing pin' }), { status: 400, headers: corsHeaders })
    }

    // Fetch stored bcrypt hash for the user
    const { data: row, error: rowError } = await supabaseAdmin
      .from('parents')
      .select('pin_hash, user_id')
      .eq('user_id', callerUser.id)
      .single();

    if (rowError) {
      // No row or other error: respond false (but do not reveal specifics)
      console.error("Error fetching parent pin row:", rowError);
      return new Response(JSON.stringify({ verified: false }), { status: 200, headers: corsHeaders });
    }

    const storedHash = row?.pin_hash;
    if (!storedHash) {
      return new Response(JSON.stringify({ verified: false }), { status: 200, headers: corsHeaders });
    }

    // Compare using bcryptjs.compareSync (pure JS, bundler-friendly)
    const verified = bcrypt.compareSync(pin, storedHash);

    return new Response(JSON.stringify({ verified }), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('verify-parent-pin error:', error);
    return new Response(JSON.stringify({ error: 'An internal error occurred.' }), { status: 500, headers: corsHeaders });
  }
});
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import * as bcrypt from "https://esm.sh/bcryptjs@2.4.3";

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

    // Require Authorization header: caller must be authenticated
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

    // Use admin client (service role) to verify the caller's identity
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: { user: callerUser }, error: userError } = await supabaseAdmin.auth.getUser(callerJwt);
    if (userError || !callerUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    const body = await req.json().catch(() => ({}));
    const pin = (body.pin || '').toString();

    if (!pin || pin.length < 6) {
      return new Response(JSON.stringify({ error: 'PIN must be provided and be at least 6 characters' }), { status: 400, headers: corsHeaders })
    }

    // Hash using bcryptjs (generate salt + hash)
    let hashed;
    try {
      const salt = bcrypt.genSaltSync(10);
      hashed = bcrypt.hashSync(pin, salt);
    } catch (e) {
      console.error("bcrypt hash failed:", e);
      return new Response(JSON.stringify({ error: 'Failed to hash PIN' }), { status: 500, headers: corsHeaders });
    }

    // Upsert into parents table (service role)
    const { error: upsertError } = await supabaseAdmin
      .from('parents')
      .upsert({ user_id: callerUser.id, pin_hash: hashed, created_at: new Date().toISOString() }, { onConflict: 'user_id' });

    if (upsertError) {
      console.error("Failed to upsert parent pin:", upsertError);
      return new Response(JSON.stringify({ error: 'Failed to save PIN' }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ message: 'PIN stored' }), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('set-parent-pin error:', error);
    return new Response(JSON.stringify({ error: 'An internal error occurred.' }), { status: 500, headers: corsHeaders });
  }
});
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import bcrypt from "https://esm.sh/bcryptjs@2.4.3"

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

    // 1. Authentication and User ID retrieval
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

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: { user: callerUser }, error: userError } = await supabaseAdmin.auth.getUser(callerJwt);
    if (userError || !callerUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), { 
        status: 401, 
        headers: corsHeaders 
      });
    }
    const userId = callerUser.id;

    const body = await req.json().catch(() => ({}));
    const { pin, limit_minutes, block_enabled } = body;

    if (!pin) {
      return new Response(JSON.stringify({ error: 'PIN is required for this action' }), { status: 400, headers: corsHeaders })
    }

    // 2. PIN Verification (using the same logic as verify-parent-pin)
    const { data: row, error: rowError } = await supabaseAdmin
      .from('parents')
      .select('pin_hash')
      .eq('user_id', userId)
      .single();

    if (rowError || !row?.pin_hash) {
      // If no PIN is set, we deny the update for security reasons (or handle as unauthorized)
      return new Response(JSON.stringify({ error: 'Parental PIN not set or verification failed.' }), { status: 403, headers: corsHeaders });
    }

    const verified = bcrypt.compareSync(pin, row.pin_hash);

    if (!verified) {
      return new Response(JSON.stringify({ error: 'Invalid Parental PIN.' }), { status: 403, headers: corsHeaders });
    }

    // 3. Update Profile Settings (using Service Role Key)
    const updatePayload: { 
      screen_time_limit_minutes?: number | null; 
      screen_time_block_enabled?: boolean; 
      updated_at: string;
    } = { updated_at: new Date().toISOString() };

    // Only update fields if they are explicitly provided in the body
    if (limit_minutes !== undefined) {
      updatePayload.screen_time_limit_minutes = limit_minutes;
    }
    if (block_enabled !== undefined) {
      updatePayload.screen_time_block_enabled = block_enabled;
    }

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updatePayload)
      .eq('id', userId);

    if (updateError) {
      console.error("Failed to update screen time settings:", updateError);
      return new Response(JSON.stringify({ error: 'Failed to update settings in database.' }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ message: 'Screen time settings updated successfully' }), { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('update-screen-time error:', error);
    return new Response(JSON.stringify({ error: 'An internal error occurred.' }), { status: 500, headers: corsHeaders });
  }
});
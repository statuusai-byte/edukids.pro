import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
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

    const body = await req.json().catch(() => ({}));
    const email = (body.email || '').toString().trim().toLowerCase();
    if (!email) {
      return new Response(JSON.stringify({ error: 'Missing email in request body' }), { status: 400, headers: corsHeaders })
    }

    // Admin client with service role key
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Server not configured with SUPABASE_URL / SERVICE_ROLE_KEY' }), { status: 500, headers: corsHeaders })
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // List users and find by email (admin endpoint)
    const listRes = await supabaseAdmin.auth.admin.listUsers();
    if (listRes.error) throw listRes.error;

    const users = (listRes.data && (listRes.data as any).users) || [];
    const user = users.find((u: any) => (u.email || '').toLowerCase() === email);

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404, headers: corsHeaders })
    }

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
    return new Response(JSON.stringify({ error: String(error?.message ?? error) }), { status: 500, headers: corsHeaders });
  }
});
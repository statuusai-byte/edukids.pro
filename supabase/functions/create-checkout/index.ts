import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

// SKUs válidos (com hífens)
const ALLOWED_SKUS = new Set([
  "hints-pack-small",
  "hints-pack-medium",
  "hints-pack-large",
  "premium-monthly-v1",
  "edukids-basic-monthly",
]);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // 1) Autenticação: Verificar token e obter user ID
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), { 
        status: 401, 
        headers: corsHeaders 
      });
    }
    const token = authHeader.replace('Bearer ', '');

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Use Service Role Key for secure token verification
    );

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token or user not found' }), { 
        status: 401, 
        headers: corsHeaders 
      });
    }
    
    const userId = user.id; // Securely obtained user ID

    // 2) Recebe e valida SKU (POST)
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
    }

    const body = (await req.json().catch(() => ({}))) as { sku?: string };
    const sku = (body?.sku ?? "").toString().trim();
    if (!sku) {
      return new Response(JSON.stringify({ error: "Missing sku" }), { status: 400, headers: corsHeaders });
    }
    if (!ALLOWED_SKUS.has(sku)) {
      return new Response(
        JSON.stringify({ error: `Invalid sku '${sku}'. Allowed: ${Array.from(ALLOWED_SKUS).join(", ")}` }),
        { status: 400, headers: corsHeaders }
      );
    }

    // 3) Generate a secure, short-lived token (simulated UUID)
    const secureToken = `premium_${crypto.randomUUID()}`;

    // 4) Return the token and user ID for the client to call the secure activation endpoint
    const successPath = `/success-payment?user_id=${userId}&sku=${sku}&token=${secureToken}`;

    return new Response(
      JSON.stringify({ 
        checkout_url: successPath,
        message: "Checkout session created successfully (simulated).",
        sku,
        secure_token: secureToken,
      }),
      { headers: corsHeaders, status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error?.message ?? "Internal error" }), {
      headers: corsHeaders,
      status: 500,
    });
  }
});
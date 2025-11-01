import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// SKUs válidos (com hífens, compatíveis com as regras do Play Console)
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
    // 1) Autenticação (simulada: requer token)
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: corsHeaders 
      });
    }

    // 2) Body opcional com SKU
    let sku = "";
    if (req.method === "POST") {
      const body = await req.json().catch(() => ({}));
      sku = (body?.sku || "").toString().trim();
      if (!sku) {
        return new Response(JSON.stringify({ error: "Missing sku" }), { status: 400, headers: corsHeaders });
      }
      if (!ALLOWED_SKUS.has(sku)) {
        return new Response(JSON.stringify({ error: `Invalid sku '${sku}'. Allowed: ${Array.from(ALLOWED_SKUS).join(", ")}` }), { status: 400, headers: corsHeaders });
      }
    }

    // 3) Simulação de criação de sessão de pagamento
    const base = req.url.split('/functions')[0];
    const successUrl = `${base}/success-payment`;

    return new Response(
      JSON.stringify({ 
        checkout_url: successUrl,
        message: "Checkout session created successfully (simulated).",
        sku,
      }),
      { 
        headers: corsHeaders, 
        status: 200 
      }
    );
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error?.message ?? "Internal error" }), {
      headers: corsHeaders,
      status: 500,
    });
  }
});
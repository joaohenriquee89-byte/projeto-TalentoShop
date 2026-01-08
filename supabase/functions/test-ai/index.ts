import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Robust CORS Headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

serve(async (req) => {
  // 1. Handle Preflight OPTIONS request explicitly
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now();
  let modelUsed = "gpt-4o-mini (simulated)";
  let responseContent = "Esta é uma resposta de teste simulada. Configure a OPENAI_API_KEY para respostas reais.";
  let status = "ok";
  let userId = "unknown";
  let userPlan = "unknown";
  let finalPrompt = "Diga 'Olá, mundo!'";

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error("Missing Authorization Header");

    // Basic check for Gemini key existence in environment
    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    const providerStatus = geminiKey ? "configured" : "missing_key";

    const result = {
      status: "ok",
      provider: "gemini",
      provider_config: providerStatus,
      edge: "online",
      fallback: "enabled",
      latency: `${Date.now() - startTime}ms`
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: "error",
        edge: "online",
        message: "Erro no Health Check",
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }
})

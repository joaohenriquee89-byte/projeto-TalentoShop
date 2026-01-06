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
    // 2. Parse Body safely
    let body = {};
    try {
      const text = await req.text();
      if (text) body = JSON.parse(text);
    } catch (e) {
      // ignore JSON parse error if body is empty
    }
    finalPrompt = (body as any).prompt || finalPrompt;

    // 3. Create Supabase Client safely
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("Missing Authorization Header");
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // 4. Get User
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error("Usuário não autenticado ou inválido");
    }
    userId = user.id;

    // 5. Get Profile/Plan
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    userPlan = profile?.plan || 'FREE';

    // 6. AI Logic
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (openAiKey) {
      modelUsed = "gpt-model-real";
      // Implement actual call if needed, currently keeping mock/logic clean for connectivity test
      // Use the previous logic if key exists
      try {
        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: 'system', content: 'Você é um assistente útil.' },
              { role: 'user', content: finalPrompt }
            ],
            max_tokens: 150
          })
        });
        const aiData = await aiResponse.json();
        if (aiData.error) throw new Error(aiData.error.message);
        modelUsed = aiData.model || "gpt-4o-mini";
        responseContent = aiData.choices?.[0]?.message?.content || "Sem resposta da AI";
      } catch (aiErr: any) {
        status = "erro na ai";
        responseContent = "Falha na OpenAI: " + aiErr.message;
      }
    }

    const endTime = Date.now();
    const result = {
      status,
      modelo_usado: modelUsed,
      tempo_de_resposta: `${endTime - startTime}ms`,
      user_id: userId,
      plano_usuario: userPlan,
      prompt_enviado: finalPrompt,
      resposta_recebida: responseContent
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    const endTime = Date.now();
    return new Response(
      JSON.stringify({
        status: "client_error", // Explicit 'client_error' as requested
        modelo_usado: modelUsed,
        tempo_de_resposta: `${endTime - startTime}ms`,
        user_id: userId, // Return what we managed to capture
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 even on error so frontend can parse JSON easily, or 400 with headers
      }
    )
  }
})

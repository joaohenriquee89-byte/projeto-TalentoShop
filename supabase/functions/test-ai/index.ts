import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now();
  let modelUsed = "gpt-4o-mini (simulated)"; // Default if no key
  let responseContent = "Esta é uma resposta de teste simulada. Configure a OPENAI_API_KEY para respostas reais.";
  let status = "ok";

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 1. Get User
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      throw new Error("Usuário não autenticado")
    }

    // 2. Get Profile/Plan
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    const userPlan = profile?.plan || 'FREE';
    const { prompt } = await req.json();
    const finalPrompt = prompt || "Diga 'Olá, mundo!'";

    // 3. AI Logic (Example with OpenAI)
    const openAiKey = Deno.env.get('OPENAI_API_KEY');

    if (openAiKey) {
      modelUsed = "gpt-4o-mini";
      try {
        const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openAiKey}`
          },
          body: JSON.stringify({
            model: modelUsed,
            messages: [
              { role: 'system', content: 'Você é um assistente útil do TalentoShop.' },
              { role: 'user', content: finalPrompt }
            ],
            max_tokens: 150
          })
        });

        const aiData = await aiResponse.json();
        if (aiData.error) {
          throw new Error(aiData.error.message);
        }
        responseContent = aiData.choices[0].message.content;
      } catch (aiError: any) {
        status = "erro na ai";
        responseContent = "Erro ao contatar OpenAI: " + aiError.message;
      }
    }

    const endTime = Date.now();
    const responseTime = `${endTime - startTime}ms`;

    const result = {
      status: status,
      modelo_usado: modelUsed,
      tempo_de_resposta: responseTime,
      user_id: user.id,
      plano_usuario: userPlan,
      prompt_enviado: finalPrompt,
      resposta_recebida: responseContent
    };

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error: any) {
    const endTime = Date.now();
    return new Response(
      JSON.stringify({
        status: "erro",
        modelo_usado: modelUsed,
        tempo_de_resposta: `${endTime - startTime}ms`,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

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

    // 6. AI Logic (Gemini Integration)
    const geminiKey = Deno.env.get('GEMINI_API_KEY');

    if (geminiKey) {
      modelUsed = "gemini-1.5-flash";

      const callGemini = async (model: string) => {
        const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Você é um assistente útil. Responda curto. User: ${finalPrompt}` }] }]
          })
        });
        return resp;
      };

      try {
        let geminiResponse = await callGemini('gemini-1.5-flash');

        // Fallback strategy and specialized 404 debugging
        if (geminiResponse.status === 404) {
          // Try listing available models to debug
          console.log("Model not found. Listing models...");
          try {
            const listResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`);
            const listData = await listResp.json();
            const modelNames = listData.models?.map((m: any) => m.name) || [];

            // Try one more time with a known available model if found
            const fallbackModel = modelNames.find((n: string) => n.includes('gemini-1.5-flash'))
              || modelNames.find((n: string) => n.includes('gemini-pro'))
              || "";

            if (fallbackModel) {
              // fallbackModel comes as "models/gemini-1.5-flash", we need just the name sometimes or full path
              // The API expects models/{model}:generateContent. The list returns "models/gemini-..."
              // My callGemini appends "models/" prefix? No, I put `models/${model}`.
              // So if list returns "models/flash", I should strip "models/" or just use the suffix.
              const cleanName = fallbackModel.replace('models/', '');
              modelUsed = `${cleanName} (autodetected)`;
              geminiResponse = await callGemini(cleanName);
            } else {
              throw new Error(`Nenhum modelo Gemini compatível encontrado. Disponíveis: ${modelNames.join(', ')}`);
            }
          } catch (listErr: any) {
            // If listing fails, throw original 404
          }
        }

        if (!geminiResponse.ok) {
          const errorText = await geminiResponse.text();
          throw new Error(`Gemini API Error: ${geminiResponse.status} - ${errorText}`);
        }

        const geminiData = await geminiResponse.json();
        const textResult = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (textResult) {
          responseContent = textResult;
        } else {
          responseContent = "Gemini não retornou texto. Debug: " + JSON.stringify(geminiData);
        }

      } catch (aiErr: any) {
        status = "erro na ai";
        responseContent = "Falha no Gemini: " + aiErr.message;
      }
    } else {
      modelUsed = "gemini (simulated - chave ausente)";
      responseContent = "Chave GEMINI_API_KEY não configurada no Supabase Secrets. O teste foi simulado.";
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
        ai_status: "unavailable",
        fallback: true,
        message: "IA temporariamente indisponível",
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }
})

// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";


const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    try {
        // 1. Check Payload
        let body;
        try {
            body = await req.json();
        } catch (e) {
            throw new Error('Falha ao ler corpo da requisição JSON');
        }
        const { plan_name } = body;

        // 2. Auth Check (Restored)
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        );

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

        if (authError || !user) {
            console.error('Auth Error:', authError);
            throw new Error('Usuário não autenticado');
        }

        const userId = user.id;
        const userRole = user.user_metadata?.user_type || 'lojista';
        const dashboardPath = userRole === 'vendedor' ? 'vendedor' : 'lojista';

        console.log(`Received checkout request for ${userRole}:`, userId, { plan_name });

        // 2. Check Secret
        const mpToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
        if (!mpToken) throw new Error('MERCADO_PAGO_ACCESS_TOKEN não configurado no Supabase');

        // 3. Create Preference
        const priceFromBody = body.price;
        const unit_price = Number(parseFloat(String(priceFromBody)).toFixed(2));

        console.log("Preço processado DYNAMIC:", unit_price, "Original:", priceFromBody);

        if (isNaN(unit_price) || unit_price <= 0) {
            throw new Error(`Preço inválido: ${priceFromBody}`);
        }

        const preference = {
            items: [{
                title: `Assinatura ${plan_name}`,
                quantity: 1,
                currency_id: 'BRL',
                unit_price: unit_price
            }],
            payer: { email: user.email },
            auto_return: 'approved',
            back_urls: {
                success: `https://talentoshop.vercel.app/#/dashboard/${dashboardPath}`,
                failure: `https://talentoshop.vercel.app/#/dashboard/${dashboardPath}/plans`,
                pending: `https://talentoshop.vercel.app/#/dashboard/${dashboardPath}/plans`
            },
            notification_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/webhook-mp`,
            external_reference: `${userId}|${plan_name}`
        };

        console.log("Corpo enviado ao MP:", JSON.stringify(preference));

        try {
            const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${mpToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(preference)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Mercado Pago API Error:', data);
                // Extract detailed message if possible
                const errorMessage = data.message || (data.cause && data.cause[0] && data.cause[0].description) || 'Erro ao comunicar com Mercado Pago';
                throw new Error(errorMessage);
            }

            return new Response(JSON.stringify({ url: data.init_point }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        } catch (fetchError: any) {
            throw fetchError; // Re-throw to be caught by outer catch
        }


    } catch (error: any) {
        console.error('Edge Function Error:', error);
        return new Response(JSON.stringify({
            error: error.message || 'Erro desconhecido',
            raw_error: String(error)
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        });
    }
});

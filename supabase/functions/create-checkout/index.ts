// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";


const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    try {
        // 1. Check Payload
        // AUTH REMOVIDO TEMPORARIAMENTE
        let userId = 'USER_NAO_IDENTIFICADO';
        let body;
        try {
            body = await req.json();
        } catch (e) {
            throw new Error('Falha ao ler corpo da requisição JSON');
        }
        const { plan_name, price } = body;
        console.log('Received checkout request:', { plan_name, price, user_id: userId });

        // 2. Check Secret
        const mpToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
        if (!mpToken) throw new Error('MERCADO_PAGO_ACCESS_TOKEN não configurado no Supabase');

        // 3. Create Preference
        const unit_price = parseFloat(String(price).replace(/[^\d.,]/g, '').replace(',', '.'));
        console.log("Preço processado:", unit_price);

        const preference = {
            items: [{
                title: `Assinatura ${plan_name}`,
                quantity: 1,
                currency_id: 'BRL',
                unit_price: unit_price
            }],
            payer: { email: 'test_user_123@testuser.com' },
            auto_return: 'approved',
            back_urls: {
                success: "https://talentoshop.vercel.app/dashboard",
                failure: "https://talentoshop.vercel.app/plans",
                pending: "https://talentoshop.vercel.app/plans"
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

            return new Response(JSON.stringify({ init_point: data.init_point }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            });
        } catch (fetchError: any) {
            throw fetchError; // Re-throw to be caught by outer catch
        }


    } catch (error: any) {
        console.error('Edge Function Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        });
    }
});

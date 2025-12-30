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
        let body;
        try {
            body = await req.json();
        } catch (e) {
            throw new Error('Falha ao ler corpo da requisição JSON');
        }
        const { plan_name } = body;
        console.log('Received checkout request (RESET MODE):', { plan_name });

        // 2. Check Secret
        const mpToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
        if (!mpToken) throw new Error('MERCADO_PAGO_ACCESS_TOKEN não configurado no Supabase');

        // 3. Create Preference
        // 3. Create Preference
        const unit_price = Number(99.90);
        console.log("Preço processado FIXED:", unit_price);

        const preference = {
            items: [{
                title: `Assinatura ${plan_name}`,
                quantity: 1,
                currency_id: 'BRL',
                unit_price: unit_price
            }],
            payer: { email: 'teste@teste.com' },
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

            return new Response(JSON.stringify({ url: data.init_point }), {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
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

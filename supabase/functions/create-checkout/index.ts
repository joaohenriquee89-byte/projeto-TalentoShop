import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    try {
        const { plan_name, price } = await req.json();
        const mpToken = Deno.env.get('MP_ACCESS_TOKEN');

        if (!mpToken) throw new Error('MP_ACCESS_TOKEN não configurado');

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${mpToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                items: [{
                    title: `Assinatura ${plan_name}`,
                    quantity: 1,
                    currency_id: 'BRL',
                    unit_price: Number(price)
                }],
                auto_return: 'approved',
                back_urls: {
                    success: "https://www.google.com",
                    failure: "https://www.google.com"
                }
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Erro no Mercado Pago');

        return new Response(JSON.stringify({ init_point: data.init_point }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
        });
    }
});

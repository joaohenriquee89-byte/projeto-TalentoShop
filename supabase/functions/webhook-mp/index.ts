
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const url = new URL(req.url);

        // 1. Signature Validation
        const signature = req.headers.get('x-signature');
        const requestId = req.headers.get('x-request-id');
        const secret = Deno.env.get('MERCADO_PAGO_WEBHOOK_SECRET');

        if (!signature || !requestId || !secret) {
            console.error("Missing signature, request-id or secret");
            return new Response('Unauthorized', { status: 401 });
        }

        // Parse signature parts
        const parts = signature.split(',');
        let ts;
        let v1;

        parts.forEach(part => {
            const [key, value] = part.split('=');
            if (key === 'ts') ts = value;
            if (key === 'v1') v1 = value;
        });

        if (!ts || !v1) {
            console.error("Invalid signature format");
            return new Response('Unauthorized', { status: 401 });
        }

        // Create manifest string
        const manifest = `id:${data?.id};request-id:${requestId};ts:${ts};`;

        // IMPORTANT: In a real implementation with limited body reading, we strictly need 
        // the id from the body url params for the manifest? 
        // Mercado Pago docs say: "id:[data.id];request-id:[x-request-id];ts:[ts];"

        // Read body to get data.id
        const body = await req.json();
        const { action, data, type } = body;

        // Re-construct logic:
        // The manifest template is: id:[data.id];request-id:[x-request-id];ts:[ts];
        // Wait, if it's a notification, data.id is the ID.

        const manifestString = `id:${data?.id};request-id:${requestId};ts:${ts};`;

        // Compute HMAC
        const key = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );
        const signatureBuffer = await crypto.subtle.sign(
            "HMAC",
            key,
            new TextEncoder().encode(manifestString)
        );

        const hexSignature = Array.from(new Uint8Array(signatureBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        if (hexSignature !== v1) {
            // For testing/debugging, we might log mismatch but still block
            console.error("Signature Mismatch", { expected: v1, computed: hexSignature });
            return new Response('Unauthorized', { status: 401 });
        }


        // 2. Process Payment Confirmation
        if (action !== 'payment.created' && type !== 'payment') {
            return new Response('ok', { headers: corsHeaders });
        }

        const paymentId = data?.id;
        if (!paymentId) return new Response('ok');

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        const mpAccessToken = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN');
        const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: { 'Authorization': `Bearer ${mpAccessToken}` }
        });

        if (!paymentResponse.ok) throw new Error('Failed to fetch payment from MP');

        const paymentData = await paymentResponse.json();

        // 3. Update Database
        if (paymentData.status === 'approved') {
            const externalReference = paymentData.external_reference; // "userId|planName"
            const [userId, planName] = externalReference.split('|');

            console.log(`Processing Approved Payment for User: ${userId}, Plan: ${planName}`);

            if (userId && userId !== 'guest_user') {
                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 30);

                // Update Profiles (User Request)
                const { error: profileError } = await supabaseAdmin.from('profiles').update({
                    plan_type: planName === 'Plano PRO' || planName.includes('Premium') ? 'premium' : 'free',
                    subscription_status: 'active'
                }).eq('id', userId);

                if (profileError) console.error('Error updating profile:', profileError);

                // Update Subscriptions (App Logic)
                // Upsert logic to handle existing or new
                const { data: existingSub } = await supabaseAdmin
                    .from('subscriptions')
                    .select('id')
                    .eq('profile_id', userId)
                    .maybeSingle();

                if (existingSub) {
                    await supabaseAdmin.from('subscriptions').update({
                        plan_name: planName,
                        status: 'active',
                        expires_at: expiresAt.toISOString(),
                        updated_at: new Date()
                    }).eq('id', existingSub.id);
                } else {
                    await supabaseAdmin.from('subscriptions').insert({
                        profile_id: userId,
                        plan_name: planName,
                        status: 'active',
                        started_at: new Date(),
                        expires_at: expiresAt.toISOString()
                    });
                }
            } else {
                console.warn('Skipping DB update for guest_user or missing ID');
            }
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error: any) {
        console.error('Webhook Error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});

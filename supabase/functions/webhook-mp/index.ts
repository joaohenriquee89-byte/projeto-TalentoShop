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
        // MP sends the data in the body or query params depending on the topic.
        // Usually for 'payment', it's in the body or query params 'id' and 'topic'.
        // We'll handle the standard notification format.

        const body = await req.json();
        const { action, data, type } = body;

        if (action !== 'payment.created' && type !== 'payment') {
            // Just return ok for other notifications (like merchant_order)
            return new Response('ok', { headers: corsHeaders });
        }

        const paymentId = data?.id;
        if (!paymentId) {
            return new Response('Missing payment ID', { status: 400, headers: corsHeaders });
        }

        // Initialize Supabase Admin Client
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Initialize MP Fetch to get payment details
        const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN');
        const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: {
                'Authorization': `Bearer ${mpAccessToken}`
            }
        });

        if (!paymentResponse.ok) {
            throw new Error('Failed to fetch payment from MP');
        }

        const paymentData = await paymentResponse.json();

        if (paymentData.status === 'approved') {
            const externalReference = paymentData.external_reference; // "userId|planName"
            const [userId, planName] = externalReference.split('|');

            if (!userId || !planName) {
                console.error('Invalid external_reference', externalReference);
                return new Response('Invalid ref', { status: 400 });
            }

            // Calculate expiration (e.g., 30 days from now)
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);

            // Update Subscription
            const { error: upsertError } = await supabaseAdmin
                .from('subscriptions')
                .upsert({
                    profile_id: userId,
                    plan_name: planName,
                    status: 'active',
                    started_at: new Date().toISOString(),
                    expires_at: expiresAt.toISOString(),
                    // id is auto-generated if likely, but upsert needs a conflict key.
                    // Assuming profile_id is unique for active subscription or we query first.
                    // Re-reading schema: id is PK. profile_id is NOT unique constraint by default but illogical to have multiple active.
                    // Let's use a query to check if one exists first or assume there's a unique constraint on profile_id? 
                    // Currently user didn't specify unique constraint. 
                    // Best practice: Query existing subscription for this user.
                }, { onConflict: 'profile_id' }); // Assuming we add a unique constraint or we query first.

            // To be safe without unique constraint on profile_id (which strictly user didnt say exists), 
            // let's Find existing -> Update OR Insert.

            let { data: existingSub } = await supabaseAdmin
                .from('subscriptions')
                .select('id')
                .eq('profile_id', userId)
                .single();

            if (existingSub) {
                await supabaseAdmin.from('subscriptions').update({
                    plan_name: planName,
                    status: 'active',
                    expires_at: expiresAt,
                    started_at: new Date()
                }).eq('id', existingSub.id);
            } else {
                await supabaseAdmin.from('subscriptions').insert({
                    profile_id: userId,
                    plan_name: planName,
                    status: 'active',
                    started_at: new Date(),
                    expires_at: expiresAt
                });
            }
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});

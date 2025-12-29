import { supabase } from './supabase';

export const createCheckout = async (planName: string, price: number, title: string) => {
    try {
        const { data, error } = await supabase.functions.invoke('create-checkout', {
            body: { plan_name: planName, price, title },
        });

        if (error) {
            console.error('Error invoking create-checkout:', error);
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Unexpected error in createCheckout:', err);
        throw err;
    }
};

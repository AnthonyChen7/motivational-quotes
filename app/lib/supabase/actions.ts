'use server';

import createClient from "./server";

export async function createQuote({userId, quote}: {userId: string, quote: string}) {
    const supabase = await createClient();
    const {data, error} = await supabase.from('quote')
    .upsert([
        {
            user_id: userId,
            quote
        }
    ], {
        onConflict: 'user_id, quote',
        ignoreDuplicates: true
    }).select();
    if (error) {
        console.error('error inserting quote', error);
        return {success: false, error: error.message}
    }
    return {success: true, data}
}

export async function getQuote({userId, quote}: {userId: string, quote: string}) {
    const supabase = await createClient();
    const {data, error} = await supabase.from('quote')
    .select('user_id, quote')
    .eq(userId, quote);
    if (error) {
        console.error('error finding quote', error);
        return {success: false, error: error.message}
    }
    return {success: true, data}
}
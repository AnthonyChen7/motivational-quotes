'use server';

import createClient from "./server";

export async function createQuote({userId, quote}: {userId: string, quote: string}) {
    const supabase = await createClient();
    const {data, error} = await supabase.from('quote')
    .insert([
        {
            user_id: userId,
            quote
        }
    ]);
    if (error) {
        console.error('error inserting quote', error);
        return {success: false, error: error.message}
    }
    return {success: true, data}
}
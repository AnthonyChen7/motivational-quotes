'use server';

import createClient from "./server";
// Note DB will handle uniqueness in schema
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

// https://makerkit.dev/blog/tutorials/pagination-supabase-react
export async function getQuotes({userId, offset = 0, take = 5}: {userId: string, offset?: number, take?: number}) {
    const supabase = await createClient();
    const startOffset = offset * take;
    const endOffset = startOffset + take;
    const {data, count, error} = await supabase.from('quote').select(
        'created_at, quote', { count: 'estimated' }
    )
    // TODO create column to sort
    .order('created_at', {ascending: true})
    // inclusive for both start and end. so subtract 1 to make it more accurate
    .range(startOffset, endOffset - 1)
    .eq('user_id', userId);
    if (error) {
        console.error('error getting quotes', error);
        return {success: false, error: error.message}
    }
    const totalPages = Math.floor( (count || 0) / take);
    return {success: true, data, count , totalPages}
}

// export async function deleteQuote({userId, quote}) {

// }
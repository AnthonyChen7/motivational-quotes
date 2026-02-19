import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import 'server-only';

function getSupabaseEnv() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
        throw new Error(
            "Missing Supabase env: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment (e.g. Vercel project settings)."
        );
    }
    return { url, key };
}

export default async function createClient() {
    const cookieStore = await cookies();
    const { url, key } = getSupabaseEnv();

    return createServerClient(
        url,
        key,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        cookieStore.set(name, value, options)
                    );
                },
            },
        }
    );
}
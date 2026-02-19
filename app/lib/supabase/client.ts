// https://engineering.teknasyon.com/next-js-with-supabase-google-login-step-by-step-guide-088ef06e0501

import { createBrowserClient } from "@supabase/ssr";
import "client-only";

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

export default function createClient() {
    const { url, key } = getSupabaseEnv();
    return createBrowserClient(url, key);
}
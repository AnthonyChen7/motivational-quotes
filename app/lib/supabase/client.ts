// https://engineering.teknasyon.com/next-js-with-supabase-google-login-step-by-step-guide-088ef06e0501

import { createBrowserClient } from "@supabase/ssr";
import "client-only"

export default function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASESUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASESUPABASE_ANON_KEY!
    );
}
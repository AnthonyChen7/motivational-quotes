
import createClient from "@/app/lib/supabase/server";
import { NextResponse } from "next/server";

// manage OAuth callback
/**
 * converts oauth code from google to supabase session
 * uses next param for redirect
 * @param request 
 * @returns 
 */
export async function GET(request: Request) {
    const {searchParams, origin} = new URL(request.url);

    // extract auth code and optional redirect path
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/';
    
    if (code) {
        const supabase = await createClient();

        // exchange auth code for a session
        const {error} = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // success. redirect to intended path (if exists)
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // redirect to error page if code is missing or exchange fails
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
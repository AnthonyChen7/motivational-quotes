import { LOGIN_PATH } from "@/app/constants/common";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
/**
 * this runs before HTTP requests completed
 * so it makes it good for authentication
 * @param request 
 */
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

export default async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({request});

    const { url, key } = getSupabaseEnv();

    // initialize supabase server client with custom cookie handling
    const supabase = createServerClient(
        url,
        key,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );

                    // rec-reate the response with the updated cookies
                    supabaseResponse = NextResponse.next({request});

                    cookiesToSet.forEach(({ name, value }) =>
                        supabaseResponse.cookies.set(name, value)
                    );
                },
            },
        }
    );

    // fetch current authenticated user
    const {
        data: { user }
    } = await supabase.auth.getUser();

    const path = request.nextUrl.pathname;

    // redirect unauthenticated users to login, except for auth routes
    if (!user && !path.startsWith(LOGIN_PATH) && !path.startsWith('/auth')) {
        const url = request.nextUrl.clone();
        url.pathname = LOGIN_PATH;
        url.searchParams.set('next', path);
        return NextResponse.redirect(url);
    }

    // prevent authenticated users from accessing login pate
    if (user && path.startsWith(LOGIN_PATH)) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}
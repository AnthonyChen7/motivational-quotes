import { NextRequest } from "next/server";
import updateSession from "./lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

/**
 * allows middleware to run only on specific routes
 * reduces unnecessary processing load and improve performance
 */
export const config = {
    matcher: ['/profile', '/login']
};
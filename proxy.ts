import { NextRequest } from "next/server";
import updateSession from "./app/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
    return await updateSession(request);
}

/**
 * allows middleware to run only on specific routes
 * reduces unnecessary processing load and improve performance
 */
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/quotes",
      ],
};
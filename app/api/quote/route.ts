import { NextResponse } from "next/server";

/**
 * Do it like this so that its ran through a proxy server to avoid CORS issue
 * @param req 
 */
export async function GET(req: Request) {
    const response = await fetch('https://zenquotes.io/api/random');
    const json = await response.json();
    const quote = json?.[0]?.q;
    return NextResponse.json({ quote: quote }, { status: 200 })
}
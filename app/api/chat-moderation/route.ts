import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { input } = await request.json();

  try {
    let moderationResponse;
        moderationResponse = await openai.moderations.create({
            model: "omni-moderation-2024-09-26",
            input: input,
        });
   

    // @ts-ignore
    const moderationResult = moderationResponse.results[0];
    if (moderationResult.flagged) {
      // Content is harmful, return a response indicating this
      return NextResponse.json({
        flagged: true,
        categories: moderationResult.categories,
      }, { status: 400 });
    } else {
      // Content is safe
      return NextResponse.json({ flagged: false });
    }
  } catch (error) {
    console.error('Moderation API error:', error);
    // @ts-ignore
    if (error.error) {
        // @ts-ignore
        console.log(error.error);
    }
    return NextResponse.json({ error: 'Failed to moderate content' }, { status: 500 });
  }
}
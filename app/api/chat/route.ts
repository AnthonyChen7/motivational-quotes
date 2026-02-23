import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import ModerationApi from '@moderation-api/sdk';
import { z } from 'zod';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Uses the key from .env.local
});

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "openai/gpt-5.2-chat",
    messages: await convertToModelMessages(messages),
    system: `You are a motivating, inspiring, and concise assistant.
          The prompt should have how the user is feeling.
          Always provide one short, impactful, and unique motivational quote based on the prompt.
          Please ensure that the quote is prefixed with the following: 'Quote:' <Quote goes here>
          If the prompt does not contain any emotional feeling, please do not generate a motivational quote.
          You must refuse to generate harmful, explicit, or unlawful content.`,
  });

  return result.toUIMessageStreamResponse();
}



// https://ai-sdk.dev/docs/getting-started/nextjs-app-router
// https://platform.openai.com/docs/guides/moderation?lang=node.js


// https://github.com/vercel/ai/issues/2555
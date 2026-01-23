import { streamText, UIMessage, convertToModelMessages, tool } from 'ai';
import ModerationApi from '@moderation-api/sdk';
import { z } from 'zod';

export async function POST(req: Request) {

  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({

    model: "openai/gpt-5.2-chat",

    messages: await convertToModelMessages(messages),

    // TODO handle super bad negative input feelings such as muderous feelings/

    system: `You are a motivating, inspiring, and concise assistant.
              The prompt should have how the user is feeling.
              Always provide one short, impactful, and unique motivational quote based on the prompt.
              If the prompt does not contain any emotional feeling, please do not generate a motivational quote.`,
  //  tools: {
  //   moderationCheck: tool({
  //       description: 'Checks if the message from the user to the AI bot contain inappropriate words',
  //       inputSchema: z.object({
  //         content: z.string().describe('The content to send to the AI'),
  //       }),
  //       execute: async ({ content }) => {
  //         console.log('in here', content);
  //         const response = await fetch('https://api.openai.com/v1/moderations', {
  //           method: 'POST',
            
  //           headers: {
  //             "Content-Type": "application/json",
  //             'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  //           },
  //           body: JSON.stringify({
  //             "model": "omni-moderation-latest",
  //             "input": "...text to classify goes here..."
  //           })
  //         });

  //         console.log(await response.json());
  //         return {
  //           flagged: true,
  //           reason: 'Detected harmful content based on internal rules.'
  //         };
  //       },
  //   })
  //  },
  //  toolChoice: {"type": "tool", "toolName": 'moderationCheck'}
  });

  return result.toUIMessageStreamResponse();

}

const shouldBlockContent = async ({ content }: {content: string}) => {
  const moderationApi = new ModerationApi({
  secretKey: process.env.MODAPI_SECRET_KEY,
});
  const result = await moderationApi.content.submit({
  content: { type: 'text', text: content },
});
  console.log(result);
  // Block the content if flagged
  return result.evaluation.flagged;
};

// https://ai-sdk.dev/docs/getting-started/nextjs-app-router
// https://platform.openai.com/docs/guides/moderation?lang=node.js


// https://github.com/vercel/ai/issues/2555
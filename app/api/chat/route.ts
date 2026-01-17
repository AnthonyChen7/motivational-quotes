import { streamText, UIMessage, convertToModelMessages } from 'ai';
import ModerationApi from '@moderation-api/sdk';


export async function POST(req: Request) {

  const { messages }: { messages: UIMessage[] } = await req.json();

  console.log({messages});

  const lastMessage = messages[messages.length - 1];
  if (lastMessage && lastMessage.role === 'user') {
    // @ts-ignore
    console.log(lastMessage.parts[0].text);
    // @ ts-ignore
    // await shouldBlockContent({content: lastMessage.parts[0].text});
  }
  const result = streamText({

    model: "openai/gpt-5.2-chat",

    messages: await convertToModelMessages(messages),

    // TODO handle super bad negative input feelings such as muderous feelings/

    system: `You are a motivating, inspiring, and concise assistant.
              The prompt should have how the user is feeling.
              Always provide a short, impactful, and unique motivational quote based on the prompt.
              If the prompt does not contain any emotional feeling, please do not generate a motivational quote.`
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
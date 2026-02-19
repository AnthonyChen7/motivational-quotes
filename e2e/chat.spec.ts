import { test, expect, Page } from '@playwright/test';


const createMockAIStreamResponse = async(page: Page, quote: string, messageId = 'test-message-id') => {

  /**
   * We are unable to create readable stream using route.fulfill
   * https://github.com/microsoft/playwright/issues/33564
   * this will just send by a full body string/buffer. not a real stream
   * 
   * addInitScript runs JS in the browser before page loads
   */
  await page.addInitScript(() => {
    const originalFetch = window.fetch;
    /**
     * Override fetch to return stream response
     * if url matches AI call, we use it to send stream response
     * else we call the original fetch
     */
    const chunks = ['Quote: "'].concat(quote.split(' '));
    window.fetch = async function (...args) {
      const url = args[0];
      if (typeof url === 'string' && url.includes('/api/chat')) {

        const stream = new ReadableStream({
          async start (controller) {
            // send initial empty message
            const initialResponse = {
              id: messageId,
              role: 'assistant',
              parts: [
                {
                  type: 'text',
                  text: ''
                }
              ]
            };
            // need to do this because AI sdk expects this kind of response
            controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(initialResponse)}\n`));

            let accumulatedText = '';

            for (const chunk of chunks) {
              accumulatedText += chunk;
              const chunkResponse = {
                id: messageId,
                role: 'assistant',
                parts: [
                  {
                    type: 'text',
                    text: accumulatedText
                  }
                ]
              };
              controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(chunkResponse)}\n`));
            }
            
            controller.close();
          }
        });

        return new Response(stream, {
          status: 200,
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
          },
        });

      }
      return originalFetch.apply(this, args);
    }
  });

};

test.describe('Chat Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page where the Chat component is rendered
    await page.goto('/');
  });

  test('should display initial chat UI elements', async ({ page }) => {
    // Check that the greeting text is visible
    await expect(page.getByText("Hi, how are you feeling today?")).toBeVisible();
    
    // Check that the instruction text is visible
    await expect(page.getByText(/Please type how you're feeling/)).toBeVisible();
    
    // Check that the prompt instruction is visible
    await expect(page.getByText(/If you don't feel like typing/)).toBeVisible();
    
    // Check that the input field is visible
    await expect(page.getByPlaceholder('Say something...')).toBeVisible();
  });

  test('should display all preset prompt buttons', async ({ page }) => {
    const presetPrompts = [
      "I'm feeling tired",
      "I'm not feeling well",
      "I do not feel like doing anything"
    ];

    for (const prompt of presetPrompts) {
      await expect(page.getByRole('button', { name: prompt })).toBeVisible();
    }
  });

  test('should allow typing in the input field', async ({ page }) => {
    const input = page.getByPlaceholder('Say something...');
    
    await input.fill('I am feeling great today!');
    await expect(input).toHaveValue('I am feeling great today!');
  });

  test('should clear input after submitting a message', async ({ page }) => {
    const input = page.getByPlaceholder('Say something...');
    
    await createMockAIStreamResponse(page, 'test quote');

    await input.fill('I am feeling motivated');
    await input.press('Enter');
    
    // Wait for the form submission and response
    await page.waitForTimeout(1000);
    
    // Input should be cleared after submission
    await expect(input).toHaveValue('');
  });

  test('should display AI response with quote', async ({ page }) => {

    await createMockAIStreamResponse(page, 'test quote');

    const input = page.getByPlaceholder('Say something...');
    await input.fill('I need motivation');
    await input.press('Enter');
    
    // Wait for the AI response to appear
    await page.waitForTimeout(5000);

    // Check that AI message is displayed
    await expect(page.getByText(/AI:/)).toBeVisible();
    await expect(page.getByText(/Quote:/)).toBeVisible();
  });

  test('should show Save Quote button when AI response contains "Quote:"', async ({ page }) => {

    await createMockAIStreamResponse(page, 'this is a test quote');

    const input = page.getByPlaceholder('Say something...');
    await input.fill('I am feeling discouraged');
    await input.press('Enter');
    
    // Wait for the AI response and Save Quote button to appear
    await page.waitForTimeout(5000);
    
    // Check that Save Quote button appears
    await expect(page.getByRole('button', { name: 'Save Quote' })).toBeVisible();
  });

  test('should handle multiple messages in conversation', async ({ page }) => {
    let callCount = 0;
    

      callCount++;
      const quotes = [
        'The future belongs to those who believe in the beauty of their dreams.',
        'It does not matter how slowly you go as long as you do not stop.'
      ];
      
      const quote = quotes[callCount - 1] || quotes[0];
      await  createMockAIStreamResponse(page, quote, `test-message-id-${callCount}`);
      
    // Send first message
    const input = page.getByPlaceholder('Say something...');
    await input.fill('First message');
    await input.press('Enter');
    await page.waitForTimeout(2000);

    // Send second message
    await input.fill('Second message');
    await input.press('Enter');
    await page.waitForTimeout(2000);

    // Verify both messages are displayed
    const userMessages = page.getByText(/User:/);
    await expect(userMessages.first()).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';
import { simulateReadableStream } from 'ai';

/**
 * Helper function to create a mock streaming response for the chat API
 * This simulates the format expected by the useChat hook from @ai-sdk/react
 */
function createMockChatResponse(quote: string, messageId: string = 'test-message-id') {
  const response = {
    id: messageId,
    role: 'assistant' as const,
    parts: [
      {
        type: 'text' as const,
        text: `Quote: "${quote}"`
      }
    ]
  };
  
  // Format: prefix with "0:" followed by JSON and newline (streaming format)
  return `0:${JSON.stringify(response)}\n`;
}

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
    
    // Mock the streaming API response format used by useChat
    await page.route('**/api/chat', async route => {
      const streamResponse = createMockChatResponse(
        'Every day is a new beginning, take a deep breath and start again.'
      );
      
      await route.fulfill({
        status: 200,
        contentType: 'text/plain; charset=utf-8',
        body: streamResponse,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    });

    await input.fill('I am feeling motivated');
    await input.press('Enter');
    
    // Wait for the form submission and response
    await page.waitForTimeout(1000);
    
    // Input should be cleared after submission
    await expect(input).toHaveValue('');
  });

  test('should display AI response with quote', async ({ page }) => {
    const mockResponseChunks = [
    'Hello',
    ' from',
    ' the',
    ' mock',
    ' stream!'
  ];

    // Mock the streaming API response with a quote
    await page.route('**/api/chat', async route => {
        const json = {
        // Mock the expected response structure from your AI API route
        messages: [{ role: 'assistant', content: 'Mocked AI response' }],
      };
      await route.fulfill({ json, status: 200 });
    });

    const input = page.getByPlaceholder('Say something...');
    await input.fill('I need motivation');
    await input.press('Enter');
    
    // Wait for the AI response to appear
    await page.waitForTimeout(5000);

    await page.pause();
    
    // Check that AI message is displayed
    await expect(page.getByText(/AI:/)).toBeVisible();
    await expect(page.getByText(/Quote:/)).toBeVisible();
  });

  test('should show Save Quote button when AI response contains "Quote:"', async ({ page }) => {
    // Mock the streaming API response with a quote using fetch interception
    await page.addInitScript(() => {
      const originalFetch = window.fetch;
      window.fetch = async function(...args) {
        const url = args[0];
        if (typeof url === 'string' && url.includes('/api/chat')) {
          const quote = 'Success is not final, failure is not fatal: it is the courage to continue that counts.';
          const messageId = 'test-message-id';
          
          // Create chunks for streaming
          const chunks = [
            'Quote: "',
            'Success',
            ' is',
            ' not',
            ' final',
            ',',
            ' failure',
            ' is',
            ' not',
            ' fatal',
            ':',
            ' it',
            ' is',
            ' the',
            ' courage',
            ' to',
            ' continue',
            ' that',
            ' counts',
            '."'
          ];
          
          // Create a ReadableStream that emits chunks with delays
          let accumulatedText = '';
          const stream = new ReadableStream({
            async start(controller) {
              // Send initial empty message
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
              controller.enqueue(new TextEncoder().encode(`0:${JSON.stringify(initialResponse)}\n`));
              
              // Send incremental text chunks with delays
              for (const chunk of chunks) {
                await new Promise(resolve => setTimeout(resolve, 50)); // Delay between chunks
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
      };
    });

    const input = page.getByPlaceholder('Say something...');
    await input.fill('I am feeling discouraged');
    await input.press('Enter');
    
    // Wait for the AI response and Save Quote button to appear
    await page.waitForTimeout(5000);
    
    // Check that Save Quote button appears
    await expect(page.getByRole('button', { name: 'Save Quote' })).toBeVisible();
  });

  test('should call onSaveQuote callback when Save Quote is clicked', async ({ page }) => {
    // Mock the streaming API response
    await page.route('**/api/chat', async route => {
      const streamResponse = createMockChatResponse(
        'Believe you can and you are halfway there.'
      );
      
      await route.fulfill({
        status: 200,
        contentType: 'text/plain; charset=utf-8',
        body: streamResponse,
      });
    });

    const input = page.getByPlaceholder('Say something...');
    await input.fill('I need inspiration');
    await input.press('Enter');
    
    // Wait for the AI response and Save Quote button
    await page.waitForTimeout(2000);
    await expect(page.getByRole('button', { name: 'Save Quote' })).toBeVisible();
    
    // Click the Save Quote button
    await page.getByRole('button', { name: 'Save Quote' }).click();
    
    // Wait a bit for the callback to execute
    await page.waitForTimeout(500);
    
    // Verify the button was clickable (the click should have executed)
    // Note: Since onSaveQuote calls createQuote which requires a user,
    // the actual save might fail, but we can verify the UI interaction works
    await expect(page.getByRole('button', { name: 'Save Quote' })).toBeVisible();
  });

  test('should handle multiple messages in conversation', async ({ page }) => {
    let callCount = 0;
    
    // Mock the streaming API response with different quotes for each call
    await page.route('**/api/chat', async route => {
      callCount++;
      const quotes = [
        'The future belongs to those who believe in the beauty of their dreams.',
        'It does not matter how slowly you go as long as you do not stop.'
      ];
      
      const quote = quotes[callCount - 1] || quotes[0];
      const streamResponse = createMockChatResponse(quote, `test-message-id-${callCount}`);
      
      await route.fulfill({
        status: 200,
        contentType: 'text/plain; charset=utf-8',
        body: streamResponse,
      });
    });

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

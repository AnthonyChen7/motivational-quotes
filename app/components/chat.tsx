'use client';

import { useChat } from "@ai-sdk/react";
import React from "react";
import { useState } from "react";

const presetPrompts = [
  "I'm feeling tired",
  "I'm not feeling well",
  "I do not feel like doing anything"
];

export default function Chat({onSaveQuote}: {onSaveQuote: (quote: string) => void}) {
    const [input, setInput] = useState('');
    const { messages, sendMessage } = useChat();

    return <>
    <div>
      Hi, how are you feeling today?
    </div>
    <div>
      Please type how you&quot;re feeling in the input box and I can generate a motivational quote based on your mood.
    </div>
    <div>
      If you don&quot;t feel like typing, please click on the prompt to auto-generate a quote.
    </div>
    <div style={{display: 'flex', flexDirection: 'column'}}>
      {
        presetPrompts.map((prompt, index) => <button key={index} onClick={() => sendMessage({ text: prompt })}>{prompt}</button>)
      }
    </div>
    <div>
        {messages.map((message) => {
            return (<div key={message.id}>
                {message.role === 'user' ? 'User: ' : 'AI: '}
                {message.parts.map((part, i) => {
                    switch (part.type) {
                    case 'text':
                        return <React.Fragment key={`${message.id}-${i}`}>
                          <div>{part.text}</div>
                          {message.role === 'assistant' && part.text.indexOf('Quote:') > -1 && <button onClick={() => {
                            const parts = part.text.split('Quote:');
                            // removes extra quotation marks from the string
                            const quote = parts[1].trim().replace(/["']/g, '');
                            onSaveQuote?.(quote);
                          }}>Save Quote</button>}
                        </React.Fragment>;
                    case 'tool-moderationCheck':
                      return <div key={`${message.id}-${i}`}>blah</div>;
                    }
                })}
            </div>);
        })}
    </div>
    
    <form
        onSubmit={async e => {
          e.preventDefault();

          // const response = await fetch('/api/chat-moderation', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({ input: input }),
          // });

          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </>;
};
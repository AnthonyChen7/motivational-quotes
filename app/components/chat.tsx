'use client';

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

const presetPrompts = [
  "I'm feeling tired",
  "I'm not feeling well",
  "I do not feel like doing anything"
];

export default function Chat() {
    const [input, setInput] = useState('');
    const { messages, sendMessage } = useChat();

    return <>
    <div>
      Hi, how are you feeling today?
    </div>
    <div>
      Please type how you're feeling in the input box and I can generate a motivational quote based on your mood.
    </div>
    <div>
      If you don't feel like typing, please click on the prompt to auto-generate a quote.
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
                        return <div key={`${message.id}-${i}`}>{part.text}</div>;
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
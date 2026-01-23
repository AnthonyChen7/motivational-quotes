'use client';

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Chat() {
    const [input, setInput] = useState('');
    const { messages, sendMessage } = useChat();

    return <>

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
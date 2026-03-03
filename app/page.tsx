"use client"; // This is a client component 👈🏽

import { Suspense, useState } from "react";
import Chat from "./components/chat";
import useUser from "./hooks/useUser";
import { createQuote } from "./lib/supabase/actions";
import { RandomQuote } from "./components/random-quote";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

export default function Home() {

  const {user, error, loading, signOut, loginWithGoogle} = useUser();

  const router = useRouter()

  const onSaveQuote = async (userId: string | null | undefined ,quote: string) => {
    if (userId) {
      await createQuote({userId: userId, quote: quote});
    } else {
      // TODO throw error
    }
  };

  return (
    <Suspense>
        <Button onClick={() => loginWithGoogle({redirectUrl: `${window.location.host}`})}>Log in with Google</Button>
        <Button onClick={async () => { 
          await signOut();
        }}>Sign Out</Button>
        <Button onClick={() => {
          router.push('/quotes');
        }}>See Saved Quotes</Button>
        <div>user: {user ? `${user.id}` : 'null'}</div>
        <RandomQuote onSave={async(quote) => {
          await onSaveQuote(user?.id, quote);
        }} />
        <Chat onSaveQuote={async(quote) => {
          await onSaveQuote(user?.id, quote);
        }} />
    </Suspense>
    
  );
}

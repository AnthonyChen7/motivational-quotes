"use client"; // This is a client component 👈🏽

import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import Chat from "./components/chat";
import useUser from "./hooks/useUser";
import createClient from "./lib/supabase/client";
import { createQuote } from "./lib/supabase/actions";
import { useQuote } from "./hooks/useQuote";
import { RandomQuote } from "./components/random-quote";
import { Button, Theme } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

export default function Home() {
  const [textValue, setTextValue] = useState<string>('');
  const {user, error, loading, signOut} = useUser();

  const router = useRouter()
  
  const supabase = createClient();


  const loginWithGoogle = async () => {
    try {

      const {error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        throw error;
      }

    } catch (e) {
      console.error('error logging in with google', e);
    }
  };

  const onSaveQuote = async (userId: string | null | undefined ,quote: string) => {
    if (userId) {
      await createQuote({userId: userId, quote: quote});
    } else {
      // TODO throw error
    }
  };

  return (
    <Suspense>
      <Theme>
        hello world
        <Button onClick={() => loginWithGoogle()}>Log in with Google</Button>
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

      </Theme>

    </Suspense>
    
  );
}

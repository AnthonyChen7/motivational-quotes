import { AuthError, Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import createClient from "../lib/supabase/client";

export default function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);

    const [loading, setLoading] = useState<boolean>(true);

    const [error, setError] = useState<AuthError | null>(null);

    const supabase = createClient();

    useEffect(() => {
        async function fetchUser () {
            try {
                const {
                    data: {session},
                    error
                } = await supabase.auth.getSession();

                if (error) {
                    throw error;
                }

                if (session) {
                    setSession(session);
                    setUser(session.user);
                }

            } catch (e) {
                setError(e as AuthError);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [supabase]);

    const signOut = async() => {
        const {error} = await supabase.auth.signOut();
        if (error) {
            setError(error);
        } else {
            console.log(await supabase.auth.getSession());
            setSession(null);
            setUser(null);
        }
       
        
    };

    return {
        loading,
        user,
        session,
        error,
        signOut
    };
}
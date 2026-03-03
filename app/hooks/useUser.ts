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

    const loginWithGoogle = async ({redirectUrl = '/'}: {redirectUrl: string}) => {
        try {

            const {error} = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl
                }
            });

            if (error) {
                throw error;
            }

        } catch (e) {
        console.error('error logging in with google', e);
        }
    };

    const signOut = async() => {
        const {error} = await supabase.auth.signOut();
        if (error) {
            setError(error);
        } else {
            setSession(null);
            setUser(null);
        }
       
        
    };

    return {
        loading,
        user,
        session,
        error,
        signOut,
        loginWithGoogle
    };
}
'use client';

import { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { getQuotes } from "../lib/supabase/actions";
import { Button } from "@radix-ui/themes";
import { QuoteData, QuoteTable } from "../components/quote-table";



export default function Page () {
    const [tableData, setTableData] = useState<QuoteData[]>([]);
    // TODO be able to store the user's state
    const {user, loginWithGoogle, signOut} = useUser();
    useEffect(() => {
        if (user) {
            getQuotes({
                userId: user.id,
                offset: 0,
                take: 2
            }).then((data) => {
                if (data.success && data.data) {
                    setTableData(data.data);
                } else {
                    setTableData([]);
                }
            }).catch((e) => {
                console.error(e);
                setTableData([]);
            });
        }
    }, [user]);

    return <>
        <Button onClick={() => loginWithGoogle({redirectUrl: 'http://localhost:3000/quotes'})}>Log in with Google</Button>
        <Button onClick={async () => { 
          await signOut();
        }}>Sign Out</Button>
        <QuoteTable data={tableData} offset={0} pageSize={3} />
    </>
}
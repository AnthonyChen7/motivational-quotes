'use client';

import { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { getQuotes } from "../lib/supabase/actions";
import { Button } from "@radix-ui/themes";
import { QuoteData, QuoteTable } from "../components/quote-table";



export default function Page () {
    const [tableData, setTableData] = useState<QuoteData[]>([]);
    const {user, signOut} = useUser();
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
        <Button onClick={() => signOut()}>Sign Out</Button>
        <div>{user?.id}</div>
        <QuoteTable data={tableData} offset={0} pageSize={3} />
    </>
}
'use client';

import { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { getQuotes } from "../lib/supabase/actions";
import { Button } from "@radix-ui/themes";
import { QuoteData, QuoteTable } from "../components/quote-table";
import { Paginator } from "../components/paginator";

const pageSize = 2;
/**
 * TODO set up loading state
 */
export default function Page () {
    const [tableData, setTableData] = useState<QuoteData[]>([]);
    const {user, signOut} = useUser();
    const [offset, setOffset] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    useEffect(() => {
        if (user) {
            getQuotes({
                userId: user.id,
                offset: offset,
                take: pageSize
            }).then(({data, success, error, count, totalPages}) => {
                console.log(data, count, totalPages);
                if (success && data) {
                    setTableData(data);
                    setTotalPages(totalPages);
                } else {
                    console.error(error);
                    setTableData([]);
                    setOffset(0);
                    setTotalPages(1);
                }
            }).catch((e) => {
                console.error(e);
                setTableData([]);
                setOffset(0);
                setTotalPages(1);
            });
        }
    }, [user, offset]);
    return <>
        <Button onClick={() => signOut()}>Sign Out</Button>
        <div>{user?.id}</div>
        <QuoteTable data={tableData} />
        <Paginator
            offset={offset}
            totalPages={totalPages}
            goToFirstPage={() => setOffset(0)}
            goToLastPage={() => setOffset(totalPages - 1)}
            next={() => setOffset( (offset + 1) % totalPages )}
            prev={() => setOffset( offset - 1 < 0 ? totalPages - 1 : offset - 1 )}
        />
    </>
}
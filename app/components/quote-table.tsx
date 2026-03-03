'use client';

export interface QuoteData {
    quote: string;
    created_at: string;
}

export function QuoteTable({data, offset = 0, pageSize = 5}: {data: QuoteData[], offset: number, pageSize: number}) {

    return <div>
        {data ? <>success</> : <>No data to display</>}
    </div>
}
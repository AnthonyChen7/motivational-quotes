'use client';

import { Table } from "@radix-ui/themes";

export interface QuoteData {
    quote: string;
    created_at: string;
}

export function QuoteTable({data, offset = 0, pageSize = 5}: {data: QuoteData[], offset: number, pageSize: number}) {

    return <div>
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Date Created</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Quote</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {data && data.map(({quote, created_at}, index) => {
                    return <Table.Row key={index}>
                        <Table.Cell>{created_at}</Table.Cell>
                        <Table.Cell>{quote}</Table.Cell>
                    </Table.Row>;
                })}
            </Table.Body>

        </Table.Root>
    </div>
}
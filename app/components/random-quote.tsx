import { useState } from "react";
import { useQuote } from "../hooks/useQuote";

export const RandomQuote = ({onSave}: {onSave: (quote: string) => void}) => {

    const { generateRandomQuote } = useQuote();

    const [quote, setQuote] = useState<string | null>(null);

    return <>
        <button onClick={async() => {
            try {
                const randomQuote = await generateRandomQuote();
                setQuote(randomQuote);
            } catch (e) {
                setQuote(null);
            }
        }}>Generate Random Quote</button>
        {quote && <div>
                <p>{quote}</p>
                <button onClick={() => onSave?.(quote)}>Save Quote</button>
            </div>}
    </>
};
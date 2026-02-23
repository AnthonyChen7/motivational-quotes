export const useQuote = () => {
    const generateRandomQuote = async() => {
        try {
            const response = await fetch('/api/quote');
            const json = await response.json();
            const quote = json?.quote;
            console.log({quote});
        } catch (e) {
            console.error(e);
        }

    };

    return {
        generateRandomQuote
    };
};
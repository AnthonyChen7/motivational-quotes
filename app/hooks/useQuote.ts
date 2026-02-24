export const useQuote = () => {
    const generateRandomQuote = async() => {
        try {
            const response = await fetch('/api/quote');
            const json = await response.json();
            const quote = json?.quote;
            return quote;
        } catch (e) {
            throw e;
        }
    };

    return {
        generateRandomQuote
    };
};
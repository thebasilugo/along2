import { NigerianState, Coordinates } from '../types';

export const getTransitRoute = async (
    origin: string,
    destination: string,
    state: NigerianState,
    currentLocation: Coordinates | null
): Promise<string> => {
    try {
        const response = await fetch('/api/get-route', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ origin, destination, state, currentLocation }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Use the error message from the backend, or a default one
            throw new Error(data.error || 'An error occurred while fetching the route.');
        }

        return data.route;
    } catch (error) {
        console.error("Error calling backend proxy:", error);
        if (error instanceof Error) {
            throw new Error(error.message);
        }
        throw new Error("Failed to fetch route due to a network or server issue.");
    }
};

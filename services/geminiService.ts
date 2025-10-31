import { GoogleGenAI, GenerateContentResponse, GroundingChunk } from "@google/genai";
import { Coordinates } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface RouteResult {
    directions: string;
}

export const findRoute = async (
    startPoint: string,
    destination: string,
    currentLocation: Coordinates | null
): Promise<RouteResult> => {
    const prompt = `
        Create a simple, summarized public transport plan from "${startPoint}" to "${destination}" in either Lagos or Abuja, Nigeria.
        The plan should be a high-level overview, not detailed turn-by-turn directions.
        Structure it as a short, numbered list of main steps, for example: "1. Take a bus to [major landmark]".
        The final step must always be "Arrive at destination.".
        This is for people unfamiliar with reading complex directions, so keep it extremely simple and clear.
        If the start point is 'my current location', use the provided coordinates as the starting point.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                ...(currentLocation && {
                    toolConfig: {
                        retrievalConfig: {
                            latLng: {
                                latitude: currentLocation.latitude,
                                longitude: currentLocation.longitude,
                            },
                        },
                    },
                }),
            },
        });

        const directions = response.text;

        if (!directions) {
            throw new Error("Could not find a route. Please try different locations.");
        }

        return { directions };
    } catch (error) {
        console.error("Error finding route:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get directions from AI: ${error.message}`);
        }
        throw new Error("An unknown error occurred while finding the route.");
    }
};
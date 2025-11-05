import { GoogleGenAI } from "@google/genai";
import { NigerianState, Coordinates } from '../types';

// The GoogleGenAI instance is initialized assuming the API_KEY is present in the environment.
// The SDK will handle errors if the key is missing or invalid upon making an API call.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getTransitRoute = async (
    origin: string,
    destination: string,
    state: NigerianState,
    currentLocation: Coordinates | null
): Promise<string> => {
    
    let originText = origin;
    if (origin === "My Current Location" && currentLocation) {
        originText = `my current location at coordinates ${currentLocation.latitude}, ${currentLocation.longitude}`;
    }

    const prompt = `
        You are a local transport expert for Nigeria.
        Provide a detailed, step-by-step public transportation route from ${originText} to "${destination}" in ${state}, Nigeria.
        Your response should be concise and easy to follow.
        Assume the user is looking for common local transport options like danfo buses, BRT, keke napep (tricycles), or okada (motorcycle taxis) where applicable.
        Format the output as a clear, numbered list. For each step, describe the action, the mode of transport, and an estimated time or key landmark. Do not use markdown formatting like bold or italics.

        Example format:
        1. Walk to the nearest bus stop at Berger. (Approx. 5 mins)
        2. Take a danfo bus heading towards Ikeja. (Approx. 20 mins)
        3. Alight at Ikeja Along and take a keke napep to your final destination. (Approx. 10 mins)
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching route from Gemini API:", error);
         if (error instanceof Error && error.message.includes('API key not valid')) {
             throw new Error("Your API Key is invalid or missing. Please check your environment variables.");
        }
        throw new Error("Failed to fetch route. The service may be unavailable or there was a network issue.");
    }
};

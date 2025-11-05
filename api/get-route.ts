import { GoogleGenAI } from "@google/genai";
import type { NigerianState, Coordinates } from '../types';

// This is a Vercel serverless function, which can be deployed as an Edge Function.
export const config = {
  runtime: 'edge',
};

// The GoogleGenAI instance is initialized safely on the server.
// The API_KEY is read from server-side environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// The handler for the /api/get-route endpoint
export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { origin, destination, state, currentLocation } = (await req.json()) as {
        origin: string;
        destination: string;
        state: NigerianState;
        currentLocation: Coordinates | null;
    };

    if (!origin || !destination || !state) {
        return new Response(JSON.stringify({ error: 'Missing required fields' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

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

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    const routeText = response.text;

    return new Response(JSON.stringify({ route: routeText }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("Error in serverless function:", error);
    // Check for specific Gemini API key error to provide a clearer message
    if (error.message && error.message.includes('API key not valid')) {
       return new Response(JSON.stringify({ error: "The server's API Key is invalid or missing. Please check the deployment environment variables." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

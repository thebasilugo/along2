import { GoogleGenAI } from "@google/genai";
import { NextResponse } from 'next/server';
import type { NigerianState, Coordinates } from '@/types';

// The GoogleGenAI instance is initialized safely on the server.
// The API_KEY is read from server-side environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// The handler for the /api/get-route endpoint using the Next.js App Router
export async function POST(req: Request) {
  try {
    const { origin, destination, state, currentLocation } = (await req.json()) as {
        origin: string;
        destination: string;
        state: NigerianState;
        currentLocation: Coordinates | null;
    };

    if (!origin || !destination || !state) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    return NextResponse.json({ route: routeText }, { status: 200 });

  } catch (error: any) {
    console.error("Error in API route:", error);
    if (error.message && error.message.includes('API key not valid')) {
       return NextResponse.json({ error: "The server's API Key is invalid or missing. Please check the deployment environment variables." }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}

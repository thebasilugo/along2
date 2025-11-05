import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey });

export const getTransitRoute = async (start: string, destination: string, city: 'Abuja' | 'Lagos'): Promise<string> => {
  try {
    const prompt = `
      You are an expert public transportation guide for ${city}, Nigeria. 
      Your task is to provide an extremely concise, simplified, step-by-step public transport route.

      Start: "${start}"
      Destination: "${destination}"

      Follow these strict instructions for the response format:
      1.  Provide the route as a short, numbered list of simple actions (maximum 4-5 steps).
      2.  Each step must be a single, clear instruction.
      3.  Start with an action verb (e.g., "Walk", "Take", "Board", "Alight").
      4.  Mention the mode of transport (e.g., Keke, Bus, Danfo) and key locations/landmarks.
      5.  Do not add any extra explanations, summaries, cost estimates, or pleasantries.
      6.  The entire response should only be the numbered list.

      Example response format for ${city}:
      ${city === 'Abuja' 
        ? `1. Walk to the bus stop at Wuse Market main gate.
           2. Board a bus heading towards Berger.
           3. Alight at Jabi Lake Mall junction.
           4. You have arrived at your destination.`
        : `1. Walk to CMS Bus Stop.
           2. Board a Danfo bus going to Ikeja.
           3. Alight at Ikeja Along bus stop.
           4. Take a Keke to Ikeja City Mall.`
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.trim();

  } catch (error) {
    console.error("Error fetching transit route from Gemini:", error);
    throw new Error("Failed to generate transit route. Please try again.");
  }
};
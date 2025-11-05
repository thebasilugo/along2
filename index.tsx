import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- START OF INLINED TYPES & CONSTANTS ---
enum NigerianState {
  ABUJA = 'Abuja',
  LAGOS = 'Lagos',
  PORT_HARCOURT = 'Port Harcourt',
  OGUN = 'Ogun',
  ABEOKUTA = 'Abeokuta',
}

interface Coordinates {
    latitude: number;
    longitude: number;
}

const SUPPORTED_STATES: NigerianState[] = [
  NigerianState.LAGOS,
  NigerianState.ABUJA,
  NigerianState.PORT_HARCOURT,
  NigerianState.OGUN,
  NigerianState.ABEOKUTA,
];
// --- END OF INLINED TYPES & CONSTANTS ---


// IMPORTANT: The user must add their API key here for the app to work.
const API_KEY = process.env.API_KEY;

function App() {
  const [selectedState, setSelectedState] = useState<NigerianState>(NigerianState.LAGOS);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<string | null>(null);

  const handleUseCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          setOrigin('My Current Location');
          setError(null);
        },
        () => {
          setError('Could not get your location. Please enable location services in your browser.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);
  
  const handleSearch = async () => {
    if (!origin || !destination) {
      setError('Please provide both an origin and a destination.');
      return;
    }
     if (!API_KEY) {
      setError('API key is not configured. Please add it to your environment variables.');
      return;
    }

    setLoading(true);
    setError(null);
    setRoute(null);

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });

      let originText = origin;
      if (origin === "My Current Location" && currentLocation) {
          originText = `my current location at coordinates ${currentLocation.latitude}, ${currentLocation.longitude}`;
      }

      const prompt = `
        You are a local transport expert for Nigeria.
        Provide a detailed, step-by-step public transportation route from ${originText} to "${destination}" in ${selectedState}, Nigeria.
        Your response should be concise and easy to follow.
        Assume the user is looking for common local transport options like danfo buses, BRT, keke napep (tricycles), or okada (motorcycle taxis) where applicable.
        Format the output as a clear, numbered list. Do not use markdown.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setRoute(response.text);

    } catch (err) {
      console.error(err);
      setError('Failed to get route. The API key might be invalid or there was a network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Along</h1>
          <p className="text-md text-gray-600">Move smart. Move easily.</p>
        </header>

        <main className="bg-white p-8 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                Select State
              </label>
              <select
                id="state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value as NigerianState)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {SUPPORTED_STATES.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origin</label>
              <input
                id="origin"
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="e.g., Ikeja City Mall"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                disabled={origin === 'My Current Location'}
              />
            </div>

            <div>
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination</label>
              <input
                id="destination"
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., National Stadium, Surulere"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
                onClick={handleUseCurrentLocation}
                className="text-sm text-blue-600 hover:underline font-semibold"
            >
                Use Current Location
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Searching...' : 'Search Route'}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
              <p>{error}</p>
            </div>
          )}
          
          {route && (
            <div className="mt-6 p-4 bg-gray-50 border rounded-md">
              <h3 className="font-bold mb-2">Your Route:</h3>
              <pre className="whitespace-pre-wrap font-sans text-gray-800">{route}</pre>
            </div>
           )}
        </main>
      </div>
    </div>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);
root.render(<App />);

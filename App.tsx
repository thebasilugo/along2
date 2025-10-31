import React, { useState, useEffect, useCallback } from 'react';
import type { Coordinates } from './types';
import { findRoute, RouteResult } from './services/geminiService';
import LoadingSpinner from './components/LoadingSpinner';
import RouteDisplay from './components/RouteDisplay';

const App: React.FC = () => {
    const [startPoint, setStartPoint] = useState('');
    const [destination, setDestination] = useState('');
    const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    
    const [routeResult, setRouteResult] = useState<RouteResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                    setStartPoint('My current location');
                },
                (error) => {
                    console.warn(`Geolocation error: ${error.message}`);
                    setLocationError('Could not get your location. Please enable location services for the best experience.');
                }
            );
        } else {
            setLocationError("Geolocation is not supported by this browser.");
        }
    }, []);

    const handleUseCurrentLocation = () => {
        if (currentLocation) {
            setStartPoint('My current location');
        }
    };

    const handleFindRoute = useCallback(async () => {
        if (!startPoint || !destination) {
            setError('Please enter both a starting point and a destination.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setRouteResult(null);

        try {
            const result = await findRoute(startPoint, destination, currentLocation);
            setRouteResult(result);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [startPoint, destination, currentLocation]);

    const handleReset = () => {
        setStartPoint(currentLocation ? 'My current location' : '');
        setDestination('');
        setRouteResult(null);
        setError(null);
        setIsLoading(false);
    }

    const isButtonDisabled = !startPoint || !destination || isLoading;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 text-gray-900">
            <main className="container mx-auto px-4 py-8 md:py-16 flex flex-col items-center">
                <header className="text-center mb-10 md:mb-12">
                     <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 tracking-tight">
                        <span className="text-blue-600">Along</span>
                     </h1>
                     <p className="text-lg text-gray-500 mt-3 max-w-md">Public transport directions for Abuja & Lagos, simplified.</p>
                </header>
                
                <div className="w-full max-w-lg space-y-6">
                    {!routeResult && (
                        <div className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in border border-gray-200/50 space-y-6">
                            {locationError && !currentLocation && (
                                <p className="text-sm text-amber-800 bg-amber-100 p-3 rounded-lg flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  {locationError}
                                </p>
                            )}
                            
                            <div className="relative">
                                <label htmlFor="start" className="absolute -top-2 left-4 inline-block bg-white/0 px-1 text-xs font-medium text-gray-600">From</label>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="start"
                                    type="text"
                                    value={startPoint}
                                    onChange={(e) => setStartPoint(e.target.value)}
                                    placeholder="e.g., Ikeja City Mall"
                                    className="w-full pl-11 pr-12 py-3 text-base text-gray-800 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleUseCurrentLocation}
                                    disabled={!currentLocation}
                                    aria-label="Use my current location"
                                    title={currentLocation ? "Use my current location" : "Location not available"}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 group disabled:cursor-not-allowed"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors ${currentLocation ? 'text-gray-400 group-hover:text-blue-600' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                      <path fillRule="evenodd" d="M.458 10C.458 4.737 4.737.458 10 .458c5.263 0 9.542 4.279 9.542 9.542s-4.279 9.542-9.542 9.542C4.737 19.542.458 15.263.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>

                            <div className="relative">
                                <label htmlFor="destination" className="absolute -top-2 left-4 inline-block bg-white/0 px-1 text-xs font-medium text-gray-600">To</label>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    id="destination"
                                    type="text"
                                    value={destination}
                                    onChange={(e) => setDestination(e.target.value)}
                                    placeholder="e.g., Jabi Lake Mall"
                                    className="w-full pl-11 pr-4 py-3 text-base text-gray-800 bg-white/50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{error}</p>
                        </div>
                    )}
                    
                    <div className="w-full pt-2">
                        {isLoading && <LoadingSpinner />}
                        
                        {routeResult && (
                            <div className="space-y-4">
                                <RouteDisplay directions={routeResult.directions} />
                                <button
                                    onClick={handleReset}
                                    className="w-full flex items-center justify-center bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 transform hover:scale-105"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 3a5 5 0 100 10A5 5 0 008 3zM6.379 6.379a.75.75 0 011.06 0L8 7.94l.561-.561a.75.75 0 111.06 1.06L9.06 9l.561.561a.75.75 0 11-1.06 1.06L8 10.06l-.561.561a.75.75 0 01-1.06-1.06L6.94 9l-.561-.561a.75.75 0 010-1.06z" clipRule="evenodd" />
                                  </svg>
                                    New Search
                                </button>
                            </div>
                        )}

                        {!routeResult && !isLoading && (
                            <button
                                onClick={handleFindRoute}
                                disabled={isButtonDisabled}
                                className={`w-full flex items-center justify-center font-bold py-4 px-4 rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 text-lg shadow-lg ${
                                    isButtonDisabled
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 hover:-translate-y-1 hover:shadow-2xl'
                                }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                                Find Route
                            </button>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
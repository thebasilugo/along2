
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { NigerianState, Coordinates } from '@/types';
import { SUPPORTED_STATES } from '@/constants';
import { getTransitRoute } from '@/services/geminiService';
import { ArrowsUpDownIcon, LocationMarkerIcon } from '@/components/icons';
import RouteDisplay from '@/components/RouteDisplay';

export default function HomePage() {
  const [selectedState, setSelectedState] = useState<NigerianState>(NigerianState.LAGOS);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<string | null>(null);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value as NigerianState);
    setRoute(null);
    setError(null);
  };

  const handleSwapLocations = () => {
    if (origin === 'My Current Location') return;
    setOrigin(destination);
    setDestination(origin);
  };

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
          setError('Unable to retrieve your location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleSearch = async () => {
    if (!origin || !destination) {
      setError('Please enter both an origin and a destination.');
      return;
    }
    setLoading(true);
    setError(null);
    setRoute(null);
    try {
      const result = await getTransitRoute(origin, destination, selectedState, currentLocation);
      setRoute(result);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  // Auto-detect location on first load for better UX
  useEffect(() => {
    handleUseCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 tracking-tight">Along</h1>
          <p className="text-lg text-gray-600 mt-2">Move smart. Move easily.</p>
        </header>

        <main className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
          <div className="space-y-4">
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                Select your state
              </label>
              <select
                id="state"
                value={selectedState}
                onChange={handleStateChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              >
                {SUPPORTED_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                 <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
                    Origin
                </label>
                <div className="relative">
                  <input
                    id="origin"
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Enter origin"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    disabled={origin === 'My Current Location'}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="h-5 w-5 border-2 border-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSwapLocations}
                className="self-end mb-1 p-3 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-transform active:translate-y-px active:opacity-90 disabled:opacity-50"
                aria-label="Swap origin and destination"
                disabled={origin === 'My Current Location'}
              >
                <ArrowsUpDownIcon className="h-5 w-5" />
              </button>

              <div className="relative flex-grow">
                 <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                </label>
                <div className="relative">
                  <input
                    id="destination"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Enter destination"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LocationMarkerIcon className="h-5 w-5 text-red-500"/>
                  </div>
                </div>
              </div>
            </div>

            <button
                onClick={handleUseCurrentLocation}
                className="w-full flex items-center justify-center space-x-2 text-sm text-blue-600 hover:underline font-semibold transition-opacity active:opacity-75 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <LocationMarkerIcon className="h-5 w-5" />
                <span>Use Current Location</span>
            </button>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform active:translate-y-px active:opacity-95 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <circle className="opacity-25" cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M2 10a8 8 0 018-8v2a6 6 0 00-6 6H2z"></path>
                  </svg>
                  Searching...
                </div>
              ) : 'Search Route'}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p>{error}</p>
            </div>
          )}
          
          {route && (
            <div className="mt-8">
              <RouteDisplay route={route} />
            </div>
           )}

        </main>
      </div>
    </div>
  );
}

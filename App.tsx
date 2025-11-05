import React, { useState, useCallback, useEffect } from 'react';
import { getTransitRoute } from './services/geminiService';
import LocationInput from './components/LocationInput';
import RouteDisplay from './components/RouteDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import SearchHistory, { HistoryItem } from './components/SearchHistory';

type City = 'Abuja' | 'Lagos';

const App: React.FC = () => {
  const [startLocation, setStartLocation] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [route, setRoute] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [city, setCity] = useState<City>('Abuja');

  const placeholders = {
    Abuja: {
      start: "e.g., Wuse Market",
      destination: "e.g., Jabi Lake Mall"
    },
    Lagos: {
      start: "e.g., CMS Bus Stop",
      destination: "e.g., Ikeja City Mall"
    }
  };

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('along-search-history');
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to parse search history from localStorage", e);
    }
  }, []);

  const updateSearchHistory = (start: string, dest: string) => {
    const updatedHistory = [...searchHistory];
    const existingIndex = updatedHistory.findIndex(
      item => item.start.toLowerCase() === start.toLowerCase() && item.destination.toLowerCase() === dest.toLowerCase()
    );

    if (existingIndex > -1) {
      updatedHistory[existingIndex].count += 1;
    } else {
      updatedHistory.push({ start, destination: dest, count: 1 });
    }
    
    setSearchHistory(updatedHistory);
    localStorage.setItem('along-search-history', JSON.stringify(updatedHistory));
  };


  const handleUseCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setIsLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setStartLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          setIsLoading(false);
        },
        (err) => {
          setError(`Error getting location: ${err.message}`);
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  const handleSearch = async (start: string = startLocation, dest: string = destination) => {
    if (!start || !dest) {
      setError('Please enter both a starting point and a destination.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRoute(null);

    try {
      const generatedRoute = await getTransitRoute(start, dest, city);
      setRoute(generatedRoute);
      updateSearchHistory(start, dest);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleHistorySelect = (item: HistoryItem) => {
    setStartLocation(item.start);
    setDestination(item.destination);
    setShowHistory(false);
    // Note: This doesn't know the city from history, searches in current city context.
    // This could be a future improvement if history items store the city.
    handleSearch(item.start, item.destination);
  };

  const handleCityChange = (newCity: City) => {
    setCity(newCity);
    // Clear inputs and route when city changes for clarity
    setStartLocation('');
    setDestination('');
    setRoute(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-6">
            <div className="flex justify-between items-center w-full">
                <div className="w-12"></div> {/* Spacer */}
                <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
                    Along
                </h1>
                <button 
                    onClick={() => setShowHistory(true)} 
                    className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="View search history"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
            </div>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
            Simple public transport routes for {city}.
          </p>
        </header>

        <div className="mb-6 flex justify-center p-1 bg-gray-200 dark:bg-gray-700 rounded-lg">
          {(['Abuja', 'Lagos'] as City[]).map((c) => (
            <button
              key={c}
              onClick={() => handleCityChange(c)}
              className={`w-full font-semibold py-2 px-4 rounded-md transition-colors duration-300 ${
                city === c
                  ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-300/50 dark:hover:bg-gray-600/50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="space-y-6">
            <LocationInput
              id="start-location"
              label="Starting Point"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder={placeholders[city].start}
              onUseCurrentLocation={handleUseCurrentLocation}
            />
            <LocationInput
              id="destination"
              label="Destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={placeholders[city].destination}
            />
          </div>

          <div className="mt-8">
            <button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 dark:disabled:bg-indigo-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 flex items-center justify-center shadow-lg hover:shadow-indigo-500/50"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Finding Route...</span>
                </>
              ) : (
                'Find Route'
              )}
            </button>
          </div>
          
          {error && (
            <div className="mt-6 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded-md" role="alert">
              <p className="font-bold">Oops!</p>
              <p>{error}</p>
            </div>
          )}

          {route && <RouteDisplay route={route} />}
        </main>
        
        <footer className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Gemini. Route information is AI-generated and for guidance only.</p>
        </footer>
      </div>
      <SearchHistory 
        history={searchHistory}
        onSelect={handleHistorySelect}
        onClose={() => setShowHistory(false)}
        isVisible={showHistory}
      />
    </div>
  );
};

export default App;
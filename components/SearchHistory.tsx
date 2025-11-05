import React from 'react';

export interface HistoryItem {
  start: string;
  destination: string;
  count: number;
}

interface SearchHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClose: () => void;
  isVisible: boolean;
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ history, onSelect, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300" onClick={onClose} style={{ opacity: isVisible ? 1 : 0 }}>
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
        style={{ transform: isVisible ? 'translateX(0)' : 'translateX(100%)' }}
      >
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Popular Routes</h2>
                <button 
                    onClick={onClose} 
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Close search history"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            {history.length === 0 ? (
                <div className="flex-grow flex items-center justify-center">
                    <p className="text-center text-gray-500 dark:text-gray-400">No recent searches yet. <br />Your popular routes will appear here.</p>
                </div>
            ) : (
                <ul className="space-y-3 overflow-y-auto -mr-2 pr-2">
                    {history.sort((a,b) => b.count - a.count).map((item, index) => (
                        <li key={index}>
                            <button 
                                onClick={() => onSelect(item)}
                                className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-sm"
                            >
                                <div className="font-semibold text-gray-800 dark:text-gray-200">
                                    <span className="block truncate">{item.start}</span> 
                                    <div className="flex items-center my-1">
                                        <span className="text-indigo-500 text-xl leading-none">↓</span>
                                    </div>
                                    <span className="block truncate">{item.destination}</span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" /></svg>
                                    <span>{item.count} {item.count > 1 ? 'searches' : 'search'}</span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </div>
    </div>
  );
};

export default SearchHistory;
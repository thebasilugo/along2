import React from 'react';

interface RouteDisplayProps {
  directions: string;
}

const RouteDisplay: React.FC<RouteDisplayProps> = ({ directions }) => {
  const formatDirections = (text: string) => {
    return text
      .split('\n')
      .map((line) => {
        // Remove markdown-like asterisks for simplicity and apply bold via class
        line = line.replace(/\*/g, '');
        // Check for numbered list items
        if (/^\d+\.\s/.test(line.trim())) {
          return `<li class="flex items-start mb-3">
                    <span class="bg-blue-500 text-white rounded-full w-6 h-6 text-sm font-bold flex items-center justify-center mr-4 flex-shrink-0">${line.trim().split('.')[0]}</span>
                    <span class="flex-1">${line.trim().substring(line.indexOf('.') + 1).trim()}</span>
                  </li>`;
        }
        if (line.trim().length > 0) {
           return `<p class="mb-3">${line}</p>`;
        }
        return '';
      })
      .join('');
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl p-6 md:p-8 rounded-2xl shadow-lg w-full animate-fade-in border border-gray-200/50">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Route</h2>
      <ol
        className="space-y-2 text-gray-700 text-base"
        dangerouslySetInnerHTML={{ __html: formatDirections(directions) }}
      />
    </div>
  );
};

export default RouteDisplay;
import React from 'react';

// SVG icons for different transport modes
const WalkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const BusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 18.35A6.35 6.35 0 0018.35 12 6.35 6.35 0 0012 5.65 6.35 6.35 0 005.65 12 6.35 6.35 0 0012 18.35z" />
    <path d="M12 2v2m0 16v2m-8-9H2m8-8V2m8 8h2m-2 8l-2-2" />
  </svg>
);

const DestinationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const getIconForStep = (step: string) => {
    const lowerCaseStep = step.toLowerCase();
    if (lowerCaseStep.includes('walk') || lowerCaseStep.includes('cross')) {
        return <WalkIcon />;
    }
    if (lowerCaseStep.includes('bus') || lowerCaseStep.includes('board') || lowerCaseStep.includes('take a') || lowerCaseStep.includes('keke')) {
        return <BusIcon />;
    }
    if (lowerCaseStep.includes('arrive') || lowerCaseStep.includes('destination')) {
        return <DestinationIcon />;
    }
    return <BusIcon />; // Default icon
};

interface RouteDisplayProps {
  route: string;
}

const RouteDisplay: React.FC<RouteDisplayProps> = ({ route }) => {
  const steps = route.split('\n').filter(line => line.match(/^\d+\.\s/));

  return (
    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Your Route</h2>
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start p-4 bg-gray-100 dark:bg-gray-800/50 rounded-lg shadow-sm">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-500 dark:bg-indigo-600 text-white flex items-center justify-center mr-4">
              {getIconForStep(step)}
            </div>
            <p className="text-gray-700 dark:text-gray-300 self-center">
              {step.substring(step.indexOf(' ') + 1)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteDisplay;
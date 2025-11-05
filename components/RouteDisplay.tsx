
import React from 'react';
import { BusIcon, WalkIcon, MotorcycleIcon } from './icons';

interface RouteDisplayProps {
  route: string;
}

const getIconForStep = (step: string): React.ReactElement => {
    const lowerCaseStep = step.toLowerCase();
    if (lowerCaseStep.includes('bus') || lowerCaseStep.includes('brt') || lowerCaseStep.includes('danfo')) {
        return <BusIcon className="h-8 w-8 text-blue-500" />;
    }
    if (lowerCaseStep.includes('walk')) {
        return <WalkIcon className="h-8 w-8 text-green-500" />;
    }
    if (lowerCaseStep.includes('keke') || lowerCaseStep.includes('tricycle') || lowerCaseStep.includes('okada')) {
        return <MotorcycleIcon className="h-8 w-8 text-yellow-500" />;
    }
    return <BusIcon className="h-8 w-8 text-gray-400" />;
};

const RouteDisplay: React.FC<RouteDisplayProps> = ({ route }) => {
  const steps = route.split('\n').filter(step => step.trim() !== '' && /^\d+\./.test(step.trim()));

  if (steps.length === 0) {
    return (
        <div className="mt-6 text-center text-gray-600 bg-gray-50 p-6 rounded-lg">
            <p className="font-semibold">No valid route found.</p>
            <p className="text-sm">Please try a different origin or destination.</p>
        </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      <h3 className="text-xl font-bold text-gray-800">Your Route</h3>
      <ul className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex-shrink-0 pt-1">
              {getIconForStep(step)}
            </div>
            <p className="text-gray-700 leading-relaxed">{step.replace(/^\d+\.\s*/, '')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RouteDisplay;
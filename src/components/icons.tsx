
import React from 'react';

// New Swap icon, more common for this action
export const ArrowsUpDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
    </svg>
);

export const LocationMarkerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

// New, more prominent Bus icon
export const BusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h13.5m-13.5 6h13.5m-13.5-3h13.5V6a2.25 2.25 0 00-2.25-2.25H7.5A2.25 2.25 0 005.25 6v.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 15.75v3a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21a1.5 1.5 0 00-3 0m12 0a1.5 1.5 0 00-3 0" />
  </svg>
);


export const WalkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

// New, more specific icon for Keke/Okada
export const MotorcycleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 16.5c0 1.242-1.008 2.25-2.25 2.25S3 17.742 3 16.5s1.008-2.25 2.25-2.25 2.25 1.008 2.25 2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 16.5c0 1.242-1.008 2.25-2.25 2.25S12 17.742 12 16.5s1.008-2.25 2.25-2.25 2.25 1.008 2.25 2.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25l-3-6 3-3 3 3-3 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25V9.75M16.5 16.5h3.75v-3.75H18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 16.5H3.75v-3.75H6" />
    </svg>
);

import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 p-4 md:p-0">
      <img
        src="Logo2.svg"
        alt="Loading..."
        className="w-16 md:w-24 lg:w-28 h-auto animate-spin-slow animate-pulse-slow"
        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}
      />
    </div>
  );
}

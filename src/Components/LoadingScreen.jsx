import React from 'react';
import { BounceLoader } from 'react-spinners';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white/60 via-blue-100/40 to-blue-200/40 dark:from-gray-900/60 dark:via-gray-800/40 dark:to-gray-900/40 backdrop-blur-sm">
      {/* Spinner with logo in front */}
      <div className="relative flex items-center justify-center mb-8" style={{ width: 80, height: 80 }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BounceLoader color="#F59E42" size={80} aria-label="Loading Spinner" />
        </div>
      <img 
        src="Logo2.svg"
          alt="Loading Logo"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ zIndex: 2 }}
        />
      </div>
    </div>
  );
}

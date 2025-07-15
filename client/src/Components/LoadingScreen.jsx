import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-white/90 via-blue-100/80 to-blue-200/80 dark:from-gray-900/90 dark:via-gray-800/80 dark:to-gray-900/80 backdrop-blur-sm">
      <img
        src="Logo2.svg"
        alt="Loading..."
        className="w-20 md:w-28 lg:w-32 h-auto animate-spin-slow mb-8"
        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))' }}
      />
      {/* Spinner */}
      <div className="relative flex items-center justify-center mb-8">
        <span className="absolute inline-flex h-16 w-16 rounded-full bg-blue-400 opacity-20 animate-ping"></span>
        <svg className="w-12 h-12 text-blue-500 animate-spin" viewBox="0 0 50 50">
          <circle
            className="opacity-20"
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
          />
          <circle
            className=""
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            strokeDasharray="31.4 94.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

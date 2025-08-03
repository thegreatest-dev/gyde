import React from 'react';

export default function AIAssistant() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 text-gray-800 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 dark:text-gray-100 transition-all duration-500">
      <div className="bg-white/90 dark:bg-[#181c23]/90 border border-white/20 dark:border-[#23283a] rounded-3xl shadow-2xl p-8 max-w-md w-full backdrop-blur-md flex flex-col items-center">
        <div className="text-5xl mb-4">🤖</div>
        <h2 className="text-2xl font-bold mb-2">AI Assistant</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">How can I help you today? Ask me anything about your finances, savings, or app features!</p>
        <input
          type="text"
          placeholder="Type your question..."
          className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow hover:from-blue-700 hover:to-blue-800 transition-all">Send</button>
      </div>
    </div>
  );
}

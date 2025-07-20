import React, { useState } from 'react';
import { useTheme } from '../Components/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { PieChart, Lock, BarChart2, PiggyBank, Star, ShieldCheck, Headphones } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { optimisticUpdate } from '../optimisticUpdate';

export default function Customer() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  // State for support inquiries (for optimistic update demo)
  const [inquiries, setInquiries] = useState([]);

  // Support options with icons
  const supportOptions = [
    { label: 'Budgeting Assistance', icon: <PieChart className="w-8 h-8 mx-auto" /> },
    { label: 'Account Issues', icon: <Lock className="w-8 h-8 mx-auto" /> },
    { label: 'Expense Tracking', icon: <BarChart2 className="w-8 h-8 mx-auto" /> },
    { label: 'Savings Questions', icon: <PiggyBank className="w-8 h-8 mx-auto" /> },
    { label: 'User Feedback', icon: <Star className="w-8 h-8 mx-auto" /> },
    { label: 'Dispute', icon: <ShieldCheck className="w-8 h-8 mx-auto" /> },
  ];

  // Fake API call for optimistic update demo
  const fakeApiSendInquiry = (inquiry) => new Promise((resolve, reject) => setTimeout(() => Math.random() > 0.2 ? resolve(inquiry) : reject(new Error('API error')), 1000));

  // Example inquiries state (replace with real state as needed)
  // const [inquiries, setInquiries] = useState([]);
  const handleInquiry = (inquiry) => {
    optimisticUpdate({
      update: () => setInquiries(prev => [...prev, inquiry]),
      request: () => fakeApiSendInquiry(inquiry),
      rollback: () => setInquiries(prev => prev.filter(i => i !== inquiry)),
      onError: () => alert('Failed to send inquiry.')
    });
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-all duration-300 ${
      darkMode ? 'bg-gray-900 text-gray-100' : 'bg-blue-50 text-gray-900'
    }`}>
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className={`absolute top-6 left-6 flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium shadow-sm focus:outline-none transition-colors z-50 ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
        aria-label="Back to Dashboard"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Back</span>
      </button>
      {/* Top Section */}
      <div className="max-w-md mx-auto w-full pt-10 pb-32 px-4">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className={`rounded-full p-4 mb-4 ${darkMode ? 'bg-blue-900/40' : 'bg-blue-100'}`}> 
            <Headphones className="w-14 h-14 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Hello~ David Alfredo</h1>
          <p className="text-lg text-center mb-2 font-medium">How can we assist you today?</p>
        </div>
        {/* Support Options */}
        <div className={`grid grid-cols-3 gap-4 rounded-3xl p-6 mb-8 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}>
          {supportOptions.map((opt, i) => (
            <button
              key={i}
              className={`flex flex-col items-center gap-2 py-4 rounded-xl transition-colors font-medium ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'}`}
            >
              {opt.icon}
              <span className="text-xs text-center leading-tight">{opt.label}</span>
            </button>
          ))}
        </div>
        {/* Recent Inquiries */}
        <div className={`rounded-2xl p-5 mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white shadow'}`}> 
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-base">Recent Inquiries</span>
            <button className={`text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>More &gt;</button>
          </div>
          {inquiries.length === 0 ? (
          <div className={`rounded-lg text-center py-6 text-gray-400 text-base ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>No records found yet</div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {inquiries.map((inq, idx) => (
                <li key={idx} className="py-3 flex flex-col items-start">
                  <span className="font-medium text-gray-800 dark:text-gray-100">{inq.subject || 'Inquiry'}</span>
                  {inq.date && <span className="text-xs text-gray-500 dark:text-gray-400">{inq.date}</span>}
                  {inq.message && <span className="text-sm text-gray-600 dark:text-gray-300 mt-1">{inq.message}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {/* Chat Button */}
      <button className={`fixed left-1/2 -translate-x-1/2 bottom-6 flex items-center px-8 py-4 rounded-full shadow-lg gap-3 text-lg font-semibold z-50 ${
        darkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-orange-500 hover:bg-orange-600'
      } text-white transition-colors`}>
        <span className="text-xl">💬</span>
        Chat with us
      </button>
    </div>
  );
}
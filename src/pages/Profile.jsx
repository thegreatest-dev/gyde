
import React from 'react';
import BottomNav from '../Components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Mail, ShieldCheck, Settings, ArrowLeft } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: clear auth tokens/session here if used
    navigate('/login'); // Navigate to login page
  };

  const handleBack = () => {
    navigate('/dashboard'); // Go back to dashboard
  };

  // Get dark mode from localStorage
  const darkMode = (() => {
    const stored = localStorage.getItem('gyde_dark_mode');
    return stored === null ? false : stored === 'true';
  })();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'} p-6 lg:px-16`}>

      {/* Back to Dashboard Button */}
      <button
        onClick={handleBack}
        className="mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Dashboard</span>
      </button>

      {/* Profile Info */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
            alt="profile"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold">David Alfredo</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">davidalfredo@email.com</p>
          </div>
        </div>
      </div>

      {/* Profile Options */}
      <div className="space-y-4">
        <ProfileOption icon={<Settings />} label="Account Settings" />
        <ProfileOption icon={<Mail />} label="Email Preferences" />
        <ProfileOption icon={<ShieldCheck />} label="Security" />
      </div>

      {/* Logout Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleLogout}
        className="mt-12 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Log Out
      </motion.button>
      <BottomNav darkMode={darkMode} />
    </div>
  );
}

const ProfileOption = ({ icon, label }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    if (label === 'Account Settings') {
      navigate('/accset');
    }
  };
  return (
    <div
      className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      onClick={handleClick}
    >
      <div className="text-blue-600 dark:text-blue-400">{icon}</div>
      <p className="font-medium text-gray-800 dark:text-gray-100">{label}</p>
    </div>
  );
};

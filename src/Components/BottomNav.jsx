// src/components/BottomNav.jsx
import { Home, Wallet, BarChart3, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

function BottomNav({ darkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { name: 'home', path: '/dashboard', icon: <Home className="w-6 h-6" /> },
    { name: 'wallet', path: '/wallet', icon: <Wallet className="w-6 h-6" /> },
    { name: 'analytics', path: '/statistics', icon: <BarChart3 className="w-6 h-6" /> },
    { name: 'ai-assistant', path: '/ai-assistant', icon: <span className="w-6 h-6">🤖</span> }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-6xl px-4 z-50">
      <div className={`rounded-t-3xl px-6 py-4 shadow-lg border-t flex justify-around items-center 
        ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className={`p-3 rounded-2xl transition-colors font-semibold ${
              location.pathname === tab.path
                ? (darkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-900')
                : (darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600')
            }`}
          >
            {tab.icon}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BottomNav;

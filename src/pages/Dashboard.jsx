import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Plus, Flame, CheckCircle, Sun, Moon, Menu, X, Home, TrendingUp, Target, Settings, User, Eye, EyeOff, Headset, PieChart } from 'lucide-react';
import BottomNav from '../Components/BottomNav';
import { useTheme } from '../Components/ThemeContext';
import { SavingsGoalsContext, BalanceContext } from './Statistics';
import { optimisticUpdate } from '../optimisticUpdate';
import { useContext } from 'react';
import { ThemeContext } from '../Components/ThemeContext';

export default function GydeDashboard() {
  const { user, loading, setUser } = useUser();
  // Navigation and Theme
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  // Dropdown state for profile menu
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // State Management
  const [activeTab, setActiveTab] = useState('home');
  const [balance] = useState(500000);
  const [showBalance, setShowBalance] = useState(true);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalError, setGoalError] = useState('');

  // Goal Form State
  const [goalForm, setGoalForm] = useState({
    name: '',
    target: '',
    contributionType: 'fixed',
    contributionValue: '',
    deadline: '',
    frequency: 'monthly',
    icon: '💰',
  });

  // Data
  const [savingsGoals, setSavingsGoals] = useState([]);
  
  const budgetCategories = [
    { name: 'Recurring Expenses', amount: '₦90,000' },
    { name: 'Non-recurring Expenses', amount: '₦30,000' },
    { name: 'Cheat Day', amount: '₦10,000' }
  ];

  const recentActivities = [
    {
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      text: '30 days streak reached.',
      time: '37 mins ago',
      amount: null
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      text: 'Account credited.',
      time: '2 hours ago',
      amount: '₦125,000.00'
    }
  ];

  const budgetCategoryIcons = [
    <PieChart className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />,
    <PieChart className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />,
    <PieChart className="w-5 h-5 md:w-6 md:h-6 text-pink-500" />
  ];

  const budgetCategoryProgress = [80, 40, 20];

  // Components
  const CircularProgress = ({ percentage, size = 60 }) => {
    const radius = (size - 8) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={darkMode ? "#374151" : "#e5e7eb"}
            strokeWidth="6"
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#3b82f6"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {percentage}%
          </span>
        </div>
      </div>
    );
  };

  // API Functions
  const fakeApiAddGoal = (goal) => new Promise((resolve, reject) => 
    setTimeout(() => Math.random() > 0.2 ? resolve(goal) : reject(new Error('API error')), 1000)
  );

  // Event Handlers
  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!goalForm.name || !goalForm.target || !goalForm.contributionValue || !goalForm.frequency) {
      setGoalError('Please fill in all required fields.');
      return;
    }
    
    const newGoal = {
      id: Date.now(),
      name: goalForm.name,
      current: 0,
      target: Number(goalForm.target),
      progress: 0,
      icon: goalForm.icon,
      deadline: goalForm.deadline,
      frequency: goalForm.frequency,
      contributionType: goalForm.contributionType,
      contributionValue: goalForm.contributionValue
    };
    
    optimisticUpdate({
      update: () => setSavingsGoals(prev => [...prev, newGoal]),
      request: () => fakeApiAddGoal(newGoal),
      rollback: () => setSavingsGoals(prev => prev.filter(g => g.id !== newGoal.id)),
      onError: () => setGoalError('Failed to add goal. Please try again.')
    });
    
    setShowGoalModal(false);
    setGoalForm({
      name: '',
      target: '',
      contributionType: 'fixed',
      contributionValue: '',
      deadline: '',
      frequency: 'monthly',
      icon: '💰',
    });
    setGoalError('');
  };

  // Header Component
  const DashboardHeader = () => (
    <div>
      <header className={`max-w-6xl mx-auto px-4 py-4 md:py-6 rounded-2xl shadow-lg ${
        darkMode 
          ? 'bg-[#181c23]/90 border border-[#23283a] shadow-[0_2px_24px_#0a0c12cc]'
          : 'bg-white/80 border border-white/20'
      } backdrop-blur-md flex items-center justify-between mb-4 transition-all duration-300`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${
            darkMode 
              ? 'bg-gradient-to-br from-blue-600 to-blue-800' 
              : 'bg-gradient-to-br from-blue-500 to-blue-700'
          } flex items-center justify-center shadow-sm transition-colors duration-300`}>
            <img src="/Logo2.svg" alt="Gyde Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h1 className={`text-lg md:text-2xl font-bold leading-tight mb-1 ${
              darkMode ? 'text-gray-100' : 'text-gray-900'
            } transition-colors duration-300`}>
              Welcome back, <span className={
                darkMode
                  ? 'text-blue-300 drop-shadow-sm'
                  : 'text-blue-600'
              }>{loading ? '...' : (user?.name || 'User')}</span>
            </h1>
            <p className={`text-xs md:text-sm font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            } transition-colors duration-300`}>
              Let's manage your finances today
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4 relative">
          <button
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode 
                ? 'bg-gray-700/50 hover:bg-gray-600/50' 
                : 'bg-blue-50 hover:bg-blue-100'
            } transition-all duration-200`}
            aria-label="Customer care"
            onClick={() => navigate('/customer')}
          >
            <Headset className="w-5 h-5 text-blue-500" />
          </button>
          <button
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode 
                ? 'bg-gray-700/50 hover:bg-gray-600/50' 
                : 'bg-gray-100 hover:bg-gray-200'
            } transition-all duration-200`}
            onClick={toggleDarkMode}
            aria-label="Toggle theme"
          >
            {darkMode ? 
              <Sun className="w-5 h-5 text-yellow-400" /> : 
              <Moon className="w-5 h-5 text-gray-600" />
            }
          </button>
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className={`w-10 h-10 rounded-xl overflow-hidden border-2 ${
                darkMode ? 'border-gray-600' : 'border-blue-100'
              } flex items-center justify-center transition-colors duration-300`}
              onClick={() => setShowProfileMenu(v => !v)}
              aria-label="Profile"
              style={{ padding: 0 }}
            >
              {user?.profilePic || user?.profilePicture ? (
                <img
                  src={user?.profilePic || user?.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={e => { e.target.onerror = null; e.target.src = "/logo192.png"; }}
                />
              ) : (
                <User className="w-6 h-6 text-blue-600" />
              )}
            </button>
            {showProfileMenu && ReactDOM.createPortal(
              <div className={`fixed top-20 right-8 min-w-[10rem] rounded-xl shadow-lg z-[99999] border ${
                darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
              }`} style={{ boxShadow: '0 8px 32px 8px rgba(0,0,0,0.25)' }}>
                <button
                  className="flex items-center w-full px-4 py-3 text-gray-700 dark:text-gray-200 font-semibold gap-2 hover:bg-blue-50 dark:hover:bg-gray-800"
                  onClick={() => { setShowProfileMenu(false); navigate('/profile'); }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM21 20a7 7 0 0 0-14 0"/></svg>
                  <span>Profile</span>
                </button>
                <button
                  className="flex items-center w-full px-4 py-3 text-blue-700 font-semibold gap-2 hover:bg-blue-50 dark:hover:bg-gray-800"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setUser(null);
                    localStorage.removeItem('token');
                    navigate('/login');
                  }}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 17v1a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1M7 12h14m0 0-3-3m3 3-3 3"/></svg>
                  <span>Logout</span>
                </button>
              </div>,
              document.body
            )}
          </div>
        </div>
  
      </header>
      <div className="max-w-6xl mx-auto px-4">
        <div className={`border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } mb-4 transition-colors duration-300`} />
      </div>
    </div>
  );

  // Budget Tracking Component
  const BudgetTracking = () => (
    <div className={`flex-1 rounded-3xl p-2 md:p-6 ${
      darkMode 
        ? 'bg-[#181c23]/80 border border-[#23283a] shadow-[0_2px_16px_#0a0c12cc]'
        : 'bg-white/70 border border-white/20'
    } backdrop-blur-sm shadow-lg transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <span className={`text-base md:text-xl font-semibold ${
          darkMode ? 'text-gray-100' : 'text-gray-900'
        } transition-colors duration-300`}>
          Budget Tracking
        </span>
        <button
          className={`p-1 md:p-2 rounded-full ${
            darkMode 
              ? 'hover:bg-gray-700/50' 
              : 'hover:bg-blue-100'
          } transition-all duration-200`}
          aria-label="Go to Detailed Expenses"
          onClick={() => navigate('/statistics')}
        >
          <PieChart className="w-5 h-5 md:w-7 md:h-7 text-blue-600" />
        </button>
      </div>
      <div className="space-y-3 md:space-y-4">
        {budgetCategories.map((category, index) => (
          <div key={index} className={`p-3 md:p-4 rounded-2xl ${
            darkMode 
              ? 'bg-gray-700/50 border border-gray-600/50' 
              : 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200'
          } shadow-sm flex items-center gap-3 transition-all duration-300 hover:shadow-md`}>
            <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-sm transition-colors duration-300`}>
              {budgetCategoryIcons[index]}
            </div>
            <div className="flex-1">
              <p className={`font-semibold mb-1 text-xs md:text-base ${
                darkMode ? 'text-gray-100' : 'text-gray-800'
              } transition-colors duration-300`}>
                {category.name}
              </p>
              <div className="flex items-center gap-2">
                <span className={`font-bold text-sm md:text-lg ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                } transition-colors duration-300`}>
                  {category.amount}
                </span>
                <span className={`text-xs font-medium ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                } transition-colors duration-300`}>
                  ({budgetCategoryProgress[index]}%)
                </span>
              </div>
              <div className={`w-full h-2 rounded-full mt-1 ${
                darkMode ? 'bg-gray-600' : 'bg-blue-100'
              } transition-colors duration-300`}>
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === 0 ? 'bg-blue-500' : 
                    index === 1 ? 'bg-orange-500' : 'bg-pink-500'
                  }`}
                  style={{ width: `${budgetCategoryProgress[index]}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Savings Goals Component
  const SavingsGoals = ({ onAddGoal }) => {
    const { savingsGoals } = useContext(SavingsGoalsContext);

    return (
      <div className={`flex-1 rounded-3xl p-2 md:p-6 ${
        darkMode 
          ? 'bg-[#181c23]/80 border border-[#23283a] shadow-[0_2px_16px_#0a0c12cc]'
          : 'bg-white/70 border border-white/20'
      } backdrop-blur-sm shadow-lg transition-all duration-300`}>
        <div className="mb-2 md:mb-6">
          <span className={`text-base md:text-xl font-semibold ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          } transition-colors duration-300`}>
            Savings Goals
          </span>
        </div>
        {savingsGoals.length === 0 && (
          <div className="flex flex-col items-center mb-2 md:mb-4">
            <div className={`w-28 h-28 md:w-32 md:h-32 mb-4 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            } rounded-full flex items-center justify-center transition-colors duration-300`}>
              <img src="/svp2.png" alt="Savings Piggy" className="w-22 h-22 md:w-43 md:h-43 object-contain" />
            </div>
            <p className={`text-center text-xs md:text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            } transition-colors duration-300`}>
              Ready to save? Add your first goal
            </p>
          </div>
        )}
        <div className="space-y-2 md:space-y-4 mb-2 md:mb-6">
          {savingsGoals.map((goal) => (
            <div key={goal.id} className={`flex items-center justify-between p-2 md:p-4 rounded-2xl ${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
            } transition-colors duration-300`}>
              <div className="flex-1">
                <p className={`font-medium mb-1 text-xs md:text-base ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                } transition-colors duration-300`}>
                  {goal.icon} {goal.name}
                </p>
                <p className={`font-semibold text-xs md:text-base ${
                  darkMode ? 'text-blue-400' : 'text-blue-600'
                } transition-colors duration-300`}>
                  ₦{goal.current.toLocaleString()} / ₦{goal.target.toLocaleString()}
                </p>
              </div>
              <CircularProgress percentage={goal.progress} size={32} />
            </div>
          ))}
        </div>
        <button 
          onClick={onAddGoal} 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 md:py-3 px-3 md:px-4 rounded-2xl mt-2 md:mt-6 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm md:text-base"
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span>Add Goal</span>
        </button>
      </div>
    );
  };

  return (
    <BalanceContext.Provider value={{ balance }}>
      <SavingsGoalsContext.Provider value={{ savingsGoals, setSavingsGoals }}>
        <div className={`min-h-screen transition-all duration-500 ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-gray-100' 
            : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-800'
        } pb-24`}>
          
          {/* Header Section */}
          <DashboardHeader />

          {/* Balance Card Section */}
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <div className={`rounded-3xl p-8 text-white shadow-2xl transition-all duration-500 ${
              darkMode 
                ? 'bg-gradient-to-br from-[#1a2233] via-[#23283a] to-[#181c23] border border-[#23283a] shadow-[0_2px_32px_#0a0c12cc]'
                : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800'
            } backdrop-blur-sm`}>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold mb-2 transition-all duration-300">
                    {showBalance ? `₦${balance.toLocaleString()}` : '•••••••'}
                  </h2>
                  <p className={`text-lg ${
                    darkMode ? 'text-gray-300' : 'text-blue-100'
                  } transition-colors duration-300`}>
                    Total Balance
                  </p>
                </div>
                <button
                  onClick={() => setShowBalance(v => !v)}
                  className={`ml-4 p-3 rounded-full ${
                    darkMode 
                      ? 'bg-gray-700/50 hover:bg-gray-600/50' 
                      : 'bg-white/20 hover:bg-white/30'
                  } transition-all duration-200 backdrop-blur-sm`}
                  aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                >
                  {showBalance ? (
                    <EyeOff className="w-6 h-6 text-white" />
                  ) : (
                    <Eye className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm mb-1 ${
                    darkMode ? 'text-gray-300' : 'text-blue-100'
                  } transition-colors duration-300`}>
                    Daily Budget
                  </p>
                  <p className="text-2xl font-semibold">₦5,000</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold">{user?.loginStreak ?? 0}</span>
                  <Flame className="w-8 h-8 text-orange-400 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-6 pb-8">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-row md:flex-col gap-2 md:gap-6">
              <BudgetTracking />
              <SavingsGoals onAddGoal={() => setShowGoalModal(true)} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Recent Activities Card */}
              <div className={`rounded-3xl p-6 shadow-2xl transition-all duration-500 ${
                darkMode 
                  ? 'bg-gradient-to-r from-[#2a1a13]/90 to-[#3a1a1a]/90 border border-[#23283a] shadow-[0_2px_24px_#1a0a0acc]'
                  : 'bg-gradient-to-r from-orange-400 to-red-500'
              } backdrop-blur-sm`}>
                <h3 className="text-xl font-semibold text-white mb-6">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className={`rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] ${
                      darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white'
                    } shadow-lg`}>
                      <div className="flex-shrink-0">{activity.icon}</div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          darkMode ? 'text-gray-100' : 'text-gray-900'
                        } transition-colors duration-300`}>
                          {activity.text}
                        </p>
                        {activity.time && (
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          } transition-colors duration-300`}>
                            {activity.time}
                          </p>
                        )}
                      </div>
                      {activity.amount && (
                        <div className="text-right">
                          <p className="text-green-600 font-semibold text-sm">{activity.amount}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Goal Modal */}
          {showGoalModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setShowGoalModal(false)}
              />
              <div className={`relative w-full max-w-md rounded-3xl p-6 pb-24 shadow-2xl transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800/95 border border-gray-700/50' 
                  : 'bg-white/95 border border-white/20'
              } backdrop-blur-md md:max-h-[90vh] md:overflow-y-auto`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-xl font-bold ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                  } transition-colors duration-300`}>
                    Add Savings Goal
                  </h2>
                  <button
                    onClick={() => setShowGoalModal(false)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      darkMode 
                        ? 'hover:bg-gray-700/50 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleGoalSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="goalName" className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    } transition-colors duration-300`}>
                      Goal Name
                    </label>
                    <input
                      type="text"
                      id="goalName"
                      value={goalForm.name}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full p-3 rounded-xl border transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-500' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500/20`}
                      placeholder="e.g., Vacation Fund"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="targetAmount" className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    } transition-colors duration-300`}>
                      Target Amount
                    </label>
                    <input
                      type="number"
                      id="targetAmount"
                      value={goalForm.target}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, target: e.target.value }))}
                      className={`w-full p-3 rounded-xl border transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-500' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500/20`}
                      placeholder="₦1,000,000"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contributionType" className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    } transition-colors duration-300`}>
                      Contribution Type
                    </label>
                    <select
                      id="contributionType"
                      value={goalForm.contributionType}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, contributionType: e.target.value }))}
                      className={`w-full p-3 rounded-xl border transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-500' 
                          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500/20`}
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage of Income</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contributionValue" className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    } transition-colors duration-300`}>
                      {goalForm.contributionType === 'fixed' ? 'Contribution Amount' : 'Contribution Percentage'}
                    </label>
                    <input
                      type="number"
                      id="contributionValue"
                      value={goalForm.contributionValue}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, contributionValue: e.target.value }))}
                      className={`w-full p-3 rounded-xl border transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-500' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500/20`}
                      placeholder={goalForm.contributionType === 'fixed' ? '₦50,000' : '10'}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="deadline" className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    } transition-colors duration-300`}>
                      Deadline
                    </label>
                    <input
                      type="date"
                      id="deadline"
                      value={goalForm.deadline}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, deadline: e.target.value }))}
                      className={`w-full p-3 rounded-xl border transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-500' 
                          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500/20`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="frequency" className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    } transition-colors duration-300`}>
                      Frequency
                    </label>
                    <select
                      id="frequency"
                      value={goalForm.frequency}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, frequency: e.target.value }))}
                      className={`w-full p-3 rounded-xl border transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700/50 text-white focus:border-blue-500' 
                          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500/20`}
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="icon" className={`block text-sm font-medium mb-1 ${
                      darkMode ? 'text-gray-200' : 'text-gray-700'
                    } transition-colors duration-300`}>
                      Icon
                    </label>
                    <input
                      type="text"
                      id="icon"
                      value={goalForm.icon}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, icon: e.target.value }))}
                      className={`w-full p-3 rounded-xl border transition-all duration-300 ${
                        darkMode 
                          ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-500' 
                          : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500'
                      } focus:ring-2 focus:ring-blue-500/20`}
                      placeholder="e.g., 💰, 🎉, 🚗"
                      required
                    />
                  </div>
                  {goalError && (
                    <div className={`p-3 rounded-lg ${
                      darkMode ? 'bg-red-900/50 border border-red-700' : 'bg-red-50 border border-red-200'
                    } transition-colors duration-300`}>
                      <p className="text-red-500 text-sm font-medium">{goalError}</p>
                    </div>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-2xl mt-6 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] font-medium"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Goal</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} darkMode={darkMode} />
      </SavingsGoalsContext.Provider>
    </BalanceContext.Provider>
  );
}
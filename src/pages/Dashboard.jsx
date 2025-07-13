import React, { useState } from 'react';
import { Plus, Flame, CheckCircle, Sun, Moon, Menu, X, Home, TrendingUp, Target, Settings, User } from 'lucide-react';

export default function GydeDashboard() {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({
    name: '',
    target: '',
    contributionType: 'fixed',
    contributionValue: '',
    deadline: '',
    frequency: '',
    icon: '💰',
  });
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [balance] = useState(500000);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const budgetCategories = [
    { name: 'Recurring Expenses', amount: '₦90,000' },
    { name: 'Non-recurring Expenses', amount: '₦30,000' },
    { name: 'Cheat Day', amount: '₦10,000' }
  ];

  const savingsGoals = [
    { name: 'Emergency Fund', current: 30000, target: 100000, progress: 30 },
    { name: 'School Fees', current: 175000, target: 250000, progress: 70 },
    { name: 'IPad', current: 240000, target: 400000, progress: 60 }
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

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    // Here you would normally save the goal to your state or backend
    console.log('New goal:', goalForm);
    setShowGoalModal(false);
    setGoalForm({
      name: '',
      target: '',
      contributionType: 'fixed',
      contributionValue: '',
      deadline: '',
      frequency: '',
      icon: '💰',
    });
  };

  const BottomNav = () => {
    const navItems = [
      { id: 'home', icon: Home, label: 'Home' },
      { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
      { id: 'goals', icon: Target, label: 'Goals' },
      { id: 'settings', icon: Settings, label: 'Settings' },
      { id: 'profile', icon: User, label: 'Profile' },
    ];

    return (
      <div className={`fixed bottom-0 left-0 right-0 z-40 ${
        darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      } border-t`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400' 
                      : darkMode 
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-100' 
        : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800'
    }`}>
      {/* Header */}
      <header className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              G
            </div>
            <div>
              <h1 className="text-lg font-semibold">
                Welcome back, <span className="text-blue-600">David Alfredo</span>
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Let's manage your finances today
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 ${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50 shadow-sm'
              }`}
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-blue-200 dark:border-gray-700">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className={`rounded-3xl p-8 text-white ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
            : 'bg-gradient-to-br from-blue-600 to-blue-800'
        }`}>
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2">₦{balance.toLocaleString()}</h2>
            <p className="text-blue-100 text-lg">Total Balance</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Daily Budget</p>
              <p className="text-2xl font-semibold">₦5,000</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">30</span>
              <Flame className="w-8 h-8 text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-6 pb-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Budget Tracking */}
          <div className={`rounded-3xl p-6 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white shadow-sm'
          }`}>
            <h3 className="text-xl font-semibold mb-6">Budget Tracking</h3>
            <div className="space-y-4">
              {budgetCategories.map((category, index) => (
                <div key={index} className={`p-4 rounded-2xl ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <p className="font-medium mb-1">{category.name}</p>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">
                    {category.amount}
                  </p>
                </div>
              ))}
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-2xl mt-6 flex items-center justify-center gap-2 transition-colors">
              <Plus className="w-5 h-5" />
              <span>Add Category</span>
            </button>
          </div>

          {/* Savings Goals */}
          <div className={`rounded-3xl p-6 ${
            darkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-white shadow-sm'
          }`}>
            <h3 className="text-xl font-semibold mb-6">Savings Goals</h3>
            <div className="space-y-4">
              {savingsGoals.map((goal, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-2xl ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className="flex-1">
                    <p className="font-medium mb-1">{goal.name}</p>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold">
                      ₦{goal.current.toLocaleString()} / ₦{goal.target.toLocaleString()}
                    </p>
                  </div>
                  <CircularProgress percentage={goal.progress} size={50} />
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowGoalModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-2xl mt-6 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Goal</span>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activities */}
          <div className={`rounded-3xl p-6 ${
            darkMode 
              ? 'bg-gradient-to-r from-orange-900 to-red-900 border border-gray-700' 
              : 'bg-gradient-to-r from-orange-400 to-red-500'
          }`}>
            <h3 className="text-xl font-semibold text-white mb-6">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className={`rounded-2xl p-4 flex items-center gap-3 ${
                  darkMode ? 'bg-gray-900' : 'bg-white'
                }`}>
                  <div className="flex-shrink-0">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium">{activity.text}</p>
                    {activity.time && (
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowGoalModal(false)}
          />
          <div className={`relative w-full max-w-md rounded-3xl p-6 ${
            darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Add Savings Goal</h2>
              <button
                onClick={() => setShowGoalModal(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Deadline (optional)</label>
                <input
                  type="date"
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'border-gray-700 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  value={goalForm.deadline}
                  onChange={e => setGoalForm(f => ({ ...f, deadline: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Frequency</label>
                <select
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'border-gray-700 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  value={goalForm.frequency}
                  onChange={e => setGoalForm(f => ({ ...f, frequency: e.target.value }))}
                >
                  <option value="">Select frequency</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Icon</label>
                <select
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'border-gray-700 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  value={goalForm.icon}
                  onChange={e => setGoalForm(f => ({ ...f, icon: e.target.value }))}
                >
                  <option value="💰">💰 Money</option>
                  <option value="🎓">🎓 Education</option>
                  <option value="🏠">🏠 Home</option>
                  <option value="🚗">🚗 Car</option>
                  <option value="🛍️">🛍️ Shopping</option>
                  <option value="✈️">✈️ Travel</option>
                  <option value="📱">📱 Gadget</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleGoalSubmit}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  Save Goal
                </button>
              </div>
            </div><label className="block text-sm font-medium mb-2">Goal Name</label>
                <input
                  type="text"
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'border-gray-700 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  placeholder="e.g., Emergency Fund"
                  value={goalForm.name}
                  onChange={e => setGoalForm(f => ({ ...f, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Target Amount</label>
                <input
                  type="number"
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'border-gray-700 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  placeholder="100000"
                  value={goalForm.target}
                  onChange={e => setGoalForm(f => ({ ...f, target: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Contribution Type</label>
                <select
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'border-gray-700 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  value={goalForm.contributionType}
                  onChange={e => setGoalForm(f => ({ ...f, contributionType: e.target.value }))}
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage of Income</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  {goalForm.contributionType === 'fixed' ? 'Amount per period' : 'Percentage per period'}
                </label>
                <input
                  type="number"
                  className={`w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode 
                      ? 'border-gray-700 bg-gray-800 text-white' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  placeholder={goalForm.contributionType === 'fixed' ? '5000' : '10'}
                  value={goalForm.contributionValue}
                  onChange={e => setGoalForm(f => ({ ...f, contributionValue: e.target.value }))}
                />
              </div>
              
              <div>
                
          </div>
        </div>
      )}
      <BottomNav /> {/* <-- Add this line at the end */}
    </div>
  );
}

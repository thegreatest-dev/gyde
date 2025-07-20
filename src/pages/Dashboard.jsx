import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Flame, CheckCircle, Sun, Moon, Menu, X, Home, TrendingUp, Target, Settings, User, Eye, EyeOff, Headset, PieChart } from 'lucide-react';
import BottomNav from '../Components/BottomNav';
import { useTheme } from '../Components/ThemeContext';
import { SavingsGoalsContext, BalanceContext } from './Statistics';
import { optimisticUpdate } from '../optimisticUpdate';
import { useContext } from 'react';
import { ThemeContext } from '../Components/ThemeContext';

export default function GydeDashboard() {
  // Navigation and Theme
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  
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
    frequency: '',
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
    <PieChart className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />, // Recurring
    <PieChart className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />, // Non-recurring
    <PieChart className="w-5 h-5 md:w-6 md:h-6 text-pink-500" /> // Cheat Day
  ];

  const budgetCategoryProgress = [80, 40, 20]; // Example progress values

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
    // Validation: require name, target, contributionValue, frequency
    if (!goalForm.name || !goalForm.target || !goalForm.contributionValue || !goalForm.frequency) {
      setGoalError('Please fill in all required fields.');
      return;
    }
    
    // Calculate progress (0% for new goal)
    const newGoal = {
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
      rollback: () => setSavingsGoals(prev => prev.filter(g => g !== newGoal)),
      onError: () => setGoalError('Failed to add goal. Please try again.')
    });
    
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
    setGoalError('');
  };

  // Header Component
  const DashboardHeader = () => {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
      <div>
        <header className="max-w-6xl mx-auto px-4 py-4 md:py-6 rounded-2xl shadow bg-white/80 dark:bg-gray-900/80 backdrop-blur-md flex items-center justify-between mt-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
              <img src="/Logo2.svg" alt="Gyde Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold leading-tight mb-1">Welcome back, <span className="text-blue-600">David Alfredo</span></h1>
              <p className="text-xs md:text-sm text-muted-foreground font-medium">Let’s manage your finances today</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-transparent hover:bg-blue-100 dark:hover:bg-gray-800 transition" aria-label="Customer care">
              <Headset className="w-5 h-5 text-blue-500" />
            </button>
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-transparent hover:bg-blue-100 dark:hover:bg-gray-800 transition"
              onClick={toggleDarkMode}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
            <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-blue-100 dark:border-gray-700 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>
        <div className="max-w-6xl mx-auto px-4">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4" />
        </div>
      </div>
    )
  }

  // Budget Tracking Component
  const BudgetTracking = () => {
    const budgetCategories = [
      { name: "Recurring Expenses", amount: "₦90,000" },
      { name: "Non-recurring Expenses", amount: "₦30,000" },
      { name: "Cheat Day", amount: "₦10,000" },
    ]

    return (
      <div className="flex-1 rounded-3xl p-2 md:p-6 bg-white shadow-sm dark:bg-gray-800 border dark:border-gray-700">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <span className="text-base md:text-xl font-semibold">Budget Tracking</span>
          <button className="p-1 md:p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-800 transition" aria-label="Go to Detailed Expenses">
            <PieChart className="w-5 h-5 md:w-7 md:h-7 text-blue-600" />
          </button>
        </div>
        <div className="space-y-3 md:space-y-4">
          {budgetCategories.map((category, index) => (
            <div key={index} className="p-3 md:p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 border border-blue-100 dark:border-gray-700 shadow flex items-center gap-3">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-white dark:bg-gray-900 shadow">
                {budgetCategoryIcons[index]}
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-1 text-xs md:text-base text-gray-800 dark:text-gray-100">{category.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm md:text-lg">{category.amount}</span>
                  <span className="text-xs text-gray-400 font-medium">({budgetCategoryProgress[index]}%)</span>
                </div>
                <div className="w-full h-2 bg-blue-100 dark:bg-gray-700 rounded-full mt-1">
                  <div
                    className={`h-2 rounded-full ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-orange-500' : 'bg-pink-500'}`}
                    style={{ width: `${budgetCategoryProgress[index]}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Savings Goals Component
  const SavingsGoals = ({ onAddGoal }) => {
    const { savingsGoals } = useContext(SavingsGoalsContext);

    return (
      <div className="flex-1 rounded-3xl p-2 md:p-6 bg-white shadow-sm dark:bg-gray-800 border dark:border-gray-700">
        <div className="mb-2 md:mb-6">
          <span className="text-base md:text-xl font-semibold">Savings Goals</span>
        </div>
        {savingsGoals.length === 0 && (
          <div className="flex flex-col items-center mb-2 md:mb-4">
            <div className="w-28 h-28 md:w-50 md:h-50 mb-2 bg-muted rounded-full flex items-center justify-center">
              <img src="/svp2.png" alt="Savings Piggy" className="w-22 h-22 md:w-43 md:h-43 object-contain" />
            </div>
            <p className="text-center text-xs md:text-sm text-muted-foreground">Ready to save? Add your first goal</p>
          </div>
        )}
        <div className="space-y-2 md:space-y-4 mb-2 md:mb-6">
          {savingsGoals.map((goal) => (
            <div key={goal.id} className="flex items-center justify-between p-2 md:p-4 rounded-2xl bg-muted">
              <div className="flex-1">
                <p className="font-medium mb-1 text-xs md:text-base">
                  {goal.icon} {goal.name}
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-semibold text-xs md:text-base">
                  ₦{goal.current.toLocaleString()} / ₦{goal.target.toLocaleString()}
                </p>
              </div>
              <CircularProgress percentage={goal.progress} size={32} />
            </div>
          ))}
        </div>
        <button onClick={onAddGoal} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 md:py-3 px-3 md:px-4 rounded-2xl mt-2 md:mt-6 flex items-center justify-center gap-2 transition-colors text-sm md:text-base">
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
          <span>Add Goal</span>
        </button>
      </div>
    )
  }

  return (
    <BalanceContext.Provider value={{ balance }}>
      <SavingsGoalsContext.Provider value={{ savingsGoals, setSavingsGoals }}>
        <div className={`min-h-screen transition-all duration-300 ${
          darkMode 
            ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-100' 
            : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800'
        } pb-24`}>
          
          {/* Header Section */}
          <DashboardHeader />

          {/* Balance Card Section */}
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <div className={`rounded-3xl p-8 text-white ${
              darkMode 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                : 'bg-gradient-to-br from-blue-600 to-blue-800'
            }`}>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold mb-2">
                    {showBalance ? `₦${balance.toLocaleString()}` : '•••••••'}
                  </h2>
                  <p className="text-blue-100 text-lg">Total Balance</p>
                </div>
                <button
                  onClick={() => setShowBalance(v => !v)}
                  className="ml-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
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

          {/* Main Content Section */}
          <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-3 gap-6 pb-8">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-row md:flex-col gap-2 md:gap-6">
              {/* Budget Tracking Card */}
              <BudgetTracking />

              {/* Savings Goals Card */}
              <SavingsGoals onAddGoal={() => setShowGoalModal(true)} />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Recent Activities Card */}
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
              <div className={`relative w-full max-w-md rounded-3xl p-6 pb-24 ${
                darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'
              } md:max-h-[90vh] md:overflow-y-auto scrollbar-hide`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Add Savings Goal</h2>
                  <button
                    onClick={() => setShowGoalModal(false)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleGoalSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="goalName" className="block text-sm font-medium mb-1">Goal Name</label>
                    <input
                      type="text"
                      id="goalName"
                      value={goalForm.name}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="e.g., Vacation Fund"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="targetAmount" className="block text-sm font-medium mb-1">Target Amount</label>
                    <input
                      type="number"
                      id="targetAmount"
                      value={goalForm.target}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, target: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="₦1,000,000"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="contributionType" className="block text-sm font-medium mb-1">Contribution Type</label>
                    <select
                      id="contributionType"
                      value={goalForm.contributionType}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, contributionType: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage of Income</option>
                    </select>
                  </div>
                  {goalForm.contributionType === 'fixed' && (
                    <div>
                      <label htmlFor="contributionValue" className="block text-sm font-medium mb-1">Contribution Value</label>
                      <input
                        type="number"
                        id="contributionValue"
                        value={goalForm.contributionValue}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, contributionValue: e.target.value }))}
                        className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        placeholder="₦50,000"
                        required
                      />
                    </div>
                  )}
                  {goalForm.contributionType === 'percentage' && (
                    <div>
                      <label htmlFor="contributionPercentage" className="block text-sm font-medium mb-1">Contribution Percentage</label>
                      <input
                        type="number"
                        id="contributionPercentage"
                        value={goalForm.contributionValue}
                        onChange={(e) => setGoalForm(prev => ({ ...prev, contributionValue: e.target.value }))}
                        className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                        placeholder="10%"
                        required
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium mb-1">Deadline</label>
                    <input
                      type="date"
                      id="deadline"
                      value={goalForm.deadline}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, deadline: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="frequency" className="block text-sm font-medium mb-1">Frequency</label>
                    <select
                      id="frequency"
                      value={goalForm.frequency}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, frequency: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="icon" className="block text-sm font-medium mb-1">Icon</label>
                    <input
                      type="text"
                      id="icon"
                      value={goalForm.icon}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="e.g., 💰, 🎉, 🚗"
                      required
                    />
                  </div>
                  {goalError && (
                    <p className="text-red-500 text-sm">{goalError}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-2xl mt-6 flex items-center justify-center gap-2 transition-colors"
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
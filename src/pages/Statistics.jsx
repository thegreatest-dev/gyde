import React, { useState, useContext, createContext } from 'react';
import BottomNav from '../Components/BottomNav';
import {
  ChevronDown,
  ChevronUp,
  Plus,
  PiggyBank,
  DollarSign,
  Home,
  CreditCard,
  Wallet,
  Settings
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTheme } from '../Components/ThemeContext';
import { optimisticUpdate } from '../optimisticUpdate';

// Context for sharing savings goals between Dashboard and Statistics
export const SavingsGoalsContext = createContext();
export const BalanceContext = createContext();

const BudgetingPreferences = () => {
  const { darkMode } = useTheme();
  const [expandedSections, setExpandedSections] = useState({
    lightHeavyDays: true,
    monthlyBudget: true,
    generalSavings: true,
    goalSavings: true,
    rolloverSettings: true
  });
  const [showSecondPart, setShowSecondPart] = useState(false);

  const [dailyBudgetEnabled, setDailyBudgetEnabled] = useState(true);
  const [lightDaysAmount, setLightDaysAmount] = useState(30000);
  const [heavyDaysAmount, setHeavyDaysAmount] = useState(300000);
  const [deductionType, setDeductionType] = useState('percentage');
  const [fixedCheatAmount, setFixedCheatAmount] = useState('');
  const [cheatAmountError, setCheatAmountError] = useState('');
  const [savingsPercentage, setSavingsPercentage] = useState(20);
  const [cheatPercentageError, setCheatPercentageError] = useState('');
  const [specialDates, setSpecialDates] = useState([]);
  const totalBalance = 500000;
  const maxCheatAmount = totalBalance * 0.25;
  const [cheatDayEnabled, setCheatDayEnabled] = useState(true);

  const { savingsGoals } = useContext(SavingsGoalsContext) || { savingsGoals: [] };

  const [rolloverOption, setRolloverOption] = useState('bank');

  // Weekday selection state for daily budgeting
  const weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const [selectedDays, setSelectedDays] = useState([]); // store indices of selected days
  const [weekdayError, setWeekdayError] = useState('');

  const handleDayClick = (idx) => {
    if (selectedDays.includes(idx)) {
      // Deselect
      setSelectedDays(selectedDays.filter(i => i !== idx));
      setWeekdayError('');
    } else {
      if (selectedDays.length >= 3) {
        setWeekdayError('You can only select up to 3 days.');
        return;
      }
      setSelectedDays([...selectedDays, idx]);
      setWeekdayError('');
    }
  };

  // Calculate cheat day value for the chart
  let cheatDayValue = 0;
  if (cheatDayEnabled) {
    if (deductionType === 'percentage') {
      cheatDayValue = savingsPercentage;
    } else if (deductionType === 'fixed' && totalBalance > 0) {
      cheatDayValue = Math.round((Number(fixedCheatAmount) / totalBalance) * 100);
    }
    if (isNaN(cheatDayValue) || cheatDayValue < 0) cheatDayValue = 0;
    if (cheatDayValue > 25) cheatDayValue = 25;
  }
  // Recurring starts at 70%, Non-Recurring at 30%, Cheat Fund is user input (max 25%)
  const baseRecurring = 70;
  const baseNonRecurring = 30;
  const recurringValue = Math.max(0, baseRecurring - cheatDayValue);
  const expenseData = [
    { name: 'Recurring Expenses', value: recurringValue, color: '#0d9488' },
    { name: 'Non-Recurring Expenses', value: baseNonRecurring, color: '#f97316' },
    { name: 'Cheat Day Fund', value: cheatDayEnabled ? cheatDayValue : 0, color: '#0f172a' }
  ];

  const [showDateModal, setShowDateModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState('Payday Splurge');
  const [newAmount, setNewAmount] = useState('');
  const [dateError, setDateError] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Save preferences handler
  const handleSavePreferences = () => {
    const preferences = {
      dailyBudgetEnabled,
      lightDaysAmount,
      heavyDaysAmount,
      deductionType,
      fixedCheatAmount,
      savingsPercentage,
      specialDates,
      cheatDayEnabled,
      selectedDays,
      rolloverOption,
    };
    localStorage.setItem('gyde_statistics_preferences', JSON.stringify(preferences));
    // Optionally, show a success message or feedback
    alert('Preferences saved!');
  };

  // Fake API call for optimistic update demo
  const fakeApiAddSpecialDate = (dateObj) => new Promise((resolve, reject) => setTimeout(() => Math.random() > 0.2 ? resolve(dateObj) : reject(new Error('API error')), 1000));

  const handleAddSpecialDate = (dateObj) => {
    optimisticUpdate({
      update: () => setSpecialDates(prev => [...prev, dateObj]),
      request: () => fakeApiAddSpecialDate(dateObj),
      rollback: () => setSpecialDates(prev => prev.filter(d => d !== dateObj)),
      onError: () => setDateError('Failed to add date. Please try again.')
    });
  };

  return (
    <div className={`min-h-screen pb-32 transition-all duration-300 ${
      darkMode
        ? 'bg-gray-900 text-white'
        : 'bg-gray-50 text-gray-900'
    }`}>
      <header className={`border-b shadow-sm ${
        darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
          <h1 className="text-2xl font-bold">Budgeting Preferences</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {!showSecondPart ? (
          <>
            {/* Daily Budgeting Settings */}
            <section className={`rounded-2xl shadow-sm border p-6 mb-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl">💰</div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Daily Budgeting Settings</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Configure how your budget is allocated on a daily basis</p>
              <div className={`flex space-x-2 mb-4 ${!dailyBudgetEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                {weekdayLabels.map((day, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDayClick(i)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center font-semibold text-lg shadow-sm border transition-colors duration-150 focus:outline-none
                      ${selectedDays.includes(i)
                        ? 'bg-teal-500 text-white border-teal-600'
                        : 'bg-orange-500 text-white border-orange-600 hover:bg-orange-400'}
                      ${darkMode ? '' : ''}`}
                    aria-pressed={selectedDays.includes(i)}
                    disabled={!dailyBudgetEnabled}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {weekdayError && (
                <div className="text-red-500 text-sm font-medium mb-2">{weekdayError}</div>
              )}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 ${!dailyBudgetEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className={`flex items-center rounded-lg px-4 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className={`font-medium flex-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Light Days</span>
                  <input
                    type="number"
                    value={lightDaysAmount}
                    onChange={(e) => setLightDaysAmount(Number(e.target.value))}
                    className={`w-24 px-2 py-1 border rounded text-right mr-2 ${darkMode ? 'border-gray-600 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-700'}`}
                    disabled={!dailyBudgetEnabled}
                  />
                  <div className="w-4 h-4 bg-orange-500 rounded" />
                </div>
                <div className={`flex items-center rounded-lg px-4 py-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <span className={`font-medium flex-1 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Heavy Days</span>
                  <input
                    type="number"
                    value={heavyDaysAmount}
                    onChange={(e) => setHeavyDaysAmount(Number(e.target.value))}
                    className={`w-24 px-2 py-1 border rounded text-right mr-2 ${darkMode ? 'border-gray-600 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-700'}`}
                    disabled={!dailyBudgetEnabled}
                  />
                  <div className="w-4 h-4 bg-teal-500 rounded" />
                </div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">Enable Daily Budgeting</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={dailyBudgetEnabled} onChange={() => setDailyBudgetEnabled(!dailyBudgetEnabled)} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500 rounded-full peer dark:bg-gray-700 peer-checked:bg-teal-500 transition-colors" />
                </label>
              </div>
              <div>
                <h4 className="font-medium mb-2">Special Dates</h4>
                {specialDates.length === 0 && (
                  <div className={`mb-3 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Reserve dates for crises or rewards. Tap ‘Add Dates’ to start</div>
                )}
                {specialDates.map((date) => (
                  <div key={date.id} className={`flex items-center justify-between rounded-md px-4 py-2 mb-2 cursor-pointer ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                    onClick={() => { setSelectedDate(date); setShowActionModal(true); }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center font-semibold">{date.day}</div>
                      <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{date.type}</span>
                    </div>
                    <span className={`font-medium ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>₦{date.amount.toLocaleString()}</span>
                  </div>
                ))}
                {showActionModal && selectedDate && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => { setShowActionModal(false); setSelectedDate(null); }} />
                    <div className={`relative w-full max-w-xs rounded-2xl p-6 ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}>
                      <div className="mb-4 text-center font-semibold">Edit or delete this date?</div>
                      <div className="flex flex-col gap-2">
                        <button className="py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium" onClick={() => {
                          setShowActionModal(false);
                          setShowDateModal(true);
                          setIsEditing(true);
                          setNewDate(selectedDate.fullDate || '');
                          setNewType(selectedDate.type);
                          setNewAmount(selectedDate.amount);
                        }}>Edit</button>
                        <button className="py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium" onClick={() => {
                          setSpecialDates(prev => prev.filter(d => d.id !== selectedDate.id));
                          setShowActionModal(false);
                          setSelectedDate(null);
                        }}>Delete</button>
                        <button className={`py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`} onClick={() => { setShowActionModal(false); setSelectedDate(null); }}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
                <button className={`text-sm px-4 py-1 rounded-md ${darkMode ? 'bg-gray-600 text-gray-100 hover:bg-gray-500' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  onClick={() => setShowDateModal(true)}
                >Add Dates</button>
                {showDateModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => { setShowDateModal(false); setIsEditing(false); setSelectedDate(null); }} />
                    <div className={`relative w-full max-w-sm rounded-2xl p-6 ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold">{isEditing ? 'Edit Special Date' : 'Add Special Date'}</h2>
                        <button onClick={() => { setShowDateModal(false); setIsEditing(false); setSelectedDate(null); }} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800">
                          <span className="text-xl">&times;</span>
                        </button>
                      </div>
                      {dateError && <div className="mb-2 text-red-500 text-sm text-center">{dateError}</div>}
                      <form onSubmit={e => {
                        e.preventDefault();
                        if (!newDate || !newType || !newAmount) {
                          setDateError('Please fill all fields.');
                          return;
                        }
                        const day = Number(newDate.split('-')[2]);
                        if (isEditing && selectedDate) {
                          setSpecialDates(prev => prev.map(d => d.id === selectedDate.id ? { ...d, day, type: newType, amount: Number(newAmount), fullDate: newDate } : d));
                        } else {
                          setSpecialDates(prev => [
                            ...prev,
                            { id: Date.now(), day, type: newType, amount: Number(newAmount), fullDate: newDate }
                          ]);
                        }
                        setShowDateModal(false);
                        setIsEditing(false);
                        setSelectedDate(null);
                        setNewDate('');
                        setNewType('Payday Splurge');
                        setNewAmount('');
                        setDateError('');
                      }}>
                        <div className="mb-3">
                          <label className="block text-sm font-medium mb-1">Date</label>
                          <input type="date" className={`w-full rounded-lg border px-3 py-2 ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50'}`} value={newDate} onChange={e => setNewDate(e.target.value)} />
                        </div>
                        <div className="mb-3">
                          <label className="block text-sm font-medium mb-1">Type</label>
                          <select className={`w-full rounded-lg border px-3 py-2 ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50'}`} value={newType} onChange={e => setNewType(e.target.value)}>
                            <option value="Payday Splurge">Payday Splurge</option>
                            <option value="End of Month">End of Month</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-1">Amount</label>
                          <input type="number" className={`w-full rounded-lg border px-3 py-2 ${darkMode ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-gray-50'}`} value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="30000" />
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => { setShowDateModal(false); setIsEditing(false); setSelectedDate(null); }} className={`flex-1 py-2 rounded-lg font-medium ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}>Cancel</button>
                          <button type="submit" className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium">{isEditing ? 'Save' : 'Add'}</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Detailed Savings Section */}
            <section className={`rounded-2xl shadow-sm border p-6 mb-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl">💰</div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Detailed Savings</h3>
              </div>
              <p className="text-gray-500 mb-4">Configure your savings allocations and goals</p>

              {/* General Savings */}
              <div className="mb-6">
                <div className="font-semibold mb-2">General Savings</div>
                <div className="flex items-center mb-3">
                  <span className="mr-4">Deduction Type</span>
                  <label className="flex items-center mr-6 cursor-pointer">
                    <input type="radio" className="accent-teal-600 mr-2" checked={deductionType === 'percentage'} onChange={() => setDeductionType('percentage')} />
                    <span className="mr-2">Percentage</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" className="accent-teal-600 mr-2" checked={deductionType === 'fixed'} onChange={() => setDeductionType('fixed')} />
                    <span>Fixed Amount</span>
                  </label>
                </div>
                <div className="flex items-center mb-2">
                  <span className="mr-2">Percentage</span>
                  <input
                    type="number"
                    value={savingsPercentage}
                    onChange={(e) => setSavingsPercentage(Number(e.target.value))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center mr-2"
                    min="0"
                    max="100"
                  />
                  <span className="text-2xl font-bold text-gray-700">%</span>
                </div>
                <div className="text-gray-400 text-sm mb-4">Deducted directly from incoming funds before anything else</div>
              </div>

              {/* Goal-Based Savings */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Goal-Based Savings</span>
                </div>
                <div className="space-y-3">
                  {savingsGoals && savingsGoals.length > 0 ? (
                    savingsGoals.map((goal, idx) => (
                      <div key={goal.name || goal.id || idx} className={`bg-gray-100 rounded-lg p-4 flex flex-col ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex items-center mb-2">
                          <span className="mr-2 text-lg">{goal.icon || '🎯'}</span>
                          <span className={`font-medium flex-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{goal.name}</span>
                          {goal.contributionValue && (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-orange-900 text-white' : 'bg-orange-500 text-white'}`}>{goal.contributionType === 'percentage' ? `${goal.contributionValue}%` : `₦${goal.contributionValue}`}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mb-1 text-sm">
                          <span className={`${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>Progress: ₦{goal.current?.toLocaleString?.() || 0} of ₦{goal.target?.toLocaleString?.() || 0}</span>
                          <span className={`font-semibold ${darkMode ? 'text-white font-bold' : 'text-gray-700'}`}>{goal.target ? Math.round((goal.current/goal.target)*100) : 0}%</span>
                        </div>
                        <div className="w-full bg-orange-100 rounded-full h-3">
                          <div
                            className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${goal.target ? Math.round((goal.current/goal.target)*100) : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No goal-based savings yet. Add some in your Dashboard.</div>
                  )}
                </div>
              </div>

              {/* Rollover Settings */}
              <div>
                <div className="font-semibold mb-2">Rollover Settings</div>
                <div className="text-gray-400 text-sm mb-2">Choose what happens to unspent daily funds</div>
                <div className="flex items-center mb-2">
                  <label className="flex items-center mr-6 cursor-pointer">
                    <input type="radio" className="accent-teal-600 mr-2" checked={rolloverOption === 'bank'} onChange={() => setRolloverOption('bank')} />
                    <span>Send to Bank Account</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input type="radio" className="accent-teal-600 mr-2" checked={rolloverOption === 'savings'} onChange={() => setRolloverOption('savings')} />
                    <span>Send to General Savings</span>
                  </label>
                </div>
              </div>
            </section>
            <div className="flex justify-end mt-8">
              <button
                className={`px-6 py-3 rounded-xl font-semibold transition-colors ${darkMode ? 'bg-blue-700 text-white hover:bg-blue-800' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                onClick={() => setShowSecondPart(true)}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-start mb-8">
              <button
                className={`px-6 py-3 rounded-xl font-semibold transition-colors ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                onClick={() => setShowSecondPart(false)}
              >
                Back
              </button>
            </div>
            {/* Detailed Expenses Section */}
            <section id="detailed-expenses" className={`rounded-2xl shadow-sm border p-6 mb-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl">💳</div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Detailed Expenses</h3>
              </div>
              <p className="text-gray-500 mb-4">Visualize and configure your expense allocations</p>
              <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="w-full md:w-1/2 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {expenseData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 flex flex-col justify-center space-y-4 mt-6 md:mt-0">
                  {expenseData.map((item, idx) => (
                    <div key={item.name} className="flex items-center space-x-3">
                      <span className={`font-semibold text-lg w-40 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.name}</span>
                      <span className={`flex items-center text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-700'}`}>{item.value}<span className={`text-base font-medium ml-1 ${darkMode ? 'text-gray-200' : ''}`}>%</span></span>
                      <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center ml-2" style={{ backgroundColor: item.color }}></div>
                    </div>
                  ))}
                  <div className="flex items-center mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mr-2 ${darkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'}`}>Complete</span>
                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>All funds are allocated 100%</span>
                  </div>
                </div>
              </div>
            </section>
            {/* Cheat Day Section */}
            <section className={`rounded-2xl shadow-sm border p-6 mb-8 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className={`flex items-center space-x-3 mb-2`}>
                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl">
                  <span role="img" aria-label="gift">🎁</span>
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : ''}`}>Cheat Day</h3>
                <div className="flex-1 flex justify-end items-center">
                  <label className="flex items-center cursor-pointer select-none ml-4">
                    <span className={`mr-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Activate</span>
                    <input
                      type="checkbox"
                      checked={cheatDayEnabled}
                      onChange={() => setCheatDayEnabled(v => !v)}
                      className="sr-only peer"
                    />
                    <div className={`w-11 h-6 bg-gray-200 rounded-full peer-focus:outline-none peer-checked:bg-orange-500 transition-colors ${cheatDayEnabled ? 'bg-orange-500' : ''}`}></div>
                  </label>
                </div>
              </div>
              <p className={`mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Configure your discretionary spending allocations</p>
              {cheatDayEnabled && (
                <>
                  {/* General Cheat Fund */}
                  <div className="mb-6">
                    <div className={`font-semibold mb-2 ${darkMode ? 'text-gray-200' : ''}`}>General Cheat fund</div>
                    <div className="flex items-center space-x-6 mb-2">
                      <span className={`font-medium ${darkMode ? 'text-gray-200' : ''}`}>Allocation Type</span>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="cheatType"
                          checked={deductionType === 'percentage'}
                          onChange={() => setDeductionType('percentage')}
                          className="form-radio text-teal-500"
                        />
                        <span className={darkMode ? 'text-gray-200' : ''}>Percentage</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="cheatType"
                          checked={deductionType === 'fixed'}
                          onChange={() => setDeductionType('fixed')}
                          className="form-radio text-teal-500"
                        />
                        <span className={darkMode ? 'text-gray-200' : ''}>Fixed Amount</span>
                      </label>
                    </div>
                    {deductionType === 'fixed' && (
                      <div className="mb-2">
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : ''}`}>Enter Amount (max ₦{maxCheatAmount.toLocaleString()})</label>
                        <input
                          type="number"
                          value={fixedCheatAmount}
                          onChange={e => {
                            const val = e.target.value;
                            if (val === '' || Number(val) <= maxCheatAmount) {
                              setFixedCheatAmount(val);
                              setCheatAmountError('');
                            } else {
                              setCheatAmountError(`Amount cannot exceed ₦${maxCheatAmount.toLocaleString()}`);
                            }
                          }}
                          className={`w-40 px-2 py-1 border rounded text-right ${darkMode ? 'border-gray-600 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-700'}`}
                          max={maxCheatAmount}
                        />
                        {cheatAmountError && <div className="text-red-500 text-xs mt-1">{cheatAmountError}</div>}
                      </div>
                    )}
                    {deductionType === 'percentage' && (
                      <div className="mb-2">
                        <span className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : ''}`}>Percentage</span>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={savingsPercentage}
                            onChange={e => {
                              const val = e.target.value;
                              if (val === '' || (Number(val) >= 0 && Number(val) <= 25)) {
                                setSavingsPercentage(Number(val));
                                setCheatPercentageError('');
                              } else if (Number(val) < 0) {
                                setCheatPercentageError('Percentage cannot be less than 0%');
                              } else {
                                setCheatPercentageError('Percentage cannot exceed 25%');
                              }
                            }}
                            className={`w-20 px-2 py-1 border rounded-l text-right ${darkMode ? 'border-gray-600 bg-gray-800 text-gray-100' : 'border-gray-300 bg-white text-gray-700'}`}
                            max={25}
                          />
                          <span className={`px-4 py-1 rounded-r font-semibold text-lg ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100'}`}>%</span>
                        </div>
                        {cheatPercentageError && <div className="text-red-500 text-xs mt-1">{cheatPercentageError}</div>}
                      </div>
                    )}
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>Amount taken from incoming funds for indulgence</p>
                  </div>
                  {/* Weekly Split */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-semibold ${darkMode ? 'text-gray-200' : ''}`}>Weekly Split</span>
                    </div>
                    <div className="flex items-center mb-4">
                      <span className={`mr-2 font-medium ${darkMode ? 'text-gray-200' : ''}`}>Auto-divide cheat fund into 4 weekly parts</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={true} readOnly className="sr-only peer" />
                        <div className="w-11 h-6 bg-orange-400 peer-focus:outline-none rounded-full peer-checked:bg-orange-500 transition-colors" />
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[1,2,3,4].map(week => {
                        let weeklyAmount = 0;
                        let label = '';
                        if (deductionType === 'percentage') {
                          weeklyAmount = (totalBalance * (savingsPercentage / 100)) / 4;
                          label = `${savingsPercentage}% of monthly fund`;
                        } else if (deductionType === 'fixed') {
                          weeklyAmount = Number(fixedCheatAmount) / 4;
                          label = `₦${Number(fixedCheatAmount).toLocaleString()} monthly fund`;
                        }
                        return (
                          <div key={week} className={`rounded-lg p-4 flex flex-col items-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            <span className={`font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-500'}`}>Week {week}</span>
                            <span className="text-orange-500 font-bold text-xl mb-1">₦ {weeklyAmount ? weeklyAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '0'}</span>
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-400'}`}>{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Payout Settings */}
                  <div>
                    <div className={`font-semibold mb-2 ${darkMode ? 'text-gray-200' : ''}`}>Payout settings</div>
                    <div className="flex items-center mb-4">
                      <span className={`mr-2 font-medium ${darkMode ? 'text-gray-200' : ''}`}>Auto-send funds to linked bank account weekly</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={true} readOnly className="sr-only peer" />
                        <div className="w-11 h-6 bg-orange-400 peer-focus:outline-none rounded-full peer-checked:bg-orange-500 transition-colors" />
                      </label>
                    </div>
                    <div className="mb-4">
                      <span className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-200' : ''}`}>Linked Bank Account</span>
                      <select className={`w-full px-4 py-2 border rounded-md ${darkMode ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                        <option>First Bank ....4567</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-6">
                <button className={`px-6 py-2 rounded-md border font-semibold ${darkMode ? 'border-gray-600 text-gray-200 bg-gray-800' : 'border-gray-300 text-gray-700 bg-white'}`}>Cancel</button>
                <button className="px-6 py-2 rounded-md bg-orange-500 text-white font-semibold" onClick={handleSavePreferences}>Save Preferences</button>
              </div>
            </section>
          </>
        )}
      </main>
      <BottomNav darkMode={darkMode} />
    </div>
  );
};

export default BudgetingPreferences;
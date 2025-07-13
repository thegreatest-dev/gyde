import React, { useState } from 'react';
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

const BudgetingPreferences = () => {
  const [expandedSections, setExpandedSections] = useState({
    lightHeavyDays: true,
    monthlyBudget: true,
    generalSavings: true,
    goalSavings: true,
    rolloverSettings: true
  });

  const [dailyBudgetEnabled, setDailyBudgetEnabled] = useState(true);
  const [lightDaysAmount, setLightDaysAmount] = useState(30000);
  const [heavyDaysAmount, setHeavyDaysAmount] = useState(300000);
  const [deductionType, setDeductionType] = useState('percentage');
  const [savingsPercentage, setSavingsPercentage] = useState(20);
  const [specialDates, setSpecialDates] = useState([
    { id: 1, day: 15, type: 'Payday Splurge', amount: 30000 },
    { id: 2, day: 30, type: 'End of Month', amount: 30000 }
  ]);

  const [savingsGoals] = useState([
    {
      id: 1,
      label: 'New Laptop',
      progress: 450,
      target: 1200,
      percentage: 5
    }
  ]);

  const [rolloverOption, setRolloverOption] = useState('bank');

  const expenseData = [
    { name: 'Recurring Expenses', value: 45, color: '#0d9488' },
    { name: 'Non-Recurring Expenses', value: 30, color: '#f97316' },
    { name: 'Cheat Day Fund', value: 25, color: '#0f172a' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white pb-32">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <h1 className="text-2xl font-bold">Gyde</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Daily Budgeting Settings */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl">💰</div>
            <h3 className="text-xl font-semibold">Daily Budgeting Settings</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Configure how your budget is allocated on a daily basis</p>
          {/* ...existing code for daily budgeting settings... */}
          <div className="flex space-x-2 mb-4">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-md flex items-center justify-center font-semibold text-lg shadow-sm ${i < 4 ? 'bg-orange-500 text-white' : 'bg-teal-500 text-white'}`}
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
              <span className="font-medium text-gray-700 flex-1">Light Days</span>
              <input
                type="number"
                value={lightDaysAmount}
                onChange={(e) => setLightDaysAmount(Number(e.target.value))}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-right mr-2"
              />
              <div className="w-4 h-4 bg-orange-500 rounded" />
            </div>
            <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
              <span className="font-medium text-gray-700 flex-1">Heavy Days</span>
              <input
                type="number"
                value={heavyDaysAmount}
                onChange={(e) => setHeavyDaysAmount(Number(e.target.value))}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-right mr-2"
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
            {specialDates.map((date) => (
              <div key={date.id} className="flex items-center justify-between bg-gray-100 rounded-md px-4 py-2 mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-400 text-white flex items-center justify-center font-semibold">{date.day}</div>
                  <span className="font-medium text-gray-700">{date.type}</span>
                </div>
                <span className="font-medium text-gray-700">₦{date.amount.toLocaleString()}</span>
              </div>
            ))}
            <button className="text-sm px-4 py-1 bg-gray-100 rounded-md">Add Dates</button>
          </div>
        </section>

        {/* Detailed Savings Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl">💰</div>
            <h3 className="text-xl font-semibold">Detailed Savings</h3>
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
              <button className="px-3 py-1 border border-gray-300 rounded-md text-sm">Add Goal</button>
            </div>
            <div className="space-y-3">
              {savingsGoals.map(goal => (
                <div key={goal.id} className="bg-gray-100 rounded-lg p-4 flex flex-col">
                  <div className="flex items-center mb-2">
                    <span className="mr-2 text-lg">🎯</span>
                    <span className="font-medium text-gray-800 flex-1">{goal.label}</span>
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">{goal.percentage}% of Income</span>
                  </div>
                  <div className="flex items-center justify-between mb-1 text-sm">
                    <span>Progress: ₦{goal.progress.toLocaleString()} of ₦{goal.target.toLocaleString()}</span>
                    <span className="font-semibold text-gray-700">{Math.round((goal.progress/goal.target)*100)}%</span>
                  </div>
                  <div className="w-full bg-orange-100 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.round((goal.progress/goal.target)*100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
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

        {/* Detailed Expenses Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl">💳</div>
            <h3 className="text-xl font-semibold">Detailed Expenses</h3>
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
                  <span className="font-semibold text-lg text-gray-700 w-40">{item.name}</span>
                  <span className="flex items-center text-2xl font-bold text-gray-700">{item.value}<span className="text-base font-medium ml-1">%</span></span>
                  <div className="w-6 h-6 rounded bg-gray-200 flex items-center justify-center ml-2" style={{ backgroundColor: item.color }}></div>
                </div>
              ))}
              <div className="flex items-center mt-4">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold mr-2">Complete</span>
                <span className="text-gray-600 text-sm">All funds are allocated 100%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Cheat Day Section - Now Last */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl">
              <span role="img" aria-label="gift">🎁</span>
            </div>
            <h3 className="text-xl font-semibold">Cheat Day</h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Configure your discretionary spending allocations</p>

          {/* General Cheat Fund */}
          <div className="mb-6">
            <div className="font-semibold mb-2">General Cheat fund</div>
            <div className="flex items-center space-x-6 mb-2">
              <span className="font-medium">Allocation Type</span>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="cheatType"
                  checked={deductionType === 'percentage'}
                  onChange={() => setDeductionType('percentage')}
                  className="form-radio text-teal-500"
                />
                <span>Percentage</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="cheatType"
                  checked={deductionType === 'fixed'}
                  onChange={() => setDeductionType('fixed')}
                  className="form-radio text-teal-500"
                />
                <span>Fixed Amount</span>
              </label>
            </div>
            <div className="mb-2">
              <span className="block text-sm font-medium mb-1">Percentage</span>
              <div className="flex items-center">
                <input
                  type="number"
                  value={savingsPercentage}
                  onChange={e => setSavingsPercentage(Number(e.target.value))}
                  className="w-20 px-2 py-1 border border-gray-300 rounded-l text-right"
                />
                <span className="bg-gray-100 px-4 py-1 rounded-r font-semibold text-lg">%</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-2">Amount taken from incoming funds for indulgence</p>
          </div>

          {/* Weekly Split */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Weekly Split</span>
            </div>
            <div className="flex items-center mb-4">
              <span className="mr-2 font-medium">Auto-divide cheat fund into 4 weekly parts</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={true} readOnly className="sr-only peer" />
                <div className="w-11 h-6 bg-orange-400 peer-focus:outline-none rounded-full peer-checked:bg-orange-500 transition-colors" />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(week => (
                <div key={week} className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
                  <span className="font-semibold text-gray-500 mb-1">Week {week}</span>
                  <span className="text-orange-500 font-bold text-xl mb-1">₦ 20,000</span>
                  <span className="text-gray-400 text-sm">25% of monthly fund</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payout Settings */}
          <div>
            <div className="font-semibold mb-2">Payout settings</div>
            <div className="flex items-center mb-4">
              <span className="mr-2 font-medium">Auto-send funds to linked bank account weekly</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={true} readOnly className="sr-only peer" />
                <div className="w-11 h-6 bg-orange-400 peer-focus:outline-none rounded-full peer-checked:bg-orange-500 transition-colors" />
              </label>
            </div>
            <div className="mb-4">
              <span className="block text-sm font-medium mb-1">Linked Bank Account</span>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700">
                <option>First Bank ....4567</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <button className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 bg-white">Cancel</button>
            <button className="px-6 py-2 rounded-md bg-orange-500 text-white font-semibold">Save Preferences</button>
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};

export default BudgetingPreferences;
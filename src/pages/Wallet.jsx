 // adjust path if needed
 import React, { useState } from 'react';
 import {
  Plus,
  User,
  ChevronDown,
  Wallet,
  Calendar
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from '../Components/BottomNav';
import { useTheme } from '../Components/ThemeContext';

export default function GydeWallet() {
  const [activeTab, setActiveTab] = useState('payout');
  const [formData, setFormData] = useState({
    accountName: '',
    bankName: '',
    emailOrPhone: ''
  });
  const [showTransactions, setShowTransactions] = useState(false);
  const [openTransactionDetails, setOpenTransactionDetails] = useState({});

  const { darkMode } = useTheme();

  // Get dark mode from localStorage
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveDetails = () => {
    console.log('Saving details:', formData);
  };

  const handleAddFunds = () => {
    console.log('Add funds clicked');
  };

  const toggleTransactionDetails = (id) => {
    setOpenTransactionDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const transactions = [
    {
      id: 1,
      type: 'deposit',
      title: 'Funds Deposit',
      date: 'Jun 15, 2025',
      amount: '₦125,000.00',
      status: 'completed',
      category: 'Recurring: 4,500.00',
      subCategory: 'Non-Recurring: 4,500.00'
    },
    {
      id: 2,
      type: 'disbursement',
      title: 'Budget Disbursed',
      date: 'Jun 15, 2025',
      amount: '₦6,000.00',
      status: 'completed',
      isNegative: true,
      category: 'Budget: 6,000.00',
      subCategory: 'Disbursed to Bank'
    },
    {
      id: 3,
      type: 'disbursement',
      title: 'Cheat Day Disbursed',
      date: 'Jun 09, 2025',
      amount: '₦3,000.00',
      status: 'completed',
      isNegative: true,
      category: 'Cheat Day: 3,000.00',
      subCategory: 'Disbursed to wallet'
    }
  ];

  const TransactionCard = React.memo(({ transaction }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            transaction.type === 'deposit' ? 'bg-blue-100' : 'bg-orange-100'
          }`}>
            {transaction.type === 'deposit' ? (
              <span className="text-blue-600 font-bold text-lg">₦</span>
            ) : (
              <Wallet className="w-5 h-5 text-orange-600" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 flex items-center">
              {transaction.title}
              {transaction.category && (
                <button
                  type="button"
                  className="ml-2 p-1 rounded hover:bg-gray-100 focus:outline-none"
                  onClick={() => toggleTransactionDetails(transaction.id)}
                >
                  <motion.span animate={{ rotate: openTransactionDetails[transaction.id] ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </motion.span>
                </button>
              )}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{transaction.date}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold text-lg ${
            transaction.isNegative ? 'text-orange-600' : 'text-blue-600'
          }`}>
            {transaction.isNegative ? '-' : '+'}
            {transaction.amount}
          </p>
        </div>
      </div>
      {transaction.category && (
        <AnimatePresence initial={false}>
          {openTransactionDetails[transaction.id] && (
            <motion.div
              key="details"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <span className="text-sm font-medium text-gray-600">Category</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium">
                    Completed
                  </span>
                  <div className="text-right text-xs text-gray-500">
                    <div>{transaction.category}</div>
                    <div>{transaction.subCategory}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  ));

  return (
    <>
      <header className={`border-b shadow-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : ''}`}>Gyde banking</h1>
        </div>
      </header>
      <div className={`min-h-screen pb-24 transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <div className="max-w-6xl mx-auto px-4 lg:px-12 py-6">
          <div className={`rounded-3xl p-6 mb-8 text-white flex items-center justify-between ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' : 'bg-gradient-to-br from-blue-900 to-blue-700'}` }>
            <div>
            <h2 className="text-xl font-semibold">Current Balance</h2>
            <p className="text-3xl font-bold mt-2">₦500,000.00</p>
            </div>
            <img src="/wallett.png" alt="Wallet" className="w-24 h-24 object-contain ml-4" />
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="sticky top-0 z-10 bg-white border-b px-2 py-3 rounded-xl mb-4">
                <div className="flex bg-gray-100 rounded-2xl p-1">
                  <button
                    onClick={() => setActiveTab('payout')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      activeTab === 'payout'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Payout
                  </button>
                  <button
                    onClick={() => setActiveTab('addfunds')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                      activeTab === 'addfunds'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add funds</span>
                  </button>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'payout' && (
                  <motion.div
                    key="payout"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <User className="w-5 h-5 text-orange-600 mr-2" /> Add Bank Details
                      </h2>
                      <div className="space-y-4">
                        <input
                          type="text"
                          name="accountName"
                          value={formData.accountName}
                          onChange={handleInputChange}
                          placeholder="Account Name"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                        />
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          placeholder="Bank Name"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                        />
                        <input
                          type="text"
                          name="emailOrPhone"
                          value={formData.emailOrPhone}
                          onChange={handleInputChange}
                          placeholder="Email or Phone"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                        />
                        <button
                          onClick={handleSaveDetails}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
                        >
                          Save Details
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'addfunds' && (
                  <motion.div
                    key="addfunds"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-blue-600" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-800 mb-2">Add Funds</h2>
                      <p className="text-gray-600 mb-6">Top up your account to continue using Gyde</p>
                      <button
                        onClick={handleAddFunds}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl"
                      >
                        Add Funds
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-3xl p-6 mb-4">
                <div className="flex items-center justify-between mb-2 cursor-pointer" onClick={() => setShowTransactions(v => !v)}>
                  <h2 className="text-xl font-bold text-white">Transaction History</h2>
                  <div className="flex items-center space-x-2 text-white">
                    <span className="text-sm">All Transactions</span>
                    <motion.span animate={{ rotate: showTransactions ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </div>
                </div>
                <p className="text-orange-100 text-sm">View your recent transaction history</p>
              </div>
              <AnimatePresence initial={false}>
                {showTransactions && (
                  <motion.div
                    key="transactions"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <TransactionCard key={transaction.id} transaction={transaction} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <BottomNav darkMode={darkMode} />
    </>
  );
}

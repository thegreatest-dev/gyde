import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

export default function AccSet() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: 'David Alfredo',
    email: 'davidalfredo@email.com',
    password: '',
    confirmPassword: '',
    currency: 'NGN',
    theme: 'system',
    notifications: true,
    cheatDays: true,
    rollover: true,
  });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, type, value, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (form.password && form.password !== form.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    setMessage('Account updated!');
    // Update user info in backend/localStorage here
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white flex flex-col items-center justify-center p-6 lg:px-16">
      <div className="w-full max-w-md mx-auto">
        <button
          onClick={() => navigate('/profile')}
          className="mb-6 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Profile</span>
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Account Settings</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Personal Info */}
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Preferences */}
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <select
            name="currency"
            value={form.currency}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none"
          >
            <option value="NGN">NGN</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Theme</label>
          <select
            name="theme"
            value={form.theme}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="notifications"
            checked={form.notifications}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm">Enable Notifications</label>
        </div>

        {/* Budgeting Preferences */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="cheatDays"
            checked={form.cheatDays}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm">Enable Cheat Days</label>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="rollover"
            checked={form.rollover}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label className="text-sm">Enable Rollover</label>
        </div>

        {/* Security */}
        <div>
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Leave blank to keep current password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Repeat new password"
          />
        </div>

        {message && <div className="text-sm text-red-500 dark:text-red-400">{message}</div>}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-blue-900 text-white py-3 rounded-2xl font-semibold hover:bg-blue-800"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>
        </form>
      </div>
    </div>
  );
}

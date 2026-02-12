import React, { useState } from 'react';
import ResetPasswordModal from './ResetPasswordModal';
import axios from 'axios';
import { Mail } from 'lucide-react';

export default function ForgotPasswordModal({ onClose, onOTPSent }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showReset, setShowReset] = useState(false);

  const handleGetOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setSuccess('OTP sent to your email!');
      setTimeout(() => setShowReset(true), 1000);
      if (onOTPSent) onOTPSent(email);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showReset ? (
        <ResetPasswordModal email={email} onClose={onClose} />
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
            <h2 className="text-xl font-semibold mb-6 text-center">Forgot Password</h2>
            <form onSubmit={handleGetOTP} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-slate-500 focus:bg-white transition-all duration-200"
                  required
                />
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              {success && <div className="text-green-600 text-sm text-center">{success}</div>}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending OTP...' : 'Get OTP'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

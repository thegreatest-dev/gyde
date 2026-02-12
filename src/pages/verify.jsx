import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Verify() {
  // ...existing code...
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendAttempts, setResendAttempts] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) return;
    const newOtp = [...otp];
    newOtp[idx] = val[val.length - 1];
    setOtp(newOtp);
    if (idx < 5 && val) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (otp[idx]) {
        const newOtp = [...otp];
        newOtp[idx] = '';
        setOtp(newOtp);
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.post('https://gyde-backend-wjh9.onrender.com/api/token/validate-otp', {
        email,
        otp: otp.join('')
      });
      setIsLoading(false);
      if (response.data && response.data.success) {
        setSuccess(true);
        setError('');
        // Attempt login after verification
        try {
          // You may need to pass password from location.state or prompt user for password
          const password = location.state?.password || '';
          if (email && password) {
            await axios.post('https://gyde-backend-wjh9.onrender.com/api/auth/login', { email, password });
          }
        } catch (loginError) {
          // Optionally handle login error
        }
        setTimeout(() => navigate('/'), 1800);
      } else {
        setError('Invalid OTP. Please try again.');
        setSuccess(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError('Invalid OTP. Please try again.');
      setSuccess(false);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    try {
      await axios.post('https://gyde-backend-wjh9.onrender.com/api/token/send-otp', { email });
      setResendMsg('A new OTP has been sent to your email.');
      setResendAttempts(prev => prev + 1);
      setResendCountdown(30 * (resendAttempts + 1));
    } catch (error) {
      setResendMsg('Failed to send OTP. Please try again.');
    }
    setTimeout(() => setResendMsg(''), 3000);
  };

  // Countdown effect
  React.useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setInterval(() => {
        setResendCountdown(c => c - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCountdown]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">Verify Your Email</h2>
        <p className="text-gray-600 mb-6 text-center">
          {email ? (
            <>Enter the 6-digit code sent to <span className="font-semibold">{email}</span></>
          ) : (
            <>Enter the 6-digit code sent to your email</>
          )}
        </p>
        <form onSubmit={handleVerify} className="w-full flex flex-col items-center">
          <div className="flex gap-2 mb-4">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(e, idx)}
                onKeyDown={e => handleKeyDown(e, idx)}
                className={`w-12 h-14 text-center text-2xl border-2 rounded-lg transition-all duration-150 focus:border-blue-600 outline-none bg-gray-50 tracking-widest ${
                  error ? 'border-red-400' : 'border-blue-300'
                } ${success ? 'border-green-400 bg-green-50 animate-bounce' : ''}`}
                autoFocus={idx === 0}
                disabled={isLoading || success}
                aria-label={`OTP digit ${idx + 1}`}
              />
            ))}
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {success && (
            <div className="flex flex-col items-center mb-2">
              <svg className="w-10 h-10 text-green-500 animate-bounce mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="text-green-600 text-sm">Verified! Redirecting...</div>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading || otp.some(d => !d)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 mb-2"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <button
          onClick={handleResend}
          className="text-blue-600 hover:underline text-sm mt-2 mb-4"
          type="button"
          disabled={isLoading || success || resendCountdown > 0}
        >
          {resendCountdown > 0 ? `Resend OTP (${resendCountdown}s)` : 'Resend OTP'}
        </button>
        {resendMsg && <div className="text-green-500 text-xs mb-2">{resendMsg}</div>}
        <button
          onClick={() => navigate('/signup')}
          className="text-gray-500 hover:underline text-xs mt-2"
          type="button"
          disabled={isLoading || success}
        >
          Wrong email? Go back to Signup
        </button>
      </motion.div>
    </div>
  );
}
 

import React, { useState } from 'react';
import axios from 'axios';
import LoadingScreen from '../Components/LoadingScreen';
import VerifyModal from '../pages/VerifyModal';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Token authentication utility
function isAuthenticated() {
  const token = localStorage.getItem('authToken');
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now(); // Check expiration
  } catch {
    return false;
  }
}

export default function GydeLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      if (res.data && res.data.token) {
        localStorage.setItem('authToken', res.data.token);
        console.log('Login successful:', res.data.user);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.code === 'UNVERIFIED') {
        // Prompt user if they want to resend OTP
        const confirmResend = window.confirm('Account not verified. Would you like to resend the OTP?');
        if (confirmResend) {
          await handleResendOtp();
          setShowVerify(true);
        } else {
          setError('Account not verified. Please check your email.');
        }
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.');
        console.error('Login failed:', err.response?.data?.message || err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/resend-otp', { email });
      alert('OTP resent! Please check your inbox.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };


  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleAppleLogin = () => {
    console.log('Apple login clicked');
  };

  return (
    <>
      {showVerify && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full flex flex-col items-center">
            <VerifyModal email={email} onClose={() => setShowVerify(false)} />
          </div>
        </div>
      )}
      <div
        className="min-h-screen flex items-center justify-center p-0 relative"
        style={
          window.innerWidth >= 768
            ? { backgroundImage: "url('/backgroundscribble.png')", backgroundSize: '130%', backgroundPosition: 'center' }
            : {}
        }
      >
        {/* Overlay for desktop only */}
        {window.innerWidth >= 768 && (
          <div className="absolute inset-0 bg-white opacity-60 z-0 pointer-events-none"></div>
        )}
        {isLoading && <LoadingScreen />}
        <div className="relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] bg-white z-10">
        {/* Left: Logo and welcome (desktop only) */}
        <div className="hidden md:flex flex-col justify-end items-start bg-gradient-to-b from-[#0A4B5B] to-[#023047] p-10 relative w-1/2 min-h-full">
          <img
            src="/Logo.png.png"
            alt="Gyde Logo"
            className="object-contain"
            style={{
              width: '320px',
              maxWidth: '100%',
              height: 'auto',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
            }}
          />
          <div className="mt-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-lg opacity-80">Sign in to continue to Gyde</p>
          </div>
        </div>

        {/* Mobile: Blue section with logo above white card */}
        <div
          className="block md:hidden w-full bg-gradient-to-b from-[#0A4B5B] to-[#023047] flex flex-col items-center pt-8 pb-4"
          style={{}}
        >
          <img
            src="/Logo.png.png"
            alt="Gyde Logo"
            className="object-contain"
            style={{
              width: '240px', // 160px * 1.5
              maxWidth: '90vw',
              height: 'auto',
              filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.15))',
            }}
          />
        </div>

        {/* Right: Login Form */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-left">Login</h2>
          {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
          <div className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-slate-500 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-500"
              />
            </div>
            {/* Password Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-4 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-slate-500 focus:bg-white transition-all duration-200 text-gray-700 placeholder-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-slate-600 hover:text-slate-800 transition-colors underline"
              >
                Forgot Password
              </button>
            </div>
            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>
          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">Or login with</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>
          {/* Social Login Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handleGoogleLogin}
              className="flex-1 flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {/* Google Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button
              onClick={handleAppleLogin}
              className="flex-1 flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {/* Apple Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </button>
          </div>
          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <span className="text-gray-500 text-sm">Don't have an account? </span>
            <button
              className="text-slate-600 hover:text-slate-800 font-medium text-sm transition-colors"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}

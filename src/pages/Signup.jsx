import React, { useState } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import VerifyModal from './VerifyModal';

export default function GydeSignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'phone') {
      // Only allow numbers
      newValue = value.replace(/\D/g, '');
    }
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !phone || !password || !confirmPassword) {
      alert("All fields are required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      // Register user
      await axios.post('/auth/sign-up', {
        name,
        email,
        phone,
        password
      });
      // Send OTP
      await axios.post('/token/send-otp', { email });
      setIsLoading(false);
      setShowVerify(true);
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Sign up failed. Please try again.');
      }
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Google sign up clicked');
  };

  const handleAppleSignUp = () => {
    console.log('Apple sign up clicked');
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const handleVerifyClose = () => {
    setShowVerify(false);
    navigate('/'); // redirect to login after verification
  };

  return (
    <div className="relative">
      <div className={`min-h-screen flex items-center justify-center p-4 relative transition-all duration-300 ${showVerify ? 'filter blur-sm pointer-events-none' : ''}`}
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
        <div
          className="w-full max-w-md rounded-t-3xl shadow-2xl overflow-hidden block bg-white md:bg-white z-10"
          style={{}}
      >
        <div className="px-8 py-8">
          <button
            onClick={handleBackToLogin}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-lg">Back to Login</span>
          </button>

          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
            Create new<br />Account
          </h2>

          <form className="space-y-6" onSubmit={handleSignUp}>
            {/* Name */}
            <InputField icon={<User />} name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" />

            {/* Email */}
            <InputField icon={<Mail />} name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />

            {/* Phone */}
            <InputField icon={<Phone />} name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" />

            {/* Password */}
            <PasswordField
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Password"
              visible={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />

            {/* Confirm Password */}
            <PasswordField
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm Password"
              visible={showConfirmPassword}
              toggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {/* Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing Up...
                </div>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">Or sign up with</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleGoogleSignUp}
              className="flex-1 flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
            <button
              onClick={handleAppleSignUp}
              className="flex-1 flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      </div>
      <AnimatePresence>
        {showVerify && (
          <VerifyModal email={formData.email} onClose={handleVerifyClose} />
        )}
      </AnimatePresence>
    </div>
  );
}


// Reusable Input Field Component
const InputField = ({ icon, name, value, onChange, placeholder, type = 'text' }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      {icon}
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-slate-500 focus:bg-white transition-all duration-200"
      required
    />
  </div>
);

// Reusable Password Field Component
const PasswordField = ({ name, value, onChange, placeholder, visible, toggle }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
      <Lock className="h-5 w-5 text-gray-400" />
    </div>
    <input
      type={visible ? "text" : "password"}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full pl-12 pr-12 py-4 bg-gray-100 border-0 rounded-xl text-gray-700 placeholder-gray-500 focus:ring-2 focus:ring-slate-500 focus:bg-white transition-all duration-200"
      required
    />
    <button
      type="button"
      onClick={toggle}
      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
    >
      {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  </div>
);

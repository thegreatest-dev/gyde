import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  User, 
  Shield, 
  TrendingUp, 
  Camera, 
  Eye, 
  EyeOff, 
  Trash2, 
  Calendar, 
  Target, 
  Zap, 
  Award, 
  Clock,
  Home,
  ArrowLeft,
  Edit3
} from 'lucide-react';
import { useTheme } from '../Components/ThemeContext';

const GydeProfilePage = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();

  // State management
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNextOfKinForm, setShowNextOfKinForm] = useState(false);
  const [nextOfKinSaved, setNextOfKinSaved] = useState(false);
  const [file, setFile] = useState(null);

  // Form states
  const [personalData, setPersonalData] = useState({
    name: user?.name || 'Daniel Akin-Olutegbe',
    username: user?.username || 'danielakin557',
    gender: user?.gender || 'Male',
    dob: user?.dob || '2002-12-20',
    profilePicture: user?.profilePicture || null,
    nextOfKin: user?.nextOfKin || {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    currentPIN: '',
    newPIN: '',
    confirmPIN: ''
  });

  // Fetch profile on mount
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://gyde-backend-wjh9.onrender.com/api/user/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data) {
          setPersonalData(prev => ({
            ...prev,
            ...res.data,
            profilePicture: res.data.profilePic || res.data.profilePicture || prev.profilePicture,
            nextOfKin: res.data.nextOfKin || prev.nextOfKin
          }));
          setUser(res.data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, [setUser]);

  // Early return for loading states
  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-lg">Loading...</p></div>;
  if (!user && !loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-gray-500">No user found. Please log in.</p></div>;

  // Static data
  const streakData = {
    currentStreak: 28,
    lastLogin: '2 hours ago',
    longestStreak: 45,
    cheatDaysUsed: 3,
    cheatDaysTotal: 5,
    zenDays: 12,
    budgetingScore: 92,
    monthlyGoals: 8,
    achievedGoals: 6
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'streak', label: 'Streak', icon: TrendingUp }
  ];

  // Event handlers
  const handlePersonalChange = (field, value) => {
    setPersonalData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextOfKinChange = (field, value) => {
    setPersonalData(prev => ({
      ...prev,
      nextOfKin: { ...prev.nextOfKin, [field]: value }
    }));
  };

  const handleSecurityChange = (field, value) => {
    setSecurityData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureChange = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('profilePic', file);
    try {
      const res = await axios.put('https://gyde-backend-wjh9.onrender.com/api/user/upload-profile-pic', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data && res.data.profilePicUrl) {
        setPersonalData(prev => ({ ...prev, profilePicture: res.data.profilePicUrl }));
      } else {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPersonalData(prev => ({ ...prev, profilePicture: ev.target.result }));
        };
        reader.readAsDataURL(file);
      }
      setFile(null);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Profile image upload failed.');
    }
  };

  const handleSave = async (updatedProfile) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put('/user/profile', updatedProfile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      alert('Profile updated!');
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  const hasNextOfKin = personalData.nextOfKin.name && personalData.nextOfKin.phone && personalData.nextOfKin.relationship;

  // Components
  const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <div className={`rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${darkMode ? 'bg-[#181c23] border border-[#23283a]' : 'bg-white border border-gray-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-6 w-6 ${color}`} />
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
      </div>
      <h3 className={`font-medium text-sm mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{label}</h3>
      {subtitle && <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{subtitle}</p>}
    </div>
  );

  const InputField = ({ label, type = "text", value, onChange, placeholder, disabled = false, maxLength, className = "" }) => (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
          disabled 
            ? (darkMode ? 'bg-gray-800 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-300 text-gray-500') 
            : (darkMode ? 'bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500')
        } ${className}`}
      />
    </div>
  );

  const Button = ({ children, variant = "primary", size = "md", onClick, disabled = false, className = "", type }) => {
    const baseClasses = "font-medium rounded-lg transition-all duration-200 flex items-center justify-center";
    const sizeClasses = {
      sm: "px-3 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };
    const variantClasses = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: `border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white ${darkMode ? 'hover:bg-blue-600' : ''}`,
      orange: "bg-orange-500 hover:bg-orange-600 text-white",
      danger: "bg-red-600 hover:bg-red-700 text-white",
      outline: `border border-gray-300 text-gray-700 hover:bg-gray-50 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : ''}`
    };
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        {children}
      </button>
    );
  };

  const Card = ({ title, icon: Icon, children, variant = "default", className = "" }) => {
    const variantClasses = {
      default: darkMode ? 'bg-[#23283a] border-[#23283a]' : 'bg-white border-gray-200',
      info: darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200',
      warning: darkMode ? 'bg-orange-900/30 border-orange-800' : 'bg-orange-50 border-orange-200',
      danger: darkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'
    };

    return (
      <div className={`border rounded-xl p-6 shadow-md ${variantClasses[variant]} ${className}`}>
        {title && (
          <div className="flex items-center mb-4">
            {Icon && <Icon className="h-5 w-5 mr-2 text-current" />}
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )}
        {children}
      </div>
    );
  };

  // Tab content renderers
  const renderPersonalTab = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <label className="cursor-pointer group block w-full h-full">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center overflow-hidden border-4 shadow-lg transition-all group-hover:scale-105 ${
                darkMode ? 'bg-gradient-to-br from-gray-800 to-blue-900 border-[#23283a]' : 'bg-gradient-to-br from-blue-100 to-blue-400 border-white'
              }`}>
                {personalData.profilePicture && personalData.profilePicture !== "" ? (
                  <img src={personalData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-blue-600" />
                )}
              </div>
              <div className={`absolute bottom-2 right-2 p-2 rounded-full shadow-lg opacity-80 group-hover:opacity-100 transition-all ${
                darkMode ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'
              }`}>
                <Camera className="w-4 h-4" />
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
              />
            </label>
          </div>
          
          {file && (
            <Button onClick={handleProfilePictureChange} size="sm" variant="primary">
              Upload Image
            </Button>
          )}
          
          <h2 className={`text-2xl font-bold text-center mt-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {loading ? '...' : (user?.name || personalData.name)}
          </h2>
          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
            @{loading ? '...' : (user?.username || personalData.username)}
          </p>
        </div>

        {/* Profile Completion Notice */}
        {!hasNextOfKin && !nextOfKinSaved && (
          <div className="flex-1 max-w-md">
            <Card variant="warning">
              <div className="flex items-start gap-3">
                <div className={`rounded-full p-2 flex-shrink-0 ${darkMode ? 'bg-orange-900 text-orange-300' : 'bg-orange-100 text-orange-600'}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-semibold mb-1 ${darkMode ? 'text-orange-200' : 'text-orange-800'}`}>
                    Complete Your Profile
                  </h3>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-orange-200' : 'text-orange-700'}`}>
                    Finish setting up your account by adding your next of kin information.
                  </p>
                  <button className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">
                    COMPLETE PROFILE →
                  </button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Personal Information Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Username
            </label>
            <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Receive money from friends using your username
            </p>
            <div className={`w-full px-4 py-3 rounded-lg select-all cursor-default ${
              darkMode ? 'bg-gray-900 border border-gray-700 text-gray-200' : 'bg-gray-50 border border-gray-200 text-gray-700'
            }`}>
              @{personalData.username}
            </div>
          </div>

          {/* Next of Kin Section */}
          <Card title="Next of Kin" variant="info" className="relative">
            {hasNextOfKin && nextOfKinSaved && (
              <button
                onClick={() => { setShowNextOfKinForm(true); setNextOfKinSaved(false); }}
                className="absolute top-4 right-4 p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            
            {!hasNextOfKin && !showNextOfKinForm ? (
              <div className="flex items-center justify-between">
                <span className={darkMode ? 'text-blue-200' : 'text-blue-700'}>No Next of Kin added</span>
                <Button onClick={() => setShowNextOfKinForm(true)} size="sm" variant="primary">
                  Add Next of Kin
                </Button>
              </div>
            ) : (showNextOfKinForm || !nextOfKinSaved) ? (
              <form
                className="space-y-4"
                onSubmit={async e => {
                  e.preventDefault();
                  if (personalData.nextOfKin.name && personalData.nextOfKin.phone && personalData.nextOfKin.relationship) {
                    setShowNextOfKinForm(false);
                    setNextOfKinSaved(true);
                    await handleSave({ ...personalData, nextOfKin: personalData.nextOfKin });
                  }
                }}
              >
                <InputField
                  label="Full Name"
                  value={personalData.nextOfKin.name}
                  onChange={e => handleNextOfKinChange('name', e.target.value)}
                  placeholder="Enter full name"
                  required
                />
                <InputField
                  label="Phone Number"
                  type="tel"
                  value={personalData.nextOfKin.phone}
                  onChange={e => handleNextOfKinChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
                <InputField
                  label="Relationship"
                  value={personalData.nextOfKin.relationship}
                  onChange={e => handleNextOfKinChange('relationship', e.target.value)}
                  placeholder="e.g. Brother, Mother, Friend"
                  required
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={!(personalData.nextOfKin.name && personalData.nextOfKin.phone && personalData.nextOfKin.relationship)}
                    variant="primary"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className={`font-semibold mr-2 ${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>Full Name:</span>
                  <span className={darkMode ? 'text-blue-100' : 'text-gray-900'}>{personalData.nextOfKin.name}</span>
                </div>
                <div className="flex items-center">
                  <span className={`font-semibold mr-2 ${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>Phone:</span>
                  <span className={darkMode ? 'text-blue-100' : 'text-gray-900'}>{personalData.nextOfKin.phone}</span>
                </div>
                <div className="flex items-center">
                  <span className={`font-semibold mr-2 ${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>Relationship:</span>
                  <span className={darkMode ? 'text-blue-100' : 'text-gray-900'}>{personalData.nextOfKin.relationship}</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <InputField
            label="Gender"
            value={personalData.gender}
            disabled
          />
          
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Date of Birth
            </label>
            <div className={`px-4 py-3 rounded-lg ${
              darkMode ? 'bg-gray-900 border border-gray-700 text-gray-200' : 'bg-gray-50 border border-gray-300 text-gray-700'
            }`}>
              {new Date(personalData.dob).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ChangePasswordForm for forgot password (must be outside renderSecurityTab)
  function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.put(
          'https://gyde-backend-wjh9.onrender.com/api/auth/change-password',
          { currentPassword, newPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage(res.data.message || 'Password changed successfully.');
        setCurrentPassword('');
        setNewPassword('');
      } catch (error) {
        setMessage(error.response?.data?.message || 'Password change failed.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleChangePassword} className="space-y-4">
        <div className="relative">
          <InputField
            label="Current Password"
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrent(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
            aria-label={showCurrent ? 'Hide password' : 'Show password'}
            style={{ padding: 0 }}
          >
            {showCurrent ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <div className="relative">
          <InputField
            label="New Password"
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowNew(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
            aria-label={showNew ? 'Hide password' : 'Show password'}
            style={{ padding: 0 }}
          >
            {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Changing...' : 'Change Password'}
        </Button>
        {message && <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
      </form>
    );
  }

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Change Password */}
      <Card title="Change Password" icon={Shield}>
        <div className="mb-4 flex items-center justify-between">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Forgot password?</span>
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setShowEditPassword(!showEditPassword)}
          >
            <Edit3 className="w-4 h-4 text-orange-500" />
          </button>
        </div>
        {showEditPassword && (
          <ChangePasswordForm />
        )}
      </Card>

      {/* Change PIN */}
      <Card title="Change PIN" icon={Target}>
        <div className="mb-4">
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Forgot PIN?</span>
        </div>
        <button
          type="button"
          className="mb-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => setShowPIN(!showPIN)}
        >
          <Edit3 className="w-4 h-4 text-blue-500" />
        </button>
        
        {showPIN && (
          <div className="space-y-4">
            <InputField
              label="Current PIN"
              type={showPIN ? "text" : "password"}
              value={securityData.currentPIN}
              onChange={e => handleSecurityChange('currentPIN', e.target.value)}
              maxLength="6"
              placeholder="Enter current PIN"
            />
            
            <InputField
              label="New PIN"
              type={showPIN ? "text" : "password"}
              value={securityData.newPIN}
              onChange={e => handleSecurityChange('newPIN', e.target.value)}
              maxLength="6"
              placeholder="Enter new PIN"
            />
            
            <InputField
              label="Confirm New PIN"
              type={showPIN ? "text" : "password"}
              value={securityData.confirmPIN}
              onChange={e => handleSecurityChange('confirmPIN', e.target.value)}
              maxLength="6"
              placeholder="Confirm new PIN"
            />
            
            <button
              type="button"
              onClick={() => setShowPIN(!showPIN)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              {showPIN ? 'Hide PIN' : 'Show PIN'}
            </button>
          </div>
        )}
      </Card>

      {/* Delete Account */}
      <Card title="Delete Account" icon={Trash2} variant="danger">
        <p className="text-sm mb-4">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
        
        {!showDeleteConfirm ? (
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </Button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-red-600">Are you sure you want to delete your account?</p>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  alert('Account deletion functionality would be implemented here');
                  setShowDeleteConfirm(false);
                }}
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button variant="primary">Update Security Settings</Button>
      </div>
    </div>
  );

  const renderStreakTab = () => (
    <div className="space-y-8">
      {/* Current Streak Hero */}
      <div className="text-center">
        <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-white text-3xl font-bold mb-4 shadow-lg ${
          darkMode ? 'bg-gradient-to-br from-orange-400 to-blue-400' : 'bg-gradient-to-br from-orange-500 to-blue-600'
        }`}>
          {streakData.currentStreak}
        </div>
        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Day Streak</h2>
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Keep up the great work!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Last Login"
          value={streakData.lastLogin}
          color="text-blue-600"
        />
        <StatCard
          icon={Award}
          label="Longest Streak"
          value={`${streakData.longestStreak} days`}
          color="text-purple-600"
        />
        <StatCard
          icon={Clock}
          label="Cheat Days"
          value={`${streakData.cheatDaysUsed}/${streakData.cheatDaysTotal}`}
          color="text-orange-500"
          subtitle="Days remaining"
        />
        <StatCard
          icon={Zap}
          label="Zen Days"
          value={streakData.zenDays}
          color="text-green-600"
          subtitle="Perfect budget days"
        />
      </div>

      {/* Budgeting Performance */}
      <Card title="Budgeting Performance" icon={Target}>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Overall Score
              </span>
              <span className="text-3xl font-bold text-orange-500">{streakData.budgetingScore}%</span>
            </div>
            <div className={`w-full rounded-full h-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div 
                className="bg-gradient-to-r from-orange-500 to-blue-600 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${streakData.budgetingScore}%` }}
              />
            </div>
          </div>
          
          <div className={`grid grid-cols-3 gap-4 pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{streakData.achievedGoals}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Goals Achieved</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                {streakData.monthlyGoals - streakData.achievedGoals}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{streakData.monthlyGoals}</div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Goals</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button className="flex-1">View Analytics</Button>
        <Button variant="secondary" className="flex-1">Set New Goal</Button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal': return renderPersonalTab();
      case 'security': return renderSecurityTab();
      case 'streak': return renderStreakTab();
      default: return renderPersonalTab();
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-gray-100' : 'bg-gray-50'}`}>
      <div className={`max-w-6xl mx-auto px-4 py-8 ${darkMode ? 'text-gray-100' : ''}`}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your account settings and preferences
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className={`p-3 rounded-lg border transition-all duration-200 hover:scale-105 ${
              darkMode ? 'bg-gray-800 border-gray-700 hover:shadow-lg' : 'bg-white border-gray-200 hover:shadow-md'
            }`}
            aria-label="Go to Dashboard"
          >
            <span className="block sm:hidden">
              <ArrowLeft className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </span>
            <span className="hidden sm:block">
              <Home className={`w-6 h-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className={`border rounded-xl mb-8 overflow-hidden shadow-lg ${
          darkMode ? 'bg-[#181c23] border-[#23283a]' : 'bg-white border-gray-200'
        }`}>
          <nav className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 font-medium transition-all duration-200 relative ${
                    isActive
                      ? `text-orange-500 ${darkMode ? 'bg-gray-900' : 'bg-orange-50'}`
                      : `text-gray-500 hover:text-orange-500 ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-orange-50'}`
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-blue-600" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className={`border rounded-xl p-6 md:p-8 shadow-lg ${
          darkMode ? 'bg-[#181c23] border-[#23283a]' : 'bg-white border-gray-200'
        }`}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default GydeProfilePage;
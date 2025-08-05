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
  Home
} from 'lucide-react';

const GydeProfilePage = () => {
  const { user, loading, setUser } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showPIN, setShowPIN] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNextOfKinForm, setShowNextOfKinForm] = useState(false);
  const [nextOfKinSaved, setNextOfKinSaved] = useState(false);

  // Form states
  const [file, setFile] = useState(null);
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




  // Early return after all hooks
  if (loading) return <p>Loading...</p>;
  if (!user && !loading) return <p className="text-center text-gray-500 mt-10">No user found. Please log in.</p>;

  // Streak data
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
      const res = await axios.put('https://gyde-backend-wjh9.onrender.com/api/auth/user/upload-profile-pic', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.data && res.data.profilePicUrl) {
        setPersonalData(prev => ({ ...prev, profilePicture: res.data.profilePicUrl }));
      } else {
        // fallback: show preview
        const reader = new FileReader();
        reader.onload = (ev) => {
          setPersonalData(prev => ({ ...prev, profilePicture: ev.target.result }));
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.error('Upload failed', err);
      alert('Profile image upload failed.');
    }
  };

  const hasNextOfKin = personalData.nextOfKin.name && personalData.nextOfKin.phone && personalData.nextOfKin.relationship;

  const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <div className="flex items-center justify-between mb-2">
        <Icon className={`h-6 w-6 ${color}`} />
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
      </div>
      <h3 className="font-medium text-sm text-gray-600 mb-1">{label}</h3>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );

  // Save profile and update context
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

  const renderPersonalTab = () => (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            <label className="cursor-pointer group block w-full h-full">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-100 to-blue-400 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {personalData.profilePicture ? (
                  <img src={personalData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-blue-600" />
                )}
              </div>
              <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg opacity-80 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4" />
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={e => setFile(e.target.files[0])}
              />
          {/* Upload button for profile picture */}
          {file && (
            <button
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              onClick={handleProfilePictureChange}
              type="button"
            >
              Upload Image
            </button>
          )}
            </label>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center">{loading ? '...' : (user?.name || personalData.name)}</h2>
          <p className="text-gray-500">@{loading ? '...' : (user?.username || personalData.username)}</p>
        </div>

        {/* Profile Completion Notice */}
        {!hasNextOfKin && !nextOfKinSaved && (
          <div className="flex-1 max-w-md">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 text-orange-600 rounded-full p-2 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-800 mb-1">Complete Your Profile</h3>
                  <p className="text-orange-700 text-sm mb-3">
                    Finish setting up your account by adding your next of kin information.
                  </p>
                  <button className="text-blue-600 font-semibold text-sm hover:underline">
                    COMPLETE PROFILE →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Personal Information Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <p className="text-gray-500 text-sm mb-2">Receive money from friends using your username</p>
            <div className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 select-all cursor-default">
              @{personalData.username}
            </div>
          </div>

          {/* Next of Kin Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-900">Next of Kin</h3>
              {hasNextOfKin && nextOfKinSaved && (
                <button
                  onClick={() => { setShowNextOfKinForm(true); setNextOfKinSaved(false); }}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors ml-2"
                >
                  Update
                </button>
              )}
            </div>
            {!hasNextOfKin && !showNextOfKinForm ? (
              <div className="flex items-center justify-between">
                <span className="text-blue-700">No Next of Kin added</span>
                <button
                  onClick={() => setShowNextOfKinForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Next of Kin
                </button>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={personalData.nextOfKin.name}
                    onChange={e => handleNextOfKinChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={personalData.nextOfKin.phone}
                    onChange={e => handleNextOfKinChange('phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <input
                    type="text"
                    value={personalData.nextOfKin.relationship}
                    onChange={e => handleNextOfKinChange('relationship', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g. Brother, Mother, Friend"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors ${!(personalData.nextOfKin.name && personalData.nextOfKin.phone && personalData.nextOfKin.relationship) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!(personalData.nextOfKin.name && personalData.nextOfKin.phone && personalData.nextOfKin.relationship)}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center"><span className="font-semibold text-gray-700 mr-2">Full Name:</span> <span>{personalData.nextOfKin.name}</span></div>
                <div className="flex items-center"><span className="font-semibold text-gray-700 mr-2">Phone:</span> <span>{personalData.nextOfKin.phone}</span></div>
                <div className="flex items-center"><span className="font-semibold text-gray-700 mr-2">Relationship:</span> <span>{personalData.nextOfKin.relationship}</span></div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {personalData.gender}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
              {new Date(personalData.dob).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Save Button removed as requested */}
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="mb-2">
          <span className="font-normal text-base text-gray-400">Forgot password?</span>
        </div>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
          <Shield className="h-5 w-5 mr-2 text-orange-500" />
          Change Password
          <button
            type="button"
            className="ml-2 p-1 rounded hover:bg-orange-100"
            onClick={() => setShowEditPassword((v) => !v)}
            aria-label="Edit Password"
          >
            <svg className="h-5 w-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
          </button>
        </h3>
        {showEditPassword && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={securityData.currentPassword}
                  onChange={(e) => handleSecurityChange('currentPassword', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={securityData.newPassword}
                onChange={(e) => handleSecurityChange('newPassword', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={securityData.confirmPassword}
                onChange={(e) => handleSecurityChange('confirmPassword', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        )}
      </div>

      {/* Change PIN */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="mb-2">
          <span className="font-normal text-base text-gray-400">Forgot PIN?</span>
        </div>
        <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-900">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Change PIN
          <button
            type="button"
            className="ml-2 p-1 rounded hover:bg-blue-100"
            onClick={() => setShowPIN((v) => !v)}
            aria-label="Edit PIN"
          >
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z"/></svg>
          </button>
        </h3>
        {showPIN && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current PIN</label>
              <input
                type={showPIN ? "text" : "password"}
                value={securityData.currentPIN}
                onChange={(e) => handleSecurityChange('currentPIN', e.target.value)}
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Enter current PIN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New PIN</label>
              <input
                type={showPIN ? "text" : "password"}
                value={securityData.newPIN}
                onChange={(e) => handleSecurityChange('newPIN', e.target.value)}
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Enter new PIN"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New PIN</label>
              <input
                type={showPIN ? "text" : "password"}
                value={securityData.confirmPIN}
                onChange={(e) => handleSecurityChange('confirmPIN', e.target.value)}
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Confirm new PIN"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowPIN(!showPIN)}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {showPIN ? 'Hide PIN' : 'Show PIN'}
            </button>
          </div>
        )}
      </div>

      {/* Delete Account */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center text-red-600">
          <Trash2 className="h-5 w-5 mr-2" />
          Delete Account
        </h3>
        <p className="text-sm text-red-700 mb-4">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
        
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Delete Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-red-600">Are you sure you want to delete your account?</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Account deletion functionality would be implemented here');
                  setShowDeleteConfirm(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300">
          Update Security Settings
        </button>
      </div>
    </div>
  );

  const renderStreakTab = () => (
    <div className="space-y-8">
      {/* Current Streak Hero */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full text-white text-3xl font-bold mb-4 shadow-lg">
          {streakData.currentStreak}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Day Streak</h2>
        <p className="text-gray-600">Keep up the great work!</p>
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
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center text-gray-900">
          <Target className="h-5 w-5 mr-2 text-orange-500" />
          Budgeting Performance
        </h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Overall Score</span>
              <span className="text-3xl font-bold text-orange-500">{streakData.budgetingScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-orange-500 to-blue-600 h-4 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${streakData.budgetingScore}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{streakData.achievedGoals}</div>
              <div className="text-sm text-gray-600">Goals Achieved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-400">{streakData.monthlyGoals - streakData.achievedGoals}</div>
              <div className="text-sm text-gray-600">Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{streakData.monthlyGoals}</div>
              <div className="text-sm text-gray-600">Total Goals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button className="flex-1 bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-all duration-300">
          View Analytics
        </button>
        <button className="flex-1 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white py-3 px-6 rounded-lg font-medium transition-all duration-300">
          Set New Goal
        </button>
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
          <div className="w-full sm:w-auto text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage your account settings and preferences</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
            aria-label="Go to Dashboard"
          >
            <Home className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border border-gray-200 rounded-xl mb-6 sm:mb-8 overflow-x-auto">
          <nav className="flex flex-row">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[100px] flex items-center justify-center space-x-2 px-3 sm:px-6 py-3 sm:py-4 font-medium transition-all duration-200 relative ${
                    isActive
                      ? 'text-orange-500 bg-orange-50'
                      : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-blue-600"></div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-6 md:p-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default GydeProfilePage;
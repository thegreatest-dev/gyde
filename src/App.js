import React from 'react';
import { UserProvider } from './context/UserContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';

// Import your pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
import AccSet from './pages/AccSet';
import Customer from './pages/Customer';
import Verify from './pages/verify';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/wallet" element={
            <PrivateRoute>
              <Wallet />
            </PrivateRoute>
          } />
          <Route path="/statistics" element={
            <PrivateRoute>
              <Statistics />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } />
          <Route path="/accset" element={
            <PrivateRoute>
              <AccSet />
            </PrivateRoute>
          } />
          <Route path="/customer" element={
            <PrivateRoute>
              <Customer />
            </PrivateRoute>
          } />
          <Route path="/verify" element={<Verify />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import SplashScreen from './components/SplashScreen';

// Mock context for auth, replace with real one later or use props
export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Check for token
  const [showSplash, setShowSplash] = useState(true); // Cinematic Intro

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    const savedUser = localStorage.getItem('user');

    if (token && savedRole && savedUser) {
      setUser({ token, role: savedRole, ...JSON.parse(savedUser) });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    const token = userData.token || userData.accessToken;
    localStorage.setItem('token', token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('user', JSON.stringify({ username: userData.username || userData.email.split('@')[0], email: userData.email, id: userData.id }));
    setUser({ token, role: userData.role, username: userData.username || userData.email.split('@')[0], email: userData.email, id: userData.id });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Wait for Splash to finish
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (loading) return null; // Or a simple spinner if token check takes time (usually instant)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div style={{
          minHeight: '100vh',
          // Use a dark base to match the fade-out of splash
          background: '#030014',
          animation: 'fadeIn 1s ease-out' // Smooth entry after splash
        }}>
          <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

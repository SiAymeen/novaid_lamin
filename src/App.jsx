import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PreferencesProvider } from './context/PreferencesContext';

import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Map from './pages/Map';
import MyMissions from './pages/MyMissions';
import FamilyManagement from './pages/FamilyManagement';   // ← Use this one
import FamilyDetails from './pages/FamilyDetails';
import Home from './pages/Home';
import Login from './pages/Login';


function ThemedApp() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; // Default to dark mode
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home toggleTheme={toggleTheme} isDark={isDark} />} />
          <Route path="/home" element={<Home toggleTheme={toggleTheme} isDark={isDark} />} />
          <Route path="/dashboard" element={<Dashboard toggleTheme={toggleTheme} isDark={isDark} />} />
          <Route path="/alerts" element={<Alerts toggleTheme={toggleTheme} isDark={isDark} />} />
          <Route path="/map" element={<Map toggleTheme={toggleTheme} isDark={isDark} />} />
          <Route path="/inventory" element={<Inventory toggleTheme={toggleTheme} isDark={isDark} />} />
          <Route path="/login" element={<Login toggleTheme={toggleTheme} isDark={isDark} />} />
          <Route path="/users" element={<Users toggleTheme={toggleTheme} isDark={isDark} />} />
          <Route path="/missions" element={<MyMissions toggleTheme={toggleTheme} isDark={isDark} />} />
          <Route path="/family" element={<FamilyManagement toggleTheme={toggleTheme} isDark={isDark} />} />
          <Route path="/family/:id" element={<FamilyDetails toggleTheme={toggleTheme} isDark={isDark} />} />
          <Route path="/families" element={<FamilyManagement toggleTheme={toggleTheme} isDark={isDark} />} />
          <Route path="/families/:id" element={<FamilyDetails toggleTheme={toggleTheme} isDark={isDark} />} />
          <Route path="/settings" element={<Settings toggleTheme={toggleTheme} isDark={isDark} />} />
        </Routes>
      </Router>
    </div>
  );
}

function App() {
  return (
    <PreferencesProvider>
      <ThemedApp />
    </PreferencesProvider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ManufacturerLogin from './pages/ManufacturerLogin';
import ManufacturerSignup from './pages/ManufacturerSignup';
import ManufacturerDashboard from './pages/ManufacturerDashboard';
import CustomerVerification from './pages/CustomerVerification';
import AdminDashboard from './pages/AdminDashboard';
import { Toaster } from 'react-hot-toast';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manufacturer/login" element={<ManufacturerLogin />} />
            <Route path="/manufacturer/signup" element={<ManufacturerSignup />} />
            <Route path="/manufacturer/dashboard" element={<ManufacturerDashboard />} />
            <Route path="/customer/verify" element={<CustomerVerification />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </div>
    </Router>
  );
}

export default App;

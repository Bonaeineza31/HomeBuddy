// src/pages/layouts/Adminnavbar.jsx
import React, { useState } from 'react';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import '../Adstyles/Adminnavbar.css';
import image from '../assets/IMG-20250103-WA0031.jpg'
const AdminNavbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  return (
    <div className="admin-navbar">
      {/* <div className="navbar-title">Admin Dashboard</div> */}
      <div className="navbar-actions">
        <button onClick={toggleTheme} className="theme-toggle">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="profile-section" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <img src={image} alt="Admin" className="profile-img" />
          <ChevronDown size={16} className="dropdown-icon" />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div className="dropdown-item">View Profile</div>
              <div className="dropdown-item">Change Password</div>
              <div className="dropdown-item">Logout</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;

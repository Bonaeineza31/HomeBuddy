// src/components/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { HiHomeModern } from "react-icons/hi2";
import { FaUser, FaPlus, FaUsers, FaSignOutAlt } from "react-icons/fa";
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  // If no user data, redirect to login
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    navigate('/login');
  };

  const handleBeRoommate = () => {
    // Navigate to roommate functionality
    navigate('/roommate-profile');
  };

  const handleAddListing = () => {
    // Navigate to add listing page
    navigate('/add-listing');
  };

  const handleViewStudentHome = () => {
    // Navigate to student home page
    navigate('/student');
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <HiHomeModern className="logo" />
          <span>HomeBuddy</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Welcome, {user.name}!</h1>
          <p className="role-badge">
            {user.role === 'student' ? '🎓 Student' : '🏠 Landlord'}
          </p>
        </div>

        <div className="dashboard-main">
          <div className="profile-section">
            <div className="profile-card">
              <div className="profile-avatar">
                <FaUser size={40} />
              </div>
              <div className="profile-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <p className="role-text">
                  {user.role === 'student' ? 'Student Account' : 'Landlord Account'}
                </p>
                <span className="verified-badge">
                  {user.verified ? '✅ Verified' : '❌ Not Verified'}
                </span>
              </div>
              <div className="profile-actions">
                {user.role === 'student' ? (
                  <button className="action-btn roommate-btn" onClick={handleBeRoommate}>
                    <FaUsers />
                    Be a Roommate
                  </button>
                ) : (
                  <button className="action-btn listing-btn" onClick={handleAddListing}>
                    <FaPlus />
                    Post a Listing
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-actions">
            <div className="action-cards">
              <div className="action-card">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  {user.role === 'student' ? (
                    <>
                      <button className="btn btn-primary" onClick={handleViewStudentHome}>
                        Browse Properties
                      </button>
                      <button className="btn btn-secondary">
                        View Saved Properties
                      </button>
                      <button className="btn btn-tertiary">
                        My Roommate Profile
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary" onClick={handleAddListing}>
                        Add New Property
                      </button>
                      <button className="btn btn-secondary">
                        Manage Listings
                      </button>
                      <button className="btn btn-tertiary">
                        View Applications
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="action-card">
                <h3>Statistics</h3>
                <div className="stats">
                  {user.role === 'student' ? (
                    <>
                      <div className="stat">
                        <span className="stat-number">0</span>
                        <span className="stat-label">Saved Properties</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">0</span>
                        <span className="stat-label">Applications</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="stat">
                        <span className="stat-number">0</span>
                        <span className="stat-label">Active Listings</span>
                      </div>
                      <div className="stat">
                        <span className="stat-number">0</span>
                        <span className="stat-label">Applications Received</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
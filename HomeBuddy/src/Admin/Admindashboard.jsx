// src/Admin/Admindashboard.jsx
import React from 'react';
import { Users, Building, ClipboardList, LineChart, Rocket, Star, UserPlus, LayoutDashboard } from 'lucide-react';
import '../Adstyles/Admindashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Welcome back, Admin!</h2>
        <p>Here's a quick overview of what's happening on HomeBuddy.</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <Users size={28} />
          <div>
            <p className="card-count">0</p>
            <h4>Users</h4>
          </div>
        </div>
        <div className="dashboard-card">
          <Building size={28} />
          <div>
            <p className="card-count">0</p>
            <h4>Landlords</h4>
          </div>
        </div>
        <div className="dashboard-card">
          <ClipboardList size={28} />
          <div>
            <p className="card-count">0</p>
            <h4>Listings</h4>
          </div>
        </div>
        <div className="dashboard-card">
          <LineChart size={28} />
          <div>
            <p className="card-count">0</p>
            <h4>Pending Approvals</h4>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h3>Quick Actions</h3>
        <div className="quick-actions">
          <button className="action-btn"><Rocket size={20} /> Approve Users</button>
          <button className="action-btn"><LayoutDashboard size={20} /> Manage Listings</button>
          <button className="action-btn"><Star size={20} /> Review Feedback</button>
          <button className="action-btn"><UserPlus size={20} /> Invite New Admin</button>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="bottom-section">
          <h4>Recent Feedback</h4>
          <p>No recent feedback yet.</p>
        </div>
        <div className="bottom-section">
          <h4>New Registrations</h4>
          <p>No new users registered.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState } from 'react';
import Sidebar from '../../components/Landlord/LandlordSidebar';
import DashboardCard from '../../components/Landlord/DashboardCard';
import UploadProperty from './Properties';
import LandMessages from './Messages';
import '../../styles/Landlord.css';

const LandlordDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Example data
  const pendingApprovals = [
    { title: 'Hilltop Residence', status: 'Awaiting Review' },
    { title: 'Green Villa', status: 'Awaiting Review' }
  ];

  const recentActivities = [
    { action: 'Uploaded new property: Green Villa', date: '2025-07-25' },
    { action: 'Responded to inquiry for Lakeside House', date: '2025-07-24' },
    { action: 'Updated price for Urban Nest', date: '2025-07-23' }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="dashboard-main">
        {currentPage === 'dashboard' && (
          <div className="dashboard-section">
            <div className="card-container">
              <DashboardCard title="Properties Posted" value="12" />
              <DashboardCard title="Revenue Generated" value="$4,560" />
            </div>

            {/* Pending Approvals */}
            <div className="dashboard-panel">
              <h3>Pending Approvals</h3>
              {pendingApprovals.length > 0 ? (
                <ul className="simple-list">
                  {pendingApprovals.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.title}</strong> — {item.status}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No pending approvals</p>
              )}
            </div>

            {/* Recent Activities */}
            <div className="dashboard-panel">
              <h3>Recent Activities</h3>
              <div className="activity-cards">
                {recentActivities.map((item, idx) => (
                  <div key={idx} className="activity-card">
                    <p className="activity-action">
                      <strong>{item.date}</strong>: {item.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'upload' && <UploadProperty />}
        {currentPage === 'messages' && <LandMessages />}
      </main>
    </div>
  );
};

export default LandlordDashboard;

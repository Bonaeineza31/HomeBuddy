import React from 'react';
import '../../styles/Landlord.css';

const DashboardCard = ({ title, value }) => (
  <div className="landdashboard-card">
    <h4>{title}</h4>
    <p>{value}</p>
  </div>
);

export default DashboardCard;
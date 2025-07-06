import React from 'react';
import '../../styles/Landlord.css';

const LandlordDashboard = () => {
  const statsCards = [
    {
      title: "Total Properties",
      value: "12",
      description: "Active listings",
      icon: "🏨",
      trend: "+2 this month",
    },
    {
      title: "Booked Properties",
      value: "8",
      description: "Currently occupied",
      icon: "👥",
      trend: "67% occupancy",
    },
    {
      title: "New Messages",
      value: "5",
      description: "Unread conversations",
      icon: "💬",
      trend: "2 urgent",
    },
    {
      title: "Monthly Revenue",
      value: "Rwf 821,400",
      description: "This month's earnings",
      icon: "💰",
      trend: "+8% from last month",
    },
  ]

  const recentActivity = [
    {type: "booking", message: "New booking request from Sarah Ayioka", time: "2 hours ago"},
    {type: "message", message: "Message from Mike Manzi about maintenance", time: "4 hours ago"},
    {type: "review", message: "New 5-star review for Kwanayinzira house", time: "2 days ago"},
  ]

  return (
    <div>
      <div className="page-header">
        <div className="page-title">
          <h1>Welcome back, John!</h1>
          <p>Here's what's happening with your properties today.</p>
        </div>
        <button className="btn btn-primary">🏨 Add New Property</button>
      </div>

      <div className="stats-grid">
        {statsCards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">{card.title}</h3>
              <span className="stat-card-icon">{card.icon}</span>
            </div>
            <div className="stat-card-value">{card.value}</div>
            <p className="stat-card-description">{card.description}</p>
            <p className="stat-card-trend">{card.trend}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        <div className="card">
          <div className="card-header">
            <h3>Recent Activity</h3>
            <p>Your latest property management updates</p>
          </div>
          <div className="card-content">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {recentActivity.map((activity, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "8px", height: "8px", background: "#2563eb", borderRadius: "50%"}}></div>
                  <div style={{ flex: 1}}>
                    <p style={{ margin: "0 0 0.25rem 0", fontWeight: "500", fontSize: "0.875rem" }}>
                      {activity.message}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.875rem", color: "#64748b"}}>
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Quick Actions</h3>
            <p>Common tasks</p>
          </div>
          <div className="card-content" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <button className="btn btn-secondary" style={{ justifyContent: "flex-start"}}>🏨 Add New Property</button>
            <button className="btn btn-secondary" style={{ justifyContent: "flex-start"}}>📅 View Bookings</button>
            <button className="btn btn-secondary" style={{ justifyContent: "flex-start"}}>💬 Check Messages</button>
            <button className="btn btn-secondary" style={{ justifyContent: "flex-start"}}>📈 View Analytics</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandlordDashboard;
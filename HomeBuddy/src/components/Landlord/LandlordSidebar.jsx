import React from 'react';
import '../../styles/Landlord.css';

const LandlordSidebar = ({ currentPage, setCurrentPage, isOpen, setIsOpen }) => {
  const navigation = [
    {
      title: "Overview",
      items: [
          { id: "dashboard", title: "Dashboard", icon: "🏠"},
          {id: "properties", title: "My properties", icon: "🏨"}
      ],
    },
    {
      title: "Management",
      items: [
        { id: "bookings", title: "Booking Requests", icon: "📅"},
        { id: "messages", title: "Messages", icon: "💬"},
        { id: "reviews", title: "Reviews", icon: "⭐"},
        { id: "payments", title: "Payments", icon: "💳"},
      ],
    },
    {
      title: "Account",
      items: [{id: "profile", title: "Profile Settings", icon: "👤"}],
    },
  ]

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🏨</div>
          <div className="sidebar-brand-text">
            <h3>HomeBuddy</h3>
            <p>Landlord Portal</p>
          </div>
        </div>
      </div>

      <div className="sidebar-content">
        {navigation.map((section) => (
          <div key={section.title} className="sidebar-section">
            <div clasName="sidebar-section-title">{section.title}</div>
            <ul className="sidebar-nav">
              {section.items.map((item) => (
                <li key={item.id} className="sidebar-nav-item">
                  <a
                    href="#"
                    className={`sidebar-nav-link $ {currentPage === item.id ? "active" : ""}`}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(item.id)
                      setIsOpen(false)
                    }}
                  >
                    <span className="sidebar-nav-icon">{item.icon}</span>
                    <span>{item.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">
            <img src="./placeholder.webp" alt="User"/>
          </div>
          <div>
            <div className="font-semibold">John Doe</div>
            <div className="text-sm text-gray-500">john@example.com</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandlordSidebar
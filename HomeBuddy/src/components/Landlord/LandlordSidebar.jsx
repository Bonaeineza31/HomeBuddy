import React from 'react';
import { HiOutlineHome, HiOutlineUpload, HiOutlineChatAlt2 } from 'react-icons/hi';
import '../../styles/Landlord.css';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'dashboard', title: 'Dashboard', icon: <HiOutlineHome /> },
    { id: 'upload', title: 'Upload Property', icon: <HiOutlineUpload /> },
    { id: 'messages', title: 'Messages', icon: <HiOutlineChatAlt2 /> },
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">HomeBuddy</h2>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-link ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span className="icon">{item.icon}</span> {item.title}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
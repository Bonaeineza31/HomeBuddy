import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, ShieldCheck, FileText,
  FilePlus2, MessageSquare, Settings, LogOut
} from 'lucide-react';
import '../Adstyles/Adminsidebar.css';

const AdminSidebar = () => {
  const location = useLocation();

  const links = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard /> },
    { to: '/admin/approvals', label: 'Approvals', icon: <ShieldCheck /> },
    { to: '/admin/listings', label: 'Listings', icon: <FilePlus2 /> },
    { to: '/admin/users', label: 'Users', icon: <Users /> },
    { to: '/admin/documents', label: 'Documents', icon: <FileText /> },
    { to: '/admin/reviews', label: 'Reviews', icon: <MessageSquare /> },
    { to: '/admin/settings', label: 'Profile Settings', icon: <Settings /> },
    { to: '/login', label: 'Logout', icon: <LogOut /> }
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>HomeBuddy Admin</h2>
      </div>
      <ul className="sidebar-nav">
        {links.map(link => (
          <li key={link.to} className={`sidebar-item ${location.pathname === link.to ? 'active' : ''}`}>
            <Link to={link.to} className="sidebar-link">
              {link.icon}
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AdminSidebar;

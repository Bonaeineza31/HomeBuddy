// src/pages/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './Adminsidebar';
import AdminNavbar from './Adminnavbar';
import '../Adstyles/Adminlayout.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout-container">
      <AdminSidebar />
      <div className="admin-main-content">
        <AdminNavbar />
        <main className="admin-outlet">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

// src/App.jsx (Final Update)
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './components/Home/home';
import LoginPage from './components/Auth/login';
import SignupPage from './components/Auth/signup';

// Landlord
import LandlordDashboard from './pages/Landlord/LandlordDashboard';
import LandlordLayout from './pages/layouts/LandlordLayout';

// Student
import StudentHome from './pages/Student/Home';
import StudentListing from './pages/Student/Listing';
import StudentSaved from './pages/Student/Saved';
import StudentContact from './pages/Student/Contact';
import Detail from './pages/Student/detail';
import RoommateForm from './pages/Student/RoommateMatch';
// import Profile from './pages/Student/profile';


// Admin
import AdminLayout from './Admin/AdminLayout';
import AdminDashboard from './Admin/Admindashboard';
import AdminApprovals from './Admin/approval';
import AdminListing from './Admin/AdminListing';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Landlord */}
      <Route
        path="/landlord-dashboard"
        element={
          <LandlordLayout>
            <LandlordDashboard />
          </LandlordLayout>
        }
      />

      {/* Student */}
      <Route path="/student" element={<StudentHome />} />
      <Route path="/listing" element={<StudentListing />} />
      <Route path="/saved" element={<StudentSaved />} />
      <Route path="/contact" element={<StudentContact />} />
      <Route path="/property/:id" element={<Detail />} />
      <Route path="/be-roommate" element={<RoommateForm />} />
      {/* <Route path="/profile" element={<Profile />} /> */}

      {/* Admin Panel - uses layout with nested routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="approvals" element={<AdminApprovals />} />
          <Route path="listings" element={<AdminListing />} />
        {/* You can add more like:
        <Route path="users" element={<Users />} />
        <Route path="listings" element={<AdminListings />} />
        */}
      </Route>
    </Routes>
  );
}

export default App;

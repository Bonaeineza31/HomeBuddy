// src/App.jsx (Student Layout Approach)
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import Home from './components/Home/home';
import LoginPage from './components/Auth/login';
import SignupPage from './components/Auth/signup';

// Landlord
import LandlordDashboard from './pages/Landlord/LandlordDashboard';
import LandlordLayout from './pages/layouts/LandlordLayout';
import { FloatingChatButton } from './components/Chats';
import LandMessages from './pages/Landlord/Messages';

// Student
import StudentHome from './pages/Student/Home';
import StudentListing from './pages/Student/Listing';
import StudentSaved from './pages/Student/Saved';
import StudentContact from './pages/Student/Contact';
import Detail from './pages/Student/detail';
import RoommateForm from './pages/Student/RoommateMatch';
import Messages from './pages/Student/Messages';
import Profile from './pages/Student/Profile';
// Import or create StudentLayout
// import StudentLayout from './pages/layouts/StudentLayout';

// Admin
import AdminLayout from './Admin/AdminLayout';
import AdminDashboard from './Admin/Admindashboard';
import AdminApprovals from './Admin/approval';
import AdminListing from './Admin/AdminListing';

function App() {
  const navigate = useNavigate();

  const handleListingView = (listing) => {
    console.log('User wants to view listing:', listing);
    navigate(`/listing/${listing.id}`);
  };

  const yourListingsData = [];

  return (
    <div>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Landlord */}
        <Route path="/landlord/messages" element={<Messages />} />
        <Route 
          path="/landlord"
          element={
            <LandlordDashboard 
              onListingView={handleListingView}
              yourListings={yourListingsData}
            />
          }
        />


    
        <Route path="/student" element={<StudentHome />} />
        <Route path="/listing" element={<StudentListing />} />
        <Route path="/saved" element={<StudentSaved />} />
        <Route path="/contact" element={<StudentContact />} />
        <Route path="/student/listing" element={<StudentListing />} />
        <Route path="/student/saved" element={<StudentSaved />} />
        <Route path="/student/contact" element={<StudentContact />} />
        <Route path="/student/detail/:id" element={<Detail />} />
        <Route path="/student/roommate" element={<RoommateForm />} />
        <Route path="/student/messages" element={<Messages />} />
        <Route path="/student/profile" element={<Profile />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="approvals" element={<AdminApprovals />} />
          <Route path="listings" element={<AdminListing />} />
        </Route>
      </Routes>

      <FloatingChatButton />
    </div>
  );
}

export default App;
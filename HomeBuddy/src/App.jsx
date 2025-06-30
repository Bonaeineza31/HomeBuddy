// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/home';
import LoginPage from './components/Auth/login';
import SignupPage from './components/Auth/signup';
import LandlordDashboard from './pages/Landlord/LandlordDashboard';
import LandlordLayout from './layouts/LandlordLayout';
/*import StudentDashboard from '';*/

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/landlord-dashboard" element={
        <LandlordLayout>
          <LandlordDashboard />
        </LandlordLayout>
      } 
      />
    </Routes>
  );
}

export default App;

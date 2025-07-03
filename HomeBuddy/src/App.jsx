// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/home';
import LoginPage from './components/Auth/login';
import SignupPage from './components/Auth/signup';
import LandlordDashboard from './pages/Landlord/LandlordDashboard';
import LandlordLayout from './pages/layouts/LandlordLayout';
/*import StudentDashboard from '';*/
import StudentHome from './pages/Student/Home';
import StudentListing from './pages/Student/Listing';
import StudentSaved from './pages/Student/Saved';
import StudentContact from './pages/Student/Contact';

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
      <Route path='/student' element={<StudentHome />}></Route>
      <Route path='/listing' element={<StudentListing />}></Route>
      <Route path='/saved' element={<StudentSaved />}></Route>
      <Route path='/contact' element={<StudentContact />}></Route>
    </Routes>
  );
}

export default App;

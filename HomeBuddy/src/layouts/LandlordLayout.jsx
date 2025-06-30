import React from 'react';
import Sidebar from '../components/Landlord/LandlordSidebar';
import '../styles/Landlord.css';

const LandlordLayout = ({children}) => {
  return (
    <div className="landlord-layout">
        <Sidebar />
        <main className="landlord-main">
            {children}
        </main>
    </div>
  );
};

export default LandlordLayout;
import React, { useState, useEffect } from 'react'; // Import useEffect
import { Search, ChevronDown } from 'lucide-react'; // Remove Link as it's not used directly here
import { HiHomeModern } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import { MdAccountCircle } from "react-icons/md";
import { FaHome, FaHandsHelping, FaTasks, FaPlaneDeparture, FaMapMarkedAlt, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';
import { MdOutlineSupportAgent } from "react-icons/md";
import { Mail, Phone } from 'lucide-react';

import './home.css';

const RentalLandingPage = () => {
  const [filters, setFilters] = useState({
    propertyType: '',
    situation: '',
    maxPrice: '',
    preferredGender: '',
    location: '',
    furnishing: ''
  });

  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeSection, setActiveSection] = useState('home'); // New state for active section

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setOpenDropdown(null);
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
  };

  const dropdownOptions = {
    propertyType: ['Room', 'Full Property'],
    situation: ['Coliving', 'Alone'],
    preferredGender: ['Female', 'Male', 'Trans Male', 'Trans Female', 'N/A (living alone)'],
    location: ['Kigali City', 'Remera', 'Kimironko', 'Kacyiru'],
    furnishing: ['Fully Furnished', 'Partially', 'Unfurnished']
  };

  const Dropdown = ({ label, value, options, filterKey, placeholder }) => (
    <div className="dropdown-container">
      <label className="dropdown-label">{label}</label>
      <button
        onClick={() => setOpenDropdown(openDropdown === filterKey ? null : filterKey)}
        className={`dropdown-button ${openDropdown === filterKey ? 'dropdown-button-hover' : ''}`}
      >
        <span className={value ? 'dropdown-text' : 'dropdown-placeholder'}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`chevron-icon ${openDropdown === filterKey ? 'chevron-rotate' : ''}`}
        />
      </button>
      {openDropdown === filterKey && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleFilterChange(filterKey, option)}
              className="dropdown-option"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const services = [
    { id: 1, name: 'Find Your Perfect Home', description: 'Discover your dream rental from our extensive, curated listings. Use our smart filters to find exactly what you need.', icon: <FaHome />, status: 'active' },
    { id: 2, name: 'Dedicated Support', description: 'Our friendly team is here to assist you with any questions or issues, from property inquiries to lease agreements.', icon: <MdOutlineSupportAgent />, status: 'active' },
    { id: 3, name: 'Effortless Property Management', description: 'For property owners, we handle everything from tenant screening to maintenance, ensuring your investment thrives.', icon: <FaTasks />, status: 'active' },
    { id: 4, name: 'Relocation Assistance', description: 'New to Kigali? We offer personalized support to help you settle in smoothly, including neighborhood guides.', icon: <FaMapMarkedAlt />, status: 'active' },
    { id: 5, name: 'Premium Airport Pickup', description: 'Start your journey hassle-free with our exclusive airport pickup service. Convenience right from your arrival.', icon: <FaPlaneDeparture />, status: 'coming-soon' },
    { id: 6, name: 'Personalized Tours', description: 'Book private, guided tours of properties that meet your specific criteria and schedule.', icon: <FaHandsHelping />, status: 'active' },
  ];

  const safeSearchingTips = [
    { id: 1, title: "Verify Listings & Agents", description: "Always check for legitimate photos, detailed descriptions, and verify the agent's credentials. Be wary of listings that seem too good to be true." },
    { id: 2, title: "Never Pay Upfront Before Viewing", description: "Do not send money or deposits before you have physically viewed the property and verified its availability and condition." },
    { id: 3, title: "Insist on a Signed Contract", description: "Ensure all agreements are in writing and signed by both parties. Read the lease agreement carefully before committing." },
    { id: 4, title: "Meet in a Safe Location", description: "When meeting agents or landlords for the first time, choose a public place. Inform a friend or family member of your meeting details." },
    { id: 5, title: "Beware of Pressure Tactics", description: "Legitimate agents won't pressure you into quick decisions or payments. Take your time to make an informed choice." },
    { id: 6, title: "Trust Your Gut", description: "If something feels off or suspicious, it likely is. Don't hesitate to walk away from a deal that doesn't feel right." },
  ];

  // Function to handle smooth scroll on click
  const handleNavLinkClick = (e, sectionId) => {
    e.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId); // Set active section immediately on click
    }
  };

  // Effect to observe scroll position and update active section
  useEffect(() => {
    const sections = ['home', 'services', 'tips', 'footer']; // IDs of your scrollable sections
    const observerOptions = {
      root: null, // relative to the viewport
      rootMargin: '-50% 0px -49% 0px', // When the middle 2% of the section is in view
      threshold: 0 // As soon as any part of the target is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(id => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      }
    });

    // Clean up the observer when the component unmounts
    return () => {
      sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []); // Run only once on mount

  return (
    <div className="container">
      {/* Navigation */}
      <nav className="nav">
        <div className="logo">
          <div className="logo-icon">
            <HiHomeModern />
            <span className="logo-text">Homebuddy</span>
          </div>
        </div>
        <div className="nav-links">
 
          <a href="#home" onClick={(e) => handleNavLinkClick(e, 'home')} className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>Home</a>
          <a href="#services" onClick={(e) => handleNavLinkClick(e, 'services')} className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}>Our Services</a>
          <a href="#tips" onClick={(e) => handleNavLinkClick(e, 'tips')} className={`nav-link ${activeSection === 'tips' ? 'active' : ''}`}>Tips</a>
          <a href="#footer" onClick={(e) => handleNavLinkClick(e, 'footer')} className={`nav-link ${activeSection === 'footer' ? 'active' : ''}`}>Contact Us</a>
        </div>
        <Link to="/login">
          <button className="signin-button">
            <MdAccountCircle /> SignIn
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="hero-section" id='home'>
        <div className="hero-content">
          <h1 className="hero-title">
            Finding Your New<br />
            Home Is Simple
          </h1>
          <p className="hero-description">
            HomeBuddy is your go-to destination for finding the<br />
            perfect rental home to suit your needs.<br />
            browse thousands of property listings across Rwanda<br />
            and find your best match.
          </p>
        </div>

        <div className="filter-box">
          <h3 className="filter-title">Find Your Perfect Home</h3>

          <Dropdown
            label="Property Type"
            value={filters.propertyType}
            options={dropdownOptions.propertyType}
            filterKey="propertyType"
            placeholder="Select property type"
          />
          <Dropdown
            label="Situation"
            value={filters.situation}
            options={dropdownOptions.situation}
            filterKey="situation"
            placeholder="Select situation"
          />
          <div className="dropdown-container">
            <label className="dropdown-label">Max Price</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              placeholder="Enter maximum price"
              className="input"
            />
          </div>
          <Dropdown
            label="Preferred Gender"
            value={filters.preferredGender}
            options={dropdownOptions.preferredGender}
            filterKey="preferredGender"
            placeholder="Select preferred gender"
          />
          <Dropdown
            label="Location"
            value={filters.location}
            options={dropdownOptions.location}
            filterKey="location"
            placeholder="Select location"
          />
          <Dropdown
            label="Furnishing"
            value={filters.furnishing}
            options={dropdownOptions.furnishing}
            filterKey="furnishing"
            placeholder="Select furnishing level"
          />
          <Link to="/login">
          <button onClick={handleSearch} className="search-button">
            <Search size={16} />
            <span>Search</span>
          </button>
          </Link>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="our-services-section" id='services'>
        <div className="section-header">
          <h2 className="section-title">Our Services</h2>
          <p className="section-description">
            We're here to make your property journey simple and stress-free. Discover how we can help you with our comprehensive range of services.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service.id} className={`service-card ${service.status === 'coming-soon' ? 'service-card-coming-soon' : ''}`}>
              <div className="service-icon">{service.icon}</div>
              <div className="service-content">
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                {service.status === 'coming-soon' && (
                  <span className="service-status-tag">Coming Soon!</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips for Safe Searching Section */}
      <div className="safe-searching-section" id='tips'>
        <div className="section-header">
          <h2 className="section-title">Tips for Safe Searching</h2>
          <p className="section-description">
            Your safety is our priority. Follow these essential tips to ensure a secure and trustworthy rental search experience in Kigali.
          </p>
        </div>
        <div className="tips-grid">
          {safeSearchingTips.map((tip) => (
            <div key={tip.id} className="tip-card">
              <h3 className="tip-title">{tip.title}</h3>
              <p className="tip-description">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer" id='footer'>
        <div className="footer-content">
          <div className="footer-section footer-about">
            <div className="logo-icon footer-logo">
              {/* Removed HiHomeModern here to align with original nav bar logo styling where icon and text are separated */}
              <span className="logo-text">Homebuddy</span>
            </div>
            <p>Your trusted partner for finding the perfect rental home in Kigali, Rwanda. We connect you with verified properties and provide dedicated support.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
            </div>
          </div>
          <div className="footer-section footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home" onClick={(e) => handleNavLinkClick(e, 'home')}>Home</a></li>
              <li><a href="#services" onClick={(e) => handleNavLinkClick(e, 'services')}>Our Services</a></li>
              <li><a href="#tips" onClick={(e) => handleNavLinkClick(e, 'tips')}>Tips</a></li>
              <li><a href="#footer" onClick={(e) => handleNavLinkClick(e, 'footer')}>Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li> {/* This can remain a regular link if it goes to a different page */}
            </ul>
          </div>
          <div className="footer-section footer-contact">
            <h4>Contact Us</h4>
            <p><Mail size={16} /> info@homebuddy.rw</p>
            <p><Phone size={16} /> +250 788 123 456</p>
            <p>KG 567 St, Kimihurura<br/>Kigali, Rwanda</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Homebuddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default RentalLandingPage;
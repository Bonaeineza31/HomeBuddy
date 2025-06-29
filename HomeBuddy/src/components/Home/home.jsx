import React, { useState } from 'react';
import { Search, ChevronDown, Link as LinkIcon } from 'lucide-react';
import { HiHomeModern } from "react-icons/hi2";
import { Link } from 'react-router-dom';

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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setOpenDropdown(null);
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
  };

  const properties = [
    {
      id: 1,
      name: "Ocean Breeze Villa",
      price: "€910,000.00",
      image: "/api/placeholder/300/200",
      beds: 4,
      baths: 2,
      location: "12 High Street, Andorra, CA 90210"
    },
    {
      id: 2,
      name: "Jackson House",
      price: "€750,000.00",
      image: "/api/placeholder/300/200",
      beds: 3,
      baths: 2,
      location: "456 Oak Avenue, San Jose, CA 95110"
    },
    {
      id: 3,
      name: "Lakeside Cottage",
      price: "€540,000.00",
      image: "/api/placeholder/300/200",
      beds: 3,
      baths: 1,
      location: "789 Maple Drive, Los Angeles, CA 90028"
    }
  ];

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

  return (
    <div className="container">
      {/* Navigation */}
      <nav className="nav">
        <div className="logo">
          <div className="logo-icon">
            <span className="logo-icon-text">HomeBuddy</span>
          </div>
          <HiHomeModern />
          <span className="logo-text">Rent HB</span>
        </div>
        <div className="nav-links">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">Listings</a>
          <a href="#" className="nav-link">Support</a>
          <a href="#" className="nav-link">Contact</a>
          <a href="#" className="nav-link">About us</a>
        </div>
        <Link to="/login">
        <button className="signin-button">
          sign In
        </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        {/* Left Content */}
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

        {/* Filter Box */}
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

          <button onClick={handleSearch} className="search-button">
            <Search size={16} />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="hero-image-section">
        <div className="hero-image">
          Modern Luxury Home
        </div>
      </div>

      {/* Most Viewed Section */}
      <div className="most-viewed-section">
        <div className="section-header">
          <h2 className="section-title">Most Viewed</h2>
          <p className="section-description">
            Discover a range of vacation homes worldwide. Book securely and get
            expert customer support for a stress-free stay.
          </p>
        </div>

        <div className="properties-grid">
          {properties.map((property) => (
            <div key={property.id} className="property-card">
              <div className="property-image">
                Property Image
              </div>
              <div className="property-content">
                <div className="property-header">
                  <h3 className="property-name">{property.name}</h3>
                  <div className="property-features">
                    <span>{property.beds} 🛏️</span>
                    <span>{property.baths} 🚿</span>
                  </div>
                </div>
                <p className="property-location">{property.location}</p>
                <p className="property-price">{property.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="pagination">
          <div className="pagination-dot pagination-dot-active"></div>
          <div className="pagination-dot pagination-dot-inactive"></div>
          <div className="pagination-dot pagination-dot-inactive"></div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        <div className="bottom-content">
          <div className="bottom-image">
            <div className="bottom-image-icon">
              🏠
            </div>
          </div>
          <div className="bottom-text">
            <h2 className="bottom-title">
              The Easiest Method<br />
              To Find a House
            </h2>
            <p className="bottom-description">
              Our platform makes it simple to discover your perfect rental home
              with advanced filtering options and personalized recommendations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalLandingPage;
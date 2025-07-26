import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaWifi, FaCouch, FaUserFriends, FaHeart, FaRegHeart, FaMap, FaPhone, FaEnvelope, FaBus, FaClinicMedical, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { IoBed } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import Navbar from '../../components/Navbar';
import PropertyCard from '../../components/PropertyCard';
import styles from '../../styles/Home.module.css';
import '../../styles/detail.css';

function Detail() {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property;
  const allProperties = location.state?.allProperties;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Dummy data for nearby facilities - you'd ideally fetch this based on property location
  const nearbyFacilities = [
    { name: "Bus Station", icon: <FaBus />, distance: "200m" },
    { name: "Clinic", icon: <FaClinicMedical />, distance: "1.5km" },
    { name: "Market", icon: <FaShoppingCart />, distance: "500m" },
    { name: "School", icon: <FaLocationDot />, distance: "800m" }, // Reusing FaLocationDot for example
  ];

  // Load Leaflet (OpenStreetMap) script and CSS
  useEffect(() => {
    const loadLeaflet = () => {
      if (window.L) {
        setIsMapLoaded(true);
        return;
      }

      // Load Leaflet CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      document.head.appendChild(cssLink);

      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsMapLoaded(true);
        setMapError(false);
      };
      script.onerror = () => {
        console.error('Error loading Leaflet script');
        setIsMapLoaded(false);
        setMapError(true);
      };
      document.head.appendChild(script);
    };

    loadLeaflet();
  }, []);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (isMapLoaded && mapRef.current && property && !map) {
      initializeMap();
    }
  }, [isMapLoaded, property, map]);

  const getCoordinatesFromLocation = async (locationString) => {
    try {
      // Use a free geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationString + ', Rwanda')}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      } else {
        console.warn('Geocoding failed, using fallback coordinates');
        // Fallback to Kigali coordinates if geocoding fails
        return { lat: -1.9441, lng: 30.0619 };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      // Fallback to Kigali coordinates
      return { lat: -1.9441, lng: 30.0619 };
    }
  };

  const initializeMap = async () => {
    try {
      if (!window.L) {
        console.error('Leaflet not loaded');
        setMapError(true);
        return;
      }

      const coordinates = await getCoordinatesFromLocation(property.location);
      
      // Create map instance
      const mapInstance = window.L.map(mapRef.current, {
        center: [coordinates.lat, coordinates.lng],
        zoom: 15,
        zoomControl: true,
        scrollWheelZoom: true
      });

      // Add OpenStreetMap tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(mapInstance);

      // Create custom red marker icon
      const redIcon = window.L.divIcon({
        html: `
          <div style="
            background-color: #e74c3c;
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            border: 3px solid #fff;
            transform: rotate(-45deg);
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: #fff;
              border-radius: 50%;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(45deg);
            "></div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [30, 30],
        iconAnchor: [15, 30]
      });

      // Add marker for the property
      const marker = window.L.marker([coordinates.lat, coordinates.lng], {
        icon: redIcon
      }).addTo(mapInstance);

      // Add popup to marker
      marker.bindPopup(`
        <div style="padding: 5px; max-width: 200px;">
          <h4 style="margin: 0 0 5px 0; font-size: 14px;">${property.houseName || 'Property'}</h4>
          <p style="margin: 0 0 5px 0; color: #666; font-size: 12px;">📍 ${property.location || 'Location not specified'}</p>
          ${property.price ? `<p style="margin: 0; font-weight: bold; color: #e74c3c; font-size: 13px;">${property.price}</p>` : ''}
        </div>
      `).openPopup();

      setMap(mapInstance);
      setMapError(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
    }
  };

  const handleViewMapClick = async () => {
    try {
      // Get coordinates for the property location
      const coordinates = await getCoordinatesFromLocation(property.location);
      
      // Create Google Maps URL with the coordinates
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}&zoom=15`;
      
      // Open Google Maps in a new tab
      window.open(googleMapsUrl, '_blank');
    } catch (error) {
      console.error('Error opening Google Maps:', error);
      
      // Fallback: open Google Maps with location search
      const searchQuery = encodeURIComponent(`${property.location}, Rwanda`);
      const fallbackUrl = `https://www.google.com/maps/search/${searchQuery}`;
      window.open(fallbackUrl, '_blank');
    }
  };

  const handleBackToListings = () => {
    navigate(-1); // Go back to previous page
  };

  // Fallback map component when Google Maps fails
  const FallbackMap = () => (
    <div style={{
      width: '100%',
      height: '300px',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px dashed #dee2e6',
      color: '#6c757d',
      textAlign: 'center',
      padding: '20px'
    }}>
      <FaLocationDot size={48} style={{ marginBottom: '16px', color: '#e74c3c' }} />
      <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#495057' }}>
        {property.houseName || 'Property'}
      </h4>
      <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
        📍 {property.location}
      </p>
      <p style={{ margin: '0', fontSize: '12px', fontStyle: 'italic' }}>
        Interactive map will load here
      </p>
    </div>
  );

  if (!property || !allProperties) {
    return (
      <>
        <Navbar />
        <div className="error-container">
          <div className="error-content">
            <h2>Oops! Property not found</h2>
            <p className="unavailable">Property no longer available!</p>
            <button className="back-btn" onClick={() => window.history.back()}>
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  const otherProperties = allProperties.filter(p => p.id !== property.id);
  const allImages = [property.mainImage, ...(property.otherImages || [])]; // Ensure otherImages is an array

  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const ContactForm = () => (
    <div className="contact-modal">
      <div className="contact-content">
        <div className="contact-header">
          <h3>Contact Property Owner</h3>
          <button
            className="close-btn"
            onClick={() => setShowContactForm(false)}
          >
            ×
          </button>
        </div>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <input type="tel" placeholder="Your Phone Number" required />
          <textarea placeholder="Message (optional)" rows="4"></textarea>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="detail-container">
        {/* Back to Listings Button */}
        <div className="back-to-listings-section">
          <button className="back-to-listings-btn" onClick={handleBackToListings}>
            <FaArrowLeft />
            <span>Back to Listings</span>
          </button>
        </div>

        {/* Property Name and Location */}
        <div className="property-heading-section">
          <div className="property-title-main">
            <h1>{property.houseName || 'House name'}</h1>
            <p className="property-location-main">
              <FaLocationDot /> {property.location}
            </p>
          </div>
          <div className="property-actions-top">
            <button className="save-btn" onClick={toggleSave}>
              {isSaved ? <FaHeart color="#e74c3c" /> : <FaRegHeart />}
              {isSaved ? 'Saved' : 'Save'}
            </button>
            <button className="map-btn" onClick={handleViewMapClick}>
              <FaMap /> View Map
            </button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="images-gallery-section">
          <div className="main-image-container">
            <img
              src={allImages[currentImageIndex]}
              alt="Property main view"
              className="main-image"
            />
          </div>
          {allImages.length > 1 && (
            <div className="image-thumbnails">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Property view ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => handleImageClick(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="detail-main-content">
          <div className="property-details-left">
            {/* Description with Price */}
            <div className="info-card">
              <h2>Description</h2>
              <p className="description">
                This property is available for <strong className="inline-price">{property.price}</strong>.
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="amenities-section info-card">
              <h3>Amenities</h3>
              <div className="amenities-grid">
                {property.wifi === "yes" && (
                  <div className="amenity-item">
                    <FaWifi />
                    <span>Free Wi-Fi</span>
                  </div>
                )}
                {property.furnished === "yes" && (
                  <div className="amenity-item">
                    <FaCouch />
                    <span>Furnished</span>
                  </div>
                )}
                {property.availableBeds > 0 && (
                  <div className="amenity-item">
                    <IoBed />
                    <span>{property.availableBeds} Bed{property.availableBeds > 1 ? 's' : ''}</span>
                  </div>
                )}
                {property.roommate > 0 && (
                  <div className="amenity-item">
                    <FaUserFriends />
                    <span>{property.roommate} Roommate{property.roommate > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="property-details info-card">
              <h3>Property Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">Location:</span>
                  <span className="value">{property.location}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Available Beds:</span>
                  <span className="value">{property.availableBeds}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Roommates:</span>
                  <span className="value">{property.roommate}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Furnished:</span>
                  <span className="value">{property.furnished === "yes" ? "Yes" : "No"}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Wi-Fi:</span>
                  <span className="value">{property.wifi === "yes" ? "Available" : "Not Available"}</span>
                </div>
              </div>
            </div>

            {/* Nearby Facilities */}
            <div className="nearby-facilities info-card">
              <h3>Facilities Nearby</h3>
              <div className="facilities-grid">
                {nearbyFacilities.map((facility, index) => (
                  <div key={index} className="facility-item">
                    {facility.icon}
                    <span>{facility.name} ({facility.distance})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sidebar-right">
            {/* Map View */}
            <div className="map-view-section info-card">
              <h3>Property Location</h3>
              <div className="map-container">
                {mapError || (!isMapLoaded && !window.google) ? (
                  <FallbackMap />
                ) : (
                  <div 
                    ref={mapRef} 
                    className="property-map"
                    style={{
                      width: '100%',
                      height: '300px',
                      borderRadius: '8px',
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #ddd'
                    }}
                  >
                    {!isMapLoaded && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#666',
                        flexDirection: 'column'
                      }}>
                        <div style={{ marginBottom: '8px' }}>🗺️</div>
                        Loading map...
                      </div>
                    )}
                  </div>
                )}
                <button 
                  className="view-larger-map-btn"
                  onClick={handleViewMapClick}
                  style={{
                    marginTop: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    width: '100%'
                  }}
                >
                  View Larger Map
                </button>
              </div>
            </div>

            {/* Contact Landlord */}
            <div className="contact-section info-card">
              <h3>Interested in this property?</h3>
              <div className="contact-buttons">
                <button
                  className="contact-btn primary"
                  onClick={() => setShowContactForm(true)}
                >
                  <FaEnvelope /> Contact Owner
                </button>
                <button className="contact-btn secondary">
                  <FaPhone /> Call Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {otherProperties.length > 0 && (
          <div className="other-properties">
            <div className="section-header">
              <h2>Other Properties You Might Like</h2>
              <p>Explore more housing options in your area</p>
            </div>
            <div className="properties-grid">
              {otherProperties.slice(0, 3).map(other => (
                <PropertyCard
                  key={other.id}
                  property={other}
                  isSaved={false}
                  toggleSave={() => {}}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {showContactForm && <ContactForm />}
    </>
  );
}

export default Detail;
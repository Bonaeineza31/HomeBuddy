import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaWifi, FaCouch, FaUserFriends, FaHeart, FaRegHeart, FaMap, FaPhone, FaEnvelope } from 'react-icons/fa';
import { IoBed } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import Navbar from '../../components/Navbar';
import PropertyCard from '../../components/PropertyCard';
import styles from '../../styles/Home.module.css';
import '../../styles/detail.css';

function Detail() {
  const location = useLocation();
  const property = location.state?.property;
  const allProperties = location.state?.allProperties;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

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
  const allImages = [property.mainImage, ...property.otherImages];

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
        <div className="detail-hero">
          <div className="hero-content">
            <div className="property-header">
              <div className="property-title">
                <h1>{property.houseName || 'House name'}</h1>
                <p className="property-location">
                  <FaLocationDot /> {property.location}
                </p>
              </div>
              <div className="property-actions">
                <button className="save-btn" onClick={toggleSave}>
                  {isSaved ? <FaHeart color="#e74c3c" /> : <FaRegHeart />}
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button className="map-btn">
                  <FaMap /> View Map
                </button>
              </div>
            </div>
            <div className="price-badge">
              <span className="price">{property.price}</span>
            </div>
          </div>
        </div>

        <div className="detail-content">
          <div className="images-section">
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

          <div className="property-info">
            <div className="info-card">
              <h2>Description</h2>
              <p className="description">{property.description}</p>
              
              <div className="amenities-section">
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

              <div className="property-details">
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

              <div className="contact-section">
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
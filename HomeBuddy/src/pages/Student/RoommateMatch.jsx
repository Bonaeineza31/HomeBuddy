import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { MapPin, Wifi, Car, Home, Users, DollarSign, Calendar, Phone, Mail, User, Search, Filter, Shirt, BookOpen, Trees, Building2, Shield, Droplets, Zap, Bus, Store, Building, MessageCircle, Heart, UserCheck } from 'lucide-react';
import '../../styles/roommatecard.css';

const RoommateForm = ({ property, onContact, onSave, onRemove, isSaved }) => {
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: '',
    email: '',
    phone: '',
    university: '',
    yearOfStudy: '',
    gender: '',
    age: '',
    
    // Housing Preferences
    propertyType: '',
    budgetRange: '',
    preferredDistance: '',
    moveInDate: '',
    leaseDuration: '',
    roomType: '',
    
    // Amenities & Features
    amenities: [],
    
    // Lifestyle Preferences
    smokingPreference: '',
    petsAllowed: '',
    studyEnvironment: '',
    socialLevel: '',
    
    // Additional Requirements
    additionalRequirements: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const mockResults = [
    {
      id: 1,
      title: "Cozy 2-Bedroom Apartment",
      location: "2.5km from ALU",
      price: "RWF 150,000/month",
      landlord: "Jean Baptiste",
      amenities: ["WiFi", "Parking", "Kitchen", "Study Room"],
      icon: <Home size={24} />,
      match: "95%",
      photos: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      currentResidents: 1,
      maxResidents: 2
    },
    {
      id: 2,
      title: "Student House Share",
      location: "1.8km from ALU",
      price: "RWF 120,000/month",
      landlord: "Marie Claire",
      amenities: ["WiFi", "Laundry", "Kitchen", "Garden"],
      icon: <Building size={24} />,
      match: "88%",
      photos: [
        "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      currentResidents: 2,
      maxResidents: 4
    },
    {
      id: 3,
      title: "Modern Studio Apartment",
      location: "3.2km from ALU",
      price: "RWF 180,000/month",
      landlord: "Patrick Uwimana",
      amenities: ["WiFi", "Parking", "Kitchen", "Balcony"],
      icon: <Building2 size={24} />,
      match: "82%",
      photos: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1571955884877-8846b1011ae4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      currentResidents: 0,
      maxResidents: 1
    }
  ];

  const PropertyCard = ({ property, onContact, onSave, onRemove, isSaved }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const nextPhoto = () => {
      setCurrentPhotoIndex((prev) => (prev + 1) % property.photos.length);
    };

    const prevPhoto = () => {
      setCurrentPhotoIndex((prev) => (prev - 1 + property.photos.length) % property.photos.length);
    };

    return (
      <div className="result-card">
        {/* Photo Gallery */}
        <div className="photo-gallery">
          <img
            src={property.photos[currentPhotoIndex]}
            alt={`${property.title} - Photo ${currentPhotoIndex + 1}`}
            className="photo-main"
          />
          
          {/* Photo Navigation */}
          {property.photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="photo-nav photo-nav-prev"
              >
                ←
              </button>
              <button
                onClick={nextPhoto}
                className="photo-nav photo-nav-next"
              >
                →
              </button>
            </>
          )}
          
          {/* Photo Indicators */}
          {property.photos.length > 1 && (
            <div className="photo-indicators">
              {property.photos.map((_, index) => (
                <div
                  key={index}
                  className={`photo-indicator ${index === currentPhotoIndex ? 'active' : ''}`}
                  onClick={() => setCurrentPhotoIndex(index)}
                />
              ))}
            </div>
          )}
          
          {/* Match Badge */}
          <div className="match-badge">
            {property.match} Match
          </div>
        </div>
        
        {/* Property Details */}
        <div className="result-content">
          <h3 className="property-title">
            {property.title}
          </h3>
          
          <div className="property-info">
            <div className="info-item">
              <MapPin size={16} />
              <span>{property.location}</span>
            </div>
            <div className="info-item">
              <DollarSign size={16} />
              <span>{property.price}</span>
            </div>
            <div className="info-item">
              <User size={16} />
              <span>{property.landlord}</span>
            </div>
            <div className="info-item">
              <UserCheck size={16} />
              <span>{property.currentResidents}/{property.maxResidents} residents</span>
            </div>
          </div>
          
          {/* Amenities */}
          <div className="amenities-section">
            <div className="amenities-list">
              {property.amenities.map(amenity => (
                <span key={amenity} className="amenity-tag">
                  {amenity}
                </span>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="result-actions">
            <button
              onClick={() => onContact && onContact(property)}
              className="btn-contact"
            >
              <MessageCircle size={16} />
              Contact
            </button>
            
            <button
              onClick={() => isSaved ? onRemove && onRemove(property.id) : onSave && onSave(property)}
              className={`btn-save ${isSaved ? 'saved' : ''}`}
            >
              <Heart size={16} />
              {isSaved ? 'Remove' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (showResults) {
    return (
      <div className="roommate-container">
        <div className="results-header">
          <h2><Search size={24} style={{ marginRight: '8px' }} />Found {mockResults.length} Perfect Matches!</h2>
          <p>Based on your preferences, here are the best housing options near your university:</p>
        </div>

        <div className="results-grid">
          {mockResults.map(result => (
            <PropertyCard 
              key={result.id} 
              property={result} 
              onContact={onContact}
              onSave={onSave}
              onRemove={onRemove}
              isSaved={false}
            />
          ))}
        </div>

        <button 
          className="btn-new-search"
          onClick={() => {
            setShowResults(false);
            setCurrentStep(1);
            setFormData({
              fullName: '', email: '', phone: '', university: '', yearOfStudy: '', gender: '', age: '',
              propertyType: '', budgetRange: '', preferredDistance: '', moveInDate: '', leaseDuration: '', roomType: '',
              amenities: [], smokingPreference: '', petsAllowed: '', studyEnvironment: '', socialLevel: '',
              additionalRequirements: ''
            });
          }}
        >
          Start New Search
        </button>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="roommate-container">
      <div className="form-header">
        <h1><Home size={30} style={{ marginRight: '8px' }} />Find Your Perfect Student Housing</h1>
        <p>Tell us about yourself and your ideal living situation. We'll match you with the best housing options near your university!</p>
        
        <div className="progress-bar">
          <div className="progress-steps">
            {[1, 2, 3, 4].map(step => (
              <div 
                key={step} 
                className={`progress-step ${currentStep >= step ? 'active' : ''}`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="progress-fill" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
        </div>
      </div>

      <div className="roommate-form">
        {currentStep === 1 && (
          <div className="form-step">
            <h2><User size={24} style={{ marginRight: '8px' }} />Tell Us About Yourself</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@student.alu.edu"
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+250 xxx xxx xxx"
                  required
                />
              </div>

              <div className="form-group">
                <label>University</label>
                <select
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your university</option>
                  <option value="alu">African Leadership University (ALU)</option>
                  <option value="ur">University of Rwanda</option>
                  <option value="khi">Kigali Health Institute</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Year of Study</label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                  <option value="graduate">Graduate Student</option>
                </select>
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Your age"
                  min="16"
                  max="35"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="form-step">
            <h2><Home size={24} style={{ marginRight: '8px' }} />Housing Preferences</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Property Type</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select property type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="studio">Studio</option>
                  <option value="shared">Shared Housing</option>
                </select>
              </div>

              <div className="form-group">
                <label>Budget Range (RWF per month)</label>
                <select
                  name="budgetRange"
                  value={formData.budgetRange}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select budget range</option>
                  <option value="50000-100000">50,000 - 100,000</option>
                  <option value="100000-150000">100,000 - 150,000</option>
                  <option value="150000-200000">150,000 - 200,000</option>
                  <option value="200000-300000">200,000 - 300,000</option>
                  <option value="300000+">300,000+</option>
                </select>
              </div>

              <div className="form-group">
                <label>Preferred Distance from University</label>
                <select
                  name="preferredDistance"
                  value={formData.preferredDistance}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select distance</option>
                  <option value="0-2km">0-2km (Walking distance)</option>
                  <option value="2-5km">2-5km (Short commute)</option>
                  <option value="5-10km">5-10km (Medium commute)</option>
                  <option value="10km+">10km+ (Long commute)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Move-in Date</label>
                <input
                  type="date"
                  name="moveInDate"
                  value={formData.moveInDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Lease Duration</label>
                <select
                  name="leaseDuration"
                  value={formData.leaseDuration}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select duration</option>
                  <option value="semester">One Semester</option>
                  <option value="academic-year">Academic Year</option>
                  <option value="1-year">1 Year</option>
                  <option value="2-years">2 Years</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div className="form-group">
                <label>Room Type</label>
                <select
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select room type</option>
                  <option value="private">Private Room</option>
                  <option value="shared">Shared Room</option>
                  <option value="studio">Studio</option>
                  <option value="1-bedroom">1 Bedroom</option>
                  <option value="2-bedroom">2 Bedroom</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="form-step">
            <h2><Filter size={24} style={{ marginRight: '8px' }} />Amenities & Features</h2>
            <p>Select all amenities that are important to you:</p>
            
            <div className="amenities-grid">
              {[
                { id: 'wifi', label: 'WiFi/Internet', icon: <Wifi size={20} /> },
                { id: 'parking', label: 'Parking', icon: <Car size={20} /> },
                { id: 'kitchen', label: 'Kitchen Access', icon: <Home size={20} /> },
                { id: 'laundry', label: 'Laundry', icon: <Shirt size={20} /> },
                { id: 'study-room', label: 'Study Room', icon: <BookOpen size={20} /> },
                { id: 'garden', label: 'Garden/Yard', icon: <Trees size={20} /> },
                { id: 'balcony', label: 'Balcony', icon: <Building2 size={20} /> },
                { id: 'security', label: 'Security', icon: <Shield size={20} /> },
                { id: 'water', label: '24/7 Water', icon: <Droplets size={20} /> },
                { id: 'electricity', label: 'Reliable Electricity', icon: <Zap size={20} /> },
                { id: 'transport', label: 'Public Transport', icon: <Bus size={20} /> },
                { id: 'shops', label: 'Nearby Shops', icon: <Store size={20} /> }
              ].map(amenity => (
                <div
                  key={amenity.id}
                  className={`amenity-card ${formData.amenities.includes(amenity.id) ? 'selected' : ''}`}
                  onClick={() => handleAmenityToggle(amenity.id)}
                >
                  <div className="amenity-icon">{amenity.icon}</div>
                  <span>{amenity.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="form-step">
            <h2><Users size={24} style={{ marginRight: '8px' }} />Lifestyle Preferences</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Smoking Preference</label>
                <select
                  name="smokingPreference"
                  value={formData.smokingPreference}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select preference</option>
                  <option value="non-smoking">Non-smoking environment</option>
                  <option value="smoking-allowed">Smoking allowed</option>
                  <option value="no-preference">No preference</option>
                </select>
              </div>

              <div className="form-group">
                <label>Pets Allowed</label>
                <select
                  name="petsAllowed"
                  value={formData.petsAllowed}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select preference</option>
                  <option value="yes">Yes, pets allowed</option>
                  <option value="no">No pets</option>
                  <option value="no-preference">No preference</option>
                </select>
              </div>

              <div className="form-group">
                <label>Study Environment</label>
                <select
                  name="studyEnvironment"
                  value={formData.studyEnvironment}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select preference</option>
                  <option value="quiet">Quiet environment</option>
                  <option value="moderate">Moderate noise okay</option>
                  <option value="social">Social/lively environment</option>
                </select>
              </div>

              <div className="form-group">
                <label>Social Level</label>
                <select
                  name="socialLevel"
                  value={formData.socialLevel}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select preference</option>
                  <option value="private">I prefer privacy</option>
                  <option value="friendly">Friendly but not too social</option>
                  <option value="social">Very social, love hanging out</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Additional Requirements</label>
              <textarea
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleInputChange}
                placeholder="Any additional requirements or preferences you'd like to mention..."
                rows="4"
              />
            </div>
          </div>
        )}

        <div className="form-navigation">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              Previous
            </button>
          )}
          
          {currentStep < 4 ? (
            <button type="button" onClick={nextStep} className="btn-primary">
              Next Step
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} className="btn-primary">
              <Search size={20} style={{ marginRight: '8px' }} />
              Find My Perfect Home
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default RoommateForm;
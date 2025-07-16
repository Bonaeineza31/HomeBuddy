import React, { useState } from 'react';
import {
  MapPin, Wifi, Car, Home, Users, DollarSign, Calendar, Phone,
  Mail, User, Search, Filter
} from 'lucide-react';

import Navbar from '../../components/Navbar';


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
    amenities: [],
    smokingPreference: '',
    petsAllowed: '',
    studyEnvironment: '',
    socialLevel: '',
    additionalRequirements: ''
  });

  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    console.log('Form submitted:', formData);
    alert('Form submitted! Results display coming soon...');
  };

  return (
    <>
    <Navbar/>
    <div className="roommate-container">
      {/*Form header with progress bar */}
      <div className="form-header">
        <h1>
          <Home size={30} style={{ marginRight: '8px' }} />
          Find Your Perfect Student Housing
        </h1>
        <p>
          Tell us about yourself and your ideal living situation. 
          We'll match you with the best housing options near your university!
        </p>

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
          <div
            className="progress-fill"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="roommate-form">
        {/* Step 1 - Personal Information */}
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

        {/*Housing Preferences */}
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

        {/*Amenities (placeholder) */}
        {currentStep === 3 && (
          <div className="form-step">
            <h2><Filter size={24} style={{ marginRight: '8px' }} />Amenities & Features</h2>
            <p>Amenities selection will be implemented in the next update...</p>
          </div>
        )}

        {/* Lifestyle Preferences (placeholder) */}
        {currentStep === 4 && (
          <div className="form-step">
            <h2><Users size={24} style={{ marginRight: '8px' }} />Lifestyle Preferences</h2>
            <p>Lifestyle preferences will be implemented in the next update...</p>
          </div>
        )}

        {/* Form navigation */}
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
              Submit Form
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default RoommateForm;

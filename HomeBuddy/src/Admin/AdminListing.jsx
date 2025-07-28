import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Wifi, Car, Shirt, ArrowLeft, Camera, X, Home } from 'lucide-react';
import '../Adstyles/Adminlisting.css';
import { IoPeople } from 'react-icons/io5';

const AdminListing = () => {
  const [listings, setListings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    houseName: '',
    description: '',
    totalPrice: '',
    location: '',
    availableBeds: '',
    currentRoommates: '',
    amenities: [],
    mainImage: '',
    otherImages: [],
    coordinates: [0, 0],
    owner: {
      name: '',
      email: '',
      phone: '',
      userId: ''
    },
    rules: [],
    contactPreference: 'both'
  });

  // Base URL for API
  const API_BASE_URL = 'https://homebuddy-yn9v.onrender.com/properties';

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      
      const data = await response.json();
      setListings(data.data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
      alert('Failed to load listings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('owner.')) {
      const ownerField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        owner: {
          ...prev.owner,
          [ownerField]: value
        }
      }));
    } else if (name === 'coordinates') {
      // Handle coordinates as comma-separated values
      const coords = value.split(',').map(coord => parseFloat(coord.trim()) || 0);
      setFormData(prev => ({ ...prev, coordinates: coords.slice(0, 2) }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };

  const handleAmenityChange = (amenityName, icon, checked) => {
    setFormData(prev => {
      const updatedAmenities = checked
        ? [...prev.amenities, { name: amenityName, icon, available: true }]
        : prev.amenities.filter(amenity => amenity.name !== amenityName);
      
      return { ...prev, amenities: updatedAmenities };
    });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    
    if (formData.mainImage === '') {
      setFormData(prev => ({ 
        ...prev, 
        mainImage: photoUrls[0] || '',
        otherImages: [...prev.otherImages, ...photoUrls.slice(1)] 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        otherImages: [...prev.otherImages, ...photoUrls] 
      }));
    }
  };

  const removePhoto = (index, isMain = false) => {
    if (isMain) {
      // Move first other image to main, or clear main if no others
      setFormData(prev => ({
        ...prev,
        mainImage: prev.otherImages[0] || '',
        otherImages: prev.otherImages.slice(1)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        otherImages: prev.otherImages.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.houseName || !formData.location || !formData.description || 
          !formData.totalPrice || !formData.availableBeds || !formData.mainImage ||
          !formData.owner.name || !formData.owner.email || !formData.owner.phone) {
        alert('Please fill in all required fields');
        return;
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        totalPrice: parseFloat(formData.totalPrice),
        availableBeds: parseInt(formData.availableBeds),
        currentRoommates: parseInt(formData.currentRoommates) || 0,
        coordinates: formData.coordinates.length === 2 ? formData.coordinates : [0, 0],
        owner: {
          ...formData.owner,
          userId: formData.owner.userId || '507f1f77bcf86cd799439011' // Placeholder user ID
        }
      };

      const url = editingListing 
        ? `${API_BASE_URL}/${editingListing._id}`
        : `${API_BASE_URL}/create`;
      
      const method = editingListing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // If auth is needed
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save listing');
      }

      const result = await response.json();
      
      if (editingListing) {
        setListings(prev => 
          prev.map(listing => 
            listing._id === editingListing._id ? result.data : listing
          )
        );
        alert('Listing updated successfully!');
      } else {
        setListings(prev => [...prev, result.data]);
        alert('Listing created successfully!');
      }

      resetForm();
    } catch (error) {
      console.error('Error saving listing:', error);
      alert(`Failed to save listing: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      houseName: '',
      description: '',
      totalPrice: '',
      location: '',
      availableBeds: '',
      currentRoommates: '',
      amenities: [],
      mainImage: '',
      otherImages: [],
      coordinates: [0, 0],
      owner: {
        name: '',
        email: '',
        phone: '',
        userId: ''
      },
      rules: [],
      contactPreference: 'both'
    });
    setShowForm(false);
    setEditingListing(null);
  };

  const handleEdit = (listing) => {
    setFormData({
      houseName: listing.houseName || '',
      description: listing.description || '',
      totalPrice: listing.totalPrice?.toString() || '',
      location: listing.location || '',
      availableBeds: listing.availableBeds?.toString() || '',
      currentRoommates: listing.currentRoommates?.toString() || '0',
      amenities: listing.amenities || [],
      mainImage: listing.mainImage || '',
      otherImages: listing.otherImages || [],
      coordinates: listing.coordinates || [0, 0],
      owner: listing.owner || { name: '', email: '', phone: '', userId: '' },
      rules: listing.rules || [],
      contactPreference: listing.contactPreference || 'both'
    });
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // If auth is needed
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete listing');
      }

      setListings(prev => prev.filter(listing => listing._id !== id));
      alert('Listing deleted successfully!');
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert(`Failed to delete listing: ${error.message}`);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // If auth is needed
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to toggle status');
      }

      const result = await response.json();
      setListings(prev => 
        prev.map(listing => 
          listing._id === id ? { ...listing, isActive: !currentStatus } : listing
        )
      );
      alert(`Listing ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error toggling status:', error);
      alert(`Failed to toggle status: ${error.message}`);
    }
  };

  // Check if amenity is selected
  const isAmenitySelected = (amenityName) => {
    return formData.amenities.some(amenity => amenity.name === amenityName);
  };

  if (loading) {
    return (
      <div className="admin-listing">
        <div className="header">
          <h1>Property Listings</h1>
          <p>Loading listings...</p>
        </div>
        <div className="loading-skeleton">
          {[1, 2, 3].map(i => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="admin-listing">
        <div className="form-container">
          <div className="form-header">
            <button onClick={resetForm} className="back-btn" disabled={submitting}>
              <ArrowLeft size={16} /> Back
            </button>
            <h2>{editingListing ? 'Edit Listing' : 'Add New Listing'}</h2>
          </div>

          <div onSubmit={handleSubmit} className="listing-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Property Title *</label>
                <input 
                  type="text" 
                  name="houseName" 
                  value={formData.houseName} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g., Modern Student Apartment" 
                />
              </div>
              <div className="form-group">
                <label>Total Price (RWF) *</label>
                <input 
                  type="number" 
                  name="totalPrice" 
                  value={formData.totalPrice} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g., 300000" 
                />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g., Kimisagara, Kigali" 
                />
              </div>
              <div className="form-group">
                <label>Available Beds *</label>
                <input 
                  type="number" 
                  name="availableBeds" 
                  value={formData.availableBeds} 
                  onChange={handleInputChange} 
                  required 
                  placeholder="e.g., 4" 
                />
              </div>
              <div className="form-group">
                <label>Current Roommates</label>
                <input 
                  type="number" 
                  name="currentRoommates" 
                  value={formData.currentRoommates} 
                  onChange={handleInputChange} 
                  placeholder="e.g., 2" 
                />
              </div>
              <div className="form-group">
                <label>Coordinates (lat, lng)</label>
                <input 
                  type="text" 
                  name="coordinates" 
                  value={formData.coordinates.join(', ')} 
                  onChange={handleInputChange} 
                  placeholder="e.g., -1.9441, 30.0619" 
                />
              </div>
            </div>

            {/* Owner Information */}
            <div className="owner-section">
              <h3>Owner Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Owner Name *</label>
                  <input 
                    type="text" 
                    name="owner.name" 
                    value={formData.owner.name} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="Full name" 
                  />
                </div>
                <div className="form-group">
                  <label>Owner Email *</label>
                  <input 
                    type="email" 
                    name="owner.email" 
                    value={formData.owner.email} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="email@example.com" 
                  />
                </div>
                <div className="form-group">
                  <label>Owner Phone *</label>
                  <input 
                    type="tel" 
                    name="owner.phone" 
                    value={formData.owner.phone} 
                    onChange={handleInputChange} 
                    required 
                    placeholder="+250788123456" 
                  />
                </div>
                <div className="form-group">
                  <label>Contact Preference</label>
                  <select 
                    name="contactPreference" 
                    value={formData.contactPreference} 
                    onChange={handleInputChange}
                  >
                    <option value="both">Phone & Email</option>
                    <option value="phone">Phone Only</option>
                    <option value="email">Email Only</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                required 
                rows="4" 
                placeholder="Describe the property, facilities, and any important details..." 
              />
            </div>

            <div className="amenities-section">
              <h3>Amenities</h3>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={isAmenitySelected('WiFi')}
                    onChange={(e) => handleAmenityChange('WiFi', 'wifi', e.target.checked)} 
                  /> 
                  <Wifi size={16} /> WiFi Available
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={isAmenitySelected('Parking')}
                    onChange={(e) => handleAmenityChange('Parking', 'car', e.target.checked)} 
                  /> 
                  <Car size={16} /> Parking Space
                </label>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={isAmenitySelected('Laundry')}
                    onChange={(e) => handleAmenityChange('Laundry', 'shirt', e.target.checked)} 
                  /> 
                  <Shirt size={16} /> Laundry Service
                </label>
              </div>
            </div>

            <div className="photos-section">
              <h3><Camera size={16} /> Photos</h3>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handlePhotoUpload} 
                className="photo-input" 
              />
              <div className="photo-preview">
                {formData.mainImage && (
                  <div className="photo-item main-photo">
                    <img src={formData.mainImage} alt="Main" />
                    <span className="main-label">Main</span>
                    <button 
                      type="button" 
                      onClick={() => removePhoto(0, true)} 
                      className="remove-photo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                {formData.otherImages.map((photo, index) => (
                  <div key={index} className="photo-item">
                    <img src={photo} alt={`Preview ${index + 1}`} />
                    <button 
                      type="button" 
                      onClick={() => removePhoto(index)} 
                      className="remove-photo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                onClick={resetForm} 
                className="cancel-btn" 
                disabled={submitting}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn" 
                disabled={submitting}
              >
                {submitting 
                  ? (editingListing ? 'Updating...' : 'Creating...') 
                  : (editingListing ? 'Update Listing' : 'Add Listing')
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-listing">
      <div className="header">
        <h1>Property Listings</h1>
        <button onClick={() => setShowForm(true)} className="add-btn">
          <Plus size={16} /> Add New Listing
        </button>
      </div>

      <div className="listings-grid">
        {listings.length === 0 ? (
          <div className="empty-state">
            <h3>No listings yet</h3>
            <p>Start by adding your first property listing</p>
          </div>
        ) : (
          listings.map((listing) => (
            <div key={listing._id} className="listing-card">
              <div className="listing-photos">
                {listing.mainImage ? (
                  <img src={listing.mainImage} alt={listing.houseName} />
                ) : (
                  <div className="no-photo"><Camera size={24} /> No Photos</div>
                )}
              </div>

              <div className="listing-info">
                <h3>{listing.houseName}</h3>
                <p className="price">
                  {parseInt(listing.totalPrice).toLocaleString()} RWF/month
                  {listing.pricePerPerson && (
                    <span className="price-per-person">
                      ({parseInt(listing.pricePerPerson).toLocaleString()} per person)
                    </span>
                  )}
                </p>
                <p className="property-description">
                  {listing.description || "No description provided"}
                </p>
                <p className="location">
                  <MapPin size={14} /> {listing.location}
                </p>
                <p className="rooms">
                  <Home size={14} /> 
                  {listing.availableBeds} beds ({listing.availableSpots || listing.availableBeds - (listing.currentRoommates || 0)} available)
                </p>
                <div className="amenities">
                  {listing.amenities?.map((amenity, index) => (
                    <span key={index} className="amenity">
                      {amenity.name === 'WiFi' && <Wifi size={12} />}
                      {amenity.name === 'Parking' && <Car size={12} />}
                      {amenity.name === 'Laundry' && <Shirt size={12} />}
                      {amenity.name}
                    </span>
                  ))}
                </div>
                <div className="listing-status">
                  <span className={`status ${listing.isActive ? 'active' : 'inactive'}`}>
                    {listing.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="listing-actions">
                  <button 
                    onClick={() => handleEdit(listing)} 
                    className="edit-btn"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => toggleStatus(listing._id, listing.isActive)} 
                    className={`status-btn ${listing.isActive ? 'deactivate' : 'activate'}`}
                  >
                    {listing.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    onClick={() => handleDelete(listing._id)} 
                    className="delete-btn"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminListing;
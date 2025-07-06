import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Wifi, Car, Shirt, ArrowLeft, Camera, X, HomeIcon } from 'lucide-react';
import '../Adstyles/Adminlistings.css';
import { IoPeople } from 'react-icons/io5';

const AdminListing = () => {
  const [listings, setListings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', location: '', roomNumbers: '', gender: '',
    hasWifi: false, hasParking: false, hasLaundry: false, photos: [], contact: '', availableRooms: ''
  });

  useEffect(() => {
    const savedListings = localStorage.getItem('homebuddy-listings');
    if (savedListings) setListings(JSON.parse(savedListings));
  }, []);

  useEffect(() => {
    localStorage.setItem('homebuddy-listings', JSON.stringify(listings));
  }, [listings]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const photoUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...photoUrls] }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingListing) {
      setListings(prev => prev.map(listing => listing.id === editingListing.id ? { ...formData, id: editingListing.id, createdAt: editingListing.createdAt } : listing));
    } else {
      const newListing = { ...formData, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] };
      setListings(prev => [...prev, newListing]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '', description: '', price: '', location: '', roomNumbers: '', gender: '',
      hasWifi: false, hasParking: false, hasLaundry: false, photos: [], contact: '', availableRooms: ''
    });
    setShowForm(false);
    setEditingListing(null);
  };

  const handleEdit = (listing) => {
    setFormData(listing);
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      setListings(prev => prev.filter(listing => listing.id !== id));
    }
  };

  if (showForm) {
    return (
      <div className="admin-listing">
        <div className="form-container">
          <div className="form-header">
            <button onClick={resetForm} className="back-btn"><ArrowLeft size={16} /> Back</button>
            <h2>{editingListing ? 'Edit Listing' : 'Add New Listing'}</h2>
          </div>

          <form onSubmit={handleSubmit} className="listing-form">
            <div className="form-grid">
              <div className="form-group">
                <label>Property Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g., Modern Student Apartment" />
              </div>
              <div className="form-group">
                <label>Monthly Price (RWF) *</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="e.g., 150000" />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required placeholder="e.g., Kimisagara, Kigali" />
              </div>
              <div className="form-group">
                <label>Available Rooms *</label>
                <input type="number" name="availableRooms" value={formData.availableRooms} onChange={handleInputChange} required placeholder="e.g., 5" />
              </div>
              <div className="form-group">
                <label>Room Numbers</label>
                <input type="text" name="roomNumbers" value={formData.roomNumbers} onChange={handleInputChange} placeholder="e.g., 101, 102, 103" />
              </div>
              <div className="form-group">
                <label>Preferred Gender</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option value="">Any</option>
                  <option value="male">Male Only</option>
                  <option value="female">Female Only</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              <div className="form-group">
                <label>Contact Information *</label>
                <input type="text" name="contact" value={formData.contact} onChange={handleInputChange} required placeholder="Phone number or email" />
              </div>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" placeholder="Describe the property, facilities, and any important details..." />
            </div>

            <div className="amenities-section">
              <h3>Amenities</h3>
              <div className="checkbox-group">
                <label className="checkbox-label"><input type="checkbox" name="hasWifi" checked={formData.hasWifi} onChange={handleInputChange} /> <Wifi size={16} /> WiFi Available</label>
                <label className="checkbox-label"><input type="checkbox" name="hasParking" checked={formData.hasParking} onChange={handleInputChange} /> <Car size={16} /> Parking Space</label>
                <label className="checkbox-label"><input type="checkbox" name="hasLaundry" checked={formData.hasLaundry} onChange={handleInputChange} /> <Shirt size={16} /> Laundry Service</label>
              </div>
            </div>

            <div className="photos-section">
              <h3><Camera size={16} /> Photos</h3>
              <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="photo-input" />
              <div className="photo-preview">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="photo-item">
                    <img src={photo} alt={`Preview ${index + 1}`} />
                    <button type="button" onClick={() => removePhoto(index)} className="remove-photo"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>
              <button type="submit" className="submit-btn">{editingListing ? 'Update Listing' : 'Add Listing'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-listing">
      <div className="header">
        <h1>Property Listings</h1>
        <button onClick={() => setShowForm(true)} className="add-btn"><Plus size={16} /> Add New Listing</button>
      </div>

      <div className="listings-grid">
        {listings.length === 0 ? (
          <div className="empty-state">
            <h3>No listings yet</h3>
            <p>Start by adding your first property listing</p>
          </div>
        ) : (
          listings.map((listing) => (
            <div key={listing.id} className="listing-card">
              <div className="listing-photos">
                {listing.photos.length > 0 ? (
                  <img src={listing.photos[0]} alt={listing.title} />
                ) : (
                  <div className="no-photo"><Camera size={24} /> No Photos</div>
                )}
              </div>

              <div className="listing-info">
                <h3>{listing.title}</h3>
                <p className="price">{parseInt(listing.price).toLocaleString()} RWF/month</p>
                <p className="property-description">{listing.description || "No description provided"}</p>
                <p className="location"><MapPin size={14} /> {listing.location}</p>
                <p className="rooms"><HomeIcon size={14} /> {listing.availableRooms} rooms available</p>
                <div className="amenities">
                  {listing.hasWifi && <span className="amenity"><Wifi size={12} /> WiFi</span>}
                  {listing.hasParking && <span className="amenity"><Car size={12} /> Parking</span>}
                  {listing.hasLaundry && <span className="amenity"><Shirt size={12} /> Laundry</span>}
                </div>
                {listing.gender && <p className="gender"><IoPeople size={14} /> {listing.gender}</p>}
                <div className="listing-actions">
                  <button onClick={() => handleEdit(listing)} className="edit-btn"><Edit2 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(listing.id)} className="delete-btn"><Trash2 size={14} /> Delete</button>
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

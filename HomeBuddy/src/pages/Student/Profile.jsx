// src/pages/Profile/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import '../../styles/Profile.css';

const API_BASE_URL = "http://localhost:3000";

const allHobbies = [
  "Reading", "Traveling", "Cooking", "Gaming", "Sports", "Music", "Art", "Movies"
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem('token') || localStorage.getItem('authToken') || sessionStorage.getItem('token');
  };

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  // Fetch user profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      
      const token = getAuthToken();
      
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please login again.");
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile data received:', data);
      
      // Initialize profile with default values if fields are missing
      const profileData = {
        name: data.profile?.name || "",
        nationality: data.profile?.nationality || "",
        gender: data.profile?.gender || "Prefer not to say",
        bio: data.profile?.bio || "",
        budget: data.profile?.budget || "",
        preference: data.profile?.preference || "",
        hobbies: data.profile?.hobbies || [],
        photo: data.profile?.photo || ""
      };
      
      setProfile(profileData);
      setPhotoPreview(profileData.photo ? `${API_BASE_URL}${profileData.photo}` : "");
      
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "photo" && files.length) {
      const file = files[0];
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Photo size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }

      setSelectedPhoto(file);
      setError(""); // Clear any previous errors
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const toggleHobby = (hobby) => {
    if (!profile) return;
    
    const updatedHobbies = profile.hobbies.includes(hobby)
      ? profile.hobbies.filter((h) => h !== hobby)
      : [...profile.hobbies, hobby];
    setProfile({ ...profile, hobbies: updatedHobbies });
  };

  const uploadPhoto = async () => {
    if (!selectedPhoto) return null;

    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append('photo', selectedPhoto);

      const response = await fetch(`${API_BASE_URL}/api/profile/photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Photo upload failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Photo uploaded:', data);
      return data.photo;
    } catch (err) {
      console.error("Error uploading photo:", err);
      throw err;
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!profile.name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");
      
      const token = getAuthToken();

      // Upload photo first if a new one was selected
      let photoPath = profile.photo;
      if (selectedPhoto) {
        console.log('Uploading new photo...');
        photoPath = await uploadPhoto();
        console.log('Photo uploaded, path:', photoPath);
      }

      // Prepare profile data for update
      const profileData = {
        name: profile.name.trim(),
        nationality: profile.nationality.trim(),
        gender: profile.gender,
        bio: profile.bio.trim(),
        budget: profile.budget.trim(),
        preference: profile.preference.trim(),
        hobbies: profile.hobbies,
        photo: photoPath
      };

      console.log('Updating profile with data:', profileData);

      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired. Please login again.");
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || `Update failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Profile updated successfully:', data);
      
      // Update local state with saved data
      setProfile(data.profile);
      setPhotoPreview(data.profile.photo ? `${API_BASE_URL}${data.profile.photo}` : "");
      setSelectedPhoto(null);
      setIsEditing(false);
      
      // Show success message briefly
      setError("");
      
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedPhoto(null);
    setError("");
    // Reset to original data
    fetchProfile();
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="profile-card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ 
              display: 'inline-block', 
              width: '40px', 
              height: '40px', 
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 2s linear infinite',
              marginBottom: '20px'
            }}></div>
            <p>Loading your profile...</p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      </>
    );
  }

  // Error state (when no profile loaded)
  if (error && !profile) {
    return (
      <>
        <Navbar />
        <div className="profile-card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ color: 'red', marginBottom: '20px', fontSize: '18px' }}>⚠️</div>
            <p className="error-message" style={{ color: 'red', marginBottom: '20px' }}>
              {error}
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                onClick={fetchProfile}
                style={{
                  padding: '10px 20px',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
              <button 
                onClick={handleLogout}
                style={{
                  padding: '10px 20px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // No profile state
  if (!profile) {
    return (
      <>
        <Navbar />
        <div className="profile-card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ marginBottom: '20px' }}>No profile data available.</p>
            <button 
              onClick={fetchProfile} 
              style={{ 
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Load Profile
            </button>
          </div>
        </div>
      </>
    );
  }

  // Main profile component
  return (
    <>
      <Navbar />
      <div className="profile-card">
        {/* Header with Logout Button */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px' 
        }}>
          <h1 style={{ margin: 0, color: '#333' }}>My Profile</h1>
          <button 
            onClick={handleLogout}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Logout
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            color: '#721c24',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            padding: '12px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}
        
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-photo-wrapper">
            {photoPreview ? (
              <img 
                src={photoPreview} 
                alt="Profile" 
                className="profile-photo"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #ddd'
                }}
              />
            ) : (
              <div 
                className="profile-photo-placeholder"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  backgroundColor: '#f8f9fa',
                  border: '2px dashed #ddd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6c757d',
                  fontSize: '14px'
                }}
              >
                No Photo
              </div>
            )}
          </div>
          <div className="profile-header-info" style={{ marginLeft: '20px' }}>
            <h2 className="profile-name" style={{ margin: '0 0 10px 0', color: '#333' }}>
              {profile.name || "No name set"}
            </h2>
            {!isEditing && (
              <button 
                className="student-edit-btn" 
                onClick={() => setIsEditing(true)}
                style={{
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Form (Edit Mode) */}
        {isEditing ? (
          <form className="profile-form" onSubmit={handleSave} style={{ marginTop: '30px' }}>
            <div style={{ display: 'grid', gap: '20px' }}>
              
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontWeight: '500', color: '#333' }}>Profile Photo:</span>
                <input 
                  type="file" 
                  name="photo" 
                  accept="image/*" 
                  onChange={handleChange}
                  style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
                <small style={{ color: '#6c757d' }}>Max size: 5MB. Supported: JPG, PNG, GIF</small>
              </label>
              
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontWeight: '500', color: '#333' }}>Name: *</span>
                <input 
                  type="text" 
                  name="name" 
                  value={profile.name} 
                  onChange={handleChange} 
                  required
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  placeholder="Enter your full name"
                />
              </label>
              
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontWeight: '500', color: '#333' }}>Nationality:</span>
                <input 
                  type="text" 
                  name="nationality" 
                  value={profile.nationality} 
                  onChange={handleChange}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  placeholder="e.g., American, British, etc."
                />
              </label>
              
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontWeight: '500', color: '#333' }}>Gender:</span>
                <select 
                  name="gender" 
                  value={profile.gender} 
                  onChange={handleChange}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </label>
              
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontWeight: '500', color: '#333' }}>Bio:</span>
                <textarea 
                  name="bio" 
                  value={profile.bio} 
                  onChange={handleChange} 
                  rows="4"
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px', resize: 'vertical' }}
                  placeholder="Tell others about yourself, your interests, lifestyle..."
                />
              </label>
              
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontWeight: '500', color: '#333' }}>Budget:</span>
                <input 
                  type="text" 
                  name="budget" 
                  value={profile.budget} 
                  onChange={handleChange}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  placeholder="e.g., $500-800/month"
                />
              </label>
              
              <label style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontWeight: '500', color: '#333' }}>Roommate Preference:</span>
                <input 
                  type="text" 
                  name="preference" 
                  value={profile.preference} 
                  onChange={handleChange}
                  style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                  placeholder="e.g., quiet, social, clean, non-smoker..."
                />
              </label>

              <div className="hobbies-section">
                <span style={{ fontWeight: '500', color: '#333', marginBottom: '10px', display: 'block' }}>
                  Hobbies:
                </span>
                <div className="hobbies-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {allHobbies.map((hobby) => (
                    <button
                      key={hobby}
                      type="button"
                      className={`hobby-btn ${profile.hobbies.includes(hobby) ? "selected" : ""}`}
                      onClick={() => toggleHobby(hobby)}
                      style={{
                        padding: '6px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '20px',
                        background: profile.hobbies.includes(hobby) ? '#007bff' : 'white',
                        color: profile.hobbies.includes(hobby) ? 'white' : '#333',
                        cursor: 'pointer',
                        fontSize: '13px',
                        transition: 'all 0.2s'
                      }}
                    >
                      {hobby}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions" style={{ 
              display: 'flex', 
              gap: '10px', 
              marginTop: '30px',
              paddingTop: '20px',
              borderTop: '1px solid #eee'
            }}>
              <button 
                type="submit" 
                className="save-btn"
                disabled={saving}
                style={{
                  padding: '12px 24px',
                  background: saving ? '#6c757d' : '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={handleCancel}
                disabled={saving}
                style={{
                  padding: '12px 24px',
                  background: 'white',
                  color: '#6c757d',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          /* Profile View Mode */
          <div className="profile-details" style={{ marginTop: '30px' }}>
            <div style={{ 
              background: '#f8f9fa', 
              padding: '20px', 
              borderRadius: '8px', 
              marginBottom: '20px' 
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>About</h3>
              <p className="about-text" style={{ margin: 0, lineHeight: '1.6', color: '#666' }}>
                {profile.bio || "No bio available"}
              </p>
            </div>
            
            <div className="info-grid" style={{ display: 'grid', gap: '15px' }}>
              <div className="info-item" style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span className="label" style={{ fontWeight: '500', color: '#333' }}>Nationality:</span>
                <span style={{ color: '#666' }}>{profile.nationality || "Not specified"}</span>
              </div>
              
              <div className="info-item" style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span className="label" style={{ fontWeight: '500', color: '#333' }}>Gender:</span>
                <span style={{ color: '#666' }}>{profile.gender}</span>
              </div>
              
              <div className="info-item" style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span className="label" style={{ fontWeight: '500', color: '#333' }}>Budget:</span>
                <span style={{ color: '#666' }}>{profile.budget || "Not specified"}</span>
              </div>
              
              <div className="info-item" style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '12px 0',
                borderBottom: '1px solid #eee'
              }}>
                <span className="label" style={{ fontWeight: '500', color: '#333' }}>Roommate Preference:</span>
                <span style={{ color: '#666' }}>{profile.preference || "Not specified"}</span>
              </div>
              
              <div className="info-item" style={{ padding: '12px 0' }}>
                <span className="label" style={{ 
                  fontWeight: '500', 
                  color: '#333',
                  display: 'block',
                  marginBottom: '8px'
                }}>
                  Hobbies:
                </span>
                <div className="hobbies-view" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {profile.hobbies && profile.hobbies.length > 0
                    ? profile.hobbies.map(hobby => (
                        <span 
                          key={hobby} 
                          className="hobby-pill"
                          style={{
                            background: '#e9ecef',
                            color: '#495057',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}
                        >
                          {hobby}
                        </span>
                      ))
                    : <span style={{ color: '#6c757d', fontStyle: 'italic' }}>No hobbies selected</span>
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
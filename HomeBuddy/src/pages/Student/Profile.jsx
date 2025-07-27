import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import '../../styles/Profile.css';

const allHobbies = ["Reading", "Traveling", "Cooking", "Gaming", "Sports", "Music", "Art", "Movies"];

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    nationality: '',
    gender: 'Prefer not to say',
    bio: '',
    budget: '',
    preference: '',
    hobbies: [],
    photo: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  // Auto-clear success message
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadProfile = () => {
    const savedProfile = localStorage.getItem('profileData');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setPhotoPreview(parsedProfile.photo || "");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "photo" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPhotoPreview(base64String);
        setProfile(prev => ({ ...prev, photo: base64String }));
      };
      reader.readAsDataURL(file);
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleHobby = (hobby) => {
    const updatedHobbies = profile.hobbies.includes(hobby)
      ? profile.hobbies.filter(h => h !== hobby)
      : [...profile.hobbies, hobby];
    setProfile(prev => ({ ...prev, hobbies: updatedHobbies }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('profileData', JSON.stringify(profile));
    
    setIsEditing(false);
    setSuccess("Profile saved successfully!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadProfile(); // Reload from localStorage
  };

  return (
    <>
      <Navbar />
      <div className="profile-card">
        
        {success && (
          <div style={{ color: 'green', marginBottom: '10px' }}>
            {success}
          </div>
        )}

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-photo-wrapper">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="profile-photo" />
            ) : (
              <div className="profile-photo-placeholder">No Photo</div>
            )}
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{profile.name || "No name set"}</h2>
            {!isEditing && (
              <button className="student-edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {isEditing ? (
          <form className="profile-form" onSubmit={handleSave}>
            <label>
              Profile Photo: 
              <input 
                type="file" 
                name="photo" 
                accept="image/*" 
                onChange={handleChange} 
              />
            </label>
            
            <label>
              Name: 
              <input 
                type="text" 
                name="name" 
                value={profile.name} 
                onChange={handleChange} 
              />
            </label>
            
            <label>
              Nationality: 
              <input 
                type="text" 
                name="nationality" 
                value={profile.nationality} 
                onChange={handleChange} 
              />
            </label>
            
            <label>
              Gender:
              <select name="gender" value={profile.gender} onChange={handleChange}>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </label>
            
            <label>
              Bio: 
              <textarea 
                name="bio" 
                value={profile.bio} 
                onChange={handleChange} 
                rows="3" 
              />
            </label>
            
            <label>
              Budget: 
              <input 
                type="text" 
                name="budget" 
                value={profile.budget} 
                onChange={handleChange} 
              />
            </label>
            
            <label>
              Roommate Preference: 
              <input 
                type="text" 
                name="preference" 
                value={profile.preference} 
                onChange={handleChange} 
              />
            </label>

            <div className="hobbies-section">
              <span>Hobbies:</span>
              <div className="hobbies-list">
                {allHobbies.map((hobby) => (
                  <button 
                    key={hobby} 
                    type="button"
                    className={`hobby-btn ${profile.hobbies.includes(hobby) ? "selected" : ""}`}
                    onClick={() => toggleHobby(hobby)}
                  >
                    {hobby}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="save-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <p className="about-text">{profile.bio || "No bio provided"}</p>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Nationality</span>
                <span>{profile.nationality || "Not specified"}</span>
              </div>
              <div className="info-item">
                <span className="label">Gender</span>
                <span>{profile.gender || "Not specified"}</span>
              </div>
              <div className="info-item">
                <span className="label">Budget</span>
                <span>{profile.budget || "Not specified"}</span>
              </div>
              <div className="info-item">
                <span className="label">Roommate Preference</span>
                <span>{profile.preference || "Not specified"}</span>
              </div>
              <div className="info-item">
                <span className="label">Hobbies</span>
                <div className="hobbies-view">
                  {profile.hobbies.length > 0
                    ? profile.hobbies.map(hobby => (
                        <span key={hobby} className="hobby-pill">{hobby}</span>
                      ))
                    : <span>No hobbies selected</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
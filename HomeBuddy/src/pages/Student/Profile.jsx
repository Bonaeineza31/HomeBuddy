import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import '../../styles/Profile.css';

const allHobbies = [
  "Reading",
  "Traveling",
  "Cooking",
  "Gaming",
  "Sports",
  "Music",
  "Art",
  "Movies"
];

export default function Profile() {
  const [profile, setProfile] = useState({
    photo: "",
    name: "Umuhire Marie",
    nationality: "Rwandan",
    bio: "Full-stack developer passionate about building impactful solutions.",
    gender: "Female",
    budget: "$1,500",
    preference: "Quiet roommate",
    hobbies: ["Reading", "Music"]
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo") {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, photo: reader.result });
      };
      if (files[0]) {
        reader.readAsDataURL(files[0]);
      }
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const toggleHobby = (hobby) => {
    if (profile.hobbies.includes(hobby)) {
      setProfile({
        ...profile,
        hobbies: profile.hobbies.filter((h) => h !== hobby)
      });
    } else {
      setProfile({
        ...profile,
        hobbies: [...profile.hobbies, hobby]
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // You can integrate backend save here
  };

  return (
    <>
      <Navbar />
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-photo-wrapper">
            {profile.photo ? (
              <img src={profile.photo} alt="Profile" className="profile-photo" />
            ) : (
              <div className="profile-photo-placeholder">No Photo</div>
            )}
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{profile.name}</h2>
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
              <input type="file" name="photo" accept="image/*" onChange={handleChange} />
            </label>

            <label>
              Name:
              <input type="text" name="name" value={profile.name} onChange={handleChange} />
            </label>

            <label>
              Nationality:
              <input type="text" name="nationality" value={profile.nationality} onChange={handleChange} />
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
              <textarea name="bio" value={profile.bio} onChange={handleChange} rows="3" />
            </label>

            <label>
              Budget:
              <input type="text" name="budget" value={profile.budget} onChange={handleChange} />
            </label>

            <label>
              Roommate Preference:
              <input type="text" name="preference" value={profile.preference} onChange={handleChange} />
            </label>

            <div className="hobbies-section">
              <span>Hobbies:</span>
              <div className="hobbies-list">
                {allHobbies.map((hobby) => (
                  <button
                    type="button"
                    key={hobby}
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
              <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <p className="about-text">{profile.bio}</p>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Nationality</span>
                <span>{profile.nationality}</span>
              </div>
              <div className="info-item">
                <span className="label">Gender</span>
                <span>{profile.gender}</span>
              </div>
              <div className="info-item">
                <span className="label">Budget</span>
                <span>{profile.budget}</span>
              </div>
              <div className="info-item">
                <span className="label">Roommate Preference</span>
                <span>{profile.preference}</span>
              </div>
              <div className="info-item">
                <span className="label">Hobbies</span>
                <div className="hobbies-view">
                  {profile.hobbies.length > 0 ? (
                    profile.hobbies.map(hobby => (
                      <span key={hobby} className="hobby-pill">{hobby}</span>
                    ))
                  ) : (
                    <span>No hobbies selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
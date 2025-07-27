import React, { useState } from 'react';
import Detail from '../Student/detail'; // The student view component

const UploadProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    description: '',
    wifi: false,
    furnished: false,
    parking: false,
    laundry: false,
    privateBathroom: false,
    studyDesk: false,
    availableBeds: 1,
    roommate: 0,
    images: []
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newFiles]
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Property uploaded!');
    setFormData({
      title: '',
      location: '',
      price: '',
      description: '',
      wifi: false,
      furnished: false,
      parking: false,
      laundry: false,
      privateBathroom: false,
      studyDesk: false,
      availableBeds: 1,
      roommate: 0,
      images: []
    });
    setShowPreview(false);
  };

  const imageURLs = formData.images.length
    ? formData.images.map((img) => URL.createObjectURL(img))
    : [];

  const previewProperty = {
    id: 1,
    houseName: formData.title,
    location: formData.location,
    price: formData.price,
    description: formData.description,
    wifi: formData.wifi ? 'yes' : 'no',
    furnished: formData.furnished ? 'yes' : 'no',
    parking: formData.parking ? 'yes' : 'no',
    laundry: formData.laundry ? 'yes' : 'no',
    privateBathroom: formData.privateBathroom ? 'yes' : 'no',
    studyDesk: formData.studyDesk ? 'yes' : 'no',
    availableBeds: parseInt(formData.availableBeds),
    roommate: parseInt(formData.roommate),
    mainImage: imageURLs[0],
    otherImages: imageURLs.slice(1)
  };

  return (
    <div className="upload-container">
      <h2>Upload New Property</h2>

      <form onSubmit={handleSubmit} className="upload-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Add a short description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        {/* Amenities */}
        <div className="amenities-checkboxes">
          <label><input type="checkbox" name="wifi" checked={formData.wifi} onChange={handleChange} /> Wi-Fi</label>
          <label><input type="checkbox" name="furnished" checked={formData.furnished} onChange={handleChange} /> Furnished</label>
          <label><input type="checkbox" name="parking" checked={formData.parking} onChange={handleChange} /> Parking</label>
          <label><input type="checkbox" name="laundry" checked={formData.laundry} onChange={handleChange} /> Laundry</label>
          <label><input type="checkbox" name="privateBathroom" checked={formData.privateBathroom} onChange={handleChange} /> Private Bathroom</label>
          <label><input type="checkbox" name="studyDesk" checked={formData.studyDesk} onChange={handleChange} /> Study Desk</label>
        </div>

        <label>
          Beds Available:
          <input type="number" name="availableBeds" value={formData.availableBeds} onChange={handleChange} min={0} />
        </label>

        <label>
          Max Roommates:
          <input type="number" name="roommate" value={formData.roommate} onChange={handleChange} min={0} />
        </label>

        <label>
          Upload Images:
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        </label>

        {formData.images.length > 0 && (
          <div className="image-file-list">
            <h4>Selected Images:</h4>
            <ul>
              {formData.images.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => handleRemoveImage(index)}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="form-buttons">
          <button type="submit">Upload</button>
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            disabled={!formData.title || !formData.location || !formData.price}
          >
            Preview
          </button>
        </div>
      </form>

      {/* Modal Preview */}
      {showPreview && (
        <div className="preview-modal">
          <div className="preview-overlay" onClick={() => setShowPreview(false)}></div>
          <div className="preview-content">
            <button className="close-preview" onClick={() => setShowPreview(false)}>
              &times;
            </button>
            <Detail property={previewProperty} allProperties={[previewProperty]} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadProperty;
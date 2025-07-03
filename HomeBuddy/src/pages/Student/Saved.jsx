import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { HiHomeModern } from "react-icons/hi2";
import { FaLocationDot } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import p1 from '../../assets/property1.jfif';
import p2 from '../../assets/property2.jfif';
import p3 from '../../assets/property3.jfif';
import p4 from '../../assets/property4.jfif';
import p5 from '../../assets/property5.jfif';
import p6 from '../../assets/property6.jfif';
import '../../styles/Saved.css';

const initialProperties = [
  { id: 1, img: p1, location: 'Kimironko', price: '$600/month' },
  { id: 2, img: p2, location: 'Remera', price: '$1000/month' },
  { id: 3, img: p3, location: 'Gikondo', price: '$800/month' },
  { id: 4, img: p4, location: 'Nyabugogo', price: '$500/month' },
  { id: 5, img: p5, location: 'Kiyovu', price: '$900/month' },
  { id: 6, img: p6, location: 'Kacyiru', price: '$650/month' }
];

const StudentSaved = () => {
  const [likedProperties, setLikedProperties] = useState(initialProperties);
  const [menuOpen, setMenuOpen] = useState(false);

  const removeProperty = (id) => {
    setLikedProperties((prev) =>
      prev.filter((property) => property.id !== id)
    );
  };

  return (
    <>
      <nav className="navigation">
        <div className="nav-top">
          <div className="logopart">
            <HiHomeModern className="logo" />
            <p>Homebuddy</p>
          </div>
          <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <IoClose size={28} /> : <IoIosMenu size={28} />}
          </button>
        </div>
        <ul className={menuOpen ? "nav-links open" : "nav-links"}>
          <li><Link to="/student" className="nav-link">Home</Link></li>
          <li><Link to="/saved" className="nav-link">Saved</Link></li>
          <li><Link to="/listing" className="nav-link">Listings</Link></li>
          <li><Link to="/contact" className="nav-link">Contact Us</Link></li>
        </ul>
      </nav>

      <div className="all-listings">
        <div className="properties">
          {likedProperties.length === 0 ? (
            <p className="empty-message">You have no saved properties.</p>
          ) : (
            likedProperties.map((property) => (
              <div className="property" key={property.id}>
                <img
                  src={property.img}
                  alt={`Property in ${property.location}`}
                  className="list-image"
                />
                <div className="details">
                  <div className="save">
                    <div className="save-text">
                      <h4>House name</h4>
                      <p className="location">
                        <FaLocationDot /> {property.location}
                      </p>
                    </div>
                    <FaHeart
                      size={30}
                      color="#da2461"
                      onClick={() => removeProperty(property.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <p className="description">
                    Cozy two-bedroom apartment with a modern kitchen, spacious living area, and large windows that fill the rooms with natural light. Perfect for students or small families looking for a comfortable and affordable home near local amenities.
                  </p>
                  <div className="lower">
                    <p className="price">{property.price}</p>
                    <button className="check">View</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default StudentSaved;
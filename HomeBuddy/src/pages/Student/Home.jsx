import React, { useState } from "react";
import Select from "react-select";
import { Link } from 'react-router-dom';
import { HiHomeModern } from "react-icons/hi2";
import { FaLocationDot, FaRegHeart, FaHeart } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import p1 from '../../assets/property1.jfif';
import p2 from '../../assets/property2.jfif';
import p3 from '../../assets/property3.jfif';
import p4 from '../../assets/property4.jfif';
import p5 from '../../assets/property5.jfif';
import p6 from '../../assets/property6.jfif';
import '../../styles/Home.css';

const properties = [
  { id: 1, img: p1, location: 'Kimironko', price: '$600/month' },
  { id: 2, img: p2, location: 'Remera', price: '$1000/month' },
  { id: 3, img: p3, location: 'Gikondo', price: '$800/month' },
  { id: 4, img: p4, location: 'Nyabugogo', price: '$500/month' },
  { id: 5, img: p5, location: 'Kiyovu', price: '$900/month' },
  { id: 6, img: p6, location: 'Kacyiru', price: '$650/month' }
];

const universityOptions = [
  { value: 'alu', label: 'African Leadership University' },
  { value: 'ur', label: 'University of Rwanda' },
  { value: 'auca', label: 'AUCA' },
];

const roommateOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const selectStylesRightBorder = {
  control: (provided) => ({
    ...provided,
    borderRight: '1px solid black',
    borderTop: 'none',
    borderLeft: 'none',
    borderBottom: 'none',
    borderRadius: '0px',
    textAlign: 'center',
    boxShadow: 'none',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '8px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
};

const selectStylesNormal = {
  control: (provided) => ({
    ...provided,
    border: 'none',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: 'none',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '8px',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
};

const StudentHome = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [savedProperties, setSavedProperties] = useState([]);

  const toggleSave = (property) => {
    setSavedProperties((prevSaved) => {
      const isSaved = prevSaved.find((p) => p.id === property.id);
      if (isSaved) {
        return prevSaved.filter((p) => p.id !== property.id);
      } else {
        return [...prevSaved, property];
      }
    });
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

      <div className="main">
        <h1>Welcome to HomeBuddy!</h1>
        <form className="filter">
          <div className="uni select-field">
            <Select
              options={universityOptions}
              placeholder="Select university"
              styles={selectStylesRightBorder}
            />
          </div>

          <div className="range">
            <input type="number" min={100} max={2000} step={50} placeholder="Price range?" />
          </div>

          <div className="bedrooms">
            <input type="number" min={1} max={10} placeholder="Number of bedrooms?" />
          </div>

          <div className="roommate select-field">
            <Select
              options={roommateOptions}
              placeholder="Want a roommate?"
              styles={selectStylesNormal} 
            />
          </div>

          <button type="submit" className="btn">Search</button>
        </form>
      </div>

      <div className="mostviewed">
        <h1>Featured Properties</h1>
        <div className="all">
          {properties.map((property) => {
            const isSaved = savedProperties.some((p) => p.id === property.id);
            return (
              <div className="listing" key={property.id}>
                <img src={property.img} alt={`Property in ${property.location}`} />
                <div className="listing-details">
                  <div className="top-row">
                    <div className="text-group">
                      <h4>House name</h4>
                      <p className="location"><FaLocationDot /> {property.location}</p>
                    </div>
                    {isSaved ? (
                      <FaHeart
                        size={20}
                        color="#da2461"
                        onClick={() => toggleSave(property)}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <FaRegHeart
                        size={20}
                        color="black"
                        onClick={() => toggleSave(property)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </div>
                  <p className="description">
                    Cozy two-bedroom apartment with a modern kitchen, spacious living area,
                    and large windows that fill the rooms with natural light. Perfect for students
                    or small families looking for a comfortable and affordable home near local amenities.
                  </p>
                  <div className="bottom-row">
                    <p className="price">{property.price}</p>
                    <button className="check">View</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Link to="/listings" className="see-more">See more</Link>
      </div>
    </>
  );
};

export default StudentHome;
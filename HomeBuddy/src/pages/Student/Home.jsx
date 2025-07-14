import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { Link } from 'react-router-dom';
import { HiHomeModern } from "react-icons/hi2";
import { FaLocationDot, FaRegHeart, FaHeart, FaUser } from "react-icons/fa6";
import p1 from '../../assets/property1.jfif';
import p2 from '../../assets/property2.jfif';
import p3 from '../../assets/property3.jfif';
import p4 from '../../assets/property4.jfif'; // Corrected path
import p5 from '../../assets/property5.jfif';
import p6 from '../../assets/property6.jfif';
import styles from '../../styles/Home.module.css';
import Navbar from "../../components/Navbar";

// Dummy hero image for the background - path will be used in CSS
import propertyHero from '../../../src/assets/bg.jfif';

const properties = [
  { id: 1, img: p1, location: 'Kimironko', price: '$600/month' },
  { id: 2, img: p2, location: 'Remera', price: '$1000/month' },
  { id: 3, img: p3, location: 'Gikondo', price: '$800/month' },
  { id: 4, img: p4, location: 'Nyabugogo', price: '$500/month' },
  { id: 5, img: p5, location: 'Kiyovu', price: '$900/month' },
  { id: 6, img: p6, location: 'Kacyiru', price: '$650/month' }
];

// Options for the main filters
const propertyTypeOptions = [
  { value: 'room', label: 'Room' },
  { value: 'full_property', label: 'Full Property' },
];

const situationOptions = [
  { value: 'coliving', label: 'Co-living' },
  { value: 'alone', label: 'Living Alone' },
];

const locationOptions = [
  { value: 'kimironko', label: 'Kimironko' },
  { value: 'remera', label: 'Remera' },
  { value: 'gikondo', label: 'Gikondo' },
  { value: 'nyabugogo', label: 'Nyabugogo' },
  { value: 'kiyovu', label: 'Kiyovu' },
  { value: 'kacyiru', label: 'Kacyiru' },
];

// Options for advanced filters
const campusOptions = [
  { value: 'alu', label: 'African Leadership University' },
  { value: 'ur', label: 'University of Rwanda' },
  { value: 'auca', label: 'AUCA' },
  { value: 'does_not_matter', label: "Doesn't Matter" },
];

const preferredGenderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'n/a', label: 'N/A (Living Alone)' },
];

const squareFeetOptions = [
  { value: '200-300', label: '200-300 sqft' },
  { value: '300-400', label: '300-400 sqft' },
  { value: '400-500', label: '400-500 sqft' },
  { value: '500+', label: '500+ sqft' },
];

const StudentHome = () => {
  const [savedProperties, setSavedProperties] = useState([]);

  // Main filter states
  const [propertyType, setPropertyType] = useState(null);
  const [situation, setSituation] = useState(null);
  const [location, setLocation] = useState(null);
  const [maxPrice, setMaxPrice] = useState('');

  // Advanced filter states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const advancedDropdownRef = useRef(null);
  const advancedButtonRef = useRef(null);

  // Amenities state and handler REMOVED
  // const [amenities, setAmenities] = useState({
  //   wifi: false,
  //   laundry: false,
  //   parking: false,
  //   kitchen: false,
  // });
  const [closeToCampus, setCloseToCampus] = useState(null);
  const [preferredGender, setPreferredGender] = useState(null);
  const [squareFeet, setSquareFeet] = useState(null);

  const toggleSave = (property) => {
    setSavedProperties((prevSaved) => {
      const isSaved = prevSaved.find((p) => p.id === property.id);
      return isSaved
        ? prevSaved.filter((p) => p.id !== property.id)
        : [...prevSaved, property];
    });
  };

  // handleAmenityChange function REMOVED
  // const handleAmenityChange = (e) => {
  //   const { name, checked } = e.target;
  //   setAmenities((prevAmenities) => ({
  //     ...prevAmenities,
  //     [name]: checked,
  //   }));
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      propertyType: propertyType ? propertyType.value : null,
      situation: situation ? situation.value : null,
      location: location ? location.value : null,
      maxPrice,
      // Advanced options
      // amenities, // No longer included in the log
      closeToCampus: closeToCampus ? closeToCampus.value : null,
      preferredGender: preferredGender ? preferredGender.value : null,
      squareFeet: squareFeet ? squareFeet.value : null,
    });
    // Add your filtering logic here
    setShowAdvancedFilters(false); // Close advanced filters on search
  };

  // Close advanced dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        advancedDropdownRef.current &&
        !advancedDropdownRef.current.contains(event.target) &&
        advancedButtonRef.current &&
        !advancedButtonRef.current.contains(event.target)
      ) {
        setShowAdvancedFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [advancedDropdownRef, advancedButtonRef]);


  return (
    <>
      <Navbar />
      <div className={styles.main}>
        <div className={styles.heroSection}>
          
          <h1 className={styles.heroTitle}>Let's find Your new Home</h1>
          <form className={styles.filterForm} onSubmit={handleSubmit}>
            {/* Main Horizontal Filter Bar */}
            <div className={styles.mainFilterBar}>
              {/* Property Type */}
              <div className={styles.filterField}>
                <Select
                  options={propertyTypeOptions}
                  placeholder="Property Type"
                  classNamePrefix="react-select"
                  value={propertyType}
                  onChange={setPropertyType}
                />
              </div>

              {/* Situation */}
              <div className={styles.filterField}>
                <Select
                  options={situationOptions}
                  placeholder="Situation"
                  classNamePrefix="react-select"
                  value={situation}
                  onChange={setSituation}
                />
              </div>

              {/* Location */}
              <div className={styles.filterField}>
                <Select
                  options={locationOptions}
                  placeholder="Location"
                  classNamePrefix="react-select"
                  value={location}
                  onChange={setLocation}
                />
              </div>

              {/* Max Price */}
              <div className={styles.filterField}>
                <input
                  type="number"
                  min={100}
                  step={50}
                  placeholder="Max Price"
                  className={styles.filterInput}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>

              {/* Advanced Button */}
              <div className={styles.advancedButtonContainer}>
                <button
                  type="button"
                  className={styles.advancedBtn}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  ref={advancedButtonRef}
                >
                  Advanced <span className={styles.advancedArrow}>{showAdvancedFilters ? '▲' : '▼'}</span>
                </button>

                {/* Advanced Filters Dropdown (Conditionally Rendered) */}
                {showAdvancedFilters && (
                  <div className={styles.advancedFiltersDropdown} ref={advancedDropdownRef}>
                    {/* Amenities Checkboxes */}
                    {/* <div className={`${styles.filterField} ${styles.amenities}`}>
                      <label className={styles.amenityCheckbox}>
                        <input type="checkbox" name="wifi" checked={amenities.wifi} onChange={handleAmenityChange} />
                        Wi-Fi
                      </label>
                      <label className={styles.amenityCheckbox}>
                        <input type="checkbox" name="laundry" checked={amenities.laundry} onChange={handleAmenityChange} />
                        Laundry
                      </label>
                      <label className={styles.amenityCheckbox}>
                        <input type="checkbox" name="parking" checked={amenities.parking} onChange={handleAmenityChange} />
                        Parking
                      </label>
                      <label className={styles.amenityCheckbox}>
                        <input type="checkbox" name="kitchen" checked={amenities.kitchen} onChange={handleAmenityChange} />
                        Kitchen
                      </label>
                    </div> */}

                    {/* Close to Campus */}
                    <div className={styles.filterField}>
                      <Select
                        options={campusOptions}
                        placeholder="Close to Campus?"
                        classNamePrefix="react-select-advanced"
                        value={closeToCampus}
                        onChange={setCloseToCampus}
                      />
                    </div>

                    {/* Preferred Gender */}
                    <div className={styles.filterField}>
                      <Select
                        options={preferredGenderOptions}
                        placeholder="Preferred Gender"
                        classNamePrefix="react-select-advanced"
                        value={preferredGender}
                        onChange={setPreferredGender}
                      />
                    </div>

                    {/* Square Feet */}
                    <div className={styles.filterField}>
                      <Select
                        options={squareFeetOptions}
                        placeholder="Square Feet"
                        classNamePrefix="react-select-advanced"
                        value={squareFeet}
                        onChange={setSquareFeet}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button type="submit" className={styles.searchBtn}>
                <i className="fa fa-search"></i> Search
              </button>
            </div>
          </form>
        </div>

        {/* Featured Properties section */}
        <div className={styles.mostviewed}>
          <h1>Featured Properties</h1>
          <div className={styles.all}>
            {properties.map((property) => {
              const isSaved = savedProperties.some((p) => p.id === property.id);
              return (
                <div className={styles.listing} key={property.id}>
                  <img src={property.img} alt={`Property in ${property.location}`} />
                  <div className={styles["listing-details"]}>
                    <div className={styles["top-row"]}>
                      <div className={styles["text-group"]}>
                        <h4>House name</h4>
                        <p className={styles.location}><FaLocationDot /> {property.location}</p>
                      </div>
                      {isSaved ? (
                        <FaHeart
                          size={20}
                          color="#da2461"
                          onClick={() => toggleSave(property)}
                          className={styles.heartIcon}
                        />
                      ) : (
                        <FaRegHeart
                          size={20}
                          color="black"
                          onClick={() => toggleSave(property)}
                          className={styles.heartIcon}
                        />
                      )}
                    </div>
                    <p className={styles.description}>
                      Cozy two-bedroom apartment with a modern kitchen, spacious living area,
                      and large windows that fill the rooms with natural light. Perfect for students
                      or small families looking for a comfortable and affordable home near local amenities.
                    </p>
                    <div className={styles["bottom-row"]}>
                      <p className={styles.price}>{property.price}</p>
                      <button className={styles.check}>View</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/listing" className={styles["see-more"]}>See more</Link>
        </div>
      </div>
    </>
  );
};

export default StudentHome;
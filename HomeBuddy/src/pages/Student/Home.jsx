import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { FaLocationDot, FaRegHeart, FaHeart, FaUser } from "react-icons/fa6";
import p1 from '../../assets/property1.jfif';
import p2 from '../../assets/property2.jfif';
import p3 from '../../assets/property3.jfif';
import p4 from '../../assets/property4.jfif';
import p5 from '../../assets/property5.jfif';
import p6 from '../../assets/property6.jfif';
import styles from '../../styles/Home.module.css';
import Navbar from "../../components/Navbar";

const properties = [
  {
    id: 1,
    location: 'Kimironko',
    price: 600,
    priceText: '$600/month',
    mainImage: p1,
    otherImages: [p2, p3],
    description: "Modern two-bedroom apartment with great lighting and free Wi-Fi.",
    wifi: "yes",
    furnished: "yes",
    availableBeds: 4,
    roommate: 1,
    propertyType: 'room',
    situation: 'coliving',
    campus: 'ur',
    gender: 'male',
    squareFeet: '300-400'
  },
  {
    id: 2,
    location: 'Remera',
    price: 1000,
    priceText: '$1000/month',
    mainImage: p2,
    otherImages: [p1, p3],
    description: "Spacious apartment near major shops. Fully furnished with balcony view.",
    wifi: "yes",
    furnished: "yes",
    availableBeds: 4,
    roommate: 3,
    propertyType: 'full_property',
    situation: 'alone',
    campus: 'alu',
    gender: 'female',
    squareFeet: '400-500'
  },
  {
    id: 3,
    location: 'Gikondo',
    price: 800,
    priceText: '$800/month',
    mainImage: p3,
    otherImages: [p4, p5],
    description: "Bright unit with shared kitchen and all bills included.",
    wifi: "yes",
    furnished: "no",
    availableBeds: 3,
    roommate: 2,
    propertyType: 'room',
    situation: 'coliving',
    campus: 'auca',
    gender: 'male',
    squareFeet: '200-300'
  },
  {
    id: 4,
    location: 'Nyabugogo',
    price: 500,
    priceText: '$500/month',
    mainImage: p4,
    otherImages: [p6, p1],
    description: "Affordable and compact space with easy transport access.",
    wifi: "no",
    furnished: "yes",
    availableBeds: 4,
    roommate: 0,
    propertyType: 'room',
    situation: 'alone',
    campus: 'does_not_matter',
    gender: 'n/a',
    squareFeet: '200-300'
  },
  {
    id: 5,
    location: 'Kiyovu',
    price: 900,
    priceText: '$900/month',
    mainImage: p5,
    otherImages: [p2, p6],
    description: "Luxury flat with all modern fittings and a private bedroom.",
    wifi: "yes",
    furnished: "yes",
    availableBeds: 2,
    roommate: 1,
    propertyType: 'full_property',
    situation: 'coliving',
    campus: 'ur',
    gender: 'female',
    squareFeet: '500+'
  },
  {
    id: 6,
    location: 'Kacyiru',
    price: 650,
    priceText: '$650/month',
    mainImage: p6,
    otherImages: [p3, p4],
    description: "Student-friendly space with fast internet and calm surroundings.",
    wifi: "yes",
    furnished: "no",
    availableBeds: 3,
    roommate: 2,
    propertyType: 'room',
    situation: 'coliving',
    campus: 'alu',
    gender: 'male',
    squareFeet: '300-400'
  }
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
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Main filter states
  const [propertyType, setPropertyType] = useState(null);
  const [situation, setSituation] = useState(null);
  const [location, setLocation] = useState(null);
  const [maxPrice, setMaxPrice] = useState('');

  // Advanced filter states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const advancedDropdownRef = useRef(null);
  const advancedButtonRef = useRef(null);

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

  const filterProperties = () => {
    let filtered = properties;

    // Filter by property type
    if (propertyType) {
      filtered = filtered.filter(prop => prop.propertyType === propertyType.value);
    }

    // Filter by situation
    if (situation) {
      filtered = filtered.filter(prop => prop.situation === situation.value);
    }

    // Filter by location
    if (location) {
      filtered = filtered.filter(prop => prop.location.toLowerCase() === location.value);
    }

    // Filter by max price
    if (maxPrice) {
      filtered = filtered.filter(prop => prop.price <= parseInt(maxPrice));
    }

    // Filter by campus
    if (closeToCampus && closeToCampus.value !== 'does_not_matter') {
      filtered = filtered.filter(prop => prop.campus === closeToCampus.value);
    }

    // Filter by gender
    if (preferredGender) {
      filtered = filtered.filter(prop => prop.gender === preferredGender.value);
    }

    // Filter by square feet
    if (squareFeet) {
      filtered = filtered.filter(prop => prop.squareFeet === squareFeet.value);
    }

    return filtered;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const filtered = filterProperties();
    setFilteredProperties(filtered);
    setShowAdvancedFilters(false);
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
  };

  const handleClosePropertyView = () => {
    setSelectedProperty(null);
  };

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

  // Reset filters
  const resetFilters = () => {
    setPropertyType(null);
    setSituation(null);
    setLocation(null);
    setMaxPrice('');
    setCloseToCampus(null);
    setPreferredGender(null);
    setSquareFeet(null);
    setFilteredProperties(properties);
    setShowAdvancedFilters(false);
  };

  return (
    <>
      <Navbar />
      <div className={styles.main}>
        <div className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Let's find Your new Home</h1>
          <form className={styles.filterForm} onSubmit={handleSubmit}>
            <div className={styles.mainFilterBar}>
              <div className={styles.filterField}>
                <Select
                  options={propertyTypeOptions}
                  placeholder="Property Type"
                  classNamePrefix="react-select"
                  value={propertyType}
                  onChange={setPropertyType}
                  isClearable
                />
              </div>
              <div className={styles.filterField}>
                <Select
                  options={situationOptions}
                  placeholder="Situation"
                  classNamePrefix="react-select"
                  value={situation}
                  onChange={setSituation}
                  isClearable
                />
              </div>
              <div className={styles.filterField}>
                <Select
                  options={locationOptions}
                  placeholder="Location"
                  classNamePrefix="react-select"
                  value={location}
                  onChange={setLocation}
                  isClearable
                />
              </div>
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
              <div className={styles.advancedButtonContainer}>
                <button
                  type="button"
                  className={styles.advancedBtn}
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  ref={advancedButtonRef}
                >
                  Advanced <span className={styles.advancedArrow}>{showAdvancedFilters ? '▲' : '▼'}</span>
                </button>
                {showAdvancedFilters && (
                  <div className={styles.advancedFiltersDropdown} ref={advancedDropdownRef}>
                    <div className={styles.filterField}>
                      <Select
                        options={campusOptions}
                        placeholder="Close to Campus?"
                        classNamePrefix="react-select-advanced"
                        value={closeToCampus}
                        onChange={setCloseToCampus}
                        isClearable
                      />
                    </div>
                    <div className={styles.filterField}>
                      <Select
                        options={preferredGenderOptions}
                        placeholder="Preferred Gender"
                        classNamePrefix="react-select-advanced"
                        value={preferredGender}
                        onChange={setPreferredGender}
                        isClearable
                      />
                    </div>
                    <div className={styles.filterField}>
                      <Select
                        options={squareFeetOptions}
                        placeholder="Square Feet"
                        classNamePrefix="react-select-advanced"
                        value={squareFeet}
                        onChange={setSquareFeet}
                        isClearable
                      />
                    </div>
                  </div>
                )}
              </div>
              <button type="submit" className={styles.searchBtn}>
                <i className="fa fa-search"></i> Search
              </button>
              <button type="button" className={styles.resetBtn} onClick={resetFilters}>
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Featured Properties section */}
        <div className={styles.mostviewed}>
          <h1>Featured Properties ({filteredProperties.length} found)</h1>
          <div className={styles.all}>
            {filteredProperties.map((property) => {
              const isSaved = savedProperties.some((p) => p.id === property.id);
              const currentRoommates = property.roommate || 0;
              const totalCapacity = property.availableBeds;
              const roommateDisplay = `${currentRoommates}/${totalCapacity}`;

              return (
                <div className={styles.listing} key={property.id}>
                  <img src={property.mainImage} alt={`Property in ${property.location}`} />
                  <div className={styles["listing-details"]}>
                    <div className={styles["top-row"]}>
                      <div className={styles["text-group"]}>
                        <h4>House name</h4>
                        <div className={styles.locationAndRoommates}>
                          <p className={styles.location}>
                            <FaLocationDot color="#4361EE" /> {property.location}
                          </p>
                          <p className={styles.roommateCount}>
                            <FaUser color="#3F37C9" size={14} style={{ marginRight: '5px' }} /> {roommateDisplay}
                          </p>
                        </div>
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
                      {property.description}
                    </p>
                    <div className={styles["bottom-row"]}>
                      <p className={styles.price}>{property.priceText}</p>
                      <button 
                        className={styles.check}
                        onClick={() => handleViewProperty(property)}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filteredProperties.length === 0 && (
            <div className={styles.noResults}>
              <p>No properties match your search criteria. Try adjusting your filters.</p>
            </div>
          )}
        </div>

        {/* Property Detail Modal */}
        {selectedProperty && (
          <div className={styles.modal} onClick={handleClosePropertyView}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={handleClosePropertyView}>×</button>
              <img src={selectedProperty.mainImage} alt={`Property in ${selectedProperty.location}`} />
              <h2>Property Details</h2>
              <p><strong>Location:</strong> {selectedProperty.location}</p>
              <p><strong>Price:</strong> {selectedProperty.priceText}</p>
              <p><strong>Description:</strong> {selectedProperty.description}</p>
              <p><strong>WiFi:</strong> {selectedProperty.wifi}</p>
              <p><strong>Furnished:</strong> {selectedProperty.furnished}</p>
              <p><strong>Available Beds:</strong> {selectedProperty.availableBeds}</p>
              <p><strong>Current Roommates:</strong> {selectedProperty.roommate}</p>
              <div className={styles.otherImages}>
                <h3>Other Images:</h3>
                <div className={styles.imageGrid}>
                  {selectedProperty.otherImages.map((img, index) => (
                    <img key={index} src={img} alt={`Property ${index + 1}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentHome;
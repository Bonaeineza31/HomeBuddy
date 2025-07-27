import React, { useState, useRef, useEffect } from "react";
import Select from "react-select";
import { Link } from 'react-router-dom';
import { FaLocationDot, FaRegHeart, FaHeart, FaUser } from "react-icons/fa6";
import { Loader, MapPin, Heart, Wifi, Bed, Users, Home, Map, Car, UtensilsCrossed, Shirt, BookOpen, Trees, Building2, Shield, Droplets, Zap, Bus, ShoppingBag } from "lucide-react";
import styles from '../../styles/Home.module.css';
import Navbar from "../../components/Navbar";

// Icon mapping for amenities (same as listing.jsx)
const amenityIcons = {
  wifi: Wifi,
  car: Car,
  chef: UtensilsCrossed,
  utensils: UtensilsCrossed,
  kitchen: UtensilsCrossed,
  shirt: Shirt,
  book: BookOpen,
  'book-open': BookOpen,
  study: BookOpen,
  tree: Trees,
  trees: Trees,
  garden: Trees,
  building: Building2,
  'building-2': Building2,
  balcony: Building2,
  shield: Shield,
  security: Shield,
  droplets: Droplets,
  water: Droplets,
  zap: Zap,
  electricity: Zap,
  power: Zap,
  bus: Bus,
  transport: Bus,
  'shopping-bag': ShoppingBag,
  shopping: ShoppingBag,
  shops: ShoppingBag,
  home: Home,
  furnished: Home,
};

// Options for the main filters
const propertyTypeOptions = [
  { value: 'room', label: 'Room' },
  { value: 'full_property', label: 'Full Property' },
];

const situationOptions = [
  { value: 'coliving', label: 'Co-living' },
  { value: 'alone', label: 'Living Alone' },
];

// Campus options
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
  // State for properties and UI
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locationOptions, setLocationOptions] = useState([]);

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

  // API configuration
  const API_BASE_URL = 'http://localhost:3000';

  // Fetch properties from API
  const fetchProperties = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string
      const queryParams = new URLSearchParams();
      
      Object.entries(filterParams).forEach(([key, value]) => {
        if (value && value !== '') {
          if (Array.isArray(value) && value.length > 0) {
            value.forEach(item => queryParams.append(key, item));
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const response = await fetch(`${API_BASE_URL}/properties?${queryParams.toString()}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('API endpoint not found. Make sure your backend server is running on the correct port.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setProperties(data.data);
        setFilteredProperties(data.data);
        
        // Extract unique locations for dropdown
        const uniqueLocations = [...new Set(data.data.map(prop => prop.location))];
        const locationOpts = uniqueLocations.map(loc => ({
          value: loc.toLowerCase(),
          label: loc
        }));
        setLocationOptions(locationOpts);
        
      } else {
        throw new Error(data.message || 'Failed to fetch properties');
      }
    } catch (error) {
      setError(error.message);
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Load properties on component mount
  useEffect(() => {
    fetchProperties();
  }, []);

  // Load saved properties from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedProperties');
    if (saved) {
      try {
        setSavedProperties(JSON.parse(saved));
      } catch (err) {
        console.error('Error loading saved properties:', err);
      }
    }
  }, []);

  // Save to localStorage whenever savedProperties changes
  useEffect(() => {
    localStorage.setItem('savedProperties', JSON.stringify(savedProperties));
  }, [savedProperties]);

  // Listen for localStorage changes from other tabs/pages
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'savedProperties') {
        try {
          const newSavedProperties = JSON.parse(e.newValue || '[]');
          setSavedProperties(newSavedProperties);
        } catch (err) {
          console.error('Error parsing saved properties from storage:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleSave = (property) => {
    setSavedProperties((prevSaved) => {
      const isAlreadySaved = prevSaved.find((item) => item._id === property._id);
      return isAlreadySaved
        ? prevSaved.filter((item) => item._id !== property._id)
        : [...prevSaved, property];
    });
  };

  // Filter properties locally (for immediate UI feedback)
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
      filtered = filtered.filter(prop => 
        prop.location.toLowerCase() === location.value.toLowerCase()
      );
    }

    // Filter by max price
    if (maxPrice) {
      filtered = filtered.filter(prop => 
        (prop.pricePerPerson || prop.price || 0) <= parseInt(maxPrice)
      );
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
    
    // Build filter parameters for API call
    const filterParams = {};
    
    if (propertyType) filterParams.propertyType = propertyType.value;
    if (situation) filterParams.situation = situation.value;
    if (location) filterParams.location = location.label;
    if (maxPrice) filterParams.maxPrice = maxPrice;
    if (closeToCampus && closeToCampus.value !== 'does_not_matter') {
      filterParams.campus = closeToCampus.value;
    }
    if (preferredGender) filterParams.gender = preferredGender.value;
    if (squareFeet) filterParams.squareFeet = squareFeet.value;

    // Fetch filtered results from API
    fetchProperties(filterParams);
    setShowAdvancedFilters(false);
  };

  // Reset filters
  const resetFilters = () => {
    setPropertyType(null);
    setSituation(null);
    setLocation(null);
    setMaxPrice('');
    setCloseToCampus(null);
    setPreferredGender(null);
    setSquareFeet(null);
    setShowAdvancedFilters(false);
    fetchProperties(); // Fetch all properties without filters
  };

  // Get amenity icon component
  const getAmenityIcon = (iconName) => {
    const IconComponent = amenityIcons[iconName] || Home;
    return IconComponent;
  };

  // Handle click outside advanced filters
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
  }, []);

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.main}>
          <div className={styles.loadingContainer}>
            <Loader className={styles.spinner} size={48} />
            <p>Loading properties...</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Navbar />
        <div className={styles.main}>
          <div className={styles.heroSection}>
            <h1 className={styles.heroTitle}>Let's find Your new Home</h1>
          </div>
          <div className={styles.errorContainer}>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button 
              onClick={() => fetchProperties()}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

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
              const isSaved = savedProperties.some((item) => item._id === property._id);
              const currentRoommates = property.currentRoommates || 0;
              const totalCapacity = property.availableBeds || 0;
              const roommateDisplay = `${currentRoommates}/${totalCapacity}`;
              const displayPrice = property.pricePerPerson 
                ? `$${property.pricePerPerson}/person` 
                : property.priceText || `$${property.price || 0}/month`;

              return (
                <div className={styles.listing} key={property._id}>
                  <img 
                    src={property.mainImage} 
                    alt={`Property in ${property.location}`}
                    onError={(e) => {
                      e.target.src = '/default-property-image.jpg';
                    }}
                  />
                  <div className={styles["listing-details"]}>
                    <div className={styles["top-row"]}>
                      <div className={styles["text-group"]}>
                        <h4>{property.houseName || 'House name'}</h4>
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

                    {/* Display amenities */}
                    <div className={styles.amenities}>
                      {property.amenities && property.amenities.length > 0 ? (
                        property.amenities
                          .filter(amenity => amenity.available)
                          .slice(0, 4) // Show up to 4 amenities
                          .map((amenity, index) => {
                            const IconComponent = getAmenityIcon(amenity.icon);
                            return (
                              <span key={index} className={styles.amenity}>
                                <IconComponent size={14} /> 
                                <span>{amenity.name}</span>
                              </span>
                            );
                          })
                      ) : (
                        <>
                          {property.wifi === "yes" && (
                            <span className={styles.amenity}>
                              <Wifi size={14} /> 
                              <span>WiFi</span>
                            </span>
                          )}
                          {property.furnished === "yes" && (
                            <span className={styles.amenity}>
                              <Home size={14} /> 
                              <span>Furnished</span>
                            </span>
                          )}
                        </>
                      )}
                    </div>

                    <div className={styles["bottom-row"]}>
                      <p className={styles.price}>{displayPrice}</p>
                      <Link
                        to={`/student/detail/${property._id}`}
                        state={{property: property, allProperties: filteredProperties}}
                      >
                        <button className={styles.viewButton}>View</button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filteredProperties.length === 0 && !loading && (
            <div className={styles.noResults}>
              <p>No properties match your search criteria. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentHome;
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { MapPin, Heart, Wifi, Bed, Users, Home, Map, Car, UtensilsCrossed, Shirt, BookOpen, Trees, Building2, Shield, Droplets, Zap, Bus, ShoppingBag, Loader } from "lucide-react";
import styles from '../../styles/Listing.module.css';
import Navbar from "../../components/Navbar";

// Icon mapping for amenities
const amenityIcons = {
  wifi: Wifi,
  car: Car,
  chef: UtensilsCrossed, // Kitchen/cooking icon
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
  // Add more mappings as needed
};

const StudentListing = () => {
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    amenities: [],
    minBeds: '',
    maxBeds: ''
  });

  // Fetch properties from API
  const fetchProperties = async (filterParams = {}) => {
    try {
      setLoading(true);
      
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

      // Update this URL to match your backend server
      const API_BASE_URL = 'https://homebuddy-yn9v.onrender.com'
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
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch properties');
      }
    } catch (error) {
      setError(error.message);
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

  const toggleSave = (property) => {
    setSavedProperties((prevSaved) => {
      const isAlreadySaved = prevSaved.find((item) => item._id === property._id);
      return isAlreadySaved
        ? prevSaved.filter((item) => item._id !== property._id)
        : [...prevSaved, property];
    });
  };

  const handleMapClick = (property) => {
    const { coordinates } = property;
    if (coordinates && coordinates.length === 2) {
      const [lat, lng] = coordinates;
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      // Fallback to location search
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${property.location}`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  // Get amenity icon component
  const getAmenityIcon = (iconName) => {
    const IconComponent = amenityIcons[iconName] || Home;
    return IconComponent;
  };

  // Apply filters
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchProperties(newFilters);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
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
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button 
              onClick={() => fetchProperties(filters)}
              className={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  // Main content - FIXED: Added Navbar here
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* Filter Section - You can add this later */}
        {/* <div className={styles.filterSection}>
          // Add your filter components here
        </div> */}

        <div className={styles.allListings}>
          {properties.length === 0 ? (
            <div className={styles.noProperties}>
              <h3>No properties found</h3>
              <p>Try adjusting your search criteria or check back later for new listings.</p>
            </div>
          ) : (
            <div className={styles.properties}>
              {properties.map((property) => {
                const isSaved = savedProperties.some((item) => item._id === property._id);
                
                return (
                  <div className={styles.property} key={property._id}>
                    <div className={styles.imageContainer}>
                      <img
                        src={property.mainImage}
                        alt={`Property in ${property.location}`}
                        className={styles.listImage}
                        onError={(e) => {
                          e.target.src = '/default-property-image.jpg'; // Add a default image
                        }}
                      />
                      <div
                        className={styles.mapOverlay}
                        onClick={() => handleMapClick(property)}
                      >
                        <Map size={24} />
                        <span>View on Map</span>
                      </div>
                    </div>

                    <div className={styles.details}>
                      <div className={styles.save}>
                        <div className={styles.saveText}>
                          <h4>{property.houseName}</h4>
                          <p className={styles.location}>
                            <MapPin size={16} /> {property.location}
                          </p>
                        </div>
                        <Heart
                          size={25}
                          color={isSaved ? "#da2461" : "#999"}
                          fill={isSaved ? "#da2461" : "none"}
                          onClick={() => toggleSave(property)}
                          style={{ cursor: "pointer" }}
                        />
                      </div>

                      <p className={styles.description}>
                        {property.description}
                      </p>

                      <div className={styles.amenities}>
                        {/* Display amenities from the amenities array */}
                        {property.amenities && property.amenities.length > 0 ? (
                          property.amenities
                            .filter(amenity => amenity.available)
                            .slice(0, 4) // Show only first 4 amenities to avoid crowding
                            .map((amenity, index) => {
                              const IconComponent = getAmenityIcon(amenity.icon);
                              return (
                                <span key={index} className={styles.amenity}>
                                  <IconComponent size={14} /> {amenity.name}
                                </span>
                              );
                            })
                        ) : (
                          // Fallback: Check for legacy wifi/furnished fields if amenities array is empty
                          <>
                            {property.wifi === "yes" && (
                              <span className={styles.amenity}>
                                <Wifi size={14} /> WiFi
                              </span>
                            )}
                            {property.furnished === "yes" && (
                              <span className={styles.amenity}>
                                <Home size={14} /> Furnished
                              </span>
                            )}
                          </>
                        )}
                        
                        {/* Always show beds and occupancy info */}
                        <span className={styles.amenity}>
                          <Bed size={14} /> {property.availableBeds} beds
                        </span>
                        <span className={styles.amenity}>
                          <Users size={14} /> {property.currentRoommates || 0} currently / {property.availableBeds} total
                        </span>
                      </div>

                      <div className={styles.lower}>
                        <p className={styles.price}>
                          ${property.pricePerPerson}/person
                        </p>
                        
                        {/* Show available spots */}
                        {property.availableSpots !== undefined && (
                          <p className={styles.availableSpots}>
                            {property.availableSpots > 0 
                              ? `${property.availableSpots} spot${property.availableSpots > 1 ? 's' : ''} available`
                              : 'Fully occupied'
                            }
                          </p>
                        )}
                        
                        <div className={styles.actions}>
                          <Link
                            to={`/student/detail/${property._id}`}
                            state={{ property: property, allProperties: properties }}
                          >
                            <button className={styles.viewButton}>View</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Show property count */}
        {properties.length > 0 && (
          <div className={styles.propertyCount}>
            <p>Showing {properties.length} properties</p>
          </div>
        )}
      </div>
    </>
  );
};

export default StudentListing;
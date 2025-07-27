import React, { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import {
  MapPin, Heart, Wifi, Bed, Users, Home, Map, Car, UtensilsCrossed,
  Shirt, BookOpen, Trees, Building2, Shield, Droplets, Zap, Bus, ShoppingBag
} from "lucide-react";
import styles from '../../styles/Listing.module.css';
import Navbar from "../../components/Navbar";

// Amenity icon map
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

const Saved = () => {
  const [savedProperties, setSavedProperties] = useState([]);

  // Load saved properties from localStorage
  const loadSavedProperties = useCallback(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedProperties')) || [];
      setSavedProperties(saved);
    } catch (err) {
      console.error('Error loading saved properties:', err);
      setSavedProperties([]);
    }
  }, []);

  useEffect(() => {
    loadSavedProperties();

    const handleStorageChange = (e) => {
      if (e.key === 'savedProperties') {
        loadSavedProperties();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadSavedProperties]);

  // Remove a saved property
  const removeSaved = (propertyId) => {
    const updatedSaved = savedProperties.filter(p => p._id !== propertyId);
    setSavedProperties(updatedSaved);
    localStorage.setItem('savedProperties', JSON.stringify(updatedSaved));
  };

  // Open Google Maps
  const handleMapClick = ({ coordinates, location }) => {
    const url = coordinates?.length === 2
      ? `https://www.google.com/maps/search/?api=1&query=${coordinates[0]},${coordinates[1]}`
      : `https://www.google.com/maps/search/?api=1&query=${location}`;
    window.open(url, '_blank');
  };

  const getAmenityIcon = (iconName) => {
    return amenityIcons[iconName] || Home;
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.allListings}>
          {savedProperties.length === 0 ? (
            <div className={styles.noProperties}>
              <Heart size={64} color="#ccc" />
              <h3>No saved properties yet</h3>
              <p>Start exploring and save properties you're interested in by clicking the heart icon.</p>
              <Link to="/student/listing">
                <button className={styles.viewButton}>Browse Properties</button>
              </Link>
            </div>
          ) : (
            <div className={styles.properties}>
              {savedProperties.map((property) => (
                <div className={styles.property} key={property._id}>
                  <div className={styles.imageContainer}>
                    <img
                      src={property.mainImage}
                      alt={`Property in ${property.location}`}
                      className={styles.listImage}
                      onError={(e) => { e.target.src = '/default-property-image.jpg'; }}
                    />
                    <div className={styles.mapOverlay} onClick={() => handleMapClick(property)}>
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
                        color="#da2461"
                        fill="#da2461"
                        onClick={() => removeSaved(property._id)}
                        style={{ cursor: "pointer" }}
                        title="Remove from saved"
                      />
                    </div>

                    <p className={styles.description}>{property.description}</p>

                    <div className={styles.amenities}>
                      {property.amenities?.length > 0 ? (
                        property.amenities
                          .filter(a => a.available)
                          .slice(0, 4)
                          .map((amenity, index) => {
                            const Icon = getAmenityIcon(amenity.icon);
                            return (
                              <span key={index} className={styles.amenity}>
                                <Icon size={14} /> {amenity.name}
                              </span>
                            );
                          })
                      ) : (
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
                      {property.availableSpots !== undefined && (
                        <p className={styles.availableSpots}>
                          {property.availableSpots > 0
                            ? `${property.availableSpots} spot${property.availableSpots > 1 ? 's' : ''} available`
                            : 'Fully occupied'}
                        </p>
                      )}
                      <div className={styles.actions}>
                        <Link
                          to={`/student/detail/${property._id}`}
                          state={{ property, allProperties: savedProperties }}
                        >
                          <button className={styles.viewButton}>View</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Saved;

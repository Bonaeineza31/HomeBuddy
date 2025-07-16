import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { MapPin, Map, Heart, Wifi, Bed, Users, Home } from "lucide-react";
import p1 from '../../assets/property1.jfif';
import p2 from '../../assets/property2.jfif';
import p3 from '../../assets/property3.jfif';
import p4 from '../../assets/property4.jfif';
import p5 from '../../assets/property5.jfif';
import p6 from '../../assets/property6.jfif';
import styles from '../../styles/Listing.module.css';
import Navbar from "../../components/Navbar";

const properties = [
  {
    id: 1,
    location: 'Kimironko',
    price: '$600/month',
    mainImage: p1,
    otherImages: [p2, p3],
    description: "Modern two-bedroom apartment with great lighting and free Wi-Fi.",
    wifi: "yes",
    furnished: "yes",
    availableBeds: 2,
    roommate: 1,
    coordinates: [-1.9441, 30.1056],
    houseName: "Sunrise Apartments"
  },
  {
    id: 2,
    location: 'Remera',
    price: '$1000/month',
    mainImage: p2,
    otherImages: [p1, p3],
    description: "Spacious apartment near major shops. Fully furnished with balcony view.",
    wifi: "yes",
    furnished: "yes",
    availableBeds: 3,
    roommate: 2,
    coordinates: [-1.9355, 30.1135],
    houseName: "City View Residence"
  },
  {
    id: 3,
    location: 'Gikondo',
    price: '$800/month',
    mainImage: p3,
    otherImages: [p4, p5],
    description: "Bright unit with shared kitchen and all bills included.",
    wifi: "yes",
    furnished: "no",
    availableBeds: 1,
    roommate: 2,
    coordinates: [-1.9706, 30.0588],
    houseName: "Student Haven"
  },
  {
    id: 4,
    location: 'Nyabugogo',
    price: '$500/month',
    mainImage: p4,
    otherImages: [p6, p1],
    description: "Affordable and compact space with easy transport access.",
    wifi: "no",
    furnished: "yes",
    availableBeds: 2,
    roommate: 3,
    coordinates: [-1.9536, 30.0588],
    houseName: "Budget Comfort"
  },
  {
    id: 5,
    location: 'Kiyovu',
    price: '$900/month',
    mainImage: p5,
    otherImages: [p2, p6],
    description: "Luxury flat with all modern fittings and a private bedroom.",
    wifi: "yes",
    furnished: "yes",
    availableBeds: 1,
    roommate: 1,
    coordinates: [-1.9536, 30.0588],
    houseName: "Elite Residence"
  },
  {
    id: 6,
    location: 'Kacyiru',
    price: '$650/month',
    mainImage: p6,
    otherImages: [p3, p4],
    description: "Student-friendly space with fast internet and calm surroundings.",
    wifi: "yes",
    furnished: "no",
    availableBeds: 2,
    roommate: 2,
    coordinates: [-1.9355, 30.1135],
    houseName: "Scholar's Den"
  }
];

const StudentListing = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const toggleSave = (property) => {
    setSavedProperties((prevSaved) => {
      const isAlreadySaved = prevSaved.find((item) => item.id === property.id);
      return isAlreadySaved
        ? prevSaved.filter((item) => item.id !== property.id)
        : [...prevSaved, property];
    });
  };

  const handleShowMap = (property) => {
    setSelectedProperty(property);
    setShowMapModal(true);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation([-1.9706, 30.0588]);
        }
      );
    } else {
      setUserLocation([-1.9706, 30.0588]);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const GoogleMap = ({ lat, lng, userLat, userLng }) => {
    const mapSrc = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${lat},${lng}&zoom=15`;
    const fallbackSrc = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    
    return (
      <div className={styles.mapContainer}>
        <iframe
          src={fallbackSrc}
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: '10px' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Property Location"
        />
      </div>
    );
  };

  const MapModal = () => {
    if (!showMapModal || !selectedProperty) return null;

    const distance = userLocation ? 
      calculateDistance(userLocation[0], userLocation[1], selectedProperty.coordinates[0], selectedProperty.coordinates[1]) : 
      null;

    return (
      <div className={styles.mapModal}>
        <div className={styles.mapContent}>
          <div className={styles.mapHeader}>
            <h3>Property Location</h3>
            <button 
              className={styles.closeBtn}
              onClick={() => setShowMapModal(false)}
            >
              ×
            </button>
          </div>
          <div className={styles.mapBody}>
            <div className={styles.propertyInfo}>
              <h4>{selectedProperty.houseName}</h4>
              <p className={styles.modalLocation}>
                <MapPin size={16} /> {selectedProperty.location}
              </p>
              <p className={styles.modalPrice}>{selectedProperty.price}</p>
            </div>
            
            <div className={styles.locationActions}>
              <button 
                className={styles.locationBtn}
                onClick={handleGetLocation}
              >
                Get My Location
              </button>
              
              {distance && (
                <div className={styles.distanceInfo}>
                  <p>Distance from your location: <strong>{distance.toFixed(2)} km</strong></p>
                  <p className={distance <= 5 ? styles.nearSchool : styles.farSchool}>
                    {distance <= 5 ? "✓ Close to campus" : "⚠ Far from campus"}
                  </p>
                </div>
              )}
            </div>

            <GoogleMap 
              lat={selectedProperty.coordinates[0]} 
              lng={selectedProperty.coordinates[1]}
              userLat={userLocation ? userLocation[0] : null}
              userLng={userLocation ? userLocation[1] : null}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.allListings}>
          <div className={styles.properties}>
            {properties.map((property) => {
              const isSaved = savedProperties.some((item) => item.id === property.id);
              return (
                <div className={styles.property} key={property.id}>
                  <img
                    src={property.mainImage}
                    alt={`Property in ${property.location}`}
                    className={styles.listImage}
                  />
                  
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
                      <span className={styles.amenity}>
                        <Bed size={14} /> {property.availableBeds} beds
                      </span>
                      <span className={styles.amenity}>
                        <Users size={14} /> {property.roommate} roommates
                      </span>
                    </div>

                    <div className={styles.lower}>
                      <p className={styles.price}>{property.price}</p>
                      <div className={styles.actions}>
                        <button 
                          className={styles.mapButton}
                          onClick={() => handleShowMap(property)}
                        >
                          <Map size={16} /> Map
                        </button>
                        <Link 
                          to={`/property/property${property.id}`} 
                          state={{property: property, allProperties: properties}}
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
        </div>
      </div>

      <MapModal />
    </>
  );
};

export default StudentListing;
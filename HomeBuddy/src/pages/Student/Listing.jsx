import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { MapPin, Heart, Wifi, Bed, Users, Home, Map } from "lucide-react";
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

  const toggleSave = (property) => {
    setSavedProperties((prevSaved) => {
      const isAlreadySaved = prevSaved.find((item) => item.id === property.id);
      return isAlreadySaved
        ? prevSaved.filter((item) => item.id !== property.id)
        : [...prevSaved, property];
    });
  };

  const handleMapClick = (property) => {
    const { coordinates } = property;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates[0]},${coordinates[1]}&travelmode=driving`;
    window.open(googleMapsUrl, '_blank');
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
                  <div className={styles.imageContainer}>
                    <img
                      src={property.mainImage}
                      alt={`Property in ${property.location}`}
                      className={styles.listImage}
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
    </>
  );
};

export default StudentListing
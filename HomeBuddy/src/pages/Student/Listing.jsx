import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { HiHomeModern } from "react-icons/hi2";
import { FaLocationDot } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import p1 from '../../assets/property1.jfif';
import p2 from '../../assets/property2.jfif';
import p3 from '../../assets/property3.jfif';
import p4 from '../../assets/property4.jfif';
import p5 from '../../assets/property5.jfif';
import p6 from '../../assets/property6.jfif';
import styles from '../../styles/Listing.module.css';
import Navbar from "../../components/Navbar";  // Import Navbar

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
    roommate: 1
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
    roommate: 2
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
    roommate: 2
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
    roommate: 3
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
    roommate: 1
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
    roommate: 2
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

  return (
    <>
      <Navbar />

      <div className={styles["all-listings"]}>
        <div className={styles.properties}>
          {properties.map((property) => {
            const isSaved = savedProperties.some((item) => item.id === property.id);
            return (
              <div className={styles.property} key={property.id}>
                <img
                  src={property.mainImage}
                  alt={`Property in ${property.location}`}
                  className={styles["list-image"]}
                />
                <div className={styles.details}>
                  <div className={styles.save}>
                    <div className={styles["save-text"]}>
                      <h4>House name</h4>
                      <p className={styles.location}>
                        <FaLocationDot /> {property.location}
                      </p>
                    </div>
                    {isSaved ? (
                      <FaHeart
                        size={25}
                        color="#da2461"
                        onClick={() => toggleSave(property)}
                        style={{ cursor: "pointer" }}
                      />
                    ) : (
                      <FaRegHeart
                        size={25}
                        color="black"
                        onClick={() => toggleSave(property)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                  </div>

                  <p className={styles.description}>
                    Cozy two-bedroom apartment with a modern kitchen, spacious living
                    area, and large windows that fill the rooms with natural light.
                    Perfect for students or small families looking for a comfortable
                    and affordable home near local amenities.
                  </p>

                  <div className={styles.lower}>
                    <p className={styles.price}>{property.price}</p>
                    <Link to={`/property/property${property.id}`} state={{property:property, allProperties:properties}}><button className={styles.check}>View</button></Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default StudentListing;

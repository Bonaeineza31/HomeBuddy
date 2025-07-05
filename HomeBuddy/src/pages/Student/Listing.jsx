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
  { id: 1, img: p1, location: 'Kimironko', price: '$600/month' },
  { id: 2, img: p2, location: 'Remera', price: '$1000/month' },
  { id: 3, img: p3, location: 'Gikondo', price: '$800/month' },
  { id: 4, img: p4, location: 'Nyabugogo', price: '$500/month' },
  { id: 5, img: p5, location: 'Kiyovu', price: '$900/month' },
  { id: 6, img: p6, location: 'Kacyiru', price: '$650/month' }
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
                  src={property.img}
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
                    <button className={styles.check}>View</button>
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

import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { HiHomeModern } from "react-icons/hi2";
import { FaLocationDot } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import p1 from '../../assets/property1.jfif';
import p2 from '../../assets/property2.jfif';
import p3 from '../../assets/property3.jfif';
import p4 from '../../assets/property4.jfif';
import p5 from '../../assets/property5.jfif';
import p6 from '../../assets/property6.jfif';
import styles from '../../styles/Saved.module.css';
import Navbar from "../../components/Navbar";  // Import Navbar component

const initialProperties = [
  { id: 1, img: p1, location: 'Kimironko', price: '$600/month' },
  { id: 2, img: p2, location: 'Remera', price: '$1000/month' },
  { id: 3, img: p3, location: 'Gikondo', price: '$800/month' },
  { id: 4, img: p4, location: 'Nyabugogo', price: '$500/month' },
  { id: 5, img: p5, location: 'Kiyovu', price: '$900/month' },
  { id: 6, img: p6, location: 'Kacyiru', price: '$650/month' }
];

const StudentSaved = () => {
  const [likedProperties, setLikedProperties] = useState(initialProperties);

  const removeProperty = (id) => {
    setLikedProperties((prev) =>
      prev.filter((property) => property.id !== id)
    );
  };

  return (
    <>
      <Navbar />

      <div className={styles["all-listings"]}>
        <div className={styles.properties}>
          {likedProperties.length === 0 ? (
            <p className={styles["empty-message"]}>You have no saved properties.</p>
          ) : (
            likedProperties.map((property) => (
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
                    <FaHeart
                      size={30}
                      color="#da2461"
                      onClick={() => removeProperty(property.id)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                  <p className={styles.description}>
                    Cozy two-bedroom apartment with a modern kitchen, spacious living area, and large windows that fill the rooms with natural light. Perfect for students or small families looking for a comfortable and affordable home near local amenities.
                  </p>
                  <div className={styles.lower}>
                    <p className={styles.price}>{property.price}</p>
                    <button className={styles.check}>View</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default StudentSaved;

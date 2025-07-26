import { Link } from 'react-router-dom';
import { FaLocationDot } from 'react-icons/fa6';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from '../styles/Home.module.css';

function PropertyCard({ property, isSaved, toggleSave, allProperties }) {
  return (
    <div className={styles.listing}>
      <img src={property.mainImage} alt={`Property in ${property.location}`} />
      <div className={styles["listing-details"]}>
        <div className={styles["top-row"]}>
          <div className={styles["text-group"]}>
            <h4>House name</h4>
            <p className={styles.location}>
              <FaLocationDot /> {property.location}
            </p>
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
          <p className={styles.price}>{property.price}</p>
          <Link
            to={`/student/detail/${property.id}`}
            state={{ property, allProperties }}
          >
            <button className={styles.viewButton}>View</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
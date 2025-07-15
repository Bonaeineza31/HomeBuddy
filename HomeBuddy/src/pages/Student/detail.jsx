import { useLocation } from 'react-router-dom';
import { FaWifi, FaCouch, FaUserFriends } from 'react-icons/fa';
import { IoBed } from "react-icons/io5";
import Navbar from '../../components/Navbar';
import PropertyCard from '../../components/PropertyCard';
import styles from '../../styles/Home.module.css';
import '../../styles/detail.css';

function Detail() {
  const location = useLocation();
  const property = location.state?.property;
  const allProperties = location.state?.allProperties;

  if (!property || !allProperties) {
    return <p className='unavailable'>Property no longer available!</p>;
  }

  const otherProperties = allProperties.filter(p => p.id !== property.id);

  return (
    <>
      <Navbar/>
      <div className='all-details'> 
        <div className="images">
          <img src={property.mainImage} alt="main pic" className='main'/>
          {property.otherImages.length > 0 && (
            <div className="different-angles">
              {property.otherImages.map((img, index) => (
                <img key={index} src={img} alt={`Angle ${index}`} />
              ))}
            </div>
          )}
        </div>
        <div className="property-description">
          <h2>Description</h2>
          <p>{property.description}</p>
          <div className="attributes">
            {property.wifi === "yes" && (<FaWifi />)}
            {property.furnished === "yes" && (<FaCouch />)}
            {property.availableBeds > 0 && (
              <div className="beds">
                <p>{property.availableBeds}</p>
                <IoBed />
              </div>
            )}
            {property.roommate > 0 && (
              <div className="roommates">
                <p>{property.roommate}</p>
                <FaUserFriends />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.mostviewed}>
        <h1>Other Properties</h1>
        <div className={styles.all}>
          {otherProperties.length === 0 && (
            <p className="unavailable">No other properties available.</p>
          )}
          {otherProperties.map(other => (
            <PropertyCard 
              key={other.id}
              property={other}
              isSaved={false}        
              toggleSave={() => {}}  
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Detail;

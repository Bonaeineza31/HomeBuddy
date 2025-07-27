import React, { useState } from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";
import styles from '../../styles/Contact.module.css';
import Navbar from "../../components/Navbar";

const StudentContact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://homebuddy-yn9v.onrender.com/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Your message has been sent successfully!");
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
      } else {
        const error = await response.json();
        alert(error.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* <header className={styles.header}>
        <h1>Contact Us</h1>
      </header> */}

      <main className={styles.message}>
        <section className={styles.txtpart}>
          <form onSubmit={handleSubmit}>
            <div className={styles.names}>
              <div className={styles.first}>
                <label htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.last}>
                <label htmlFor="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.mail}>
              <div className={styles.email}>
                <label htmlFor="email">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.phone}>
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.textarea}>
              <label htmlFor="message">Your Message</label>
              <textarea 
                id="message" 
                name="message" 
                placeholder="Your message"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className={styles.submit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </section>

        <aside className={styles.address}>
          <div className={styles.loc}>
            <h3>Address</h3>
            <p>KN 5 Avenue <br /> Kigali, Rwanda</p>
          </div>

          <div className={styles.contactinfo}>
            <h3>Our Contacts</h3>
            <p>+123456 <br /> homebuddy@gmail.com</p>
          </div>

          <div className={styles.socials}>
            <h3>Stay Connected</h3>
            <div className={styles.icon}>
              <FaFacebook aria-label="Facebook" />
              <FaInstagram aria-label="Instagram" />
              <FaTiktok aria-label="TikTok" />
              <FaXTwitter aria-label="Twitter" />
            </div>
          </div>
        </aside>
      </main>
    </>
  );
};

export default StudentContact;
import React, { useState } from "react";
import { HiHomeModern } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter, FaTiktok } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import '../../styles/Contact.css';

const StudentContact = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="navigation">
        <div className="nav-top">
          <div className="logopart">
            <HiHomeModern className="logo" aria-label="Homebuddy logo" />
            <p>Homebuddy</p>
          </div>
          <button className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <IoClose size={28} /> : <IoIosMenu size={28} />}
          </button>
        </div>
        <ul className={menuOpen ? "nav-links open" : "nav-links"}>
          <li><Link to="/student" className="nav-link">Home</Link></li>
          <li><Link to="/saved" className="nav-link">Saved</Link></li>
          <li><Link to="/listing" className="nav-link">Listings</Link></li>
          <li><Link to="/contact" className="nav-link">Contact Us</Link></li>
        </ul>
      </nav>

      <header className="header">
        <h1>Contact Us</h1>
      </header>

      <main className="message">
        <section className="txtpart">
          <form>
            <div className="names">
              <div className="first">
                <label htmlFor="firstName">First Name</label>
                <input type="text" id="firstName" name="firstName" placeholder="First name" />
              </div>
              <div className="last">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" id="lastName" name="lastName" placeholder="Last name" />
              </div>
            </div>

            <div className="mail">
              <div className="email">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Email address" />
              </div>
              <div className="phone">
                <label htmlFor="phone">Phone Number</label>
                <input type="tel" id="phone" name="phone" placeholder="Phone number" />
              </div>
            </div>

            <div className="textarea">
              <label htmlFor="message">Your Message</label>
              <textarea id="message" name="message" placeholder="Your message"></textarea>
            </div>

            <button type="submit" className="submit">Send Message</button>
          </form>
        </section>

        <aside className="address">
          <div className="loc">
            <h3>Address</h3>
            <p>KN 5 Avenue <br /> Kigali, Rwanda</p>
          </div>

          <div className="contactinfo">
            <h3>Our Contacts</h3>
            <p>+123456 <br /> homebuddy@gmail.com</p>
          </div>

          <div className="socials">
            <h3>Stay Connected</h3>
            <div className="icon">
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
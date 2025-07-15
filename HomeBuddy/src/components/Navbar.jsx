import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom"; // Use NavLink for active styling
import { HiHomeModern } from "react-icons/hi2";
import { FaUser } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { HiChatBubbleLeftEllipsis } from "react-icons/hi2";
import styles from '../../../HomeBuddy/src/styles/Navbar.module.css';  

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navigation}>
      <div className={styles["nav-container"]}> {/* Container div for nav content */}
        <div className={styles.logopart}>
          <HiHomeModern className={styles.logo} />
          <p>Homebuddy</p>
        </div>

        <button 
          className={styles["menu-icon"]} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <IoClose size={28} /> : <IoIosMenu size={28} />}
        </button>

        <ul className={menuOpen ? `${styles["nav-links"]} ${styles.open}` : styles["nav-links"]}>
          <li>
            <NavLink
              to="/student"
              className={({ isActive }) =>
                isActive ? `${styles["nav-link"]} ${styles.activeLink}` : styles["nav-link"]
              }
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/saved"
              className={({ isActive }) =>
                isActive ? `${styles["nav-link"]} ${styles.activeLink}` : styles["nav-link"]
              }
            >
              Saved
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/listing"
              className={({ isActive }) =>
                isActive ? `${styles["nav-link"]} ${styles.activeLink}` : styles["nav-link"]
              }
            >
              Listings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive ? `${styles["nav-link"]} ${styles.activeLink}` : styles["nav-link"]
              }
            >
              Contact Us
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/be-roommate"
              className={({ isActive }) =>
                isActive ? `${styles["nav-link"]} ${styles.activeLink}` : styles["nav-link"]
              }
            >
              Be a roommate
            </NavLink>
          </li>
          <li>
            <Link to="/chat" className={`${styles["nav-link"]} ${styles["chat-link"]}`}>
              <HiChatBubbleLeftEllipsis size={20} />
              <span>Messages</span>
            </Link>
          </li>
          <li>
            <Link to="/profile" className={`${styles["nav-link"]} ${styles["profile-link"]}`}>
              <FaUser size={16} />
              <span>Profile</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

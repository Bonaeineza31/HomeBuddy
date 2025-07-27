import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiHomeModern } from "react-icons/hi2";
import { FaUser } from "react-icons/fa6";
import { IoIosMenu } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { IoLogOut } from "react-icons/io5"; // Added logout icon
import { MessageSquare } from 'lucide-react';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMessagesClick = (e) => {
    e.preventDefault();
    setMenuOpen(false); // Close mobile menu if open
    navigate('/student/messages'); // Fixed route
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setMenuOpen(false); // Close mobile menu if open
    // Add any logout logic here (clear tokens, etc.)
    navigate('/'); // Redirect to home page
  };

  return (
    <nav className={styles.navigation}>
      <div className={styles["nav-container"]}>
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
              to="/student/listing" 
              className={({ isActive }) =>
                isActive ? `${styles["nav-link"]} ${styles.activeLink}` : styles["nav-link"]
              }
            >
              Listings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/saved" 
              className={({ isActive }) =>
                isActive ? `${styles["nav-link"]} ${styles.activeLink}` : styles["nav-link"]
              }
            >
              Saved
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/contact"
              className={({ isActive }) =>
                isActive ? `${styles["nav-link"]} ${styles.activeLink}` : styles["nav-link"]
              }
            >
              Contact Us
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/student/roommate" 
              className={({ isActive }) =>
                isActive ? `${styles["nav-link"]} ${styles.activeLink}` : styles["nav-link"]
              }
            >
              Be a roommate
            </NavLink>
          </li>
          <li>
            <button 
              onClick={handleMessagesClick}
              className={`${styles["nav-link"]} ${styles["chat-link"]}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <MessageSquare size={18} />
              <span>Messages</span>
            </button>
          </li>
          <li>
            <Link to="/student/profile" className={`${styles["nav-link"]} ${styles["profile-link"]}`}>
              <FaUser size={16} />
              <span>Profile</span>
            </Link>
          </li>
          <li style={{ marginLeft: '100px' }}>
            <button 
              onClick={handleLogoutClick}
              className={`${styles["nav-link"]} ${styles["chat-link"]}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              title="Logout"
            >
              <IoLogOut size={18} />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
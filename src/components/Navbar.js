import React, { useState } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';  // Import the CSS file for Navbar styling

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to toggle mobile menu

  // Toggle the mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  return (
    <nav>
      <div className="navbar-container">
        <div className="navbar-heading">
          <h1>My Website</h1> {/* This is the heading on the left */}
        </div>

        {/* Hamburger Icon */}
        <div className="hamburger-icon" onClick={toggleMobileMenu}>
          <div className={`line ${isMobileMenuOpen ? "open" : ""}`}></div>
          <div className={`line ${isMobileMenuOpen ? "open" : ""}`}></div>
          <div className={`line ${isMobileMenuOpen ? "open" : ""}`}></div>
        </div>

        {/* Navbar Links */}
        <ul className={`navbar-links ${isMobileMenuOpen ? "open" : ""}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/technical">Technical</Link></li>
          <li><Link to="/non-technical">Non-Technical</Link></li>
          <li><Link to="/contact">Contact</Link></li> {/* Added Contact Link */}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

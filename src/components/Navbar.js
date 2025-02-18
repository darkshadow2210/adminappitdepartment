import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { auth } from "../firebase"; // Import Firebase Auth
import { signOut, onAuthStateChanged } from "firebase/auth"; // Firebase sign out and state change functions
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // User is signed in
      } else {
        setIsLoggedIn(false); // User is signed out
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  // Handle sign out
  const handleSignOut = async () => {
    await signOut(auth);
    localStorage.removeItem("isLoggedIn"); // Remove login state from localStorage
    setIsLoggedIn(false); // Update login state
    navigate("/"); // Redirect to home after logging out
  };

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  return (
    <nav>
      <div className="navbar-container">
        <div className="navbar-heading">
          <h1>My Website</h1>
        </div>

        {/* Hamburger Icon for Mobile */}
        <div className="hamburger-icon" onClick={toggleMobileMenu}>
          <div className={`line ${isMobileMenuOpen ? "open" : ""}`}></div>
          <div className={`line ${isMobileMenuOpen ? "open" : ""}`}></div>
          <div className={`line ${isMobileMenuOpen ? "open" : ""}`}></div>
        </div>

        {/* Navbar Links */}
        <ul className={`navbar-links ${isMobileMenuOpen ? "open" : ""}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/contact">Contact</Link></li>

          {/* Conditional Rendering: Show links depending on login state */}
          {isLoggedIn ? (
            <>
              <li><Link to="/technical">Technical</Link></li>
              <li><Link to="/non-technical">Non Technical</Link></li>
              <li><button onClick={handleSignOut}>Sign Out</button></li>
            </>
          ) : (
            <li><Link to="/login">Login</Link></li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

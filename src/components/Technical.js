import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import { auth } from "../firebase"; // Import Firebase Auth
import { onAuthStateChanged } from "firebase/auth"; // Firebase state change listener
import './Technical.css'; // Import the Technical.css file

const Technical = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if the user is logged in
  const navigate = useNavigate(); // Navigate to redirect

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true); // User is logged in
      } else {
        setIsLoggedIn(false); // User is logged out
        navigate("/"); // Redirect to Home if not logged in
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  // If not logged in, the page content will not be rendered due to the redirect in the effect
  if (!isLoggedIn) {
    return null; // Optional: You can return a loading spinner or message here while redirecting
  }

  return (
    <div className="technical-container">
      <h2>Technical</h2>
      <ul>
        <li><Link to="/tech-torque">Tech Torque</Link></li>
        <li><Link to="/tech-debate">Tech Debate</Link></li>
        <li><Link to="/lock-n-key">Lock N Key</Link></li>
        <li><Link to="/canvas">Canvas</Link></li>
      </ul>
    </div>
  );
};

export default Technical;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Home.css';  // Import the Home.css file

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by checking localStorage
    const userLoggedIn = localStorage.getItem("isLoggedIn");
    if (userLoggedIn === "true") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="home-container">
      <img src="path_to_your_image.jpg" alt="Home Banner" />
      <h1>Welcome to the Home Page</h1>

      {isLoggedIn ? (
        <div className="button-container">
          <Link to="/technical">
            <button>Technical</button>
          </Link>
          <Link to="/non-technical">
            <button>Non-Technical</button>
          </Link>
        </div>
      ) : (
        <div className="login-message">
          <p>Please <Link to="/login">login</Link> to access the content.</p>
        </div>
      )}
    </div>
  );
};

export default Home;

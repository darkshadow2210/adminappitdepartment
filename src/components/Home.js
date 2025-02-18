import React from "react";
import { Link } from "react-router-dom";
import './Home.css';  // Import the Home.css file

const Home = () => {
  return (
    <div className="home-container">
      <img src="path_to_your_image.jpg" alt="Home Banner" />
      <h1>Welcome to the Home Page</h1>
      <div className="button-container">
        <Link to="/technical">
          <button>Technical</button>
        </Link>
        <Link to="/non-technical">
          <button>Non-Technical</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

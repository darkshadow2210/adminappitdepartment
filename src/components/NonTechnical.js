import React from "react";
import { Link } from "react-router-dom";
import './Technical.css'; // Import the Technical.css file

const Technical = () => {
  return (
    <div className="technical-container">
      <h2>Technical</h2>
      <ul>
        <li><Link to="/red-light">Red Light, Green Light</Link></li>
        <li><Link to="/whisper-challenge">Whipser Challenge</Link></li>
      </ul>
    </div>
  );
};

export default Technical;

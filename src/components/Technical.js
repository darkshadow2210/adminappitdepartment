import React from "react";
import { Link } from "react-router-dom";
import './Technical.css'; // Import the Technical.css file

const Technical = () => {
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

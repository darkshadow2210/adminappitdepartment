import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory
import { auth } from "../firebase"; // Import Firebase Auth
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase login function

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // To handle login errors
  const navigate = useNavigate(); // Use useNavigate hook

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("isLoggedIn", "true"); // Store login state in localStorage
      navigate("/"); // Redirect to home page on successful login
    } catch (err) {
      setError("Invalid credentials. Please try again."); // Show error on failure
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Login;

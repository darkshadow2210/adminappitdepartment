import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Technical from "./components/Technical";
import NonTechnical from "./components/NonTechnical";
import TechTorque from "./pages/TechTorque";
import TechDebate from "./pages/TechDebate";
import LockNKey from "./pages/LockNKey";
import Canvas from "./pages/Canvas";
import RedLight from "./pages/RedLightGreenLight";
import WhisperChallenge from "./pages/WhisperChallenge";
import Contact from "./components/Contact";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/technical" element={<Technical />} />
        <Route path="/non-technical" element={<NonTechnical />} />
        <Route path="/tech-torque" element={<TechTorque />} />
        <Route path="/tech-debate" element={<TechDebate />} />
        <Route path="/lock-n-key" element={<LockNKey />} />
        <Route path="/canvas" element={<Canvas />} />
        <Route path="/red-light" element={<RedLight />} />
        <Route path="/whisper-challenge" element={<WhisperChallenge />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
};

export default App;

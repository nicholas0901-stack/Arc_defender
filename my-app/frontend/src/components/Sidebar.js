import React from "react";
import { FaTachometerAlt, FaChartLine, FaShieldAlt, FaUserShield, FaCogs } from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="d-flex flex-column bg-dark text-white p-3 vh-100" style={{ width: "250px" }}>
      <h4 className="text-center mb-4 fw-bold">🛡️ Arc Defender</h4>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <a href="/dashboard" className="nav-link text-white">
            <FaTachometerAlt className="me-2" /> Dashboard
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="#" className="nav-link text-white">
            <FaShieldAlt className="me-2" /> Threat Monitor
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="#" className="nav-link text-white">
            <FaChartLine className="me-2" /> Analytics
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="#" className="nav-link text-white">
            <FaUserShield className="me-2" /> User Control
          </a>
        </li>
        <li className="nav-item mb-2">
          <a href="#" className="nav-link text-white">
            <FaCogs className="me-2" /> Settings
          </a>
        </li>
      </ul>
    </div>
  );
}

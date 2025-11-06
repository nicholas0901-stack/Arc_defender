import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaChartLine,
  FaShieldAlt,
  FaUserShield,
  FaCogs,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className="position-fixed top-0 start-0 d-flex flex-column text-white p-3"
      style={{
        width: isExpanded ? "240px" : "80px",
        height: "100vh",
        background: "rgba(15, 15, 35, 0.9)",
        backdropFilter: "blur(12px)",
        borderRight: "1px solid rgba(0,255,255,0.15)",
        boxShadow: "0 0 20px rgba(0,255,255,0.1)",
        transition: "width 0.3s ease-in-out",
        zIndex: 1000,
        overflowX: "hidden",
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo / Header */}
      <div
        className="d-flex align-items-center justify-content-between mb-4"
        style={{ whiteSpace: "nowrap" }}
      >
        <h5
          className="fw-bold mb-0 text-gradient"
          style={{
            fontSize: "1.1rem",
            opacity: isExpanded ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          🛡 Arc Defender
        </h5>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn btn-sm text-info border-0 bg-transparent"
        >
          {isExpanded ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      {/* Menu */}
      <ul className="nav flex-column mt-2">
        {[
          { name: "Dashboard", icon: <FaTachometerAlt />, href: "/dashboard" },
          { name: "Threat Monitor", icon: <FaShieldAlt />, href: "/threat-monitor" },
          { name: "Analytics", icon: <FaChartLine />, href: "/analytics" },
          { name: "User Control", icon: <FaUserShield />, href: "#" },
          { name: "Settings", icon: <FaCogs />, href: "#" },
        ].map((item, idx) => (
          <li key={idx} className="nav-item mb-2">
            <a
              href={item.href}
              className="nav-link d-flex align-items-center text-white py-2 px-2 rounded"
              style={{
                transition: "0.3s",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              <span
                style={{
                  minWidth: "30px",
                  textAlign: "center",
                  fontSize: "1.2rem",
                }}
              >
                {item.icon}
              </span>
              <span
                style={{
                  opacity: isExpanded ? 1 : 0,
                  marginLeft: isExpanded ? "8px" : "0",
                  transition: "opacity 0.3s, margin 0.3s",
                  whiteSpace: "nowrap",
                }}
              >
                {item.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

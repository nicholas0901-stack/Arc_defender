import React, { useEffect, useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

export default function Topbar() {
  const [user, setUser] = useState({ name: "Loading...", email: "" });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/me");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser({ name: "Test111", email: "test111@gmail.com" }); // fallback
      }
    };
    fetchUser();
  }, []);

  return (
    <>
      {/* === TOPBAR === */}
      <div className="d-flex justify-content-between align-items-center bg-white shadow-sm px-4 py-3">
        <h5 className="fw-bold mb-0 text-primary">Dashboard Overview</h5>

        <div className="d-flex align-items-center gap-4">
          {/* 🔔 Notifications Button */}
          <button
            type="button"
            className="btn btn-link text-muted p-0"
            data-bs-toggle="modal"
            data-bs-target="#notificationsModal"
          >
            <FaBell size={22} />
          </button>

          {/* 👤 User Button */}
          <button
            type="button"
            className="btn btn-link text-primary p-0 d-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#userModal"
          >
            <FaUserCircle size={28} className="me-2" />
            <span className="fw-semibold">{user.name}</span>
          </button>
        </div>
      </div>

      {/* === NOTIFICATIONS MODAL === */}
      <div
        className="modal fade"
        id="notificationsModal"
        tabIndex="-1"
        aria-labelledby="notificationsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold" id="notificationsModalLabel">
                Notifications
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">🚨 Intrusion attempt detected from 192.168.1.45</li>
                <li className="list-group-item">✅ Firewall rules updated successfully</li>
                <li className="list-group-item">⚠️ High CPU usage detected on node-02</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* === USER MODAL === */}
      <div
        className="modal fade"
        id="userModal"
        tabIndex="-1"
        aria-labelledby="userModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content rounded-4 shadow">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold" id="userModalLabel">
                User Profile
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center">
              <FaUserCircle size={60} className="text-primary mb-3" />
              <h5 className="fw-bold mb-1">{user.name}</h5>
              <p className="text-muted">{user.email}</p>
              <hr />
              <button className="btn btn-outline-primary w-100 fw-semibold">
                Manage Account
              </button>
              <button className="btn btn-outline-danger w-100 fw-semibold mt-2">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

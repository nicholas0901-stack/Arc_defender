import React, { useEffect, useState } from "react";
import { FaBell, FaUserCircle, FaLock } from "react-icons/fa";

export default function Topbar() {
  const [user, setUser] = useState({ name: "Loading...", email: "" });
  const [showReset, setShowReset] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState(null);

  // 🔁 Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found, redirecting to login...");
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.clear();
          window.location.href = "/login";
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser({ name: "Guest", email: "guest@example.com" });
      }
    };
    fetchUser();
  }, []);

  // 🔐 Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match." });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token)
        return setStatus({ type: "error", message: "You must be logged in." });

      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus({ type: "success", message: "Password updated successfully!" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setShowReset(false);
      } else {
        setStatus({
          type: "error",
          message: data.error || data.message || "Failed to reset password.",
        });
      }
    } catch {
      setStatus({ type: "error", message: "Server error. Try again later." });
    }
  };

  // 🚪 Handle logout
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <>
      {/* 🌌 Immersive Topbar */}
      <div
        className="d-flex justify-content-between align-items-center px-4 py-3 position-sticky top-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(10,10,25,0.8) 0%, rgba(30,30,60,0.6) 50%, rgba(10,10,25,0.8) 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0,255,255,0.2)",
          boxShadow: "0 0 20px rgba(0,255,255,0.15)",
          zIndex: 999,
        }}
      >
        {/* 🌠 Left Title */}
        <h5
          className="fw-bold mb-0 text-gradient"
          style={{
            background: "linear-gradient(90deg,#00ffff,#ff00ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.5px",
          }}
        >
          Dashboard Overview
        </h5>

        {/* 🔔 User Controls */}
        <div className="d-flex align-items-center gap-4">
          {/* Notifications */}
          <button
            type="button"
            className="btn btn-link text-cyan p-0 position-relative"
            data-bs-toggle="modal"
            data-bs-target="#notificationsModal"
            style={{
              color: "#00ffff",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ff00ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#00ffff")}
          >
            <FaBell size={22} />
          </button>

          {/* User */}
          <button
            type="button"
            className="btn btn-link p-0 d-flex align-items-center text-cyan"
            data-bs-toggle="modal"
            data-bs-target="#userModal"
            style={{
              color: "#00ffff",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ff00ff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#00ffff")}
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
          <div
            className="modal-content rounded-4 shadow text-light"
            style={{
              background: "rgba(20,20,40,0.9)",
              border: "1px solid rgba(0,255,255,0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold text-cyan" id="notificationsModalLabel">
                Notifications
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ul className="list-group list-group-flush text-light">
                <li className="list-group-item bg-transparent border-secondary">
                  🚨 Intrusion attempt detected from 192.168.1.45
                </li>
                <li className="list-group-item bg-transparent border-secondary">
                  ✅ Firewall rules updated successfully
                </li>
                <li className="list-group-item bg-transparent border-secondary">
                  ⚠️ High CPU usage detected on node-02
                </li>
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
          <div
            className="modal-content rounded-4 text-light"
            style={{
              background: "rgba(20,20,40,0.9)",
              border: "1px solid rgba(255,0,255,0.2)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold" id="userModalLabel">
                {showReset ? "Reset Password" : "User Profile"}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setShowReset(false);
                  setStatus(null);
                }}
              ></button>
            </div>

            <div className="modal-body text-center">
              {!showReset ? (
                <>
                  <div className="d-flex flex-column align-items-center mb-4 mt-2">
                    <FaUserCircle
                      size={100}
                      style={{
                        color: "#00ffff",
                        textShadow: "0 0 10px rgba(0,255,255,0.5)",
                      }}
                      className="mb-3"
                    />
                    <h5 className="fw-bold mb-1">{user.name}</h5>
                    <p className="text-muted mb-0">{user.email}</p>
                  </div>
                  <hr />
                  <button
                    className="btn w-100 fw-semibold text-white"
                    style={{
                      background:
                        "linear-gradient(90deg, #00ffff, #ff00ff)",
                      border: "none",
                    }}
                    onClick={() => setShowReset(true)}
                  >
                    Manage Account
                  </button>
                  <button
                    className="btn btn-outline-danger w-100 fw-semibold mt-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <form onSubmit={handlePasswordReset} className="text-start">
                  <div className="text-center mb-3">
                    <FaLock
                      size={40}
                      style={{
                        color: "#00ffff",
                        textShadow: "0 0 10px rgba(0,255,255,0.5)",
                      }}
                      className="mb-2"
                    />
                    <h6 className="fw-bold">Reset Your Password</h6>
                  </div>

                  {["currentPassword", "newPassword", "confirmPassword"].map((key, idx) => (
                    <div className="mb-3" key={idx}>
                      <label className="form-label text-light">
                        {key === "currentPassword"
                          ? "Current Password"
                          : key === "newPassword"
                          ? "New Password"
                          : "Confirm New Password"}
                      </label>
                      <input
                        type="password"
                        className="form-control bg-dark text-light border-secondary"
                        value={passwordData[key]}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            [key]: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  ))}

                  {status && (
                    <div
                      className={`alert alert-${
                        status.type === "success" ? "success" : "danger"
                      } py-2`}
                    >
                      {status.message}
                    </div>
                  )}

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowReset(false)}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="btn text-white fw-semibold"
                      style={{
                        background:
                          "linear-gradient(90deg, #00ffff, #ff00ff)",
                        border: "none",
                      }}
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

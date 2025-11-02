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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          console.warn("Unauthorized: clearing session");
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
      if (!token) {
        setStatus({ type: "error", message: "You must be logged in to reset your password." });
        return;
      }

      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Token included
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
    } catch (err) {
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
                <li className="list-group-item">
                  🚨 Intrusion attempt detected from 192.168.1.45
                </li>
                <li className="list-group-item">
                  ✅ Firewall rules updated successfully
                </li>
                <li className="list-group-item">
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
          <div className="modal-content rounded-4 shadow border-0">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold" id="userModalLabel">
                {showReset ? "Reset Password" : "User Profile"}
              </h5>
              <button
                type="button"
                className="btn-close"
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
                  <div className="d-flex flex-column align-items-center justify-content-center text-center mb-4 mt-2">
                    <FaUserCircle size={100} className="text-primary mb-3" />

                    {/* Username */}
                    <h5 className="fw-bold mb-1 text-dark">{user.name}</h5>

                    {/* Email */}
                    <p className="text-muted mb-0">{user.email}</p>
                  </div>
                  <hr />
                  <button
                    className="btn btn-outline-primary w-100 fw-semibold"
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
                    <FaLock size={40} className="text-primary mb-2" />
                    <h6 className="fw-bold">Reset Your Password</h6>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

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
                      className="btn btn-secondary"
                      onClick={() => setShowReset(false)}
                    >
                      Back
                    </button>
                    <button type="submit" className="btn btn-primary fw-semibold">
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

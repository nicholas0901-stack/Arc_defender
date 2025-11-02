import React, { useState } from "react";
import axios from "axios";
import bgImage from "../assets/register-bg.jpg"; // ✅ Local background image

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);
      setMessage(res.data.message || "Registration successful!");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Left Side (Form Section) */}
      <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
        <div
          className="bg-white shadow-lg rounded-4 p-5 p-md-5"
          style={{
            maxWidth: "500px", // 🔹 slightly wider card
            width: "100%",
            border: "1px solid #e9ecef",
            padding: "3rem 3.5rem", // 🔹 increased padding
          }}
        >
          <h2 className="fw-bold mb-3 text-primary text-center" style={{ fontSize: "1.8rem" }}>
            Create an Account
          </h2>
          <p className="text-muted mb-4 text-center" style={{ fontSize: "1rem" }}>
            Join Arc Defender today — it only takes a minute!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                className="form-control form-control-lg" // 🔹 larger inputs
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="form-control form-control-lg"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                className="form-control form-control-lg"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
              style={{ fontSize: "1rem" }}
            >
              Register
            </button>
          </form>

          {message && (
            <div className="alert alert-info text-center mt-4 py-2" role="alert">
              {message}
            </div>
          )}

          <p className="text-center text-muted mt-4 small">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-decoration-none text-primary fw-semibold"
            >
              Log in
            </a>
          </p>
        </div>
      </div>

      {/* Right Side (Image Section) */}
      <div
        className="col-md-6 d-none d-md-block p-0"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>
    </div>
  );
}

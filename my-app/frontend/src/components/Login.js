import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/register-bg.jpg"; // local image

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage("");

  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", form);
    const data = res.data;

    if (res.status === 200 && data.token) {
      // ✅ Store the token for future requests (e.g., password reset)
      localStorage.setItem("token", data.token);

      // (Optional) Store user info too
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful!");

      // ✅ Redirect to Dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      setMessage(data.error || "Login failed.");
    }
  } catch (err) {
    setMessage(err.response?.data?.error || "Invalid credentials.");
  }
};


  return (
    <div className="d-flex min-vh-100">
      {/* Left Side (Form Section) */}
      <div className="col-md-6 d-flex align-items-center justify-content-center bg-light">
        <div
          className="bg-white shadow-lg rounded-4 p-5"
          style={{
            maxWidth: "500px",
            width: "100%",
            border: "1px solid #e9ecef",
            padding: "3rem 3.5rem",
          }}
        >
          <h2 className="fw-bold mb-3 text-primary text-center" style={{ fontSize: "1.8rem" }}>
            Login to Arc Defender
          </h2>
          <p className="text-muted mb-4 text-center" style={{ fontSize: "1rem" }}>
            Welcome back! Please enter your details below.
          </p>

          <form onSubmit={handleSubmit}>
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

            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Your password"
                className="form-control form-control-lg"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="rememberMe"
                />
                <label htmlFor="rememberMe" className="form-check-label small">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="btn btn-link p-0 small text-decoration-none text-primary"
                onClick={() => alert("Forgot Password Clicked!")}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
              style={{ fontSize: "1rem" }}
            >
              Log In
            </button>
          </form>

          {message && (
            <div className="alert alert-info text-center mt-4 py-2" role="alert">
              {message}
            </div>
          )}

          <p className="text-center text-muted mt-4 small">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-decoration-none text-primary fw-semibold"
            >
              Register
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

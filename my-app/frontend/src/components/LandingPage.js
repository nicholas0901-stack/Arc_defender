import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-transparent px-8 py-4">
        <a className="navbar-brand font-bold text-2xl" href="/">MyApp</a>
        <button
          className="btn btn-light ms-auto"
          onClick={() => navigate("/register")}
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center flex-grow text-center px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Welcome to <span className="text-yellow-300">MyApp</span>
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Build, connect, and grow — a simple MERN stack app with registration and login.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="btn btn-outline-light btn-lg shadow-lg hover:scale-105 transition"
        >
          Join Now
        </button>
      </header>

      {/* Features Section */}
      <section className="bg-white text-gray-800 py-16 px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Why Choose <span className="text-indigo-600">MyApp</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: "Fast", desc: "Optimized backend with Express and MongoDB." },
            { title: "Secure", desc: "Data handled safely with modern security practices." },
            { title: "Scalable", desc: "Built for growth — easy to expand and deploy." }
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl shadow-lg bg-gradient-to-br from-indigo-50 to-purple-100 hover:shadow-2xl transition"
            >
              <h3 className="text-2xl font-semibold mb-2 text-indigo-700">
                {feature.title}
              </h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 text-center py-4 text-sm">
        © {new Date().getFullYear()} MyApp — All rights reserved.
      </footer>
    </div>
  );
}

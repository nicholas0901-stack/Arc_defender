import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import toast, { Toaster } from "react-hot-toast";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ThreatMonitor() {
  const [threats, setThreats] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [severityDist, setSeverityDist] = useState({ low: 0, medium: 0, high: 0 });
  const [filterSeverity, setFilterSeverity] = useState("");

  // 🔁 Fetch live threat data
   useEffect(() => {
    let lastTimestamp = null;

    const fetchThreats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/threats");
        const data = res.data;

        if (data.length > 0) {
          // Identify new threats based on timestamp
          const latestThreat = data[data.length - 1];

          // Trigger toast only if it’s a newer event
          if (!lastTimestamp || new Date(latestThreat.timestamp) > new Date(lastTimestamp)) {
            lastTimestamp = latestThreat.timestamp;

            if (latestThreat.severity === "high") {
              toast.error(`⚠️ ${latestThreat.type} detected from ${latestThreat.sourceIP}`, {
                duration: 5000,
                style: {
                  background: "#200",
                  color: "#fff",
                  border: "1px solid #ff005e",
                  boxShadow: "0 0 10px #ff005e",
                },
              });
            }
          }
        }

        setThreats(data);

        // Recalculate severity distribution
        const severity = { low: 0, medium: 0, high: 0 };
        data.forEach((t) => (severity[t.severity] += 1));
        setSeverityDist(severity);

        setTrendData(data.slice(-10));
      } catch (err) {
        console.error("Failed to fetch threats:", err);
      }
    };

    fetchThreats();
    const interval = setInterval(fetchThreats, 5000);
    return () => clearInterval(interval);
  }, []);


  // Chart animations & options
  const trendChartData = {
    labels: trendData.map((t) => new Date(t.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Detected Threats",
        data: trendData.map((t) => t.count),
        borderColor: "#ff005e",
        backgroundColor: "rgba(255,0,94,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "nearest", intersect: false },
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: {
        backgroundColor: "#111",
        titleColor: "#ff005e",
        bodyColor: "#fff",
      },
    },
    animation: { duration: 1200, easing: "easeOutQuart" },
    scales: {
      x: { ticks: { color: "#aaa" }, grid: { color: "#333" } },
      y: { ticks: { color: "#aaa" }, grid: { color: "#333" } },
    },
  };

  // Donut
  const severityChartData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        data: [severityDist.low, severityDist.medium, severityDist.high],
        backgroundColor: ["#00c878", "#ffcc00", "#ff005e"],
        borderWidth: 2,
      },
    ],
  };

  const severityChartOptions = {
    cutout: "70%",
    plugins: { legend: { labels: { color: "#fff", padding: 14 } } },
  };

  // Category Bar
  const categoryChartData = {
    labels: ["Malware", "Phishing", "DDoS", "Ransomware", "Insider"],
    datasets: [
      {
        label: "Occurrences",
        data: [
          threats.filter((t) => t.category === "malware").length,
          threats.filter((t) => t.category === "phishing").length,
          threats.filter((t) => t.category === "ddos").length,
          threats.filter((t) => t.category === "ransomware").length,
          threats.filter((t) => t.category === "insider").length,
        ],
        backgroundColor: [
          "rgba(255,0,94,0.6)",
          "rgba(255,204,0,0.6)",
          "rgba(0,200,120,0.6)",
          "rgba(0,136,255,0.6)",
          "rgba(255,0,255,0.6)",
        ],
        borderColor: "#111",
        borderWidth: 1,
      },
    ],
  };

  const categoryChartOptions = {
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#aaa" }, grid: { color: "#222" } },
      y: { ticks: { color: "#aaa" }, grid: { color: "#222" } },
    },
  };

  return (
    <div className="d-flex text-light position-relative" style={{ overflow: "hidden" }}>
      <Toaster position="top-right" />

      {/* 🌌 Background */}
      <Particles
        className="position-absolute w-100 h-100"
        options={{
          background: { color: "#090919" },
          particles: {
            color: { value: ["#ff005e", "#ffcc00", "#00c878"] },
            move: { enable: true, speed: 0.6 },
            number: { value: 60 },
            size: { value: 2 },
            opacity: { value: 0.25 },
            links: { enable: true, color: "#ff005e", opacity: 0.2 },
          },
        }}
      />

      <Sidebar />

      <div
        className="flex-grow-1 position-relative"
        style={{
          marginLeft: "240px",
          minHeight: "100vh",
          background: "radial-gradient(circle at top left, #090919 0%, #04040a 80%)",
        }}
      >
        <Topbar />

        <div className="container-fluid p-4">
          {/* Title */}
          <motion.h4
            className="fw-bold mb-4 text-center"
            style={{
              background: "linear-gradient(90deg,#ff005e,#ffcc00)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Live Threat Monitoring
          </motion.h4>

          {/* Controls */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: "#00ff99",
                  boxShadow: "0 0 10px #00ff99",
                  animation: "pulse 1.5s infinite",
                  marginRight: "8px",
                }}
              />
              <span className="text-secondary small">Live data updating...</span>
            </div>

            <select
              className="form-select bg-dark text-light"
              style={{ width: "200px" }}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <style>
            {`
              @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.3); opacity: 0.6; }
                100% { transform: scale(1); opacity: 1; }
              }
            `}
          </style>

          {/* Charts */}
          <div className="row g-4">
            <div className="col-lg-6">
              <motion.div
                className="card border-0 p-4 h-100"
                whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(255,0,94,0.3)" }}
                transition={{ type: "spring", stiffness: 200 }}
                style={{
                  background: "rgba(30,30,45,0.5)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <h5 className="fw-bold mb-3 text-light">Threat Activity Over Time</h5>
                <div style={{ height: "300px" }}>
                  <Line data={trendChartData} options={trendChartOptions} />
                </div>
              </motion.div>
            </div>

            <div className="col-lg-6">
              <motion.div
                className="card border-0 p-4 h-100 text-center"
                whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(255,204,0,0.3)" }}
                transition={{ type: "spring", stiffness: 200 }}
                style={{
                  background: "rgba(30,30,45,0.5)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <h5 className="fw-bold mb-3 text-light">Severity Distribution</h5>
                <div style={{ width: "100%", maxWidth: "280px", margin: "0 auto" }}>
                  <Doughnut data={severityChartData} options={severityChartOptions} />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Category Bar */}
          <div className="row mt-4">
            <div className="col-12">
              <motion.div
                className="card border-0 p-4"
                whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(0,200,255,0.3)" }}
                transition={{ type: "spring", stiffness: 200 }}
                style={{
                  background: "rgba(30,30,45,0.5)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <h5 className="fw-bold mb-3 text-light">Threat Categories</h5>
                <div style={{ height: "300px" }}>
                  <Bar data={categoryChartData} options={categoryChartOptions} />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Table */}
          <div className="row mt-4">
            <div className="col-12">
              <motion.div
                className="card border-0 p-4"
                whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(255,0,94,0.15)" }}
                transition={{ type: "spring", stiffness: 200 }}
                style={{
                  background: "rgba(30,30,45,0.5)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <h5 className="fw-bold mb-3 text-light">
                  Recent Threats{" "}
                  <motion.span
                    className="text-info small ms-2"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {threats.length} total
                  </motion.span>
                </h5>
                <div className="table-responsive">
                  <table className="table table-dark table-hover align-middle">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Severity</th>
                        <th>Source IP</th>
                      </tr>
                    </thead>
                    <tbody>
                      {threats.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center text-secondary">
                            No recent threats detected.
                          </td>
                        </tr>
                      ) : (
                        threats
                          .filter((t) => !filterSeverity || t.severity === filterSeverity)
                          .slice(-10)
                          .reverse()
                          .map((t, i) => (
                            <tr key={i}>
                              <td>{new Date(t.timestamp).toLocaleTimeString()}</td>
                              <td>{t.type}</td>
                              <td>{t.category}</td>
                              <td
                                style={{
                                  color:
                                    t.severity === "high"
                                      ? "#ff005e"
                                      : t.severity === "medium"
                                      ? "#ffcc00"
                                      : "#00c878",
                                }}
                              >
                                {t.severity.toUpperCase()}
                              </td>
                              <td>{t.sourceIP}</td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

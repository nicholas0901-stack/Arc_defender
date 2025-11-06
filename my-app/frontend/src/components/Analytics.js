import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Particles from "react-tsparticles";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function Analytics() {
  const [overview, setOverview] = useState({});
  const [trends, setTrends] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [efficiency, setEfficiency] = useState({ efficiency: 0, blocked: 0, total: 0 });

  // 🔁 Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [o, t, a, e] = await Promise.all([
          axios.get("http://localhost:5000/api/analytics/overview"),
          axios.get("http://localhost:5000/api/analytics/trends"),
          axios.get("http://localhost:5000/api/analytics/origins"),
          axios.get("http://localhost:5000/api/analytics/efficiency"),
        ]);
        setOverview(o.data);
        setTrends(t.data);
        setOrigins(a.data);
        setEfficiency(e.data);
      } catch (err) {
        console.error("Analytics fetch failed:", err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Charts
  const trendData = {
    labels: trends.map((t) => t._id),
    datasets: [
      {
        label: "Daily Threats",
        data: trends.map((t) => t.count),
        borderColor: "#00c8ff",
        backgroundColor: "rgba(0,200,255,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const originData = {
    labels: origins.map((o) => o._id),
    datasets: [
      {
        label: "Attack Count",
        data: origins.map((o) => o.count),
        backgroundColor: [
          "#ff005e",
          "#00c878",
          "#ffcc00",
          "#00a2ff",
          "#ff00ff",
          "#ffaa00",
          "#00ff99",
          "#ff6600",
          "#6699ff",
          "#ff3399",
        ],
      },
    ],
  };

  const severityData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [
          overview.highSeverity || 0,
          overview.mediumSeverity || 0,
          overview.lowSeverity || 0,
        ],
        backgroundColor: ["#ff005e", "#ffcc00", "#00c878"],
        borderWidth: 2,
      },
    ],
  };

  // Dynamic color based on efficiency
  const getEfficiencyColor = (val) => {
    if (val > 85) return "#00ff99";
    if (val > 60) return "#ffcc00";
    return "#ff005e";
  };

  return (
    <div className="d-flex text-light position-relative" style={{ overflow: "hidden" }}>
      <Particles
        className="position-absolute w-100 h-100"
        options={{
          background: { color: "#090919" },
          particles: {
            color: { value: ["#00ffff", "#ff00ff"] },
            move: { enable: true, speed: 0.7 },
            number: { value: 50 },
            opacity: { value: 0.3 },
            links: { enable: true, color: "#00ffff", opacity: 0.2 },
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
          {/* ✨ Title */}
          <motion.h4
            className="fw-bold mb-4 text-center"
            style={{
              background: "linear-gradient(90deg,#00c8ff,#ff00ff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            SOC Analytics Dashboard
          </motion.h4>

          {/* ⚙️ SOC Efficiency Section */}
          <motion.div
            className="d-flex justify-content-center align-items-center gap-5 mb-5 flex-wrap"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <div
              className="card text-center p-4 border-0"
              style={{
                background: "rgba(30,30,45,0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.05)",
                width: "280px",
              }}
            >
              <CircularProgressbar
                value={efficiency.efficiency}
                text={`${efficiency.efficiency}%`}
                styles={buildStyles({
                  pathColor: getEfficiencyColor(efficiency.efficiency),
                  textColor: "#fff",
                  trailColor: "rgba(255,255,255,0.1)",
                  textSize: "16px",
                })}
              />
              <h6 className="mt-3 text-info fw-semibold">Detection Efficiency</h6>
              <p className="text-secondary small mb-0">
                {efficiency.blocked} blocked / {efficiency.total} total
              </p>
            </div>

            <motion.div
              className="p-4 rounded-4 text-center"
              style={{
                background: "rgba(20,20,35,0.6)",
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow: "0 0 20px rgba(0,255,255,0.1)",
                width: "280px",
              }}
              animate={{ boxShadow: ["0 0 10px rgba(0,255,255,0.1)", "0 0 30px rgba(0,255,255,0.4)"] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <h6 className="text-light mb-2">SOC Performance Score</h6>
              <h2
                style={{
                  color: getEfficiencyColor(efficiency.efficiency),
                  fontWeight: 700,
                }}
              >
                {efficiency.efficiency > 90
                  ? "Excellent 🟢"
                  : efficiency.efficiency > 70
                  ? "Stable 🟡"
                  : "Critical 🔴"}
              </h2>
            </motion.div>
          </motion.div>

          {/* 📊 Rest of Analytics Content */}
          <div className="row g-4">
            {/* Threat Trend */}
            <div className="col-lg-6">
              <motion.div
                className="card border-0 p-4 h-100"
                style={{
                  background: "rgba(30,30,45,0.5)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h5 className="fw-bold mb-3 text-info">Threat Volume Trend</h5>
                <div style={{ height: "300px" }}>
                  <Line data={trendData} options={{ plugins: { legend: { labels: { color: "#fff" } } } }} />
                </div>
              </motion.div>
            </div>

            {/* Severity Donut */}
            <div className="col-lg-6">
              <motion.div
                className="card border-0 p-4 h-100 text-center"
                style={{
                  background: "rgba(30,30,45,0.5)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h5 className="fw-bold mb-3 text-light">Severity Breakdown</h5>
                <div style={{ width: "100%", maxWidth: "280px", margin: "0 auto" }}>
                  <Doughnut data={severityData} />
                </div>
              </motion.div>
            </div>
          </div>

          {/* Top Attack Origins */}
          <div className="row mt-4">
            <div className="col-12">
              <motion.div
                className="card border-0 p-4"
                style={{
                  background: "rgba(30,30,45,0.5)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <h5 className="fw-bold mb-3 text-light">Top Attack Origins (Source IPs)</h5>
                <div style={{ height: "300px" }}>
                  <Bar data={originData} options={{ plugins: { legend: { display: false } } }} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

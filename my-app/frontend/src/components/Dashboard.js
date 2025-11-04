import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import StatsCard from "./StatsCard";
import { Line, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [systemStatus, setSystemStatus] = useState([]);
  const [networkData, setNetworkData] = useState([]);
  const [sidebarWidth, setSidebarWidth] = useState(240); // 🔹 dynamic sidebar width

  // 🔁 Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard");
        setMetrics(res.data.metrics);
        setSystemStatus(res.data.systemStatus);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      }
    };
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(interval);
  }, []);

  // 🧠 Handle Sidebar Width Changes
  useEffect(() => {
    const sidebar = document.querySelector(".position-fixed");
    if (!sidebar) return;
    const observer = new MutationObserver(() => {
      const width = parseInt(sidebar.style.width) || 240;
      setSidebarWidth(width);
    });
    observer.observe(sidebar, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, []);

  // 🔁 Fetch alerts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/alerts");
        setAlerts(res.data);
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      }
    };
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🔁 Fetch network data
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard/activity");
        setNetworkData(res.data);
      } catch (err) {
        console.error("Failed to fetch network activity:", err);
      }
    };
    fetchNetworkData();
    const interval = setInterval(fetchNetworkData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) return <div className="text-center text-light p-5">Loading...</div>;

  // 📊 Line Chart Data
  const data = {
    labels: networkData.map((d) =>
      new Date(d.date).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })
    ),
    datasets: [
      {
        label: "Detected Intrusions",
        data: networkData.map((d) => d.intrusionsDetected || 0),
        borderColor: "#00ffff",
        backgroundColor: "rgba(0,255,255,0.15)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#fff" } } },
    scales: {
      x: { ticks: { color: "#aaa" }, grid: { color: "#333" } },
      y: { ticks: { color: "#aaa" }, grid: { color: "#333" } },
    },
  };
    // Compute a basic system health metric (higher threats = lower health)
    const total = (metrics.activeThreats || 0) + (metrics.blockedIntrusions || 0);
    const healthScore =
      total > 0
        ? Math.max(0, 100 - (metrics.activeThreats / (total + 1)) * 100)
        : 100;
  // 🍩 Donut Chart
    const donutData = {
      labels: ["Active Threats", "Blocked Intrusions", "Users Online"],
      datasets: [
        {
          label: "System Overview",
          data: [
            metrics.activeThreats || 0,
            metrics.blockedIntrusions || 0,
            metrics.usersOnline || 0,
          ],
          backgroundColor: ["#ff005e", "#00c878", "#ffcc00"],
        borderColor: "rgba(0,0,0,0.3)",
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

      const donutOptions = {
        cutout: "70%",
        plugins: {
          legend: {
            position: "right",
            labels: {
              color: "#fff",
              padding: 12,
              boxWidth: 15,
            },
          },
        },
        layout: {
          padding: { top: 10, bottom: 10 },
        },
      };


        const donutPlugins = [
        {
          id: "centerText",
          afterDraw: (chart) => {
            const { ctx, chartArea } = chart;
            const { width, height, top, bottom } = chartArea;
            const centerY = top + (bottom - top) / 2;

            // Dynamic color by health %
            let color = "#00ffcc";
            if (healthScore < 50) color = "#ff005e";
            else if (healthScore < 80) color = "#ffcc00";

            ctx.save();
            ctx.font = "600 16px Poppins";
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.fillText("System", width / 2, centerY - 10);
            ctx.fillText(`${Math.round(healthScore)}%`, width / 2, centerY + 10);
            ctx.restore();
          },
        },
      ];



  
  return (
    <div className="d-flex text-light position-relative" style={{ overflow: "hidden" }}>
      {/* 🌌 Animated Background */}
      <Particles
        id="tsparticles"
        className="position-absolute w-100 h-100"
        options={{
          background: { color: "#090919" },
          particles: {
            color: { value: ["#00ffff", "#ff00ff", "#0088ff"] },
            move: { enable: true, speed: 0.5 },
            number: { value: 60 },
            size: { value: 2 },
            opacity: { value: 0.25 },
            links: { enable: true, color: "#00ffff", opacity: 0.2 },
          },
        }}
      />

      {/* 🚀 Sliding Sidebar */}
      <Sidebar />

      {/* ⚙️ Main Content Area */}
      <div
        className="flex-grow-1 position-relative"
        style={{
          marginLeft: `${sidebarWidth}px`,
          transition: "margin-left 0.3s ease-in-out",
          minHeight: "100vh",
          background: "radial-gradient(circle at top left, #090919 0%, #04040a 80%)",
        }}
      >
        <Topbar />

        <div className="container-fluid p-4">
          {/* 💎 Stats Cards */}
          <motion.div
            className="row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <StatsCard title="Active Threats" value={metrics.activeThreats} color="#ff005e" />
            <StatsCard title="Blocked Intrusions" value={metrics.blockedIntrusions} color="#00c878" />
            <StatsCard title="System Uptime" value={metrics.systemUptime} color="#00a2ff" />
            <StatsCard title="Users Online" value={metrics.usersOnline} color="#ffcc00" />
          </motion.div>

          {/* 📈 Charts Section */}
          <div className="row mt-4 align-items-stretch">
            {/* Line Chart */}
            <div className="col-md-8 d-flex">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className="card border-0 p-4 flex-fill"
                style={{
                  background: "rgba(30,30,45,0.5)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 0 25px rgba(0,255,255,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <h5 className="fw-bold mb-3 text-info">Network Activity</h5>
                <div style={{ flexGrow: 1 }}>
                  <Line data={data} options={options} />
                </div>
              </motion.div>
            </div>

            {/* Donut Chart */}
              <div className="col-md-4 d-flex">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="card border-0 p-4 flex-fill text-center d-flex flex-column align-items-center justify-content-center"
                  style={{
                    background: "rgba(30,30,45,0.5)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    boxShadow: "0 0 25px rgba(255,0,255,0.05)",
                  }}
                >
                  <h5 className="fw-bold mb-4 text-light">Security Distribution</h5>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "320px",
                      margin: "0 auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Doughnut data={donutData} options={donutOptions} plugins={donutPlugins} />
                  </div>
                </motion.div>
              </div>
            </div>

          {/* 🧠 Alerts & System Status */}
          <div className="row mt-4">
            <div className="col-md-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="card border-0 p-4"
                style={{
                  background: "rgba(30,30,45,0.5)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <h5 className="fw-bold mb-3 text-light">Recent Alerts (Live)</h5>
                <ul className="list-group list-group-flush">
                  {alerts.map((a, i) => (
                    <li
                      key={i}
                      className="list-group-item bg-transparent text-light border-secondary"
                    >
                      {a.severity === "high" && "🔴 "}
                      {a.severity === "medium" && "🟠 "}
                      {a.severity === "low" && "🟢 "}
                      {a.message}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <div className="col-md-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="card border-0 p-4"
                style={{
                  background: "rgba(30,30,45,0.5)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <h5 className="fw-bold mb-3 text-light">System Status</h5>
                <ul className="list-group list-group-flush">
                  {systemStatus.map((s, i) => (
                    <li
                      key={i}
                      className="list-group-item bg-transparent text-light border-secondary"
                    >
                      ✅ {s.component}: {s.status}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-secondary small text-end mt-3">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

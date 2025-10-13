import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import StatsCard from "./StatsCard";
import { Line } from "react-chartjs-2";
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
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [systemStatus, setSystemStatus] = useState([]);
  const [networkData, setNetworkData] = useState([]);

  // 🔁 Fetch dashboard metrics + system status every 10s
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

  // 🔁 Fetch alerts every 5s
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

  // 🔁 Fetch live network activity every 10s
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

 // ✅ ChartJS data — updates when `networkData` changes
const data = {
  labels: networkData.map((d) =>
    new Date(d.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
  ),
  datasets: [
    {
      label: "Detected Intrusions",
      data: networkData.map((d) => d.intrusionsDetected || 0),
      borderColor: "#0d6efd",
      backgroundColor: "rgba(13,110,253,0.3)",
      tension: 0.4,
      fill: true,
    },
  ],
};


  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#fff" } },
    },
    scales: {
      x: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
      y: { ticks: { color: "#ccc" }, grid: { color: "#333" } },
    },
  };

  return (
    <div className="d-flex bg-dark text-light">
      <Sidebar />

      <div className="flex-grow-1" style={{ minHeight: "100vh", backgroundColor: "#121212" }}>
        <Topbar />

        <div className="container-fluid p-4">
          {/* Top metric cards */}
          <div className="row">
            <StatsCard title="Active Threats" value={metrics.activeThreats} color="#dc3545" />
            <StatsCard title="Blocked Intrusions" value={metrics.blockedIntrusions} color="#198754" />
            <StatsCard title="System Uptime" value={metrics.systemUptime} color="#0d6efd" />
            <StatsCard title="Users Online" value={metrics.usersOnline} color="#ffc107" />
          </div>

          {/* Network activity chart */}
          <div className="card shadow-sm border-0 mt-4 p-4" style={{ backgroundColor: "#1e1e1e" }}>
            <h5 className="fw-bold mb-3 text-light">Network Activity</h5>
            <div style={{ height: "350px" }}>
              <Line data={data} options={options} />
            </div>
          </div>

          {/* Alerts and System Status */}
          <div className="row mt-4">
            {/* Recent Alerts */}
            <div className="col-md-6">
              <div className="card shadow border-0 p-4" style={{ backgroundColor: "#1e1e1e" }}>
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
              </div>
            </div>

            {/* System Status */}
            <div className="col-md-6">
              <div className="card shadow border-0 p-4" style={{ backgroundColor: "#1e1e1e" }}>
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
              </div>
            </div>
          </div>

          {/* Last updated indicator */}
          <p className="text-secondary small text-end mt-3">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}

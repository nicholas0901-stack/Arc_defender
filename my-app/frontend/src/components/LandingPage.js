import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import Particles from "react-tsparticles";
import { Shield, Lock, Activity } from "lucide-react";
import DefenseGlobe from "../components/DefenseGlobe";

export default function LandingPage() {
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);

  // 🔗 Connect Wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Please install MetaMask.");
      const [addr] = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(addr);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  // 📊 Mock Web3 stats
  const stats = [
    { label: "Nodes Online", value: "128" },
    { label: "DEF Token Staked", value: "4.2M" },
    { label: "Threats Neutralized", value: "87K" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-b from-[#0a0a1f] via-[#060612] to-[#020208] text-white overflow-hidden">
      {/* 🌌 Particles Background */}
      <Particles
        className="absolute inset-0 -z-10"
        options={{
          background: { color: { value: "#050511" } },
          particles: {
            color: { value: ["#00ffff", "#ff00ff"] },
            move: { enable: true, speed: 0.6 },
            number: { value: 80 },
            opacity: { value: 0.4 },
            size: { value: 2 },
            links: { enable: true, color: "#0088ff", opacity: 0.2 },
          },
        }}
      />

      {/* 🔝 Navbar */}
      <nav className="flex justify-between items-center px-12 py-6 z-10 relative">
        <h1 className="text-3xl font-bold">
          <span className="text-cyan-400">Arc</span>
          <span className="text-fuchsia-400">Defender</span>
        </h1>
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Subscribe
          </button>
        ) : (
          <p className="text-sm text-cyan-300">
            Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </p>
        )}
      </nav>

    {/* 🎯 Hero Section */}
<motion.main
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
  className="relative flex flex-col items-center justify-center text-center px-6 z-10 min-h-[65vh] overflow-hidden"
>
  {/* 🌍 Globe as Background Behind Headline */}
  <div className="absolute top-[0%] left-[7%] -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-[500px] h-[350px] md:h-[420px] opacity-80 pointer-events-none z-0">
    <DefenseGlobe />
  </div>

  {/* Foreground Hero Text */}
  <div className="relative z-10 pt-32">
    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-500 bg-clip-text text-transparent">
      One-stop Access to Cyber Defense
    </h1>
    <p className="text-gray-300 text-lg mt-6 max-w-2xl mx-auto">
      Your decentralized Security Operations Center (dSOC) — powered by AI, blockchain, and real-time threat intelligence.
    </p>

    {/* Node Counter */}
    <p className="text-gray-400 text-sm mt-4">
      {Intl.NumberFormat().format(582119)} active nodes protecting global infrastructure
    </p>
  </div>

  {/* Subheading under globe */}
  <div className="relative z-10 mt-20">
    <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
      Global Defense Network
    </h2>
    <p className="text-gray-300 mt-2 max-w-xl text-sm md:text-base mx-auto">
      Real-time AI-driven detection across decentralized Arc Defender nodes worldwide.
    </p>
  </div>

  {/* Action Buttons */}
  <div className="flex gap-6 mt-16 relative z-10">
    <button
      onClick={() => navigate("/register")}
      className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:shadow-cyan-400/30 transition-all hover:scale-105"
    >
      Join the Defense
    </button>
    <button
      onClick={() => navigate("/login")}
      className="border border-cyan-400 px-8 py-3 rounded-full text-lg font-semibold text-cyan-300 hover:bg-cyan-500/10 hover:scale-105 transition-all"
    >
      View Live SOC
    </button>
  </div>
</motion.main>

     




      {/* 📈 On-chain Stats */}
      <section className="py-12 bg-[#0c0c19] border-t border-gray-800">
        <div className="flex flex-wrap justify-center gap-8 max-w-5xl mx-auto">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              className="bg-gradient-to-br from-[#141428] to-[#0b0b16] p-6 rounded-xl border border-gray-800 w-64 text-center"
            >
              <p className="text-3xl font-bold text-cyan-400">{s.value}</p>
              <p className="text-gray-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💡 Capabilities */}
      <section className="py-20 px-8 bg-[#0f0f1a] border-t border-gray-800 z-10 relative">
        <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Arc Defender Capabilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              icon: <Activity className="text-cyan-400 w-10 h-10 mb-3" />,
              title: "Live Network Defense",
              desc: "AI monitors intrusion patterns and anomalies in milliseconds.",
            },
            {
              icon: <Lock className="text-fuchsia-400 w-10 h-10 mb-3" />,
              title: "Zero-Trust Security",
              desc: "Blockchain-verified identity ensures airtight access control.",
            },
            {
              icon: <Shield className="text-blue-400 w-10 h-10 mb-3" />,
              title: "Autonomous SOC",
              desc: "Self-learning defense powered by adaptive machine intelligence.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-[#141428] to-[#0b0b16] border border-gray-800 hover:shadow-lg hover:shadow-cyan-500/20 transition-all text-center"
            >
              {f.icon}
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 💼 Investor Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="py-24 text-center bg-gradient-to-b from-[#0b0b1a] to-[#020208]"
      >
        <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-400">
          Invest in the Future of Cyber Defense
        </h2>
        <p className="max-w-2xl mx-auto text-gray-300 mb-10">
          Arc Defender merges AI and Web3 to create the first decentralized Security Operations Network.
          Join early backers building trustless, autonomous protection for global systems.
        </p>
        <button
          className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 px-10 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform"
          onClick={() => window.open('https://your-pitchdeck-link.com')}
        >
          View Pitch Deck 📄
        </button>
      </motion.section>

      {/* ⚓ Footer */}
      <footer className="bg-[#06060c] border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Arc Defender — Web3-Powered Cybersecurity
      </footer>
    </div>
  );
}

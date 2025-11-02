import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = "SECRET_KEY"; // ⚠️ Move to .env in production

// Middleware: verify JWT token
const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(404).json({ error: "User not found" });
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful!",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Reset Password (Protected)
router.post("/reset-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Missing password fields" });
    }

    const user = req.user;

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get current user info (protected)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    if (!req.user)
      return res.status(404).json({ error: "User not found" });

    res.json({
      name: req.user.name,
      email: req.user.email,
    });
  } catch (err) {
    console.error("Failed to get user:", err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;

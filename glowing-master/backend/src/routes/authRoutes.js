const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { db, nextId } = require("../config/db");

const router = express.Router();

const signToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await db.read();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const existing = db.data.users.find((user) => user.email === normalizedEmail);
    if (existing) return res.status(409).json({ message: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: nextId("users"),
      name: name.trim(),
      email: normalizedEmail,
      password_hash: passwordHash,
      role: "customer",
      created_at: new Date().toISOString()
    };
    db.data.users.push(user);
    await db.write();

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, created_at: user.created_at }
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    await db.read();

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = db.data.users.find((savedUser) => savedUser.email === email.toLowerCase());
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;

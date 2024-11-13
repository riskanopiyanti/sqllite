// index.js
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = "your_secret_key";

// Endpoint Registrasi
app.post("/register", async (req, res) => {
  const { username, password, confirmPassword, email } = req.body;

  // Validasi input
  if (!username || !password || !confirmPassword || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: "Password and confirm password do not match" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Query untuk memasukkan user baru
  const query =
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)";
  db.query(query, [username, hashedPassword, email], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(201).json({ message: "User registered successfully" });
  });
});

// Endpoint Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validasi input
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Query untuk mendapatkan user berdasarkan username
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = results[0];

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Buat token JWT
    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  });
});

// Mulai server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

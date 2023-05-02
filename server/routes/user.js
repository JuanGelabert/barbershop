const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  try {
    const { name, lastName, email, password, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const user = new User({ name, lastName, email, password, phoneNumber });
    await user.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Authenticate a user
router.post("/login", (req, res, next) => {
  passport.authenticate("login", { session: false }, async (error, user) => {
    try {
      if (error || !user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        // Generate a signed JWT token and send it in the response
        const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
        res.status(200).json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = router;

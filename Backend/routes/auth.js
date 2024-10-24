const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Visitor = require('../models/visitor');

// Test route to add a user
router.post('/test-create-user', async (req, res) => {
  try {
    // Create a new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password, // Make sure the password hashing works here
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Optionally track registration (this could be useful for analytics)
    const visitorData = new Visitor({
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      browser: req.headers['user-agent'],
      deviceType: req.body.deviceType || 'Unknown', // Optional device type tracking
      navigationHistory: 'User Registration', // Track the registration path
      userId: newUser._id, // Link to newly created user
    });
    await visitorData.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT (JSON Web Token)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Track login event (save in visitor schema)
    const loginEvent = new Visitor({
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      browser: req.headers['user-agent'], // Track browser info from headers
      navigationHistory: 'User Login', // Track that this event is login
      userId: user._id, // Link to logged-in user
    });
    await loginEvent.save(); // Save the visitor/login data to MongoDB

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Optional route to track anonymous visitors
router.post('/track-visitor', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const { browser, deviceType, timeSpent, totalClicks, navigationHistory } = req.body;

    // Check if the visitor with this IP already exists
    let visitor = await Visitor.findOne({ ip: ip });

    if (visitor) {
      // If visitor exists, update the totalClicks, timeSpent, and other fields
      visitor.totalClicks += totalClicks;
      visitor.timeSpent += timeSpent;
      visitor.navigationHistory = navigationHistory; // You can append or replace this, depending on the requirement
    } else {
      // If visitor does not exist, create a new visitor entry
      visitor = new Visitor({
        ip: ip,
        browser: browser,
        deviceType: deviceType,
        timeSpent: timeSpent,
        totalClicks: totalClicks,
        navigationHistory: navigationHistory,
      });
    }

    // Save the visitor data (either updated or new)
    await visitor.save();

    res.status(200).json({ message: 'Visitor data saved successfully' });
  } catch (error) {
    console.error('Error saving visitor data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;

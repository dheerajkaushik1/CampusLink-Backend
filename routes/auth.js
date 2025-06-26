const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

// 📌 Register Route (No Hashing)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, year, isAdmin } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Save plain password (⚠️ not secure, for dev use only)
    user = new User({
      name,
      email,
      password,
      year,
      isAdmin: isAdmin || false,
    });

    await user.save();

    // Generate JWT
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// 📌 Login Route (No password hash check)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist' });
    }

    // Direct compare plain password
    if (user.password !== password) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// 📌 Get logged-in user data (for chat, admin check, etc.)
router.post('/getuser', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

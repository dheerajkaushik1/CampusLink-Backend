const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');

//Register Route
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, year } = req.body;

        //check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        //Save user
        user = new User({
            name, email, password, year
        })
        await user.save();

        //generate token 
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

//Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User does not exist' });
        }

        //comparing password
        if (user.password !== password) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        //generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
});


// Get logged-in user data (used in chat for getting year)
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

module.exports = router;
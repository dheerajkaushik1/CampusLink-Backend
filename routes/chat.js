const express = require('express');
const router = express.Router();
const ChatMessage = require('../models/ChatMessage');
const fetchUser = require('../middleware/fetchUser');
const User = require('../models/User');

// ✅ Get messages for the logged-in user's year
router.get('/', fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.year) {
      return res.status(400).json({ msg: 'User year not found' });
    }

    const messages = await ChatMessage.find({ year: user.year }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// ✅ Post a new message to the user's year
router.post('/', fetchUser, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ msg: 'Message cannot be empty' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const newMessage = new ChatMessage({
      year: user.year,
      text,
      user: req.user.id,
      name: user.name,
    });

    await newMessage.save();
    res.json(newMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Delete a message by ID
router.delete('/:id', fetchUser, async (req, res) => {
  try {
    const message = await ChatMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    // Check if the logged-in user is the owner
    if (message.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await message.deleteOne();
    res.json({ msg: 'Message deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;

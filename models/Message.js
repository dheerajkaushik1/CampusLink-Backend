const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  year: {
    type: String, // Example: "1st", "2nd", etc.
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', MessageSchema);
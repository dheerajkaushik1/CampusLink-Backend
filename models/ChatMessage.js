const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: 'Anonymous'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);

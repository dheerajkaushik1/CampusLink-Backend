require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Sample Route
app.get('/', (req, res) => {
  res.send('🌐 CampusLink Backend is live');
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/notes', require('./routes/notes')); // includes /uploadnotes and /getnotes

// Static File Serving (for notices only)
app.use('/uploads/notices', express.static(path.join(__dirname, 'uploads/notices')));

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

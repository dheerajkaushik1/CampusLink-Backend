const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret';
const User = require('../models/User');

const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send({ error: 'Please authenticate using a valid token' });

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data;

    // Fetch user to get name (optional)
    const user = await User.findById(req.user.id).select('name');
    req.user.name = user.name;

    next();
  } catch (error) {
    res.status(401).send({ error: 'Invalid Token' });
  }
};

module.exports = fetchUser;

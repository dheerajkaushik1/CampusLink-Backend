// middleware/isAdmin.js
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
  } catch (err) {
    console.error('❌ Admin check error:', err.message);
    res.status(500).json({ message: 'Server error during admin check' });
  }
};

module.exports = isAdmin;

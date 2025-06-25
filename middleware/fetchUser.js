const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
  const token = req.header('auth-token');
  console.log('🔐 Incoming token:', token);  // DEBUG

  if (!token) {
    return res.status(401).json({ msg: 'No token provided' });
  }

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Verified token user:', data);  // DEBUG
    req.user = data;
    next();
  } catch (err) {
    console.error('❌ JWT Verification Error:', err.message);
    return res.status(401).json({ msg: 'Access Denied: Invalid token' });
  }
};

module.exports = fetchUser;

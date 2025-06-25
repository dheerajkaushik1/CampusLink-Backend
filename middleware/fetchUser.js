const jwt = require('jsonwebtoken');

const fetchUser = (req, res, next) => {
    //get token from header
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).json({error: "Please authenticate using a valid token"});
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();

    } catch (err) {
         res.status(401).json({ msg: "Access Denied: Invalid token" });
    }
}

module.exports = fetchUser;
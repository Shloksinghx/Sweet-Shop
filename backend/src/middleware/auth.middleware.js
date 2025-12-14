const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const bearer = token.split(' ')[1]; // Bearer <token>
        if (!bearer) {
            return res.status(401).json({ error: 'Access denied' });
        }
        const verified = jwt.verify(bearer, process.env.JWT_SECRET || 'secret');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: 'Require Admin Role' });
    }
};

module.exports = { verifyToken, isAdmin };

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    let authHeader = req.headers.authorization || req.headers.Authorization;

    // Check if Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decodedToken;
        console.log("The decoded user is: ", req.user);
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token." });
    }
};

module.exports = verifyToken;

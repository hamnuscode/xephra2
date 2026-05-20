// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//     const token = req.cookies.token || req.header("Authorization")?.split(" ")[1]; // Get token from cookies OR headers

//     if (!token) {
//         return res.status(401).json({ error: "Authorization denied. No token provided." });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ error: "Invalid or expired token" });
//     }
// };


// Working For Payment Process(3 june)
const jwt = require("jsonwebtoken");

// Middleware to authenticate any logged-in user
const authenticateUser = (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Authorization denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "jwt expired" });
        }
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

// Middleware to authenticate only admin users
const authenticateAdmin = (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Authorization denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "admin") {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "jwt expired" });
        }
        res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = {
    authenticateUser,
    authenticateAdmin
};

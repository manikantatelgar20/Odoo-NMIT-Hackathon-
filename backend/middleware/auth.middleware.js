const jwt = require("jsonwebtoken");


function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;


    // No Authorization header
    if (!authHeader) {

        return res.status(401).json({
            success: false,
            message: "Authentication required."
        });

    }


    // Expected format:
    // Authorization: Bearer TOKEN

    const parts = authHeader.split(" ");


    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer" ||
        !parts[1]
    ) {

        return res.status(401).json({
            success: false,
            message: "Invalid authorization format."
        });

    }


    const token = parts[1];


    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // Store decoded JWT information
        // for the next route

        req.user = decoded;


        next();

    }
    catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token."
        });

    }

}


module.exports = authenticateToken;
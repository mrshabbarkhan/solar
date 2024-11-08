const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user information from the database (excluding password)
            const user = await User.findById(decoded.id).select('-password');
            
            // If user doesn't exist, return 401 Unauthorized
            if (!user) {
                res.status(401);
                throw new Error("Not authorized, user not found");
            }

            // Attach the user to the request object
            req.user = user;
            
            // Proceed to the next middleware/route handler
            next();
        } catch (error) {
            // If token is invalid or verification fails, return 401 Unauthorized
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        // If no token is provided in the headers, return 401 Unauthorized
        res.status(401);
        throw new Error('Not authorized, no token provided');
    }
});

module.exports = { protect };

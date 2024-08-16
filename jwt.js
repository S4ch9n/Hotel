// Importing the 'jsonwebtoken' module to handle JWT creation and verification
const jwt = require('jsonwebtoken');

// JWT authentication middleware to check and verify the token.
// This middleware can be applied to any route that requires authentication.
const jwtAuthMiddleware = (req, res, next) => {
    //first check request header has authorization or not
    const authorization = req.headers.authorization
    if(!authorization) return res.status(401).json({ error : 'Token not found'})

    // Extract the JWT token from the 'Authorization' header
    // The token usually comes in the format 'Bearer <token>', so we split it to get the token
    const token = req.headers.authorization.split(' ')[1];

    // If there's no token provided, return a 401 Unauthorized error response
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        // Verify the JWT token using the secret stored in environment variables
        // If the token is valid, jwt.verify returns the decoded payload (i.e., the user data)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        // This allows subsequent middleware or routes to access the user data
        req.user = decoded;

        // Call the next middleware or route handler in the stack
        next();
    } catch (error) {
        // If the token is invalid, return a 401 Unauthorized error response
        res.status(401).json({
            error: 'Invalid token' // Corrected the spelling mistake
        });
    }
};

// Function to generate a new JWT token
// This function will be called when a user successfully authenticates (e.g., logs in)
const generateToken = (userData) => {
    // Generate and return a new JWT token using the user's data
    // The token is signed with the secret stored in environment variables
    return jwt.sign(userData, process.env.JWT_SECRET );
};

// Exporting the middleware and token generation function
// These can be used in other parts of the application
module.exports = { jwtAuthMiddleware, generateToken };

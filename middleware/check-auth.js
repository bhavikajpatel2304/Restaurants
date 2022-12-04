const jwt = require('jsonwebtoken');
const Response = require("../utils/response");
const ResponseCode = require("../utils/code");
const {isUserSessionActive} = require("../middleware/check-session")

// This function will be used as middleware in all the APIs that require authentication
module.exports = async (req, res, next) => {

    // Check if token is active
    const header = req.get('Authorization');

    let token;

    // Sending error response if no Authorization header found
    if (!header) return Response.error(res, ResponseCode.UNAUTHORIZED_ACCESS, "Unauthorized access!");

    else token = header.split(' ')[1];

    // Sending error response if Authorization header is not in proper format
    if (!token) return Response.error(res, ResponseCode.UNAUTHORIZED_ACCESS, "Token format invalid!");

    let decodedToken;

    try {

        // Verifying jwt token using secret-key
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    } catch (err) {

        // Sending error response if token is not verified
        return Response.error(res, ResponseCode.UNAUTHORIZED_ACCESS, "Token invalid!");
    }

    // Sending error response if token is expired
    if (!decodedToken) return Response.error(res, ResponseCode.UNAUTHORIZED_ACCESS, "Token expired!");

    // Checking user session is active or not
    // If active => proceed further, else => unauthorized
    const userSession = await isUserSessionActive(decodedToken);

    // Sending error response if session is not active    
    if (!userSession) return Response.error(res, ResponseCode.UNAUTHORIZED_ACCESS, "Session inactive!");

    // Attaching session_id from decoded token to request object
    req.session_id = decodedToken.session_id;

    next();
}
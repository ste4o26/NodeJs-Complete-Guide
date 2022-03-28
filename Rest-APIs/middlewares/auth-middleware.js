const jwtUtil = require('../utils/jwt-util');
const { getErrorResponse } = require('../utils/validation-util');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) throw getErrorResponse(401, 'Not authenticated!');

    const jwtToken = authHeader.split(' ')[1];
    const decodedToken = jwtUtil.decodeToken(jwtToken);
    req.userId = decodedToken.userId;
    next();
}
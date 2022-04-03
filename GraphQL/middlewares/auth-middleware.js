const jwtUtil = require('../utils/jwt-util');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }

    let decodedToken;
    const jwtToken = authHeader.split(' ')[1];
    try {
        decodedToken = jwtUtil.decodeToken(jwtToken);
    } catch(err) {
        req.isAuth = false;
        return next();
    }

    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
}
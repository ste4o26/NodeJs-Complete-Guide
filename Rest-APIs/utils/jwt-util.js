const jwt = require('jsonwebtoken');
const { getErrorResponse } = require('../utils/validation-util');

const SECRET_KEY = 'topsecret'

exports.decodeToken = (token) => {
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, SECRET_KEY);
    } catch (err) {
        if (!err.status) throw getErrorResponse(500, 'There is a problem on our side. We are working on it!');
        throw err;
    }

    if (!decodedToken) throw getErrorResponse(401, 'Not Authenticated!');

    return decodedToken;
}

exports.signTokenFor = (user) => {
    return jwt.sign({
        email: user.email,
        userId: user._id.toString()
    }, SECRET_KEY, { expiresIn: '1h' });
}
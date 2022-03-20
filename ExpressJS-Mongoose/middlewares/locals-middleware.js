const Role = require('../models/role');

module.exports = (request, response, next) => {
    response.locals.isLoggedIn = request.session.isLoggedIn;
    response.locals.csrfToken = request.csrfToken();

    response.locals.isAdmin = false;
    if (request.session.user) {
        response.locals.isAdmin = request.session.user.role === Role.ADMIN;
    }

    next();
}
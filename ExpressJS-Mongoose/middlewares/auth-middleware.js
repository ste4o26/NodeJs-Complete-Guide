const Role = require('../models/role');

exports.isAuthenticated = (request, response, next) => {
    if (!request.session.isLoggedIn) return response.redirect('/login');
    next();
}

exports.isAuthorizedRole = (request, response, next) => {
    if(request.session.user.role !== Role.ADMIN) return response.redirect('/');
    next();
}
// const User = require('../models/user');
const userController = require('./user-controller');

exports.getLogin = (request, response, next) => {
    if (request.session.isLoggedIn) return response.redirect('/');

    response.render('auth/login');
}

exports.postLogin = (request, response, next) => {
    const userData = { ...request.body };

    userController
        .fetchByUsername(userData.username)
        .then(user => {
            if (user.password !== userData.password) throw new Error('Invalid username or password!');
            request.session.user = user;
            request.session.isLoggedIn = true;
            response.redirect('/');
        });
}

exports.getLogout = (request, response, next) => {
    console.log(request.session);
    request.session.destroy();
    response.redirect('/login');
}
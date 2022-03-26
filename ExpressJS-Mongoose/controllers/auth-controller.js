const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const Role = require('../models/role');
const validator = require('express-validator');
const errorController = require('./error-controller');


const transporter = nodemailer
    .createTransport(sendgridTransport({
        auth: { api_key: 'Your API key' }
    }))

exports.getLogin = (request, response, next) => {
    response.render('auth/login', {
        oldInput: { username: '' }
    });
}

exports.postLogin = (request, response, next) => {
    const errors = validator.validationResult(request);
    const userData = { ...request.body };

    if (!errors.isEmpty()) {
        return response
            .status(422)
            .render('auth/login', {
                errorMessage: errors.array()[0].msg,
                oldInput: { username: userData.username }
            });
    }

    User
        .findOne({ username: userData.username })
        .then(user => {
            if (!user) {
                return response
                    .status(422)
                    .render('auth/login', {
                        errorMessage: 'Invalid username or password!',
                        oldInput: { username: userData.username }
                    });
            }

            return bcrypt
                .compare(userData.password, user.password)
                .then(isMatching => {
                    if (!isMatching) {
                        return response
                            .status(422)
                            .render('auth/login', {
                                errorMessage: 'Invalid username or password!',
                                oldInput: { username: userData.username }
                            });
                    }

                    request.session.user = user;
                    request.session.isLoggedIn = true;
                    return response.redirect('/');
                })
                .catch(error => next(errorController.getError(error.message, 500)));
        })
        .catch(error => next(errorController.getError(error.message, 500)));
}

exports.getLogout = (request, response, next) => {
    request.session.destroy();
    response.redirect('/login');
}

exports.getRegister = (request, response, next) => {
    response.render('auth/register', {
        oldInput: {
            username: '',
            email: ''
        }
    });
}

exports.postRegister = (request, response, next) => {
    const errors = validator.validationResult(request);
    const userData = { ...request.body };

    if (!errors.isEmpty()) {
        return response
            .status(422)
            .render('auth/register', {
                errorMessage: errors.array()[0].msg,
                oldInput: {
                    username: userData.username,
                    email: userData.email
                }
            })
    }

    let userRole = Role.USER;
    User
        .countDocuments({})
        .then(documentsCount => {
            if (documentsCount <= 0) userRole = Role.ADMIN;

            return bcrypt
                .hash(userData.password, 12)
                .then(hashedPassword => {
                    return new User({
                        username: userData.username,
                        email: userData.email,
                        password: hashedPassword,
                        role: userRole
                    });
                })
                .then(user => user.save())
                .then(user => {
                    response.redirect('/login');
                    return transporter.sendMail({
                        to: user.email,
                        from: 'anime.luxurity@gmail.com',
                        subject: 'Registration completed.',
                        html: `<h1>Successfull registration ${user.username}</h1>`
                    });
                })
                .catch(error => next(errorController.getError(error.message, 500)));
        })
        .catch(error => next(errorController.getError(error.message, 500)));
}

exports.getResetPassword = (request, response, next) => {
    response.render('auth/reset-password', {
        errorMessage: request.flash('authError'),
        oldInput: { email: '' }
    });
}

exports.postResetPassword = (request, response, next) => {
    const errors = validator.validationResult(request);
    if (!errors.isEmpty()) {
        return response.render('auth/reset-password', {
            errorMessage: errors.array()[0].msg,
            oldInput: { email: request.body.email }
        });
    }

    crypto.randomBytes(32, (error, buffer) => {
        if (error) {
            request.flash('serverError', error);
            return response.redirect('/internal-server-error');
        }

        const resetToken = buffer.toString('hex');
        User
            .findOne({ email: request.body.email })
            .then(user => {
                if (!user) {
                    request.flash('authError', 'No existing user with this email!');
                    return response.render('/reset-password');
                }

                user.resetToken = resetToken;
                user.resetTokenExpiration = Date.now() + 3600000;

                return user
                    .save()
                    .then(user => {
                        response.redirect('/login');

                        return transporter.sendMail({
                            to: user.email,
                            from: 'anime.luxurity@gmail.com',
                            subject: 'Reset password requested.',
                            html: `<p>Click ` +
                                `<a href="http://localhost:3000/new-password/${resetToken}">HERE</a> ` +
                                `to reset your password.</p>`
                        });
                    })
                    .catch(error => next(errorController.getError(error.message, 500)));
            })
            .catch(error => next(errorController.getError(error.message, 500)));
    })
}

exports.getNewPassword = (request, response, next) => {
    const token = request.params.resetToken;

    User
        .findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                request.flash('authError', 'Invalid reset token!');
                return response.redirect('/login');
            };

            return response.render('auth/new-password', {
                userId: user._id.toString(),
                resetToken: token,
                errorMessage: request.flash('authError')
            });
        })
        .catch(error => next(errorController.getError(error.message, 500)));
}

exports.postNewPassword = (request, response, next) => {
    const userData = { ...request.body };
    const errors = validator.validationResult(request);

    if (!errors.isEmpty()) {
        request.flash('authError', errors.array()[0].msg);
        return response.redirect(`/new-password/${userData.resetToken}`);
    }

    let updatedUser;
    User
        .findOne({
            _id: userData.userId,
            resetToken: userData.resetToken,
            resetTokenExpiration: { $gt: Date.now() }
        })
        .then(user => {
            updatedUser = user;
            return bcrypt.hash(userData.password, 12);
        })
        .then(hashedPassword => {
            console.log(updatedUser)
            updatedUser.password = hashedPassword;
            updatedUser.resetToken = undefined;
            updatedUser.resetTokenExpiration = undefined;

            return updatedUser.save();
        })
        .then(user => {
            response.redirect('/login');
            return transporter.sendMail({
                to: user.email,
                from: 'anime.luxurity@gmail.com',
                subject: 'Resseting password completed.',
                html: `<h1>You have successfully reset your password.</h1>`
            });
        })
        .catch(error => next(errorController.getError(error.message, 500)));
}
const bcrypt = require('bcryptjs');
const { isValidUser, getErrorResponse } = require('../utils/validation-util');
const jwtUtil = require('../utils/jwt-util');
const User = require('../models/user');

exports.postRegister = (req, res, next) => {
    if (!isValidUser(req))
        throw getErrorResponse(422, 'Invalid user input!', req);

    const userData = { ...req.body };

    bcrypt
        .hash(userData.password, 12)
        .then(hashedPassword => {
            const user = new User({
                name: userData.name,
                email: userData.email,
                password: hashedPassword
            });

            return user.save();
        })
        .then(user => {
            return res
                .status(201)
                .json({ message: 'Registration successfull.', userId: user._id });
        })
        .catch(err => {
            if (!err.status) return next(getErrorResponse(500, err.message))
            next(err);
        });
}

exports.postLogin = (req, res, next) => {
    const userData = { ...req.body };
    let fetchedUser;

    if (!isValidUser(req))
        throw getErrorResponse(422, 'Invalid user input!', req);

    User
        .findOne({ email: userData.email })
        .then(user => {
            if (!user)
                throw getErrorResponse(404, 'Invalid email or password!');

            fetchedUser = user;
            return bcrypt.compare(userData.password, user.password);
        })
        .then(doPasswordsMatch => {
            if (!doPasswordsMatch)
                throw getErrorResponse(404, 'Invalid email or password!');

            return jwtUtil.signTokenFor(fetchedUser);
        })
        .then(jwtToken => {
            return res
                .status(200)
                .json({
                    token: jwtToken,
                    userId: fetchedUser._id.toString()
                });
        })
        .catch(err => {
            if (!err.status) return next(getErrorResponse(500, err.message));
            next(err);
        });
}


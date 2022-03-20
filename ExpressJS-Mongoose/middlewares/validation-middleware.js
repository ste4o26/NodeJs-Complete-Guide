const validator = require('express-validator');
const User = require('../models/user');

exports.registerValidator = [
    validator
        .check('username', 'Username must be at least 5 characters and alphanumeric')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
        .custom((username, { req }) => {
            return User
                .findOne({ username: username })
                .then(user => {
                    if (user) return Promise.reject('Username is already taken!');
                });
        }),

    validator
        .check('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Ivalid email format!')
        .custom((email, { req }) => {
            return User
                .findOne({ email: email })
                .then(user => {
                    if (user) return Promise.reject('Email is already taken!');
                });
        }),

    validator.check('password', 'Password must be at least 5 characters!')
        .isLength({ min: 5 })
        .trim(),

    validator.check('confirmPassword')
        .isLength({ min: 5 })
        .trim()
        .withMessage('Password confirmation must be at least 5 characters!')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Passwords doesn`t match!');
            }

            return true;
        })
];


exports.loginValidator = [
    validator
        .check('username', 'Username must be at least 5 characters and alphanumeric!')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim(),

    validator
        .check('password', 'Password must be at least 5 characters!')
        .isLength({ min: 5 })
        .trim()
];

exports.newPasswordValidator = [
    validator.check('password', 'Password must be at least 5 character!')
        .isLength({ min: 5 })
        .trim(),

    validator.check('confirmPassword')
        .isLength({ min: 5 })
        .trim()
        .withMessage('Password confirmation must be at least 5 characters!')
        .custom((confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                throw new Error('Passwords doesn`t match!');
            }

            return true;
        })
];

exports.resetPasswordValidator = validator
    .check('email')
    .isEmail()
    .withMessage('Ivalid email format!');

exports.productValidator = [
    validator
        .check('name', 'Name must be at least 3 characters')
        .isLength({ min: 3 })
        .trim(),
    validator
        .check('imageUrl', 'Image url must be a valid URL!')
        .isURL()
        .trim(),
    validator
        .check('price', 'Price must be a positive number!')
        .isNumeric(),
    validator
        .check('description', 'Description must be at least 10 characters and alphabettical')
        .isLength({ min: 10 })
        .trim()
];
const validator = require('express-validator');
const User = require('../models/user');

exports.postValidation = [
    validator
        .check('title')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Title must be at least 5 characters long!'),

    validator
        .check('content')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Content must be at least 5 characters long!')
];

exports.registerValidation = [
    validator
        .check('name')
        .trim()
        .notEmpty()
        .withMessage('Username must be at least 5 characters long!'),

    validator
        .check('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format!')
        .custom((email, { req }) => {
            return User
                .findOne({ email: email })
                .then(user => {
                    if (user) return Promise.reject('Email already taken!');
                });
        })
        .normalizeEmail(),

    validator
        .check('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters!')
        // .custom((password, { req }) => {
        //     if (password !== req.body.confirmPassword)
        //         return Promise.reject('Passwords does not match!');
        // })
];

exports.loginValidation = [
    validator
        .check('email', 'Invalid email format!')
        .trim()
        .isEmail()
        .normalizeEmail(),

    validator
        .check('password')
        .trim()
        .isLength({ min: 5 })
        .withMessage('Password must be at least 5 characters!')
];
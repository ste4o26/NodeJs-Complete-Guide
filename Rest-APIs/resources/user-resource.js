const bcrypt = require('bcryptjs');
const { isValidUser, getErrorResponse } = require('../utils/validation-util');
const jwtUtil = require('../utils/jwt-util');
const User = require('../models/user');

exports.postRegister = async (req, res, next) => {
    if (!isValidUser(req))
    throw getErrorResponse(422, 'Invalid user input!', req);
    
    let user;
    const userData = { ...req.body };
    try {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        user = new User({
            name: userData.name,
            email: userData.email,
            password: hashedPassword
        });

        user = await user.save();
    } catch (err) {
        if (!err.status) return next(getErrorResponse(500, err.message))
        next(err);
    }

    res.status(201)
        .json({ message: 'Registration successfull.', userId: user._id });
}

exports.postLogin = async (req, res, next) => {
    if (!isValidUser(req))
        throw getErrorResponse(422, 'Invalid user input!', req);

    let user;
    let jwtToken;
    const userData = { ...req.body };
    try {
        user = await User.findOne({ email: userData.email });
        if (!user)
            throw getErrorResponse(404, 'Invalid email or password!');

        const doPasswordsMatch = await bcrypt.compare(userData.password, user.password);
        if (!doPasswordsMatch)
            throw getErrorResponse(404, 'Invalid email or password!');

        jwtToken = jwtUtil.signTokenFor(user);
    } catch (err) {
        if (!err.status) return next(getErrorResponse(500, err.message));
        next(err);
    }

    res.status(200)
        .json({
            token: jwtToken,
            userId: user._id.toString()
        });
}

exports.getCurrentUser = async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.userId);
        if (!user) throw getErrorResponse(404, 'No such user!');
    } catch (err) {
        if (!err.status) return next(getErrorResponse(500, err.message));
        next(err);
    }

    res.status(200)
        .json({ ...user._doc });
}

exports.putCurrentUser = async (req, res, next) => {
    let user;
    const userData = { ...req.body };
    try {
        user = await User.findById(req.userId);
        if (!user) throw getErrorResponse(404, 'No such user');

        user.status = userData.status;
        await user.save();
    } catch (err) {
        if (!err.status) return next(getErrorResponse(500, err.message));
        next(err);
    }

    res
        .status(200)
        .json({ ...user._doc });
}
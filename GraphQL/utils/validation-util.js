const validator = require('validator');

const validateUser = (user, isRegistration) => {
    const errors = [];
    if (!validator.isEmail(user.email)) errors.push({ message: 'Invalid email format!' });

    if (validator.isEmpty(user.password) ||
        !validator.isLength(user.password, { min: 5 }))
        errors.push({ message: 'Password must be at least 5 characters!' });

    if (isRegistration && !validator.isLength(user.name, { min: 5 }))
        errors.push({ message: 'Username must be at least 5 characters!' });

    return errors;
}

const validatePost = (post) => {
    const errors = [];
    if (validator.isEmpty(post.title) ||
        !validator.isLength(post.title, { min: 5 }))
        errors.push({ message: 'Title must be at least 5 characters!' });

    if (validator.isEmpty(post.content) ||
        !validator.isLength(post.content, { min: 10 }))
        errors.push({ message: 'Content must be at least 10 characters!' });

    return errors;
}

exports.isValidUser = (user, req, isRegistration) => {
    const errors = validateUser(user, isRegistration);
    req.errors = errors;
    if (errors.length > 0) return false;
    return true;
}

exports.isValidPost = (post, req) => {
    const errors = validatePost(post);
    req.errors = errors;
    if (errors.length > 0) return false;
    return true;
}
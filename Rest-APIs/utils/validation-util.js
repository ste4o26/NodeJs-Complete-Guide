const validator = require('express-validator');
const ErrorResponse = require('../models/error-response');

exports.isValidPost = (req) => {
    const errors = validator.validationResult(req);
    if (errors.isEmpty() && (req.file || req.body.image)) return true;
    return false;
}

exports.isValidUser = (req) => {
    const errors = validator.validationResult(req);
    if (errors.isEmpty()) return true;
    return false;
}


exports.getErrorResponse = (status, message, req) => {
    let errors = [];
    if (req) errors = validator.validationResult(req).array();

    return new ErrorResponse(status, message, errors);
}
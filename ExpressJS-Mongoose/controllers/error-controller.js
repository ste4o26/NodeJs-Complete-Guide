exports.getPageNotFound = (request, response, next) => {
    response.status(404);
    response.render('error/page-not-found', { errorCode: 404 });
}

exports.getInternalServerError = (error, request, response, next) => {
    response.status(error.httpStatusCode)
    response.render('error/internal-server-error', {
        errorCode: error.httpStatusCode,
        errorMessage: error.message
    });
}

exports.getError = (message, statusCode) => {
    const error = new Error(message);
    error.httpStatusCode = statusCode;
    return error;
}
exports.getPageNotFound = (request, response, next) => {
    response.status(404);
    response.render('error', { errorCode: 404 });
}
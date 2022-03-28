module.exports = class ErrorResponse {
    constructor(status, message, errors) {
        this.status = status || 500;
        this.message = message || 'Something went wrong. We are working on it!';
        this.errors = errors || [];
    }
}
const { renderAddMessage } = require('./add-message');
const { renderHome } = require('./home');
const { writeMessageToFile } = require('./persist-message');

const requestHandler = (request, response) => {
    response.setHeader('Content-Type', 'text/html');
    const url = request.url;
    const method = request.method;

    if (url === '/add-message') return renderAddMessage(response);

    if (url === '/persist-message' && method === 'POST') return writeMessageToFile(request, response);

    renderHome(response);
}

module.exports = { requestHandler };
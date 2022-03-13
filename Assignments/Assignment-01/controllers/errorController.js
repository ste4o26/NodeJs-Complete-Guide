const path = require('path');
const fs = require('fs');

const renderErrorPage = (response) => {
    const filePath = path.join('views/error.html');

    fs.readFile(filePath, (error, viewData) => {
        response.writeHead(404, { 'Content-Type': 'text/html' });
        response.write(viewData);
        response.end();
    });
}

module.exports = { renderErrorPage };
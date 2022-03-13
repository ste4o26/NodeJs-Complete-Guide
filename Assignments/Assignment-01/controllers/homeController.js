const path = require('path');
const fs = require('fs');
const { errorController } = require('./errorController');

const renderHomePage = response => {
    const filePath = path.join('views/home.html');

    fs.readFile(filePath, (error, viewData) => {
        if (error) {
            errorController(response);
            return response.end();
        }

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(viewData);
        response.end();
    });
}

module.exports = { renderHomePage };
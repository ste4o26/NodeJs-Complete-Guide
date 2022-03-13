const path = require('path');
const fs = require('fs');
const { renderErrorPage } = require('./errorController');

const renderUsersPage = (response, username) => {
    const filePath = path.join('views/users.html');

    fs.readFile(filePath, (error, viewData) => {
        if (error) renderErrorPage(response);

        if (username) viewData = viewData.toString().replace(' <li>newUser</li>', `<li>${username}</li>`);

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(viewData);
        response.end();
    });
}

const renderAddUserPage = response => {
    const filePath = path.join('views/add-user.html');

    fs.readFile(filePath, (error, viewData) => {
        if (error) renderErrorPage(response);

        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(viewData);
        response.end();
    });
}

const addUser = (request, response) => {
    const data = [];
    request.on('data', (chunk) => {
        data.push(chunk);
    });

    request.on('end', () => {
        const bufferedData = Buffer.concat(data);
        const username = bufferedData.toString().split('=')[1];
        console.log(username);
        return renderUsersPage(response, username);
    });

    
}

module.exports = { renderUsersPage, renderAddUserPage, addUser };
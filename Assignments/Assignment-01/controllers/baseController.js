const { renderHomePage } = require('./homeController');
const { renderErrorPage } = require('./errorController');
const { renderUsersPage, renderAddUserPage, addUser } = require('./usersController');

const requestHandler = (request, response) => {
    const url = request.url;

    switch (url) {
        case '/': return renderHomePage(response);
        case '/home': return renderHomePage(response);
        case '/users': return renderUsersPage(response);
        case '/users/add': return renderAddUserPage(response);
        case '/add-user': return addUser(request, response);
        default: return renderErrorPage(response);
    }
}

module.exports = { requestHandler };
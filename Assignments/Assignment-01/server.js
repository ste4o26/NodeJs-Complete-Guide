const http = require('http');
const { requestHandler } = require('./controllers/baseController');

const server = http.createServer((request, response) => {
    requestHandler(request, response);
});

server.listen(3000);

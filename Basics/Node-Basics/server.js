const http = require('http');
const fs = require('fs');
const { requestHandler } = require('./routes');

const server = http.createServer((request, response) => {
    requestHandler(request, response);
});

server.listen(3000);

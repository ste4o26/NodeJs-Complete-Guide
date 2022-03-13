const fs = require('fs');

const writeMessageToFile = (request, response) => {
    const allChunks = [];
    request.on('data', (chunk) => {
        allChunks.push(chunk);
    });

    request.on('end', () => {
        const requestBodyAsString = Buffer.concat(allChunks)
            .toString()
            .split('=')[1];

        fs.writeFileSync('messages.txt', requestBodyAsString);
    });

    response.statusCode = 302;
    response.setHeader('Location', '/');
    response.end();
}

module.exports = { writeMessageToFile };
const path = require('path');
const express = require('express');

const rootDir = require('../utils/local-path');

const router = express.Router();

router.get('/', (request, response, next) => {
    response.redirect('/home');
});

router.get('/home', (request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'home.html'))
});


module.exports = router;
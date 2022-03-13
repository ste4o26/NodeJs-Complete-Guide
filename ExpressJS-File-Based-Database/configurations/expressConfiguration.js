const path = require('path');
const express = require('express');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');

const rootDir = require('../utils/localPath');

const configureApp = (app) => {
    const hbsEngine = expressHbs.engine({ extname: 'hbs' });
    app.engine('hbs', hbsEngine);
    app.set('view engine', 'hbs');
    app.set('views', 'views');
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(rootDir, 'public')));
}


module.exports = configureApp;
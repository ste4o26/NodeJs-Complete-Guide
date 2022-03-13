const path = require('path');
const express = require('express');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');

const rootDir = require('../utils/local-path');

const configureApp = (app) => {
    handlebarsConfig(app);
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(rootDir, 'public')));
}

const handlebarsConfig = (app) => {
    const hbsEngine = expressHbs.engine({
        extname: 'hbs',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }
    });

    app.engine('hbs', hbsEngine);
    app.set('view engine', 'hbs');
    app.set('views', 'views');
}

module.exports = configureApp;
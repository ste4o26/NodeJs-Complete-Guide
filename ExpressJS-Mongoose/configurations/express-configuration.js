const path = require('path');
const express = require('express');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const SessionStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');

const rootDir = require('../utils/local-path');
// const MONGODB_URI = "Your URL";
const MONGODB_URI = "mongodb+srv://ste4o26:mongodb%40P123@cluster0.ohphy.mongodb.net/node-complete-guide?retryWrites=true&w=majority";


const configureApp = (app) => {
    handlebarsConfig(app);

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(rootDir, 'public')));

    sessionConfig(app);

    app.use(csurf());
    app.use(flash());
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

const sessionConfig = (app) => {
    const sessionStore = new SessionStore({
        uri: MONGODB_URI,
        collection: 'sessions'
    })

    app.use(session({
        secret: 'top-secret',
        resave: false,
        saveUninitialized: false,
        store: sessionStore
    }));
}

module.exports = configureApp;
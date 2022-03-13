const express = require('express');
const expressHbs = require('express-handlebars');
const homeHandler = require('./routes/home');
const userRoutes = require('./routes/user');
const bodyParser = require('body-parser');

const app = express();

const hbsEngine = expressHbs.engine({ extname: 'hbs' });
app.engine('hbs', hbsEngine);
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(homeHandler.router);
app.use(userRoutes);

app.listen(3000);

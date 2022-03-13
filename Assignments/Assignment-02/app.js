const path = require('path');

const express = require('express');

const rootDir = require('./utils/local-path')
const userRoutes = require('./routes/users');
const baseRoutes = require('./routes/base');

const app = express();

app.use(express.static(path.join(rootDir, 'public')));

app.use(userRoutes);

app.use(baseRoutes);

app.use((request, response, next) => {
    response.sendFile(path.join(rootDir, 'views', 'error.html'));
});

app.listen(3000);

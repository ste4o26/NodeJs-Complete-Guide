const express = require('express');
const mongoose = require('mongoose');

const {
    fileUploadConfig,
    bodyParserConfig,
    staticFilesAccessConfig,
    corsConfig,
    graphqlConfig
} = require('./configurations/express-configuration');
const auth = require('./middlewares/auth-middleware');
const fileResource = require('./resources/file-resource');

const DB_URL = 'mongodb+srv://ste4o26:mongodb%40P123@cluster0.ohphy.mongodb.net/node-complete-guide-rest?retryWrites=true&w=majority';
const app = express();

app.use(fileUploadConfig());
app.use(bodyParserConfig());
app.use(corsConfig);
app.use('/images', staticFilesAccessConfig);

app.use(auth);
app.use('/graphql', graphqlConfig);
app.put('/post-image', fileResource.uploadImage);

mongoose
    .connect(DB_URL)
    .then(app.listen(5000))
    .catch(err => console.log(err));
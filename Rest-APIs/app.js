const express = require('express');
const mongoose = require('mongoose');

const { fileUploadConfig, bodyParserConfig, staticFilesAccessConfig, corsConfig } = require('./configurations/express-configuration');
const postRoutes = require('./routes/post-routes');
const authRoutes = require('./routes/auth-routes');

const app = express();

app.use(fileUploadConfig());
app.use(bodyParserConfig());
app.use('/images', staticFilesAccessConfig);
app.use(corsConfig);

app.use('/posts', postRoutes);
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
    if (!err.status) err.status = 500;

    return res
        .status(err.status)
        .json({
            message: err.message,
            errors: err.errors
        });
});

mongoose
    .connect('mongodb+srv://ste4o26:mongodb%40P123@cluster0.ohphy.mongodb.net/node-complete-guide-rest?retryWrites=true&w=majority')
    .then(app.listen(5000))
    .catch(err => console.log(err));
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { graphqlHTTP } = require('express-graphql');

const graphqlSchema = require('../graphql/schema');
const graphqlResolver = require('../graphql/resolvers');

exports.bodyParserConfig = () => bodyParser.json();

exports.corsConfig = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
}

exports.staticFilesAccessConfig = express.static(path.join(__dirname, '..', 'images'));

exports.fileUploadConfig = () => {
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'images'),
        filename: (req, file, cb) => cb(null, uuidv4())
    });

    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg') {
            return cb(null, true);
        }
        return cb(null, false);
    }

    return multer({ storage: fileStorage, fileFilter: fileFilter }).single('image');
}

exports.graphqlConfig = graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
        if (!err.originalError) return err;
        if (!err.originalError.thrownValue) return err;

        return {
            status: err.originalError.thrownValue.status || 500,
            message: err.originalError.thrownValue.message || 'Something went wrong!',
            erros: err.originalError.thrownValue.errors || []
        }
    }
})
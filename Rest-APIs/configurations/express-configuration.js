const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

exports.bodyParserConfig = () => bodyParser.json();

exports.corsConfig = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}

exports.staticFilesAccessConfig = express.static(path.join(__dirname, '../images'));

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
const express = require('express');

const router = express.Router();
const users = [];

router.get('/', (req, res, next) => {
    res.redirect('/home');
});

router.get('/home', (req, res, next) => {
    const templateData = { title: 'Home' };
    res.render('index', templateData);
});

router.post('/users/add', (req, res, next) => {
    if (req.body.username) users.push(req.body.username);
    res.redirect('/users/all');
});

module.exports.router = router;
module.exports.users = users;
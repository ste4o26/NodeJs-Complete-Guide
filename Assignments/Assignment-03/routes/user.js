const express = require('express');
const homeHandler = require('./home');

const router = express.Router();

router.get('/users/all', (req, res, next) => {
    const templateData = {
        title: 'Users List',
        users: [...homeHandler.users],
        hasUsers: homeHandler.users.length > 0
    };

    res.render('users', templateData);
});

module.exports = router;
const express = require('express');
const router = express.Router();

const userResource = require('../resources/user-resource')
const authMidlleware = require('../middlewares/auth-middleware');

router.get('/current', authMidlleware, userResource.getCurrentUser);

router.put('/current', authMidlleware, userResource.putCurrentUser);

module.exports = router;
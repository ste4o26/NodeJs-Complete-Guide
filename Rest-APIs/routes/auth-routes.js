const express = require('express');
const router = express.Router();
const { registerValidation, loginValidation } = require('../middlewares/validation-middleware');
const userResource = require('../resources/user-resource');

router.post('/register', registerValidation, userResource.postRegister);

router.post('/login', loginValidation, userResource.postLogin);

module.exports = router;
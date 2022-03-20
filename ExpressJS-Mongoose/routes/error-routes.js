const express = require('express');

const errorController = require('../controllers/error-controller');

const router = express.Router();

router.use(errorController.getPageNotFound);

module.exports = router;
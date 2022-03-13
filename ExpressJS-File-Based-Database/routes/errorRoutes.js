const express = require('express');

const errorController = require('../controllers/errorController');

const router = express.Router();

router.use(errorController.getPageNotFound);

module.exports = router;
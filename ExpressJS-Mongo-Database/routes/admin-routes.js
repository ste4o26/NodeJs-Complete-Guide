const express = require('express');

const productController = require('../controllers/product-controller');

const router = express.Router();

router.get('/products/add', productController.getAddProduct);

router.post('/products/add', productController.postAddProduct);

router.post('/products/edit', productController.postEditProduct);

router.get('/products/edit/:productId', productController.getEditProduct);

router.post('/products/delete/:productId', productController.postDeleteProduct);

module.exports = router;
const path = require('path');
const express = require('express');

const productController = require('../controllers/productController');
const shopController = require('../controllers/shopController');

const router = express.Router();

router.get('/', shopController.redirectToHome);

router.get('/home', shopController.getHome);

router.get('/products/all', productController.getAllProducts);

router.get('/products/details/:productId', productController.getProductDetails);

router.get('/cart', shopController.getCart);

router.post('/cart', shopController.postAddToCart);

router.post('/cart/products/remove/:productId', shopController.postRemoveFromCart)

router.get('/checkout', shopController.getCheckout);

router.get('/orders', shopController.getOrders);

module.exports = router;
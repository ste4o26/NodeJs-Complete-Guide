const express = require('express');

const productController = require('../controllers/product-controller');
const shopController = require('../controllers/shop-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = express.Router();

router.get('/', shopController.redirectToHome);

router.get('/home', shopController.getHome);

router.get('/products/all', productController.getAllProducts);

router.get('/products/details/:productId', productController.getProductDetails);

router.get('/cart', authMiddleware.isAuthenticated, shopController.getCart);

router.post('/cart', authMiddleware.isAuthenticated, shopController.postAddToCart);

router.post('/cart/products/remove/:productId', authMiddleware.isAuthenticated, shopController.postRemoveFromCart);

router.get('/checkout', authMiddleware.isAuthenticated, shopController.getCheckout);

router.get('/checkout/success', authMiddleware.isAuthenticated, shopController.getCheckoutSuccess);

router.get('/checkout/cancel', authMiddleware.isAuthenticated, shopController.getCheckout);

router.get('/orders', authMiddleware.isAuthenticated, shopController.getOrders);

module.exports = router;
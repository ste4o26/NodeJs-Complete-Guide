const express = require('express');

const productController = require('../controllers/product-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const validationMiddleware = require('../middlewares/validation-middleware');

const router = express.Router();

router.get('/products/add', authMiddleware.isAuthenticated,
    authMiddleware.isAuthorizedRole,
    productController.getAddProduct);

router.post('/products/add', authMiddleware.isAuthenticated,
    authMiddleware.isAuthorizedRole,
    validationMiddleware.productValidator,
    productController.postAddProduct);

router.post('/products/edit', authMiddleware.isAuthenticated,
    authMiddleware.isAuthorizedRole,
    validationMiddleware.productValidator,
    productController.postEditProduct);

router.get('/products/edit/:productId', authMiddleware.isAuthenticated,
    authMiddleware.isAuthorizedRole,
    productController.getEditProduct);

router.post('/products/delete/:productId', authMiddleware.isAuthenticated,
    authMiddleware.isAuthorizedRole,
    productController.postDeleteProduct);

module.exports = router;
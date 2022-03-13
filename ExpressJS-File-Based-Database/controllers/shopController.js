const Product = require('../models/product');
const Cart = require('../models/cart');

exports.redirectToHome = (request, response, next) => {
    response.redirect('/home');
}

exports.getHome = (request, response, next) => {
    response.render('shop/home');
}

exports.getCart = (request, response, next) => {
    Cart.fetchCart(cart => {
        response.render('shop/cart', {cart: cart, hasProducts: cart.products.length > 0});
    });
}

exports.postAddToCart = (request, response, next) => {
    const productId = request.body.productId;

    Product.fetchById(productId, (product) => {
        Cart.addProduct(product, () => {
            response.redirect('/cart');
        });
    });
}

exports.postRemoveFromCart = (request, response, next) => {
    const productId = request.params.productId;
    Cart.deleteProductById(productId, false);
    response.redirect('/cart');
}

exports.getCheckout = (request, response, next) => {
    response.render('shop/checkout');
}

exports.getOrders = (request, response, next) => {
    response.render('shop/orders');
}
const Product = require("../models/product");
const User = require('../models/user');
const errorController = require('./error-controller');
const payments = require('../utils/payments');

exports.redirectToHome = (request, response, next) => {
    response.redirect('/home');
}

exports.getHome = (request, response, next) => {
    const username = request.session.user ? request.session.user.username : undefined;
    response.render('shop/home', { username });
}

exports.getCart = (request, response, next) => {
    const username = request.session.user.username;

    User
        .findOne({ username: username })
        .then(user => user.populate('cart.products.productId'))
        .then(user => {
            const products = mapToNormalizedProducts([... user.cart.products]);
            const totalPrice = products
                .reduce((totalCartPrice, product) => totalCartPrice += product.price * product.quantity, 0);

            const templateData = {
                products: products,
                hasProducts: products.length > 0,
                totalPrice
            };

            response.render('shop/cart', templateData);
        })
        .catch(error => next(errorController.getError(error.message, 500)));
}

exports.postAddToCart = (request, response, next) => {
    const productId = request.body.productId;
    const username = request.session.user.username;

    User
        .findOne({ username: username })
        .then(user => {
            Product
                .findById(productId)
                .then(product => user.addToCart(product))
        })
        .then(() => response.redirect('/cart'))
        .catch(error => next(errorController.getError(error.message, 500)));
}

exports.postRemoveFromCart = (request, response, next) => {
    const productId = request.params.productId;
    const username = request.session.user.username;

    User
        .findOne({ username: username })
        .then(user => user.removeFromCart(productId))
        .then(() => response.redirect('/cart'))
        .catch(error => next(errorController.getError(error.message, 500)));
}

exports.getCheckout = (request, response, next) => {
    const username = request.session.user.username;
    const templateData = {};

    User
        .findOne({ username: username })
        .then(user => user.populate('cart.products.productId'))
        .then(user => {
            templateData.products = mapToNormalizedProducts([...user.cart.products]);
            templateData.hasProducts = templateData.products.length > 0;
            templateData.totalPrice = templateData.products
                .reduce((totalCartPrice, product) => totalCartPrice += product.price * product.quantity, 0);

            const domain = `${request.protocol}://${request.get('host')}`
            return payments.genretaPaymentSession(templateData.products, domain);
        })
        .then(session => {
            templateData.sessionId = session.id;
            response.render('shop/checkout', templateData);
        })
        .catch(error => next(errorController.getError(error.message, 500)));
}

exports.postCheckout = (request, response, next) => {
    console.log(request.body);
}

exports.getOrders = (request, response, next) => {
    const username = request.session.user.username;

    User
        .findOne({ username: username })
        .then(user => user.populate('orders.orderId'))
        .then(user => {
            const templateData = {
                hasOrders: user.orders.length > 0,
                orders: user.orders,
            };

            response.render('shop/orders', templateData);
        })
        .catch(error => next(errorController.getError(error.message, 500)));
}

exports.getCheckoutSuccess = (request, response, next) => {
    const username = request.session.user.username;

    User
        .findOne({ username: username })
        .then(user => user.addOrder())
        .then(() => response.redirect('/orders/'))
        .catch(error => next(errorController.getError(error.message, 500)));
}

mapToNormalizedProducts = (products) => {
    return products
        .map(product => {
            return {
                _id: product.productId._id,
                name: product.productId.name,
                imageUrl: product.productId.imageUrl,
                price: product.productId.price,
                description: product.productId.description,
                quantity: product.quantity
            }
        });
}
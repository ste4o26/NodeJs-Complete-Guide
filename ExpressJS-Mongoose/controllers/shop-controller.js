const Product = require("../models/product");
const User = require('../models/user');

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
            const products = [...user.cart.products]
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

            const totalPrice = products
                .reduce((totalCartPrice, product) => totalCartPrice += product.price * product.quantity, 0);

            const templateData = {
                products: products,
                hasProducts: products.length > 0,
                totalPrice
            };

            response.render('shop/cart', templateData);
        })
        .catch(error => console.error(error));
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
        .catch((error) => console.error(error));
}

exports.postRemoveFromCart = (request, response, next) => {
    const productId = request.params.productId;
    const username = request.session.user.username;

    User
        .findOne({ username: username })
        .then(user => user.removeFromCart(productId))
        .then(() => response.redirect('/cart'))
        .catch(error => console.error(error));
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
        .catch(error => console.error(error));
}

exports.postOrder = (request, response, next) => {
    const username = request.session.user.username;

    User
        .findOne({ username: username })
        .then(user => user.addOrder())
        .then(() => response.redirect('/orders/'))
        .catch(error => console.error(error));
}
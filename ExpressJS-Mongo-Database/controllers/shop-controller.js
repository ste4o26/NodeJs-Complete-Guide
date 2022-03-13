const Product = require("../models/product");

exports.redirectToHome = (request, response, next) => {
    response.redirect('/home');
}

exports.getHome = (request, response, next) => {
    response.render('shop/home');
}

exports.getCart = (request, response, next) => {
    request.user
        .getCartProducts()
        .then(products => {
            const totalPrice = products
                .reduce((totalCartPrice, product) => totalCartPrice += product.price * product.quantity, 0);

            const templateData = {
                products: [...products],
                hasProducts: products.length > 0,
                totalPrice
            };

            response.render('shop/cart', templateData);
        });
}

exports.postAddToCart = (request, response, next) => {
    const productId = request.body.productId;

    Product.fetchById(productId)
        .then((product) => request.user.addToCart(product))
        .then(() => response.redirect('/cart'))
        .catch((error) => console.error(error));
}

exports.postRemoveFromCart = (request, response, next) => {
    const productId = request.params.productId;

    request.user
        .removeFromCart(productId)
        .then(() => response.redirect('/cart'))
        .catch(error => console.error(error));
}

exports.getOrders = (request, response, next) => {
    request.user
    .getOrders()
    .then(orders => {
        const templateData = {
            hasOrders: orders.length > 0,
            orders
        };

        response.render('shop/orders', templateData);
    })
    .catch(error => console.error(error));
}

exports.postOrder = (request, response, next) => {
    request.user
        .addOrder()
        .then(() => response.redirect('/orders/'))
        .catch(error => console.error(error));
}
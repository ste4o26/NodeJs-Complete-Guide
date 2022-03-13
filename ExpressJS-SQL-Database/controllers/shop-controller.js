const Product = require('../models/product');
const Cart = require('../models/cart');

exports.redirectToHome = (request, response, next) => {
    response.redirect('/home');
}

exports.getHome = (request, response, next) => {
    response.render('shop/home');
}

exports.getCart = (request, response, next) => {
    request.user.getCart()
        .then(cart => cart.getProducts()
            .then(products => {
                let totalPrice = products
                    .reduce((totalPrice, product) => totalPrice += product.price * product.cart_product.quantity, 0);

                response.render('shop/cart', {
                    products,
                    totalPrice,
                    hasProducts: products.length > 0
                })
            }));
}

exports.postAddToCart = (request, response, next) => {
    const productId = request.body.productId;
    let currentUserCart;

    request.user.getCart()
        .then(cart => {
            currentUserCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) product = products[0];

            let quantity = 1;
            if (product) quantity += product.cart_product.quantity;

            return Product.findByPk(productId)
                .then(product => currentUserCart.addProduct(product, { through: { quantity } }))
        })
        .then(() => response.redirect('/cart'))
        .catch(error => console.error(error));
}

exports.postRemoveFromCart = (request, response, next) => {
    const productId = request.params.productId;
    let currentUserCart;

    request.user.getCart()
        .then(cart => {
            currentUserCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            const product = products[0];
            if (product.cart_product.quantity <= 1) return product.cart_product.destroy();

            product.cart_product.quantity--;
            return product.cart_product.save();
        })
        .then(() => response.redirect('/cart'))
        .catch(error => console.error(error));
}

exports.getCheckout = (request, response, next) => {
    response.render('shop/checkout');
}

exports.postOrder = (request, response, next) => {
    let currentUserCart;

    request.user.getCart()
        .then(cart => {
            currentUserCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return request.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.order_product = { quantity: product.cart_product.quantity }
                        return product;
                    }));
                })
                .catch(error => console.error(error)); 1
        })
        .then(() => {
            currentUserCart.setProducts(null);
            response.redirect('/orders');
        })
        .catch(error => console.error(error));
}

exports.getOrders = (request, response, next) => {
    request.user.getOrders({ include: ['products'] })
        .then(orders => {
            const templateData = {
                hasOrders: orders.length > 0,
                orders
            };

            response.render('shop/orders', templateData);
        })
        .catch(error => console.error(error));
}
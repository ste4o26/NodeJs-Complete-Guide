const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = require('./order');

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    cart: {
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true
                }
            }
        ]
    },

    orders: [
        {
            orderId: {
                type: Schema.Types.ObjectId,
                ref: 'Order',
                required: true
            }
        }
    ],

    resetToken: String,

    resetTokenExpiration: Date,

    role: {
        type: String,
        required: true
    }
});

userSchema.methods.addToCart = function (product) {
    const updatedCart = { ...this.cart };
    const cartProductIndex = this.cart.products.findIndex(currentProduct => currentProduct.productId.toString() === product.id.toString());

    if (cartProductIndex <= -1) {
        const newProduct = {
            productId: product.id,
            quantity: 1
        }

        updatedCart.products.push(newProduct);
    } else {
        updatedCart.products[cartProductIndex].quantity++;
    }

    this.cart = updatedCart;
    return this.save();
}

userSchema.methods.removeFromCart = function (productId) {
    const productIndex = this.cart.products
        .findIndex(product => product.productId.toString() === productId);

    const updatedProducts = [...this.cart.products];
    if (updatedProducts[productIndex].quantity > 1) { updatedProducts[productIndex].quantity--; }
    else { updatedProducts.splice(productIndex, 1); }

    this.cart.products = updatedProducts;
    return this.save();
}

userSchema.methods.addOrder = function () {
    const orderNumber = this.orders.length + 1 || 1;

    return this.populate('cart.products.productId')
        .then(user => {
            const products = [...user.cart.products]
                .map(product => {
                    return {
                        _id: product._id,
                        name: product.productId.name,
                        quantity: product.quantity
                    };
                });

            const order = new Order({ orderNumber: orderNumber, products: products, userId: this._id });
            user.cart.products = [];

            return order.save()
        })
        .then(order => {
            this.orders.push({ orderId: order.id });
            return this.save();
        })
        .catch(error => console.error(error));
}

module.exports = mongoose.model('User', userSchema);
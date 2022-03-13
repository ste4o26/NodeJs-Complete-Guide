const mongodb = require('mongodb');
const getDb = require('../utils/database').getDb;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart || { products: [] };
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(productToBeAdded) {
        let newQuantity = 1;
        const updatedCartProducts = [...this.cart.products];
        const productIndex = this.cart.products
            .findIndex(product => product.productId.toString() === productToBeAdded._id.toString());

        if (productIndex > -1) {
            newQuantity = this.cart.products[productIndex].quantity + 1;
            this.cart.products[productIndex].quantity = newQuantity;
        } else {
            const productData = { productId: mongodb.ObjectId(productToBeAdded._id), quantity: newQuantity };
            updatedCartProducts.push(productData);
        }

        const updatedCart = { ...this.cart, products: updatedCartProducts };

        const db = getDb();
        return db.collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            );
    }

    // merge cart with products (aka add the quantity to every product)
    getCartProducts() {
        const productsIds = this.cart.products.map(product => product.productId);
        const db = getDb();

        return db.collection('products')
            .find({ _id: { $in: productsIds } })
            .toArray()
            .then(products => {
                return products.map(product => {
                    const cartProduct = this.cart.products
                        .find(currentCartProduct => currentCartProduct.productId.toString() === product._id.toString());

                    return { ...product, quantity: cartProduct.quantity };
                });
            })
            .catch(error => console.error(error));
    }

    removeFromCart(productId) {
        const updatedProducts = [...this.cart.products];
        const index = updatedProducts.findIndex(product => product.productId.toString() === productId);

        if (updatedProducts[index].quantity > 1) updatedProducts[index].quantity--;
        else updatedProducts.splice(index, 1);

        const updatedCart = { ... this.cart, products: updatedProducts };

        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this._id) },
                { $set: { cart: updatedCart } }
            );
    }

    addOrder() {
        const db = getDb();

        return this
            .getCartProducts()
            .then(products => {
                this.getOrders()
                    .then(orders => {
                        const order = {
                            orderNumber: orders.length + 1,
                            products,
                            userId: mongodb.ObjectId(this._id)
                        };

                        return db.collection('orders')
                            .insertOne(order)
                            .then(() => {
                                return db.collection('users')
                                    .updateOne(
                                        { _id: new mongodb.ObjectId(this._id) },
                                        { $set: { cart: { products: [] } } }
                                    );
                            })
                            .catch(error => console.log(error));
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error));
    }

    getOrders() {
        const db = getDb();

        return db.collection('orders')
            .find({ userId: new mongodb.ObjectId(this._id) })
            .toArray();
    }

    static fetchById(id) {
        const db = getDb();
        return db.collection('users').findOne({ _id: new mongodb.ObjectId(id) });
    }
}

module.exports = User;
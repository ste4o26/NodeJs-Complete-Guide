const path = require('path');
const express = require('express');
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');

const rootDir = require('../utils/local-path');
const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');
const CartsProducts = require('../models/carts-products');
const Order = require('../models/order');
const OrdersProducts = require('../models/orders-products');

const configureApp = (app) => {
    handlebarsConfig(app);
    sequelizeRelationsConfig();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(rootDir, 'public')));
}

const handlebarsConfig = (app) => {
    const hbsEngine = expressHbs.engine({
        extname: 'hbs',
        //this is becouse hendle bars forbids the use of "this" keyword in the template becouse of security issues
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }
    });

    app.engine('hbs', hbsEngine);
    app.set('view engine', 'hbs');
    app.set('views', 'views');
}

const sequelizeRelationsConfig = () => {
    Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
    User.hasMany(Product);

    User.hasOne(Cart);
    Cart.belongsTo(User);

    Cart.belongsToMany(Product, { through: CartsProducts });
    Product.belongsToMany(Cart, { through: CartsProducts });

    User.hasMany(Order);
    Order.belongsTo(User);

    Product.belongsToMany(Order, { through: OrdersProducts });
    Order.belongsToMany(Product, { through: OrdersProducts });
}

module.exports = configureApp;
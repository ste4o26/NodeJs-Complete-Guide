const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const CartsProducts = sequelize.define('cart_product', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
        primaryKey: true
    },

    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = CartsProducts;
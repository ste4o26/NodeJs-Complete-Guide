const Sequelize = require('sequelize');
const sequelize = require('../utils/database');


const OrdersProducts = sequelize.define('order_product', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    },
    
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = OrdersProducts;

const Sequelize = require('sequelize');
const sequelize = require('../utils/database');


const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        autoIncrement: true,
        primaryKey: true
    }
});

module.exports = Order;

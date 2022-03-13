const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderNumber: {
        type: Number,
        required: true
    },

    products: [
        {
            name: {
                type: String,
                required: true
            },

            quantity: {
                type: Number,
                required: true
            }
        }
    ],

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);
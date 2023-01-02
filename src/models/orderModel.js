const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({
    customerId: {
        type: ObjectId,
        ref: "Customer",
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,       // assuming price as rupees only
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    discount: {
        type: Number,
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
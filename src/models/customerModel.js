const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,           // encrypted password
        required: true
    },
    noOfOrder: {
        type: Number,
        default: 0
    },
    customerType: {
        type: String,
        enum: ["regular", "gold", "platinum"],
        default: "regular"
    },
    totalDiscount: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
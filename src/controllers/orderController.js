const customerModel = require('../models/customerModel');
const orderModel = require('../models/orderModel');
const { isValidBody, isValid } = require('../validations/validator');
const mail = require('./mail');


/*############################################ 14. Create Order ##################################################*/

const createOrder = async (req, res) => {
    try {
        let customerId = req.params.customerId;
        let data = req.body;
        let { productName, price, quantity } = data;

        //----------------------------- Validating body -----------------------------//
        if (!isValidBody(data)) {
            return res.status(400).send({ status: false, message: "Please provide order details" });
        }
        if (!isValid(productName)) {
            return res.status(400).send({ status: false, message: "Please enter productName" });
        }
        if (!isValid(price)) {
            return res.status(400).send({ status: false, message: "Please enter price" });
        }
        if (isNaN(price) || (price < 1)) {
            return res.status(400).send({ status: false, message: 'price must be in Number and greater than 0 !' });
        }

        //----------------------------- Validating quantity -----------------------------//
        if (quantity === 0) {
            return res.status(400).send({ status: false, message: 'Quantity can not be 0 !' });
        }
        quantity = quantity || 1;
        if (isNaN(quantity) || (quantity < 1)) {
            return res.status(400).send({ status: false, message: 'Quantity must be in Number and greater than 0 !' });
        }

        //----------------------------- finding customer in db -----------------------------//
        let findCustomer = await customerModel.findById({ _id: customerId });
        let findOrders = await orderModel.find({ customerId: customerId });

        let disc = 0;
        let customerType = "regular";
        let noOfOrder = findOrders.length + 1;

        if (noOfOrder === 9) { mail.goldCustomer() }
        if (noOfOrder === 19) { mail.platinumCustomer() }

        if (noOfOrder >= 10 && noOfOrder < 20) {
            customerType = 'gold';
            disc = (price * 10) / 100;
            price = (price * 90) / 100;
        }
        else if (noOfOrder >= 20) {
            customerType = 'platinum';
            disc = (price * 20) / 100;
            price = (price * 80) / 100;
        }

        let totalDis = disc * quantity;

        data.price = price;
        data.totalPrice = price * quantity;
        data.discount = totalDis;
        data.customerId = customerId;

        //----------------------------- creating order -----------------------------//
        let createdOrder = await orderModel.create(data);

        //----------------------------- updating customer details -----------------------------//
        if (data.discount > 0) {
            await customerModel.findByIdAndUpdate({ _id: findCustomer._id }, { $set: { customerType, noOfOrder }, totalDiscount: findCustomer.totalDiscount + totalDis, $push: { orderDiscount: { productName, id: createdOrder._id, discount: totalDis } } });
        } else {
            await customerModel.findByIdAndUpdate({ _id: findCustomer._id }, { $set: { customerType, noOfOrder }, totalDiscount: findCustomer.totalDiscount + totalDis });
        }

        return res.status(201).send({ status: true, message: "Order Placed!!", data: createdOrder });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



module.exports = { createOrder }
const express = require('express');
const router = express.Router();
const { authentication, authorization } = require('../middlewares/auth');
const { createCustomer, customerLogin, getcustomer } = require('../controllers/customerController');
const { createOrder } = require('../controllers/orderController');


//----------------------------- customer's API -----------------------------//

router.post('/register', createCustomer);
router.post('/login', customerLogin);
router.get('/customer/:customerId/profile', authentication, authorization, getcustomer);
router.post('/customer/:customerId/order', authentication, authorization, createOrder);


//----------------------------- For invalid end URL -----------------------------//

router.all('/**', function (_, res) {
    return res.status(400).send({ status: false, message: "Invalid http request" });
})


module.exports = router; 
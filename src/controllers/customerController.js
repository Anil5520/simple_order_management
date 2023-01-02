const customerModel = require('../models/customerModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isValidBody, isValid, NameRegex, emailRegex, passwordRegex } = require('../validations/validator');



/*############################################ 1. Create customer ###################################################*/

const createCustomer = async function (req, res) {
    try {
        let data = req.body;
        const { fname, lname, email, password } = data;

        //----------------------------- Validating body -----------------------------//
        if (!isValidBody(data)) {
            return res.status(400).send({ status: false, message: "please provide data in request body" });
        }

        //----------------------------- Validating fname -----------------------------//
        if (!isValid(fname)) {
            return res.status(400).send({ status: false, message: "fname is required" });
        }
        if (!NameRegex(fname)) {
            return res.status(400).send({ status: false, message: "fname should contain alphabets only" });
        }

        //----------------------------- Validating lname -----------------------------//
        if (!isValid(lname)) {
            return res.status(400).send({ status: false, message: "lname is required" });
        }
        if (!NameRegex(lname)) {
            return res.status(400).send({ status: false, message: "lname should contain alphabets only" });
        }

        //----------------------------- Validating email -----------------------------//
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "email is required" });
        }
        if (!emailRegex(email)) {
            return res.status(400).send({ status: false, message: "email is invalid" });
        }

        //----------------------------- Validating password -----------------------------//
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "password is required" });
        }
        if (!passwordRegex(password)) {
            return res.status(400).send({ status: false, message: "password should be strong please use One digit, one upper case , one lower case ,one special character, it between 8 to 15" });
        }
        //-----------Bcrypting Password -----------//
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);


        //----------------------------- Checking Duplicate Email -----------------------------//
        let customerEmail = await customerModel.findOne({ email });
        if (customerEmail) {
            return res.status(409).send({ status: false, message: "This e-mail address already exist, Please enter another one" });
        }

        //----------------------------- Creating customer Data -----------------------------//
        const document = await customerModel.create(data);
        return res.status(201).send({ status: true, message: "customer Created Successfully", data: document });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}




/*############################################ 2.customer Login #####################################################*/

const customerLogin = async function (req, res) {
    try {
        const data = req.body;

        //----------------------------- Validating body -----------------------------//
        if (!isValidBody(data)) {
            return res.status(400).send({ status: false, message: "Please Enter Login Credentials..." });
        }

        const { email, password } = data;

        //----------------------------- Validating Email -----------------------------//
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Please enter Email Id" });
        }
        if (!emailRegex(email)) {
            return res.status(400).send({ status: false, message: "Email is not valid" });
        }

        //----------------------------- Validating Password -----------------------------//
        if (!isValid(password)) {
            return res.status(400).send({ status: false, message: "Please enter Password" });
        }
        if (!passwordRegex(password)) {
            return res.status(400).send({ status: false, message: "password should be strong please use One digit, one upper case , one lower case ,one special character, it between 8 to 15" });
        }

        //----------------------------- Checking Credential -----------------------------//
        const customer = await customerModel.findOne({ email });

        if (customer) {
            const validPassword = await bcrypt.compare(password, customer.password);
            if (!validPassword) {
                return res.status(401).send({ status: false, message: "Invalid Password Credential" });
            }
        }
        else {
            return res.status(401).send({ status: false, message: "Invalid email Credential" });
        }

        //----------------------------- Token Generation -----------------------------//
        const token = jwt.sign({
            customerId: customer._id.toString(),
            project: "A simple order management system",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 120 * 60
        }, "doneByAnil");

        res.setHeader("Authorization", token);
        const output = {
            customerId: customer._id,
            token: token
        }
        return res.status(200).send({ status: true, message: "customer login successfull", data: output });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}




/*############################################ 3. Get customer ######################################################*/

const getcustomer = async function (req, res) {
    try {
        let customerId = req.params.customerId;

        //----------------------------- Getting customer Detail -----------------------------//
        let customerData = await customerModel.findById(customerId).select({ fname: 1, lname: 1, email: 1, noOfOrder: 1, customerType: 1, totalDiscount: 1 });
        return res.status(200).send({ status: true, message: "customer profile details", data: customerData });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



module.exports = { createCustomer, customerLogin, getcustomer }
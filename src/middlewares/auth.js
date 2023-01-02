const jwt = require("jsonwebtoken");
const customerModel = require('../models/customerModel');
const { isValidObjectId } = require("../validations/validator");



/*############################################ authentication ####################################################*/

const authentication = async function (req, res, next) {
    try {
        let token = req.header('Authorization');
        if (!token) {
            return res.status(401).send({ status: false, message: "login is required" });
        }

        let splitToken = token.split(" ");

        //----------------------------- Token Verification -----------------------------//
        jwt.verify(splitToken[1], "doneByAnil", (error, decodedtoken) => {
            if (error) {
                const message =
                    error.message === "jwt expired" ? "Token is expired, Please login again" : "Token is invalid, Please recheck your Token"
                return res.status(401).send({ status: false, message });
            }
            req.token = decodedtoken.customerId;
            next();
        });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

/*############################################ authorization ####################################################*/

let authorization = async function (req, res, next) {
    try {
        let customerId = req.params.customerId;

        //validation for given customerId
        if (!isValidObjectId(customerId)) {
            return res.status(400).send({ status: false, message: "Please enter valid customerId" });
        }

        //----------------------------- Checking if customer exist or not -----------------------------//
        let customer = await customerModel.findById({ _id: customerId });
        if (!customer) {
            return res.status(404).send({ status: false, message: "customer does not exist with this customerId" });
        }

        //----------------------------- Authorisation checking -----------------------------//
        if (req.token != customer._id) {
            return res.status(403).send({ status: false, message: "Unauthorised access" });
        }
        next();
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}

module.exports = { authentication, authorization }
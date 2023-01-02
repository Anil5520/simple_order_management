const mongoose = require("mongoose");


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};


const isValidBody = function (data) {
    return Object.keys(data).length > 0;
};


const NameRegex = function (value) {
    const NameRegex = /^[a-zA-Z\.]+$/;
    const result = NameRegex.test(value);
    return result;
}


const emailRegex = function (value) {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const result = emailRegex.test(value);
    return result;
}


const passwordRegex = function (value) {
    let passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/;
    const result = passwordRegex.test(value);
    return result;
}


const isValidObjectId = function (value) {
    return mongoose.isValidObjectId(value);
}


module.exports = { isValid, isValidBody, NameRegex, emailRegex, passwordRegex, isValidObjectId }
const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route.js");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
const app = express();

app.use(bodyParser.json());


mongoose.connect("mongodb+srv://Anil_5520:oHvOf7lGe6Rfj20Z@cluster0.dqgltt5.mongodb.net/order_management", {
    useNewUrlParser: true,
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err));

app.use("/", route);

app.listen(3000, function () {
    console.log("Express app running on port " + 3000);
});
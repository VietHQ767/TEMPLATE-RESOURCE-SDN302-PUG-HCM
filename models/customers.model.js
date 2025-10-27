const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const customerSchema = new Schema({
    name: { type: String, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, },
    phone: { type: Number, },
});

const Customers = mongoose.model("Customers", customerSchema, "customers");

module.exports = Customers;

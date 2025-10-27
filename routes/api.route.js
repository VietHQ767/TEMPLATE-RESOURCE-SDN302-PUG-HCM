const express = require("express");
const db = require("../models");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../middleware/jwt");
const { verifyToken } = require("../middleware/auth.middleware");
const ApiRouter = express.Router();
// --------------- Authenticate user ---------------
// [POST] /api/customers/login
ApiRouter.post("/customers/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const customer = await db.Customers.findOne({ email: email });
        console.log(customer);
        if (!customer) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordMatched = await bcrypt.compare(password, customer.password);
        if (!isPasswordMatched) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const accessToken = generateAccessToken(customer._id);
        return res.status(200).json({
            token: accessToken
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
// [GET] /api/customers/profile
ApiRouter.get("/customers/profile", verifyToken, async (req, res, next) => {
    try {
        const customerId = req.customer.id;
        console.log(customerId);
        const customer = await db.Customers.findById(customerId);
        if (!customer) {
            return res.status(400).json({ message: 'Customer not found' });
        }
        // Loại bỏ trường __v và password khỏi response
        const customerProfile = {
            _id: customer._id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address
        };

        return res.status(200).json(customerProfile);
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})
// --------------- End Authenticate user ---------------
module.exports = ApiRouter;

const jwt = require("jsonwebtoken");

// Tạo JWT token cho customer
const generateAccessToken = (customers) =>
    jwt.sign(
        { id: customers._id || customers.id },
        process.env.JWT_SECRET,
        { expiresIn: '3d' }
    );

module.exports = { generateAccessToken };
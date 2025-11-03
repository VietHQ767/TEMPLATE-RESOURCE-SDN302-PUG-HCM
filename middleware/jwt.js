const jwt = require("jsonwebtoken");

// Tạo JWT token cho customer
const generateAccessToken = (account) =>
    jwt.sign(
        { id: account._id || account.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

module.exports = { generateAccessToken };
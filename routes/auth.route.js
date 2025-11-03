const express = require("express");
const db = require("../models");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../middleware/jwt");
const { verifyToken } = require("../middleware/auth.middleware");
const AuthRouter = express.Router();
// --------------- Authenticate user ---------------
// [POST] /api/customers/login
// Không lưu cookie dùm Frontend
// AuthRouter.post("/login", async (req, res, next) => {
//     try {
//         const { us, pw } = req.body;
//         console.log("Authen", us, pw);
//         const account = await db.Account.findOne({ us: us });
//         console.log(account);
//         if (!account) {
//             return res.status(400).json({ message: 'Invalid username or password' });
//         }
//         const isPasswordMatched = await bcrypt.compare(pw, account.pw);
//         if (!isPasswordMatched) {
//             return res.status(400).json({ message: 'Invalid password' });
//         }
//         const accessToken = generateAccessToken(account._id);
//         return res.status(200).json({
//             token: accessToken
//         });
//     } catch (error) {
//         return res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// });

// Lưu cookie dùm Frontend
AuthRouter.post("/login", async (req, res, next) => {
    try {
        const { us, pw } = req.body;
        console.log("Authen", us, pw);
        const account = await db.Account.findOne({ us: us });
        console.log(account);
        if (!account) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const isPasswordMatched = await bcrypt.compare(pw, account.pw);
        if (!isPasswordMatched) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const accessToken = generateAccessToken(account._id);
        res.cookie('token', accessToken, {
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000, // 1 hour
        })
        return res.redirect('/views/resident');
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});


// [GET]
AuthRouter.get("/signin", async (req, res, next) => {
    res.render("login.pug");
});
module.exports = AuthRouter;

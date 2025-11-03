const express = require("express");
const db = require("../models");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../middleware/jwt");
const { verifyCookieToken } = require("../middleware/auth.middleware");
const ApiRouter = express.Router();

// method GET se luon luon de tren dau truoc post, put, delete

ApiRouter.use(verifyCookieToken);

// --------------- REST API CRUD Management ---------------
// --ENDPOINT EXAMPLE--
// get all
ApiRouter.get("/example", async (req, res, next) => {
    try {
        return res.status(200).json({ message: "Hello World" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// detail
ApiRouter.get("/example/:id", async (req, res, next) => {
    try {
        return res.status(200).json({ message: "Hello World" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// create
ApiRouter.post("/example", async (req, res, next) => {
    try {
        return res.status(200).json({ message: "Hello World" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// update
ApiRouter.put("/example", async (req, res, next) => {
    try {
        return res.status(200).json({ message: "Hello World" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

ApiRouter.delete("/example", async (req, res, next) => {
    try {
        return res.status(200).json({ message: "Hello World" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// --------------- ENDPOINT REST API CRUD Management ---------------
module.exports = ApiRouter;

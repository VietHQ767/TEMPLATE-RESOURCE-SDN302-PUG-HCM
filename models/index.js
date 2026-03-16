const mongoose = require("mongoose");
const Account = require("./account.model.js");

const db = {}

db.Account = Account;


module.exports = db;
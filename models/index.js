const mongoose = require("mongoose");
const Account = require("./account.model.js");
const Apartment = require("./apartment.model.js");
const Resident = require("./resident.model.js");
const db = {}

db.Account = Account;
db.Apartment = Apartment;
db.Resident = Resident;

module.exports = db;
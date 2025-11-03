const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const accountSchema = new Schema({
    us: {
        type: String,
        required: true,
    },
    pw: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const Account = mongoose.model("account", accountSchema, "account");

module.exports = Account;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const residentSchema = new Schema(
    {
        residentName: { type: String, required: true, unique: true },
        residentDescription: { type: String, required: true },
        floor: { type: Number, required: true, min: 1, max: 40 },
        yOB: { type: Number, required: true, min: 1940, max: 2025 },
        isOwned: { type: Boolean, default: false },
        apartment: { type: mongoose.Schema.Types.ObjectId, ref: "apartment", required: true },
    },
    {
        timestamps: true,
    }
);

const Resident = mongoose.model("resident", residentSchema, "resident");

module.exports = Resident;

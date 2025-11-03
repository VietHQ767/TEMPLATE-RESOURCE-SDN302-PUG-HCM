const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define schema
const apartmentSchema = new Schema({
    apartmentName: {
        type: String,
        required: true,
        unique: true,
    },
    totalOfFloor: {
        type: Number,
        required: true,
    }
},
    {
        timestamps: true,// thời gian tạo và cập nhật
    }
);

const Apartment = mongoose.model("apartment", apartmentSchema, "apartment");
// tham số đầu tiên là tên model, tham số thứ hai là schema, tham số thứ ba là tên collection

module.exports = Apartment;

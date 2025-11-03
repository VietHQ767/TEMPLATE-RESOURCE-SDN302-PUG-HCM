const express = require("express");
const db = require("../models");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../middleware/jwt");
const { verifyCookieToken } = require("../middleware/auth.middleware");
const ApiRouter = express.Router();

// method GET se luon luon de tren dau truoc post, put, delete

ApiRouter.use(verifyCookieToken);

// --------------- ApartMent Management ---------------
// [GET] /api/apartments
ApiRouter.get('/apartments', async (req, res, next) => {
    try {
        const apartments = await db.Apartment.find();
        return res.status(200).json(apartments);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})

// [GET] /api/apartments/:id
ApiRouter.get('/apartments/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const apartments = await db.Apartment.findById(id);
        if (!apartments) {
            return res.status(404).json({ message: 'Apartment not found' });
        }
        return res.status(200).json(apartments);
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})

// [POST] /api/apartments
ApiRouter.post('/apartments', async (req, res, next) => {
    try {
        const { apartmentName, totalOfFloor } = req.body;
        const newApartment = new db.Apartment({
            apartmentName,
            totalOfFloor
        })
        await newApartment.save();
        return res.status(201).json({ message: 'Apartment created successfully', apartment: newApartment });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})

// [PUT] /api/apartments/:id
ApiRouter.get('/apartments/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { apartmentName, totalOfFloor } = req.body;
        if (!apartmentName || !totalOfFloor) {
            return res.status(400).json({ message: 'Apartment name and total of floor are required' });
        }
        const apartment = await db.Apartment.findByIdAndUpdate(id, { apartmentName, totalOfFloor }, { new: true });
        // new: true để trả về document đã cập nhật
        if (!apartment) {
            return res.status(404).json({ message: 'Apartment not found' });
        }
        return res.status(200).json({
            message: 'Apartment updated successfully',
            apartment
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})

// [DELETE] /api/apartments/:id
ApiRouter.delete('/apartments/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const residents = await db.Resident.find({ apartment: id });
        if (residents.length > 0) {
            return res.status(400).json({ message: 'Cannot delete apartment because it has associated residents' });
        }
        const deletedApartment = await db.Apartment.findByIdAndDelete(id);
        if (!deletedApartment) {
            return res.status(404).json({ message: 'Apartment not found' });
        }
        return res.status(200).json({
            message: 'Apartment deleted successfully',
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})

module.exports = ApiRouter;

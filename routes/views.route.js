


const express = require("express");
const db = require("../models");
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../middleware/jwt");
const { verifyToken } = require("../middleware/auth.middleware");
const ViewsRouter = express.Router();


// ViewsRouter.get('/resident', async (req, res, next) => {
//     return res.render('resident.pug');
// })
ViewsRouter.get('/resident', async (req, res, next) => {
    try {
        const residents = await db.Resident.find({}).populate('apartment').lean();
        const apartments = await db.Apartment.find().lean();
        console.log("apartments", apartments);
        // lean() để trả về object thay vì document
        console.log(residents);
        return res.render('resident.pug', { residents, apartments });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})

// detail
ViewsRouter.get('/resident/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const resident = await db.Resident.findById(id).populate('apartment').lean();
        return res.render('resident-detail.pug', { resident });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})

// post
ViewsRouter.post('/resident', async (req, res, next) => {
    try {
        const { residentName, residentDescription, floor, yOB, isOwned, apartmentId } = req.body;
        const exists = await db.Resident.findOne({ residentName });
        if (exists) {
            return res.status(400).json({ message: 'Resident already exists' });
        }
        const now = new Date().getFullYear();
        const age = Number(yOB);
        const newYOB = now - age;
        const resident = new db.Resident({
            residentName,
            residentDescription,
            floor: Number(floor),
            yOB: newYOB,
            isOwned: Boolean(isOwned),
            apartment: apartmentId
        });
        await resident.save();
        return res.status(201).json({ message: 'Resident created' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})

// put
ViewsRouter.put('/resident/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { residentName, residentDescription, floor, yOB, isOwned, apartmentId } = req.body;
        const update = {
            residentName,
            residentDescription,
            floor: floor !== undefined ? Number(floor) : undefined,
            isOwned: isOwned !== undefined ? Boolean(isOwned) : undefined,
            apartment: apartmentId
        }
        if (yOB !== undefined) {
            const now = new Date().getFullYear();
            update.yOB = now - Number(yOB); // convert age to year of birth
        }
        // Remove undefined fields so we only update provided values
        Object.keys(update).forEach(key => update[key] === undefined && delete update[key]);
        await db.Resident.findByIdAndUpdate(id, update);
        return res.status(200).json({ message: 'Resident updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})

// delete
ViewsRouter.delete('/resident/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.Resident.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Resident deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})
module.exports = ViewsRouter;

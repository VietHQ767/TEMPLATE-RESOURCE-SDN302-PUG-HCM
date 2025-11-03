


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
        const newYOB = now - Number(yOB);
        const resident = new db.Resident({ residentName, residentDescription, floor, yOB: newYOB, isOwned, apartment: apartmentId });
        await resident.save();
        return res.redirect('/views/resident');
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
            residentName: residentName,
            residentDescription: residentDescription,
            floor: floor,
            yOB: yOB,
            isOwned: Boolean(isOwned),
            apartment: apartmentId
        }
        if (yOB) {
            const now = new Date().getFullYear(); // để lấy năm hiện tại
            update.yOB = now - Number(age); // để lấy tuổi hiện tại
        }
        await db.Resident.findByIdAndUpdate(id, update);
        return res.status(200).json({ message: 'Resident updated successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
})
module.exports = ViewsRouter;

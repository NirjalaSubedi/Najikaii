const express = require('express');
const router = express.Router();
const {getNearbyShops} = require('../Controllers/authcontrollers');
const {viewAllShops} = require('../Controllers/shopcontrollers');

router.get('/getNearbyShops', getNearbyShops);
router.get('/viewallshops',viewAllShops);


router.post('/save-location', (req, res) => {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
        return res.status(400).json({ message: "Coordinates missing!" });
    }
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
        return res.status(400).json({ message: "Invalid coordinate format!" });
    }
    console.log(`[Najikai] Received Coordinates: ${latitude}, ${longitude}`);
    res.status(200).json({ 
        message: "Location synchronized with shop system",
        nearByShops: []
    });

});

module.exports = router;
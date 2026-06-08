const express = require('express');
const router = express.Router();
const {getNearbyShops} = require('../Controllers/authcontrollers');
const {viewAllShops,getAllShopsForAdmin,getShopDetails} = require('../Controllers/shopcontrollers');
const { authmiddlewares } = require('../middlewares/authmiddlewares');

router.get('/getNearbyShops', getNearbyShops);
router.get('/viewallshops',viewAllShops);
router.get('/getAllShopsForAdmin',authmiddlewares,getAllShopsForAdmin);
router.get('/myshop/:id',getShopDetails);

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
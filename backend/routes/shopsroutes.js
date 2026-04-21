const express = require('express');
const router = express.Router();
const {getNearbyShops} = require('../Controllers/authcontrollers');

router.get('/getNearbyShops', getNearbyShops);

module.exports = router;
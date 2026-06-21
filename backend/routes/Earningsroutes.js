const express = require('express');
const router = express.Router();

const { getVendorEarningsStats } = require('../Controllers/EarnningsControllers');
const {authmiddlewares,authorizeRoles}= require('../middlewares/authmiddlewares');

router.get('/stats',authmiddlewares , getVendorEarningsStats);
module.exports = router;